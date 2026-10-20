import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/optative-mt-six-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {completeInstrumentCriterion} from './instrumentCriterionAddition'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import {automaticInstrumentType} from '../utils/automaticInstrumentType'
import {instrumentAcademicContext} from '../utils/instrumentAcademicContext'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
describe('Cálculo6: alternativa local, manual y puntuación',()=>{
 it('usa el contexto real del creador sin ciclo explícito y no cae al instrumento genérico',()=>{
  const actual=instrumentAcademicContext({id:'local',sectionName:'QA Development',academicLevelCode:'secundario',gradeName:'6.º',gradeSequence:6,subjectName:contracts.subjectName,subjectCode:contracts.subjectCode,modalityCode:'academic',optativeExitName:contracts.optativeExitName})
  expect(actual?.cycle).toBeUndefined()
  const p=editableFallbackRecommendation({activityTitle:'Título antiguo',description:'Calcula la derivada de la función vectorial dada.',maxScore:17.35,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:actual})
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-mt-6-'))).toBe(true)
  expect(activityDefaultSuggestions('Título antiguo','Calcula la derivada de la función vectorial dada.',actual)?.activityType).toBe('EXERCISE_SET')
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const input={activityTitle:'Préstamos de interés compuesto',description:task.description,maxScore,participationMode:('participationMode'in task?task.participationMode:'INDIVIDUAL') as 'INDIVIDUAL'|'GROUP'}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context}),remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(local.criteria.every(r=>r.templateId.startsWith('opt-mt-6-'))).toBe(true)
  expect(content(local)).toEqual(content(remote))
  expect(activityDefaultSuggestions(input.activityTitle,task.description,context)?.activityType).toBe(task.activityType)
  const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
  expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
  expect(pending[`${instrumentType}:points:0`]).toBe('')
  const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
  expect(local.criteria.reduce((n,_,i)=>n+Math.round(Number(fields[`${instrumentType}:points:${i}`])*100),0)).toBe(Math.round(maxScore*100))
  const manual={...fields,[`${instrumentType}:criterion:0`]:'Mi criterio vectorial manual',[`${instrumentType}:description:0`]:''}
  expect(completeInstrumentCriterion(manual,instrumentType,0,local.criteria[0])[`${instrumentType}:criterion:0`]).toBe('Mi criterio vectorial manual')
 })
 for(const task of contracts.cases.filter(c=>'suggestedInstrumentType'in c))it('selección/'+task.id,()=>expect(automaticInstrumentType(task.activityType,context,null,task.description)).toBe(task.suggestedInstrumentType))
})
