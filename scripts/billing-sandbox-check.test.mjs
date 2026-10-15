import test from 'node:test'
import assert from 'node:assert/strict'
import {
  REQUIRED_EVENTS,
  parseArgs,
  validateEnv,
  validateOptions,
  isSandboxApiKey,
  isLiveApiKey,
  isClientToken,
  isWebhookUrl,
  validatePrice,
  findWebhookEndpoint,
  validateWebhook,
  fetchJson,
  run,
} from './billing-sandbox-check.mjs'

const SANDBOX_KEY = 'pdl_sdbx_apikey_TESTONLY_000000000000000000000'
const LIVE_KEY = 'pdl_live_apikey_01abc'
const CLIENT_TOKEN = `test_${'b'.repeat(27)}`
const PRICE_ID = `pri_${'a'.repeat(26)}`
const WEBHOOK_URL = 'https://aula.example.com/api/v1/billing/webhooks/paddle'
const baseEnv = () => ({
  PADDLE_SANDBOX_API_KEY: SANDBOX_KEY,
  PADDLE_SANDBOX_WEBHOOK_SECRET: 'whsec_test',
  PADDLE_SANDBOX_CLIENT_TOKEN: CLIENT_TOKEN,
  BILLING_ENVIRONMENT: 'sandbox',
  BILLING_TERMS_VERSION: '2026-01-01',
  FRONTEND_URL: 'https://staging.example.invalid',
})
const baseOptions = () => ({ online: false, price: PRICE_ID, amount: '799', currency: 'USD', webhookUrl: WEBHOOK_URL })
const collect = () => { const lines = []; return { log: (line) => lines.push(String(line)), lines } }

test('identificadores sandbox reconocen formato real y rechazan live', () => {
  assert.equal(isSandboxApiKey(SANDBOX_KEY), true)
  assert.equal(isSandboxApiKey(LIVE_KEY), false)
  assert.equal(isLiveApiKey(LIVE_KEY), true)
  assert.equal(isClientToken(CLIENT_TOKEN), true)
  assert.equal(isClientToken(`test_${'b'.repeat(26)}`), false)
  assert.equal(isClientToken(`live_${'b'.repeat(27)}`), false)
  assert.equal(isWebhookUrl(WEBHOOK_URL), true)
  assert.equal(isWebhookUrl('http://aula.example.com/api/v1/billing/webhooks/paddle'), false)
  assert.equal(isWebhookUrl('https://aula.example.com/otra/ruta'), false)
})

test('parseArgs acepta flags conocidos y reporta desconocidos y valores ausentes', () => {
  const parsed = parseArgs(['--online', '--price', PRICE_ID, '--amount', '799', '--currency', 'USD', '--webhook-url', WEBHOOK_URL])
  assert.deepEqual(parsed.errors, [])
  assert.equal(parsed.values.online, true)
  assert.equal(parsed.values.price, PRICE_ID)
  assert.equal(parsed.values.webhookUrl, WEBHOOK_URL)
  assert.deepEqual(parseArgs(['--price']).errors, ['missing_value:--price'])
  assert.deepEqual(parseArgs(['--nope']).errors, ['unknown_arg'])
})

test('validateEnv exige configuración sandbox y rechaza claves live', () => {
  assert.deepEqual(validateEnv(baseEnv()), [])
  assert.ok(validateEnv({ ...baseEnv(), PADDLE_SANDBOX_API_KEY: LIVE_KEY }).includes('live_api_key_rejected'))
  assert.ok(validateEnv({ ...baseEnv(), PADDLE_SANDBOX_API_KEY: 'pdl_live_apikey_X' }).includes('live_api_key_rejected'))
  assert.ok(validateEnv({ ...baseEnv(), PADDLE_SANDBOX_CLIENT_TOKEN: `live_${'b'.repeat(27)}` }).includes('live_client_token_rejected'))
  assert.ok(validateEnv({ ...baseEnv(), BILLING_ENVIRONMENT: 'production' }).includes('invalid_billing_environment'))
  assert.ok(validateEnv({ ...baseEnv(), BILLING_TERMS_VERSION: '' }).includes('missing_terms_version'))
  assert.ok(validateEnv({ ...baseEnv(), FRONTEND_URL: 'https://user:secret@staging.example.invalid' }).includes('invalid_frontend_origin'))
  assert.ok(validateEnv({ ...baseEnv(), FRONTEND_URL: 'http://remote.example.invalid' }).includes('invalid_frontend_origin'))
  assert.deepEqual(validateEnv({ ...baseEnv(), FRONTEND_URL: 'http://localhost:5173' }), [])
})

