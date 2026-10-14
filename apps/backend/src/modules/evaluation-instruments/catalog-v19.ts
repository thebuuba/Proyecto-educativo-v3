import {novelAnalysisModule} from '@aula/shared'
import {evaluationCatalogV18} from './catalog-v18'

/** Immutable release used by existing instrument snapshots. */
export const evaluationCatalogV19 = {
  ...evaluationCatalogV18,
  version: 'evaluation-2026.19',
  novelAnalysisModule,
  taskContentPolicy: 'STUDIED_OBJECT_DELIVERED_PRODUCT_ACTION_FALLBACK',
}
