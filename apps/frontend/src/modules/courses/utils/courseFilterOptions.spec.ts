import { describe, expect, it } from 'vitest'

import {
  buildCycleFilterOptions,
  buildGradeFilterOptions,
  buildSectionFilterOptions,
  filterCourseOptionItems,
  matchesCourseSearch,
  matchesCourseStateFilters,
  matchesSectionFilter,
  normalizeSectionFilterValue,
  type CourseFilterOptionItem,
} from './courseFilterOptions'

const courses: CourseFilterOptionItem[] = [
  course('p-1-a', 'Nivel Primario', 'Primer Ciclo de Primaria', 'grade-p-1', '1.º', 'A'),
  course('p-2-a', 'Nivel Primario', 'Primer Ciclo de Primaria', 'grade-p-2', '2.º', 'A'),
  course('p-2-b', 'Nivel Primario', 'Primer Ciclo de Primaria', 'grade-p-2', '2.º', 'B'),
  course('s-1-a', 'Nivel Secundario', 'Primer Ciclo de Secundaria', 'grade-s-1', '1.º', 'A'),
  course('s-2-c', 'Nivel Secundario', 'Primer Ciclo de Secundaria', 'grade-s-2', '2.º', 'C'),
]

describe('course filter options', () => {
  it('returns each available section name only once', () => {
    expect(buildSectionFilterOptions(courses)).toEqual([
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
    ])
  })

  it('limits section options using the active level and grade', () => {
    const secondary = filterCourseOptionItems(courses, { level: 'Nivel Secundario' })
    const secondGrade = filterCourseOptionItems(secondary, { grade: 'grade-s-2' })

    expect(buildSectionFilterOptions(secondGrade)).toEqual([{ value: 'C', label: 'C' }])
  })

  it('groups cycles and grades into primary and secondary education', () => {
    expect(buildCycleFilterOptions(courses).map(({ label, group }) => ({ label, group }))).toEqual([
      { label: 'Primer Ciclo de Primaria', group: 'Primaria' },
      { label: 'Primer Ciclo de Secundaria', group: 'Secundaria' },
    ])
    expect(buildGradeFilterOptions(courses).map(({ label, group }) => ({ label, group }))).toEqual([
      { label: '1.º', group: 'Primaria' },
      { label: '2.º', group: 'Primaria' },
      { label: '1.º', group: 'Secundaria' },
      { label: '2.º', group: 'Secundaria' },
    ])
  })

  it('normalizes equivalent section names to the same filter value', () => {
    expect(normalizeSectionFilterValue(' á ')).toBe('A')
  })

  it('matches the same section across different grades and levels', () => {
    expect(courses.filter((item) => matchesSectionFilter(item.section.name, 'A')).map((item) => item.grade.id)).toEqual([
      'grade-p-1',
      'grade-p-2',
      'grade-s-1',
    ])
  })

  it.each(['2A', '2° A', 'Matemática', 'Secundaria', 'Primer ciclo'])('finds courses using the smart search query %s', (query) => {
    expect(courses.some((item) => matchesCourseSearch(item, query))).toBe(true)
  })

  it('treats a single letter as an exact global section search', () => {
    expect(courses.filter((item) => matchesCourseSearch(item, 'B')).map((item) => item.section.name)).toEqual(['B'])
  })

  it('hides archived courses by default and applies the two teacher-facing state filters', () => {
    expect(matchesCourseStateFilters(
      { archived: true, studentCount: 0, teamCount: 2 },
      { showArchived: false, onlyWithTeams: false, onlyWithoutStudents: false },
    )).toBe(false)
    expect(matchesCourseStateFilters(
      { archived: true, studentCount: 0, teamCount: 2 },
      { showArchived: true, onlyWithTeams: true, onlyWithoutStudents: true },
    )).toBe(true)
  })
})

function course(
  id: string,
  levelName: string,
  cycleName: string,
  gradeId: string,
  gradeName: string,
  sectionName: string,
): CourseFilterOptionItem {
  return {
    levelName,
    cycleName,
    grade: { id: gradeId, name: gradeName },
    section: { name: sectionName },
    assignments: [{ subjectName: id.startsWith('p') ? 'Lengua Española' : 'Matemática' }],
  }
}
