import { secondaryLanguageGradeTwoTopics, secondGradeNewsModule, secondaryScienceModules } from '@aula/shared'
import { evaluationCatalogV1 } from './catalog-v1'
import { evaluationCatalogV8 } from './catalog-v8'
import { evaluationCatalogV9 } from './catalog-v9'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV9,
  version: 'evaluation-2026.10',
  scienceModules: secondaryScienceModules,
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[]; scienceModules?: typeof secondaryScienceModules }
export function evaluationCatalogForVersion(version: string) {
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogV8.version ? evaluationCatalogV8
    : version === evaluationCatalogV9.version ? evaluationCatalogV9 : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
