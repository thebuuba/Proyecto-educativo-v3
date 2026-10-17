import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import {automaticInstrumentType} from '../utils/automaticInstrumentType'
import {matchingCatalogCriterion,nextCatalogCriterion,appendInstrumentCriterion,completeInstrumentCriterion} from './instrumentCriterionAddition'
import fixtures from '../../../../../../data/evaluation-instruments/english-grade-two-contracts.json'
const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const content=(result:ReturnType<typeof recommend>)=>result.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text)}))
describe('Inglés segundo: servicio, alternativa local, selección y puntaje pendiente',()=>{
 for(const f of fixtures)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${instrumentType} ${maxScore}`,()=>{
  const input={activityTitle:'Actividad',description:f.description,participationMode:'INDIVIDUAL' as const,maxScore,preferredInstrumentType:instrumentType}
  const service=recommend(input,context,null,[],'UNMAPPED',null)
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
  expect(content(local)).toEqual(content(service))
  expect(local.activityType).toBe(service.activityType)
  expect(activityDefaultSuggestions(input.activityTitle,f.description,context)?.activityType).toBe(f.activity)
  const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
  expect(service.criteria.map((_,i)=>pending[`${instrumentType}:points:${i}`])).toEqual(service.criteria.map(()=>''))
  const scored=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(service.criteria.map((_,i)=>Number(scored[`${instrumentType}:points:${i}`]))).toEqual(service.criteria.map(c=>c.maxScoreUnits/100))
 })
 for(const [purpose,format] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']] as const)
  it(`recomendación contextual ${format}`,()=>expect(automaticInstrumentType('ORAL_INTERACTION',context,20,fixtures[0].description+' '+purpose)).toBe(format))
 for(const type of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [null,20,17.35])it(`candidatos y completar sin redistribuir ${type} ${score??'pendiente'}`,()=>{
  const fixture=fixtures.find(f=>f.id==='plans')!
  const input={activityTitle:'Actividad',description:fixture.description,academicContext:context,instrumentType:type,participationMode:'INDIVIDUAL' as const,maxScore:score??100,includeAdditionalCandidates:true}
  const pool=editableFallbackRecommendation(input)
  const full=scoreInstrumentFields(recommendationToFields(pool,'Encuentro'),type,score,pool)
  full[`${type}:criterion:0`]='Objetivo renombrado por el docente'
  expect(nextCatalogCriterion(pool.criteria,full,type,pool.criteria)).toBeNull()
  const previous={...pool,criteria:pool.criteria.slice(0,2)}
  const fields=scoreInstrumentFields(recommendationToFields(previous,'Encuentro'),type,score,previous)
  const candidate=nextCatalogCriterion(pool.criteria,fields,type,previous.criteria)
  expect(candidate?.templateId).toBe('ing-2-interaction')
  const blank=appendInstrumentCriterion(fields,type,score,previous,null)
  const match=matchingCatalogCriterion(pool.criteria,blank.fields,type,2,blank.recommendation?.criteria)
  expect(match?.templateId).toBe('ing-2-interaction')
  const completed=completeInstrumentCriterion(blank.fields,type,2,match!)
  for(let index=0;index<3;index++){
   expect(completed[`${type}:points:${index}`]).toBe(blank.fields[`${type}:points:${index}`])
   expect(completed[`${type}:criterion-id:${index}`]).toBe(blank.fields[`${type}:criterion-id:${index}`])
  }
  const partial={...blank.fields,[`${type}:criterion:2`]:'Respuesta al interlocutor, editada por el docente'}
  const preserved=completeInstrumentCriterion(partial,type,2,match!)
  expect(preserved[`${type}:criterion:2`]).toBe(partial[`${type}:criterion:2`])
 })
})
