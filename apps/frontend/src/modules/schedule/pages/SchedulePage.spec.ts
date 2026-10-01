import { describe, expect, it } from 'vitest'
import { ApiError } from '@/services/apiClient'
import { scheduleSaveErrorMessage } from '@/modules/schedule/services/scheduleService'

describe('mensajes de guardado del horario', () => {
  it('no presenta validación ni error 500 como problema de Internet', () => {
    expect(scheduleSaveErrorMessage(new ApiError(400, 'status no permitido'))).toMatch(
      /información que necesita revisión/i,
    )
    expect(scheduleSaveErrorMessage(new ApiError(400, 'El bloque Clase 2 está fuera de su jornada.'))).toContain(
      'Revisa: El bloque Clase 2 está fuera de su jornada.',
    )
    expect(scheduleSaveErrorMessage(new ApiError(500, 'error interno'))).toMatch(
      /en este momento/i,
    )
  })

  it('reserva el mensaje de conexión para fallos reales de fetch', () => {
    expect(scheduleSaveErrorMessage(new TypeError('Failed to fetch'))).toMatch(
      /conectar con el servidor/i,
    )
  })

  it('traduce la incompatibilidad de un servidor anterior sin mostrar campos técnicos', () => {
    const message = scheduleSaveErrorMessage(
      new ApiError(
        400,
        'blocks.65.property blockSource should not exist,blocks.65.property sourceKey should not exist,blocks.65.blockType must be one of the following values: CLASS, BREAK, LUNCH, PAUSE, FREE',
      ),
    )
    expect(message).toMatch(/servicio que los guarda todavía no está actualizado/i)
    expect(message).toMatch(/cambios permanecen en pantalla/i)
    expect(message).not.toMatch(/blocks\.65|blockSource|sourceKey/)
  })
})
