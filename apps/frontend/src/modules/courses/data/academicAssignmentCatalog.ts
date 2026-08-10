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
  { code: 'ING', name: 'Lenguas Extranjeras: Inglés' },
  { code: 'FRA', name: 'Lenguas Extranjeras: Francés' },
  { code: 'MAT', name: 'Matemática' },
  { code: 'SOC', name: 'Ciencias Sociales' },
  { code: 'NAT-BIO', name: 'Ciencias de la Naturaleza: Biología' },
  { code: 'ART', name: 'Educación Artística' },
  { code: 'EFI', name: 'Educación Física' },
  { code: 'FHR', name: 'Formación Integral Humana y Religiosa' },
]

const secondCycleOptatives = {
  4: [
    { code: 'OPT-HLM-LEN-4', name: 'Apreciación y Producción Literarias' },
    { code: 'OPT-HLM-ING-4', name: 'Manejo de la Información en Inglés' },
    { code: 'OPT-HCS-LEN-4', name: 'Apreciación y Producción Literaria' },
    { code: 'OPT-HCS-SOC-4', name: 'Filosofía Social y Pensamiento Dominicano' },
    { code: 'OPT-MT-4', name: 'Matemática Financiera y Tecnología' },
    { code: 'OPT-CT-4', name: 'Biología y Computación' },
  ],
  5: [
    { code: 'OPT-HLM-LEN-5', name: 'Apreciación y Producción Literarias' },
    { code: 'OPT-HLM-ING-5', name: 'Apreciación de la Literatura Anglófona' },
    { code: 'OPT-HCS-LEN-5', name: 'Apreciación y Producción Literaria' },
    { code: 'OPT-HCS-SOC-5', name: 'Geografía Humana y Demografía' },
    { code: 'OPT-MT-5', name: 'Estadística, Probabilidad y Tecnología' },
    { code: 'OPT-CT-5', name: 'Química y Computación' },
  ],
  6: [
    { code: 'OPT-HLM-LEN-6', name: 'Análisis y Producción de Textos Periodísticos y Publicitarios' },
    { code: 'OPT-HLM-ING-6', name: 'Análisis Crítico y Evaluación de Textos en Inglés' },
    { code: 'OPT-HCS-LEN-6', name: 'Análisis y Producción de Textos Científicos y Profesionales' },
    { code: 'OPT-HCS-SOC-6', name: 'Ciudadanía y Democracia Participativa' },
    { code: 'OPT-MT-6', name: 'Trigonometría, Cálculo Diferencial y Tecnología' },
    { code: 'OPT-CT-6', name: 'Física y Computación' },
  ],
} as const

function secondCycleSubjectsForGrade(grade: 4 | 5 | 6, scienceCode: string, scienceName: string) {
  const base = withNaturalScience(secondCycleBaseSubjects, scienceCode, scienceName)
  const [hlmLanguage, hlmEnglish, hcsLanguage, hcsSocial, mathTechnology, scienceTechnology] = secondCycleOptatives[grade]
  return [
    base[0], hlmLanguage, hcsLanguage,
    base[1], hlmEnglish,
    base[2],
    base[3], mathTechnology,
    base[4], hcsSocial,
    base[5], scienceTechnology,
    ...base.slice(6),
  ]
}

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
            subjects: subjectsForGrade(
              'secondary-4',
              secondCycleSubjectsForGrade(4, 'NAT-BIO', 'Ciencias de la Naturaleza: Biología'),
            ),
          },
          {
            code: 'secondary-5',
            label: '5.º',
            sequence: 5,
            subjects: subjectsForGrade(
              'secondary-5',
              secondCycleSubjectsForGrade(5, 'NAT-QUI', 'Ciencias de la Naturaleza: Química'),
            ),
          },
          {
            code: 'secondary-6',
            label: '6.º',
            sequence: 6,
            subjects: subjectsForGrade(
              'secondary-6',
              secondCycleSubjectsForGrade(6, 'NAT-FIS', 'Ciencias de la Naturaleza: Física'),
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
