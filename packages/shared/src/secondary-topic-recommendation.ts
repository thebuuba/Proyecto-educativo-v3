import type { InstrumentRecommendation, InstrumentType } from './instrument-recommendation'
import { distributeScoreUnits } from './instrument-definition'
import { secondaryTopicCriteria, type ContextualTopicCriterion } from './secondary-topic-criteria'
import { detectTopicActivity } from './secondary-language-topics'
import type { SecondaryLanguageTopic } from './secondary-topic-types'
import { formatAuthoredCriteria } from './authored-instrument-format'
import { adaptLanguageScale } from './language-scale'

export function editableSecondaryTopicRecommendation(topic: SecondaryLanguageTopic, input: {
  activityTitle: string; description?: string; maxScore: number; instrumentType: InstrumentType
  participationMode: 'INDIVIDUAL' | 'GROUP'; activityType?: string; includeAdditionalCandidates?:boolean
}): InstrumentRecommendation {
  const activity = input.activityType ?? detectTopicActivity(input.activityTitle, input.description ?? '', topic)
  const authored = secondaryTopicCriteria(topic, activity, input.description ?? '',input.includeAdditionalCandidates)
  return editableAuthoredRecommendation(authored, input, activity, `lengua-secundaria-${topic.grade}-${topic.id}`)
}

export function editableAuthoredRecommendation(authored: ContextualTopicCriterion[], input: {
  activityTitle: string; description?: string; maxScore: number; instrumentType: InstrumentType; participationMode: 'INDIVIDUAL' | 'GROUP'; activityType?: string
}, activity: string, moduleName: string): InstrumentRecommendation {
  authored = formatAuthoredCriteria(authored, input.instrumentType)
  const levels = input.instrumentType === 'rubrica' || input.instrumentType === 'escala'
    ? ['Destacado', 'Logrado', 'En proceso', 'Inicial'].map((label, index) => ({ id: `L${4 - index}`, label, proportion: (3 - index) / 3 })) : []
  const weights = authored.map(criterion => criterion.weight)
  const points = distributeScoreUnits(Math.round(input.maxScore * 100), input.instrumentType === 'lista-ponderada'
    ? distributeScoreUnits(10000, weights) : weights)
  const proposal: InstrumentRecommendation = {
    kind: 'RECOMMENDATION', catalogVersion: 'editable-fallback-v1', instrumentType: input.instrumentType,
    confidence: 'LOW', activityType: activity, evidenceTypes: ['KNOWLEDGE', 'PRODUCT', 'PERFORMANCE'], participationMode: input.participationMode,
    curriculumVersionId: null, curriculumScopeId: null, selectedCurriculumElements: [],
    criteria: authored.map((criterion, index) => ({
      id: `editable:${criterion.templateId}`, templateId: criterion.templateId, title: criterion.title,
      description: criterion.observable, maxScore: points[index] / 100, maxScoreUnits: points[index],
      sourceType: 'ACTIVITY_TEMPLATE', sourceReferences: [],
      progressionLevels: [...criterion.progressionLevels],
      relativeWeight: criterion.weight,
      descriptors: levels.map((level, levelIndex) => ({ levelId: level.id, text: criterion.progressionLevels[[0, 1, 2, 4][levelIndex]], scoreUnits: Math.round(points[index] * level.proportion) })),
    })),
    levels, totalScore: input.maxScore, totalScoreUnits: points.reduce((sum, units) => sum + units, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus: 'FALLBACK', reasons: [`module=${moduleName}`, 'Adaptación evaluativa editable; no constituye aprobación curricular.'],
      ruleId: 'editable-topic', activityTypeOrigin: input.activityType ? 'EXPLICIT' : 'DETECTED', ranking: [], curriculumStatus: null, lowCurriculumConfidence: true, consideredTypes: [] },
  }
  return /^(?:lengua-|novela-)/.test(moduleName) ? adaptLanguageScale(proposal,input.description??'') : proposal
}