test('validateOptions exige price, amount, currency y url de webhook válidos', () => {
  assert.deepEqual(validateOptions(baseOptions()), [])
  assert.ok(validateOptions({ ...baseOptions(), price: 'pri_corto' }).includes('invalid_price_id'))
  assert.ok(validateOptions({ ...baseOptions(), amount: '0' }).includes('invalid_amount'))
  assert.ok(validateOptions({ ...baseOptions(), amount: '1.5' }).includes('invalid_amount'))
  assert.ok(validateOptions({ ...baseOptions(), amount: String(Number.MAX_SAFE_INTEGER + 2) }).includes('invalid_amount'))
  assert.ok(validateOptions({ ...baseOptions(), currency: 'usd' }).includes('invalid_currency'))
  assert.ok(validateOptions({ ...baseOptions(), webhookUrl: 'https://aula.example.com/nope' }).includes('invalid_webhook_url'))
})

test('validatePrice exige un mes gratis con tarjeta y rechaza pruebas sin tarjeta', () => {
  const good = { status: 'active', unit_price: { amount: '799', currency_code: 'USD' }, billing_cycle: { interval: 'month', frequency: 1 }, trial_period: { interval: 'month', frequency: 1, requires_payment_method: true, unit_price: null }, tax_mode: 'internal', unit_price_overrides: [] }
  const approved = { ...good, trial_period: { interval: 'month', frequency: 1, requires_payment_method: true, unit_price: null } }
  assert.deepEqual(validatePrice(approved, { amount: '799', currency: 'USD' }), [])
  assert.ok(validatePrice({ ...good, trial_period: null }, { amount: '799', currency: 'USD' }).includes('price_trial_policy_mismatch'))
  for (const trial_period of [
    { ...approved.trial_period, requires_payment_method: false },
    { ...approved.trial_period, interval: 'day', frequency: 30 },
    { ...approved.trial_period, unit_price: { amount: '1', currency_code: 'USD' } },
    { ...approved.trial_period, unit_price_overrides: [{ country_codes: ['DO'], unit_price: { amount: '100', currency_code: 'USD' } }] },
  ]) assert.ok(validatePrice({ ...approved, trial_period }, { amount: '799', currency: 'USD' }).includes('price_trial_policy_mismatch'))
  assert.ok(validatePrice({ ...good, status: 'archived' }, { amount: '799', currency: 'USD' }).includes('price_not_active'))
  assert.ok(validatePrice({ ...good, unit_price: { amount: '2000', currency_code: 'USD' } }, { amount: '799', currency: 'USD' }).includes('price_amount_mismatch'))
  assert.ok(validatePrice({ ...good, billing_cycle: { interval: 'year', frequency: 1 } }, { amount: '799', currency: 'USD' }).includes('price_cycle_mismatch'))
  assert.ok(REQUIRED_EVENTS.includes('subscription.trialing'))
})

test('validateWebhook exige endpoint activo, url, tráfico platform/all y todos los eventos', () => {
  const endpoint = { type: 'url', destination: WEBHOOK_URL, active: true, traffic_source: 'platform', subscribed_events: [...REQUIRED_EVENTS] }
  assert.deepEqual(validateWebhook(endpoint), [])
  assert.deepEqual(validateWebhook(null), ['webhook_not_found'])
  assert.ok(validateWebhook({ ...endpoint, active: false }).includes('webhook_inactive'))
  assert.ok(validateWebhook({ ...endpoint, traffic_source: 'url' }).includes('webhook_traffic_source'))
  assert.ok(validateWebhook({ ...endpoint, subscribed_events: REQUIRED_EVENTS.slice(1) }).includes('webhook_missing_events'))
  assert.equal(findWebhookEndpoint({ data: [endpoint] }, WEBHOOK_URL), endpoint)
  assert.equal(findWebhookEndpoint({ data: [{ ...endpoint, destination: 'https://otro.example.com' }] }, WEBHOOK_URL), null)
})

test('fetchJson sólo hace GET y no filtra secretos ni URLs ajenas en el error', async () => {
  const calls = []
  const fetchImpl = async (url, init) => { calls.push({ url, init }); return { ok: false, status: 403, json: async () => ({}) } }
  assert.deepEqual(await fetchJson('https://sandbox-api.paddle.com/prices/x', { apiKey: 'secret-value', fetchImpl }), { error: 'http_403' })
  assert.equal(calls[0].init.method, 'GET')
  assert.equal(calls[0].init.redirect, 'error')
  assert.equal(calls[0].init.headers.Authorization, 'Bearer secret-value')
  const boom = Object.assign(new Error('filtrado https://evil.example.com?token=SECRET'), { name: 'TypeError' })
  const failed = await fetchJson('https://sandbox-api.paddle.com/x', { apiKey: 'secret-value', fetchImpl: async () => { throw boom } })
  assert.deepEqual(failed, { error: 'network_error' })
  assert.ok(!JSON.stringify(failed).includes('SECRET'))
  assert.ok(!JSON.stringify(failed).includes('evil'))
})

