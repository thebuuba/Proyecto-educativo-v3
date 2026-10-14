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
import { secondaryMathModules } from '@aula/shared'
import { evaluationCatalogV19 } from './catalog-v19'
import { evaluationCatalogV20 } from './catalog-v20'
import { evaluationCatalogV21 } from './catalog-v21'
import { evaluationCatalogV22 } from './catalog-v22'
import { secondGradeLanguageFeatures } from '@aula/shared'
import { evaluationCatalogV23 } from './catalog-v23'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV23,
  version: 'evaluation-2026.24',
  secondGradeLanguageFeatures,
  secondGradeLanguagePolicy:'ACTION_PRODUCT_PROCEDURES_AND_EXPLICIT_FEATURES_V1',
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[]; scienceModules?: typeof secondaryScienceModules; mathModules?: typeof secondaryMathModules }
export function evaluationCatalogForVersion(version: string) {
  if(version===evaluationCatalogV23.version)return evaluationCatalogV23
  if(version===evaluationCatalogV21.version) return evaluationCatalogV21
  if(version===evaluationCatalogV22.version) return evaluationCatalogV22
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogV8.version ? evaluationCatalogV8
    : version === evaluationCatalogV9.version ? evaluationCatalogV9 : version === evaluationCatalogV10.version ? evaluationCatalogV10 : version === evaluationCatalogV11.version ? evaluationCatalogV11 : version === evaluationCatalogV12.version ? evaluationCatalogV12 : version === evaluationCatalogV13.version ? evaluationCatalogV13 : version === evaluationCatalogV14.version ? evaluationCatalogV14 : version === evaluationCatalogV15.version ? evaluationCatalogV15 : version === evaluationCatalogV16.version ? evaluationCatalogV16 : version === evaluationCatalogV17.version ? evaluationCatalogV17 : version === evaluationCatalogV18.version ? evaluationCatalogV18 : version === evaluationCatalogV19.version ? evaluationCatalogV19 : version === evaluationCatalogV20.version ? evaluationCatalogV20 : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
