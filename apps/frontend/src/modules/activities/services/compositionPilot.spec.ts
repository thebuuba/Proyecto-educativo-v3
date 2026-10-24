import {describe,it,expect} from 'vitest'
import {composePilotInstrument} from '@aula/shared'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from './instrumentPreparation'
import {scoreInstrumentFields,rememberManualScoreWeights} from './instrumentScoring'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'MAT',subjectName:'Matemática',modalityCode:null,optativeExitName:null}
const description='Compara −3/4 y −2/3. Justifica cuál es mayor con una recta numérica o con un texto que incluya los cálculos; no entregues ambas opciones.'
describe('Piloto compartido en los campos editables existentes',()=>{
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
