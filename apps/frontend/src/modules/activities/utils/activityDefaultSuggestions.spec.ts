import { describe, expect, it } from 'vitest'
import { activityDefaultSuggestions } from './activityDefaultSuggestions'

describe('sugerencias locales de actividad', () => {
  it('prioriza el informe elaborado sobre la lectura previa', () => {
    expect(activityDefaultSuggestions('Análisis y elaboración de un informe de lectura.',
      'Leerán un cuento y elaborarán un informe escrito con análisis y conclusión.')).toEqual({
      activityType: 'REPORT', technique: 'analisis-producciones', instrument: 'rubrica',
    })
  })
  it('usa opciones distintas para experimentos y problemas matemáticos', () => {
    expect(activityDefaultSuggestions('Experimento de germinación', 'Registrarán el crecimiento de semillas.')).toEqual({
      activityType: 'EXPERIMENT', technique: 'observacion-sistematica', instrument: 'rubrica',
    })
    expect(activityDefaultSuggestions('Resolución de problemas', 'Resolverán problemas con fracciones.')).toEqual({
      activityType: 'PROBLEM_SOLVING', technique: 'resolucion-problemas', instrument: 'lista-ponderada',
    })
  })
  it('espera título y descripción', () => {
    expect(activityDefaultSuggestions('Informe', '')).toBeNull()
  })
})
