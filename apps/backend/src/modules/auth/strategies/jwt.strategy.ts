/**
 * Estrategia de autenticación JWT para Passport.
 * Extrae y valida el token JWT de la cookie de sesión HttpOnly,
 * verifica que el usuario exista y esté activo, y carga sus roles.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getJwtSecret } from '../../../config/jwt-secret'
import { prisma } from '@aula/database'
import { AuthenticatedUser } from '../types/authenticated-user'
import { getSessionToken } from '../session-cookie'

/** Payload decodificado del token JWT. */
interface JwtPayload {
  /** ID del usuario (subject). */
  sub: string
  /** Correo electrónico del usuario. */
  email: string
  /** Versión del token para revocación. */
  tokenVersion: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => getSessionToken(request)]),
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
    const user = await prisma.appUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        schoolId: true,
        status: true,
        tokenVersion: true,
        userRoles: {
          where: { status: 'ACTIVE' },
          select: { schoolId: true, role: { select: { key: true, status: true } } },
        },
      },
    })
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException()
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token revoked')
    }

    return {
      id: user.id,
      email: user.email,
      schoolId: user.schoolId,
      roles: user.userRoles
        .filter(({ schoolId, role }) => schoolId === user.schoolId && role.status === 'ACTIVE')
        .map(({ role }) => role.key),
    }
  }
}
