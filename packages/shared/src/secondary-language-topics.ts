import { secondaryLanguageGradeTwoTopics } from './secondary-topics/language/grade-2'
import type { SecondaryLanguageTopic, TopicTaskMode } from './secondary-topic-types'
export { secondaryLanguageGradeTwoTopics } from './secondary-topics/language/grade-2'
export type { SecondaryLanguageTopic, TopicDimension, TopicTaskMode } from './secondary-topic-types'

const normalized = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export const withoutResources = (value: string) => value.replace(/(?:recursos?\s*:|(?:con apoyo de|como recurso|con la ayuda de)\s+)[^.;]*/gi, '')
export const normalizedTask = (value: string) => normalized(withoutResources(value))
export type SecondaryTopicContext = { level: string; grade: number; subjectCode: string; optativeExitName?: string | null }
export function findSecondaryLanguageTopic(title: string, description: string, context: SecondaryTopicContext | null) {
  if (context?.level !== 'SECONDARY' || context.subjectCode.trim().toUpperCase() !== 'LEN' || context.optativeExitName) return null
  const task = withoutResources(description)
  const find = (value: string) => secondaryLanguageGradeTwoTopics.find(topic => topic.grade === context.grade && topic.aliases.some(alias => ` ${normalized(value)} `.includes(` ${normalized(alias)} `)))
  return find(task) ?? find(title) ?? null
}

export function topicTaskMode(activity: string): TopicTaskMode {
  if (activity === 'REPORT' || /READING_REPORT_WRITING/.test(activity)) return 'REPORT'
  if (activity === 'COMPARISON' || activity.endsWith('_COMPARISON')) return 'COMPARISON'
  if (activity === 'ANALYSIS' || activity.endsWith('_ANALYSIS')) return 'ANALYSIS'
  if (['EXPOSITION', 'ORAL_PRESENTATION', 'DEBATE', 'SIMULATED_INTERVIEW'].includes(activity) || /PRESENTATION|NARRATION|RECITATION|EXPLANATION|NEWSCAST/.test(activity)) return 'ORAL'
  return 'PRODUCTION'
}

export function detectTopicActivity(title: string, description: string, topic: SecondaryLanguageTopic) {
  const task = normalized(withoutResources(description) || title)
  const purpose = task.match(/(?:para|a fin de)\s+((?:present\w*|expon\w*|exposicion)\b.*)/)?.[1]
  const actionText = purpose ?? task
  const mode = /\b(?:compar\w*|contrast\w*)\b/.test(actionText) ? 'COMPARISON'
    : /\b(?:recit\w*|declam\w*|present\w*|expon\w*|exposicion|narr\w*\s+oralmente)\b/.test(actionText) ? 'ORAL'
      : /\b(?:redact\w*|escrib\w*|elabor\w*|cre(?:ar\w*|an|a)|produc\w*|compon\w*)\b/.test(actionText) ? 'PRODUCTION'
        : 'ANALYSIS'
  if (topic.id === 'guia-turistica') return `TOURIST_GUIDE_${mode === 'PRODUCTION' ? 'CREATION' : mode === 'ORAL' ? 'PRESENTATION' : mode}`
  if (topic.id === 'informe-de-lectura') return mode === 'PRODUCTION' ? 'REPORT' : `READING_REPORT_${mode === 'ORAL' ? 'PRESENTATION' : mode}`
  if (mode === 'ORAL') return 'ORAL_PRESENTATION'
  if (mode === 'PRODUCTION') return /\binformes?\b/.test(actionText) ? 'REPORT' : 'WRITTEN_PRODUCTION'
  return mode === 'ANALYSIS' && /^informe\s+(?:sobre|acerca de)\b/.test(actionText) ? 'REPORT' : mode
}
