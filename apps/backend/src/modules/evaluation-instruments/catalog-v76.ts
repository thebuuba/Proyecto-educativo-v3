import { evaluationCatalogV75 } from './catalog-v75'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.76",
  "frenchInteractionEvidencePolicy": "EXPLICIT_QUESTIONS_RESPONSES_RESIDENCE_AND_EXCHANGED_ROLES_V1"
}
export const evaluationCatalogV76 = { ...evaluationCatalogV75, ...frozen }
