import { evaluationCatalogV72 } from './catalog-v72'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.73",
  "frenchModules": [
    {
      "id": "frances-comunicacion-1",
      "grade": 1,
      "subjectCode": "FRA",
      "pdfPages": [
        181,
        182,
        183,
        184
      ],
      "policy": "EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1"
    },
    {
      "id": "frances-comunicacion-2",
      "grade": 2,
      "subjectCode": "FRA",
      "pdfPages": [
        185,
        186,
        187,
        188
      ],
      "policy": "EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1"
    },
    {
      "id": "frances-comunicacion-3",
      "grade": 3,
      "subjectCode": "FRA",
      "pdfPages": [
        189,
        190,
        191,
        192
      ],
      "policy": "EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1"
    },
    {
      "id": "frances-comunicacion-4",
      "grade": 4,
      "subjectCode": "FRA",
      "pdfPages": [
        199,
        200,
        201,
        202
      ],
      "policy": "EXPLICIT_FRENCH_FUNCTIONS_ACTIONS_ALTERNATIVES_V1"
    }
  ]
}
export const evaluationCatalogV73 = { ...evaluationCatalogV72, ...frozen }
