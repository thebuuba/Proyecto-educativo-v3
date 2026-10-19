import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/optative-hlm-len-five-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
describe('HLM quinto: alternativa local, sugerencias y puntos pendientes',()=>{
 it('la variante singular novela policial conserva la paridad con el proveedor optativo',()=>{
  const input={activityTitle:'Actividad',description:'Analiza la novela policial proporcionada.',maxScore:17.35,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType:'rubrica',academicContext:context}),remote=recommend({...input,preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(local.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-5-novela-policiaca-'))).toBe(true)
  expect(content(local)).toEqual(content(remote))
 })
 it('sugiere cotejo para reconocimiento y respeta la rúbrica manual',()=>{
  const task=contracts.cases.find(c=>c.id==='epic-figures-only')!
  expect(activityDefaultSuggestions('Actividad',task.description,context)?.instrument).toBe('lista-cotejo')
  const p=editableFallbackRecommendation({activityTitle:'Actividad',description:task.description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:context})
  expect(p.instrumentType).toBe('rubrica');expect(p.criteria).toHaveLength(2)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const input={activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context}),remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(local.criteria.length).toBeGreaterThan(0);expect(local.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-5-'))).toBe(true)
  expect(content(local)).toEqual(content(remote));expect(local.instrumentType).toBe(instrumentType)
  const pending=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),instrumentType,null,local)
  expect(pending[instrumentType+':meta:scorePending']).toBe('true');expect(pending[instrumentType+':points:0']).toBe('')
  expect(validateInstrumentDefinition(instrumentType,scoreInstrumentFields(pending,instrumentType,maxScore,local),maxScore)).toEqual([])
  expect(activityDefaultSuggestions(input.activityTitle,input.description,context)?.activityType).toBe(task.activityType)
 })
 for(const other of [{...context,level:'PRIMARY' as const},{...context,grade:4},{...context,grade:6},{...context,subjectCode:'OPT-HCS-LEN-5',optativeExitName:'Humanidades y Ciencias Sociales'},{...context,modalityCode:'technical_professional'},{...context,modalityCode:null},{...context,optativeExitName:'Humanidades y Ciencias Sociales'},{...context,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null}])it('rechaza otro ámbito/'+JSON.stringify(other),()=>{
  const p=editableFallbackRecommendation({activityTitle:'Epopeya',description:contracts.cases[0].description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:other})
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-hlm-len-5-'))).toBe(false)
 })
})
