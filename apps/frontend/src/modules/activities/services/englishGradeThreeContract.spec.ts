import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import functions from '../../../../../../data/evaluation-instruments/english-grade-three-contracts.json'
import grammar from '../../../../../../data/evaluation-instruments/english-grade-three-grammar-contracts.json'
import lexicon from '../../../../../../data/evaluation-instruments/english-grade-three-lexicon-contracts.json'
import strategies from '../../../../../../data/evaluation-instruments/english-grade-three-strategy-contracts.json'
import genres from '../../../../../../data/evaluation-instruments/english-grade-three-genre-contracts.json'
import contexts from '../../../../../../data/evaluation-instruments/english-grade-three-context-contracts.json'
import {matchingCatalogCriterion,nextCatalogCriterion,appendInstrumentCriterion,completeInstrumentCriterion} from './instrumentCriterionAddition'
const academic={level:'SECONDARY' as const,grade:3,cycle:1,modalityCode:'academic',subjectCode:'ING',subjectName:'Inglés',optativeExitName:null}
const cases=[...functions.map(f=>({id:f.id,description:f.description})),...grammar.flatMap(f=>f.forms.flatMap(form=>[
 {id:`${f.id}-${form}-read`,description:`Leerán en inglés un texto e identificarán ${form}.`},
 {id:`${f.id}-${form}-explain`,description:`Explicarán la función de ${form} con ejemplos de un texto en inglés.`},
 {id:`${f.id}-${form}-write`,description:`Escribirán en inglés un mensaje utilizando ${form}.`},
])),...lexicon.flatMap(f=>['Leerán un texto en inglés e identificarán','Escribirán en inglés un mensaje utilizando'].map(action=>({id:`lexicon-${f.id}-${action}`,description:`${action} ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}.`})))]
const content=(p:ReturnType<typeof recommend>)=>p.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,weight:c.relativeWeight,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text),progression:c.progressionLevels}))
cases.push(...strategies,...contexts,...genres.flatMap(g=>g.modes.map(mode=>({id:`genre-${g.id}-${mode}`,description:`${mode==='reading'?'Leerán':mode==='listening'?'Escucharán':mode==='interaction'?'Dialogarán':mode==='audiovisual'?'Crearán':'Presentarán oralmente'} en inglés un ${g.label}.`}))))
describe('Tercero: funciones y gramática en servicio, alternativa y adaptador',()=>{
 for(const f of cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${format} ${total}`,()=>{
  const input={activityTitle:'Actividad',description:f.description,participationMode:'INDIVIDUAL' as const,maxScore:total,preferredInstrumentType:format}
  const service=recommend(input,academic,null,[],'UNMAPPED',null)
  const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:academic})
  expect(content(local)).toEqual(content(service))
  expect(local.activityType).toBe(service.activityType)
  expect(activityDefaultSuggestions('Actividad',f.description,academic)?.activityType).toBe(service.activityType)
  const fields=recommendationToFields(local,'Actividad'),pending=scoreInstrumentFields(fields,format,null,local)
  const after=scoreInstrumentFields(pending,format,total,local),before=scoreInstrumentFields(fields,format,total,local)
  expect(service.criteria.map((_,i)=>pending[`${format}:points:${i}`])).toEqual(service.criteria.map(()=>''))
  expect(service.criteria.map((_,i)=>after[`${format}:points:${i}`])).toEqual(service.criteria.map(c=>String(c.maxScoreUnits/100)))
  expect(service.criteria.map((_,i)=>before[`${format}:points:${i}`])).toEqual(service.criteria.map((_,i)=>after[`${format}:points:${i}`]))
 })
 for(const type of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [null,20,17.35])it(`completa sin perder campos ni puntuaciones ${type} ${score??'pendiente'}`,()=>{
  const input={activityTitle:'Actividad',description:'Dialogarán en inglés para expresar una opinión.',academicContext:academic,instrumentType:type,participationMode:'INDIVIDUAL' as const,maxScore:score??100,includeAdditionalCandidates:true}
  const pool=editableFallbackRecommendation(input)
  const full=scoreInstrumentFields(recommendationToFields(pool,'Opinión'),type,score,pool)
  full[`${type}:criterion:0`]='Objetivo renombrado por el docente'
  expect(nextCatalogCriterion(pool.criteria,full,type,pool.criteria)).toBeNull()
  const previous={...pool,criteria:pool.criteria.slice(0,2)}
  const fields=scoreInstrumentFields(recommendationToFields(previous,'Opinión'),type,score,previous)
  const candidate=nextCatalogCriterion(pool.criteria,fields,type,previous.criteria)
  expect(candidate?.templateId).toBe('ing-3-intelligibility')
  const blank=appendInstrumentCriterion(fields,type,score,previous,null)
  const match=matchingCatalogCriterion(pool.criteria,blank.fields,type,2,blank.recommendation?.criteria)
  expect(match?.templateId).toBe('ing-3-intelligibility')
  const completed=completeInstrumentCriterion(blank.fields,type,2,match!)
  const partial={...blank.fields,[`${type}:criterion:2`]:'Mensaje oral, ajustado por el docente'}
  expect(completeInstrumentCriterion(partial,type,2,match!)[`${type}:criterion:2`]).toBe(partial[`${type}:criterion:2`])
  for(let index=0;index<3;index++){
   expect(completed[`${type}:points:${index}`]).toBe(blank.fields[`${type}:points:${index}`])
   expect(completed[`${type}:criterion-id:${index}`]).toBe(blank.fields[`${type}:criterion-id:${index}`])
  }
 })
})
