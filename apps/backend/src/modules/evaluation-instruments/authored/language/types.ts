import type {ContextualTopicCriterion} from '@aula/shared'
export type AuthoredCriterion = { templateId: string; title: string; observable: string; weight: number; progression?: [string, string, string]; progressionLevels?: [string, string, string, string, string]; checklistParts?:ContextualTopicCriterion['checklistParts'] }
