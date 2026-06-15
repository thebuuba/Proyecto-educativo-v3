/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para la gestión de calificaciones
 * de los estudiantes en las distintas materias y períodos académicos.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'

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
  findAll(schoolId: string, sectionSubjectId?: string, academicPeriodId?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (academicPeriodId) where.academicPeriodId = academicPeriodId
    return prisma.gradesRecord.findMany({ where })
  }

  /**
   * Obtiene las materias asignadas a cada sección con los nombres
   * de materia, sección y grado resueltos.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de materias de sección con datos descriptivos.
   */
  async getSectionSubjects(schoolId: string) {
    const [items, subjects, sections, grades] = await Promise.all([
      prisma.sectionSubject.findMany({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.subject.findMany({ where: { schoolId } }),
      prisma.section.findMany({ where: { schoolId } }),
      prisma.grade.findMany({ where: { schoolId } }),
    ])
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))

    return items.map((item) => {
      const subject = subjectById.get(item.subjectId)
      const section = sectionById.get(item.sectionId)
      const grade = section ? gradeById.get(section.gradeId) : null
      return {
        id: item.id,
        subjectName: subject?.name ?? '',
        sectionName: section?.name ?? '',
        gradeName: grade?.name ?? '',
      }
    })
  }

  /**
   * Obtiene los períodos académicos activos ordenados por secuencia.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de períodos académicos activos.
   */
  getAcademicPeriods(schoolId: string) {
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

    const gradeMap = new Map(grades.map((g) => [g.enrollmentId, g]))

    return {
      sectionId: ss.sectionId,
      schoolYearId: ss.schoolYearId,
      students: enrollments.map((enr) => {
        const student = students.find((s) => s.id === enr.studentId)
        const existing = gradeMap.get(enr.id)
        return {
          enrollmentId: enr.id,
          studentId: enr.studentId,
          studentCode: student?.studentCode ?? '',
          firstName: student?.firstName ?? '',
          lastName: student?.lastName ?? '',
          gradeId: existing?.id ?? null,
          score: existing?.score ?? null,
          maxScore: existing?.maxScore ?? 10,
          weight: existing?.weight ?? 1,
          assessmentName: existing?.assessmentName ?? '',
          status: existing?.status ?? null,
        }
      }),
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
}
