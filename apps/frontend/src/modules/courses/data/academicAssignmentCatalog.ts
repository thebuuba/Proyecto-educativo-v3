import type { Subject } from '@/modules/courses/types'

export type GradeOption = {
  code: string
  label: string
  sequence: number
  subjects?: SubjectOption[]
}

export type CycleOption = {
  code: string
  label: string
  matchNames: string[]
  grades: GradeOption[]
}

export type LevelOption = {
  code: string
  label: string
  matchNames: string[]
  cycles: CycleOption[]
}

export type SubjectOption = {
  key: string
  id?: string
  code: string
  name: string
}

const firstCycleBaseSubjects = [
  { code: 'LEN', name: 'Lengua Española' },
  { code: 'ING', name: 'Lenguas Extranjeras: Inglés' },
  { code: 'FRA', name: 'Lenguas Extranjeras: Francés' },
  { code: 'MAT', name: 'Matemática' },
  { code: 'SOC', name: 'Ciencias Sociales' },
  { code: 'NAT-TU', name: 'Ciencias de la Naturaleza: Ciencias de la Tierra y del Universo' },
  { code: 'ART', name: 'Educación Artística' },
  { code: 'EFI', name: 'Educación Física' },
  { code: 'FHR', name: 'Formación Integral Humana y Religiosa' },
]

const secondCycleBaseSubjects = [
  { code: 'LEN', name: 'Lengua Española' },
  { code: 'OPT-HLM', name: 'Salida Optativa: Humanidades y Lenguas Modernas' },
  { code: 'OPT-HCS', name: 'Salida Optativa: Humanidades y Ciencias Sociales' },
  { code: 'ING', name: 'Lenguas Extranjeras: Inglés' },
  { code: 'OPT-HLM', name: 'Salida Optativa: Humanidades y Lenguas Modernas' },
  { code: 'FRA', name: 'Lenguas Extranjeras: Francés' },
  { code: 'MAT', name: 'Matemática' },
  { code: 'OPT-MT', name: 'Salida Optativa: Matemática y Tecnología' },
  { code: 'SOC', name: 'Ciencias Sociales' },
  { code: 'OPT-HCS', name: 'Salida Optativa: Humanidades y Ciencias Sociales' },
  { code: 'NAT-BIO', name: 'Ciencias de la Naturaleza: Biología' },
  { code: 'OPT-CT', name: 'Salida Optativa: Ciencias y Tecnología' },
  { code: 'ART', name: 'Educación Artística' },
  { code: 'EFI', name: 'Educación Física' },
  { code: 'FHR', name: 'Formación Integral Humana y Religiosa' },
]

const primaryFirstCycleSubjects = [
  { code: 'PRI-LEN', name: 'Lengua Espa\u00f1ola' },
  { code: 'PRI-MAT', name: 'Matem\u00e1tica' },
  { code: 'PRI-SOC', name: 'Ciencias Sociales' },
  { code: 'PRI-NAT', name: 'Ciencias de la Naturaleza' },
  { code: 'PRI-EFI', name: 'Educaci\u00f3n F\u00edsica' },
  { code: 'PRI-FHR', name: 'Formaci\u00f3n Integral Humana y Religiosa' },
  { code: 'PRI-ART', name: 'Educaci\u00f3n Art\u00edstica' },
]

const primarySecondCycleSubjects = [
  { code: 'PRI-LEN', name: 'Lengua Espa\u00f1ola' },
  { code: 'PRI-MAT', name: 'Matem\u00e1tica' },
  { code: 'PRI-SOC', name: 'Ciencias Sociales' },
  { code: 'PRI-NAT', name: 'Ciencias de la Naturaleza' },
  { code: 'PRI-ING', name: 'Lenguas Extranjeras - Ingl\u00e9s' },
  { code: 'PRI-EFI', name: 'Educaci\u00f3n F\u00edsica' },
  { code: 'PRI-FHR', name: 'Formaci\u00f3n Integral Humana y Religiosa' },
  { code: 'PRI-ART', name: 'Educaci\u00f3n Art\u00edstica' },
]

function subjectsForGrade(gradeCode: string, subjects: { code: string; name: string }[]): SubjectOption[] {
  return subjects.map((subject, index) => ({
    key: `${gradeCode}-${index}-${normalizeAcademicText(subject.name)}`,
    code: subject.code,
    name: subject.name,
  }))
}

function withNaturalScience(subjects: { code: string; name: string }[], code: string, name: string) {
  return subjects.map((subject) =>
    subject.code.startsWith('NAT-') ? { ...subject, code, name } : subject,
  )
}

