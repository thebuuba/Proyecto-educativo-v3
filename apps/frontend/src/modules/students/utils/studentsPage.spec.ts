import { describe, expect, it } from 'vitest'
import { buildStudentsCsv, groupEnrollmentCourses, splitFullName, toStudentStatus } from './studentsPage'

describe('student page utilities', () => {
  it('normalizes names and form statuses', () => {
    expect(splitFullName('Ana María Pérez')).toEqual({ firstName: 'Ana', lastName: 'María Pérez' })
    expect(toStudentStatus('active')).toBe('active')
    expect(toStudentStatus('transferred')).toBe('inactive')
  })

  it('escapes quotes in CSV exports', () => {
    const csv = buildStudentsCsv(
      [{ studentCode: 'A-1', fullName: 'Ana "Nani" Pérez', status: 'ACTIVE' }],
      { gradeName: '1ro', sectionName: 'A', area: 'General', subjectName: 'Lengua', subjectId: 's1', shift: 'Mañana', schoolYearName: '2026-2027', subjects: [] } as never,
    )
    expect(csv).toContain('"Ana ""Nani"" Pérez"')
  })

  it('groups courses by primary and secondary level', () => {
    const groups = groupEnrollmentCourses([
      { id: 'p1', academicLevelName: 'Nivel Primario' },
      { id: 's1', academicLevelName: 'Secundaria' },
    ] as never)

    expect(groups.map(([name, courses]) => [name, courses.map((course) => course.id)])).toEqual([
      ['Primaria', ['p1']],
      ['Secundaria', ['s1']],
    ])
  })
})
