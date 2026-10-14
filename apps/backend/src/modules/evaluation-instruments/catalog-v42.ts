import {evaluationCatalogV41} from './catalog-v41'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.42",
  "authoredCriterionCapacityPolicy": "REJECT_OVER_CAPACITY_WITHOUT_SILENT_TRUNCATION_V1"
}
export const evaluationCatalogV42={...evaluationCatalogV41,...frozen}
