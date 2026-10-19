import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/optative-hlm-ing-six-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({type:p.instrumentType,activity:p.activityType,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r),levels:p.levels})
describe('HLM sexto inglés: alternativa local y sugerencias',()=>{
 for(const cycle of [0,1])it('rechaza un ciclo definido incompatible/'+cycle,()=>{
  const p=editableFallbackRecommendation({activityTitle:'Actividad',description:contracts.cases[0].description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:{...context,cycle}})
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-hlm-ing-6-'))).toBe(false)
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35])it(task.id+'/'+format+'/'+score,()=>{
  const mode='participationMode'in task&&task.participationMode==='GROUP'?'GROUP' as const:'INDIVIDUAL' as const
  const input={activityTitle:'Un título antiguo sobre células',description:task.description,maxScore:score,participationMode:mode}
  const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:context}),remote=recommend({...input,preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(local.criteria.length).toBeGreaterThan(0);expect(local.criteria.every(r=>r.templateId.startsWith('opt-hlm-ing-6-'))).toBe(true)
  expect(content(local)).toEqual(content(remote));expect(local.instrumentType).toBe(format);expect(local.participationMode).toBe(mode)
  const pending=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),format,null,local)
  expect(pending[format+':meta:scorePending']).toBe('true');expect(pending[format+':points:0']).toBe('')
  expect(validateInstrumentDefinition(format,scoreInstrumentFields(pending,format,score,local),score)).toEqual([])
  expect(activityDefaultSuggestions(input.activityTitle,input.description,context)?.activityType).toBe(task.activityType)
 })
 for(const other of [{...context,level:'PRIMARY' as const},{...context,grade:4},{...context,subjectCode:'OPT-HCS-LEN-4',optativeExitName:'Humanidades y Ciencias Sociales'},{...context,modalityCode:'technical_professional'},{...context,modalityCode:null},{...context,optativeExitName:null},{...context,subjectCode:'ING',optativeExitName:null},{...context,subjectCode:'OPT-HLM-LEN-4'}])it('rechaza otro ámbito/'+JSON.stringify(other),()=>{
  const p=editableFallbackRecommendation({activityTitle:'Actividad',description:contracts.cases[0].description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:other})
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-hlm-ing-6-'))).toBe(false)
 })
})
