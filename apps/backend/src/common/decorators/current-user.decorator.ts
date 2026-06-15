/**
 * @description Decorador @CurrentUser() que extrae el usuario autenticado del request.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedUser } from '../../modules/auth/types/authenticated-user'

/**
 * Decorador de parámetro que inyecta el usuario autenticado desde `request.user`.
 *
 * @param data - Dato no utilizado (requerido por la firma de createParamDecorator).
 * @param ctx - Contexto de ejecución de NestJS.
 * @returns El objeto AuthenticatedUser asociado a la solicitud actual.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
