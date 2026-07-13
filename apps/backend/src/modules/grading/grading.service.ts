/**
 * Servicio de calificaciones académicas.
 *
 * Implementa la lógica de negocio para la gestión de calificaciones
 * de los estudiantes en las distintas materias y períodos académicos.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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

function mapGradeRecord(grade: any) {
  return {
    id: grade.id,
    enrollmentId: grade.enrollmentId,
    score: Number(grade.score),
    maxScore: Number(grade.maxScore),
    weight: Number(grade.weight),
    assessmentName: grade.assessmentName,
    status: grade.status.toLowerCase(),
    evaluationActivityId: grade.evaluationActivityId,
  }
}

function mapStudentEnrollment(enrollment: any) {
  return {
    enrollmentId: enrollment.id,
    studentId: enrollment.studentId,
    studentCode: enrollment.student.studentCode ?? '',
    firstName: enrollment.student.firstName ?? '',
    lastName: enrollment.student.lastName ?? '',
  }
}

function periodDate(schoolYearStart: Date, month: number, day: number) {
  const startYear = schoolYearStart.getUTCFullYear()
  const year = month >= 8 ? startYear : startYear + 1
  return new Date(Date.UTC(year, month - 1, day))
}

async function assertEvaluationActivityScope(
  schoolId: string,
  evaluationActivityId: string,
  sectionSubjectId: string,
  academicPeriodId: string,
) {
  const activity = await prisma.evaluationActivity.findFirst({
    where: { id: evaluationActivityId, schoolId, status: 'ACTIVE' },
  })
  if (!activity) throw new NotFoundException('Evaluation activity not found')
  if (activity.sectionSubjectId !== sectionSubjectId || activity.academicPeriodId !== academicPeriodId) {
    throw new BadRequestException('Evaluation activity does not match grading context')
  }
}

async function assertPlanningEntryScope(
  schoolId: string,
  planningEntryId: string,
  sectionSubjectId: string,
  academicPeriodId: string,
) {
  const planning = await prisma.planningEntry.findFirst({ where: { id: planningEntryId, schoolId } })
  if (!planning) throw new NotFoundException('Planning entry not found')
  if (planning.sectionSubjectId !== sectionSubjectId || planning.academicPeriodId !== academicPeriodId) {
    throw new BadRequestException('Planning entry does not match activity context')
  }
}

async function assertInstrumentScope(schoolId: string, instrumentId: string) {
  const instrument = await prisma.evaluationInstrument.findFirst({
    where: { id: instrumentId, schoolId, status: 'ACTIVE' },
  })
  if (!instrument) throw new NotFoundException('Evaluation instrument not found')
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
    return records.map(mapGradeRecord)
  }

  /**
   * Obtiene las materias asignadas a cada sección con los nombres
   * de materia, sección y grado resueltos.
   *
   * @param schoolId - Identificador del colegio.
   * @returns Lista de materias de sección con datos descriptivos.
   */
  async getSectionSubjects(schoolId: string) {
    const items = await prisma.sectionSubject.findMany({
      where: { schoolId, status: 'ACTIVE' },
      select: {
        id: true,
        sectionId: true,
        schoolYearId: true,
        subject: { select: { name: true } },
        section: { select: { name: true } },
        grade: {
          select: {
            name: true,
            sequence: true,
            level: true,
            academicLevel: { select: { name: true, sequence: true } },
          },
        },
        schoolYear: { select: { name: true } },
      },
    })

    return items.map((item) => {
      return {
        id: item.id,
        subjectName: item.subject.name,
        sectionName: item.section.name,
        gradeName: item.grade.name,
        gradeSequence: item.grade.sequence,
        academicLevelName: item.grade.academicLevel?.name ?? item.grade.level ?? '',
        academicLevelSequence: item.grade.academicLevel?.sequence ?? null,
        sectionId: item.sectionId,
        schoolYearId: item.schoolYearId,
        schoolYearName: item.schoolYear.name,
      }
    })
  }

  /**
   * Devuelve en un solo viaje las opciones y los datos editables del libro de
   * calificaciones. En cambios de período/curso las opciones pueden omitirse.
   */
  async getWorkspace(
    schoolId: string,
    sectionSubjectId?: string,
    academicPeriodId?: string,
    includeOptions = true,
  ) {
    if (includeOptions) {
      const [sectionSubjects, allPeriods] = await Promise.all([
        this.getSectionSubjects(schoolId),
        this.getAcademicPeriods(schoolId),
      ])
      const selectedSectionSubject = sectionSubjects.find((item) => item.id === sectionSubjectId)
        ?? sectionSubjects[0]
        ?? null
      if (!selectedSectionSubject) {
        return {
          sectionSubjects,
          academicPeriods: [],
          selectedSectionSubjectId: null,
          selectedAcademicPeriodId: null,
          context: null,
          students: [],
          gradeRecords: [],
          activities: [],
        }
      }

      const academicPeriods = allPeriods.filter(
        (period) => period.schoolYearId === selectedSectionSubject.schoolYearId,
      )
      const selectedAcademicPeriod = academicPeriods.find((period) => period.id === academicPeriodId)
        ?? academicPeriods[0]
        ?? null
      if (!selectedAcademicPeriod) {
        return {
          sectionSubjects,
          academicPeriods,
          selectedSectionSubjectId: selectedSectionSubject.id,
          selectedAcademicPeriodId: null,
          context: null,
          students: [],
          gradeRecords: [],
          activities: [],
        }
      }

      const data = await this.getWorkspaceData(
        schoolId,
        selectedSectionSubject,
        selectedAcademicPeriod.id,
      )
      return {
        sectionSubjects,
        academicPeriods,
        selectedSectionSubjectId: selectedSectionSubject.id,
        selectedAcademicPeriodId: selectedAcademicPeriod.id,
        ...data,
      }
    }

    if (!sectionSubjectId || !academicPeriodId) {
      throw new BadRequestException('sectionSubjectId and academicPeriodId are required')
    }
    const [sectionSubject, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({
        where: { id: sectionSubjectId, schoolId, status: 'ACTIVE' },
        select: { id: true, sectionId: true, schoolYearId: true },
      }),
      prisma.academicPeriod.findFirst({
        where: { id: academicPeriodId, schoolId, status: 'ACTIVE' },
        select: { id: true, schoolYearId: true },
      }),
    ])
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod || academicPeriod.schoolYearId !== sectionSubject.schoolYearId) {
      throw new NotFoundException('Academic period not found')
    }

    const data = await this.getWorkspaceData(schoolId, sectionSubject, academicPeriod.id)
    return {
      sectionSubjects: [],
      academicPeriods: [],
      selectedSectionSubjectId: sectionSubject.id,
      selectedAcademicPeriodId: academicPeriod.id,
      ...data,
    }
  }

  private async getWorkspaceData(
    schoolId: string,
    sectionSubject: { id: string; sectionId: string; schoolYearId: string },
    academicPeriodId: string,
  ) {
    const [enrollments, grades, activities] = await Promise.all([
      prisma.enrollment.findMany({
        where: {
          schoolId,
          sectionId: sectionSubject.sectionId,
          schoolYearId: sectionSubject.schoolYearId,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          studentId: true,
          student: {
            select: { studentCode: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId: sectionSubject.id, academicPeriodId },
      }),
      prisma.evaluationActivity.findMany({
        where: {
          schoolId,
          sectionSubjectId: sectionSubject.id,
          academicPeriodId,
          status: 'ACTIVE',
        },
        include: { instrument: true },
        orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
      }),
    ])

    const students = enrollments
      .map(mapStudentEnrollment)
      .sort((first, second) => {
        const lastName = first.lastName.localeCompare(second.lastName, 'es')
        if (lastName !== 0) return lastName
        return first.firstName.localeCompare(second.firstName, 'es')
      })
      .map((student, index) => ({ ...student, listNumber: index + 1 }))

    return {
      context: {
        sectionId: sectionSubject.sectionId,
        schoolYearId: sectionSubject.schoolYearId,
      },
      students,
      gradeRecords: grades.map(mapGradeRecord),
      activities: activities.map(mapEvaluationActivity),
    }
  }

  /** Carga los cuatro períodos anuales en dos consultas de datos. */
  async getAnnualWorkspace(schoolId: string, sectionSubjectId: string) {
    const sectionSubject = await prisma.sectionSubject.findFirst({
      where: { id: sectionSubjectId, schoolId, status: 'ACTIVE' },
      select: { id: true, schoolYearId: true },
    })
    if (!sectionSubject) throw new NotFoundException('Section subject not found')

    const periods = await prisma.academicPeriod.findMany({
      where: { schoolId, schoolYearId: sectionSubject.schoolYearId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
      select: { id: true, sequence: true, name: true },
    })
    const periodIds = periods.map((period) => period.id)
    const [records, activities] = await Promise.all([
      prisma.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId, academicPeriodId: { in: periodIds } },
      }),
      prisma.evaluationActivity.findMany({
        where: {
          schoolId,
          sectionSubjectId,
          academicPeriodId: { in: periodIds },
          status: 'ACTIVE',
        },
        include: { instrument: true },
        orderBy: [{ activityDate: 'asc' }, { createdAt: 'asc' }],
      }),
    ])

    return periods.map((period) => ({
      academicPeriodId: period.id,
      sequence: period.sequence,
      name: period.name,
      gradeRecords: records
        .filter((record) => record.academicPeriodId === period.id)
        .map(mapGradeRecord),
      activities: activities
        .filter((activity) => activity.academicPeriodId === period.id)
        .map(mapEvaluationActivity),
    }))
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
    const [ss, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({ where: { id: sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: academicPeriodId, schoolId } }),
    ])
    if (!ss) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const [enrollments, grades] = await Promise.all([
      prisma.enrollment.findMany({
        where: { schoolId, sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
        include: { student: true },
      }),
      prisma.gradesRecord.findMany({
        where: { schoolId, sectionSubjectId, academicPeriodId },
      }),
    ])

    return {
      sectionId: ss.sectionId,
      schoolYearId: ss.schoolYearId,
      gradeRecords: grades.map(mapGradeRecord),
      students: enrollments
        .map(mapStudentEnrollment)
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
      if (dto.evaluationActivityId) {
        await assertEvaluationActivityScope(
          schoolId,
          dto.evaluationActivityId,
          grade.sectionSubjectId,
          grade.academicPeriodId,
        )
      }
      const updated = await prisma.gradesRecord.update({
        where: { id: dto.gradeId },
        data: {
          score: dto.score,
          maxScore: dto.maxScore,
          weight: dto.weight,
          assessmentName: dto.assessmentName,
          evaluationActivityId: dto.evaluationActivityId === undefined ? undefined : dto.evaluationActivityId,
        },
      })
      return mapGradeRecord(updated)
    }
    const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: dto.enrollmentId!, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId!, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId!, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')
    if (enrollment.sectionId !== sectionSubject.sectionId || enrollment.schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('Enrollment does not match section subject')
    }
    if (academicPeriod.schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('Academic period does not match section subject school year')
    }
    if (dto.evaluationActivityId) {
      await assertEvaluationActivityScope(
        schoolId,
        dto.evaluationActivityId,
        dto.sectionSubjectId!,
        dto.academicPeriodId!,
      )
    }

    const created = await prisma.gradesRecord.create({
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
    return mapGradeRecord(created)
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
    const [sectionSubject, academicPeriod] = await Promise.all([
      prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId } }),
    ])
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')
    const schoolYearId = dto.schoolYearId ?? sectionSubject.schoolYearId
    if (schoolYearId !== sectionSubject.schoolYearId) {
      throw new BadRequestException('School year does not match section subject')
    }
    if (academicPeriod.schoolYearId !== schoolYearId) {
      throw new BadRequestException('Academic period does not match section subject school year')
    }
    if (dto.planningEntryId) {
      await assertPlanningEntryScope(schoolId, dto.planningEntryId, dto.sectionSubjectId, dto.academicPeriodId)
    }
    if (dto.instrumentId) {
      await assertInstrumentScope(schoolId, dto.instrumentId)
    }

    const data = {
      schoolId,
      schoolYearId,
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
      if (
        planning.sectionSubjectId !== activity.sectionSubjectId ||
        planning.academicPeriodId !== activity.academicPeriodId
      ) {
        throw new BadRequestException('Planning entry does not match activity context')
      }
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
    await prisma.gradesRecord.delete({ where: { id } })
    return { id }
  }
}
