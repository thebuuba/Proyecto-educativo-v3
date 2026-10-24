import {describe,it,expect} from 'vitest'
import {composePilotInstrument,validateInstrumentDefinition} from '@aula/shared'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from './instrumentPreparation'
import {scoreInstrumentFields,rememberManualScoreWeights} from './instrumentScoring'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'MAT',subjectName:'Matemática',modalityCode:null,optativeExitName:null}
const description='Compara −3/4 y −2/3. Justifica cuál es mayor con una recta numérica o con un texto que incluya los cálculos; no entregues ambas opciones.'
describe('Piloto compartido en los campos editables existentes',()=>{
 it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('%s: duración agrupada conserva total y edición manual',instrumentType=>{
  const p=editableFallbackRecommendation({activityTitle:'Muestra ficticia',description:'Expongan todos los planetas del sistema solar y expliquen qué son. Máximo cinco minutos. Usen material de apoyo.',maxScore:20,instrumentType,participationMode:'INDIVIDUAL',academicContext:{...context,subjectCode:'NAT-TU'}})
  const fields=recommendationToFields(p,'Muestra ficticia'),pending=scoreInstrumentFields(fields,instrumentType,null,p)
  expect(pending[instrumentType+':meta:scorePending']).toBe('true')
  let edited=scoreInstrumentFields(pending,instrumentType,17.35,p)
  const textKey=instrumentType+(instrumentType==='lista-ponderada'?':indicator:0':':criterion:0')
  edited[textKey]='Texto manual que debe conservarse'
  const units=p.criteria.length===5?[400,500,300,200,335]:[400,500,417,418]
  if(instrumentType==='lista-ponderada')for(const [i,weight]of [40,30,15,15].entries())edited[instrumentType+':weight:'+i]=String(weight)
  else for(const [i,value]of units.entries())edited[instrumentType+':points:'+i]=String(value/100)
  edited=instrumentType==='lista-ponderada'?scoreInstrumentFields(edited,instrumentType,17.35,p):rememberManualScoreWeights(edited,instrumentType)
  expect(validateInstrumentDefinition(instrumentType,edited,17.35)).toEqual([])
  const aligned=alignRecommendationWithFields(p,edited,17.35)!
  expect(aligned.totalScoreUnits).toBe(1735)
  expect(aligned.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  expect(JSON.stringify(aligned)).toContain('Texto manual que debe conservarse')
  expect(aligned.criteria[0].maxScoreUnits).toBe(instrumentType==='lista-ponderada'?694:400)
 })
 it('usa el contexto académico efectivo de Ciencias primero',()=>{
  const p=editableFallbackRecommendation({activityTitle:'Actividad',description:'Expongan todos los planetas del sistema solar y expliquen qué son.',maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext:{...context,subjectCode:'NAT-TU',subjectName:'Ciencias de la Naturaleza'}})
  expect(p.internalTrace.composition?.contract.context.subjectCode).toBe('NAT')
 })
 it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('%s conserva puntuación pendiente, texto, identidad y pesos manuales',instrumentType=>{
  const p=editableFallbackRecommendation({activityTitle:'Nombre neutral',description,maxScore:20,instrumentType,participationMode:'INDIVIDUAL',academicContext:context})
  expect(p.internalTrace.composition?.version).toBe('composition-pilot-v1')
  expect(p.criteria).toEqual(composePilotInstrument({description,context,maxScore:20,instrumentType,participationMode:'INDIVIDUAL'})!.criteria)
  const fields=recommendationToFields(p,'Nombre neutral'),pending=scoreInstrumentFields(fields,instrumentType,null,p)
  expect(pending[instrumentType+':meta:scorePending']).toBe('true')
  for(const [key,value]of Object.entries(pending))if(key.startsWith(instrumentType+':points:'))expect(value).toBe('')
  let scored=scoreInstrumentFields(pending,instrumentType,17.35,p)
  const criterionKey=instrumentType+(instrumentType==='lista-ponderada'?':indicator:0':':criterion:0')
  scored[criterionKey]='Criterio editado por la docente'
  const id=p.criteria[0].id
  scored[instrumentType+':points:0']='7.35';scored[instrumentType+':points:1']='10'
  if(instrumentType==='lista-ponderada'){
   scored[instrumentType+':weight:0']='40';scored[instrumentType+':weight:1']='60'
   scored=scoreInstrumentFields(scored,instrumentType,17.35,p)
  }else scored=rememberManualScoreWeights(scored,instrumentType)
  const edited=alignRecommendationWithFields(p,scored,17.35)
  expect(edited?.criteria[0].id).toBe(id)
  expect(edited?.totalScoreUnits).toBe(1735)
  expect(edited?.criteria[0].maxScoreUnits).toBe(instrumentType==='lista-ponderada'?694:735)
  expect(JSON.stringify(edited?.criteria[0])).toContain('Criterio editado por la docente')
  expect(fields[instrumentType+':criterion:0']).not.toBe('Criterio editado por la docente')
 })
})
