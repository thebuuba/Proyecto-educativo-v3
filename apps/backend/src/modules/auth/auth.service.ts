/**
 * Servicio de autenticaciÃ³n.
 * Provee la lÃ³gica de negocio para registro, inicio de sesiÃ³n,
 * recuperaciÃ³n de contraseÃ±a y consulta de perfil del usuario autenticado.
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { prisma } from '@aula/database'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto'

type SupabaseAuthUser = {
  id: string
  email?: string
}

type AppUserWithSession = NonNullable<Awaited<ReturnType<typeof prisma.appUser.findUnique>>>

/**
 * Convierte un texto en un slug URL-friendly.
 * Elimina acentos, caracteres especiales y espacios.
 *
 * @param value - Texto a convertir.
 * @returns Slug generado.
 */
function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Obtiene un slug Ãºnico para una escuela, agregando un sufijo numÃ©rico
 * si el slug base ya estÃ¡ ocupado.
 *
 * @param input - Texto base para el slug.
 * @returns Slug Ãºnico disponible.
 */
async function getAvailableSchoolSlug(input: string) {
  const baseSlug = createSlug(input) || 'escuela'
  let slug = baseSlug
  let suffix = 1

  while (await prisma.school.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return slug
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const authKey = process.env.SUPABASE_ANON_KEY ?? serviceKey

  if (!url || !serviceKey || !authKey) {
    throw new InternalServerErrorException(
      'Supabase Auth is not configured on the server',
    )
  }

  return { url, serviceKey, authKey }
}

function isPlaceholderValue(value: string | undefined) {
  return !value || /xxxxx|replace|change-me|password@db\.xxxxx/i.test(value)
}

function assertAuthEnvironment() {
  if (
    isPlaceholderValue(process.env.DATABASE_URL) ||
    isPlaceholderValue(process.env.SUPABASE_URL) ||
    isPlaceholderValue(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    isPlaceholderValue(process.env.SUPABASE_ANON_KEY)
  ) {
    throw new ServiceUnavailableException(
      'El registro no esta configurado. Revisa apps/backend/.env con DATABASE_URL y claves de Supabase reales.',
    )
  }
}

async function readSupabaseError(response: Response) {
  const body = await response.json().catch(() => ({}))
  return body?.msg || body?.message || body?.error_description || response.statusText
}

async function createSupabaseAuthUser(dto: RegisterDto): Promise<SupabaseAuthUser> {
  const { url, serviceKey } = getSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        full_name: dto.fullName,
        school_name: dto.schoolName,
      },
    }),
  })

  if (!response.ok) {
    throw new ConflictException(await readSupabaseError(response))
  }

  const body = await response.json() as SupabaseAuthUser
  return body
}

