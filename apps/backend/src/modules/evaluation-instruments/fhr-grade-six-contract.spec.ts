import {describe,expect,it} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/fhr-grade-six-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'FHR',subjectName:'Formación Integral Humana y Religiosa',modalityCode:null,optativeExitName:null}
describe('FHR sexto: interpretación y productos observables, sin evaluar fe privada',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const p=recommend({activityTitle:'Título antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.activityType).toBe(task.activityType)
   if(task.purpose==='PLAN')expect(p.criteria.every(row=>/planifica|plan |previst|propuest/i.test(row.description))).toBe(true)
   if('evidenceIds'in task)for(const id of task.evidenceIds!)expect(p.criteria.some(row=>row.templateId.endsWith('-'+id))).toBe(true)
   if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount!)
   expect(p.criteria.every(row=>task.topicIds.some(topic=>row.templateId.startsWith('fhr-6-'+topic+'-'+task.purpose.toLowerCase()+'-')))).toBe(true)
   for(const topic of task.topicIds)expect(p.criteria.some(row=>row.templateId.startsWith(`fhr-6-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo/i)
   if('required'in task)expect(p.criteria.map(row=>row.description).join(' ')).toMatch(new RegExp(task.required!,'i'))
   if('forbidden'in task)expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!,'i'))
   if('narrowedEvidence'in task&&task.narrowedEvidence&&'forbidden'in task)for(const row of p.criteria)for(const text of [row.title,row.description,...(row.progressionLevels??[]),...row.descriptors.map(d=>d.text)])expect(text).not.toMatch(new RegExp(task.forbidden!,'i'))
   expect(p.criteria.reduce((n,row)=>n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})

import {commonFhrModules} from '@aula/shared'
describe('FHR sexto: breves y acciones independientes',()=>{
 for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it('reportaje sin requisito extra de veracidad/'+instrumentType,()=>{
  const p=recommend({activityTitle:'Actividad',description:'Presenta el reportaje dado sobre composición, contexto y características de los evangelios según las fuentes proporcionadas. No se pide elaborar otro reportaje ni aceptar afirmaciones religiosas.',maxScore:17.35,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  for(const row of p.criteria)for(const text of [row.title,row.description,...row.progressionLevels!,...row.descriptors.map(d=>d.text)])expect(text).not.toMatch(/veracidad/i)
 })
 for(const topic of commonFhrModules.find(m=>m.grade===6)?.topics??[])it('breve/'+topic.id,()=>{
  const p=recommend({activityTitle:'Título antiguo sobre células',description:'Explica '+topic.label+'.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(new RegExp('^fhr-6-'+topic.id+'-analysis-'))
 })
 it('separa debate político y proclama solicitada',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Debate las perspectivas sobre acción política y clientelismo dominicano y su impacto social según los documentos proporcionados. Luego elabora una proclama sobre los criterios éticos para la política dominicana según los referentes proporcionados.',maxScore:17.35,preferredInstrumentType:'lista-ponderada',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(2);expect(p.criteria[0].templateId).toMatch(/^fhr-6-politics-clientelism-debate-/);expect(p.criteria[1].templateId).toMatch(/^fhr-6-political-ethics-proclamation-production-/)
 })
 it('un recurso no añade una acción de proyecto de vida',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Elabora un reportaje sobre composición, contexto histórico, características y afirmaciones de veracidad de los evangelios según las fuentes proporcionadas.\nRecursos: proyecto de vida con actitudes, capacidades y preferencias de un caso educativo.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^fhr-6-gospel-report-production-/)
 })
})
