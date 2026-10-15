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
import {evaluationCatalogV38} from './catalog-v38'
import {evaluationCatalogV39} from './catalog-v39'
import {evaluationCatalogV40} from './catalog-v40'
import {evaluationCatalogV41} from './catalog-v41'
import {evaluationCatalogV42} from './catalog-v42'
import {evaluationCatalogV43} from './catalog-v43'
import {evaluationCatalogV44} from './catalog-v44'
import {evaluationCatalogV45} from './catalog-v45'
import {evaluationCatalogV46} from './catalog-v46'
import {evaluationCatalogV47} from './catalog-v47'
import {evaluationCatalogV48} from './catalog-v48'
import {evaluationCatalogV49} from './catalog-v49'
import {evaluationCatalogV50} from './catalog-v50'
import {evaluationCatalogV51} from './catalog-v51'
import {evaluationCatalogV52} from './catalog-v52'
import {evaluationCatalogV53} from './catalog-v53'
import {evaluationCatalogV54} from './catalog-v54'
import {englishGradeThreeModule,englishGradeThreeGrammar,englishGradeThreeLexicon,englishGradeThreeStrategies,englishGradeThreeGenres} from '@aula/shared'
import {englishGradeTwoModule,englishGradeTwoGrammar,englishGradeTwoLexicon,englishGradeTwoStrategies,englishGradeTwoGenres} from '@aula/shared'
import {englishGradeOneGenres} from '@aula/shared'
import {englishGradeOneStrategies} from '@aula/shared'
import {englishGradeOneLexicon} from '@aula/shared'
import {englishGradeOneGrammar} from '@aula/shared'
import {englishGradeOneModule} from '@aula/shared'
import type {ActivityTypeEntry} from './catalog-v1'
import {secondaryLanguageGradeSixTopics,sixthGradeLanguageFeatures} from '@aula/shared'
import {secondaryLanguageGradeFiveTopics,fifthGradeLanguageFeatures} from '@aula/shared'

