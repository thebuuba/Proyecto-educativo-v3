/**
 * Servicio de grados y secciones
 * @module CoursesService
 * @description Contiene la lógica de negocio para la gestión de grados, secciones,
 * materias y asignación de materias a secciones. Proporciona operaciones CRUD
 * y consultas de datos completos del curso.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, RecordStatus } from '@aula/database'
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
  async getCourseData(schoolId: string) {
    return optionCache.withCache(
      optionCacheKeys.courses.courseData(schoolId),
      () => this._getCourseData(schoolId),
    )
  }

  private async _getCourseData(schoolId: string) {
    const currentSchoolYear = await resolveSchoolYear(schoolId)

    const [grades, sections, assignments, enrollmentCounts, subjects, academicLevels, cycles, modalities, teachers] = await Promise.all([
      prisma.grade.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { sequence: 'asc' } }),
      prisma.section.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { name: 'asc' } }),
      prisma.sectionSubject.findMany({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.enrollment.groupBy({
        by: ['sectionId'],
        where: { schoolId, schoolYearId: currentSchoolYear.id, status: 'ACTIVE' },
        _count: { id: true },
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
    const studentCountBySectionId = new Map(
      enrollmentCounts.map((item) => [item.sectionId, item._count.id]),
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
            assignments: assignments
              .filter((assignment) => assignment.sectionId === section.id)
              .map((assignment) => {
                const subject = subjectById.get(assignment.subjectId)
                const teacher = assignment.teacherId ? teacherById.get(assignment.teacherId) : null
                return {
                  id: assignment.id,
                  sectionId: assignment.sectionId,
                  gradeId: assignment.gradeId,
                  subjectId: assignment.subjectId,
                  subjectCode: subject?.code ?? '',
                  subjectName: subject?.name ?? '',
                  teacherId: assignment.teacherId,
                  teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : null,
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
  async assignSubject(schoolId: string, dto: AssignSubjectDto) {
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
        teacherId: dto.teacherId ?? null,
        gradeId: dto.gradeId,
        schoolYearId: resolvedSchoolYear.id,
        schoolId,
      },
      update: {
        teacherId: dto.teacherId ?? null,
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
}
