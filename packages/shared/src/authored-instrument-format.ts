import type { InstrumentType } from './instrument-recommendation'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

/** The same evidence becomes a criterion, a verifiable indicator or a weighted decision rule. */
export function formatAuthoredCriteria(criteria: ContextualTopicCriterion[], format: InstrumentType): ContextualTopicCriterion[] {
  const evidence=format==='lista-cotejo'?criteria.flatMap(criterion=>criterion.checklistParts?.length
    ? criterion.checklistParts.map(part=>({...criterion,checklistParts:undefined,coveredTaskConditionIds:part.coveredTaskConditionIds??criterion.coveredTaskConditionIds,templateId:`${criterion.templateId}:${part.key}`,observable:part.observable,progressionLevels:part.progressionLevels,fourLevelLowest:part.fourLevelLowest??criterion.fourLevelLowest,weight:criterion.weight/criterion.checklistParts!.length}))
    : [criterion]):criteria
  return evidence.map(criterion => ({ ...criterion,
    title: format === 'lista-cotejo' || format === 'escala' ? criterion.observable : criterion.title,
    observable: format === 'lista-ponderada'
      ? `${criterion.observable} Parcial (50%): ${criterion.progressionLevels[2]}`
      : criterion.observable,
  }))
}
