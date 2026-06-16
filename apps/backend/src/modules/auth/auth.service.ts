/**
 * Servicio de autenticación.
 * Provee la lógica de negocio para registro, inicio de sesión,
 * recuperación de contraseña y consulta de perfil del usuario autenticado.
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { prisma } from '@aula/database'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

type SupabaseAuthUser = {
  id: string
  email?: string
}

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
 * Obtiene un slug único para una escuela, agregando un sufijo numérico
 * si el slug base ya está ocupado.
 *
 * @param input - Texto base para el slug.
 * @returns Slug único disponible.
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

async function findSupabaseAuthUserId(email: string) {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    select id::text as id
    from auth.users
    where lower(email) = lower(${email})
    limit 1
  `

  return rows[0]?.id
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

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Registra un nuevo usuario y su escuela en una transacción.
   * Crea la escuela, el rol de administrador, el usuario y la asignación de rol.
   * Retorna un token JWT junto con los datos del usuario creado.
   *
   * @param dto - Datos de registro.
   * @returns Objeto con usuario, token, roles y permisos.
   * @throws ConflictException si el email ya está registrado.
   */
  async register(dto: RegisterDto) {
    const existing = await prisma.appUser.findUnique({
      where: { email: dto.email },
    })
    if (existing) throw new ConflictException('Email already registered')

    const slug = await getAvailableSchoolSlug(dto.slug || dto.schoolName)
    const existingAuthUserId = await findSupabaseAuthUserId(dto.email)
    const authUser = existingAuthUserId
      ? { id: existingAuthUserId }
      : await createSupabaseAuthUser(dto)

    try {
      const { user, roles } = await prisma.$transaction(async (tx) => {
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
        roles,
        permissions: [],
      }
    } catch (error) {
      if (!existingAuthUserId) await deleteSupabaseAuthUser(authUser.id)
      throw error
    }
  }

  /**
   * Inicia sesión con email y contraseña.
   * Verifica las credenciales, consulta roles y permisos activos,
   * y retorna un token JWT junto con los datos del usuario.
   *
   * @param dto - Credenciales de inicio de sesión.
   * @returns Objeto con usuario, token, roles y permisos únicos.
   * @throws UnauthorizedException si las credenciales son inválidas.
   */
  async login(dto: LoginDto) {
    const authUser = await signInSupabaseUser(dto)
    const user = await prisma.appUser.findUnique({
      where: { authUserId: authUser.id },
    })
    if (!user) {
      throw new UnauthorizedException(
        'Tu cuenta existe en Supabase Auth, pero no tiene un perfil en Aula Base.',
      )
    }

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

  /**
   * Solicita recuperación de contraseña.
   * Por seguridad siempre retorna el mismo mensaje
   * independientemente de si el email existe o no.
   *
   * @param email - Correo electrónico del usuario.
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
