export function getOAuthCallbackUrl(origin: string) {
  return `${origin.replace(/\/$/, '')}/auth/callback`
}

export function getOAuthCallbackPath(pathname: string, search: string, hash: string) {
  if (pathname !== '/auth/callback' && new URLSearchParams(search).has('code')) {
    return `/auth/callback${search}${hash}`
  }
  return null
}
