import { GraduationCap } from 'lucide-react'
import {
  teachingStrategies,
  teachingStrategyAllowed,
  type TeachingStrategyContext,
} from '@aula/shared'
import type { ActivityDraft } from './editorModel'
import { ActivitySelectionField } from './ActivitySelectionField'

export function TeachingStrategyField({
  draft,
  context,
  onChange,
}: {
  draft: ActivityDraft
  context: TeachingStrategyContext
  onChange: (draft: ActivityDraft) => void
}) {
  return (
    <ActivitySelectionField
      label="Estrategia de enseñanza y aprendizaje"
      icon={GraduationCap}
      value={draft.teachingStrategyId ?? ''}
      automatic={draft.teachingStrategyOrigin === 'AUTO'}
      emptyLabel="Sin estrategia"
      options={teachingStrategies
        .filter((strategy) => teachingStrategyAllowed(strategy.id, context))
        .map((strategy) => ({
          id: strategy.id,
          name: strategy.name,
          searchText: strategy.aliases.join(' '),
        }))}
      onConfirm={(value) =>
        onChange({
          ...draft,
          teachingStrategyId: value || draft.teachingStrategyId,
          teachingStrategyOrigin: value ? 'MANUAL' : 'AUTO',
        })
      }
    />
  )
}
