import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/optative-hlm-len-four-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
describe('Optativa HLM cuarto: paridad local, selección y puntos pendientes',()=>{
 it('sugiere cotejo para reconocer figuras y conserva una rúbrica elegida manualmente',()=>{
  const task=contracts.cases.find(c=>c.id==='poetry-figures-only')!
  expect(activityDefaultSuggestions('Actividad',task.description,context)?.instrument).toBe('lista-cotejo')
  const local=editableFallbackRecommendation({activityTitle:'Actividad',description:task.description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:context})
  expect(local.instrumentType).toBe('rubrica');expect(local.criteria).toHaveLength(2)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const input={activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context}),remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(local.criteria.length).toBeGreaterThan(0);expect(local.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-4-'))).toBe(true)
  expect(content(local)).toEqual(content(remote));expect(local.instrumentType).toBe(instrumentType)
  const pending=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),instrumentType,null,local)
  expect(pending[instrumentType+':meta:scorePending']).toBe('true');expect(pending[instrumentType+':points:0']).toBe('')
  expect(validateInstrumentDefinition(instrumentType,scoreInstrumentFields(pending,instrumentType,maxScore,local),maxScore)).toEqual([])
  expect(activityDefaultSuggestions(input.activityTitle,input.description,context)?.activityType).toBe(task.activityType)
 })
 for(const other of [{...context,level:'PRIMARY' as const},{...context,grade:1},{...context,grade:5},{...context,subjectCode:'OPT-HCS-LEN-4',optativeExitName:'Humanidades y Ciencias Sociales'},{...context,modalityCode:'technical_professional'},{...context,modalityCode:null},{...context,optativeExitName:'Humanidades y Ciencias Sociales'},{...context,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null}])it('no confunde el ámbito/'+JSON.stringify(other),()=>{
  const p=editableFallbackRecommendation({activityTitle:'Poesía romántica',description:contracts.cases[0].description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:other})
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-hlm-len-4-'))).toBe(false)
 })
})
