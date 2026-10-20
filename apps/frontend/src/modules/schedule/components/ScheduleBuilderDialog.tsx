import type { ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import type { SaveScheduleStructureInput, ScheduleEntry, ScheduleJourney, TimeSlot } from '../types'
import { FlexibleScheduleWizard } from './FlexibleScheduleWizard'

type Props = {
  journeys: ScheduleJourney[]
  slots: TimeSlot[]
  entries: ScheduleEntry[]
  submitting: boolean
  error: string | null
  onClose: () => void
  onSave: (input: SaveScheduleStructureInput) => void
  renderPreview: (input: SaveScheduleStructureInput) => ReactNode
}

export function ScheduleBuilderDialog({ journeys, slots, entries, submitting, error, onClose, onSave, renderPreview }: Props) {
  return (
    <Modal
      title={journeys.length ? 'Editar estructura' : 'Nuevo horario'}
      hideHeader
      className="schedule-builder-dialog"
      contentClassName="schedule-builder-dialog__content"
      overlayClassName="schedule-builder-overlay"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <FlexibleScheduleWizard
        mode="polymet"
        initialJourneys={journeys}
        initialSlots={slots.filter((slot) => slot.status === 'active')}
        existingEntries={entries}
        submitting={submitting}
        error={error}
        onCancel={onClose}
        onComplete={onSave}
        renderPreview={renderPreview}
      />
    </Modal>
  )
}
