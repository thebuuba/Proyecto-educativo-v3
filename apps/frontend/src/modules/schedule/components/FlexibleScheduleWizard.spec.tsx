import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FlexibleScheduleWizard } from './FlexibleScheduleWizard'
import type { SaveScheduleStructureInput, TimeSlot } from '@/modules/schedule/types'

const journey = {
  id: 'morning',
  name: 'Matutina',
  kind: 'MORNING' as const,
  startTime: '07:30',
  endTime: '12:00',
  sequence: 1,
}
const base = [
  {
    name: 'Período 1',
    startTime: '07:30',
    endTime: '08:10',
    sequence: 1,
    blockType: 'CLASS' as const,
  },
  {
    name: 'Período 2',
    startTime: '08:10',
    endTime: '08:50',
    sequence: 2,
    blockType: 'CLASS' as const,
  },
]
const slots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) =>
  base.map((block) => ({
    ...block,
    id: `${dayOfWeek}-${block.sequence}`,
    status: 'active',
    dayOfWeek,
    journeyId: journey.id,
  })),
)

async function renderSchedule(initialSlots = slots) {
  const user = userEvent.setup()
  const onComplete = vi.fn<(input: SaveScheduleStructureInput) => void>()
  render(
    <FlexibleScheduleWizard
      initialJourneys={[journey]}
      initialSlots={initialSlots}
      submitting={false}
      error={null}
      onComplete={onComplete}
    />,
  )
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  await user.click(screen.getByRole('button', { name: /continuar/i }))
  return { user, onComplete }
}

async function openFridayClass2(user: ReturnType<typeof userEvent.setup>) {
  const trigger = screen.getByLabelText('Acciones para Clase 2 del viernes')
  await user.click(trigger)
  return screen.getByRole('menu')
}

async function setEditorTime(
  user: ReturnType<typeof userEvent.setup>,
  label: 'Inicio' | 'Fin',
  value: string,
) {
  await user.click(screen.getByRole('button', { name: label }))
  fireEvent.change(screen.getByLabelText('Escribir hora'), { target: { value } })
  await user.click(screen.getByRole('button', { name: 'Listo' }))
}

