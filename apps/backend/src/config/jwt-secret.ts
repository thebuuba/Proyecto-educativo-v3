export function getJwtSecret(secret = process.env.JWT_SECRET): string {
  if (!secret) {
    throw new Error('JWT_SECRET is required')
  }
  return secret
}
