import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-mt-six-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('Cálculo Diferencial y Tecnología6: propósitos y límites',()=>{
 it('analiza una gráfica dada sin convertir el sustantivo en una orden de graficar',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza gráfica de la ecuación polar en el texto proporcionado.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS')
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.some(r=>r.templateId.endsWith('-representation'))).toBe(false)
  expect(p.criteria.some(r=>r.templateId.endsWith('-analysis'))).toBe(true)
 })
 it('interpreta la consigna breve de conversión de un punto sin perder su objeto',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza la conversión de un punto entre coordenadas rectangulares y polares.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS')
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-mt-6-point-conversion-'))).toBe(true)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Préstamos de interés compuesto',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:('participationMode'in task?task.participationMode:'INDIVIDUAL') as 'INDIVIDUAL'|'GROUP'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-mt-6-'))).toBe(true)
  expect(p.instrumentType).toBe(instrumentType)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/préstamos|interés compuesto/i)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('requiredAll'in task)for(const pattern of task.requiredAll!)expect(full).toMatch(new RegExp(pattern,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
  if('forbiddenEvidence'in task)for(const key of task.forbiddenEvidence!)expect(p.criteria.some(r=>r.templateId.endsWith('-'+key))).toBe(false)
  if('forbiddenTopics'in task)for(const key of task.forbiddenTopics!)expect(p.criteria.some(r=>r.templateId.startsWith('opt-mt-6-'+key+'-'))).toBe(false)
  if('requiredEvidence'in task)for(const key of task.requiredEvidence!)expect(p.criteria.some(r=>r.templateId.endsWith('-'+key))).toBe(true)
 })
 for(const [name,patch]of Object.entries({primary:{level:'PRIMARY' as const},wrongGrade:{grade:5},wrongCycle:{cycle:1},common:{subjectCode:'MAT',optativeExitName:null},wrongExit:{optativeExitName:'Humanidades y Ciencias Sociales'},arts:{modalityCode:'arts'},technical:{modalityCode:'technical_professional'},missingModality:{modalityCode:undefined}}))it('guard/'+name,()=>{
  const p=recommend({activityTitle:'Actividad',description:'Calcula la derivada de la función vectorial dada.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},{...context,...patch},null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-mt-6-'))).toBe(false)
 })
})
