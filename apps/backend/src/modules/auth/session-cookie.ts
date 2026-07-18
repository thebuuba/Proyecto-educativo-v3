import type { CookieOptions, Request, Response } from 'express'

export const SESSION_COOKIE_NAME = 'aulabase_session'
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000

export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.cookie
  if (!cookieHeader) return null
  for (const cookie of cookieHeader.split(';')) {
    const [name, ...valueParts] = cookie.trim().split('=')
    if (name === SESSION_COOKIE_NAME) {
      const value = valueParts.join('=')
      return value ? decodeURIComponent(value) : null
    }
  }
  return null
}

function cookieOptions(rememberSession = false): CookieOptions {
  const secure = process.env.NODE_ENV === 'production'
    || process.env.CLOUDFLARE_WORKER_PRODUCTION === 'true'
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    ...(rememberSession ? { maxAge: SESSION_MAX_AGE_MS } : {}),
  }
}

export function setSessionCookie(response: Response, token: string, rememberSession = false) {
  response.cookie(SESSION_COOKIE_NAME, token, cookieOptions(rememberSession))
  response.setHeader('Cache-Control', 'private, no-store')
}

export function clearSessionCookie(response: Response) {
  const { maxAge: _maxAge, ...options } = cookieOptions()
  response.clearCookie(SESSION_COOKIE_NAME, options)
  response.setHeader('Cache-Control', 'private, no-store')
}
