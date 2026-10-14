import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import fixtures from '../../../../../../data/evaluation-instruments/english-grade-one-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const content=(result:ReturnType<typeof recommend>)=>result.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text)}))
describe('Acciones mixtas: servicio, alternativa y campos del editor',()=>{
 for(const f of fixtures)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${instrumentType} ${maxScore}`,()=>{
  const input={activityTitle:'Actividad',description:f.description,participationMode:'INDIVIDUAL' as const,maxScore,preferredInstrumentType:instrumentType}
  const service=recommend(input,context,null,[],'UNMAPPED',null)
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
  expect(content(local)).toEqual(content(service))
  expect(local.activityType).toBe(service.activityType)
  expect(content(recommend({...input,activityTitle:'La célula animal'},context,null,[],'UNMAPPED',null))).toEqual(content(service))
  const fields=recommendationToFields(local,'Actividad')
  const label=`${instrumentType}:description:0`
  expect(fields[label]).toBeTruthy()
  fields[label]='Edición manual conservada'
  const pending=scoreInstrumentFields(fields,instrumentType,null,local)
  const scored=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(scored[label]).toBe('Edición manual conservada')
  expect(service.criteria.map((_,i)=>Number(scored[`${instrumentType}:points:${i}`]))).toEqual(service.criteria.map(c=>c.maxScoreUnits/100))
 })
})
