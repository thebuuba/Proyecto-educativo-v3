import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class UsersService {
  findAll(schoolId: string) {
    return prisma.appUser.findMany({
      where: { schoolId },
      select: { id: true, email: true, fullName: true, status: true },
    })
  }

  findOne(schoolId: string, id: string) {
    return prisma.appUser.findFirst({
      where: { id, schoolId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, status: true },
    })
  }

  async update(schoolId: string, id: string, body: any) {
    const user = await prisma.appUser.findFirst({ where: { id, schoolId } })
    if (!user) throw new NotFoundException('User not found')

    return prisma.appUser.update({
      where: { id },
      data: {
        ...(body.fullName && { fullName: body.fullName }),
        ...(body.email && { email: body.email }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
      },
      select: { id: true, email: true, fullName: true, avatarUrl: true, status: true },
    })
  }

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

  async getPermissions(roleIds: string[]) {
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
