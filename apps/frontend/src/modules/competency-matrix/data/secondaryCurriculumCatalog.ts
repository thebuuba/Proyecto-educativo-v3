import {
  secondaryCurriculumContent,
  secondaryCurriculumSource,
} from './secondaryCurriculumContent'

import type { SecondaryGrade } from './secondaryCurriculumContent'

export type { SecondaryGrade } from './secondaryCurriculumContent'

export type CurriculumPageRange = {
  start: number
  end: number
}

export type CurriculumSubject = {
  id: string
  area: string
  subject: string
  track?: string
  courseNames?: Partial<Record<SecondaryGrade, string>>
  pages: Partial<Record<SecondaryGrade, CurriculumPageRange>>
}

export const curriculumPdfPath = secondaryCurriculumSource.pdfPath

export const secondaryGrades: Array<{
  grade: SecondaryGrade
  label: string
  fullLabel: string
  cycle: 'Primer ciclo' | 'Segundo ciclo'
}> = [
  { grade: 1, label: '1.º', fullLabel: 'Primero de Secundaria', cycle: 'Primer ciclo' },
  { grade: 2, label: '2.º', fullLabel: 'Segundo de Secundaria', cycle: 'Primer ciclo' },
  { grade: 3, label: '3.º', fullLabel: 'Tercero de Secundaria', cycle: 'Primer ciclo' },
  { grade: 4, label: '4.º', fullLabel: 'Cuarto de Secundaria', cycle: 'Segundo ciclo' },
  { grade: 5, label: '5.º', fullLabel: 'Quinto de Secundaria', cycle: 'Segundo ciclo' },
  { grade: 6, label: '6.º', fullLabel: 'Sexto de Secundaria', cycle: 'Segundo ciclo' },
]

function pagesFor(subjectId: string): CurriculumSubject['pages'] {
  return Object.fromEntries(
    secondaryCurriculumContent
      .filter((item) => item.subjectId === subjectId)
      .map((item) => [item.grade, item.sourcePages]),
  )
}

/** Índice fiel de las mallas del PDF MINERD 2023, en el orden del documento. */
export const secondaryCurriculumSubjects: CurriculumSubject[] = [
  {
    id: 'lengua-espanola',
    area: 'Lengua Española',
    subject: 'Lengua Española',
    pages: pagesFor('lengua-espanola'),
  },
  {
    id: 'ingles',
    area: 'Lenguas Extranjeras',
    subject: 'Inglés',
    pages: pagesFor('ingles'),
  },
  {
    id: 'frances',
    area: 'Lenguas Extranjeras',
    subject: 'Francés',
    pages: pagesFor('frances'),
  },
  {
    id: 'matematica',
    area: 'Matemática',
    subject: 'Matemática',
    pages: pagesFor('matematica'),
  },
  {
    id: 'ciencias-sociales',
    area: 'Ciencias Sociales',
    subject: 'Ciencias Sociales',
    pages: pagesFor('ciencias-sociales'),
  },
  {
    id: 'ciencias-naturaleza',
    area: 'Ciencias de la Naturaleza',
    subject: 'Ciencias de la Naturaleza',
    courseNames: {
      1: 'Ciencias de la Tierra y del Universo',
      2: 'Ciencias de la Vida',
      3: 'Ciencias Físicas',
      4: 'Biología',
      5: 'Química',
      6: 'Física',
    },
    pages: pagesFor('ciencias-naturaleza'),
  },
  {
    id: 'educacion-artistica',
    area: 'Educación Artística',
    subject: 'Educación Artística',
    pages: pagesFor('educacion-artistica'),
  },
  {
    id: 'educacion-fisica',
    area: 'Educación Física',
    subject: 'Educación Física',
    pages: pagesFor('educacion-fisica'),
  },
  {
    id: 'formacion-integral',
    area: 'Formación Integral Humana y Religiosa',
    subject: 'Formación Integral Humana y Religiosa',
    pages: pagesFor('formacion-integral'),
  },
  {
    id: 'optativa-hlm-lengua',
    area: 'Lengua Española',
    subject: 'Lengua Española',
    track: 'Humanidades y Lenguas Modernas',
    courseNames: {
      4: 'Apreciación y Producción Literarias',
      5: 'Apreciación y Producción Literarias',
      6: 'Análisis y Producción de Textos Periodísticos y Publicitarios',
    },
    pages: pagesFor('optativa-hlm-lengua'),
  },
  {
    id: 'optativa-hlm-ingles',
    area: 'Lenguas Extranjeras',
    subject: 'Inglés',
    track: 'Humanidades y Lenguas Modernas',
    courseNames: {
      4: 'Manejo de la Información en Inglés',
      5: 'Apreciación de la Literatura Anglófona',
      6: 'Análisis Crítico y Evaluación de Textos en Inglés',
    },
    pages: pagesFor('optativa-hlm-ingles'),
  },
  {
    id: 'optativa-hcs-lengua',
    area: 'Lengua Española',
    subject: 'Lengua Española',
    track: 'Humanidades y Ciencias Sociales',
    courseNames: {
      4: 'Apreciación y Producción Literaria',
      5: 'Apreciación y Producción Literaria',
      6: 'Análisis y Producción de Textos Científicos y Profesionales',
    },
    pages: pagesFor('optativa-hcs-lengua'),
  },
  {
    id: 'optativa-hcs-sociales',
    area: 'Ciencias Sociales',
    subject: 'Ciencias Sociales',
    track: 'Humanidades y Ciencias Sociales',
    courseNames: {
      4: 'Filosofía Social y Pensamiento Dominicano',
      5: 'Geografía Humana y Demografía',
      6: 'Ciudadanía y Democracia Participativa',
    },
    pages: pagesFor('optativa-hcs-sociales'),
  },
  {
    id: 'optativa-matematica-tecnologia',
    area: 'Matemática',
    subject: 'Matemática',
    track: 'Matemática y Tecnología',
    courseNames: {
      4: 'Matemática Financiera y Tecnología',
      5: 'Estadística, Probabilidad y Tecnología',
      6: 'Trigonometría, Cálculo Diferencial y Tecnología',
    },
    pages: pagesFor('optativa-matematica-tecnologia'),
  },
  {
    id: 'optativa-ciencias-tecnologia',
    area: 'Ciencias de la Naturaleza',
    subject: 'Ciencias de la Naturaleza',
    track: 'Ciencias y Tecnología',
    courseNames: {
      4: 'Biología y Computación',
      5: 'Química y Computación',
      6: 'Física y Computación',
    },
    pages: pagesFor('optativa-ciencias-tecnologia'),
  },
]

