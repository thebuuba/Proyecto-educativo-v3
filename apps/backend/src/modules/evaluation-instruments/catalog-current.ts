import { secondaryLanguageGradeTwoTopics } from '@aula/shared'
import { evaluationCatalogV1, type ActivityTypeEntry } from './catalog-v1'

/** New release; evaluation-2026.7 remains unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV1,
  version: 'evaluation-2026.8',
  activityTypes: [...evaluationCatalogV1.activityTypes,
    { id: 'ANALYSIS', family: 'WRITTEN', evidence: ['KNOWLEDGE', 'PRODUCT'], triggers: ['analizar', 'análisis'] },
    { id: 'COMPARISON', family: 'WRITTEN', evidence: ['KNOWLEDGE', 'PRODUCT'], triggers: ['comparar', 'comparación', 'contrastar'] },
  ] as ActivityTypeEntry[],
  contextualModules: secondaryLanguageGradeTwoTopics,
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { contextualModules?: typeof secondaryLanguageGradeTwoTopics }
export function evaluationCatalogForVersion(version: string) {
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
