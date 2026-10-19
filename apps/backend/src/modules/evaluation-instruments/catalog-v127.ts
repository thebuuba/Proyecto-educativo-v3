import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV126 } from './catalog-v126'
/** Exact127 payload checked against Development; previous fields remain inherited. */
export const evaluationCatalogV127={...evaluationCatalogV126,version:'evaluation-2026.127',optativeEnglishModules:[
  {
    "id": "optativa-hlm-ingles-4",
    "grade": 4,
    "subjectCode": "OPT-HLM-ING-4",
    "subjectName": "Manejo de la información en inglés",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "b2d7a388-b852-52a5-adf5-d78642f21f96",
    "pdfPages": [
      445,
      446,
      447,
      448,
      449
    ],
    "policy": "EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_FORM_SOURCE_REVIEW_V1"
  }
]} as unknown as EvaluationCatalog
