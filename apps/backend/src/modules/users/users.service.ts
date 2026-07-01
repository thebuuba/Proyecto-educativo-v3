/**
 * Servicio de usuarios.
 * Provee la lógica de negocio para la consulta, actualización
 * y gestión de roles y permisos de usuarios dentro de una escuela.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  /**
   * Lista todos los usuarios activos de una escuela.
   *
   * @param schoolId - ID de la escuela.
   * @returns Lista de usuarios con id, email, fullName y status.
   */
  findAll(schoolId: string) {
    return prisma.appUser.findMany({
      where: { schoolId },
      select: { id: true, email: true, fullName: true, status: true },
    })
  }

  /**
   * Busca un usuario por ID dentro de una escuela.
   *
   * @param schoolId - ID de la escuela.
   * @param id - ID del usuario.
   * @returns Datos del usuario o null si no existe.
   */
  findOne(schoolId: string, id: string) {
    return prisma.appUser.findFirst({
      where: { id, schoolId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, status: true },
    })
  }

  /**
   * Actualiza los datos de un usuario.
   * Solo actualiza los campos proporcionados (fullName, email, avatarUrl).
   *
   * @param schoolId - ID de la escuela.
   * @param id - ID del usuario a actualizar.
   * @param body - Objeto con los campos a modificar.
   * @returns Usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   */
  async update(schoolId: string, id: string, dto: UpdateUserDto) {
    const user = await prisma.appUser.findFirst({ where: { id, schoolId } })
    if (!user) throw new NotFoundException('User not found')

    return prisma.appUser.update({
      where: { id },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
        ...(dto.email && { email: dto.email }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      },
      select: { id: true, email: true, fullName: true, avatarUrl: true, status: true },
    })
  }

  /**
   * Obtiene los roles activos de un usuario en una escuela.
   *
   * @param schoolId - ID de la escuela.
   * @param userId - ID del usuario.
   * @returns Lista de roles activos.
   */
  async getRoles(schoolId: string, userId: string) {
    const userRoles = await prisma.userRole.findMany({
      where: { schoolId, userId, status: 'ACTIVE' },
    })
    const roleIds = userRoles.map((ur) => ur.roleId)
    if (!roleIds.length) return []
    return prisma.role.findMany({
      where: { id: { in: roleIds }, status: 'ACTIVE' },
    })
  }

  /**
   * Obtiene los permisos asociados a los roles especificados
   * para un usuario dentro de una escuela.
   * Previamente valida que el usuario tenga asignados dichos roles.
   *
   * @param schoolId - ID de la escuela.
   * @param userId - ID del usuario.
   * @param roleIds - Lista de IDs de roles a consultar.
   * @returns Lista de permisos activos.
   */
  async getPermissions(schoolId: string, userId: string, roleIds: string[]) {
    if (!roleIds.length) return []
    const allowedRoles = await prisma.userRole.findMany({
      where: { schoolId, userId, roleId: { in: roleIds }, status: 'ACTIVE' },
    })
    roleIds = allowedRoles.map((role) => role.roleId)
    if (!roleIds.length) return []
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId: { in: roleIds }, status: 'ACTIVE' },
    })
    const permissionIds = rolePermissions.map((rp) => rp.permissionId)
    if (!permissionIds.length) return []
    return prisma.permission.findMany({
      where: { id: { in: permissionIds }, status: 'ACTIVE' },
    })
  }
}
