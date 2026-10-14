import type { InstrumentType } from './instrument-recommendation'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'

/** The same evidence becomes a criterion, a verifiable indicator or a weighted decision rule. */
export function formatAuthoredCriteria(criteria: ContextualTopicCriterion[], format: InstrumentType): ContextualTopicCriterion[] {
  return criteria.map(criterion => ({ ...criterion,
    title: format === 'lista-cotejo' || format === 'escala' ? criterion.observable : criterion.title,
    observable: format === 'lista-ponderada'
      ? `${criterion.observable} Parcial (50%): ${criterion.progressionLevels[2]}`
      : criterion.observable,
  }))
}
