import {describe,expect,it} from 'vitest'
import {firstGradeDetectiveCriteria,editableAuthoredRecommendation} from '@aula/shared'
import {editableFallbackRecommendation} from './instrumentPreparation'
import fixtures from '../../../../../../data/evaluation-instruments/detective-grade-one-regressions.json'

describe('Cuento policíaco de primero: alternativa compartida',()=>{
  for(const fixture of fixtures) for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [20,17.35,0]) it(`${fixture.id} ${instrumentType} ${maxScore}`,()=>{
    const input={activityTitle:'Actividad 1',description:fixture.description,activityType:fixture.activityType,instrumentType,maxScore,participationMode:'INDIVIDUAL' as const,secondaryLanguageGrade:1 as const}
    const result=editableFallbackRecommendation(input)
    const shared=editableAuthoredRecommendation(firstGradeDetectiveCriteria(input.activityType,input.description),input,input.activityType,'lengua-secundaria-1-cuento-policiaco')
    expect(result.criteria).toEqual(shared.criteria)
    expect(result.instrumentType).toBe(instrumentType)
    expect(result.totalScoreUnits).toBe(Math.round(maxScore*100))
  })
  it('respeta una actividad manual incompatible sin reactivar la plantilla heredada',()=>{
    const result=editableFallbackRecommendation({activityTitle:'El cuento policíaco',description:fixtures[0].description,activityType:'PROBLEM_SOLVING',instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL',secondaryLanguageGrade:1})
    expect(result.activityType).toBe('PROBLEM_SOLVING')
    expect(result.criteria.some(c=>c.templateId.startsWith('detective-'))).toBe(false)
    expect(result.criteria.some(c=>c.title.includes('Misterio, pistas'))).toBe(false)
  })
})
