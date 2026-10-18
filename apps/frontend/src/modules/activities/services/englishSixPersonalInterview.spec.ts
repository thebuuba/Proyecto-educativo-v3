import {describe,it,expect} from 'vitest'
import {validateInstrumentDefinition} from '@aula/shared'
import personalCase from '../../../../../../data/evaluation-instruments/english-grade-six-personal-interview.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
const context={level:'SECONDARY' as const,cycle:2,grade:6,subjectCode:'ING',subjectName:'Inglés',modalityCode:'academic',optativeExitName:null}
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...c})=>c)})
describe('Entrevista personal de Inglés6.º: mismo instrumento en servicio y alternativa local',()=>{
 for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${instrumentType}/${maxScore}`,()=>{
  const input={activityTitle:personalCase.title,description:personalCase.description,maxScore,participationMode:'GROUP' as const}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
  const remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(content(local)).toEqual(content(remote))
  expect(local.criteria.some(c=>c.templateId==='ing-6-job-interview-questions')).toBe(true)
  expect(JSON.stringify(local.criteria)).not.toMatch(/ficha/i)
  const pending=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),instrumentType,null,local)
  expect(pending[`${instrumentType}:points:0`]).toBe('');expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
  const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
  expect(local.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
 })
})
