/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para la gestión de calificaciones
 * de los estudiantes en las distintas materias y períodos académicos.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@aula/database'
import { SaveGradeDto } from './dto/save-grade.dto'
import { SaveEvaluationActivityDto } from './dto/save-evaluation-activity.dto'

const baseGradingPeriods = [
  { name: 'P1 — Agosto, septiembre y octubre', sequence: 1, startMonth: 8, startDay: 1, endMonth: 10, endDay: 31 },
  { name: 'P2 — Noviembre, diciembre y enero', sequence: 2, startMonth: 11, startDay: 1, endMonth: 1, endDay: 31 },
  { name: 'P3 — Febrero, marzo y abril', sequence: 3, startMonth: 2, startDay: 1, endMonth: 4, endDay: 30 },
  { name: 'P4 — Mayo', sequence: 4, startMonth: 5, startDay: 1, endMonth: 5, endDay: 31 },
]

function mapEvaluationActivity(activity: any) {
  return {
    id: activity.id,
    name: activity.name,
    competencyBlockId: activity.competencyBlockId,
    maxScore: Number(activity.maxScore),
    date: activity.activityDate ? activity.activityDate.toISOString().slice(0, 10) : undefined,
    description: activity.description || undefined,
    studentRole: activity.studentRole || undefined,
    teacherRole: activity.teacherRole || undefined,
    instrumentType: activity.instrument?.type || undefined,
    instrumentId: activity.instrumentId ?? undefined,
    evaluationTechnique: activity.evaluationTechnique || undefined,
    observations: activity.observations || undefined,
    evidenceInstructions: activity.evidenceInstructions || undefined,
    activityType: activity.activityType,
    planningId: activity.planningEntryId ?? undefined,
    planningMoment: activity.planningMoment ?? '',
    source: activity.source,
  }
}

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
export class GradingService {
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
      evaluationActivityId: grade.evaluationActivityId,
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
    const items = await prisma.sectionSubject.findMany({ where: { schoolId, status: 'ACTIVE' } })
    const subjects = await prisma.subject.findMany({ where: { schoolId } })
    const sections = await prisma.section.findMany({ where: { schoolId } })
    const grades = await prisma.grade.findMany({ where: { schoolId } })
    const academicLevels = await prisma.drAcademicLevel.findMany({ where: { status: 'ACTIVE' } })
    const schoolYears = await prisma.schoolYear.findMany({ where: { schoolId } })
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const academicLevelById = new Map(academicLevels.map((item) => [item.id, item]))
    const schoolYearById = new Map(schoolYears.map((item) => [item.id, item]))

