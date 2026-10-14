/**
 * Servicio de perfil
 * @module ProfileService
 * @description Contiene la lógica de negocio para la consulta del perfil del usuario
 * autenticado, obteniendo sus datos personales desde la base de datos.
 */
import { BadRequestException, Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfileService {
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.fullName !== undefined && !dto.fullName?.trim()) {
      throw new BadRequestException('El nombre completo es obligatorio.')
    }
    return prisma.appUser.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName.trim() }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      },
      select: {
        id: true, authUserId: true, schoolId: true, email: true, fullName: true,
        phone: true, avatarUrl: true, lastLoginAt: true, status: true,
        createdAt: true, updatedAt: true,
      },
    })
  }

  /** Obtiene los datos del perfil de un usuario por su ID */
  getProfile(userId: string) {
    return prisma.appUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, phone: true },
    })
  }
}
