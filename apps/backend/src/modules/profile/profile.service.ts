/**
 * Servicio de perfil
 * @module ProfileService
 * @description Contiene la lógica de negocio para la consulta del perfil del usuario
 * autenticado, obteniendo sus datos personales desde la base de datos.
 */
import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class ProfileService {
  /** Obtiene los datos del perfil de un usuario por su ID */
  getProfile(userId: string) {
    return prisma.appUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, phone: true },
    })
  }
}
