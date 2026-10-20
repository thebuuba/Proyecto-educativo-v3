import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-mt-four-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('Matemática Financiera y Tecnología4: propósitos y límites',()=>{
 it('reconoce Resolución de problemas nominal en título sin descripción',()=>{
  const p=recommend({activityTitle:'Resolución de problemas de interés compuesto',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('PROBLEM_SOLVING')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['opt-mt-4-compound-interest-understanding','opt-mt-4-compound-interest-calculation','opt-mt-4-compound-interest-result'])
  expect(p.instrumentType).toBe('lista-cotejo')
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-mt-4-'))).toBe(true)
  expect(p.instrumentType).toBe(instrumentType)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/células|Experimento antiguo/)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('requiredAll'in task)for(const pattern of task.requiredAll!)expect(full).toMatch(new RegExp(pattern,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
  if('forbiddenEvidence'in task)for(const key of task.forbiddenEvidence!)expect(p.criteria.some(r=>r.templateId.endsWith('-'+key))).toBe(false)
  if('requiredEvidence'in task)for(const key of task.requiredEvidence!)expect(p.criteria.some(r=>r.templateId.endsWith('-'+key))).toBe(true)
 })
 for(const [name,patch]of Object.entries({primary:{level:'PRIMARY' as const},wrongGrade:{grade:5},wrongCycle:{cycle:1},common:{subjectCode:'MAT',optativeExitName:null},wrongExit:{optativeExitName:'Humanidades y Ciencias Sociales'},arts:{modalityCode:'arts'},technical:{modalityCode:'technical_professional'},missingModality:{modalityCode:undefined}}))it('guard/'+name,()=>{
  const p=recommend({activityTitle:'Actividad',description:'Calcula el interés compuesto con los datos dados.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},{...context,...patch},null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-mt-4-'))).toBe(false)
 })
})
