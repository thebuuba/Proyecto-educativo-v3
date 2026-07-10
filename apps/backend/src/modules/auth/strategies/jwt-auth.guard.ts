/**
 * Guard de autenticación JWT.
 * Protege los endpoints requiriendo un JWT válido en la cookie HttpOnly.
 */
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
