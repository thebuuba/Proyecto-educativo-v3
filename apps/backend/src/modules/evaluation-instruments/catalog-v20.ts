import {firstGradeLanguageFeatures} from '@aula/shared'
import {evaluationCatalogV19} from './catalog-v19'

/** Immutable release used by existing instrument snapshots. */
export const evaluationCatalogV20={
  ...evaluationCatalogV19,
  version:'evaluation-2026.20',
  firstGradeLanguageFeatures,
  languageEvidencePolicy:'EXPLICIT_FEATURE_ACTION_PRODUCT_V1',
  languageInstrumentPolicy:'QUALITY_PRESENCE_REGULARITY_WEIGHTED_COMPONENTS',
  scoringPolicy:'ORIGINAL_RELATIVE_WEIGHTS_HUNDREDTHS',
}
