import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV171} from './catalog-v171'
/** Payload 172 conservado: el piloto no transforma releases ni snapshots anteriores. */
export const evaluationCatalogV172={...evaluationCatalogV171,version:'evaluation-2026.172'} as unknown as EvaluationCatalog
