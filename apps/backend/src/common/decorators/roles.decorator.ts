/**
 * @description Decorador @Roles() para definir roles permitidos en handlers de rutas.
 */

import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/**
 * Decorador de método que asigna metadatos de roles permitidos a un handler de ruta.
 *
 * @param roles - Lista de nombres de rol que pueden acceder al recurso.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
