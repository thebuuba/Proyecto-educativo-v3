/**
 * Servicio de perfil
 * @module ProfileService
 * @description Contiene la lógica de negocio para la consulta del perfil del usuario
 * autenticado, obteniendo sus datos personales desde la base de datos.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { UpdateProfileDto } from './dto/update-profile.dto'
import type { ProfilePreferences, ProfileSettings } from '@aula/shared'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'
import { UpdateProfileSettingsDto } from './dto/update-profile-settings.dto'
import { cleanProfileAvatar, MANAGED_AVATAR } from './profile-avatar'

@Injectable()
export class ProfileService {
  async getSettings(user: AuthenticatedUser): Promise<ProfileSettings> {
    const account = await prisma.appUser.findFirst({
      where: { id: user.id, schoolId: user.schoolId },
      include: { profileSettings: true, school: { select: { name: true } },
        teacher: { select: { id: true, employeeCode: true, status: true } },
        student: { select: { id: true, studentCode: true, status: true } } },
    })
    if (!account) throw new NotFoundException('No se encontró tu perfil.')
    const stored = account.profileSettings
    const preferences: ProfilePreferences = {
      publicName: stored?.publicName ?? null, bio: stored?.bio ?? null,
      birthDate: stored?.birthDate?.toISOString().slice(0, 10) ?? null,
      country: stored?.country ?? null, city: stored?.city ?? null, educationLevel: stored?.educationLevel ?? null,
      language: 'es', timezone: stored?.timezone ?? 'UTC', interests: stored?.interests ?? [],
    }
    const teacher = user.roles.includes('teacher') && account.teacher?.status === 'ACTIVE' ? account.teacher : null
    const student = user.roles.includes('student') && account.student?.status === 'ACTIVE' ? account.student : null
    const courseCount = teacher || student ? await prisma.sectionSubject.count({ where: {
      schoolId: user.schoolId, status: 'ACTIVE', schoolYear: { isCurrent: true, status: 'ACTIVE' },
      ...(teacher ? { teacherId: teacher.id } : { section: { enrollments: { some: {
        studentId: student!.id, schoolId: user.schoolId, status: 'ACTIVE', schoolYear: { isCurrent: true, status: 'ACTIVE' },
      } } } }),
    } }) : null
    const completed = [account.fullName, account.phone, account.avatarUrl, preferences.publicName, preferences.bio,
      preferences.birthDate, preferences.country, preferences.city, preferences.educationLevel, preferences.interests.length]
    return {
      id: account.id, fullName: account.fullName, email: account.email, phone: account.phone, avatarUrl: account.avatarUrl,
      createdAt: account.createdAt.toISOString(), roles: user.roles, institution: account.school.name,
      academicIdentifier: teacher ? { label: 'Código docente', value: teacher.employeeCode }
        : student ? { label: 'Matrícula', value: student.studentCode } : null,
      preferences, completeness: completed.filter(Boolean).length * 10,
      stats: [{ id: 'courses', label: teacher ? 'Cursos asignados' : 'Cursos activos', value: courseCount },
        { id: 'hours', label: 'Horas registradas', value: null }, { id: 'certs', label: 'Certificados', value: null }],
    }
  }

  async updateSettings(user: AuthenticatedUser, dto: UpdateProfileSettingsDto): Promise<ProfileSettings> {
    await prisma.$transaction(async db => {
      const account = await db.appUser.findFirst({ where: { id: user.id, schoolId: user.schoolId }, select: { id: true } })
      if (!account) throw new NotFoundException('No se encontró tu perfil.')
      if (dto.fullName !== undefined && !dto.fullName?.trim()) throw new BadRequestException('El nombre completo es obligatorio.')
      const data = {
        ...(dto.fullName !== undefined && { fullName: dto.fullName.trim() }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
      }
      if (Object.keys(data).length) await db.appUser.update({ where: { id: user.id, schoolId: user.schoolId }, data })
      if (dto.preferences) {
        const p = dto.preferences
        const values = {
          ...(p.publicName !== undefined && { publicName: p.publicName?.trim() || null }),
          ...(p.bio !== undefined && { bio: p.bio?.trim() || null }),
          ...(p.birthDate !== undefined && { birthDate: p.birthDate ? new Date(`${p.birthDate}T00:00:00Z`) : null }),
          ...(p.country !== undefined && { country: p.country }), ...(p.city !== undefined && { city: p.city?.trim() || null }),
          ...(p.educationLevel !== undefined && { educationLevel: p.educationLevel }),
          ...(p.language !== undefined && { language: p.language }), ...(p.timezone !== undefined && { timezone: p.timezone }),
          ...(p.interests !== undefined && { interests: p.interests }),
        }
        await db.userProfileSettings.upsert({ where: { userId: user.id }, create: { userId: user.id, ...values }, update: values })
      }
    })
    return this.getSettings(user)
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.fullName !== undefined && !dto.fullName?.trim()) {
      throw new BadRequestException('El nombre completo es obligatorio.')
    }
    const args = {
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
    } as const
    if (dto.avatarUrl === undefined) return prisma.appUser.update(args)
    let previous: string | null | undefined
    const result = await prisma.$transaction(async db => {
      await db.$queryRaw`SELECT id FROM public.app_users WHERE id = ${userId}::uuid FOR UPDATE`
      const account = await db.appUser.findFirst({ where: { id: userId }, include: { profileSettings: true } })
      if (!account) throw new NotFoundException('No se encontró tu perfil.')
      if (dto.avatarUrl && MANAGED_AVATAR.test(dto.avatarUrl) && dto.avatarUrl !== account.avatarUrl) {
        throw new BadRequestException('Selecciona una foto desde el formulario de carga.')
      }
      if (dto.avatarUrl !== account.avatarUrl && account.profileSettings?.avatarPath) {
        previous = account.profileSettings.avatarPath
        await db.userProfileSettings.upsert({ where: { userId }, create: { userId }, update: { avatarPath: null } })
      }
      return db.appUser.update(args)
    })
    await cleanProfileAvatar(userId, previous)
    return result
  }

  /** Obtiene los datos del perfil de un usuario por su ID */
  getProfile(userId: string) {
    return prisma.appUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, avatarUrl: true, phone: true },
    })
  }
}
