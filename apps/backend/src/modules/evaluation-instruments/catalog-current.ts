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
import { evaluationCatalogV24 } from './catalog-v24'
import { evaluationCatalogV25 } from './catalog-v25'
import { evaluationCatalogV26 } from './catalog-v26'
import { secondaryLanguageGradeThreeTopics,thirdGradeLanguageFeatures } from '@aula/shared'
import {secondaryLanguageGradeFourTopics,fourthGradeLanguageFeatures} from '@aula/shared'
import {evaluationCatalogV27} from './catalog-v27'
import {evaluationCatalogV28} from './catalog-v28'
import {evaluationCatalogV29} from './catalog-v29'
import {evaluationCatalogV30} from './catalog-v30'
import {evaluationCatalogV31} from './catalog-v31'
import {evaluationCatalogV32} from './catalog-v32'
import {evaluationCatalogV33} from './catalog-v33'
import {evaluationCatalogV34} from './catalog-v34'
import {evaluationCatalogV35} from './catalog-v35'
import {evaluationCatalogV36} from './catalog-v36'
import {evaluationCatalogV37} from './catalog-v37'
import {englishGradeOneLexicon} from '@aula/shared'
import {englishGradeOneGrammar} from '@aula/shared'
import {englishGradeOneModule} from '@aula/shared'
import type {ActivityTypeEntry} from './catalog-v1'
import {secondaryLanguageGradeSixTopics,sixthGradeLanguageFeatures} from '@aula/shared'
import {secondaryLanguageGradeFiveTopics,fifthGradeLanguageFeatures} from '@aula/shared'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV37,
  version: 'evaluation-2026.38',
  englishGradeOneLexicon,
  englishGradeOneLexiconPolicy:'REQUESTED_LEXICAL_FIELDS_AND_COMMUNICATIVE_EXPRESSIONS_V1',
  englishGradeOneGrammar,
  englishGradeOneGrammarPolicy:'ONLY_REQUESTED_FORMS_RECOGNITION_EXPLANATION_USE_V1',
  englishGradeOneModule,
  activityTypes:[...evaluationCatalogV34.activityTypes,
    {id:'ORAL_INTERACTION',family:'ORAL',evidence:['PERFORMANCE','KNOWLEDGE'],triggers:[]},
    {id:'LISTENING_COMPREHENSION',family:'OBSERVATIONAL',evidence:['KNOWLEDGE','PERFORMANCE'],triggers:[]},
    {id:'READING_COMPREHENSION',family:'WRITTEN',evidence:['KNOWLEDGE','PRODUCT'],triggers:[]},
  ] as ActivityTypeEntry[],
  languageCompositionPolicy:'EXPLICIT_EVIDENCE_WITHOUT_DUPLICATE_RHYTHM_OR_PERFORMANCE_ORAL_V1',
  contextualModules:[...secondaryLanguageGradeTwoTopics,...secondaryLanguageGradeThreeTopics,...secondaryLanguageGradeFourTopics,...secondaryLanguageGradeFiveTopics,...secondaryLanguageGradeSixTopics],
  sixthGradeLanguageFeatures,
  sixthGradeLanguagePolicy:'TOPIC_ACTION_EXPLICIT_REQUIREMENTS_PERFORMANCE_V2',
  fifthGradeLanguageFeatures,
  fifthGradeLanguagePolicy:'TOPIC_ACTION_EXPLICIT_REQUIREMENTS_SOURCE_OVERLAY_PERFORMANCE_V2',
  fourthGradeLanguageFeatures,
  fourthGradeLanguagePolicy:'TOPIC_ACTION_EXPLICIT_REQUIREMENTS_TERMS_V2',
  thirdGradeLanguageFeatures,
  thirdGradeLanguagePolicy:'TOPIC_ACTION_EXPLICIT_REQUIREMENTS_GESTURES_V2',
  secondGradeLanguageFeatures,
  secondGradeLanguagePolicy:'PROCEDURAL_DETAILS_COMPREHENSION_PRODUCTS_AND_FAMILIES_V2',
}
export type EvaluationCatalog = typeof evaluationCatalogV1 & { englishGradeOneModule?:typeof englishGradeOneModule; contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[]; scienceModules?: typeof secondaryScienceModules; mathModules?: typeof secondaryMathModules }
export function evaluationCatalogForVersion(version: string) {
  if(version===evaluationCatalogV37.version)return evaluationCatalogV37
  if(version===evaluationCatalogV36.version)return evaluationCatalogV36
  if(version===evaluationCatalogV35.version)return evaluationCatalogV35
  if(version===evaluationCatalogV34.version)return evaluationCatalogV34
  if(version===evaluationCatalogV33.version)return evaluationCatalogV33
  if(version===evaluationCatalogV32.version)return evaluationCatalogV32
  if(version===evaluationCatalogV31.version)return evaluationCatalogV31
  if(version===evaluationCatalogV30.version)return evaluationCatalogV30
  if(version===evaluationCatalogV29.version)return evaluationCatalogV29
  if(version===evaluationCatalogV28.version)return evaluationCatalogV28
  if(version===evaluationCatalogV27.version)return evaluationCatalogV27
  if(version===evaluationCatalogV26.version)return evaluationCatalogV26
  if(version===evaluationCatalogV25.version)return evaluationCatalogV25
  if(version===evaluationCatalogV24.version)return evaluationCatalogV24
  if(version===evaluationCatalogV23.version)return evaluationCatalogV23
  if(version===evaluationCatalogV21.version) return evaluationCatalogV21
  if(version===evaluationCatalogV22.version) return evaluationCatalogV22
  return version === evaluationCatalogV1.version ? evaluationCatalogV1 : version === evaluationCatalogV8.version ? evaluationCatalogV8
    : version === evaluationCatalogV9.version ? evaluationCatalogV9 : version === evaluationCatalogV10.version ? evaluationCatalogV10 : version === evaluationCatalogV11.version ? evaluationCatalogV11 : version === evaluationCatalogV12.version ? evaluationCatalogV12 : version === evaluationCatalogV13.version ? evaluationCatalogV13 : version === evaluationCatalogV14.version ? evaluationCatalogV14 : version === evaluationCatalogV15.version ? evaluationCatalogV15 : version === evaluationCatalogV16.version ? evaluationCatalogV16 : version === evaluationCatalogV17.version ? evaluationCatalogV17 : version === evaluationCatalogV18.version ? evaluationCatalogV18 : version === evaluationCatalogV19.version ? evaluationCatalogV19 : version === evaluationCatalogV20.version ? evaluationCatalogV20 : version === evaluationCatalogCurrent.version ? evaluationCatalogCurrent : null
}
