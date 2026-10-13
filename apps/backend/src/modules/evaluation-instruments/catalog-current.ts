import { secondaryLanguageGradeTwoTopics, secondGradeNewsModule, secondaryScienceModules } from '@aula/shared'
import { evaluationCatalogV1 } from './catalog-v1'
import { evaluationCatalogV8 } from './catalog-v8'
import { evaluationCatalogV9 } from './catalog-v9'
import { evaluationCatalogV10 } from './catalog-v10'
import { evaluationCatalogV11 } from './catalog-v11'
import { evaluationCatalogV12 } from './catalog-v12'
import { evaluationCatalogV13 } from './catalog-v13'
import { evaluationCatalogV14 } from './catalog-v14'
import { evaluationCatalogV15 } from './catalog-v15'
import { evaluationCatalogV16 } from './catalog-v16'
import { evaluationCatalogV17 } from './catalog-v17'
import { evaluationCatalogV18 } from './catalog-v18'
import { secondaryMathModules, novelAnalysisModule } from '@aula/shared'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV18,
  version: 'evaluation-2026.19',
  novelAnalysisModule,
  taskContentPolicy:'STUDIED_OBJECT_DELIVERED_PRODUCT_ACTION_FALLBACK',
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[]; scienceModules?: typeof secondaryScienceModules; mathModules?: typeof secondaryMathModules }
export function evaluationCatalogForVersion(version: string) {
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogV8.version ? evaluationCatalogV8
    : version === evaluationCatalogV9.version ? evaluationCatalogV9 : version === evaluationCatalogV10.version ? evaluationCatalogV10 : version === evaluationCatalogV11.version ? evaluationCatalogV11 : version === evaluationCatalogV12.version ? evaluationCatalogV12 : version === evaluationCatalogV13.version ? evaluationCatalogV13 : version === evaluationCatalogV14.version ? evaluationCatalogV14 : version === evaluationCatalogV15.version ? evaluationCatalogV15 : version === evaluationCatalogV16.version ? evaluationCatalogV16 : version === evaluationCatalogV17.version ? evaluationCatalogV17 : version === evaluationCatalogV18.version ? evaluationCatalogV18 : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