async function deleteSupabaseAuthUser(id: string) {
  const { url, serviceKey } = getSupabaseConfig()
  await fetch(`${url}/auth/v1/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  })
}

async function signInSupabaseUser(dto: LoginDto): Promise<SupabaseAuthUser> {
  const { url, authKey } = getSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: dto.email,
      password: dto.password,
    }),
  })

  if (!response.ok) {
    throw new UnauthorizedException('Invalid credentials')
  }

  const body = await response.json() as { user?: SupabaseAuthUser }
  if (!body.user?.id) throw new UnauthorizedException('Invalid credentials')

  return body.user
}

async function getSupabaseUserFromToken(token: string): Promise<SupabaseAuthUser> {
  const { url, authKey } = getSupabaseConfig()
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: authKey,
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new UnauthorizedException('Invalid Supabase session')
  }

  const body = await response.json() as SupabaseAuthUser
  if (!body.id) throw new UnauthorizedException('Invalid Supabase session')
  return body
}

function toDate(value: string, fieldName: string) {
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`${fieldName} no es una fecha valida.`)
  }
  return date
}

function inferSchoolYearDates(name: string, startDate?: string, endDate?: string) {
  const match = name.match(/(\d{4})\D+(\d{4})/)
  const fallbackStartYear = new Date().getUTCFullYear()
  const startYear = match ? Number(match[1]) : fallbackStartYear
  const endYear = match ? Number(match[2]) : startYear + 1

  return {
    startDate: toDate(startDate || `${startYear}-08-01`, 'Fecha de inicio'),
    endDate: toDate(endDate || `${endYear}-06-30`, 'Fecha de fin'),
  }
}

function normalizeSchoolShift(value?: string) {
  const shift = value?.split(',')[0]?.trim()
  return shift || 'extended'
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName.trim()
  const lastName = parts.join(' ') || 'Docente'
  return { firstName, lastName }
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private buildSession(user: AppUserWithSession, roles: any[] = [], permissions: any[] = []) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email, tokenVersion: user.tokenVersion })

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
      permissions,
    }
  }

  /**
   * Registra un nuevo usuario y su escuela en una transacciÃ³n.
   * Crea la escuela, el rol de administrador, el usuario y la asignaciÃ³n de rol.
   * Retorna un token JWT junto con los datos del usuario creado.
   *
   * @param dto - Datos de registro.
   * @returns Objeto con usuario, token, roles y permisos.
   * @throws ConflictException si el email ya estÃ¡ registrado.
   */
  async register(dto: RegisterDto) {
    assertAuthEnvironment()

    const existing = await prisma.appUser.findUnique({
      where: { email: dto.email },
    })
    if (existing) throw new ConflictException('Email already registered')

    const slug = await getAvailableSchoolSlug(dto.slug || dto.schoolName)
    const authUser = await createSupabaseAuthUser(dto)

    try {
      const { user, roles } = await prisma.$transaction(
        async (tx) => {
          const school = await tx.school.create({
            data: {
              name: dto.schoolName,
              slug,
            },
          })

          const adminRole = await tx.role.upsert({
            where: { key: 'admin' },
            update: {},
            create: { key: 'admin', name: 'Administrador' },
          })

          const user = await tx.appUser.create({
            data: {
              authUserId: authUser.id,
              email: dto.email,
              fullName: dto.fullName,
              schoolId: school.id,
            },
          })

          await tx.userRole.create({
            data: {
              userId: user.id,
              roleId: adminRole.id,
              schoolId: school.id,
            },
          })

          return { user, roles: [adminRole] }
        },
        { timeout: 20_000 },
      )

      return this.buildSession(user, roles, [])
    } catch (error) {
      await deleteSupabaseAuthUser(authUser.id)
      throw error
    }
  }

  /**
   * Inicia sesiÃ³n con email y contraseÃ±a.
   * Verifica las credenciales, consulta roles y permisos activos,
   * y retorna un token JWT junto con los datos del usuario.
   *
   * @param dto - Credenciales de inicio de sesiÃ³n.
   * @returns Objeto con usuario, token, roles y permisos Ãºnicos.
   * @throws UnauthorizedException si las credenciales son invÃ¡lidas.
   */
  async login(dto: LoginDto) {
    assertAuthEnvironment()

    const authUser = await signInSupabaseUser(dto)
    const user = await prisma.appUser.findUnique({
      where: { authUserId: authUser.id },
    })
    if (!user) {
      throw new UnauthorizedException(
        'Tu cuenta existe en Supabase Auth, pero no tiene un perfil en Aula Base.',
      )
    }

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

    return this.buildSession(user, roles, uniquePermissions)
  }

  async createSessionFromSupabaseToken(supabaseAccessToken: string) {
    assertAuthEnvironment()

    const authUser = await getSupabaseUserFromToken(supabaseAccessToken)
    const user = await prisma.appUser.findUnique({
      where: { authUserId: authUser.id },
    })

    if (!user) {
      throw new UnauthorizedException('PROFILE_REQUIRED')
    }

    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
    })
    const roleIds = userRoles.map((ur) => ur.roleId)
    const roles = roleIds.length
      ? await prisma.role.findMany({
          where: { id: { in: roleIds }, status: 'ACTIVE' },
        })
      : []

    return this.buildSession(user, roles, [])
  }

  async completeOnboarding(supabaseAccessToken: string, dto: CompleteOnboardingDto) {
    assertAuthEnvironment()

    const authUser = await getSupabaseUserFromToken(supabaseAccessToken)
    const email = (dto.email || authUser.email || '').trim().toLowerCase()
    if (!email) throw new BadRequestException('El correo es obligatorio.')

    const existing = await prisma.appUser.findUnique({
      where: { authUserId: authUser.id },
    })
    if (existing) return this.createSessionFromSupabaseToken(supabaseAccessToken)

    const { startDate, endDate } = inferSchoolYearDates(
      dto.schoolYear.name,
      dto.schoolYear.startDate,
      dto.schoolYear.endDate,
    )
    if (endDate < startDate) {
      throw new BadRequestException('El aÃ±o escolar debe terminar despues de iniciar.')
    }


    const slug = await getAvailableSchoolSlug(dto.school.name)
    const { firstName, lastName } = splitName(dto.fullName)
    const { user, roles } = await prisma.$transaction(
      async (tx) => {
        const school = await tx.school.create({
          data: {
            name: dto.school.name,
            slug,
            primaryModality: dto.school.primaryModality ?? 'general',
            schoolShift: normalizeSchoolShift(dto.school.schoolShift),
            enabledSubsystems: dto.school.enabledSubsystems?.length
              ? dto.school.enabledSubsystems
              : ['regular'],
          },
        })

        const adminRole = await tx.role.upsert({
          where: { key: 'admin' },
          update: {},
          create: { key: 'admin', name: 'Administrador' },
        })

        const user = await tx.appUser.create({
          data: {
            authUserId: authUser.id,
            email,
            fullName: dto.fullName,
            schoolId: school.id,
          },
        })

        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: adminRole.id,
            schoolId: school.id,
          },
        })

        const teacher = await tx.teacher.create({
          data: {
            userId: user.id,
            schoolId: school.id,
            employeeCode: `DOC-${Date.now()}`,
            firstName,
            lastName,
            email,
            hireDate: startDate,
          },
        })

        await tx.schoolYear.create({
          data: {
            schoolId: school.id,
            name: dto.schoolYear.name,
            startDate,
            endDate,
            isCurrent: true,
          },
        })

        return { user, roles: [adminRole] }
      },
      { timeout: 20_000 },
    )

    return this.buildSession(user, roles, [])
  }

  async getOnboardingStatus(schoolId: string) {
    const [schoolYear] = await Promise.all([
      prisma.schoolYear.findFirst({ where: { schoolId, isCurrent: true, status: 'ACTIVE' } }),
    ])

    return {
      complete: Boolean(schoolYear),
      missing: {
        schoolYear: !schoolYear,
        periods: false,
        grades: false,
        sections: false,
        subjects: false,
        assignments: false,
      },
    }
  }

  /**
   * Solicita recuperaciÃ³n de contraseÃ±a.
   * Por seguridad siempre retorna el mismo mensaje
   * independientemente de si el email existe o no.
   *
   * @param email - Correo electrÃ³nico del usuario.
   * @returns Mensaje informativo.
   */
  async forgotPassword(email: string) {
    const user = await prisma.appUser.findUnique({ where: { email } })
    if (!user) return { message: 'If the email exists, a reset link has been sent' }
    return { message: 'If the email exists, a reset link has been sent' }
  }

  /**
   * Obtiene el perfil completo del usuario autenticado.
   *
   * @param userId - ID del usuario.
   * @returns Datos del perfil o null si no existe.
   */
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
