import content from './secondaryCurriculumContent.json'

export type SecondaryGrade = 1 | 2 | 3 | 4 | 5 | 6

export type SecondaryCurriculumContent = {
  key: string
  subjectId: string
  grade: SecondaryGrade
  fundamentalCompetencies: string[]
  specificCompetence: string
  contentConceptual: string
  contentProcedural: string
  contentAttitudinal: string
  achievementIndicator: string
  sourcePages: { start: number; end: number }
}

export type CurriculumEditableFields = Pick<
  SecondaryCurriculumContent,
  | 'specificCompetence'
  | 'contentConceptual'
  | 'contentProcedural'
  | 'contentAttitudinal'
  | 'achievementIndicator'
>

export const secondaryCurriculumContent = content as SecondaryCurriculumContent[]

export const secondaryCurriculumSource = {
  title: 'Adecuación Curricular del Nivel Secundario',
  version: '2023',
  ordinance: 'Ordenanza 03-2023',
  effectiveFrom: '2023-2024',
  pdfPath: '/docs/adecuacion-curricular-nivel-secundario-2023.pdf',
} as const

export const currentMinerdPolicyContext = [
  'Moral, Cívica y Ética Ciudadana, de aplicación transversal sin aumentar la carga horaria (Ordenanza 02-2025).',
  'Competencias digitales, pensamiento computacional, ciudadanía digital y uso ético de la inteligencia artificial, integrados transversalmente (Estrategia Nacional 2026).',
].join(' ')

export function getSecondaryCurriculumContent(grade: SecondaryGrade, subjectId: string) {
  return secondaryCurriculumContent.find((item) => item.grade === grade && item.subjectId === subjectId)
}

export function curriculumFieldsAreEmpty(fields: CurriculumEditableFields) {
  return Object.values(fields).every((value) => !value.trim())
}

export function curriculumFieldsMatch(
  fields: CurriculumEditableFields,
  curriculum: SecondaryCurriculumContent,
) {
  return fields.specificCompetence === curriculum.specificCompetence
    && fields.contentConceptual === curriculum.contentConceptual
    && fields.contentProcedural === curriculum.contentProcedural
    && fields.contentAttitudinal === curriculum.contentAttitudinal
    && fields.achievementIndicator === curriculum.achievementIndicator
}
