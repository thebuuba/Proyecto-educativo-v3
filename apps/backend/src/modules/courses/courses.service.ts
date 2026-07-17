/**
 * Servicio de grados y secciones
 * @module CoursesService
 * @description Contiene la lógica de negocio para la gestión de grados, secciones,
 * materias y asignación de materias a secciones. Proporciona operaciones CRUD
 * y consultas de datos completos del curso.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma, RecordStatus } from '@aula/database'
import {
  invalidateCourseOptions,
  invalidateImplicitSchoolYearOptions,
  optionCache,
  optionCacheKeys,
} from '../../common/cache/option-cache'
import { CreateGradeDto } from './dto/create-grade.dto'
import { UpdateGradeDto } from './dto/update-grade.dto'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { AssignSubjectDto } from './dto/assign-subject.dto'
import { CreateCourseTeamDto } from './dto/create-course-team.dto'
import { UpdateCourseTeamDto } from './dto/update-course-team.dto'
import { UpdateSectionSubjectAppearanceDto } from './dto/update-section-subject-appearance.dto'

const cache = new Map<
  string,
  { data?: unknown; promise?: Promise<unknown>; expiry: number }
>()
const CACHE_TTL = 60_000

function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const entry = cache.get(key)
  if (entry && entry.expiry > now) {
    if (entry.promise) return entry.promise as Promise<T>
    return Promise.resolve(entry.data as T)
  }

  const promise = fn().then((data) => {
    cache.set(key, { data, expiry: Date.now() + CACHE_TTL })
    return data
  }, (error) => {
    if (cache.get(key)?.promise === promise) cache.delete(key)
    throw error
  })

  cache.set(key, { promise, expiry: now + CACHE_TTL })
  return promise
}

function invalidateSchoolCache(schoolId: string) {
  for (const key of cache.keys()) {
    if (
      key === `teachers:${schoolId}` ||
      key === `grades:${schoolId}` ||
      key === `subjects:${schoolId}` ||
      key === `sectionSubjects:${schoolId}` ||
      key.startsWith(`sections:${schoolId}:`)
    ) {
      cache.delete(key)
    }
  }
  invalidateCourseOptions(schoolId)
}

export function __test__clearCoursesCache() {
  cache.clear()
  optionCache.clear()
}

/** Convierte el valor de estado a minúsculas */
function status(value: string) {
  return value.toLowerCase()
}

