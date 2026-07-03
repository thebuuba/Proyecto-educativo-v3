/**
 * Servicio de asistencia.
 *
 * Implementa la lógica de negocio para el registro y consulta de
 * asistencia de estudiantes, tanto diaria como por clase.
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, AttendanceStatus } from '@aula/database'
import { UpsertAttendanceDto } from './dto/upsert-attendance.dto'

const baseAttendancePeriods = [
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
 * Servicio de asistencia.
 *
 * Implementa la lógica de negocio para el registro y consulta de
 * asistencia de estudiantes, tanto a nivel diario como por clase.
 */
@Injectable()
export class AttendanceService {
  /**
   * Obtiene los registros de asistencia por clase, opcionalmente filtrados
   * por materia de sección y fecha.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionSubjectId - Identificador de la materia de la sección (opcional).
   * @param date - Fecha de la asistencia (opcional).
   * @returns Lista de registros de asistencia por clase.
   */
  findAll(schoolId: string, sectionSubjectId?: string, date?: string) {
    const where: any = { schoolId }
    if (sectionSubjectId) where.sectionSubjectId = sectionSubjectId
    if (date) where.attendanceDate = new Date(date)
    return prisma.attendanceClass.findMany({ where })
  }

  /**
   * Obtiene los registros de asistencia diaria, opcionalmente filtrados
   * por matrícula y fecha.
   *
   * @param schoolId - Identificador del colegio.
   * @param enrollmentId - Identificador de la matrícula (opcional).
   * @param date - Fecha de la asistencia (opcional).
   * @returns Lista de registros de asistencia diaria.
   */
  findDaily(schoolId: string, enrollmentId?: string, date?: string) {
    const where: any = { schoolId }
    if (enrollmentId) where.enrollmentId = enrollmentId
    if (date) where.attendanceDate = new Date(date)
    return prisma.attendanceDaily.findMany({ where })
  }