describe('cuadrícula semanal de clases', () => {
  it('normaliza el lenguaje anterior y muestra Clase, Hora pedagógica y Pausa', async () => {
    const { user } = await renderSchedule()
    expect(screen.getAllByText('Clase 1').length).toBeGreaterThanOrEqual(3)
    expect(screen.queryByText('Período 1')).not.toBeInTheDocument()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await user.selectOptions(screen.getByLabelText('Tipo'), 'FREE')
    expect(screen.getByRole('option', { name: 'Hora pedagógica' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pausa' })).toBeInTheDocument()
  })

  it('añade una clase globalmente y configura el recreo antes de insertarlo', async () => {
    const { user } = await renderSchedule()
    await user.click(screen.getByRole('button', { name: 'Añadir clase' }))
    expect(screen.getAllByText('Clase 3').length).toBeGreaterThanOrEqual(3)
    await user.click(screen.getByRole('button', { name: 'Añadir recreo' }))
    expect(screen.getByRole('heading', { name: 'Añadir recreo' })).toBeInTheDocument()
    expect(screen.queryAllByText('Recreo')).toHaveLength(0)
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Añadir recreo' }),
    )
    expect(screen.getAllByText('Recreo').length).toBeGreaterThanOrEqual(3)
  })

  it('permite vaciar los valores de generación y no altera la cuadrícula hasta regenerar', async () => {
    const { user } = await renderSchedule()
    const [duration, count] = screen.getAllByRole('spinbutton')
    fireEvent.change(duration, { target: { value: '' } })
    fireEvent.change(count, { target: { value: '' } })
    expect(duration).toHaveValue(null)
    expect(count).toHaveValue(null)
    expect(screen.queryByRole('button', { name: /Regenerar con 0 min/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/aplicar 0 min/i)).not.toBeInTheDocument()
    fireEvent.blur(duration)
    expect(screen.getByText('Ingresa una duración válida.')).toBeInTheDocument()

    fireEvent.change(duration, { target: { value: '35' } })
    fireEvent.change(count, { target: { value: '5' } })
    expect(screen.getAllByText('7:30–8:10 a. m.').length).toBeGreaterThan(0)
    expect(screen.getByText(/Cambios sin aplicar/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Regenerar con 35 min' }))
    await user.click(screen.getByRole('button', { name: 'Regenerar' }))
    expect(screen.getAllByText('7:30–8:05 a. m.').length).toBeGreaterThan(0)
    expect(screen.queryByText(/Cambios sin aplicar/i)).not.toBeInTheDocument()
  })

  it('abre un selector sin segundos con hora, minutos y flechas visibles', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await user.click(screen.getByRole('button', { name: 'Fin' }))
    const picker = screen.getByRole('dialog', { name: 'Seleccionar hora' })
    expect(within(picker).getByLabelText('Hora')).toBeInTheDocument()
    expect(within(picker).getByLabelText('Minutos')).toBeInTheDocument()
    expect(within(picker).getByRole('button', { name: 'Subir hora' })).toBeInTheDocument()
    expect(within(picker).getByRole('button', { name: 'Bajar minutos' })).toBeInTheDocument()
    expect(picker).not.toHaveTextContent(/segundos/i)
  })

  it('cierra el selector fuera, con Escape y al abrir otro selector', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: /Editar solo este/ }))
    const start = screen.getByRole('button', { name: 'Inicio' })
    const end = screen.getByRole('button', { name: 'Fin' })

    await user.click(start)
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('dialog', { name: 'Seleccionar hora' })).not.toBeInTheDocument()

    await user.click(start)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Seleccionar hora' })).not.toBeInTheDocument()
    expect(start).toHaveFocus()

    await user.click(start)
    await user.click(end)
    expect(screen.getAllByRole('dialog', { name: 'Seleccionar hora' })).toHaveLength(1)
    expect(start).toHaveAttribute('aria-expanded', 'false')
    expect(end).toHaveAttribute('aria-expanded', 'true')
  })

  it('hace flip hacia arriba y limita el selector al espacio visible', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: /Editar solo este/ }))
    const trigger = screen.getByRole('button', { name: 'Fin' })
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      bottom: 590,
      height: 40,
      left: 80,
      right: 280,
      top: 550,
      width: 200,
      x: 80,
      y: 550,
      toJSON: () => ({}),
    })
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(260)
    vi.stubGlobal('innerHeight', 600)

    await user.click(trigger)
    const picker = screen.getByRole('dialog', { name: 'Seleccionar hora' })
    expect(picker).toHaveAttribute('data-placement', 'top')
    expect(Number.parseInt(picker.style.top, 10)).toBeGreaterThanOrEqual(8)
    expect(Number.parseInt(picker.style.maxHeight, 10)).toBeLessThanOrEqual(534)
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('elimina una clase solo del viernes y permite restaurar ese día', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Eliminar solo este día' }))
    expect(screen.getAllByText('● Ajustado').length).toBeGreaterThan(0)
    expect(screen.getAllByText('● Ajustado')[0].parentElement).toHaveTextContent('—')
    await user.click(screen.getByRole('button', { name: 'Restaurar' }))
    expect(screen.queryByText('● Ajustado')).not.toBeInTheDocument()
  })

  it('no crea un ajuste cuando se guarda una edición sin cambios', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.queryByText('● Ajustado')).not.toBeInTheDocument()
  })

  it('edita una celda, valida el horario y marca solo la excepción', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await setEditorTime(user, 'Fin', '7:00 a. m.')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByRole('alert')).toHaveTextContent('debe terminar después de iniciar')
    await setEditorTime(user, 'Fin', '8:40 a. m.')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getAllByText('● Ajustado').length).toBeGreaterThan(0)
    expect(screen.getAllByText('8:10–8:40 a. m.').length).toBeGreaterThan(0)
  })

  it('edita una clase en toda la jornada sin crear excepciones', async () => {
    const { user } = await renderSchedule()
    await user.click(screen.getByLabelText('Acciones globales para Clase 1'))
    await user.click(screen.getByRole('menuitem', { name: 'Editar en toda la jornada' }))
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Clase inicial' } })
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getAllByText('Clase inicial').length).toBeGreaterThanOrEqual(3)
    expect(screen.queryByText('● Ajustado')).not.toBeInTheDocument()
  })

  it('reajusta solo el día editado y permite desactivar la continuidad', async () => {
    const third = {
      name: 'Clase 3',
      startTime: '08:50',
      endTime: '09:30',
      sequence: 3,
      blockType: 'CLASS' as const,
    }
    const threeClassSlots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) =>
      [...base, third].map((block) => ({
        ...block,
        id: `${dayOfWeek}-${block.sequence}`,
        status: 'active',
        dayOfWeek,
        journeyId: journey.id,
      })),
    )
    const { user } = await renderSchedule(threeClassSlots)
    let actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await setEditorTime(user, 'Fin', '8:40')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getAllByText('8:40–9:20 a. m.').length).toBeGreaterThan(0)
    expect(screen.getAllByText('8:50–9:30 a. m.').length).toBeGreaterThan(0)

    actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await user.click(screen.getByRole('checkbox', { name: /Reajustar automáticamente/i }))
    await setEditorTime(user, 'Fin', '8:35')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getAllByText('8:40–9:20 a. m.').length).toBeGreaterThan(0)
  })

  it('cierra los menús al abrir otro, hacer clic fuera o pulsar Escape', async () => {
    const { user } = await renderSchedule()
    await user.click(screen.getByLabelText('Acciones para Clase 2 del viernes'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Acciones globales para Clase 1'))
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Acciones globales para Clase 1'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('hace flip del menú contextual cerca del borde inferior', async () => {
    const { user } = await renderSchedule()
    const trigger = screen.getByLabelText('Acciones para Clase 2 del viernes')
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      bottom: 596,
      height: 28,
      left: 300,
      right: 328,
      top: 568,
      width: 28,
      x: 300,
      y: 568,
      toJSON: () => ({}),
    })
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(150)
    vi.stubGlobal('innerHeight', 600)

    await user.click(trigger)
    const menu = screen.getByRole('menu')
    expect(menu).toHaveAttribute('data-placement', 'top')
    expect(Number.parseInt(menu.style.top, 10)).toBeGreaterThanOrEqual(8)
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('confirma antes de regenerar, limpiar o eliminar globalmente', async () => {
    const { user } = await renderSchedule()
    await user.click(screen.getByRole('button', { name: 'Regenerar jornada' }))
    expect(screen.getByRole('heading', { name: 'Regenerar jornada' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'Limpiar jornada' }))
    expect(screen.getByRole('heading', { name: 'Limpiar jornada' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByLabelText('Acciones globales para Clase 1'))
    await user.click(screen.getByRole('menuitem', { name: 'Eliminar de todos los días' }))
    expect(screen.getByRole('heading', { name: 'Eliminar de todos los días' })).toBeInTheDocument()
  })

  it('reconstruye al recargar las diferencias guardadas por día', async () => {
    const personalized = slots.map((slot) =>
      slot.dayOfWeek === 5 && slot.sequence === 2 ? { ...slot, endTime: '08:40' } : slot,
    )
    await renderSchedule(personalized)
    expect(screen.getAllByText('● Ajustado').length).toBeGreaterThan(0)
    expect(screen.getAllByText('8:10–8:40 a. m.').length).toBeGreaterThan(0)
  })

  it('mantiene independientes las configuraciones Matutina y Vespertina', async () => {
    const afternoon = {
      id: 'afternoon',
      name: 'Vespertina',
      kind: 'AFTERNOON' as const,
      startTime: '13:00',
      endTime: '16:00',
      sequence: 2,
    }
    const afternoonSlots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) =>
      base.map((block) => ({
        ...block,
        id: `a-${dayOfWeek}-${block.sequence}`,
        startTime: block.sequence === 1 ? '13:00' : '13:35',
        endTime: block.sequence === 1 ? '13:35' : '14:10',
        status: 'active',
        dayOfWeek,
        journeyId: afternoon.id,
      })),
    )
    const user = userEvent.setup()
    render(
      <FlexibleScheduleWizard
        initialJourneys={[journey, afternoon]}
        initialSlots={[...slots, ...afternoonSlots]}
        submitting={false}
        error={null}
        onComplete={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    const morningSection = screen.getByText('Matutina').closest('section')!
    const afternoonSection = screen.getByText('Vespertina').closest('section')!
    fireEvent.change(within(afternoonSection).getAllByRole('spinbutton')[0], {
      target: { value: '35' },
    })
    expect(within(morningSection).getAllByRole('spinbutton')[0]).toHaveValue(40)
    expect(within(afternoonSection).getAllByRole('spinbutton')[0]).toHaveValue(35)
    await user.click(within(morningSection).getByRole('button', { name: 'Añadir recreo' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Añadir recreo' }),
    )
    expect(within(morningSection).getAllByText('Recreo').length).toBeGreaterThan(0)
    expect(within(afternoonSection).queryByText('Recreo')).not.toBeInTheDocument()
  })

  it('avisa cuando seis clases no caben y permite generar para ajustar', async () => {
    const afternoon = {
      ...journey,
      id: 'afternoon',
      name: 'Vespertina',
      kind: 'AFTERNOON' as const,
      startTime: '13:00',
      endTime: '16:00',
    }
    const user = userEvent.setup()
    render(
      <FlexibleScheduleWizard
        initialJourneys={[afternoon]}
        initialSlots={[]}
        submitting={false}
        error={null}
        onComplete={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    fireEvent.change(screen.getAllByRole('spinbutton')[0], {
      target: { value: '35' },
    })
    expect(screen.getByText(/6 clases de 35 minutos necesitan 3 h 30 min/i)).toBeInTheDocument()
    expect(screen.getByText('1:00–4:00 p. m.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Generar estructura' }))
    expect(
      screen.getByRole('heading', { name: 'Esta estructura supera la duración de la jornada' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Generar y ajustar' }))
    expect(screen.getAllByText('Clase 6').length).toBeGreaterThan(0)
    expect(
      screen.getByText(/Clase 6: termina después del final de la jornada \(4:00 p\. m\.\)/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled()
  })

  it('permite corregir una clase aunque otra siga fuera de jornada', async () => {
    const afternoon = {
      ...journey,
      id: 'afternoon',
      name: 'Vespertina',
      kind: 'AFTERNOON' as const,
      startTime: '13:00',
      endTime: '16:00',
    }
    const afternoonBase = Array.from({ length: 6 }, (_, index) => ({
      name: `Clase ${index + 1}`,
      startTime:
        `${13 + Math.floor((index * 35) / 60)}`.padStart(2, '0') +
        `:${String((index * 35) % 60).padStart(2, '0')}`,
      endTime:
        `${13 + Math.floor(((index + 1) * 35) / 60)}`.padStart(2, '0') +
        `:${String(((index + 1) * 35) % 60).padStart(2, '0')}`,
      sequence: index + 1,
      blockType: 'CLASS' as const,
    }))
    const afternoonSlots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) =>
      afternoonBase.map((block) => ({
        ...block,
        id: `${dayOfWeek}-${block.sequence}`,
        status: 'active',
        dayOfWeek,
        journeyId: afternoon.id,
      })),
    )
    const user = userEvent.setup()
    render(
      <FlexibleScheduleWizard
        initialJourneys={[afternoon]}
        initialSlots={afternoonSlots}
        submitting={false}
        error={null}
        onComplete={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByLabelText('Acciones globales para Clase 2'))
    await user.click(screen.getByRole('menuitem', { name: 'Editar en toda la jornada' }))
    await setEditorTime(user, 'Fin', '2:05')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/Clase 6: termina después/i)).toBeInTheDocument()
    expect(screen.getAllByText('1:35–2:05 p. m.').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2:05–2:40 p. m.').length).toBeGreaterThan(0)
    expect(screen.getAllByText('2:40–3:15 p. m.').length).toBeGreaterThan(0)
  })

  it('inserta el recreo desde el final actual de Clase 3 y encadena lo posterior', async () => {
    const afternoon = {
      ...journey,
      id: 'afternoon',
      name: 'Vespertina',
      kind: 'AFTERNOON' as const,
      startTime: '13:00',
      endTime: '16:00',
    }
    const current = [
      ['Clase 1', '13:00', '13:35'],
      ['Clase 2', '13:35', '14:05'],
      ['Clase 3', '14:05', '14:30'],
      ['Clase 4', '14:30', '15:00'],
      ['Clase 5', '15:00', '15:30'],
    ] as const
    const currentSlots: TimeSlot[] = [1, 5].flatMap((dayOfWeek) =>
      current.map(([name, startTime, endTime], index) => ({
        id: `${dayOfWeek}-${index}`,
        name,
        startTime,
        endTime,
        sequence: index + 1,
        blockType: 'CLASS',
        status: 'active',
        dayOfWeek,
        journeyId: afternoon.id,
      })),
    )
    const user = userEvent.setup()
    render(
      <FlexibleScheduleWizard
        initialJourneys={[afternoon]}
        initialSlots={currentSlots}
        submitting={false}
        error={null}
        onComplete={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await user.click(screen.getByRole('button', { name: 'Añadir recreo' }))
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Añadir recreo' }),
    )
    expect(screen.getAllByText('2:30–3:00 p. m.').length).toBeGreaterThan(0)
    expect(screen.getAllByText('3:00–3:30 p. m.').length).toBeGreaterThan(0)
    expect(screen.getAllByText('3:30–4:00 p. m.').length).toBeGreaterThan(0)
    expect(screen.queryByText('2:45–3:15 p. m.')).not.toBeInTheDocument()
  })

  it('sincroniza Tipo con Nombre y Backspace conserva el foco', async () => {
    const { user } = await renderSchedule()
    const actions = await openFridayClass2(user)
    await user.click(within(actions).getByRole('menuitem', { name: 'Editar solo este día' }))
    await user.selectOptions(screen.getByLabelText('Tipo'), 'FREE')
    const name = screen.getByLabelText('Nombre')
    expect(name).toHaveValue('Hora pedagógica')
    fireEvent.change(name, { target: { value: 'Planificación docente' } })
    name.focus()
    await user.keyboard('{Backspace}')
    expect(name).toHaveFocus()
    expect(name).toHaveValue('Planificación docent')
  })
})
