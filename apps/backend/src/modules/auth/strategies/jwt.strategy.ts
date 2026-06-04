import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getJwtSecret } from '../../../config/jwt-secret'
import { prisma } from '@aula/database'
import { AuthenticatedUser } from '../types/authenticated-user'

interface JwtPayload {
  sub: string
  email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    })
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await prisma.appUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        schoolId: true,
        status: true,
      },
    })
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException()
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

    return {
      id: user.id,
      email: user.email,
      schoolId: user.schoolId,
      roles: roles.map((role) => role.key),
    }
  }
}
