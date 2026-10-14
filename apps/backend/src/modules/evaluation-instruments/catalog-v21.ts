import {firstGradeLanguageProcedureFeatures,firstGradeLanguageFeatureTerms} from '@aula/shared'
import {evaluationCatalogV20} from './catalog-v20'

export const evaluationCatalogV21={
  ...evaluationCatalogV20,
  version:'evaluation-2026.21',
  firstGradeLanguageProcedureFeatures,
  firstGradeLanguageFeatureTerms,
  languageProcedurePolicy:'SOURCE_LINKED_EXPLICIT_READING_WRITING_PROCEDURES_V1',
}
