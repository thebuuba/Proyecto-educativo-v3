import {describe,it,expect} from 'vitest'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {secondaryNovelAnalysisCriteria,editableAuthoredRecommendation} from '@aula/shared'
import {appendInstrumentCriterion,nextCatalogCriterion,completeInstrumentCriterion} from './instrumentCriterionAddition'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import fixture from '../../../../../../data/evaluation-instruments/novel-task-regression.json'
const context={level:'SECONDARY' as const,grade:5,subjectCode:'LEN'}
describe('Producto analítico en alternativa local',()=>{
  it('selecciona Análisis desde la descripción',()=>{
    expect(activityDefaultSuggestions(fixture.activityTitle,fixture.description,context)?.activityType).toBe('ANALYSIS')
  })
  for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [0,15,20,17.35]) it(`${instrumentType} ${maxScore}`,()=>{
    const r=editableFallbackRecommendation({...fixture,activityType:'ANALYSIS',instrumentType,maxScore,participationMode:'INDIVIDUAL',academicContext:context})
    expect(r.criteria.map(c=>c.templateId)).toEqual(['novel-analysis-elements','novel-analysis-clues','novel-analysis-sequence','novel-analysis-interpretation','novel-analysis-writing'])
    expect(r.totalScoreUnits).toBe(Math.round(maxScore*100))
    const shared=editableAuthoredRecommendation(secondaryNovelAnalysisCriteria(fixture.activityTitle,fixture.description,context,'ANALYSIS'),{...fixture,instrumentType,maxScore,participationMode:'INDIVIDUAL'},'ANALYSIS','novela-analisis-fragmento-5')
    expect(r.criteria).toEqual(shared.criteria)
    let fields=scoreInstrumentFields(recommendationToFields(r,fixture.activityTitle),instrumentType,maxScore||null,r)
    fields[`${instrumentType}:criterion:1`]='Título editado por el docente'
    const extra=editableFallbackRecommendation({...fixture,activityType:'ANALYSIS',instrumentType,maxScore,participationMode:'INDIVIDUAL',academicContext:context,includeAdditionalCandidates:true})
    const candidate=nextCatalogCriterion(extra.criteria,fields,instrumentType,r.criteria)
    expect(candidate?.templateId).toBe('novel-analysis-limits')
    const appended=appendInstrumentCriterion(fields,instrumentType,maxScore||null,r,candidate)
    expect(appended.fields[`${instrumentType}:criterion:1`]).toBe('Título editado por el docente')
    if(!maxScore) expect(appended.fields[`${instrumentType}:meta:scorePending`]).toBe('true')
    const emptyKey=instrumentType==='rubrica'||instrumentType==='escala'?`${instrumentType}:descriptor:0:1`:`${instrumentType}:description:0`
    fields={...fields,[emptyKey]:''}
    const completed=completeInstrumentCriterion(fields,instrumentType,0,r.criteria[0])
    expect(completed[emptyKey]).not.toBe('')
    expect(completed[`${instrumentType}:criterion:1`]).toBe(fields[`${instrumentType}:criterion:1`])
    expect(Object.keys(fields).filter(k=>k!==emptyKey&&k.includes(':points:')).every(k=>fields[k]===completed[k])).toBe(true)
  })
})
