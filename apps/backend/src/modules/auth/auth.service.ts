import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { prisma } from '@aula/database'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await prisma.appUser.findUnique({
      where: { email: dto.email },
    })
    if (existing) throw new ConflictException('Email already registered')

    const school = await prisma.school.findFirst()
    if (!school) throw new Error('No school configured')

    const hashed = await bcrypt.hash(dto.password, 10)

    const user = await prisma.appUser.create({
      data: {
        authUserId: crypto.randomUUID(),
        email: dto.email,
        fullName: dto.fullName,
        passwordHash: hashed,
        schoolId: school.id,
      },
    })

    const token = this.jwtService.sign({ sub: user.id, email: user.email })

    return {
      user: { id: user.id, email: user.email },
      token,
      appUser: {
        id: user.id,
        authUserId: user.authUserId,
        schoolId: user.schoolId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      roles: [],
      permissions: [],
    }
  }

  async login(dto: LoginDto) {
    const user = await prisma.appUser.findUnique({
      where: { email: dto.email },
    })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.passwordHash ?? '')
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const token = this.jwtService.sign({ sub: user.id, email: user.email })

    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
    })
    const roleIds = userRoles.map((ur) => ur.roleId)

    const roles = roleIds.length
      ? await prisma.role.findMany({
          where: { id: { in: roleIds }, status: 'ACTIVE' },
        })
      : []

    const rolePermissions = roleIds.length
      ? await prisma.rolePermission.findMany({
          where: { roleId: { in: roleIds }, status: 'ACTIVE' },
        })
      : []

    const permissionIds = rolePermissions.map((rp) => rp.permissionId)
    const permissions = permissionIds.length
      ? await prisma.permission.findMany({
          where: { id: { in: permissionIds }, status: 'ACTIVE' },
        })
      : []

    const uniquePermissions = Array.from(
      new Map(permissions.map((p) => [p.key, p])).values(),
    )

    return {
      user: { id: user.id, email: user.email },
      token,
      appUser: {
        id: user.id,
        authUserId: user.authUserId,
        schoolId: user.schoolId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      roles,
      permissions: uniquePermissions,
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.appUser.findUnique({
      where: { id: userId },
    })
    if (!user) return null
    return {
      id: user.id,
      authUserId: user.authUserId,
      schoolId: user.schoolId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