/** New release; previous releases remain unchanged for existing snapshots. */
export const evaluationCatalogCurrent = {
  ...evaluationCatalogV54,
  version: 'evaluation-2026.55',
  englishGradeThreeComprehensionPolicy:'EXPLICIT_COMPREHENSION_AND_CLARIFICATION_BOTH_REQUIRED_V1',
  englishGradeThreeModule,
  englishGradeThreeGrammar,
  englishGradeThreeLexicon,
  englishGradeThreeStrategies,
  englishGradeThreeGenres,
  englishGradeTwoNarrativePolicy:'EXPERIENCE_EVENTS_ONCE_EXPLICIT_NARRATIVE_COMPONENTS_RETAINED_V1',
  englishGradeTwoShoppingPolicy:'PURCHASE_VERB_FORMS_EXCLUDE_CHECK_AND_COMPREHEND_V1',
  englishGradeTwoRevisionPolicy:'EXPLICIT_MEANING_CORRECTION_AND_REPLY_EVIDENCE_V1',
  englishGradeTwoReceptionPolicy:'REQUESTED_MENU_PRODUCT_PRICE_NO_IMPLICIT_PURCHASE_V1',
  criterionCompletionPolicy:'EXPLICIT_MANUAL_ADDITION_EXHAUSTION_NO_BLANK_PROPOSAL_V1',
  englishGradeOneRequestedEvidencePolicy:'ACTIVITY_QUANTITY_TEMPORAL_EXPRESSIONS_ORAL_QUESTION_RESPONSE_V1',
  englishGradeOneContextPolicy:'EXPLICIT_OBSERVABLE_COMMUNICATION_NO_UNREQUESTED_CONDITIONS_V2',
  englishGradeOneWrittenInteractionPolicy:'WRITTEN_EXCHANGE_PRESERVES_MESSAGE_AND_RESPONSE_V1',
  authoredCandidatePoolPolicy:'CANDIDATES_INDEPENDENT_OF_FINAL_CAPACITY_V1',
  authoredCriterionCapacityPolicy:'REJECT_OVER_CAPACITY_WITHOUT_SILENT_TRUNCATION_V1',
  englishGradeOneCompositionPolicy:'INDEPENDENT_ACTIONS_PRESERVE_RECEPTION_PRODUCTION_AND_REQUIREMENTS_V1',
  englishGradeOneGenres,
  englishGradeOneGenrePolicy:'BASIC_GENRE_INFORMATION_WITH_REQUESTED_EVIDENCE_PRIORITY_V1',
  englishGradeOneStrategies,
  englishGradeOneStrategyPolicy:'EXPLICIT_OBSERVABLE_PROCEDURES_WITHOUT_PERSONAL_TRAIT_SCORES_V1',
  englishGradeOneLexicon,
  englishGradeOneLexiconPolicy:'REQUESTED_LEXICAL_FIELDS_AND_COMMUNICATIVE_EXPRESSIONS_V1',
  englishGradeOneGrammar,
  englishGradeOneGrammarPolicy:'ONLY_REQUESTED_FORMS_RECOGNITION_EXPLANATION_USE_V1',
  englishGradeOneModule,
  englishGradeTwoModule,
  englishGradeTwoGrammar,
  englishGradeTwoLexicon,
  englishGradeTwoStrategies,
  englishGradeTwoGenres,
  englishGradeTwoEvidencePolicy:'COMMON_SCOPE_EXPLICIT_FORMS_ACTIONS_PRODUCTS_CONDITIONS_NO_TRAIT_SCORES_V1',
  englishGradeTwoAlternativePolicy:'REQUESTED_ONE_OF_FORMS_OR_PRODUCTS_NOT_SIMULTANEOUS_REQUIREMENTS_V1',
  activityTypes:[...evaluationCatalogV34.activityTypes,
    {id:'ORAL_INTERACTION',family:'ORAL',evidence:['PERFORMANCE','KNOWLEDGE'],triggers:[]},
    {id:'LISTENING_COMPREHENSION',family:'OBSERVATIONAL',evidence:['KNOWLEDGE','PERFORMANCE'],triggers:[]},
    {id:'READING_COMPREHENSION',family:'WRITTEN',evidence:['KNOWLEDGE','PRODUCT'],triggers:[]},
    {id:'AUDIOVISUAL_PRODUCTION',family:'PROJECT_BASED',evidence:['PRODUCT','KNOWLEDGE'],triggers:[]},
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
export type EvaluationCatalog = typeof evaluationCatalogV1 & { englishGradeOneModule?:typeof englishGradeOneModule; englishGradeTwoModule?:typeof englishGradeTwoModule; englishGradeThreeModule?:typeof englishGradeThreeModule; contextualModules?: typeof secondaryLanguageGradeTwoTopics; authoredModules?: typeof secondGradeNewsModule[]; scienceModules?: typeof secondaryScienceModules; mathModules?: typeof secondaryMathModules }
export function evaluationCatalogForVersion(version: string) {
  if(version===evaluationCatalogV54.version)return evaluationCatalogV54
  if(version===evaluationCatalogV53.version)return evaluationCatalogV53
  if(version===evaluationCatalogV52.version)return evaluationCatalogV52
  if(version===evaluationCatalogV51.version)return evaluationCatalogV51
  if(version===evaluationCatalogV50.version)return evaluationCatalogV50
  if(version===evaluationCatalogV49.version)return evaluationCatalogV49
  if(version===evaluationCatalogV48.version)return evaluationCatalogV48
  if(version===evaluationCatalogV47.version)return evaluationCatalogV47
  if(version===evaluationCatalogV46.version)return evaluationCatalogV46
  if(version===evaluationCatalogV45.version)return evaluationCatalogV45
  if(version===evaluationCatalogV44.version)return evaluationCatalogV44
  if(version===evaluationCatalogV43.version)return evaluationCatalogV43
  if(version===evaluationCatalogV42.version)return evaluationCatalogV42
  if(version===evaluationCatalogV41.version)return evaluationCatalogV41
  if(version===evaluationCatalogV40.version)return evaluationCatalogV40
  if(version===evaluationCatalogV39.version)return evaluationCatalogV39
  if(version===evaluationCatalogV38.version)return evaluationCatalogV38
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
