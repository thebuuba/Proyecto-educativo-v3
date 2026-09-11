import type { ClassAttendanceHistoryRecord } from '@/modules/attendance/services/attendanceService'
import type { GradeRecordRow, GradingActivity, StudentGradeRow } from '@/modules/grading/types'
import { buildCompactGradeRows, competencyBlocks, scoreForActivity } from '@/modules/grading/utils/competencyGrades'

export type SubjectReportActivity = GradingActivity & {
  evaluated: number
  pending: number
  average: number | null
}

export function attendancePercentage(records: ClassAttendanceHistoryRecord[]) {
  if (!records.length) return null
  const absences = records.filter((record) => record.status === 'absent').length
  const tardanzas = records.filter((record) => record.status === 'late').length
  return Math.max(0, Math.round(((records.length - absences - Math.floor(tardanzas / 3)) / records.length) * 100))
}

export function buildSubjectReport(input: {
  students: StudentGradeRow[]
  activities: GradingActivity[]
  records: GradeRecordRow[]
  attendance: ClassAttendanceHistoryRecord[]
  periodStart?: string
  periodEnd?: string
}) {
  const rows = buildCompactGradeRows(input.students, input.activities, input.records)
  const evaluatedRows = rows.filter((row) => row.average !== null)
  const average = evaluatedRows.length
    ? Math.round(evaluatedRows.reduce((sum, row) => sum + (row.average ?? 0), 0) / evaluatedRows.length)
    : null
  const activities: SubjectReportActivity[] = input.activities.map((activity) => {
    const activityRecords = input.students
      .map((student) => scoreForActivity(input.records, student.enrollmentId, activity.id))
      .filter((record): record is GradeRecordRow => Boolean(record))
    return {
      ...activity,
      evaluated: activityRecords.length,
      pending: Math.max(0, input.students.length - activityRecords.length),
      average: activityRecords.length
        ? Math.round(activityRecords.reduce((sum, record) => sum + (record.score / (record.maxScore || activity.maxScore || 1)) * 100, 0) / activityRecords.length)
        : null,
    }
  })
  const attendance = input.attendance.filter((record) => {
    const date = record.attendanceDate.slice(0, 10)
    return (!input.periodStart || date >= input.periodStart.slice(0, 10)) && (!input.periodEnd || date <= input.periodEnd.slice(0, 10))
  })
  const attendanceByStudent = new Map(input.students.map((student) => [
    student.enrollmentId,
    attendancePercentage(attendance.filter((record) => record.enrollmentId === student.enrollmentId)),
  ]))
  const attendanceValues = [...attendanceByStudent.values()].filter((value): value is number => value !== null)
  const groupAttendance = attendanceValues.length
    ? Math.round(attendanceValues.reduce((sum, value) => sum + value, 0) / attendanceValues.length)
    : null
  const distribution = [
    { label: '90–100', count: rows.filter((row) => row.average !== null && row.average >= 90).length },
    { label: '80–89', count: rows.filter((row) => row.average !== null && row.average >= 80 && row.average < 90).length },
    { label: '70–79', count: rows.filter((row) => row.average !== null && row.average >= 70 && row.average < 80).length },
    { label: 'Menos de 70', count: rows.filter((row) => row.average !== null && row.average < 70).length },
    { label: 'Sin evaluar', count: rows.filter((row) => row.average === null).length },
  ]
  const blocks = competencyBlocks.map((block) => {
    const blockActivities = activities.filter((activity) => activity.competencyBlockId === block.id)
    const values = rows.map((row) => row.blockAverages[block.id]).filter((value): value is number => value !== null)
    const evaluated = blockActivities.reduce((sum, activity) => sum + activity.evaluated, 0)
    const possible = blockActivities.length * input.students.length
    return {
      ...block,
      activities: blockActivities.length,
      average: values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null,
      evaluated,
      possible,
      completion: possible ? Math.round((evaluated / possible) * 100) : null,
    }
  })
  const followUp = rows.flatMap((row) => {
    const student = input.students.find((item) => item.enrollmentId === row.enrollmentId)
    if (!student) return []
    const reasons: string[] = []
    if (row.average !== null && row.average < 70) reasons.push(`promedio de ${row.average}%`)
    const studentAttendance = attendanceByStudent.get(row.enrollmentId) ?? null
    if (studentAttendance !== null && studentAttendance < 80) reasons.push(`asistencia de ${studentAttendance}%`)
    const pending = activities.filter((activity) => scoreForActivity(input.records, row.enrollmentId, activity.id) === null).length
    if (pending > 0) reasons.push(`${pending} ${pending === 1 ? 'actividad pendiente' : 'actividades pendientes'}`)
    return reasons.length ? [{ ...student, average: row.average, attendance: studentAttendance, pending, reasons }] : []
  })
  const evaluatedPoints = activities.filter((activity) => activity.evaluated > 0).reduce((sum, activity) => sum + activity.maxScore, 0)
  const totalPoints = activities.reduce((sum, activity) => sum + activity.maxScore, 0)
  const pendingByStudent = new Map(input.students.map((student) => [
    student.enrollmentId,
    activities.filter((activity) => !scoreForActivity(input.records, student.enrollmentId, activity.id)).length,
  ]))

  return { rows, average, activities, blocks, distribution, attendance, groupAttendance, attendanceByStudent, pendingByStudent, followUp, evaluatedPoints, totalPoints }
}
