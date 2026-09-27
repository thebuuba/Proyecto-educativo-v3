import { describe, expect, it } from 'vitest'
import { ApiError } from '@/services/apiClient'
import { scheduleSaveErrorMessage } from '@/modules/schedule/services/scheduleService'

describe('mensajes de guardado del horario', () => {
  it('no presenta validación ni error 500 como problema de Internet', () => {
    expect(scheduleSaveErrorMessage(new ApiError(400, 'status no permitido'))).toMatch(
      /información que necesita revisión/i,
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
})