test('run offline valida sin tocar la red y nunca imprime el valor de un secreto', async () => {
  let called = false
  const { log, lines } = collect()
  const result = await run({ env: baseEnv(), argv: ['--price', PRICE_ID, '--amount', '799', '--currency', 'USD', '--webhook-url', WEBHOOK_URL], fetchImpl: async () => { called = true; throw new Error('no debe llamarse') }, log })
  assert.equal(result.ok, true)
  assert.equal(result.online, false)
  assert.equal(called, false)
  assert.ok(!lines.join('\n').includes(SANDBOX_KEY))
})

test('run online sólo hace los GET de precio y notification-settings y no finge checkout', async () => {
  const priceBody = { data: { id: PRICE_ID, status: 'active', unit_price: { amount: '799', currency_code: 'USD' }, billing_cycle: { interval: 'month', frequency: 1 }, trial_period: { interval: 'month', frequency: 1, requires_payment_method: true, unit_price: null }, tax_mode: 'internal', unit_price_overrides: [] } }
  const settingsBody = { data: [{ type: 'url', destination: WEBHOOK_URL, active: true, traffic_source: 'platform',
    endpoint_secret_key: baseEnv().PADDLE_SANDBOX_WEBHOOK_SECRET, subscribed_events: REQUIRED_EVENTS.map(name => ({name})) }] }
  const calls = []
  const fetchImpl = async (url, init) => {
    calls.push({ url, init })
    return { ok: true, status: 200, json: async () => (url.includes('/prices/') ? priceBody : settingsBody) }
  }
  const { log, lines } = collect()
  const result = await run({ env: baseEnv(), argv: ['--online', '--price', PRICE_ID, '--amount', '799', '--currency', 'USD', '--webhook-url', WEBHOOK_URL], fetchImpl, log })
  assert.equal(result.ok, true)
  assert.equal(calls.length, 2)
  assert.ok(calls.every((call) => call.init.method === 'GET'))
  assert.ok(calls.some((call) => call.url.includes(`/prices/${PRICE_ID}`)))
  assert.ok(calls.some((call) => call.url.includes('/notification-settings?per_page=200')))
  assert.ok(/no se comprobó la firma/i.test(lines.join('\n')))
})

test('verifica secreto, fiscalidad fija y rechaza argumentos que podrían exponer claves', async () => {
  const price = {status:'active',unit_price:{amount:'799',currency_code:'USD'},billing_cycle:{interval:'month',frequency:1},trial_period:null,tax_mode:'external',unit_price_overrides:[]}
  assert.ok(validatePrice(price,{amount:'799',currency:'USD'}).includes('price_tax_mode_unsupported'))
  assert.ok(validatePrice({...price,tax_mode:'internal',unit_price_overrides:[{}]},{amount:'799',currency:'USD'}).includes('price_overrides_unsupported'))
  const endpoint = {type:'url',active:true,traffic_source:'all',subscribed_events:REQUIRED_EVENTS.map(name=>({name})),endpoint_secret_key:'different'}
  assert.ok(validateWebhook(endpoint,'expected-secret').includes('webhook_secret_mismatch'))
  const {log,lines}=collect()
  await run({env:{},argv:['sensitive-argument-value'],log})
  assert.ok(!lines.join('\n').includes('sensitive-argument-value'))
  assert.equal(isWebhookUrl('https://user:password@aula.example.com/api/v1/billing/webhooks/paddle'),false)
})

test('run online rechaza claves live antes de cualquier llamada de red', async () => {
  let called = false
  const { log } = collect()
  const result = await run({ env: { ...baseEnv(), PADDLE_SANDBOX_API_KEY: LIVE_KEY }, argv: ['--online', '--price', PRICE_ID, '--amount', '799', '--currency', 'USD', '--webhook-url', WEBHOOK_URL], fetchImpl: async () => { called = true; throw new Error('no debe llamarse') }, log })
  assert.equal(result.ok, false)
  assert.equal(called, false)
  assert.ok(result.errors.includes('live_api_key_rejected'))
})
