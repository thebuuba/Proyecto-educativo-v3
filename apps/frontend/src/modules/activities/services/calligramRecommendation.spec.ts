import {describe,expect,it} from 'vitest'
import {firstGradeCalligramCriteria,editableAuthoredRecommendation} from '@aula/shared'
import {editableFallbackRecommendation} from './instrumentPreparation'
import fixtures from '../../../../../../data/evaluation-instruments/calligram-grade-one-regressions.json'
describe('Caligrama de primero: alternativa compartida',()=>{
  for(const fixture of fixtures) for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [20,17.35,0]) it(`${fixture.id} ${instrumentType} ${maxScore}`,()=>{
    const input={activityTitle:'Actividad 1',description:fixture.description,activityType:fixture.activityType,instrumentType,maxScore,participationMode:'GROUP' as const,secondaryLanguageGrade:1 as const}
    const result=editableFallbackRecommendation(input)
    const shared=editableAuthoredRecommendation(firstGradeCalligramCriteria(input.activityType,input.description),input,input.activityType,'lengua-secundaria-1-caligrama')
    expect(result.criteria).toEqual(shared.criteria)
    expect(result.instrumentType).toBe(instrumentType)
    expect(result.totalScoreUnits).toBe(Math.round(maxScore*100))
  })
  it('una elección incompatible no reactiva el caligrama heredado',()=>{
    const result=editableFallbackRecommendation({activityTitle:'El caligrama',description:fixtures[0].description,activityType:'PROBLEM_SOLVING',instrumentType:'rubrica',maxScore:20,participationMode:'GROUP',secondaryLanguageGrade:1})
    expect(result.activityType).toBe('PROBLEM_SOLVING')
    expect(result.criteria.some(c=>c.templateId.startsWith('calligram-'))).toBe(false)
    expect(result.criteria.some(c=>c.title.includes('Vocabulario y recursos expresivos'))).toBe(false)
  })
})
