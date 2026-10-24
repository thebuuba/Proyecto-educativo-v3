/**
 * Guard de autenticación JWT.
 * Protege los endpoints requiriendo un JWT válido en la cookie HttpOnly.
 */
import { Injectable, type ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { enforceAcademicAccess } from '../../billing/billing-access'
import {timeDevelopmentStage} from '../../../common/development-request-timing'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await timeDevelopmentStage('auth.jwt',async()=>await super.canActivate(context))
    if (!authenticated) return false
    const request = context.switchToHttp().getRequest()
    await timeDevelopmentStage('auth.academic-access',()=>enforceAcademicAccess(request.user.id, request.path))
    return true
  }
}
