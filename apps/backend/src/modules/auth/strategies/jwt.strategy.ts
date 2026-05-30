import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getJwtSecret } from '../../../config/jwt-secret'
import { prisma } from '@aula/database'

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

  async validate(payload: JwtPayload) {
    const user = await prisma.appUser.findUnique({
      where: { id: payload.sub },
    })
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException()
    }
    return { id: user.id, email: user.email }
  }
}
