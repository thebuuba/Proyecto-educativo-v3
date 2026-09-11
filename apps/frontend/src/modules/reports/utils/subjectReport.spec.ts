import { describe, expect, it } from 'vitest'
import { attendancePercentage, buildSubjectReport } from './subjectReport'

const students = [
  { enrollmentId: 'e1', studentId: 's1', studentCode: '01', listNumber: 1, firstName: 'Ana', lastName: 'Pérez' },
  { enrollmentId: 'e2', studentId: 's2', studentCode: '02', listNumber: 2, firstName: 'Luis', lastName: 'Díaz' },
]
const activities = [
  { id: 'a1', name: 'Práctica', competencyBlockId: 'b1', maxScore: 50 },
  { id: 'a2', name: 'Proyecto', competencyBlockId: 'b2', maxScore: 50 },
]

describe('subject report calculations', () => {
  it('distinguishes no data from a real zero and calculates partial progress', () => {
    const report = buildSubjectReport({
      students,
      activities,
      records: [{ id: 'g1', enrollmentId: 'e1', score: 0, maxScore: 50, weight: 1, assessmentName: 'ABV2:activity:b1:a1:Práctica', status: null, evaluationActivityId: 'a1' }],
      attendance: [],
    })
    expect(report.rows[0].average).toBe(0)
    expect(report.rows[1].average).toBeNull()
    expect(report.average).toBe(0)
    expect(report.evaluatedPoints).toBe(50)
    expect(report.totalPoints).toBe(100)
    expect(report.activities[0]).toMatchObject({ evaluated: 1, pending: 1 })
  })

  it('counts every three tardanzas as one absence', () => {
    const attendance = Array.from({ length: 6 }, (_, index) => ({ id: String(index), enrollmentId: 'e1', attendanceDate: '2026-09-01', status: index < 3 ? 'late' as const : 'present' as const }))
    expect(attendancePercentage(attendance)).toBe(83)
    expect(attendancePercentage([])).toBeNull()
  })

  it('reports complete evaluation without pending grades', () => {
    const records = students.flatMap((student) => activities.map((activity, index) => ({
      id: `${student.enrollmentId}-${activity.id}`,
      enrollmentId: student.enrollmentId,
      score: index ? 50 : 40,
      maxScore: 50,
      weight: 1,
      assessmentName: `ABV2:activity:${activity.competencyBlockId}:${activity.id}:${activity.name}`,
      status: null,
      evaluationActivityId: activity.id,
    })))
    const report = buildSubjectReport({ students, activities, records, attendance: [] })
    expect(report.evaluatedPoints).toBe(100)
    expect(report.activities.every((activity) => activity.pending === 0)).toBe(true)
    expect(report.pendingByStudent.get('e1')).toBe(0)
    expect(report.blocks[2].average).toBeNull()
  })

  it('keeps empty states as null instead of inventing zeroes', () => {
    const report = buildSubjectReport({ students, activities: [], records: [], attendance: [] })
    expect(report.average).toBeNull()
    expect(report.groupAttendance).toBeNull()
    expect(report.totalPoints).toBe(0)
    expect(report.followUp).toHaveLength(0)
  })

  it('filters attendance to the selected academic period', () => {
    const report = buildSubjectReport({
      students: [students[0]], activities: [], records: [],
      periodStart: '2026-09-01', periodEnd: '2026-09-30',
      attendance: [
        { id: 'before', enrollmentId: 'e1', attendanceDate: '2026-08-31', status: 'absent' },
        { id: 'inside', enrollmentId: 'e1', attendanceDate: '2026-09-03', status: 'present' },
      ],
    })
    expect(report.attendance).toHaveLength(1)
    expect(report.groupAttendance).toBe(100)
  })
})
