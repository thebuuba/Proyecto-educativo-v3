import {describe,expect,it} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/fhr-grade-four-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'FHR',subjectName:'Formación Integral Humana y Religiosa',modalityCode:null,optativeExitName:null}
describe('FHR cuarto: interpretación y productos observables, sin evaluar fe privada',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const p=recommend({activityTitle:'Título antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.activityType).toBe(task.activityType)
   if(task.purpose==='PLAN')expect(p.criteria.every(row=>/planifica|plan |previst|propuest/i.test(row.description))).toBe(true)
   if('evidenceIds'in task)for(const id of task.evidenceIds!)expect(p.criteria.some(row=>row.templateId.endsWith('-'+id))).toBe(true)
   if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount!)
   expect(p.criteria.every(row=>task.topicIds.some(topic=>row.templateId.startsWith('fhr-4-'+topic+'-'+task.purpose.toLowerCase()+'-')))).toBe(true)
   for(const topic of task.topicIds)expect(p.criteria.some(row=>row.templateId.startsWith(`fhr-4-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo/i)
   if('required'in task)expect(p.criteria.map(row=>row.description).join(' ')).toMatch(new RegExp(task.required!,'i'))
   if('forbidden'in task)expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!,'i'))
   if('narrowedEvidence'in task&&task.narrowedEvidence&&'forbidden'in task)for(const row of p.criteria)for(const text of [row.title,row.description,...(row.progressionLevels??[]),...row.descriptors.map(d=>d.text)])expect(text).not.toMatch(new RegExp(task.forbidden!,'i'))
   expect(p.criteria.reduce((n,row)=>n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})

import {commonFhrModules} from '@aula/shared'
describe('FHR cuarto: conceptos breves y acciones independientes',()=>{
 for(const topic of commonFhrModules.find(m=>m.grade===4)?.topics??[])it('breve/'+topic.id,()=>{
  const p=recommend({activityTitle:'Título antiguo sobre células',description:'Explica '+topic.label+'.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(new RegExp('^fhr-4-'+topic.id+'-analysis-'))
 })
 it('analizar familia y elaborar campaña son acciones independientes',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza las situaciones de familias dominicanas descritas en las fuentes proporcionadas. Luego elabora el prototipo de campaña escrita para resolver los conflictos de los casos dados.',maxScore:17.35,preferredInstrumentType:'lista-ponderada',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(2);expect(p.criteria[0].templateId).toMatch(/^fhr-4-family-situations-analysis-/);expect(p.criteria[1].templateId).toMatch(/^fhr-4-conflict-campaign-production-/)
 })
 it('el proyecto de vida de un recurso no crea una segunda acción',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza las situaciones de familias dominicanas descritas en las fuentes proporcionadas.\nRecursos: proyecto de vida y campaña de valores familiares.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^fhr-4-family-situations-analysis-/)
 })
 it('conserva alternativas de plan únicamente cuando son expresas',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Planifica el proyecto de equilibrio del ecosistema para la situación de basura del caso proporcionado con las alternativas dadas.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/alternativas proporcionadas/)
 })
})
