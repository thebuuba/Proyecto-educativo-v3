export type SecondaryGrade = 1 | 2 | 3 | 4 | 5 | 6

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

export const curriculumPdfPath = '/docs/adecuacion-curricular-nivel-secundario-2022.pdf'

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

const allGrades = (
  first: CurriculumPageRange,
  second: CurriculumPageRange,
  third: CurriculumPageRange,
  fourth: CurriculumPageRange,
  fifth: CurriculumPageRange,
  sixth: CurriculumPageRange,
): CurriculumSubject['pages'] => ({
  1: first,
  2: second,
  3: third,
  4: fourth,
  5: fifth,
  6: sixth,
})

const secondCycle = (
  fourth: CurriculumPageRange,
  fifth: CurriculumPageRange,
  sixth: CurriculumPageRange,
): CurriculumSubject['pages'] => ({ 4: fourth, 5: fifth, 6: sixth })

/** Índice fiel de las mallas del PDF MINERD 2022, en el orden del documento. */
export const secondaryCurriculumSubjects: CurriculumSubject[] = [
  {
    id: 'lengua-espanola',
    area: 'Lengua Española',
    subject: 'Lengua Española',
    pages: allGrades(
      { start: 24, end: 27 }, { start: 28, end: 31 }, { start: 32, end: 35 },
      { start: 42, end: 45 }, { start: 46, end: 49 }, { start: 50, end: 53 },
    ),
  },
  {
    id: 'ingles',
    area: 'Lenguas Extranjeras',
    subject: 'Inglés',
    pages: allGrades(
      { start: 66, end: 70 }, { start: 71, end: 75 }, { start: 76, end: 80 },
      { start: 88, end: 92 }, { start: 93, end: 97 }, { start: 98, end: 102 },
    ),
  },
  {
    id: 'frances',
    area: 'Lenguas Extranjeras',
    subject: 'Francés',
    pages: allGrades(
      { start: 110, end: 113 }, { start: 114, end: 117 }, { start: 118, end: 120 },
      { start: 128, end: 131 }, { start: 132, end: 135 }, { start: 136, end: 138 },
    ),
  },
  {
    id: 'matematica',
    area: 'Matemática',
    subject: 'Matemática',
    pages: allGrades(
      { start: 146, end: 147 }, { start: 148, end: 149 }, { start: 150, end: 151 },
      { start: 157, end: 158 }, { start: 159, end: 160 }, { start: 161, end: 162 },
    ),
  },
  {
    id: 'ciencias-sociales',
    area: 'Ciencias Sociales',
    subject: 'Ciencias Sociales',
    pages: allGrades(
      { start: 171, end: 175 }, { start: 176, end: 179 }, { start: 180, end: 182 },
      { start: 190, end: 193 }, { start: 194, end: 198 }, { start: 199, end: 202 },
    ),
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
    pages: allGrades(
      { start: 213, end: 214 }, { start: 215, end: 217 }, { start: 218, end: 221 },
      { start: 228, end: 231 }, { start: 232, end: 234 }, { start: 235, end: 237 },
    ),
  },
  {
    id: 'educacion-artistica',
    area: 'Educación Artística',
    subject: 'Educación Artística',
    pages: allGrades(
      { start: 245, end: 246 }, { start: 247, end: 248 }, { start: 249, end: 250 },
      { start: 254, end: 255 }, { start: 256, end: 257 }, { start: 258, end: 259 },
    ),
  },
  {
    id: 'educacion-fisica',
    area: 'Educación Física',
    subject: 'Educación Física',
    pages: allGrades(
      { start: 267, end: 269 }, { start: 270, end: 271 }, { start: 272, end: 274 },
      { start: 278, end: 280 }, { start: 281, end: 282 }, { start: 283, end: 285 },
    ),
  },
  {
    id: 'formacion-integral',
    area: 'Formación Integral Humana y Religiosa',
    subject: 'Formación Integral Humana y Religiosa',
    pages: allGrades(
      { start: 294, end: 296 }, { start: 297, end: 299 }, { start: 300, end: 302 },
      { start: 311, end: 314 }, { start: 315, end: 318 }, { start: 319, end: 322 },
    ),
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
    pages: secondCycle({ start: 327, end: 329 }, { start: 330, end: 332 }, { start: 333, end: 336 }),
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
    pages: secondCycle({ start: 337, end: 341 }, { start: 342, end: 346 }, { start: 347, end: 352 }),
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
    pages: secondCycle({ start: 353, end: 355 }, { start: 356, end: 357 }, { start: 358, end: 361 }),
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
    pages: secondCycle({ start: 363, end: 364 }, { start: 365, end: 366 }, { start: 367, end: 368 }),
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
    pages: secondCycle({ start: 369, end: 370 }, { start: 371, end: 371 }, { start: 372, end: 373 }),
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
    pages: secondCycle({ start: 374, end: 377 }, { start: 378, end: 379 }, { start: 380, end: 382 }),
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
