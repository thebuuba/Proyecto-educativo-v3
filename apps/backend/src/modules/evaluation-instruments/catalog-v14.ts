import {secondaryMathModules} from '@aula/shared'
import {evaluationCatalogV13} from './catalog-v13'

/** Immutable payload of evaluation-2026.14. */
export const evaluationCatalogV14={
  ...evaluationCatalogV13,
  version:'evaluation-2026.14',
  mathModules:secondaryMathModules,
  compositionPolicy:'CONTEXTUAL_CANDIDATES_ONLY_STABLE_IDENTITY_FIVE_AUTHORED_LEVELS',
}
