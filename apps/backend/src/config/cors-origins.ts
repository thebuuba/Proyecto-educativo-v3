export type CorsOriginConfig = {
  frontendUrl?: string
}

export function isAllowedOrigin(origin: string, config: CorsOriginConfig): boolean {
  return origin === (config.frontendUrl ?? 'http://localhost:5173')
}
