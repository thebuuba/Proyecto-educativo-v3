import { secondaryScienceModules } from '@aula/shared'
import { evaluationCatalogV9 } from './catalog-v9'

/** Archived release. New authored modules and format rules belong to a new release. */
export const evaluationCatalogV10 = { ...evaluationCatalogV9, version: 'evaluation-2026.10', scienceModules: secondaryScienceModules }