export function getCurriculumForGrade(grade: SecondaryGrade) {
  return secondaryCurriculumSubjects.filter((item) => item.pages[grade])
}

export function getCurriculumSelection(grade: SecondaryGrade, subjectId?: string | null) {
  const subjects = getCurriculumForGrade(grade)
  return subjects.find((item) => item.id === subjectId) ?? subjects[0]
}

export function secondaryGradeFromName(value: string): SecondaryGrade | null {
  const match = value.match(/(?:^|\D)([1-6])(?:ro|do|to|mo|er|\.|º|°|\D|$)/i)
  return match ? Number(match[1]) as SecondaryGrade : null
}

export function secondaryGradeFromCourse(gradeName: string, educationLevel: string): SecondaryGrade | null {
  return normalize(educationLevel).includes('secund') ? secondaryGradeFromName(gradeName) : null
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function findCurriculumSubject(
  grade: SecondaryGrade,
  subjectName: string,
  preferredId?: string | null,
) {
  const items = getCurriculumForGrade(grade)
  if (preferredId) {
    const preferred = items.find((item) => item.id === preferredId)
    if (preferred) return preferred
  }

  const name = normalize(subjectName)
  const exactCourse = name
    ? items.find((item) => normalize(item.courseNames?.[grade] ?? '') === name)
    : undefined
  if (exactCourse) return exactCourse

  const id = name.includes('lengua espanola') ? 'lengua-espanola'
    : name.includes('ingles') ? 'ingles'
      : name.includes('frances') ? 'frances'
        : name.includes('matemat') ? 'matematica'
          : name.includes('social') || name.includes('historia') || name.includes('geograf') ? 'ciencias-sociales'
            : name.includes('educacion fisica') || name.includes('deporte') ? 'educacion-fisica'
              : name.includes('naturaleza') || name.includes('biolog') || name.includes('quim') || name.includes('fisic') ? 'ciencias-naturaleza'
                : name.includes('artist') || name.includes('arte') ? 'educacion-artistica'
                  : name.includes('relig') || name.includes('formacion integral') ? 'formacion-integral'
                    : null

  return items.find((item) => item.id === id)
}

export function curriculumPdfUrl(page: number) {
  return `${curriculumPdfPath}#page=${page}&view=FitH`
}
