import {evaluationCatalogV42} from './catalog-v42'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.43",
  "authoredCandidatePoolPolicy": "CANDIDATES_INDEPENDENT_OF_FINAL_CAPACITY_V1",
  "englishGradeOneContextPolicy": "EXPLICIT_OBSERVABLE_COMMUNICATION_NO_PERSONALITY_SCORE_V1"
}
export const evaluationCatalogV43={...evaluationCatalogV42,...frozen}
