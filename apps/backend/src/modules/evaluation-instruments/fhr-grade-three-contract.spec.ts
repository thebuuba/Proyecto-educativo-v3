import {describe,expect,it} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/fhr-grade-three-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'FHR',subjectName:'Formación Integral Humana y Religiosa',modalityCode:null,optativeExitName:null}
describe('FHR tercero: interpretación y productos observables, sin evaluar fe privada',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const p=recommend({activityTitle:'Título antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.activityType).toBe(task.activityType)
   if(task.purpose==='PLAN')expect(p.criteria.every(row=>/planifica|plan |previst|propuest/i.test(row.description))).toBe(true)
   if('evidenceIds'in task)for(const id of task.evidenceIds!)expect(p.criteria.some(row=>row.templateId.endsWith('-'+id))).toBe(true)
   if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount!)
   expect(p.criteria.every(row=>task.topicIds.some(topic=>row.templateId.startsWith('fhr-3-'+topic+'-'+task.purpose.toLowerCase()+'-')))).toBe(true)
   for(const topic of task.topicIds)expect(p.criteria.some(row=>row.templateId.startsWith(`fhr-3-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo/i)
   if('required'in task)expect(p.criteria.map(row=>row.description).join(' ')).toMatch(new RegExp(task.required!,'i'))
   if('forbidden'in task)expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!,'i'))
   if('narrowedEvidence'in task&&task.narrowedEvidence&&'forbidden'in task)for(const row of p.criteria)for(const text of [row.title,row.description,...(row.progressionLevels??[]),...row.descriptors.map(d=>d.text)])expect(text).not.toMatch(new RegExp(task.forbidden!,'i'))
   expect(p.criteria.reduce((n,row)=>n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})

import {commonFhrModules} from '@aula/shared'
it('conserva las alternativas expresamente pedidas en el plan',()=>{
 const p=recommend({activityTitle:'Actividad',description:'Planifica acciones de defensa y conservación del medio ambiente con las alternativas proporcionadas.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
 expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/Planifica.*alternativas proporcionadas/)
})
describe('FHR tercero: consignas breves y acciones independientes',()=>{
 for(const topic of commonFhrModules.find(m=>m.grade===3)?.topics??[])it('breve/'+topic.id,()=>{
  const p=recommend({activityTitle:'Título antiguo sobre células',description:'Explica '+topic.label+'.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(new RegExp('^fhr-3-'+topic.id+'-analysis-'))
 })
 it('describir dignidad y elaborar normas son acciones independientes',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza la dignidad humana y defensa de la vida según los textos dados. Luego elabora normas de convivencia familiar del caso proporcionado.',maxScore:17.35,preferredInstrumentType:'lista-ponderada',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(2);expect(p.criteria[0].templateId).toMatch(/^fhr-3-rights-texts-analysis-/);expect(p.criteria[1].templateId).toMatch(/^fhr-3-family-norms-production-/)
 })
 it('un mural de recurso no crea una segunda acción',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza el sentido del trabajo en la realización de la persona mediante los textos dados.\nRecursos: mural de respeto e irrespeto a la vida.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^fhr-3-work-sense-/)
 })
})

it('reconoce ambos libros en Antiguo y Nuevo Testamento sin omitir el primero',()=>{
 const p=recommend({activityTitle:'Actividad',description:'Indaga los valores del cuidado de la vida creada según el Antiguo y Nuevo Testamento proporcionados.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
 expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/Nuevo Testamento/);expect(p.criteria[0].description).toMatch(/Antiguo Testamento/)
})
