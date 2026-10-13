import { secondaryLanguageGradeTwoTopics, secondGradeNewsModule } from '@aula/shared'
import { evaluationCatalogV1 } from './catalog-v1'
import { evaluationCatalogV8 } from './catalog-v8'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV8,
  version: 'evaluation-2026.9',
  authoredModules: [secondGradeNewsModule],
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[] }
export function evaluationCatalogForVersion(version: string) {
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogV8.version ? evaluationCatalogV8
    : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
