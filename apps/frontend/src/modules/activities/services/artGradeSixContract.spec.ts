import { describe, expect, it } from 'vitest'
import { validateInstrumentDefinition } from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/art-grade-six-contracts.json'
import { recommend } from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { activityDefaultSuggestions } from '../utils/activityDefaultSuggestions'

const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ART',subjectName:'Educación Artística',optativeExitName:null,modalityCode:null}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...row})=>row)})
describe('Artística sexto: servicio, alternativa local y puntos',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const input={activityTitle:'Título antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL' as const}
   const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context}),remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
   expect(content(local)).toEqual(content(remote))
   const pending=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),instrumentType,null,local)
   expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
   expect(pending[`${instrumentType}:points:0`]).toBe('')
   const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
   expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
   expect(activityDefaultSuggestions(input.activityTitle,input.description,context)?.activityType).toBe(local.activityType)
  })
 }
 it('no conecta sexto en primaria, otra asignatura ni una salida optativa',()=>{
  for(const other of [{...context,level:'PRIMARY' as const},{...context,subjectCode:'LEN'},{...context,optativeExitName:'Artes Visuales'}]){
   const p=editableFallbackRecommendation({activityTitle:'Fotografía',description:contracts.cases[0].description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:other})
   expect(p.criteria.some(row=>row.templateId.startsWith('art-6-'))).toBe(false)
  }
 })
})
