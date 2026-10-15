#!/usr/bin/env node
// Read-only Paddle Sandbox preflight. No dependencies, no database, no writes and
// no mutations: without --online it only inspects the environment, and with
// --online the only network calls are two explicit GET reads against the sandbox.
import { pathToFileURL } from 'node:url'

export const PADDLE_SANDBOX_API_BASE = 'https://sandbox-api.paddle.com'
export const WEBHOOK_PATH = '/api/v1/billing/webhooks/paddle'
// Events dispatched by apps/backend/src/modules/billing/billing-events.service.ts.
export const REQUIRED_EVENTS = [
  'transaction.completed',
  'transaction.payment_failed',
  'adjustment.created',
  'adjustment.updated',
  'subscription.created',
  'subscription.trialing',
  'subscription.updated',
  'subscription.activated',
  'subscription.canceled',
  'subscription.past_due',
  'subscription.paused',
  'subscription.resumed',
]

const PRICE_ID = /^pri_[a-z0-9]{26}$/
const CURRENCY = /^[A-Z]{3}$/
const CLIENT_TOKEN = /^test_[A-Za-z0-9]{27}$/
const SANDBOX_KEY_PREFIX = 'pdl_sdbx_apikey_'
const LIVE_KEY_PREFIX = 'pdl_live_apikey_'

export const isSandboxApiKey = (key) =>
  typeof key === 'string' && key.startsWith(SANDBOX_KEY_PREFIX) && key.length > SANDBOX_KEY_PREFIX.length
export const isLiveApiKey = (key) => typeof key === 'string' && key.startsWith(LIVE_KEY_PREFIX)
export const isClientToken = (token) => typeof token === 'string' && CLIENT_TOKEN.test(token)
export const isLiveClientToken = (token) => typeof token === 'string' && token.startsWith('live_')

export const isWebhookUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.pathname === WEBHOOK_PATH && !url.search && !url.hash && !url.username && !url.password && !url.port
  } catch {
    return false
  }
}

export function parseArgs(argv = []) {
  const values = { online: false }
  const errors = []
  const valueFlags = new Set(['--price', '--amount', '--currency', '--webhook-url'])
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--online') { values.online = true; continue }
    if (!valueFlags.has(arg)) { errors.push('unknown_arg'); continue }
    const value = argv[i + 1]
    if (value === undefined || value.startsWith('--')) { errors.push(`missing_value:${arg}`); continue }
    i += 1
    values[arg.slice(2).replace(/-(.)/g, (_, char) => char.toUpperCase())] = value
  }
  return { values, errors }
}

export function validateEnv(env = {}) {
  const errors = []
  const key = env.PADDLE_SANDBOX_API_KEY
  if (!key) errors.push('missing_api_key')
  else if (isLiveApiKey(key)) errors.push('live_api_key_rejected')
  else if (!isSandboxApiKey(key)) errors.push('invalid_api_key_prefix')
  if (!env.PADDLE_SANDBOX_WEBHOOK_SECRET) errors.push('missing_webhook_secret')
  const token = env.PADDLE_SANDBOX_CLIENT_TOKEN
  if (!token) errors.push('missing_client_token')
  else if (isLiveClientToken(token)) errors.push('live_client_token_rejected')
  else if (!isClientToken(token)) errors.push('invalid_client_token')
  if (env.BILLING_ENVIRONMENT !== 'sandbox') errors.push('invalid_billing_environment')
  if (!env.BILLING_TERMS_VERSION) errors.push('missing_terms_version')
  try {
    const origin = new URL(env.FRONTEND_URL ?? '')
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)
    if ((origin.protocol !== 'https:' && !(local && origin.protocol === 'http:')) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
      errors.push('invalid_frontend_origin')
    }
  } catch { errors.push('invalid_frontend_origin') }
  return errors
}

export function validateOptions(values = {}) {
  const errors = []
  if (!PRICE_ID.test(values.price ?? '')) errors.push('invalid_price_id')
  const rawAmount = String(values.amount ?? '')
  const amount = Number(rawAmount)
  if (!/^\d+$/.test(rawAmount) || !Number.isSafeInteger(amount) || amount <= 0) errors.push('invalid_amount')
  if (!CURRENCY.test(values.currency ?? '')) errors.push('invalid_currency')
  if (!isWebhookUrl(values.webhookUrl)) errors.push('invalid_webhook_url')
  return errors
}