  /**
   * Obtiene los registros de asistencia diaria de todos los estudiantes
   * de una sección en una fecha determinada.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionId - Identificador de la sección.
   * @param date - Fecha de la asistencia.
   * @returns Lista de registros de asistencia diaria de la sección.
   */
  async findDailyBySection(schoolId: string, sectionId: string, date: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, sectionId, status: 'ACTIVE' },
      select: { id: true },
    })
    const enrollmentIds = enrollments.map((e) => e.id)
    return prisma.attendanceDaily.findMany({
      where: { enrollmentId: { in: enrollmentIds }, attendanceDate: new Date(date) },
    })
  }

  /**
   * Obtiene los estudiantes matriculados en una sección y año escolar.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionId - Identificador de la sección.
   * @param schoolYearId - Identificador del año escolar.
   * @returns Lista de estudiantes con sus datos básicos y matrícula.
   */
  async getStudentsBySection(schoolId: string, sectionId: string, schoolYearId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, sectionId, schoolYearId, status: 'ACTIVE' },
    })
    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: enrollments.map((e) => e.studentId) } },
    })
    return enrollments
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
      .map((student, index) => ({ ...student, listNumber: index + 1 }))
  }

  /**
   * Obtiene los estudiantes de una materia en una fecha específica
   * junto con su estado de asistencia existente.
   *
   * @param schoolId - Identificador del colegio.
   * @param sectionSubjectId - Identificador de la materia de la sección.
   * @param date - Fecha de la asistencia.
   * @returns Lista de estudiantes con su registro de asistencia (si existe).
   */
  async getStudents(schoolId: string, sectionSubjectId: string, date: string) {
    const ss = await prisma.sectionSubject.findFirst({ where: { id: sectionSubjectId, schoolId } })
    if (!ss) throw new Error('Section subject not found')

    const [enrollments, existingAttendances] = await Promise.all([
      prisma.enrollment.findMany({
        where: { schoolId, sectionId: ss.sectionId, schoolYearId: ss.schoolYearId, status: 'ACTIVE' },
      }),
      prisma.attendanceClass.findMany({
        where: { schoolId, sectionSubjectId, attendanceDate: new Date(date) },
      }),
    ])

    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: enrollments.map((e) => e.studentId) } },
    })

    const attendanceMap = new Map(existingAttendances.map((a) => [a.enrollmentId, a]))

    return enrollments.map((enr) => {
      const student = students.find((s) => s.id === enr.studentId)
      const existing = attendanceMap.get(enr.id)
      return {
        enrollmentId: enr.id,
        studentId: enr.studentId,
        studentCode: student?.studentCode ?? '',
        firstName: student?.firstName ?? '',
        lastName: student?.lastName ?? '',
        attendanceId: existing?.id ?? null,
        status: existing?.status ?? null,
        notes: existing?.notes ?? '',
      }
    })
  }

  /**
   * Obtiene el período académico activo con la secuencia más baja.
   *
   * @param schoolId - Identificador del colegio.
   * @returns El período académico activo encontrado o null.
   */
  async getCurrentPeriod(schoolId: string) {
    const current = await prisma.academicPeriod.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
    if (current) return current

    const schoolYear = await prisma.schoolYear.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    })
    if (!schoolYear) return null

    await prisma.academicPeriod.createMany({
      data: baseAttendancePeriods.map((period) => ({
        schoolId,
        schoolYearId: schoolYear.id,
        name: period.name,
        sequence: period.sequence,
        startDate: periodDate(schoolYear.startDate, period.startMonth, period.startDay),
        endDate: periodDate(schoolYear.startDate, period.endMonth, period.endDay),
      })),
      skipDuplicates: true,
    })

    return prisma.academicPeriod.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { sequence: 'asc' },
    })
  }

  /**
   * Crea o actualiza un registro de asistencia según el tipo especificado.
   *
   * @param schoolId - Identificador del colegio.
   * @param body - Datos del registro con el tipo de asistencia ('class' o 'daily').
   * @returns El registro de asistencia creado o actualizado.
   */
  async upsert(schoolId: string, dto: UpsertAttendanceDto) {
    if (dto.type === 'class') {
      return this.upsertClass(schoolId, dto)
    }
    return this.upsertDaily(schoolId, dto)
  }

  /**
   * Crea o actualiza un registro de asistencia por clase.
   *
   * Si ya existe un registro para la misma matrícula, materia y fecha,
   * lo actualiza; en caso contrario, crea uno nuevo.
   *
   * @param schoolId - Identificador del colegio.
   * @param body - Datos del registro de asistencia por clase.
   * @returns El registro de asistencia por clase creado o actualizado.
   * @throws NotFoundException si la matrícula, materia o período académico no existen.
   */
  private async upsertClass(schoolId: string, dto: UpsertAttendanceDto) {
    const [enrollment, sectionSubject, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: dto.enrollmentId, schoolId } }),
      prisma.sectionSubject.findFirst({ where: { id: dto.sectionSubjectId!, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!sectionSubject) throw new NotFoundException('Section subject not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const existing = await prisma.attendanceClass.findFirst({
      where: {
        schoolId,
        enrollmentId: dto.enrollmentId,
        sectionSubjectId: dto.sectionSubjectId!,
        attendanceDate: new Date(dto.attendanceDate),
      },
    })

    if (existing) {
      return prisma.attendanceClass.update({
        where: { id: existing.id },
        data: {
          status: dto.status as AttendanceStatus,
          notes: dto.notes ?? null,
        },
      })
    }

    return prisma.attendanceClass.create({
      data: {
        enrollmentId: dto.enrollmentId,
        sectionSubjectId: dto.sectionSubjectId!,
        schoolId,
        schoolYearId: enrollment.schoolYearId,
        sectionId: enrollment.sectionId,
        academicPeriodId: academicPeriod.id,
        attendanceDate: new Date(dto.attendanceDate),
        status: dto.status as AttendanceStatus,
        notes: dto.notes ?? null,
      },
    })
  }

  /**
   * Crea o actualiza un registro de asistencia diaria.
   *
   * Si ya existe un registro para la misma matrícula y fecha,
   * lo actualiza; en caso contrario, crea uno nuevo.
   *
   * @param schoolId - Identificador del colegio.
   * @param body - Datos del registro de asistencia diaria.
   * @returns El registro de asistencia diaria creado o actualizado.
   * @throws NotFoundException si la matrícula o el período académico no existen.
   */
  private async upsertDaily(schoolId: string, dto: UpsertAttendanceDto) {
    const [enrollment, academicPeriod] = await Promise.all([
      prisma.enrollment.findFirst({ where: { id: dto.enrollmentId, schoolId } }),
      prisma.academicPeriod.findFirst({ where: { id: dto.academicPeriodId, schoolId } }),
    ])
    if (!enrollment) throw new NotFoundException('Enrollment not found')
    if (!academicPeriod) throw new NotFoundException('Academic period not found')

    const existing = await prisma.attendanceDaily.findFirst({
      where: {
        schoolId,
        enrollmentId: dto.enrollmentId,
        attendanceDate: new Date(dto.attendanceDate),
      },
    })

    if (existing) {
      return prisma.attendanceDaily.update({
        where: { id: existing.id },
        data: {
          status: dto.status as AttendanceStatus,
          notes: dto.notes ?? null,
        },
      })
    }

    return prisma.attendanceDaily.create({
      data: {
        enrollmentId: dto.enrollmentId,
        schoolId,
        schoolYearId: enrollment.schoolYearId,
        sectionId: enrollment.sectionId,
        academicPeriodId: academicPeriod.id,
        attendanceDate: new Date(dto.attendanceDate),
        status: dto.status as AttendanceStatus,
        notes: dto.notes ?? null,
      },
    })
  }

  async deleteRecord(schoolId: string, id: string, type: 'daily' | 'class') {
    if (type === 'class') {
      const record = await prisma.attendanceClass.findFirst({ where: { id, schoolId } })
      if (!record) throw new NotFoundException('Attendance record not found')
      return prisma.attendanceClass.delete({ where: { id } })
    }

    const record = await prisma.attendanceDaily.findFirst({ where: { id, schoolId } })
    if (!record) throw new NotFoundException('Attendance record not found')
    return prisma.attendanceDaily.delete({ where: { id } })
  }
}
