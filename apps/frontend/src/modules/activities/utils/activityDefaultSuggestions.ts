import {resolveOptativeSocialTask,optativeSocialSelections} from '@aula/shared'
import {resolveCommonPhysicalTask,commonPhysicalSelections} from '@aula/shared'
import {resolveCommonFhrTask,commonFhrSelections} from '@aula/shared'
import {resolveOptativeLanguageTask,optativeLanguageSelections} from '@aula/shared'
import { resolveCommonArtTask, commonArtSelections } from '@aula/shared'
import {resolveCommonSocialTask,commonSocialSelections} from '@aula/shared'
import {resolveCommonScienceTask,commonScienceSelections} from '@aula/shared'
import { resolveCommonFrenchTask, commonFrenchSelections } from '@aula/shared'
import {resolveCommonMathTask,commonMathSelections} from '@aula/shared'
type ActivityDefaults = { activityType: string; technique: string; instrument: string }
import { scientificTaskType,resolveEvaluationTask,resolveCommonEnglishTask,commonEnglishSelections,resolveOptativeEnglishTask } from '@aula/shared'
import type { InstrumentAcademicContext } from '@aula/shared'
import { automaticInstrumentType } from './automaticInstrumentType'

const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** Immediate defaults from the teacher's task, using only options already offered by the creator. */
export function activityDefaultSuggestions(title: string, description: string, context?: InstrumentAcademicContext | null, maxScore?: number | null): ActivityDefaults | null {
  const socialOptative=resolveOptativeSocialTask(title,description,context)
  if(socialOptative)return{activityType:socialOptative.activityType,technique:socialOptative.technique,instrument:optativeSocialSelections(socialOptative).suggestedInstrumentType}
  const optative=resolveOptativeLanguageTask(title,description,context)
  if(optative)return{activityType:optative.activityType,technique:optative.technique,instrument:optativeLanguageSelections(optative).suggestedInstrumentType}
  const fhr=resolveCommonFhrTask(title,description,context)
  if(fhr)return{activityType:fhr.activityType,technique:fhr.technique,instrument:commonFhrSelections(fhr).suggestedInstrumentType}
  const physical=resolveCommonPhysicalTask(title,description,context)
  if(physical)return{activityType:physical.activityType,technique:physical.technique,instrument:commonPhysicalSelections(physical).suggestedInstrumentType}
  const art = resolveCommonArtTask(title, description, context)
  if (art) return { activityType: art.activityType, technique: art.technique, instrument: commonArtSelections(art).suggestedInstrumentType }
  const social=resolveCommonSocialTask(title,description,context)
  if(social)return{activityType:social.activityType,technique:social.technique,instrument:commonSocialSelections(social,description).suggestedInstrumentType}
  const commonScience=resolveCommonScienceTask(title,description,context)
  if(commonScience)return {activityType:commonScience.activityType,technique:commonScience.technique,instrument:commonScienceSelections(commonScience,description).suggestedInstrumentType}
  const math=resolveCommonMathTask(title,description,context)
  if(math)return {activityType:math.activityType,technique:math.technique,instrument:commonMathSelections(math,description).suggestedInstrumentType}
  const french=resolveCommonFrenchTask(title,description,context)
  if(french)return {activityType:french.activityType,technique:french.technique,instrument:commonFrenchSelections(french,description).suggestedInstrumentType}
  const english=resolveOptativeEnglishTask(title,description,context)??resolveCommonEnglishTask(title,description,context)
  if(english)return {activityType:english.activityType,technique:english.technique,instrument:commonEnglishSelections(english,description).suggestedInstrumentType}
  const result=detectActivityDefaults(title,description)
  return result ? {...result,instrument:automaticInstrumentType(result.activityType,context,maxScore,description)} : null
}

function detectActivityDefaults(title: string, description: string): Omit<ActivityDefaults,'instrument'> | null {
  if (!title.trim() || !description.trim()) return null
  const contract=resolveEvaluationTask(title,description)
  if(contract.action) return {activityType:contract.oral&&contract.product==='ANALYTICAL_TEXT'?'ORAL_PRESENTATION':contract.action,technique:contract.oral&&contract.product==='ANALYTICAL_TEXT'?'presentacion':'analisis-producciones'}
  const science = scientificTaskType(title, description)
  if (science) return { activityType: science, technique: science === 'PROJECT' ? 'proyecto' : 'resolucion-problemas' }
  const heading = normalize(title)
  const task = normalize(description)
  const text = `${heading} ${task}`
  const has = (pattern: RegExp) => pattern.test(text)
  if (has(/\binformes?\b/) && has(/\b(?:elabor\w*|redact\w*|escrib\w*|prepar\w*|entreg\w*)\b/))
    return { activityType: 'REPORT', technique: 'analisis-producciones' }
  if (has(/\bensayos?\b/)) return { activityType: 'ESSAY', technique: 'ensayo' }
  if (has(/\bdebates?\b|\bdebat\w*\b/)) return { activityType: 'DEBATE', technique: 'debate' }
  if (has(/\bexperimentos?\b|\bexperiment\w*\b/)) return { activityType: 'EXPERIMENT', technique: 'observacion-sistematica' }
  if (has(/\blaboratorios?\b/)) return { activityType: 'LAB_PRACTICE', technique: 'observacion-sistematica' }
  if (has(/\b(?:exposicion|exponer|expondr\w*)\b/)) return { activityType: 'EXPOSITION', technique: 'exposicion' }
  if (has(/\bpresentacion oral\b/)) return { activityType: 'ORAL_PRESENTATION', technique: 'presentacion' }
  if (has(/\b(?:investigacion|investigar\w*)\b/)) return { activityType: 'RESEARCH', technique: 'proyecto' }
  if (has(/\bproyectos?\b/)) return { activityType: 'PROJECT', technique: 'proyecto' }
  if (has(/\b(?:resolucion de problemas|resolver\w* problemas?)\b/)) return { activityType: 'PROBLEM_SOLVING', technique: 'resolucion-problemas' }
  if (has(/\b(?:mapas? conceptuales?|esquemas? conceptuales?)\b/)) return { activityType: 'CONCEPT_MAP', technique: 'mapa-conceptual' }
  if (has(/\bportafolios?\b/)) return { activityType: 'PORTFOLIO', technique: 'portafolio' }
  if (has(/\b(?:cuestionarios?|examen(?:es)?|pruebas? escritas?)\b/)) return { activityType: 'QUIZ_TEST', technique: 'prueba-escrita' }
  if (has(/\b(?:pintura|dibujo|escultura|produccion artistica)\b/)) return { activityType: 'ARTISTIC_PRODUCTION', technique: 'analisis-producciones' }
  if (has(/\b(?:dramatizacion|representacion escenica)\b/)) return { activityType: 'PERFORMANCE', technique: 'dramatizacion' }
  if (has(/\b(?:deporte|practica motriz|actividad deportiva)\b/)) return { activityType: 'MOTOR_SPORTS_PRACTICE', technique: 'observacion-directa' }
  if (has(/\b(?:observacion|clasificacion)\b/)) return { activityType: 'OBSERVATION', technique: 'observacion-sistematica' }
  if (has(/\b(?:ejercicios?|practicas?)\b/)) return { activityType: 'EXERCISE_SET', technique: 'analisis-producciones' }
  if (has(/\b(?:informe|cuento|poema|texto escrito|redact\w*|escrib\w*)\b/)) return { activityType: 'WRITTEN_PRODUCTION', technique: 'analisis-producciones' }
  return { activityType: 'OTHER', technique: 'observacion-directa' }
}
