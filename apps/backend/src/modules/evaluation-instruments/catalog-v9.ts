import { secondGradeNewsModule } from '@aula/shared'
import { evaluationCatalogV8 } from './catalog-v8'
/** Archived release: do not modify existing snapshot/catalog payloads. */
export const evaluationCatalogV9 = { ...evaluationCatalogV8, version: 'evaluation-2026.9', authoredModules: [secondGradeNewsModule] }
