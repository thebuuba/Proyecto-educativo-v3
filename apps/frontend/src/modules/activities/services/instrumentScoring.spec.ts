import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { distributeUnits, rememberManualLevelWeights, rememberManualScoreWeights, scoreInstrumentFields, scoreRecommendation, validActivityScore } from './instrumentScoring'
import { editableAuthoredRecommendation } from '@aula/shared'

const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const

describe('puntaje pendiente y redistribución del instrumento', () => {
  for (const type of formats) for (const total of [15,20,17.35]) it(`same authored weights before or after preparation: ${type} ${total}`, () => {
    const criteria = [4,5,4,5,2,2].map((weight,index) => ({templateId:`criterion-${index}`,title:`Componente ${index}`,observable:'Evidencia solicitada',weight,progressionLevels:['Completa','Casi completa','Incompleta','Contradictoria','Ausente'] as [string,string,string,string,string]}))
    const prepare = (maxScore:number) => editableAuthoredRecommendation(criteria,{activityTitle:'Análisis',maxScore,instrumentType:type,participationMode:'INDIVIDUAL'},'ANALYSIS','test')
    const initial=prepare(20), direct=prepare(total)
    const pending=scoreInstrumentFields(recommendationToFields(initial,'Análisis'),type,null,initial)
    const after=scoreInstrumentFields(pending,type,total,initial)
    const before=scoreInstrumentFields(recommendationToFields(direct,'Análisis'),type,total,direct)
    expect(Array.from({length:criteria.length},(_,i)=>after[`${type}:points:${i}`])).toEqual(Array.from({length:criteria.length},(_,i)=>before[`${type}:points:${i}`]))
    if(type==='lista-ponderada') expect(Array.from({length:criteria.length},(_,i)=>after[`${type}:weight:${i}`])).toEqual(Array.from({length:criteria.length},(_,i)=>before[`${type}:weight:${i}`]))
  })
  it('keeps zero level ratios and tiny-score level definitions usable', () => {
    const proposal = editableFallbackRecommendation({activityTitle: 'Small', maxScore: 20, instrumentType: 'escala', participationMode: 'INDIVIDUAL'})
    const original = { ...recommendationToFields(proposal, 'Small'), 'escala:level-points:1': '0', 'escala:level-points:4': '10', 'escala:level-points:3': '9' }
    const fields = scoreInstrumentFields(original, 'escala', 0.01, proposal)
    expect(fields['escala:level-points:1']).toBe('0')
    expect(Number(fields['escala:level-points:3']) / Number(fields['escala:level-points:4'])).toBe(0.9)
    expect(scoreRecommendation(proposal, fields, 0.01).levels[1].proportion).toBe(0.9)
  })
  it('handles malformed internal weight metadata and overflow without NaN', () => {
    const proposal = editableFallbackRecommendation({activityTitle: 'Small', maxScore: 20, instrumentType: 'rubrica', participationMode: 'INDIVIDUAL'})
    const original = { ...recommendationToFields(proposal, 'Small'), 'rubrica:meta:scoreWeights': 'null', 'rubrica:meta:levelScoreWeights': '{}' }
    expect(() => scoreInstrumentFields(original, 'rubrica', 0.01, proposal)).not.toThrow()
    expect(distributeUnits(100, [Number.MAX_VALUE, Number.MAX_VALUE])).toEqual([50, 50])
  })
  it('does not allocate unbounded levels from malformed metadata', () => {
    expect(() => scoreInstrumentFields({ 'escala:meta:criteriaCount': '1', 'escala:meta:levelCount': 'Infinity' }, 'escala', 1)).not.toThrow()
  })
  it('distingue vacío, cero y decimales incompletos de un total confirmado', () => {
    expect(validActivityScore('')).toBeNull()
    expect(validActivityScore('0')).toBeNull()
    expect(validActivityScore('17.')).toBeNull()
    expect(validActivityScore('17.35')).toBe(17.35)
    expect(validActivityScore('20')).toBe(20)
  })

  it.each(formats)('prepara %s sin puntos y cambia 20 → 30 → 17.35 sin tocar contenido', type => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', description: 'Redactarán una noticia.',
      maxScore: 20, instrumentType: type, participationMode: 'INDIVIDUAL' })
    const original = recommendationToFields(proposal, 'La noticia')
    const pending = scoreInstrumentFields(original, type, null, proposal)
    expect(pending[`${type}:meta:scorePending`]).toBe('true')
    expect(pending[`${type}:points:0`]).toBe('')
    expect(scoreRecommendation(proposal, pending, null).totalScoreUnits).toBe(0)
    const content = {
      [`${type}:criterion:0`]: 'Criterio editado por docente',
      [`${type}:description:0`]: 'Descripción editada por docente',
      ...(type === 'rubrica' ? { 'rubrica:descriptor:0:4': 'Descriptor editado por docente' } : {}),
      ...(type === 'lista-ponderada' ? { 'lista-ponderada:indicator:0': 'Indicador editado por docente' } : {}),
    }
    let fields: Record<string, string> = { ...pending, ...content }
    const weights = Object.fromEntries(Object.entries(fields).filter(([key]) => key.startsWith(`${type}:weight:`)))
    for (const score of [20, 30, 17.35]) {
      fields = scoreInstrumentFields(fields, type, score, proposal)
      const count = Number(fields[`${type}:meta:criteriaCount`])
      expect(Array.from({ length: count }, (_, index) => Math.round(Number(fields[`${type}:points:${index}`]) * 100))
        .reduce((sum, units) => sum + units, 0)).toBe(Math.round(score * 100))
      expect(fields).toMatchObject({ ...content, ...weights })
      expect(scoreRecommendation(proposal, fields, score).totalScoreUnits).toBe(Math.round(score * 100))
    }
    const cleared = scoreInstrumentFields(fields, type, null, proposal)
    expect(cleared).toMatchObject({ ...content, ...weights })
    expect(cleared[`${type}:points:0`]).toBe('')
  })

  it('conserva proporciones manuales al cambiar varias veces el total', () => {
    const proposal = editableFallbackRecommendation({ activityTitle: 'La noticia', maxScore: 20,
      instrumentType: 'rubrica', participationMode: 'INDIVIDUAL' })
    const original = scoreInstrumentFields(recommendationToFields(proposal, 'La noticia'), 'rubrica', 20, proposal)
    const edited = rememberManualLevelWeights(rememberManualScoreWeights({ ...original,
      'rubrica:points:0': '8', 'rubrica:points:1': '2',
      'rubrica:criterion:0': 'Criterio propio', 'rubrica:descriptor:0:4': 'Descriptor propio',
      'rubrica:level-points:4': '6', 'rubrica:level-points:3': '4',
    }, 'rubrica'), 'rubrica')
    const direct = scoreInstrumentFields(edited, 'rubrica', 20, proposal)
    const thirty = scoreInstrumentFields(edited, 'rubrica', 30, proposal)
    const twenty = scoreInstrumentFields(thirty, 'rubrica', 20, proposal)
    expect(twenty['rubrica:points:0']).toBe(direct['rubrica:points:0'])
    expect(twenty['rubrica:points:1']).toBe(direct['rubrica:points:1'])
    expect(twenty['rubrica:criterion:0']).toBe('Criterio propio')
    expect(twenty['rubrica:descriptor:0:4']).toBe('Descriptor propio')
    expect(twenty['rubrica:level-points:4']).toBe(direct['rubrica:level-points:4'])
    expect(twenty['rubrica:level-points:3']).toBe(direct['rubrica:level-points:3'])
  })
})
