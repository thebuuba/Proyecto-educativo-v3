import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hcs-len-six-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('Optativa HCS sexto: textos científicos y profesionales',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:('participationMode'in task?task.participationMode:'INDIVIDUAL') as 'INDIVIDUAL'|'GROUP'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hcs-len-6-'))).toBe(true)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/células|Experimento antiguo/)
  if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount)
  if('requiredEvidence'in task)for(const kind of task.requiredEvidence)expect(p.criteria.some(r=>r.templateId.includes(kind))).toBe(true)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
  if('onlyEvidence'in task)expect(p.criteria.every(r=>r.templateId.includes(task.onlyEvidence!))).toBe(true)
 })
})
