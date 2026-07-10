export type CorsOriginConfig = {
  frontendUrl?: string
  vercelProjectSlug?: string
  vercelTeamSlug?: string
}

export function isAllowedOrigin(origin: string, config: CorsOriginConfig): boolean {
  const configuredOrigin = config.frontendUrl ?? 'http://localhost:5173'
  if (origin === configuredOrigin) return true

  const { vercelProjectSlug, vercelTeamSlug } = config
  if (!vercelProjectSlug || !vercelTeamSlug) return false

  try {
    const url = new URL(origin)
    if (url.protocol !== 'https:' || url.port || url.pathname !== '/' || url.search || url.hash) {
      return false
    }

    const previewPrefix = `${vercelProjectSlug}-`
    const previewSuffix = `-${vercelTeamSlug}.vercel.app`
    return url.hostname.startsWith(previewPrefix)
      && url.hostname.endsWith(previewSuffix)
      && url.hostname.length > previewPrefix.length + previewSuffix.length
  } catch {
    return false
  }
}
