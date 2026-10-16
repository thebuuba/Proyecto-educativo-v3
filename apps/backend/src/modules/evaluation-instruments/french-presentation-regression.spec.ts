import { describe, expect, it } from 'vitest'
import { detectTeachingStrategy } from '@aula/shared'
import { recommend } from './recommendation-engine'

export const presentationDescription = 'En parejas, los estudiantes se saludarán en francés y realizarán un diálogo breve para preguntar y responder su nombre, edad y lugar de residencia. Luego intercambiarán los roles.'
const context = { level: 'SECONDARY' as const, grade: 1, cycle: 1, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
const propose = (description: string, format: typeof formats[number] = 'rubrica', title = 'Actividad', grade = 1) => recommend({ activityTitle: title, description, maxScore: 17.35, participationMode: 'GROUP', preferredInstrumentType: format }, { ...context, grade, cycle: grade <= 3 ? 1 : 2 }, null, [], 'UNMAPPED', null)

describe('presentación francesa: fidelidad a acciones y datos explícitos', () => {
  for (const format of formats) it(`${format}: saludar, preguntar, responder residencia y ambos roles sin duplicar evidencias`, () => {
    const p = propose(presentationDescription, format)
    expect(p.activityType).toBe('ORAL_INTERACTION')
    // Cotejo separates three questions and three answers; the other four indicators are distinct.
    expect(p.criteria.length).toBeLessThanOrEqual(format === 'lista-cotejo' ? 10 : 6)
    const text = p.criteria.map(c => c.description).join(' ')
    expect(text).toMatch(/saludo/)
    expect(text).toMatch(/(?:Formula|Pregunta)/)
    expect(text).toMatch(/(?:Responde|respuestas).*nombre.*edad.*residencia/)
    expect(text).toMatch(/(?:ambos|dos) (?:papeles|roles)/)
    expect(text).toMatch(/pausas y reformulaciones/)
    expect(text).not.toMatch(/nacionalidad|dirección exacta|nativ[oa]|escrito/)
    expect(p.criteria.reduce((sum, c) => sum + c.maxScoreUnits, 0)).toBe(1735)
    expect(new Set(p.criteria.map(c => c.templateId)).size).toBe(p.criteria.length)
    for (const c of p.criteria.filter(c => /questions|roles|personal/.test(c.templateId))) {
      expect(c.progressionLevels).toHaveLength(5)
      if (/residencia/.test(c.description)) expect(c.progressionLevels?.slice(1).every(t => /residencia/.test(t))).toBe(true)
    }
    if (format === 'lista-cotejo') {
      for (const data of ['nombre', 'edad', 'residencia']) expect(p.criteria.some(c => c.description.includes(data) && !['nombre', 'edad', 'residencia'].filter(other => other !== data).some(other => c.description.includes(other)))).toBe(true)
    }
    for (const title of ['Nos presentamos en francés', 'Título neutral', 'Ensayo escrito en inglés']) expect(propose(presentationDescription, format, title).criteria).toEqual(p.criteria)
  })
  for (const grade of [1, 2, 4]) it(`proveedor personal compartido en ${grade}: residencia solo cuando se pide`, () => {
    for (const format of formats) {
      const simple = propose('En parejas, pregunten y respondan solo su nombre en francés.', format, 'Actividad', grade)
      expect(simple.criteria.map(c => c.description).join(' ')).not.toMatch(/edad|residencia|nacionalidad|dirección/)
      const residence = propose('En parejas, pregunten y respondan su lugar de residencia en francés. No incluyan nacionalidad ni dirección exacta.', format, 'Actividad', grade)
      expect(residence.criteria.map(c => c.description).join(' ')).toMatch(/residencia/)
      expect(residence.criteria.map(c => c.description).join(' ')).not.toMatch(/nacionalidad|dirección exacta/)
      const negative = propose('En parejas, pregunten y respondan su nombre en francés. No incluyan residencia.', format, 'Actividad', grade)
      expect(negative.criteria.map(c => c.description).join(' ')).not.toMatch(/residencia/)
    }
  })
  it('no añade preguntas ni cambio de papeles a una lectura o a un diálogo sin intercambio', () => {
    const reading = propose('Lean un diálogo en francés sobre nombre, edad y residencia, sin representarlo.')
    expect(reading.criteria.some(c => /questions|roles|interaction/.test(c.templateId))).toBe(false)
    const dialogue = propose('En parejas, realicen un diálogo en francés para preguntar y responder el nombre.')
    expect(dialogue.criteria.some(c => /questions/.test(c.templateId))).toBe(true)
    expect(dialogue.criteria.some(c => /roles/.test(c.templateId))).toBe(false)
  })
  it.each([
    'En parejas, pregunten y respondan su nombre y edad en francés, sin residencia.',
    'En parejas, pregunten y respondan su nombre y edad en francés, pero no su lugar de residencia.',
  ])('respeta datos negados dentro de la misma consigna: %s', description => {
    expect(propose(description).criteria.map(c => c.description).join(' ')).not.toMatch(/residencia/)
  })
  it('no confunde procedencia, nacionalidad y dirección exacta con residencia', () => {
    for (const field of ['procedencia', 'nacionalidad', 'dirección exacta']) {
      const text = propose(`En parejas, pregunten y respondan su nombre y ${field} en francés.`).criteria.map(c => c.description).join(' ')
      expect(text).not.toMatch(/residencia/)
    }
  })
  it('no exige preguntas ni intercambio de roles expresamente negados', () => {
    const p = propose('En parejas, realicen un diálogo en francés para responder su nombre. No formularán preguntas ni intercambiarán los roles.')
    expect(p.criteria.some(c => /questions|roles/.test(c.templateId))).toBe(false)
  })
})

describe('simulación por acciones, no por un título o un recurso', () => {
  it.each(['Nos presentamos en francés', 'Actividad', 'Debate'])('detecta ambos papeles con título %s', title => {
    expect(detectTeachingStrategy({ title, description: presentationDescription, ...context }).id).toBe('SIMULATION')
  })
  it.each([
    'Lean un diálogo en francés sobre nombre y edad.',
    'Analicen un diálogo en francés entre quien pregunta y quien responde.',
    'En parejas, escriban los nombres y edades en francés.',
    'Realicen un diálogo en francés para preguntar y responder su nombre.',
    'Como ejemplo, una simulación de entrevista con roles. Lean el texto.',
    'Recursos: simulación con intercambio de roles. Escriban un resumen.',
    'No representarán un diálogo ni intercambiarán los roles. Lean las preguntas y respuestas.',
    'Lean un diálogo sobre una simulación con roles complementarios e intercambio de roles.',
  ])('no infiere simulación: %s', description => {
    expect(detectTeachingStrategy({ title: 'Simulación', description, ...context }).id).toBeNull()
  })
})
