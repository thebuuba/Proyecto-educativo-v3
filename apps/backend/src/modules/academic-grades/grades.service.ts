/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para la gestión de calificaciones
 * de los estudiantes en las distintas materias y períodos académicos.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

const baseGradingPeriods = [
  { name: 'P1 — Agosto, septiembre y octubre', sequence: 1, startMonth: 8, startDay: 1, endMonth: 10, endDay: 31 },
  { name: 'P2 — Noviembre, diciembre y enero', sequence: 2, startMonth: 11, startDay: 1, endMonth: 1, endDay: 31 },
  { name: 'P3 — Febrero, marzo y abril', sequence: 3, startMonth: 2, startDay: 1, endMonth: 4, endDay: 30 },
  { name: 'P4 — Mayo', sequence: 4, startMonth: 5, startDay: 1, endMonth: 5, endDay: 31 },
]

function periodDate(schoolYearStart: Date, month: number, day: number) {
  const startYear = schoolYearStart.getUTCFullYear()
  const year = month >= 8 ? startYear : startYear + 1
  return new Date(Date.UTC(year, month - 1, day))
}

/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para el registro y consulta de
 * calificaciones de los estudiantes en las distintas materias.
 */
@Injectable()
export class GradesService {
  /**
   * Obtiene los registros de calificaciones, opcionalmente filtrados
   * por materia de sección y período académico.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionSubjectId - Identificador de la materia de la sección (opcional).
   * @param academicPeriodId - Identificador del período académico (opcional).
   * @returns Lista de registros de calificaciones.
   */
  async findAll(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    const records = await prisma.gradesRecord.findMany({ where })
    return records.map((grade) => ({
      id: grade.id,
      enrollmentId: grade.enrollmentId,
      score: Number(grade.score),
      maxScore: Number(grade.maxScore),
      weight: Number(grade.weight),
      assessmentName: grade.assessmentName,
      status: grade.status.toLowerCase(),
    }))
  }

