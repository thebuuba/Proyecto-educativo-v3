import { fireEvent, screen, within } from '@testing-library/react'
import {
  pedagogicalActivityLabels,
  evaluationTechniqueOptions,
} from './editor/ActivityDataSections'

export function activitySelectionName(value: string) {
  return (
    pedagogicalActivityLabels[value] ??
    evaluationTechniqueOptions.find(([id]) => id === value)?.[1] ??
    (
      {
        rubrica: 'Rúbrica',
        'lista-cotejo': 'Lista de cotejo',
        escala: 'Escala estimativa',
        'lista-ponderada': 'Lista ponderada',
      } as Record<string, string>
    )[value] ??
    'Sin seleccionar'
  )
}
export function chooseActivitySelection(label: string, value: string) {
  fireEvent.click(screen.getByRole('button', { name: label }))
  const dialog = screen.getByRole('dialog', { name: label })
  fireEvent.click(
    within(dialog).getByRole('radio', {
      name: value ? activitySelectionName(value) : 'Seleccionar automáticamente',
    }),
  )
  fireEvent.click(within(dialog).getByRole('button', { name: 'Confirmar' }))
}
