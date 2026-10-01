import { afterEach, describe, expect, it, vi } from 'vitest'
import { saveScheduleStructure, serializeScheduleStructure } from './scheduleService'
import type { SaveScheduleStructureInput } from '@/modules/schedule/types'

const input = {
  journeys: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Matutina',
      kind: 'MORNING',
      startTime: '07:30',
      endTime: '12:00',
      sequence: 1,
      status: 'active',
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Vespertina',
      kind: 'AFTERNOON',
      startTime: '13:00',
      endTime: '16:00',
      sequence: 2,
      status: 'active',
    },
  ],
  blocks: [
    {
      name: 'Clase 1',
      startTime: '13:00',
      endTime: '13:35',
      sequence: 1,
      dayOfWeek: 1,
      blockType: 'CLASS',
      journeyKey: '22222222-2222-4222-8222-222222222222',
    },
    {
      name: 'Recreo',
      startTime: '14:30',
      endTime: '15:00',
      sequence: 4,
      dayOfWeek: 1,
      blockType: 'BREAK',
      journeyKey: '22222222-2222-4222-8222-222222222222',
    },
  ],
} as unknown as SaveScheduleStructureInput

afterEach(() => vi.restoreAllMocks())

describe('persistencia de estructura del horario', () => {
  it('serializa solo el contrato permitido y conserva jornadas, duraciones y recreos', () => {
    const payload = serializeScheduleStructure(input)
    expect(payload.journeys).toHaveLength(2)
    expect(payload.journeys[0]).not.toHaveProperty('status')
    expect(payload.blocks).toEqual(input.blocks)
    expect(payload.blocks[0]).toMatchObject({ startTime: '13:00', endTime: '13:35' })
    expect(payload.blocks[1]).toMatchObject({ blockType: 'BREAK' })
  })

  it('usa POST sobre el endpoint de estructura con el payload saneado', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { saved: true } }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    await expect(saveScheduleStructure(input)).resolves.toEqual({ saved: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/v1/schedule/structure')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body)).journeys[0]).not.toHaveProperty('status')
  })
})