  /**
   * Obtiene las materias asignadas a cada sección con los nombres
   * de materia, sección y grado resueltos.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de materias de sección con datos descriptivos.
   */
  async getSectionSubjects(schoolId: string) {
    const [items, subjects, sections, grades, schoolYears] = await Promise.all([
      prisma.sectionSubject.findMany({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.section.findMany({ where: { schoolId } }),
      prisma.grade.findMany({ where: { schoolId } }),
      prisma.schoolYear.findMany({ where: { schoolId } }),
    ])
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const schoolYearById = new Map(schoolYears.map((item) => [item.id, item]))

    return items.map((item) => {
      const subject = subjectById.get(item.subjectId)
      const section = sectionById.get(item.sectionId)
      const grade = section ? gradeById.get(section.gradeId) : null
      return {
        id: item.id,
        subjectName: subject?.name ?? '',
        sectionName: section?.name ?? '',
        gradeName: grade?.name ?? '',
        sectionId: item.sectionId,
        schoolYearId: item.schoolYearId,
        schoolYearName: schoolYearById.get(item.schoolYearId)?.name ?? '',
      }
    })
  }

  /**
   * Obtiene los períodos académicos activos ordenados por secuencia.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de períodos académicos activos.
   */
  async getAcademicPeriods(schoolId: string) {
    const existing = await prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
    if (existing.length > 0) return existing

    const schoolYear = await prisma.schoolYear.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    })
    if (!schoolYear) return []

    await prisma.academicPeriod.createMany({
      data: baseGradingPeriods.map((period) => ({
        schoolId,
        schoolYearId: schoolYear.id,
        name: period.name,
        sequence: period.sequence,
        startDate: periodDate(schoolYear.startDate, period.startMonth, period.startDay),
        endDate: periodDate(schoolYear.startDate, period.endMonth, period.endDay),
      })),
      skipDuplicates: true,
    })

    return prisma.academicPeriod.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  /**
   * Obtiene los estudiantes de una materia y período académico para calificar.
   *
   * Incluye las calificaciones existentes de cada estudiante para
   * facilitar la edición en la interfaz de usuario.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param academicPeriodId - Identificador del período académico.
   * @returns Lista de estudiantes con sus calificaciones existentes.
   * @throws NotFoundException si la materia o el período académico no existen.
   */
  async getStudentsForGrading(schoolId: string, sectionSubjectId: string, academicPeriodId: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id: sectionSubjectId, schoolId } })
    if (!ss) throw new NotFoundException('Section subject not found')
    const academicPeriod = await prisma.academicPeriod.findFirst({ where: { id: academicPeriodId, schoolId } })
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
    })

    const grades = await prisma.gradesRecord.findMany({
      where: { schoolId, sectionSubjectId, academicPeriodId },
    })

    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: enrollments.map((e) => e.studentId) } },
    })

    return {
      sectionId: ss.sectionId,
      schoolYearId: ss.schoolYearId,
      gradeRecords: grades.map((grade) => ({
        id: grade.id,
        enrollmentId: grade.enrollmentId,
        score: Number(grade.score),
        maxScore: Number(grade.maxScore),
        weight: Number(grade.weight),
        assessmentName: grade.assessmentName,
        status: grade.status.toLowerCase(),
      })),
      students: enrollments
        .map((enr) => {
          const student = students.find((s) => s.id === enr.studentId)
          return {
            enrollmentId: enr.id,
            studentId: enr.studentId,
            studentCode: student?.studentCode ?? '',
            firstName: student?.firstName ?? '',
            lastName: student?.lastName ?? '',
          }
        })
        .sort((first, second) => {
          const lastName = first.lastName.localeCompare(second.lastName, 'es')
          if (lastName !== 0) return lastName
          return first.firstName.localeCompare(second.firstName, 'es')
        })
        .map((student, index) => ({ ...student, listNumber: index + 1 })),
    }
  }

  /**
   * Guarda o actualiza una calificación.
   *
   * Si se proporciona un gradeId, actualiza la calificación existente.
   * En caso contrario, crea una nueva validando que la matrícula,
   * la materia y el período académico existan.
   *
   * @param schoolId - Identificador del colegio.
   * @param input - Datos de la calificación a guardar o actualizar.
   * @returns La calificación creada o actualizada.
   * @throws NotFoundException si el registro o alguna entidad relacionada no existe.
   */
  async saveGrade(schoolId: string, input: any) {
    if (input.gradeId) {
      const grade = await prisma.gradesRecord.findFirst({ where: { id: input.gradeId, schoolId } })
      if (!grade) throw new NotFoundException('Grade record not found')
      return prisma.gradesRecord.update({
        where: { id: input.gradeId },
        data: {
          score: input.score,
          maxScore: input.maxScore,
          weight: input.weight,
          assessmentName: input.assessmentName,
        },
      })
    }
    const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: input.enrollmentId, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: input.sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: input.academicPeriodId, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    return prisma.gradesRecord.create({
      data: {
        enrollmentId: input.enrollmentId,
        sectionSubjectId: input.sectionSubjectId,
        academicPeriodId: input.academicPeriodId,
        sectionId: enrollment.sectionId,
        schoolYearId: enrollment.schoolYearId,
        schoolId,
        score: input.score,
        maxScore: input.maxScore,
        weight: input.weight ?? 1,
        assessmentName: input.assessmentName ?? '',
      },
    })
  }

  /**
   * Obtiene todas las calificaciones de un estudiante.
   *
   * @param schoolId - Identificador del colegio.
   * @param studentId - Identificador del estudiante.
   * @returns Lista de registros de calificaciones del estudiante.
   */
  async findByStudent(schoolId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, studentId },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.gradesRecord.findMany({
      where: { schoolId, enrollmentId: { in: enrollmentIds } },
    })
  }

  async deleteGrade(schoolId: string, id: string) {
    const grade = await prisma.gradesRecord.findFirst({ where: { id, schoolId } })
    if (!grade) throw new NotFoundException('Grade record not found')
    return prisma.gradesRecord.delete({ where: { id } })
  }
}
