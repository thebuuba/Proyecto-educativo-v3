import {describe,it,expect} from 'vitest'
import bank from '../../../../../../data/evaluation-instruments/curricular-audit/len1-informe-reservado-v1.json'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {validateInstrumentDefinition} from '@aula/shared'
describe('Informe: alternativa editable ante revisión y publicación reales',()=>{
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${format}: instrumento completo, puntuación pendiente y texto manual conservado`,()=>{
  const task=bank.cases[2],p=editableFallbackRecommendation({activityTitle:task.title,description:task.description,academicContext:{level:'SECONDARY',grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española'},instrumentType:format,participationMode:'INDIVIDUAL',maxScore:17.35})
  expect(p.criteria.length).toBeGreaterThan(1)
  const pending=scoreInstrumentFields(recommendationToFields(p,task.title),format,null,p)
  expect(pending[`${format}:points:0`]).toBe('')
  pending[`${format}:criterion:0`]='Ajuste manual del informe de la leyenda'
  for(const score of [20,17.35]){
   const fields=scoreInstrumentFields(pending,format,score,p)
   expect(fields[`${format}:criterion:0`]).toBe(pending[`${format}:criterion:0`])
   expect(validateInstrumentDefinition(format,fields,score)).toEqual([])
  }
 })
})
