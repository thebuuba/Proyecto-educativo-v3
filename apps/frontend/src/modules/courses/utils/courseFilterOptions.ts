export type CourseFilterOptionItem = {
  levelName: string
  cycleName: string
  grade: {
    id: string
    name: string
  }
  section: {
    name: string
  }
  assignments: Array<{
    subjectName: string
  }>
}

export type CourseFilterSelection = {
  level?: string
  cycle?: string
  subject?: string
  grade?: string
}

export type CourseFilterOption = {
  value: string
  label: string
  group?: string
}

export function filterCourseOptionItems<T extends CourseFilterOptionItem>(
  items: T[],
  filters: CourseFilterSelection,
) {
  return items.filter((item) => {
    if (filters.level && filters.level !== 'all' && item.levelName !== filters.level) return false
    if (filters.cycle && filters.cycle !== 'all' && item.cycleName !== filters.cycle) return false
    if (filters.subject && filters.subject !== 'all' && !item.assignments.some((assignment) => assignment.subjectName === filters.subject)) return false
    if (filters.grade && filters.grade !== 'all' && item.grade.id !== filters.grade) return false
    return true
  })
}

export function buildCycleFilterOptions(items: CourseFilterOptionItem[]): CourseFilterOption[] {
  return uniqueOptions(items.map((item) => ({
    value: item.cycleName,
    label: item.cycleName,
    group: getAcademicGroup(item.levelName),
  })))
}

export function buildGradeFilterOptions(items: CourseFilterOptionItem[]): CourseFilterOption[] {
  return uniqueOptions(items.map((item) => ({
    value: item.grade.id,
    label: item.grade.name,
    group: getAcademicGroup(item.levelName),
  })))
}

export function buildSectionFilterOptions(items: CourseFilterOptionItem[]): CourseFilterOption[] {
  const sections = new Map<string, CourseFilterOption>()

  for (const item of items) {
    const value = normalizeSectionFilterValue(item.section.name)
    if (!value || sections.has(value)) continue
    sections.set(value, { value, label: item.section.name.trim().toLocaleUpperCase('es') })
  }

  return Array.from(sections.values()).sort((left, right) =>
    left.label.localeCompare(right.label, 'es', { numeric: true }),
  )
}

export function normalizeSectionFilterValue(value: string) {
  return value.trim().toLocaleUpperCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function matchesSectionFilter(sectionName: string, filterValue: string) {
  return filterValue === 'all' || normalizeSectionFilterValue(sectionName) === filterValue
}

export function matchesCourseSearch(item: CourseFilterOptionItem, searchValue: string) {
  const query = normalizeCourseSearch(searchValue)
  if (!query) return true

  const section = normalizeCourseSearch(item.section.name)
  if (/^[a-z]$/.test(query)) return section === query

  const grade = normalizeCourseSearch(item.grade.name)
  const searchable = normalizeCourseSearch([
    item.grade.name,
    item.section.name,
    item.levelName,
    item.cycleName,
    ...item.assignments.map((assignment) => assignment.subjectName),
    `${grade} ${section}`,
    `${grade}${section}`,
  ].join(' '))

  return searchable.includes(query) || searchable.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
}

export function matchesCourseStateFilters(
  item: { archived: boolean; studentCount: number; teamCount: number },
  filters: { showArchived: boolean; onlyWithTeams: boolean; onlyWithoutStudents: boolean },
) {
  if (!filters.showArchived && item.archived) return false
  if (filters.onlyWithTeams && item.teamCount === 0) return false
  if (filters.onlyWithoutStudents && item.studentCount > 0) return false
  return true
}

function normalizeCourseSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ºª°]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function uniqueOptions(options: CourseFilterOption[]) {
  const unique = new Map<string, CourseFilterOption>()
  for (const option of options) {
    if (option.value && !unique.has(option.value)) unique.set(option.value, option)
  }
  return Array.from(unique.values()).sort(compareGroupedOptions)
}

function compareGroupedOptions(left: CourseFilterOption, right: CourseFilterOption) {
  const groupOrder = academicGroupOrder(left.group) - academicGroupOrder(right.group)
  return groupOrder || left.label.localeCompare(right.label, 'es', { numeric: true })
}

function academicGroupOrder(group?: string) {
  if (group === 'Primaria') return 0
  if (group === 'Secundaria') return 1
  return 2
}

function getAcademicGroup(levelName: string) {
  const normalized = levelName.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (normalized.includes('primar')) return 'Primaria'
  if (normalized.includes('secund')) return 'Secundaria'
  return 'Otros'
}
