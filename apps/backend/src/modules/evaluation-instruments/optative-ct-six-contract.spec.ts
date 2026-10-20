import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-ct-six-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}

describe('Física y Computación6: acciones, objetos y límites de los cuatro componentes',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Préstamos e interés compuesto',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:task.participationMode as 'INDIVIDUAL'|'GROUP'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  if('expectedCriteria'in task)expect(p.criteria).toHaveLength(task.expectedCriteria as number)
  if('expectedDescriptionOccurrences'in task)for(const [text,count]of Object.entries(task.expectedDescriptionOccurrences as Record<string,number>))expect(p.criteria.map(r=>r.description).join(' ').split(text).length-1).toBe(count)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-ct-6-')||r.templateId.startsWith('delivery-format'))).toBe(true)
  expect(p.activityType).toBe(task.activityType)
  expect(p.instrumentType).toBe(instrumentType)
  if('forbidDelivery'in task&&task.forbidDelivery)expect(p.criteria.some(r=>r.templateId.startsWith('delivery-format'))).toBe(false)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  for(const key of task.requiredEvidence)expect(p.criteria.some(r=>r.templateId.endsWith('-'+key))).toBe(true)
  for(const key of task.forbiddenEvidence)expect(p.criteria.some(r=>r.templateId.endsWith('-'+key))).toBe(false)
  if('requiredTopic'in task)expect(p.criteria.every(r=>r.templateId.startsWith('opt-ct-6-'+task.requiredTopic+'-'))).toBe(true)
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  if('requiredText'in task)for(const text of task.requiredText as string[])expect(full.toLowerCase()).toContain(text.toLowerCase())
  if('forbiddenText'in task)for(const text of task.forbiddenText as string[])expect(full.toLowerCase()).not.toContain(text.toLowerCase())
  expect(full).not.toMatch(/préstamos|interés compuesto|conecta el circuito a la red doméstica|publica realmente en la tienda digital/i)
 })
 for(const [name,patch]of Object.entries({primary:{level:'PRIMARY' as const},wrongGrade:{grade:5},wrongCycle:{cycle:1},common:{subjectCode:'NAT-BIO',optativeExitName:null},wrongExit:{optativeExitName:'Matemática y Tecnología'},arts:{modalityCode:'arts'},technical:{modalityCode:'technical_professional'},missingModality:{modalityCode:undefined}}))it('guard/'+name,()=>{
  const p=recommend({activityTitle:'Actividad',description:'Simula el movimiento parabólico con los parámetros proporcionados.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},{...context,...patch},null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.startsWith('opt-ct-6-'))).toBe(false)
 })
})
