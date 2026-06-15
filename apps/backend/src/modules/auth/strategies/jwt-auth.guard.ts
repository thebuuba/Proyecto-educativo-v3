/**
 * Guard de autenticación JWT.
 * Protege los endpoints requiriendo un token JWT válido
 * en el encabezado Authorization.
 */
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
