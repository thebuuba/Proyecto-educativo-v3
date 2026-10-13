import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityEditorWorkspace, type ActivityEditorWorkspaceProps } from './ActivityEditorWorkspace'
import { newActivityDraft } from './editor/editorModel'
import { api } from '@/services/apiClient'
import { validateInstrumentDefinition } from '@aula/shared'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({ value, onChange }: { value: string; onChange: (value: string) => void }) =>
    <textarea aria-label="Descripción de la actividad" value={value} onChange={event => onChange(event.target.value)} />,
}))
const cases = [
  ['Analiza la guía turística e identifica su estructura.', 'TOURIST_GUIDE_ANALYSIS', 'observacion-sistematica'],
  ['Escribe un artículo expositivo sobre el agua con organización problema-solución.', 'WRITTEN_PRODUCTION', 'analisis-producciones'],
  ['Redacta un informe de lectura sobre el cuento leído y resume sus ideas.', 'REPORT', 'analisis-producciones'],
  ['Analiza el cuento de amor y amistad e identifica el conflicto.', 'ANALYSIS', 'analisis-producciones'],
  ['Recita una décima espinela respetando el ritmo.', 'ORAL_PRESENTATION', 'presentacion'],
] as const
describe('grade two restored editor integration with editable contextual alternatives', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.spyOn(api, 'post').mockRejectedValue(new Error('Servicio simulado no disponible'))
  })
  it.each(cases)('prepares without a score, switches formats and confirms without losing selections: %s', async (description, activityType, technique) => {
    const onAdd = vi.fn(async (input: Parameters<ActivityEditorWorkspaceProps['onAddActivity']>[0]) => ({ ...input, id: 'saved' }))
    render(<ActivityEditorWorkspace
      initialDraft={{ ...newActivityDraft('b2'), name: 'Actividad', description, activityType: 'individual' }}
      secondSecondaryLanguage sectionSubjectId="subject"
      courseTitle="2.º · Lengua Española" periodShortName="P1" saving={false}
      onAddActivity={onAdd} onUpdateActivity={async input => input}
    />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de actividad' })).toHaveValue(activityType), { timeout: 5000 })
    await waitFor(() => expect(screen.getAllByPlaceholderText(/^(?:1\. Criterio|Criterio 1|Criterio de evaluación|Indicador)$/)[0]).toBeVisible(), { timeout: 5000 })
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('')
    expect(screen.getByRole('combobox', { name: /Técnica de evaluación/ })).toHaveValue(technique)
    expect(screen.queryByRole('navigation', { name: 'Pasos de creación' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: /Valor en puntos/ }), { target: { value: '17.35' } })
    for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) {
      fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), { target: { value: format } })
      await waitFor(() => expect(screen.getByRole('combobox', { name: 'Tipo de instrumento' })).toHaveValue(format))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled())
      expect(screen.getAllByPlaceholderText(/^(?:1\. Criterio|Criterio 1|Criterio de evaluación|Indicador)$/)[0]).toBeVisible()
    }
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    const summary = await screen.findByRole('dialog', { name: 'Resumen de la actividad' })
    expect(within(summary).getByText('17.35 puntos')).toBeVisible()
    expect(onAdd).not.toHaveBeenCalled()
    fireEvent.click(within(summary).getByRole('button', { name: 'Volver a editar' }))
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toHaveValue('17.35')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1))
    const saved = onAdd.mock.calls[0][0]
    expect(saved).toMatchObject({ maxScore: 17.35, pedagogicalActivityType: activityType, evaluationTechnique: technique, instrumentType: 'lista-ponderada', date: '' })
    expect(validateInstrumentDefinition(saved.instrumentType!, saved.instrumentCriteria!, saved.maxScore)).toEqual([])
  }, 15000)
})
