import {expect,it} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import bank from '../../../../../../data/evaluation-instruments/realistic-audit-bank-v1.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'

const ids=['B-LEN1-informe-retirado','B-LEN1-informe-desarrollado','B-NAT5-tabla-reconstruida','B-MF0024-formato']
const definition=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...criterion})=>criterion)})
for(const task of bank.cases.filter(task=>ids.includes(task.id)))for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const){
 it(`${task.id}/${instrumentType}: servicio y alternativa, puntos pendientes y totales exactos`,()=>{
  const context={level:'SECONDARY' as const,grade:task.grade,cycle:task.grade<=3?1:2,subjectCode:task.subjectCode,subjectName:task.subjectName,modalityCode:task.modalityCode??null,optativeExitName:null}
  const input={activityTitle:task.title,description:task.description,participationMode:'INDIVIDUAL' as const}
  for(const maxScore of [20,17.35]){
   const remote=recommend({...input,maxScore,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
   const local=editableFallbackRecommendation({...input,maxScore,instrumentType,academicContext:context})
   expect(definition(local)).toEqual(definition(remote))
   expect(activityDefaultSuggestions(task.title,task.description,context)?.activityType).toBe(remote.activityType)
   const pending=scoreInstrumentFields(recommendationToFields(local,task.title),instrumentType,null,local)
   expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
   expect(pending[`${instrumentType}:points:0`]).toBe('')
   const scored=scoreInstrumentFields(pending,instrumentType,maxScore,local)
   expect(validateInstrumentDefinition(instrumentType,scored,maxScore)).toEqual([])
  }
 })
}
