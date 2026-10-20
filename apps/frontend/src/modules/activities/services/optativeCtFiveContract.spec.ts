import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/optative-ct-five-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {completeInstrumentCriterion} from './instrumentCriterionAddition'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import {instrumentAcademicContext} from '../utils/instrumentAcademicContext'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})

describe('Química y Computación5: contexto, paridad, manuales y puntos',()=>{
 it('reconoce el contexto real del creador sin ciclo explícito',()=>{
  const actual=instrumentAcademicContext({id:'local',sectionName:'QA Development',academicLevelCode:'secundario',gradeName:'5.º',gradeSequence:5,subjectName:contracts.subjectName,subjectCode:contracts.subjectCode,modalityCode:'academic',optativeExitName:contracts.optativeExitName})
  expect(actual?.cycle).toBeUndefined()
  const p=editableFallbackRecommendation({activityTitle:'Título antiguo',description:'Simula la dinámica molecular con los parámetros proporcionados.',maxScore:17.35,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:actual})
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-ct-5-'))).toBe(true)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const input={activityTitle:'Préstamos e interés compuesto',description:task.description,maxScore,participationMode:task.participationMode as 'INDIVIDUAL'|'GROUP'}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context}),remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(local.criteria.length).toBeGreaterThan(0)
  expect(local.criteria.every(r=>r.templateId.startsWith('opt-ct-5-')||r.templateId.startsWith('delivery-format'))).toBe(true)
  expect(content(local)).toEqual(content(remote))
  expect(activityDefaultSuggestions(input.activityTitle,task.description,context)?.activityType).toBe(task.activityType)
  const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
  expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
  expect(pending[`${instrumentType}:points:0`]).toBe('')
  const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
  expect(local.criteria.reduce((n,_,i)=>n+Math.round(Number(fields[`${instrumentType}:points:${i}`])*100),0)).toBe(Math.round(maxScore*100))
  const manual={...fields,[`${instrumentType}:criterion:0`]:'Mi criterio químico manual',[`${instrumentType}:description:0`]:''}
  expect(completeInstrumentCriterion(manual,instrumentType,0,local.criteria[0])[`${instrumentType}:criterion:0`]).toBe('Mi criterio químico manual')
 })
})
