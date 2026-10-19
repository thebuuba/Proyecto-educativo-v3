import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/optative-hcs-len-six-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
describe('Optativa HCS sexto: paridad, guard y puntos pendientes',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const input={activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,participationMode:('participationMode'in task?task.participationMode:'INDIVIDUAL') as 'INDIVIDUAL'|'GROUP'}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context}),remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(local.criteria.length).toBeGreaterThan(0);expect(local.criteria.every(r=>r.templateId.startsWith('opt-hcs-len-6-'))).toBe(true)
  expect(content(local)).toEqual(content(remote));expect(local.instrumentType).toBe(instrumentType)
  const pending=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),instrumentType,null,local)
  expect(pending[instrumentType+':meta:scorePending']).toBe('true');expect(pending[instrumentType+':points:0']).toBe('')
  expect(validateInstrumentDefinition(instrumentType,scoreInstrumentFields(pending,instrumentType,maxScore,local),maxScore)).toEqual([])
  expect(activityDefaultSuggestions(input.activityTitle,input.description,context)?.activityType).toBe(task.activityType)
 })
 for(const other of [{...context,level:'PRIMARY' as const},{...context,grade:1},{...context,grade:4},{...context,grade:5},{...context,subjectCode:'OPT-HLM-LEN-6',optativeExitName:'Humanidades y Lenguas Modernas'},{...context,modalityCode:'technical_professional'},{...context,modalityCode:null},{...context,optativeExitName:'Humanidades y Lenguas Modernas'},{...context,optativeExitName:null},{...context,cycle:1},{...context,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null}])it('no confunde el ámbito/'+JSON.stringify(other),()=>{
  const p=editableFallbackRecommendation({activityTitle:'Currículum vitae',description:contracts.cases[0].description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:other})
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-hcs-len-6-'))).toBe(false)
 })
})
