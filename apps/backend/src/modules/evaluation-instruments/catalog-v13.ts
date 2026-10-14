import { firstGradeReadingReportModule } from '@aula/shared'
import { evaluationCatalogV12 } from './catalog-v12'

/** Archived release; preserved for existing snapshots. */
export const evaluationCatalogV13 = { ...evaluationCatalogV12, version: 'evaluation-2026.13', firstGradeReadingReportModule }
