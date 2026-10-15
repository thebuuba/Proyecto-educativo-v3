import { evaluationCatalogV69 } from './catalog-v69'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.70",
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
    }
  ]
}
export const evaluationCatalogV70 = { ...evaluationCatalogV69, ...frozen }