export const defaultAcademicStructure: LevelOption[] = [
  {
    code: 'primary',
    label: 'Primario',
    matchNames: ['primaria', 'primario'],
    cycles: [
      {
        code: 'primary-first-cycle',
        label: 'Primer ciclo',
        matchNames: ['primer ciclo'],
        grades: [
          {
            code: 'primary-1',
            label: '1.º',
            sequence: 1,
            subjects: subjectsForGrade('primary-1', primaryFirstCycleSubjects),
          },
          {
            code: 'primary-2',
            label: '2.º',
            sequence: 2,
            subjects: subjectsForGrade('primary-2', primaryFirstCycleSubjects),
          },
          {
            code: 'primary-3',
            label: '3.º',
            sequence: 3,
            subjects: subjectsForGrade('primary-3', primaryFirstCycleSubjects),
          },
        ],
      },
      {
        code: 'primary-second-cycle',
        label: 'Segundo ciclo',
        matchNames: ['segundo ciclo'],
        grades: [
          {
            code: 'primary-4',
            label: '4.º',
            sequence: 4,
            subjects: subjectsForGrade('primary-4', primarySecondCycleSubjects),
          },
          {
            code: 'primary-5',
            label: '5.º',
            sequence: 5,
            subjects: subjectsForGrade('primary-5', primarySecondCycleSubjects),
          },
          {
            code: 'primary-6',
            label: '6.º',
            sequence: 6,
            subjects: subjectsForGrade('primary-6', primarySecondCycleSubjects),
          },
        ],
      },
    ],
  },
  {
    code: 'secondary',
    label: 'Secundario',
    matchNames: ['secundaria', 'secundario'],
    cycles: [
      {
        code: 'secondary-first-cycle',
        label: 'Primer ciclo',
        matchNames: ['primer ciclo'],
        grades: [
          {
            code: 'secondary-1',
            label: '1.º',
            sequence: 1,
            subjects: subjectsForGrade('secondary-1', firstCycleBaseSubjects),
          },
          {
            code: 'secondary-2',
            label: '2.º',
            sequence: 2,
            subjects: subjectsForGrade(
              'secondary-2',
              withNaturalScience(firstCycleBaseSubjects, 'NAT-VIDA', 'Ciencias de la Naturaleza: Ciencias de la Vida'),
            ),
          },
          {
            code: 'secondary-3',
            label: '3.º',
            sequence: 3,
            subjects: subjectsForGrade(
              'secondary-3',
              withNaturalScience(firstCycleBaseSubjects, 'NAT-FISICAS', 'Ciencias de la Naturaleza: Ciencias Físicas'),
            ),
          },
        ],
      },
      {
        code: 'secondary-second-cycle',
        label: 'Segundo ciclo',
        matchNames: ['segundo ciclo'],
        grades: [
          {
            code: 'secondary-4',
            label: '4.º',
            sequence: 4,
            subjects: subjectsForGrade('secondary-4', secondCycleBaseSubjects),
          },
          {
            code: 'secondary-5',
            label: '5.º',
            sequence: 5,
            subjects: subjectsForGrade(
              'secondary-5',
              withNaturalScience(secondCycleBaseSubjects, 'NAT-QUI', 'Ciencias de la Naturaleza: Química'),
            ),
          },
          {
            code: 'secondary-6',
            label: '6.º',
            sequence: 6,
            subjects: subjectsForGrade(
              'secondary-6',
              withNaturalScience(secondCycleBaseSubjects, 'NAT-FIS', 'Ciencias de la Naturaleza: Física'),
            ),
          },
        ],
      },
    ],
  },
]

export const defaultSectionOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

export function normalizeAcademicText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function findCatalogItem<T extends { id: string; name: string; code?: string }>(
  items: T[],
  matchNames: string[],
) {
  const matches = matchNames.map(normalizeAcademicText)
  return items.find((item) => {
    const name = normalizeAcademicText(item.name)
    const code = item.code ? normalizeAcademicText(item.code) : ''
    return matches.some((match) => name.includes(match) || code.includes(match))
  })
}

export function attachExistingSubjectIds(options: SubjectOption[], subjects: Subject[]): SubjectOption[] {
  return options.map((option) => {
    const existing = subjects.find((subject) => {
      const sameName = normalizeAcademicText(subject.name) === normalizeAcademicText(option.name)
      const sameCode = normalizeAcademicText(subject.code) === normalizeAcademicText(option.code)
      return sameName || sameCode
    })
    return existing ? { ...option, id: existing.id } : option
  })
}

export function getExtracurricularSubjectOptions(subjects: Subject[]): SubjectOption[] {
  return subjects
    .filter((subject) => subject.description === 'custom' || subject.code.startsWith('CUSTOM-'))
    .sort((first, second) => first.name.localeCompare(second.name))
    .map((subject) => ({
      key: `extra-${subject.id}`,
      id: subject.id,
      code: subject.code,
      name: subject.name,
    }))
}
