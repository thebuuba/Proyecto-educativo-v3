/**
 * Servicio de grados y secciones
 * @module CoursesService
 * @description Contiene la lógica de negocio para la gestión de grados, secciones,
 * materias y asignación de materias a secciones. Proporciona operaciones CRUD
 * y consultas de datos completos del curso.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, RecordStatus } from '@aula/database'
import { CreateGradeDto } from './dto/create-grade.dto'
import { UpdateGradeDto } from './dto/update-grade.dto'
import { CreateSectionDto } from './dto/create-section.dto'
import { UpdateSectionDto } from './dto/update-section.dto'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { AssignSubjectDto } from './dto/assign-subject.dto'

/** Convierte el valor de estado a minúsculas */
function status(value: string) {
  return value.toLowerCase()
}

/** Devuelve el año escolar activo o el más reciente; si no existe ninguno, crea uno por defecto */
async function resolveSchoolYear(schoolId: string) {
  let sy = await prisma.schoolYear.findFirst({
    where: { schoolId, isCurrent: true },
    select: { id: true, name: true },
  })
  if (sy) return sy
  sy = await prisma.schoolYear.findFirst({
    where: { schoolId, status: 'ACTIVE' },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  })
  if (sy) return sy
  sy = await prisma.schoolYear.findFirst({
    where: { schoolId },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  })
  if (sy) return sy
  const year = new Date().getFullYear()
  return prisma.schoolYear.create({
    data: {
      schoolId,
      name: `${year}-${year + 1}`,
      startDate: new Date(year, 7, 1),
      endDate: new Date(year + 1, 6, 31),
      isCurrent: true,
    },
    select: { id: true, name: true },
  })
}

@Injectable()
export class CoursesService {
  /** Obtiene los datos completos del curso: grados, secciones, asignaciones, catálogos y año escolar actual */
  async getCourseData(schoolId: string) {
    const currentSchoolYear = await resolveSchoolYear(schoolId)

    const grades = await prisma.grade.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
    const sections = await prisma.section.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { name: 'asc' },
    })
    const assignments = await prisma.sectionSubject.findMany({
      where: { schoolId, status: 'ACTIVE' },
    })
    const subjects = await prisma.subject.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { name: 'asc' } })
    const academicLevels = await prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } })
    const cycles = await prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } })
    const modalities = await prisma.drModality.findMany({ orderBy: { name: 'asc' } })
    const teachers = await prisma.teacher.findMany({
      where: { schoolId, status: 'ACTIVE' },
    })

    const levelById = new Map(academicLevels.map((item) => [item.id, item]))
    const cycleById = new Map(cycles.map((item) => [item.id, item]))
    const modalityById = new Map(modalities.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const teacherById = new Map(teachers.map((item) => [item.id, item]))

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
    return prisma.drAcademicLevel.findMany({ orderBy: { sequence: 'asc' } })
  }

  /** Obtiene los ciclos académicos del sistema */
  getCycles() {
    return prisma.drAcademicCycle.findMany({ orderBy: { name: 'asc' } })
  }

  /** Obtiene las modalidades del sistema */
  getModalities() {
    return prisma.drModality.findMany({ orderBy: { name: 'asc' } })
  }

  /** Obtiene los profesores activos del colegio */
  getTeachers(schoolId: string) {
    return prisma.teacher.findMany({ where: { schoolId, status: 'ACTIVE' }, orderBy: { firstName: 'asc' } })
  }

  /** Obtiene todos los grados del colegio */
  findAllGrades(schoolId: string) {
    return prisma.grade.findMany({ where: { schoolId }, orderBy: { sequence: 'asc' } })
  }

  /** Crea un nuevo grado */
  createGrade(schoolId: string, dto: CreateGradeDto) {
    return prisma.grade.create({
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
  }

  /** Actualiza un grado existente */
  async updateGrade(schoolId: string, id: string, dto: UpdateGradeDto) {
    const grade = await prisma.grade.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.grade.update({
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
  }

  /** Desactiva un grado (borrado lógico) */
  async deleteGrade(schoolId: string, id: string) {
    const grade = await prisma.grade.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.grade.update({
      where: { id },
      data: { status: RecordStatus.INACTIVE },
    })
  }

  /** Obtiene las secciones activas de un grado */
  findSectionsByGrade(schoolId: string, gradeId: string) {
    return prisma.section.findMany({
      where: { schoolId, gradeId, status: RecordStatus.ACTIVE },
      orderBy: { name: 'asc' },
    })
  }

  /** Crea una nueva sección validando el grado */
  async createSection(schoolId: string, dto: CreateSectionDto) {
    const grade = await prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } })
    if (!grade) throw new NotFoundException('Grade not found')

    return prisma.section.create({
      data: {
        schoolId,
        gradeId: dto.gradeId,
        name: dto.name,
        capacity: dto.capacity ?? null,
      },
    })
  }

  /** Actualiza una sección existente */
  async updateSection(schoolId: string, id: string, dto: UpdateSectionDto) {
    const section = await prisma.section.findFirst({ where: { id, schoolId } })
    if (!section) throw new NotFoundException('Section not found')
    if (dto.gradeId) {
      const grade = await prisma.grade.findFirst({ where: { id: dto.gradeId, schoolId } })
      if (!grade) throw new NotFoundException('Grade not found')
    }

    return prisma.section.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.gradeId && { gradeId: dto.gradeId }),
        ...(dto.status && { status: dto.status as RecordStatus }),
      },
    })
  }

  /** Desactiva una sección (borrado lógico) */
  async deleteSection(schoolId: string, id: string) {
    const section = await prisma.section.findFirst({ where: { id, schoolId } })
    if (!section) throw new NotFoundException('Section not found')

    return prisma.section.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }

  /** Obtiene todas las materias del colegio */
  findAllSubjects(schoolId: string) {
    return prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } })
  }

  /** Crea una nueva materia */
  createSubject(schoolId: string, dto: CreateSubjectDto) {
    return prisma.subject.create({
      data: {
        schoolId,
        name: dto.name,
        code: dto.code,
        description: dto.description ?? null,
        credits: dto.credits ?? null,
      },
    })
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

    return prisma.sectionSubject.create({
      data: {
        sectionId: dto.sectionId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId ?? null,
        gradeId: dto.gradeId,
        schoolYearId: resolvedSchoolYear.id,
        schoolId,
      },
    })
  }

  /** Obtiene las asignaciones materia-sección activas */
  getSectionSubjects(schoolId: string) {
    return prisma.sectionSubject.findMany({
      where: { schoolId, status: 'ACTIVE' },
    })
  }

  /** Desactiva una asignación materia-sección (borrado lógico) */
  async removeSectionSubject(schoolId: string, id: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id, schoolId } })
    if (!ss) throw new NotFoundException('Section subject not found')

    return prisma.sectionSubject.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })
  }
}