    return items.map((item) => {
      const subject = subjectById.get(item.subjectId)
      const section = sectionById.get(item.sectionId)
      const grade = section ? gradeById.get(section.gradeId) : null
      const academicLevel = grade?.academicLevelId ? academicLevelById.get(grade.academicLevelId) : null
      return {
        id: item.id,
        subjectName: subject?.name ?? '',
        sectionName: section?.name ?? '',
        gradeName: grade?.name ?? '',
        gradeSequence: grade?.sequence ?? null,
        academicLevelName: academicLevel?.name ?? grade?.level ?? '',
        academicLevelSequence: academicLevel?.sequence ?? null,
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
      include: { student: true },
    })

    const grades = await prisma.gradesRecord.findMany({
      where: { schoolId, sectionSubjectId, academicPeriodId },
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
        evaluationActivityId: grade.evaluationActivityId,
      })),
      students: enrollments
        .map((enr) => ({
          enrollmentId: enr.id,
          studentId: enr.studentId,
          studentCode: enr.student.studentCode ?? '',
          firstName: enr.student.firstName ?? '',
          lastName: enr.student.lastName ?? '',
        }))
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
  async saveGrade(schoolId: string, dto: SaveGradeDto) {
    if (dto.gradeId) {
      const grade = await prisma.gradesRecord.findFirst({ where: { id: dto.gradeId, schoolId } })
      if (!grade) throw new NotFoundException('Grade record not found')
      return prisma.gradesRecord.update({
        where: { id: dto.gradeId },
        data: {
          score: dto.score,
          maxScore: dto.maxScore,
          weight: dto.weight,
          assessmentName: dto.assessmentName,
          evaluationActivityId: dto.evaluationActivityId ?? undefined,
        },
      })
    }
    const enrollment = await prisma.enrollment.findFirst({ where: { id: dto.enrollmentId!, schoolId } })
    const sectionSubject = await prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId!, schoolId } })
    const academicPeriod = await prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId!, schoolId } })
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    return prisma.gradesRecord.create({
      data: {
        enrollmentId: dto.enrollmentId!,
        sectionSubjectId: dto.sectionSubjectId!,
        academicPeriodId: dto.academicPeriodId!,
        sectionId: enrollment.sectionId,
        schoolYearId: enrollment.schoolYearId,
        schoolId,
        score: dto.score,
        maxScore: dto.maxScore,
        weight: dto.weight ?? 1,
        assessmentName: dto.assessmentName ?? '',
        evaluationActivityId: dto.evaluationActivityId ?? undefined,
      },
    })
  }

  async getActivities(
    schoolId: string,
    filters: { sectionSubjectId?: string; academicPeriodId?: string; planningEntryId?: string },
  ) {
    const where: any = { schoolId, status: 'ACTIVE' }
    if (filters.sectionSubjectId) where.sectionSubjectId = filters.sectionSubjectId
    if (filters.academicPeriodId) where.academicPeriodId = filters.academicPeriodId
    if (filters.planningEntryId) where.planningEntryId = filters.planningEntryId

    const activities = await prisma.evaluationActivity.findMany({
      where,
      include: { instrument: true },
      orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
    })

    return activities.map(mapEvaluationActivity)
  }

  async saveActivity(schoolId: string, userId: string, dto: SaveEvaluationActivityDto) {
    const sectionSubject = await prisma.sectionSubject.findFirst({
      where: { id: dto.sectionSubjectId, schoolId },
    })
    if (!sectionSubject) throw new NotFoundException('Section subject not found')

    const academicPeriod = await prisma.academicPeriod.findFirst({
      where: { id: dto.academicPeriodId, schoolId },
    })
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const data = {
      schoolId,
      schoolYearId: dto.schoolYearId ?? sectionSubject.schoolYearId,
      sectionSubjectId: dto.sectionSubjectId,
      academicPeriodId: dto.academicPeriodId,
      planningEntryId: dto.planningEntryId || null,
      instrumentId: dto.instrumentId || null,
      competencyBlockId: dto.competencyBlockId,
      planningMoment: dto.planningMoment || null,
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      activityType: dto.activityType ?? 'individual',
      maxScore: dto.maxScore,
      activityDate: dto.date ? new Date(`${dto.date}T00:00:00.000Z`) : null,
      evaluationTechnique: dto.evaluationTechnique?.trim() ?? '',
      studentRole: dto.studentRole?.trim() ?? '',
      teacherRole: dto.teacherRole?.trim() ?? '',
      evidenceInstructions: dto.evidenceInstructions?.trim() ?? '',
      observations: dto.observations?.trim() ?? '',
      source: dto.source ?? (dto.planningEntryId ? 'planning' : 'grading'),
      createdBy: userId,
    }

    if (dto.id) {
      const existing = await prisma.evaluationActivity.findFirst({ where: { id: dto.id, schoolId } })
      if (!existing) throw new NotFoundException('Evaluation activity not found')
      const updated = await prisma.evaluationActivity.update({
        where: { id: dto.id },
        data,
        include: { instrument: true },
      })
      return mapEvaluationActivity(updated)
    }

    const created = await prisma.evaluationActivity.create({
      data,
      include: { instrument: true },
    })
    return mapEvaluationActivity(created)
  }

  async linkActivityToPlanning(
    schoolId: string,
    id: string,
    dto: { planningEntryId: string | null; planningMoment?: string },
  ) {
    const activity = await prisma.evaluationActivity.findFirst({ where: { id, schoolId } })
    if (!activity) throw new NotFoundException('Evaluation activity not found')
    if (dto.planningEntryId) {
      const planning = await prisma.planningEntry.findFirst({ where: { id: dto.planningEntryId, schoolId } })
      if (!planning) throw new NotFoundException('Planning entry not found')
    }
    const updated = await prisma.evaluationActivity.update({
      where: { id },
      data: {
        planningEntryId: dto.planningEntryId,
        planningMoment: dto.planningMoment || null,
        source: dto.planningEntryId ? 'planning' : activity.source,
      },
      include: { instrument: true },
    })
    return mapEvaluationActivity(updated)
  }

  async deleteActivity(schoolId: string, id: string) {
    const activity = await prisma.evaluationActivity.findFirst({ where: { id, schoolId } })
    if (!activity) throw new NotFoundException('Evaluation activity not found')
    return prisma.evaluationActivity.update({
      where: { id },
      data: { status: 'INACTIVE' },
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