export function validatePrice(price, expected = {}) {
  if (!price || typeof price !== 'object') return ['price_missing']
  const errors = []
  if (price.status !== 'active') errors.push('price_not_active')
  if (String(price.unit_price?.amount ?? '') !== String(expected.amount)) errors.push('price_amount_mismatch')
  if (price.unit_price?.currency_code !== expected.currency) errors.push('price_currency_mismatch')
  if (price.billing_cycle?.interval !== 'month' || price.billing_cycle?.frequency !== 1) errors.push('price_cycle_mismatch')
  const trial = price.trial_period
  if (trial?.interval !== 'month' || trial.frequency !== 1 || trial.requires_payment_method !== true || trial.unit_price !== null || (trial.unit_price_overrides?.length ?? 0) !== 0) errors.push('price_trial_policy_mismatch')
  if (price.tax_mode !== 'internal') errors.push('price_tax_mode_unsupported')
  if (!Array.isArray(price.unit_price_overrides) || price.unit_price_overrides.length) errors.push('price_overrides_unsupported')
  if (expected.price && price.id !== expected.price) errors.push('price_identity_mismatch')
  return errors
}

const includes = (list, value) => Array.isArray(list) && list.includes(value)

export function findWebhookEndpoint(payload, webhookUrl) {
  const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []
  return list.find((item) => item?.type === 'url' && item?.destination === webhookUrl) ?? null
}

export function validateWebhook(endpoint, expectedSecret) {
  if (!endpoint) return ['webhook_not_found']
  const errors = []
  if (endpoint.active !== true) errors.push('webhook_inactive')
  if (endpoint.type !== 'url') errors.push('webhook_not_url')
  if (!['platform', 'all'].includes(endpoint.traffic_source)) errors.push('webhook_traffic_source')
  const events = Array.isArray(endpoint.subscribed_events) ? endpoint.subscribed_events.map(event => typeof event === 'string' ? event : event?.name) : []
  if (!REQUIRED_EVENTS.every((event) => includes(events, event))) errors.push('webhook_missing_events')
  if (expectedSecret && endpoint.endpoint_secret_key !== expectedSecret) errors.push('webhook_secret_mismatch')
  return errors
}

// Maps any thrown value to a stable code: never echoes bodies, tokens or foreign URLs.
const safeError = (error) => {
  const name = typeof error?.name === 'string' ? error.name : ''
  if (name === 'AbortError') return 'timeout'
  if (name === 'TypeError') return 'network_error'
  return 'request_failed'
}

export async function fetchJson(url, { apiKey, fetchImpl = fetch, timeoutMs = 10_000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'error',
      signal: controller.signal,
      headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}`, 'Paddle-Version': '1' },
    })
    if (!response?.ok) return { error: `http_${response?.status ?? 'unknown'}` }
    return { body: await response.json() }
  } catch (error) {
    return { error: safeError(error) }
  } finally {
    clearTimeout(timer)
  }
}

const fail = (log, online, errors) => {
  const unique = [...new Set(errors)]
  log(`FALLO remoto: ${unique.join(', ')}`)
  return { ok: false, online, errors: unique }
}

export async function run({ env = process.env, argv = [], fetchImpl = fetch, log = console.log } = {}) {
  const { values, errors: argErrors } = parseArgs(argv)
  const errors = [...new Set([...argErrors, ...validateEnv(env), ...validateOptions(values)])]
  if (errors.length) {
    log(`FALLO configuración: ${errors.join(', ')}`)
    return { ok: false, online: values.online, errors }
  }
  if (!values.online) {
    log('OK configuración sandbox (offline): formatos de credenciales y parámetros válidos.')
    log('Esta comprobación NO verifica checkout, recepción real de webhooks ni firma.')
    return { ok: true, online: false, errors: [] }
  }
  const apiKey = env.PADDLE_SANDBOX_API_KEY
  const priceRead = await fetchJson(`${PADDLE_SANDBOX_API_BASE}/prices/${values.price}`, { apiKey, fetchImpl })
  if (priceRead.error) return fail(log, true, [`price_request:${priceRead.error}`])
  const settingsRead = await fetchJson(`${PADDLE_SANDBOX_API_BASE}/notification-settings?per_page=200`, { apiKey, fetchImpl })
  if (settingsRead.error) return fail(log, true, [`webhook_request:${settingsRead.error}`])
  const onlineErrors = [
    ...validatePrice(priceRead.body?.data, values),
    ...validateWebhook(findWebhookEndpoint(settingsRead.body, values.webhookUrl), env.PADDLE_SANDBOX_WEBHOOK_SECRET),
  ]
  if (onlineErrors.length) return fail(log, true, onlineErrors)
  log('PASS online: precio y endpoint de webhook verificados por GET de sólo lectura.')
  log('No se ejecutó checkout, no se recibió ningún webhook real y no se comprobó la firma.')
  return { ok: true, online: true, errors: [] }
}

const entry = process.argv[1]
if (entry && import.meta.url === pathToFileURL(entry).href) {
  run({ argv: process.argv.slice(2) })
    .then((result) => { if (!result.ok) process.exitCode = 1 })
    .catch((error) => { console.error(`FALLO inesperado: ${safeError(error)}`); process.exitCode = 1 })
}
