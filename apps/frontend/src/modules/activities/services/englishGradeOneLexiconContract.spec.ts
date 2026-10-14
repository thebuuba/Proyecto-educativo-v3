import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import fixtures from '../../../../../../data/evaluation-instruments/english-grade-one-lexicon-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const content=(result:ReturnType<typeof recommend>)=>result.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text)}))
describe('Inglés primero: léxico y expresiones en servicio y alternativa',()=>{
 for(const [index,f] of fixtures.entries())for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${instrumentType} ${maxScore}`,()=>{
  for(const receptive of [false,true]){
   const requirement=`${index<39?'vocabulario de':'expresiones para'} ${f.term}`
   const description=receptive?`Leerán un texto en inglés e identificarán ${requirement}.`:`Escribirán un mensaje en inglés usando ${requirement}.`
   const input={activityTitle:'Actividad',description,participationMode:'INDIVIDUAL' as const,maxScore,preferredInstrumentType:instrumentType}
   const service=recommend(input,context,null,[],'UNMAPPED',null)
   const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
   expect(content(local)).toEqual(content(service))
   expect(local.activityType).toBe(service.activityType)
   expect(content(recommend({...input,activityTitle:'La célula animal'},context,null,[],'UNMAPPED',null))).toEqual(content(service))
   const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
   const scored=scoreInstrumentFields(pending,instrumentType,maxScore,local)
   expect(service.criteria.map((_,i)=>Number(scored[`${instrumentType}:points:${i}`]))).toEqual(service.criteria.map(c=>c.maxScoreUnits/100))
  }
 })
})
