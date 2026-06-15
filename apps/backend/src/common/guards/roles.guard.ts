/**
 * @description Guard de NestJS que verifica roles del usuario contra los metadatos de la ruta.
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

/**
 * Guard de autorización basado en roles. Lee los roles requeridos desde los
 * metadatos del manejador o clase y los compara con los roles del usuario autenticado.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determina si la solicitud actual tiene permiso para acceder al recurso
   * verificando que el usuario posea al menos uno de los roles requeridos.
   *
   * @param context - Contexto de ejecución de NestJS.
   * @returns `true` si el usuario está autorizado, `false` en caso contrario.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    if (!user?.roles) return false

    return requiredRoles.some((role) => user.roles.includes(role))
  }
}
