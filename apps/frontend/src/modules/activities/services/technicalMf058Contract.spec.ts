import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/technical-mf058-five-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {completeInstrumentCriterion} from './instrumentCriterionAddition'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import {automaticInstrumentType} from '../utils/automaticInstrumentType'
import {instrumentAcademicContext} from '../utils/instrumentAcademicContext'

const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
describe('MF058: creador local, paridad, puntos pendientes y edición manual',()=>{
 it('normaliza el contexto efectivo del creador sin inventar una salida académica',()=>{
  const actual=instrumentAcademicContext({id:'local',sectionName:'QA Development',academicLevelCode:'secundario',gradeName:'5.º',gradeSequence:5,subjectName:contracts.subjectName,subjectCode:contracts.subjectCode,modalityCode:contracts.modalityCode,optativeExitName:null})
  expect(actual?.cycle).toBeUndefined()
  const p=editableFallbackRecommendation({activityTitle:'Título antiguo',description:'Crea y estructura un proyecto de reportes de práctica según los requisitos dados.',maxScore:17.35,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:actual})
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('technical-mf058-'))).toBe(true)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const input={activityTitle:'Entrevista de trabajo en inglés',description:task.description,maxScore,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
  const remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(local.criteria.length).toBeGreaterThan(0)
  expect(local.criteria.every(r=>r.templateId.startsWith('technical-mf058-'))).toBe(true)
  expect(content(local)).toEqual(content(remote))
  const defaults=activityDefaultSuggestions(input.activityTitle,task.description,context)!
  expect(defaults?.activityType).toBe(remote.activityType)
  expect(automaticInstrumentType(defaults.activityType,context,null,task.description)).toBe(defaults.instrument)
  const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
  expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
  expect(pending[`${instrumentType}:points:0`]).toBe('')
  const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
  const manual={...fields,[`${instrumentType}:criterion:0`]:'Mi criterio técnico manual',[`${instrumentType}:description:0`]:''}
  expect(completeInstrumentCriterion(manual,instrumentType,0,local.criteria[0])[`${instrumentType}:criterion:0`]).toBe('Mi criterio técnico manual')
 })
})
