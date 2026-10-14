import { secondaryLanguageGradeTwoTopics } from './secondary-topics/language/grade-2'
import { secondaryLanguageGradeThreeTopics } from './secondary-topics/language/grade-3'
import type { SecondaryLanguageTopic, TopicTaskMode } from './secondary-topic-types'
import {resolveEvaluationTask} from './evaluation-task-contract'
import {withoutResources} from './evaluation-task-text'
import {affirmativeLanguageTask} from './language-feature-criteria'
export {withoutResources,normalizedTask} from './evaluation-task-text'
export { secondaryLanguageGradeTwoTopics } from './secondary-topics/language/grade-2'
export { secondaryLanguageGradeThreeTopics } from './secondary-topics/language/grade-3'
export type { SecondaryLanguageTopic, TopicDimension, TopicTaskMode } from './secondary-topic-types'

const normalized = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export type SecondaryTopicContext = { level: string; grade: number; subjectCode: string; optativeExitName?: string | null }
export function commonSecondaryLanguageGrade(context:SecondaryTopicContext|null|undefined):number|null {
  return context?.level==='SECONDARY'&&context.subjectCode.trim().toUpperCase()==='LEN'&&!context.optativeExitName&&Number.isInteger(context.grade)&&context.grade>=1&&context.grade<=6?context.grade:null
}
export function findSecondaryLanguageTopic(title: string, description: string, context: SecondaryTopicContext | null) {
  if (!commonSecondaryLanguageGrade(context)) return null
  const task = affirmativeLanguageTask(withoutResources(description))
  const find = (value: string) => [...secondaryLanguageGradeTwoTopics,...secondaryLanguageGradeThreeTopics].find(topic => topic.grade === context!.grade && topic.aliases.some(alias => ` ${normalized(value)} `.includes(` ${normalized(alias)} `)))
  const described=find(task)
  if(described)return described
  if(context!.grade===2&&/\bnoticias?\b|\bnoticiero\b/.test(normalized(task)))return null
  return find(title) ?? null
}

export function topicTaskMode(activity: string): TopicTaskMode {
  if (activity === 'REPORT' || /READING_REPORT_WRITING/.test(activity)) return 'REPORT'
  if (activity === 'COMPARISON' || activity.endsWith('_COMPARISON')) return 'COMPARISON'
  if (activity === 'ANALYSIS' || activity.endsWith('_ANALYSIS')) return 'ANALYSIS'
  if (['EXPOSITION', 'ORAL_PRESENTATION', 'DEBATE', 'SIMULATED_INTERVIEW'].includes(activity) || /PRESENTATION|NARRATION|RECITATION|EXPLANATION|NEWSCAST/.test(activity)) return 'ORAL'
  return 'PRODUCTION'
}

export function detectTopicActivity(title: string, description: string, topic: SecondaryLanguageTopic) {
  const task = affirmativeLanguageTask(withoutResources(description) || title)
  const contract=resolveEvaluationTask(title,task)
  if(topic.grade>=3&&/\b(?:debat\w*|debates?)\b/.test(task))return 'DEBATE'
  if(contract.product==='ANALYTICAL_TEXT'&&!contract.oral) return topic.id==='guia-turistica'?'TOURIST_GUIDE_ANALYSIS':topic.id==='informe-de-lectura'?'READING_REPORT_ANALYSIS':'ANALYSIS'
  const comprehensionProduct=/\b(?:leer\w*|leeran|comprend\w*)\b.*\b(?:elabor\w*|constru\w*)\b.*\b(?:organizador grafico|cuadro sinoptico|esquema|mapa conceptual)\b/.test(task)&&!/planific|borrador|redact/.test(task)
  if(comprehensionProduct)return topic.id==='guia-turistica'?'TOURIST_GUIDE_ANALYSIS':topic.id==='informe-de-lectura'?'READING_REPORT_ANALYSIS':'ANALYSIS'
  const purpose = task.match(/(?:para|a fin de)\s+((?:present\w*|expon\w*|exposicion)\b.*)/)?.[1]
  const actionText = purpose ?? task
  if(contract.product==='REPORT'&&topic.id!=='informe-de-lectura')return 'REPORT'
  if(/\binvestig\w*\b/.test(actionText)&&!(topic.grade>=3&&/\b(?:redact\w*|escrib\w*|elabor\w*)\b/.test(actionText)))return 'RESEARCH'
  const writing=/\b(?:redact\w*|escrib\w*|elabor\w*|planific\w*|revis(?:ar|aran|a|en)|correg\w*|cre(?:ar\w*|an|a)|produc(?:ir\w*|iran|en|e|iendo)|compon(?:er|dr\w*|en|e|gan|iendo))\b/.test(actionText)
    ||/\bpresent\w*\b.*\b(?:por escrito|escrita|escrito)\b/.test(actionText)
  const comprehension=/parafras|propias palabras|\bresum(?:iran|ir|e)\b|predicci|anticip|inferir|clasific|reconstru/.test(actionText)&&!writing
  const comparison=actionText.search(/\b(?:compar(?:ar\w*|an|a|en|ando)|contrast\w*)\b/)
  const analysis=actionText.search(/\b(?:analiz\w*|interpret\w*|identific\w*)\b/)
  const compare=comparison>=0&&(analysis<0||comparison<analysis||/\b(?:dos|ambos|varios|diferentes)\b/.test(actionText))
  const oral=contract.oral||/\b(?:recit\w*|declam\w*|exposicion|narr\w*\s+oralmente)\b/.test(actionText)
  const mode=compare?'COMPARISON':comprehension?'ANALYSIS':oral?'ORAL':writing?'PRODUCTION':'ANALYSIS'
  if (topic.id === 'guia-turistica') return `TOURIST_GUIDE_${mode === 'PRODUCTION' ? 'CREATION' : mode === 'ORAL' ? 'PRESENTATION' : mode}`
  if (topic.id === 'informe-de-lectura') return mode === 'PRODUCTION' ? 'REPORT' : `READING_REPORT_${mode === 'ORAL' ? 'PRESENTATION' : mode}`
  if (mode === 'ORAL') return 'ORAL_PRESENTATION'
  if (mode === 'PRODUCTION') return /\binformes?\b/.test(actionText) ? 'REPORT' : 'WRITTEN_PRODUCTION'
  return mode === 'ANALYSIS' && /^informe\s+(?:sobre|acerca de)\b/.test(actionText) ? 'REPORT' : mode
}
