import content from './secondaryCurriculumContent.json'

import type { SecondaryGrade } from './secondaryCurriculumCatalog'

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
