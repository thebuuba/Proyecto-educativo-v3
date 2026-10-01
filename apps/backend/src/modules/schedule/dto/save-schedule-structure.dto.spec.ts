import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { SaveScheduleStructureDto } from './save-schedule-structure.dto'

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
const metadata = { type: 'body' as const, metatype: SaveScheduleStructureDto, data: undefined }
const validPayload = {
  journeys: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Matutina',
      kind: 'MORNING',
      startTime: '07:30',
      endTime: '12:00',
      sequence: 1,
    },
  ],
  blocks: [
    {
      name: 'Clase 1',
      startTime: '07:30',
      endTime: '08:10',
      sequence: 1,
      dayOfWeek: 1,
      blockType: 'CLASS',
      journeyKey: '11111111-1111-4111-8111-111111111111',
    },
  ],
}

describe('SaveScheduleStructureDto', () => {
  it('acepta el contrato de estructura saneado', async () => {
    await expect(pipe.transform(validPayload, metadata)).resolves.toMatchObject(validPayload)
  })

  it('reproduce el 400 cuando una jornada cargada se reenvía con status', async () => {
    const payload = {
      ...validPayload,
      journeys: [{ ...validPayload.journeys[0], status: 'active' }],
    }
    const error = await pipe.transform(payload, metadata).catch((cause) => cause)
    expect(error).toBeInstanceOf(BadRequestException)
    expect(error.getStatus()).toBe(400)
    expect(error.getResponse()).toMatchObject({ message: ['journeys.0.property status should not exist'] })
  })
})
