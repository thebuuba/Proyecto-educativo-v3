import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hcs-soc-six-contracts.json'
import {recommend} from './recommendation-engine'
import {optativeSocialModules} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('Optativa HCS sexto: Ciudadanía y Democracia Participativa',()=>{
 it('módulo de sexto conectado',()=>expect(optativeSocialModules.some(m=>m.subjectCode===contracts.subjectCode)).toBe(true))
 for(const topic of optativeSocialModules.find(m=>m.subjectCode===contracts.subjectCode)?.topics??[])it('consigna breve/'+topic.id,()=>{
  const proposal=recommend({activityTitle:'Experimento antiguo sobre células',description:'Analiza '+topic.label+' en el texto proporcionado.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(proposal.activityType).toBe('ANALYSIS');expect(proposal.criteria.every(r=>r.templateId.startsWith('opt-hcs-soc-6-'))).toBe(true)
  expect(proposal.criteria.some(r=>r.templateId.startsWith('opt-hcs-soc-6-'+topic.id+'-'))).toBe(true)
  const text=proposal.criteria.map(r=>r.description).join(' ')
  if(topic.id==='civic-participation')expect(text).toMatch(/participación/)
  if(topic.id==='road-education')expect(text).toMatch(/educación/)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:('participationMode'in task?task.participationMode:'INDIVIDUAL') as 'INDIVIDUAL'|'GROUP'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hcs-soc-6-'))).toBe(true)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/células|Experimento antiguo/)
  if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount)
  if('requiredEvidence'in task)for(const kind of task.requiredEvidence)expect(p.criteria.some(r=>r.templateId.includes(kind))).toBe(true)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('requiredAll'in task)for(const pattern of task.requiredAll)expect(full).toMatch(new RegExp(pattern,'i'))
  if('requiredCalculationTargets'in task)for(const pattern of task.requiredCalculationTargets)expect(p.criteria.filter(r=>r.templateId.endsWith('-calculation')).map(r=>r.description).join(' ')).toMatch(new RegExp(pattern,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
  if('onlyEvidence'in task)expect(p.criteria.every(r=>r.templateId.includes(task.onlyEvidence!))).toBe(true)
 })
})
