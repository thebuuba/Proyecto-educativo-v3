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

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Render and Vercel are cross-site in production, so the browser requires
    // SameSite=None together with Secure. Local development remains same-site.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS,
  }
}

export function setSessionCookie(response: Response, token: string) {
  response.cookie(SESSION_COOKIE_NAME, token, cookieOptions())
  response.setHeader('Cache-Control', 'private, no-store')
}

export function clearSessionCookie(response: Response) {
  const { maxAge: _maxAge, ...options } = cookieOptions()
  response.clearCookie(SESSION_COOKIE_NAME, options)
  response.setHeader('Cache-Control', 'private, no-store')
}
