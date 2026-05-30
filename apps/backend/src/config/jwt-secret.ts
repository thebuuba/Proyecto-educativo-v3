export function getJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  if (process.env.RAILWAY_ENVIRONMENT) {
    throw new Error('JWT_SECRET is required in production')
  }
  return 'aula-base-dev-secret'
}
