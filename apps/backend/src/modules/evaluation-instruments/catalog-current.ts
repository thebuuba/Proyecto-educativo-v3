import { secondaryLanguageGradeTwoTopics, secondGradeNewsModule, secondaryScienceModules } from '@aula/shared'
import { evaluationCatalogV1 } from './catalog-v1'
import { evaluationCatalogV8 } from './catalog-v8'
import { evaluationCatalogV9 } from './catalog-v9'
import { evaluationCatalogV10 } from './catalog-v10'
import { evaluationCatalogV11 } from './catalog-v11'
import { evaluationCatalogV12 } from './catalog-v12'
import { evaluationCatalogV13 } from './catalog-v13'
import { secondaryMathModules } from '@aula/shared'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV13,
  version: 'evaluation-2026.14',
  mathModules: secondaryMathModules,
  compositionPolicy: 'CONTEXTUAL_CANDIDATES_ONLY_STABLE_IDENTITY_FIVE_AUTHORED_LEVELS',
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[]; scienceModules?: typeof secondaryScienceModules; mathModules?: typeof secondaryMathModules }
export function evaluationCatalogForVersion(version: string) {
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogV8.version ? evaluationCatalogV8
    : version === evaluationCatalogV9.version ? evaluationCatalogV9 : version === evaluationCatalogV10.version ? evaluationCatalogV10 : version === evaluationCatalogV11.version ? evaluationCatalogV11 : version === evaluationCatalogV12.version ? evaluationCatalogV12 : version === evaluationCatalogV13.version ? evaluationCatalogV13 : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
