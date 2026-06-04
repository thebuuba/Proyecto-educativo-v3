import { ConflictException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'

const mocks = vi.hoisted(() => ({
  prisma: {
    appUser: {
      findUnique: vi.fn(),
    },
    school: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
  bcrypt: {
    hash: vi.fn(),
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

vi.mock('bcrypt', () => ({
  hash: mocks.bcrypt.hash,
}))

describe('AuthService.register', () => {
  const jwtService = {
    sign: vi.fn(),
  }

  const registerDto: RegisterDto = {
    schoolName: 'Colegio Alfa',
    slug: 'colegio-alfa',
    email: 'admin@colegio.test',
    password: 'secret123',
    fullName: 'Admin User',
  }

  const createdAt = new Date('2026-01-01T00:00:00.000Z')
  const updatedAt = new Date('2026-01-02T00:00:00.000Z')

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.prisma.appUser.findUnique.mockResolvedValue(null)
    mocks.prisma.school.findUnique.mockResolvedValue(null)
    mocks.bcrypt.hash.mockResolvedValue('hashed-password')
    jwtService.sign.mockReturnValue('signed-token')
  })

  function createService() {
    return new AuthService(jwtService as never)
  }

  function mockRegisterTransaction() {
    const school = {
      id: 'school-1',
      name: registerDto.schoolName,
      slug: registerDto.slug,
    }
    const adminRole = {
      id: 'role-admin',
      key: 'admin',
      name: 'Administrador',
    }
    const user = {
      id: 'user-1',
      authUserId: 'auth-user-1',
      schoolId: school.id,
      fullName: registerDto.fullName,
      email: registerDto.email,
      phone: null,
      avatarUrl: null,
      lastLoginAt: null,
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    }

    const tx = {
      school: {
        create: vi.fn().mockResolvedValue(school),
      },
      role: {
        upsert: vi.fn().mockResolvedValue(adminRole),
      },
      appUser: {
        create: vi.fn().mockResolvedValue(user),
      },
      userRole: {
        create: vi.fn().mockResolvedValue({
          id: 'user-role-1',
          userId: user.id,
          roleId: adminRole.id,
          schoolId: school.id,
        }),
      },
    }

    mocks.prisma.$transaction.mockImplementation(async (callback) => callback(tx))

    return { adminRole, school, tx, user }
  }

  it('creates the school, admin role, app user, user role, signs a token, and returns the auth payload', async () => {
    const { adminRole, tx, user } = mockRegisterTransaction()

    const result = await createService().register(registerDto)

    expect(mocks.prisma.appUser.findUnique).toHaveBeenCalledWith({
      where: { email: registerDto.email },
    })
    expect(mocks.bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10)
    expect(tx.school.create).toHaveBeenCalledWith({
      data: {
        name: registerDto.schoolName,
        slug: registerDto.slug,
      },
    })
    expect(tx.role.upsert).toHaveBeenCalledWith({
      where: { key: 'admin' },
      update: {},
      create: { key: 'admin', name: 'Administrador' },
    })
    expect(tx.appUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: registerDto.email,
        fullName: registerDto.fullName,
        passwordHash: 'hashed-password',
        schoolId: 'school-1',
      }),
    })
    expect(tx.appUser.create.mock.calls[0][0].data.authUserId).toEqual(
      expect.any(String),
    )
    expect(tx.userRole.create).toHaveBeenCalledWith({
      data: {
        userId: user.id,
        roleId: adminRole.id,
        schoolId: 'school-1',
      },
    })
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    })
    expect(result).toEqual({
      user: { id: user.id, email: user.email },
      token: 'signed-token',
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
        createdAt,
        updatedAt,
      },
      roles: [adminRole],
      permissions: [],
    })
  })

  it('throws ConflictException when the email already exists', async () => {
    mocks.prisma.appUser.findUnique.mockResolvedValue({ id: 'existing-user' })

    await expect(createService().register(registerDto)).rejects.toBeInstanceOf(
      ConflictException,
    )
    expect(mocks.bcrypt.hash).not.toHaveBeenCalled()
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled()
    expect(jwtService.sign).not.toHaveBeenCalled()
  })

  it('uses the first suffixed slug when the base slug already exists', async () => {
    const { tx } = mockRegisterTransaction()
    mocks.prisma.school.findUnique
      .mockResolvedValueOnce({ id: 'existing-school', slug: registerDto.slug })
      .mockResolvedValueOnce(null)

    await createService().register(registerDto)

    expect(mocks.prisma.school.findUnique).toHaveBeenNthCalledWith(1, {
      where: { slug: 'colegio-alfa' },
    })
    expect(mocks.prisma.school.findUnique).toHaveBeenNthCalledWith(2, {
      where: { slug: 'colegio-alfa-1' },
    })
    expect(tx.school.create).toHaveBeenCalledWith({
      data: {
        name: registerDto.schoolName,
        slug: 'colegio-alfa-1',
      },
    })
  })
})
