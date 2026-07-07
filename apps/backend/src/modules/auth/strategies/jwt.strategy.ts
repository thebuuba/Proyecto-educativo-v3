/**
 * Estrategia de autenticación JWT para Passport.
 * Extrae y valida el token JWT del encabezado Authorization,
 * verifica que el usuario exista y esté activo, y carga sus roles.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getJwtSecret } from '../../../config/jwt-secret'
import { prisma } from '@aula/database'
import { AuthenticatedUser } from '../types/authenticated-user'

/** Payload decodificado del token JWT. */
interface JwtPayload {
  /** ID del usuario (subject). */
  sub: string
  /** Correo electrónico del usuario. */
  email: string
  /** Versión del token para revocación. */
  tokenVersion: number
}

const authUserCache = new Map<
  string,
  { user?: AuthenticatedUser; promise?: Promise<AuthenticatedUser>; expiry: number }
>()
const AUTH_USER_CACHE_TTL = 5_000

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(config.get<string>('JWT_SECRET')),
    })
  }

  /**
   * Valida el payload del JWT y retorna el usuario autenticado.
   * Busca al usuario por ID, verifica que esté activo y obtiene sus roles.
   *
   * @param payload - Payload decodificado del token.
   * @returns Usuario autenticado con id, email, schoolId y roles.
   * @throws UnauthorizedException si el usuario no existe o no está activo.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const cacheKey = `${payload.sub}:${payload.tokenVersion}`
    const cached = authUserCache.get(cacheKey)
    if (cached && cached.expiry > Date.now()) {
      if (cached.promise) return cached.promise
      if (cached.user) return cached.user
    }

    const promise = this.loadAuthenticatedUser(payload, cacheKey)
    authUserCache.set(cacheKey, {
      promise,
      expiry: Date.now() + AUTH_USER_CACHE_TTL,
    })
    return promise
  }

  private async loadAuthenticatedUser(payload: JwtPayload, cacheKey: string) {
    try {
      const user = await prisma.appUser.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          schoolId: true,
          status: true,
          tokenVersion: true,
        },
      })
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException()
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException('Token revoked')
      }

      const userRoles = await prisma.userRole.findMany({
        where: {
          userId: user.id,
          schoolId: user.schoolId,
          status: 'ACTIVE',
        },
      })
      const roleIds = userRoles.map((userRole) => userRole.roleId)
      const roles = roleIds.length
        ? await prisma.role.findMany({
            where: { id: { in: roleIds }, status: 'ACTIVE' },
            select: { key: true },
          })
        : []

      const authenticatedUser = {
        id: user.id,
        email: user.email,
        schoolId: user.schoolId,
        roles: roles.map((role) => role.key),
      }
      authUserCache.set(cacheKey, {
        user: authenticatedUser,
        expiry: Date.now() + AUTH_USER_CACHE_TTL,
      })
      return authenticatedUser
    } catch (error) {
      if (authUserCache.get(cacheKey)?.promise) authUserCache.delete(cacheKey)
      throw error
    }
  }
}
