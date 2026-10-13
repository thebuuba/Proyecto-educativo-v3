import { firstGradeNewsModule } from '@aula/shared'
import { evaluationCatalogV10 } from './catalog-v10'

/** Archived release; preserve previously saved instruments. */
export const evaluationCatalogV11 = { ...evaluationCatalogV10, version: 'evaluation-2026.11', firstGradeNewsModule,
  authoredFormatPolicy: 'observable-indicators-and-contextual-half-credit-v1' }
