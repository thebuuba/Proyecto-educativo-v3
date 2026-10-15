import {evaluationCatalogV64} from './catalog-v64'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.65",
  "englishChecklistEvidencePolicy": "EXPLICIT_FACTS_RECEPTION_PRODUCTION_AND_SCOPED_GENRE_DATA_V3"
}
export const evaluationCatalogV65={...evaluationCatalogV64,...frozen}
