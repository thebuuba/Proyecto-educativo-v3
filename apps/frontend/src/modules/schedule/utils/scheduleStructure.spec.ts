import { describe, expect, it } from 'vitest'
import {
  formatScheduleRange,
  formatScheduleTime,
  generateJourneyBlocks,
  generateTemplateBlocks,
  insertTemplateBreak,
  materializeJourneyDraft,
  reflowTemplateBlocks,
  summarizeBlocks,
  validateScheduleStructure,
} from './scheduleStructure'

const journey = (id: string, startTime: string, endTime: string, kind = 'CUSTOM') => ({
  id,
  name: id,
  kind: kind as 'CUSTOM',
  startTime,
  endTime,
  sequence: 1,
})
const block = (
  journeyKey: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  blockType = 'CLASS',
) => ({
  name: blockType,
  journeyKey,
  dayOfWeek,
  startTime,
  endTime,
  blockType: blockType as 'CLASS',
  sequence: 1,
})

describe('schedule structure', () => {
  it('presenta horas en formato docente sin cambiar el formato interno', () => {
    expect(formatScheduleTime('13:00')).toBe('1:00 p. m.')
    expect(formatScheduleTime('16:00')).toBe('4:00 p. m.')
    expect(formatScheduleRange('13:00', '13:35')).toBe('1:00–1:35 p. m.')
    expect(generateTemplateBlocks('13:00', 35, 1)[0]).toMatchObject({
      startTime: '13:00',
      endTime: '13:35',
    })
  })

  it('genera una jornada uniforme sin imponerla como fuente permanente', () => {
    const result = generateJourneyBlocks({
      journeyKey: 'morning',
      startTime: '07:30',
      durationMinutes: 40,
      periodCount: 6,
      days: [1],
    })
    expect(result).toHaveLength(6)
    expect(result[2]).toMatchObject({ startTime: '08:50', endTime: '09:30' })
  })

  it('acepta dos jornadas y una hora vacía entre ellas', () => {
    expect(
      validateScheduleStructure(
        [
          journey('morning', '07:20', '12:00'),
          { ...journey('afternoon', '13:00', '16:00'), sequence: 2 },
        ],
        [block('morning', 1, '07:30', '08:10'), block('afternoon', 1, '13:00', '13:35')],
      ),
    ).toEqual([])
  })

  it('acepta duraciones variables, recreo y jornada nocturna', () => {
    expect(
      validateScheduleStructure(
        [journey('night', '18:00', '22:00')],
        [
          block('night', 2, '18:00', '18:35'),
          block('night', 2, '18:35', '19:05'),
          block('night', 2, '19:05', '19:30'),
          block('night', 2, '19:30', '20:00', 'BREAK'),
        ],
      ),
    ).toEqual([])
  })

  it('acepta el horario vespertino real de cinco clases y un recreo', () => {
    const blocks = [
      block('afternoon', 1, '13:00', '13:35'),
      block('afternoon', 1, '13:35', '14:05'),
      block('afternoon', 1, '14:05', '14:30'),
      block('afternoon', 1, '14:30', '15:00', 'BREAK'),
      block('afternoon', 1, '15:00', '15:30'),
      block('afternoon', 1, '15:30', '16:00'),
    ]
    expect(validateScheduleStructure([journey('afternoon', '13:00', '16:00')], blocks)).toEqual([])
    expect(summarizeBlocks(blocks)).toEqual({ total: 180, class: 150, pause: 30, free: 0 })
  })

  it('acepta martes y jueves, huecos y bloques consecutivos', () => {
    expect(
      validateScheduleStructure(
        [journey('extended', '08:00', '16:00')],
        [
          block('extended', 2, '08:00', '08:45'),
          block('extended', 2, '09:30', '10:15'),
          block('extended', 4, '08:00', '08:45'),
        ],
      ),
    ).toEqual([])
  })

  it('detecta solapamientos', () => {
    expect(
      validateScheduleStructure(
        [journey('morning', '07:00', '12:00')],
        [block('morning', 1, '07:30', '08:10'), block('morning', 1, '08:00', '08:40')],
      ),
    ).toContain('Lunes: hay bloques solapados.')
  })

  it('rechaza fin anterior y bloques fuera de jornada', () => {
    const errors = validateScheduleStructure(
      [journey('morning', '12:00', '07:00')],
      [block('morning', 1, '06:00', '05:00')],
    )
    expect(errors.length).toBeGreaterThanOrEqual(2)
  })

  it('acepta un viernes con una estructura más corta', () => {
    expect(
      validateScheduleStructure(
        [journey('morning', '07:30', '12:00')],
        [
          block('morning', 1, '07:30', '08:10'),
          block('morning', 5, '07:30', '08:10'),
          block('morning', 1, '11:20', '12:00'),
        ],
      ),
    ).toEqual([])
  })

  it('acepta Jornada Extendida con recreo y almuerzo', () => {
    expect(
      validateScheduleStructure(
        [journey('extended', '08:00', '16:00', 'EXTENDED')],
        [
          block('extended', 1, '08:00', '08:45'),
          block('extended', 1, '10:15', '10:45', 'BREAK'),
          block('extended', 1, '12:00', '13:00', 'LUNCH'),
          block('extended', 1, '15:15', '16:00'),
        ],
      ),
    ).toEqual([])
  })

  it('acepta una hora libre entre períodos', () => {
    expect(
      validateScheduleStructure(
        [journey('morning', '07:00', '12:00')],
        [
          block('morning', 3, '07:30', '08:10'),
          block('morning', 3, '08:10', '08:50', 'FREE'),
          block('morning', 3, '08:50', '09:30'),
        ],
      ),
    ).toEqual([])
  })

  it('acepta dos períodos consecutivos para una clase doble', () => {
    expect(
      validateScheduleStructure(
        [journey('morning', '07:00', '12:00')],
        [block('morning', 1, '08:10', '08:50'), block('morning', 1, '08:50', '09:30')],
      ),
    ).toEqual([])
  })

  it('calcula por separado tiempo lectivo, pausas y tiempo libre', () => {
    expect(
      summarizeBlocks([
        block('extended', 1, '08:00', '08:45'),
        block('extended', 1, '08:45', '09:15', 'BREAK'),
        block('extended', 1, '09:15', '10:00', 'FREE'),
      ]),
    ).toEqual({ total: 120, class: 45, pause: 30, free: 45 })
  })

  it('genera una sola estructura base sin repetirla por día', () => {
    const template = generateTemplateBlocks('07:30', 40, 6)
    expect(template).toHaveLength(6)
    expect(template.map((item) => item.startTime)).toEqual([
      '07:30',
      '08:10',
      '08:50',
      '09:30',
      '10:10',
      '10:50',
    ])
  })

  it('inserta recreo y mueve los períodos posteriores', () => {
    const template = generateTemplateBlocks('07:30', 40, 4)
    const result = insertTemplateBreak(template, 2, 30)
    expect(result[3]).toMatchObject({ blockType: 'BREAK', startTime: '09:30', endTime: '10:00' })
    expect(result[4]).toMatchObject({ startTime: '10:00', endTime: '10:40' })
  })

  it('reajusta desde los horarios actuales y conserva las duraciones posteriores', () => {
    const template = generateTemplateBlocks('13:00', 35, 5)
    template[1] = { ...template[1], endTime: '14:05' }
    const afterClass2 = reflowTemplateBlocks(template, 2)
    expect(afterClass2[2]).toMatchObject({ startTime: '14:05', endTime: '14:40' })
    expect(afterClass2[4]).toMatchObject({ startTime: '15:15', endTime: '15:50' })

    afterClass2[2] = { ...afterClass2[2], endTime: '14:30' }
    const afterClass3 = reflowTemplateBlocks(afterClass2, 3)
    const withBreak = insertTemplateBreak(afterClass3, 2, 30)
    expect(withBreak[3]).toMatchObject({ blockType: 'BREAK', startTime: '14:30', endTime: '15:00' })
    expect(withBreak[4]).toMatchObject({ name: 'Clase 4', startTime: '15:00', endTime: '15:35' })
    expect(withBreak[5]).toMatchObject({ name: 'Clase 5', startTime: '15:35', endTime: '16:10' })
  })

  it('materializa la plantilla únicamente en los días aplicados', () => {
    const template = generateTemplateBlocks('07:30', 40, 2)
    const result = materializeJourneyDraft('morning', {
      durationMinutes: 40,
      periodCount: 2,
      appliedDays: [2, 4],
      baseBlocks: template,
      dayOverrides: {},
    })
    expect(result).toHaveLength(4)
    expect([...new Set(result.map((item) => item.dayOfWeek))]).toEqual([2, 4])
  })

  it('personaliza un día sin cambiar la estructura de los demás', () => {
    const template = generateTemplateBlocks('07:30', 40, 2)
    const friday = template.map((item) => ({ ...item }))
    friday[1] = { ...friday[1], endTime: '08:40' }
    const result = materializeJourneyDraft('morning', {
      durationMinutes: 40,
      periodCount: 2,
      appliedDays: [1, 5],
      baseBlocks: template,
      dayOverrides: { 5: friday },
    })
    expect(result.find((item) => item.dayOfWeek === 1 && item.sequence === 2)?.endTime).toBe(
      '08:50',
    )
    expect(result.find((item) => item.dayOfWeek === 5 && item.sequence === 2)?.endTime).toBe(
      '08:40',
    )
  })

  it('conserva los identificadores existentes al actualizar', () => {
    const template = generateTemplateBlocks('07:30', 40, 1)
    const result = materializeJourneyDraft(
      'morning',
      {
        durationMinutes: 40,
        periodCount: 1,
        appliedDays: [1],
        baseBlocks: template,
        dayOverrides: {},
      },
      [{ id: 'slot-1', journeyId: 'morning', dayOfWeek: 1, sequence: 1 }],
    )
    expect(result[0].id).toBe('slot-1')
  })
})
