import { prisma } from '@aula/database'
import { dashboardAttentionPolicy } from '../../config/dashboard-attention-policy'
import type { AuthenticatedUser } from '../auth/types/authenticated-user'

type Attention = { id: string; name: string; grade: string; average: number | null; attendance: number | null; reasons: string[]; note: string }
type Scope = { view: string; teacherId: string | null }

function compareAttention(a: Attention, b: Attention) {
  return (a.average ?? 100) - (b.average ?? 100) || (a.attendance ?? 100) - (b.attendance ?? 100) || a.id.localeCompare(b.id)
}

/** Recorre todas las matrículas por clave estable; limita solo las tarjetas finales. */
export async function getDashboardAttention(user: AuthenticatedUser, schoolYearId: string | null, periodId: string | null, scope: Scope, today: Date): Promise<Attention[]> {
  if (!schoolYearId || !periodId || !['teacher', 'management'].includes(scope.view)) return []
  if (scope.view === 'teacher' && !scope.teacherId) return []
  const policy = dashboardAttentionPolicy()
  const sections = scope.teacherId ? await prisma.sectionSubject.findMany({ where: { schoolId: user.schoolId, schoolYearId, teacherId: scope.teacherId, status: 'ACTIVE' }, select: { sectionId: true } }) : null
  const sectionIds = sections ? [...new Set(sections.map((item) => item.sectionId))] : null
  if (sectionIds && !sectionIds.length) return []
  const since = new Date(today.getTime())
  since.setUTCDate(since.getUTCDate() - policy.lookbackDays)
  let after: string | undefined
  let result: Attention[] = []
  while (true) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId: user.schoolId, schoolYearId, status: 'ACTIVE', ...(sectionIds ? { sectionId: { in: sectionIds } } : {}), ...(after ? { id: { gt: after } } : {}) },
      select: { id: true, studentId: true, student: { select: { firstName: true, lastName: true } }, grade: { select: { name: true } }, section: { select: { name: true } } },
      orderBy: { id: 'asc' },
      take: policy.pageSize,
    })
    if (!enrollments.length) break
    const enrollmentIds = enrollments.map((item) => item.id)
    const studentIds = enrollments.map((item) => item.studentId)
    const teacherFilter = scope.teacherId ? { sectionSubject: { teacherId: scope.teacherId } } : {}
    const [grades, attendance, journalLinks] = await Promise.all([
      prisma.gradesRecord.findMany({ where: { schoolId: user.schoolId, academicPeriodId: periodId, enrollmentId: { in: enrollmentIds }, status: 'PUBLISHED', ...teacherFilter }, select: { enrollmentId: true, score: true, maxScore: true } }),
      prisma.attendanceClass.findMany({ where: { schoolId: user.schoolId, enrollmentId: { in: enrollmentIds }, attendanceDate: { gte: since, lte: today }, ...teacherFilter }, select: { enrollmentId: true, status: true } }),
      prisma.teacherJournalStudent.findMany({ where: { schoolId: user.schoolId, studentId: { in: studentIds }, entry: { createdById: user.id, status: 'ACTIVE', occurredAt: { gte: since }, entryType: { in: ['incident', 'student_observation'] } } }, select: { studentId: true } }),
    ])
    const marks = new Map<string, { total: number; count: number }>()
    for (const record of grades) {
      const score = Number(record.score), maximum = Number(record.maxScore)
      if (!Number.isFinite(score) || !Number.isFinite(maximum) || maximum <= 0) continue
      const stats = marks.get(record.enrollmentId) ?? { total: 0, count: 0 }
      stats.total += score / maximum * 100
      stats.count += 1
      marks.set(record.enrollmentId, stats)
    }
    const attendanceCounts = new Map<string, { attended: number; total: number }>()
    for (const record of attendance) {
      if (record.status === 'EXCUSED') continue
      const stats = attendanceCounts.get(record.enrollmentId) ?? { attended: 0, total: 0 }
      stats.total += 1
      if (record.status === 'PRESENT' || record.status === 'LATE') stats.attended += 1
      attendanceCounts.set(record.enrollmentId, stats)
    }
    const observations = new Map<string, number>()
    for (const link of journalLinks) observations.set(link.studentId, (observations.get(link.studentId) ?? 0) + 1)
    for (const item of enrollments) {
      const mark = marks.get(item.id), presence = attendanceCounts.get(item.id)
      const average = mark ? Math.round(mark.total / mark.count) : null
      const attendanceRate = presence ? Math.round(presence.attended / presence.total * 100) : null
      const observationCount = observations.get(item.studentId) ?? 0
      const lowAttendance = attendanceRate !== null && attendanceRate < policy.attendanceMinimum
      const lowGrade = average !== null && average < policy.gradeMinimum
      const behavior = observationCount >= policy.observationMinimum
      const reasons = [lowAttendance ? 'Asistencia' : null, lowGrade ? 'Promedio' : null, behavior ? 'Conducta' : null].filter((reason): reason is string => Boolean(reason))
      if (!reasons.length) continue
      result.push({ id: item.studentId, name: `${item.student.firstName} ${item.student.lastName}`, grade: `${item.grade.name} ${item.section.name}`, average, attendance: attendanceRate, reasons,
        note: behavior ? `${observationCount} anotaciones recientes` : lowGrade ? `Promedio por debajo del umbral de aviso (${policy.gradeMinimum}%)` : `Asistencia por debajo del ${policy.attendanceMinimum}%` })
    }
    result = result.sort(compareAttention).slice(0, policy.displayLimit)
    after = enrollments[enrollments.length - 1].id
    if (enrollments.length < policy.pageSize) break
  }
  return result
}
