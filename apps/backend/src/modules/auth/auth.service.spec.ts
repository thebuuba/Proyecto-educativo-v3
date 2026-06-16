import { ConflictException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'

const mocks = vi.hoisted(() => ({
  prisma: {
    appUser: {
      findUnique: vi.fn(),
    },
    userRole: {
      findMany: vi.fn(),
    },
    role: {
      findMany: vi.fn(),
    },
    rolePermission: {
      findMany: vi.fn(),
    },
    permission: {
      findMany: vi.fn(),
    },
    school: {
      findUnique: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
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
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    process.env.SUPABASE_ANON_KEY = 'anon-key'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 'auth-created-user',
          email: registerDto.email,
        }),
      }),
    )
    mocks.prisma.appUser.findUnique.mockResolvedValue(null)
    mocks.prisma.userRole.findMany.mockResolvedValue([])
    mocks.prisma.role.findMany.mockResolvedValue([])
    mocks.prisma.rolePermission.findMany.mockResolvedValue([])
    mocks.prisma.permission.findMany.mockResolvedValue([])
    mocks.prisma.school.findUnique.mockResolvedValue(null)
    mocks.prisma.$queryRaw.mockResolvedValue([])
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

  it('creates a Supabase Auth user, school, admin role, app user, user role, signs a token, and returns the auth payload', async () => {
    const { adminRole, tx, user } = mockRegisterTransaction()

    const result = await createService().register(registerDto)

    expect(mocks.prisma.appUser.findUnique).toHaveBeenCalledWith({
      where: { email: registerDto.email },
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://example.supabase.co/auth/v1/admin/users',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining(registerDto.email),
      }),
    )
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
        authUserId: 'auth-created-user',
        schoolId: 'school-1',
      }),
    })
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
    expect(fetch).not.toHaveBeenCalled()
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

  it('links the app profile to an existing Supabase Auth user with the same email', async () => {
    const { tx } = mockRegisterTransaction()
    mocks.prisma.$queryRaw.mockResolvedValue([{ id: 'auth-existing-user' }])

    await createService().register(registerDto)

    expect(fetch).not.toHaveBeenCalled()
    expect(tx.appUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        authUserId: 'auth-existing-user',
      }),
    })
  })

  it('validates login against Supabase Auth and loads the linked app profile', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        user: {
          id: 'auth-created-user',
          email: registerDto.email,
        },
      }),
    } as never)

    const appUser = {
      id: 'user-1',
      authUserId: 'auth-created-user',
      schoolId: 'school-1',
      fullName: registerDto.fullName,
      email: registerDto.email,
      phone: null,
      avatarUrl: null,
      lastLoginAt: null,
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    }

    mocks.prisma.appUser.findUnique.mockResolvedValue(appUser)

    const result = await createService().login({
      email: registerDto.email,
      password: registerDto.password,
    })

    expect(fetch).toHaveBeenCalledWith(
      'https://example.supabase.co/auth/v1/token?grant_type=password',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining(registerDto.password),
      }),
    )
    expect(mocks.prisma.appUser.findUnique).toHaveBeenCalledWith({
      where: { authUserId: 'auth-created-user' },
    })
    expect(result.user).toEqual({ id: appUser.id, email: appUser.email })
    expect(result.token).toBe('signed-token')
  })

  it('rejects Supabase Auth users without an Aula Base profile', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        user: {
          id: 'auth-created-user',
          email: registerDto.email,
        },
      }),
    } as never)

    mocks.prisma.appUser.findUnique.mockResolvedValue(null)

    await expect(
      createService().login({
        email: registerDto.email,
        password: registerDto.password,
      }),
    ).rejects.toThrow(
      'Tu cuenta existe en Supabase Auth, pero no tiene un perfil en Aula Base.',
    )
  })
})