/** Devuelve el año escolar activo o el más reciente; si no existe ninguno, crea uno por defecto */
async function resolveSchoolYear(schoolId: string) {
  const sy = await prisma.schoolYear.findFirst({
    where: { schoolId },
    orderBy: [{ isCurrent: 'desc' }, { status: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, name: true },
  })
  if (sy) return sy
  const year = new Date().getFullYear()
  const schoolYear = await prisma.schoolYear.create({
    data: {
      schoolId,
      name: `${year}-${year + 1}`,
      startDate: new Date(year, 7, 1),
      endDate: new Date(year + 1, 6, 31),
      isCurrent: true,
    },
    select: { id: true, name: true },
  })
  // Conserva la carga de courseData en curso, pero refresca a sus consumidores.
  invalidateImplicitSchoolYearOptions(schoolId)
  return schoolYear
}

@Injectable()
export class CoursesService {
  /** Obtiene los datos completos del curso: grados, secciones, asignaciones, catálogos y año escolar actual */
  async getCourseData(schoolId: string, appUserId?: string) {
    return optionCache.withCache(
      optionCacheKeys.courses.courseData(schoolId, appUserId),
      () => this._getCourseData(schoolId, appUserId),
    )
  }

  private async _getCourseData(schoolId: string, appUserId?: string) {
    const currentSchoolYear = await resolveSchoolYear(schoolId)

    const [grades, sections, assignments, enrollmentCounts, teamCounts, activityCounts, lastAttendances, gradeAverages, lastPlannings, subjects, academicLevels, cycles, modalities, teachers] = await Promise.all([
      prisma.grade.findMany({ where: { schoolId }, orderBy: { sequence: 'asc' } }),
      prisma.section.findMany({ where: { schoolId }, orderBy: { name: 'asc' } }),
      prisma.sectionSubject.findMany({
        where: { schoolId, schoolYearId: currentSchoolYear.id },
        include: {
          _count: {
            select: {
              attendanceClasses: true,
              gradesRecords: true,
              evaluationActivities: true,
              courseTeams: true,
              scheduleEntries: true,
              planningEntries: true,
            },
          },
        },
      }),
      prisma.enrollment.groupBy({
        by: ['sectionId'],
        where: { schoolId, schoolYearId: currentSchoolYear.id, status: 'ACTIVE' },
        _count: { id: true },
      }),
      prisma.courseTeam.groupBy({
        by: ['sectionSubjectId'],
        where: { schoolId, schoolYearId: currentSchoolYear.id, status: 'ACTIVE' },
        _count: { id: true },
      }),
      prisma.evaluationActivity.groupBy({
        by: ['sectionSubjectId'],
        where: { schoolId, schoolYearId: currentSchoolYear.id, status: 'ACTIVE' },
        _count: { id: true },
      }),
      prisma.attendanceClass.findMany({
        where: { schoolId, schoolYearId: currentSchoolYear.id },
        orderBy: { attendanceDate: 'desc' },
        distinct: ['sectionSubjectId'],
        select: { sectionSubjectId: true, attendanceDate: true },
      }),
      prisma.gradesRecord.groupBy({
        by: ['sectionSubjectId'],
        where: { schoolId, schoolYearId: currentSchoolYear.id },
        _avg: { score: true },
      }),
      prisma.planningEntry.findMany({
        where: { schoolId, sectionSubject: { schoolYearId: currentSchoolYear.id } },
        orderBy: [{ plannedDate: 'desc' }, { createdAt: 'desc' }],
        distinct: ['sectionSubjectId'],
        select: { sectionSubjectId: true, plannedDate: true, createdAt: true, title: true },
      }),
      prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { name: 'asc' } }),
      prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } }),
      prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } }),
      prisma.drModality.findMany({ orderBy: { name: 'asc' } }),
      prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' } }),
    ])

    const levelById = new Map(academicLevels.map((item) => [item.id, item]))
    const cycleById = new Map(cycles.map((item) => [item.id, item]))
    const modalityById = new Map(modalities.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))
    const accountTeacher = appUserId ? teachers.find((item) => item.userId === appUserId) ?? null : null
    const studentCountBySectionId = new Map(
      enrollmentCounts.map((item) => [item.sectionId, item._count.id]),
    )
    const teamCountByAssignmentId = new Map(
      teamCounts.map((item) => [item.sectionSubjectId, item._count.id]),
    )
    const activityCountByAssignmentId = new Map(
      activityCounts.map((item) => [item.sectionSubjectId, item._count.id]),
    )
    const attendanceByAssignmentId = new Map(
      lastAttendances.map((item) => [item.sectionSubjectId, item.attendanceDate]),
    )
    const averageByAssignmentId = new Map(
      gradeAverages.map((item) => [item.sectionSubjectId, item._avg.score]),
    )
    const planningByAssignmentId = new Map(
      lastPlannings.map((item) => [item.sectionSubjectId, item]),
    )

    return {
      grades: grades.map((grade) => ({
        ...grade,
        status: status(grade.status),
        academicLevelName: grade.academicLevelId ? levelById.get(grade.academicLevelId)?.name ?? null : null,
        academicCycleName: grade.academicCycleId ? cycleById.get(grade.academicCycleId)?.name ?? null : null,
        defaultModalityName: grade.defaultModalityId ? modalityById.get(grade.defaultModalityId)?.name ?? null : null,
        sections: sections
          .filter((section) => section.gradeId === grade.id)
          .map((section) => ({
            ...section,
            status: status(section.status),
            studentCount: studentCountBySectionId.get(section.id) ?? 0,
            teamCount: assignments
              .filter((assignment) => assignment.sectionId === section.id && assignment.status === RecordStatus.ACTIVE)
              .reduce((total, assignment) => total + (teamCountByAssignmentId.get(assignment.id) ?? 0), 0),
            assignments: assignments
              .filter((assignment) => assignment.sectionId === section.id)
              .map((assignment) => {
                const subject = subjectById.get(assignment.subjectId)
                const teacher = assignment.teacherId ? teacherById.get(assignment.teacherId) : accountTeacher
                const relatedDataCount = assignment._count
                  ? Object.values(assignment._count).reduce((total, count) => total + count, 0)
                  : 0
                return {
                  id: assignment.id,
                  sectionId: assignment.sectionId,
                  gradeId: assignment.gradeId,
                  subjectId: assignment.subjectId,
                  subjectCode: subject?.code ?? '',
                  subjectName: subject?.name ?? '',
                  teacherId: assignment.teacherId ?? accountTeacher?.id ?? null,
                  teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : null,
                  appearanceColor: assignment.appearanceColor,
                  appearanceIcon: assignment.appearanceIcon,
                  teamCount: teamCountByAssignmentId.get(assignment.id) ?? 0,
                  activityCount: activityCountByAssignmentId.get(assignment.id) ?? 0,
                  lastAttendanceDate: attendanceByAssignmentId.get(assignment.id) ?? null,
                  averageScore: averageByAssignmentId.get(assignment.id) === null || averageByAssignmentId.get(assignment.id) === undefined
                    ? null
                    : Number(averageByAssignmentId.get(assignment.id)),
                  lastPlanningDate: planningByAssignmentId.get(assignment.id)?.plannedDate
                    ?? planningByAssignmentId.get(assignment.id)?.createdAt
                    ?? null,
                  lastPlanningTitle: planningByAssignmentId.get(assignment.id)?.title ?? null,
                  relatedDataCount,
                  canDelete: relatedDataCount === 0,
                  status: status(assignment.status),
                }
              }),
          })),
      })),
      catalogs: {
        levels: academicLevels,
        cycles,
        modalities,
        subjects,
        teachers: teachers.map((teacher) => ({
          id: teacher.id,
          name: `${teacher.firstName} ${teacher.lastName}`,
          email: teacher.email,
        })),
      },
      currentSchoolYear,
    }
  }

  /** Obtiene los niveles académicos del sistema */
  getAcademicLevels() {
    return withCache('academicLevels', () =>
      prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } })
    )
  }

  /** Obtiene los ciclos académicos del sistema */
  getCycles() {
    return withCache('cycles', () =>
      prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } })
    )
  }

  /** Obtiene las modalidades del sistema */
  getModalities() {
    return withCache('modalities', () =>
      prisma.drModality.findMany({ orderBy: { name: 'asc' } })
    )
  }

  /** Obtiene los profesores activos del colegio */
  getTeachers(schoolId: string) {
    return withCache(`teachers:${schoolId}`, () =>
      prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { firstName: 'asc' } })
    )
  }

  /** Obtiene todos los grados del colegio */
  findAllGrades(schoolId: string) {
    return withCache(`grades:${schoolId}`, () =>
      prisma.grade.findMany({ where: { schoolId }, orderBy: { sequence: 'asc' } })
    )
  }

  /** Crea un nuevo grado */
  async createGrade(schoolId: string, dto: CreateGradeDto) {
    const existing = await prisma.grade.findFirst({
      where: {
        schoolId,
        name: dto.name,
        academicLevelId: dto.academicLevelId ?? null,
        academicCycleId: dto.academicCycleId ?? null,
      },
    })

    const grade = existing
      ? await prisma.grade.update({
        where: { id: existing.id },
        data: {
          ...(dto.level !== undefined && { level: dto.level }),
          ...(dto.sequence !== undefined && { sequence: dto.sequence }),
          ...(dto.defaultModalityId !== undefined && { defaultModalityId: dto.defaultModalityId }),
          status: RecordStatus.ACTIVE,
        },
      })
      : await prisma.grade.create({
        data: {
          schoolId,
          name: dto.name,
          level: dto.level ?? null,
          sequence: dto.sequence ?? null,
          academicLevelId: dto.academicLevelId ?? null,
          academicCycleId: dto.academicCycleId ?? null,
          defaultModalityId: dto.defaultModalityId ?? null,
        },
      })

    invalidateSchoolCache(schoolId)
    return grade
  }

  /** Actualiza un grado existente */
  async updateGrade(schoolId: string, id: string, dto: UpdateGradeDto) {
    const grade = await prisma.grade.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    const updated = await prisma.grade.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.level !== undefined && { level: dto.level }),
        ...(dto.sequence !== undefined && { sequence: dto.sequence }),
        ...(dto.academicLevelId !== undefined && { academicLevelId: dto.academicLevelId }),
        ...(dto.academicCycleId !== undefined && { academicCycleId: dto.academicCycleId }),
        ...(dto.defaultModalityId !== undefined && { defaultModalityId: dto.defaultModalityId }),
        ...(dto.status && { status: dto.status as RecordStatus }),
      },
    })
    invalidateSchoolCache(schoolId)
    return updated
  }

  /** Desactiva un grado (borrado lógico) */
  async deleteGrade(schoolId: string, id: string) {
    const grade = await prisma.grade.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    const updated = await prisma.grade.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
    })
    invalidateSchoolCache(schoolId)
    return updated
  }

  /** Obtiene las secciones activas de un grado */
  findSectionsByGrade(schoolId: string, gradeId: string) {
    return withCache(`sections:${schoolId}:${gradeId}`, () =>
      prisma.section.findMany({
        where: { schoolId, gradeId, status: RecordStatus.ACTIVE },
        orderBy: { name: 'asc' },
      })
    )
  }

  /** Crea una nueva sección validando el grado */
  async createSection(schoolId: string, dto: CreateSectionDto) {
    const grade = await prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    const section = await prisma.section.upsert({
      where: {
        gradeId_name: {
          gradeId: dto.gradeId,
          name: dto.name,
        },
      },
      create: {
        schoolId,
        gradeId: dto.gradeId,
        name: dto.name,
        capacity: dto.capacity ?? null,
      },
      update: {
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        status: RecordStatus.ACTIVE,
      },
    })
    invalidateSchoolCache(schoolId)
    return section
  }

  /** Actualiza una sección existente */
  async updateSection(schoolId: string, id: string, dto: UpdateSectionDto) {
    const section = await prisma.section.findFirst({ where: { id, schoolId } })
    if (!section) throw new NotFoundException('Section not found')
    if (dto.gradeId) {
      const grade = await prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } })
      if (!grade) throw new NotFoundException('Grade not found')
    }

    const updated = await prisma.section.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.gradeId && { gradeId: dto.gradeId }),
        ...(dto.status && { status: dto.status as RecordStatus }),
      },
    })
    invalidateSchoolCache(schoolId)
    return updated
  }

  /** Desactiva una sección (borrado lógico) */
  async deleteSection(schoolId: string, id: string) {
    const section = await prisma.section.findFirst({ where: { id, schoolId } })
    if (!section) throw new NotFoundException('Section not found')

    const updated = await prisma.section.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
    invalidateSchoolCache(schoolId)
    return updated
  }

  /** Obtiene todas las materias del colegio */
  findAllSubjects(schoolId: string) {
    return withCache(`subjects:${schoolId}`, () =>
      prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } })
    )
  }

  /** Crea una nueva materia */
  async createSubject(schoolId: string, dto: CreateSubjectDto) {
    const subject = await prisma.subject.upsert({
      where: {
        schoolId_code: {
          schoolId,
          code: dto.code,
        },
      },
      create: {
        schoolId,
        name: dto.name,
        code: dto.code,
        description: dto.description ?? null,
        credits: dto.credits ?? null,
      },
      update: {
        name: dto.name,
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.credits !== undefined && { credits: dto.credits }),
        status: RecordStatus.ACTIVE,
      },
    })
    invalidateSchoolCache(schoolId)
    return subject
  }

  /** Asigna una materia a una sección con un profesor, validando todas las referencias */
  async assignSubject(schoolId: string, dto: AssignSubjectDto, appUserId?: string) {
    const schoolYear = dto.schoolYearId
      ? await prisma.schoolYear.findFirst({ where: { id: dto.schoolYearId, schoolId } })
      : null
    const resolvedSchoolYear = schoolYear ?? await resolveSchoolYear(schoolId)

    const [grade, section, subject, teacher] = await Promise.all([
      prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } }),
      prisma.section.findFirst({ where: { id: dto.sectionId, schoolId, gradeId: dto.gradeId } }),
      prisma.subject.findFirst({ where: { id: dto.subjectId, schoolId } }),
      dto.teacherId
        ? prisma.teacher.findFirst({ where: { id: dto.teacherId, schoolId } })
        : appUserId
          ? prisma.teacher.findFirst({ where: { userId: appUserId, schoolId, status: RecordStatus.ACTIVE } })
          : Promise.resolve(null),
    ])
    if (!grade) throw new NotFoundException('Grade not found')
    if (!section) throw new NotFoundException('Section not found')
    if (!subject) throw new NotFoundException('Subject not found')
    if (dto.teacherId && !teacher) throw new NotFoundException('Teacher not found')

    const assignment = await prisma.sectionSubject.upsert({
      where: {
        schoolYearId_sectionId_subjectId: {
          schoolYearId: resolvedSchoolYear.id,
          sectionId: dto.sectionId,
          subjectId: dto.subjectId,
        },
      },
      create: {
        sectionId: dto.sectionId,
        subjectId: dto.subjectId,
        teacherId: teacher?.id ?? null,
        gradeId: dto.gradeId,
        schoolYearId: resolvedSchoolYear.id,
        schoolId,
      },
      update: {
        teacherId: teacher?.id ?? null,
        gradeId: dto.gradeId,
        schoolId,
        status: RecordStatus.ACTIVE,
      },
    })
    invalidateSchoolCache(schoolId)
    return assignment
  }

  /** Obtiene las asignaciones materia-sección activas */
  getSectionSubjects(schoolId: string) {
    return withCache(`sectionSubjects:${schoolId}`, () =>
      prisma.sectionSubject.findMany({
        where: { schoolId, status: 'ACTIVE' },
      })
    )
  }

  /** Desactiva una asignación materia-sección (borrado lógico) */
  async removeSectionSubject(schoolId: string, id: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id, schoolId } })
    if (!ss) throw new NotFoundException('Section subject not found')

    const updated = await prisma.sectionSubject.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
    invalidateSchoolCache(schoolId)
    return updated
  }

  /** Guarda solo preferencias visuales; no modifica identidad ni datos académicos. */
  async updateSectionSubjectAppearance(
    schoolId: string,
    id: string,
    dto: UpdateSectionSubjectAppearanceDto,
  ) {
    const assignment = await prisma.sectionSubject.findFirst({ where: { id, schoolId } })
    if (!assignment) throw new NotFoundException('Asignatura no encontrada')

    const updated = await prisma.sectionSubject.update({
      where: { id },
      data: {
        appearanceColor: dto.color ?? null,
        appearanceIcon: dto.icon ?? null,
      },
    })
    invalidateSchoolCache(schoolId)
    return updated
  }

  /** Restaura una asignatura archivada dentro de su curso. */
  async restoreSectionSubject(schoolId: string, id: string) {
    const assignment = await prisma.sectionSubject.findFirst({ where: { id, schoolId } })
    if (!assignment) throw new NotFoundException('Asignatura archivada no encontrada')

    const restored = await prisma.sectionSubject.update({
      where: { id },
      data: { status: RecordStatus.ACTIVE },
    })
    invalidateSchoolCache(schoolId)
    return restored
  }

  /** Elimina definitivamente una asignatura archivada y todo su historial académico asociado. */
  async permanentlyDeleteSectionSubject(schoolId: string, id: string, confirmation?: string) {
    const assignment = await prisma.sectionSubject.findFirst({
      where: { id, schoolId },
      include: {
        subject: { select: { name: true } },
        _count: {
          select: {
            attendanceClasses: true,
            gradesRecords: true,
            evaluationActivities: true,
            courseTeams: true,
            scheduleEntries: true,
            planningEntries: true,
          },
        },
      },
    })
    if (!assignment) throw new NotFoundException('Asignatura archivada no encontrada')
    const relatedDataCount = Object.values(assignment._count).reduce((total, count) => total + count, 0)
    if (assignment.status === RecordStatus.ACTIVE && relatedDataCount > 0) {
      throw new BadRequestException('Esta asignatura contiene información y solo puede archivarse')
    }
    if (assignment.status === RecordStatus.INACTIVE && relatedDataCount > 0 && confirmation !== assignment.subject.name) {
      throw new BadRequestException('Escribe el nombre exacto de la asignatura para confirmar la eliminación')
    }

    await prisma.$transaction(async (tx) => {
      const activities = await tx.evaluationActivity.findMany({
        where: { schoolId, sectionSubjectId: id },
        select: { id: true },
      })
      const activityIds = activities.map((activity) => activity.id)
      const groups = activityIds.length
        ? await tx.evaluationActivityGroup.findMany({
          where: { activityId: { in: activityIds } },
          select: { id: true },
        })
        : []
      const groupIds = groups.map((group) => group.id)
      const gradeRecords = await tx.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId: id },
        select: { id: true },
      })
      const gradeRecordIds = gradeRecords.map((record) => record.id)

      if (groupIds.length) {
        await tx.evaluationActivityGroupMember.deleteMany({ where: { groupId: { in: groupIds } } })
        await tx.evaluationActivityGroup.deleteMany({ where: { id: { in: groupIds } } })
      }
      if (activityIds.length) {
        await tx.evaluationActivityEvidence.deleteMany({ where: { activityId: { in: activityIds } } })
      }
      if (gradeRecordIds.length) {
        await tx.pedagogicalRecovery.deleteMany({ where: { gradeRecordId: { in: gradeRecordIds } } })
      }
      await tx.gradesRecord.deleteMany({ where: { schoolId, sectionSubjectId: id } })
      await tx.evaluationActivity.deleteMany({ where: { schoolId, sectionSubjectId: id } })
      await tx.attendanceClass.deleteMany({ where: { schoolId, sectionSubjectId: id } })
      await tx.scheduleEntry.deleteMany({ where: { schoolId, sectionSubjectId: id } })
      await tx.planningEntry.deleteMany({ where: { schoolId, sectionSubjectId: id } })
      const teams = await tx.courseTeam.findMany({
        where: { schoolId, sectionSubjectId: id },
        select: { id: true },
      })
      const teamIds = teams.map((team) => team.id)
      if (teamIds.length) {
        await tx.courseTeamMember.deleteMany({ where: { teamId: { in: teamIds } } })
        await tx.courseTeam.deleteMany({ where: { id: { in: teamIds } } })
      }
      await tx.sectionSubject.delete({ where: { id } })
    })

    invalidateSchoolCache(schoolId)
    return { deleted: true }
  }

  /** Lista los equipos propios de una asignatura. */
  async getCourseTeams(schoolId: string, sectionSubjectId: string) {
    await this.requireSectionSubject(schoolId, sectionSubjectId)
    return prisma.courseTeam.findMany({
      where: { schoolId, sectionSubjectId, status: RecordStatus.ACTIVE },
      orderBy: [{ orderPosition: 'asc' }, { createdAt: 'asc' }],
      include: {
        members: {
          where: { status: RecordStatus.ACTIVE },
          orderBy: { joinedAt: 'asc' },
          include: { enrollment: { include: { student: true } } },
        },
      },
    })
  }

  /** Crea un equipo y garantiza que un estudiante no esté en dos equipos permanentes. */
  async createCourseTeam(
    schoolId: string,
    userId: string,
    sectionSubjectId: string,
    dto: CreateCourseTeamDto,
  ) {
    const sectionSubject = await this.requireSectionSubject(schoolId, sectionSubjectId)
    await this.validateTeamMembers(
      schoolId,
      sectionSubject.sectionId,
      sectionSubject.schoolYearId,
      dto.members,
    )

    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.courseTeam.count({
        where: { schoolId, sectionSubjectId, status: RecordStatus.ACTIVE },
      })
      const team = await tx.courseTeam.create({
        data: {
          schoolId,
          schoolYearId: sectionSubject.schoolYearId,
          sectionId: sectionSubject.sectionId,
          sectionSubjectId,
          name: dto.name.trim(),
          color: dto.color ?? '#2563eb',
          icon: dto.icon ?? 'users',
          description: dto.description?.trim() ?? '',
          teamType: dto.teamType,
          startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
          endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
          orderPosition: order,
          createdBy: userId,
        },
      })

      await this.syncTeamMembers(tx, team, dto.members)
      return team
    })

    const [team] = await this.getCourseTeams(schoolId, sectionSubjectId)
      .then((teams) => teams.filter((item) => item.id === created.id))
    invalidateSchoolCache(schoolId)
    return team
  }

  /** Actualiza la identidad, vigencia y miembros de un equipo existente. */
  async updateCourseTeam(schoolId: string, id: string, dto: UpdateCourseTeamDto) {
    const existing = await prisma.courseTeam.findFirst({
      where: { id, schoolId, status: RecordStatus.ACTIVE },
    })
    if (!existing) throw new NotFoundException('Equipo no encontrado')

    if (dto.members) {
      await this.validateTeamMembers(
        schoolId,
        existing.sectionId,
        existing.schoolYearId,
        dto.members,
      )
    }

    await prisma.$transaction(async (tx) => {
      const team = await tx.courseTeam.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name.trim() }),
          ...(dto.color !== undefined && { color: dto.color }),
          ...(dto.icon !== undefined && { icon: dto.icon }),
          ...(dto.description !== undefined && { description: dto.description.trim() }),
          ...(dto.teamType !== undefined && { teamType: dto.teamType }),
          ...(dto.startsAt !== undefined && { startsAt: dto.startsAt ? new Date(dto.startsAt) : null }),
          ...(dto.endsAt !== undefined && { endsAt: dto.endsAt ? new Date(dto.endsAt) : null }),
        },
      })

      if (dto.members) await this.syncTeamMembers(tx, team, dto.members)
    })

    if (!existing.sectionSubjectId) throw new BadRequestException('El equipo no tiene una asignatura asociada')
    const teams = await this.getCourseTeams(schoolId, existing.sectionSubjectId)
    invalidateSchoolCache(schoolId)
    return teams.find((team) => team.id === id)
  }

  /** Archiva el equipo y cierra sus membresías activas. */
  async archiveCourseTeam(schoolId: string, id: string) {
    const team = await prisma.courseTeam.findFirst({ where: { id, schoolId } })
    if (!team) throw new NotFoundException('Equipo no encontrado')

    const archived = await prisma.$transaction(async (tx) => {
      await tx.courseTeamMember.updateMany({
        where: { teamId: id, status: RecordStatus.ACTIVE },
        data: { status: RecordStatus.INACTIVE, leftAt: new Date() },
      })
      return tx.courseTeam.update({
        where: { id },
        data: { status: RecordStatus.INACTIVE },
      })
    })
    invalidateSchoolCache(schoolId)
    return archived
  }

  private async requireSectionSubject(schoolId: string, id: string) {
    const sectionSubject = await prisma.sectionSubject.findFirst({
      where: { id, schoolId, status: RecordStatus.ACTIVE },
    })
    if (!sectionSubject) throw new NotFoundException('Curso no encontrado')
    return sectionSubject
  }

  private async requireSection(schoolId: string, id: string) {
    const section = await prisma.section.findFirst({
      where: { id, schoolId, status: RecordStatus.ACTIVE },
    })
    if (!section) throw new NotFoundException('Curso no encontrado')
    return section
  }

  private async validateTeamMembers(
    schoolId: string,
    sectionId: string,
    schoolYearId: string,
    members: Array<{ enrollmentId: string }>,
  ) {
    if (!members.length) return
    const valid = await prisma.enrollment.count({
      where: {
        id: { in: members.map((member) => member.enrollmentId) },
        schoolId,
        sectionId,
        schoolYearId,
        status: RecordStatus.ACTIVE,
      },
    })
    if (valid !== members.length) {
      throw new BadRequestException('Uno o más integrantes no pertenecen a este curso')
    }
  }

  private async syncTeamMembers(
    tx: Prisma.TransactionClient,
    team: { id: string; schoolId: string; schoolYearId: string; sectionId: string; sectionSubjectId: string | null; teamType: string },
    members: Array<{ enrollmentId: string; role?: string }>,
  ) {
    const enrollmentIds = members.map((member) => member.enrollmentId)

    await tx.courseTeamMember.updateMany({
      where: {
        teamId: team.id,
        status: RecordStatus.ACTIVE,
        ...(enrollmentIds.length ? { enrollmentId: { notIn: enrollmentIds } } : {}),
      },
      data: { status: RecordStatus.INACTIVE, leftAt: new Date() },
    })

    if (team.teamType === 'permanent' && enrollmentIds.length) {
      await tx.courseTeamMember.updateMany({
        where: {
          enrollmentId: { in: enrollmentIds },
          status: RecordStatus.ACTIVE,
          teamId: { not: team.id },
          team: {
            schoolId: team.schoolId,
            schoolYearId: team.schoolYearId,
            ...(team.sectionSubjectId ? { sectionSubjectId: team.sectionSubjectId } : { sectionId: team.sectionId }),
            teamType: 'permanent',
            status: RecordStatus.ACTIVE,
          },
        },
        data: { status: RecordStatus.INACTIVE, leftAt: new Date() },
      })
    }

    for (const member of members) {
      await tx.courseTeamMember.upsert({
        where: { teamId_enrollmentId: { teamId: team.id, enrollmentId: member.enrollmentId } },
        create: {
          schoolId: team.schoolId,
          teamId: team.id,
          enrollmentId: member.enrollmentId,
          role: member.role?.trim() || null,
        },
        update: {
          role: member.role?.trim() || null,
          status: RecordStatus.ACTIVE,
          joinedAt: new Date(),
          leftAt: null,
        },
      })
    }
  }
}
