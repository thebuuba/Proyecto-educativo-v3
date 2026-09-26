import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common'

export type SupabaseAuthUser = {
  id: string
  email?: string
  app_metadata?: { provider?: string }
}

/** Verifica la sesión con Auth; también funciona antes de crear el perfil docente. */
export async function getSupabaseUserFromToken(token: string): Promise<SupabaseAuthUser> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const authKey = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !authKey) throw new InternalServerErrorException('Supabase Auth is not configured on the server')
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: authKey, Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new UnauthorizedException('Invalid Supabase session')
  const body = await response.json() as SupabaseAuthUser
  if (!body.id) throw new UnauthorizedException('Invalid Supabase session')
  return body
}
