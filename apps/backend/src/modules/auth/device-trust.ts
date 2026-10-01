import { createHash, createHmac, randomBytes } from 'node:crypto'
import type { Request, Response } from 'express'
import { ConflictException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import { prisma } from '@aula/database'

const DEVICE_COOKIE = 'aulabase_device'
const DEVICE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000
const VERIFICATION_WINDOW_SECONDS = 10 * 60

type AuthMethod = { method: string; timestamp: number }
export type VerificationMethod = 'allow' | 'email' | 'totp'

export function isDeviceTrustEnabled() {
  return process.env.AUTH_DEVICE_TRUST_ENABLED === 'true'
}

export function decideDeviceVerification(input: {
  trusted: boolean
  browserChanged: boolean
  networkChanged: boolean
  hasTotp: boolean
  aal: string
  amr: AuthMethod[]
  now: number
}): VerificationMethod {
  if (input.trusted && !(input.browserChanged && input.networkChanged)) return 'allow'
  const recent = (method: string) => input.amr.some((entry) =>
    entry.method === method && entry.timestamp <= input.now
    && entry.timestamp >= input.now - VERIFICATION_WINDOW_SECONDS)
  if (input.hasTotp) return input.aal === 'aal2' && recent('totp') ? 'allow' : 'totp'
  return recent('magiclink') || recent('otp') || recent('email/signup') ? 'allow' : 'email'
}

function readCookie(request: Request, name: string): string | null {
  const pair = request.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return pair ? pair.slice(name.length + 1) : null
}

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function browserSignature(request: Request) {
  const ua = request.get('user-agent') ?? ''
  const browser = /Edg\//.test(ua) ? 'edge' : /Firefox\//.test(ua) ? 'firefox'
    : /Chrome\//.test(ua) ? 'chrome' : /Safari\//.test(ua) ? 'safari' : 'other'
  const os = /Android/.test(ua) ? 'android' : /iPhone|iPad/.test(ua) ? 'ios'
    : /Windows/.test(ua) ? 'windows' : /Mac OS/.test(ua) ? 'macos'
      : /Linux/.test(ua) ? 'linux' : 'other'
  return `${browser}:${os}`
}

function networkHash(request: Request): string | null {
  const ip = process.env.CLOUDFLARE_WORKER_PRODUCTION === 'true'
    ? request.get('cf-connecting-ip')
    : request.ip
  const secret = process.env.JWT_SECRET
  return ip && secret ? createHmac('sha256', secret).update(ip).digest('hex') : null
}

function verifiedClaims(token: string, userId: string) {
  let payload: { sub?: string; session_id?: string; aal?: string; amr?: AuthMethod[] }
  try {
    payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString())
  } catch {
    throw new UnauthorizedException('Invalid Supabase session')
  }
  if (payload.sub !== userId || !payload.session_id) throw new UnauthorizedException('Invalid Supabase session')
  return payload
}

/** Evita crear datos de onboarding antes de confirmar un inicio reciente. */
export function requireRecentOnboardingProof(token: string, authUserId: string) {
  const claims = verifiedClaims(token, authUserId)
  const now = Math.floor(Date.now() / 1000)
  const recent = (claims.amr ?? []).some((entry) =>
    ['email/signup', 'magiclink', 'otp', 'totp'].includes(entry.method)
    && entry.timestamp <= now && entry.timestamp >= now - VERIFICATION_WINDOW_SECONDS)
  if (!recent) throw new ConflictException({ message: 'VERIFICATION_REQUIRED', code: 'VERIFICATION_REQUIRED', method: 'email' })
}

async function hasVerifiedTotp(authUserId: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new ServiceUnavailableException('Supabase Auth is not configured')
  const response = await fetch(`${url}/auth/v1/admin/users/${authUserId}/factors`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  if (!response.ok) throw new ServiceUnavailableException('No se pudo consultar la verificación de la cuenta.')
  const factors = await response.json() as Array<{ factor_type?: string; status?: string }>
  return factors.some((factor) => factor.factor_type === 'totp' && factor.status === 'verified')
}

/** Llamar solo después de validar el token con Supabase Auth. */
export async function requireTrustedDevice(request: Request, response: Response, userId: string, authUserId: string, token: string) {
  const raw = readCookie(request, DEVICE_COOKIE)
  const device = raw && /^[a-f0-9]{64}$/.test(raw)
    ? await prisma.trustedAuthDevice.findUnique({ where: { tokenHash: hash(raw) } })
    : null
  const trusted = Boolean(device && device.userId === userId && !device.revokedAt)
  const browser = browserSignature(request)
  const network = networkHash(request)
  const claims = verifiedClaims(token, authUserId)
  const browserChanged = Boolean(device && device.browserSignature !== browser)
  const networkChanged = Boolean(device?.networkHash && network && device.networkHash !== network)
  const method = decideDeviceVerification({
    trusted,
    browserChanged,
    networkChanged,
    hasTotp: !trusted || (browserChanged && networkChanged) ? await hasVerifiedTotp(authUserId) : false,
    aal: claims.aal ?? 'aal1',
    amr: Array.isArray(claims.amr) ? claims.amr : [],
    now: Math.floor(Date.now() / 1000),
  })
  if (method !== 'allow') throw new ConflictException({ message: 'VERIFICATION_REQUIRED', code: 'VERIFICATION_REQUIRED', method })

  if (trusted && device) {
    await prisma.trustedAuthDevice.update({ where: { id: device.id }, data: { browserSignature: browser, networkHash: network, lastSeenAt: new Date() } })
  } else {
    const value = randomBytes(32).toString('hex')
    await prisma.trustedAuthDevice.create({ data: { userId, tokenHash: hash(value), browserSignature: browser, networkHash: network } })
    response.cookie(DEVICE_COOKIE, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.CLOUDFLARE_WORKER_PRODUCTION === 'true',
      sameSite: 'lax',
      path: '/',
      maxAge: DEVICE_MAX_AGE_MS,
    })
  }
}
