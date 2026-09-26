import { describe, expect, it } from 'vitest'
import { generateJourneyBlocks, summarizeBlocks, validateScheduleStructure } from './scheduleStructure'

const journey = (id: string, startTime: string, endTime: string, kind = 'CUSTOM') => ({ id, name: id, kind: kind as 'CUSTOM', startTime, endTime, sequence: 1 })
const block = (journeyKey: string, dayOfWeek: number, startTime: string, endTime: string, blockType = 'CLASS') => ({ name: blockType, journeyKey, dayOfWeek, startTime, endTime, blockType: blockType as 'CLASS', sequence: 1 })

describe('schedule structure', () => {
  it('genera una jornada uniforme sin imponerla como fuente permanente', () => {
    const result = generateJourneyBlocks({ journeyKey: 'morning', startTime: '07:30', durationMinutes: 40, periodCount: 6, days: [1] })
    expect(result).toHaveLength(6)
    expect(result[2]).toMatchObject({ startTime: '08:50', endTime: '09:30' })
  })

  it('acepta dos jornadas y una hora vacía entre ellas', () => {
    expect(validateScheduleStructure(
      [journey('morning', '07:20', '12:00'), { ...journey('afternoon', '13:00', '16:00'), sequence: 2 }],
      [block('morning', 1, '07:30', '08:10'), block('afternoon', 1, '13:00', '13:35')],
    )).toEqual([])
  })

  it('acepta duraciones variables, recreo y jornada nocturna', () => {
    expect(validateScheduleStructure(
      [journey('night', '18:00', '22:00')],
      [block('night', 2, '18:00', '18:35'), block('night', 2, '18:35', '19:05'), block('night', 2, '19:05', '19:30'), block('night', 2, '19:30', '20:00', 'BREAK')],
    )).toEqual([])
  })

  it('acepta martes y jueves, huecos y bloques consecutivos', () => {
    expect(validateScheduleStructure(
      [journey('extended', '08:00', '16:00')],
      [block('extended', 2, '08:00', '08:45'), block('extended', 2, '09:30', '10:15'), block('extended', 4, '08:00', '08:45')],
    )).toEqual([])
  })

  it('detecta solapamientos', () => {
    expect(validateScheduleStructure(
      [journey('morning', '07:00', '12:00')],
      [block('morning', 1, '07:30', '08:10'), block('morning', 1, '08:00', '08:40')],
    )).toContain('Lunes: hay bloques solapados.')
  })

  it('rechaza fin anterior y bloques fuera de jornada', () => {
    const errors = validateScheduleStructure([journey('morning', '12:00', '07:00')], [block('morning', 1, '06:00', '05:00')])
    expect(errors.length).toBeGreaterThanOrEqual(2)
  })

  it('acepta un viernes con una estructura más corta', () => {
    expect(validateScheduleStructure([journey('morning', '07:30', '12:00')], [
      block('morning', 1, '07:30', '08:10'),
      block('morning', 5, '07:30', '08:10'),
      block('morning', 1, '11:20', '12:00'),
    ])).toEqual([])
  })

  it('acepta Jornada Extendida con recreo y almuerzo', () => {
    expect(validateScheduleStructure([journey('extended', '08:00', '16:00', 'EXTENDED')], [
      block('extended', 1, '08:00', '08:45'),
      block('extended', 1, '10:15', '10:45', 'BREAK'),
      block('extended', 1, '12:00', '13:00', 'LUNCH'),
      block('extended', 1, '15:15', '16:00'),
    ])).toEqual([])
  })

  it('acepta una hora libre entre períodos', () => {
    expect(validateScheduleStructure([journey('morning', '07:00', '12:00')], [
      block('morning', 3, '07:30', '08:10'),
      block('morning', 3, '08:10', '08:50', 'FREE'),
      block('morning', 3, '08:50', '09:30'),
    ])).toEqual([])
  })

  it('acepta dos períodos consecutivos para una clase doble', () => {
    expect(validateScheduleStructure([journey('morning', '07:00', '12:00')], [
      block('morning', 1, '08:10', '08:50'),
      block('morning', 1, '08:50', '09:30'),
    ])).toEqual([])
  })

  it('calcula por separado tiempo lectivo, pausas y tiempo libre', () => {
    expect(summarizeBlocks([
      block('extended', 1, '08:00', '08:45'),
      block('extended', 1, '08:45', '09:15', 'BREAK'),
      block('extended', 1, '09:15', '10:00', 'FREE'),
    ])).toEqual({ total: 120, class: 45, pause: 30, free: 45 })
  })
})
