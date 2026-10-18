import {describe,it,expect} from 'vitest'
import {socialGradeThreeTopics,resolveCommonSocialTask,validateInstrumentDefinition} from '@aula/shared'
import contracts from '../../../../../../data/evaluation-instruments/social-grade-three-contracts.json'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {completeInstrumentCriterion,nextCatalogCriterion} from './instrumentCriterionAddition'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
const samples=[...socialGradeThreeTopics.map(t=>({id:t.id,description:`Explica ${t.label}.`,topicId:t.id})),...contracts.cases.map(c=>({...c,topicId:null}))]
const content=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...c})=>c)})
describe('Sociales tercero: instrumento completo y controles compartidos',()=>{
 for(const task of samples)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
  const input={activityTitle:'Un título antiguo de biología',description:task.description,maxScore,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
  const remote=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  expect(content(local)).toEqual(content(remote))
  expect(local.criteria.length).toBeGreaterThan(0);expect(local.criteria.every(c=>c.templateId.startsWith('soc-3-'))).toBe(true)
  if(task.topicId)expect(local.criteria.some(c=>c.templateId.startsWith(`soc-3-${task.topicId}-`))).toBe(true)
  const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
  expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true');expect(pending[`${instrumentType}:points:0`]).toBe('')
  const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
  expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
  expect(local.criteria.reduce((s,_,i)=>s+Math.round(Number(fields[`${instrumentType}:points:${i}`])*100),0)).toBe(Math.round(maxScore*100))
  const completed=completeInstrumentCriterion({...fields,[`${instrumentType}:criterion:0`]:'Texto manual',[`${instrumentType}:description:0`]:''},instrumentType,0,local.criteria[0])
  expect(completed[`${instrumentType}:criterion:0`]).toBe('Texto manual');expect(completed[`${instrumentType}:description:0`]).toBe(local.criteria[0].description)
  expect(nextCatalogCriterion(local.criteria,fields,instrumentType)).toBeNull()
 })
 it('mantiene el límite de nivel, grado no implementado y optativa',()=>{
  const description='Compara las dictaduras de los casos de América proporcionados.'
  expect(resolveCommonSocialTask('',description,context)).not.toBeNull()
  for(const c of [{...context,level:'PRIMARY' as const},{...context,grade:7},{...context,subjectCode:'OPT-HCS-SOC'},{...context,optativeExitName:'Humanidades'}])expect(resolveCommonSocialTask('',description,c)).toBeNull()
 })
})
