import {languageInstrumentIntent, type InstrumentAcademicContext, type InstrumentType} from '@aula/shared'

const observational = new Set(['NEWS_ANALYSIS','TOURIST_GUIDE_ANALYSIS','POSTER_ANALYSIS','READING_REPORT_ANALYSIS','DETECTIVE_STORY_ANALYSIS','CALLIGRAM_ANALYSIS','PORTFOLIO','OBSERVATION'])
/** Local equivalent of the installed catalog rules; cross-layer tests cover every catalog type. */
export function automaticInstrumentType(activityType: string, context?: InstrumentAcademicContext | null, maxScore?: number | null, description = ''): InstrumentType {
  const intent = context?.level === 'SECONDARY' && context.subjectCode === 'LEN' ? languageInstrumentIntent(description) : undefined
  if (intent) return intent
  if (context?.level === 'PRIMARY' && context.grade <= 3 && maxScore != null && maxScore <= 10
    && (observational.has(activityType) || ['EXPERIMENT','LAB_PRACTICE','OTHER'].includes(activityType))) return 'lista-cotejo'
  if (['PROBLEM_SOLVING','EXERCISE_SET'].includes(activityType)) return 'lista-ponderada'
  if (activityType === 'MOTOR_SPORTS_PRACTICE') return 'escala'
  if (!activityType || activityType === 'OTHER' || observational.has(activityType)) return 'lista-cotejo'
  return 'rubrica'
}
