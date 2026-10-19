import {describe,expect,it} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/fhr-grade-one-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'FHR',subjectName:'Formación Integral Humana y Religiosa',modalityCode:null,optativeExitName:null}
describe('FHR primero: interpretación y productos observables, sin evaluar fe privada',()=>{
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${instrumentType}/${maxScore}`,()=>{
   const p=recommend({activityTitle:'Título antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.activityType).toBe(task.activityType)
   if(task.purpose==='PLAN')expect(p.criteria.every(row=>/planifica|plan |previst|propuest/i.test(row.description))).toBe(true)
   if('evidenceIds'in task)for(const id of task.evidenceIds!)expect(p.criteria.some(row=>row.templateId.endsWith('-'+id))).toBe(true)
   if('criterionCount'in task)expect(p.criteria).toHaveLength(task.criterionCount!)
   expect(p.criteria.every(row=>task.topicIds.some(topic=>row.templateId.startsWith('fhr-1-'+topic+'-'+task.purpose.toLowerCase()+'-')))).toBe(true)
   for(const topic of task.topicIds)expect(p.criteria.some(row=>row.templateId.startsWith(`fhr-1-${topic}-${task.purpose.toLowerCase()}-`))).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo/i)
   if('required'in task)expect(p.criteria.map(row=>row.description).join(' ')).toMatch(new RegExp(task.required!,'i'))
   if('forbidden'in task)expect(p.criteria.map(row=>row.description).join(' ')).not.toMatch(new RegExp(task.forbidden!,'i'))
   if('narrowedEvidence'in task&&task.narrowedEvidence&&'forbidden'in task)for(const row of p.criteria)for(const text of [row.title,row.description,...(row.progressionLevels??[]),...row.descriptors.map(d=>d.text)])expect(text).not.toMatch(new RegExp(task.forbidden!,'i'))
   expect(p.criteria.reduce((n,row)=>n+row.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})

import {commonFhrModules,resolveCommonFhrTask} from '@aula/shared'

describe('FHR primero: consignas breves y acciones independientes',()=>{
 for(const topic of commonFhrModules.find(m=>m.grade===1)?.topics??[])it('breve/'+topic.id,()=>{
  const p=recommend({activityTitle:'Título antiguo sobre células',description:'Explica '+topic.label+'.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(new RegExp('^fhr-1-'+topic.id+'-analysis-'))
  expect(JSON.stringify(p.criteria)).not.toMatch(/células|titulo antiguo|el la opción|del la opción/i)
  if(topic.id==='life-values')expect(JSON.stringify(p.criteria)).not.toMatch(/semejanzas|diferencias/i)
  if(topic.id==='adolescent-composition')expect(p.criteria[0].description).toMatch(/composición.*amistad.*familia/i)
  if(topic.id==='jesus-events')expect(p.criteria[0].description).toMatch(/Jesús en el referente expresamente elegido/i)
  if(topic.id==='adolescent-changes')expect(p.criteria[0].description).toMatch(/los cambios expresamente trabajados durante la adolescencia/i)
 })
 it('separa analizar derechos de producir un mural sin añadir cuidado genérico',()=>{
  const p=recommend({activityTitle:'Una actividad anterior',description:'Analiza la dignidad y los derechos humanos según los textos proporcionados. Luego elabora el mural informativo sobre beneficios del cuidado del entorno natural usando los referentes dados.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS');expect(p.criteria).toHaveLength(2)
  expect(p.criteria[0].templateId).toMatch(/^fhr-1-human-rights-analysis-/)
  expect(p.criteria[1].templateId).toMatch(/^fhr-1-environment-mural-production-/)
 })
 it('un recurso no añade otro tema o producto',()=>{
  const p=recommend({activityTitle:'Título antiguo sobre poesía',description:'Analiza la dignidad y los derechos humanos de los textos proporcionados. Recursos: mapa conceptual de religiones y álbum de primeras comunidades cristianas.',maxScore:20,preferredInstrumentType:'lista-cotejo',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^fhr-1-human-rights-analysis-/)
 })
 it('conserva sin acceso como contenido del análisis',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza las personas sin acceso a tecnología del caso proporcionado relacionando sus condiciones y consecuencias documentadas.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^fhr-1-technology-access-analysis-/)
 })
 it('investigar y presentar la misma fuente son acciones distintas',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Investiga las normas y leyes dominicanas de cuidado del entorno natural en los textos proporcionados. Luego presenta las normas y leyes de esos textos explicando sus evidencias.',maxScore:17.35,preferredInstrumentType:'lista-ponderada',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria[0].templateId).toMatch(/^fhr-1-environment-laws-research-/)
  expect(p.criteria[1].templateId).toMatch(/^fhr-1-environment-laws-presentation-/)
 })
 it('observar acciones de conservación no exige dramatizarlas',()=>{
  const task=resolveCommonFhrTask('Actividad',contracts.cases.find(c=>c.id==='environment-execution')!.description,context)!
  expect(task.technique).toBe('observacion-sistematica')
 })
 it('el álbum de comunidades usa la técnica de portafolio',()=>{
  const task=resolveCommonFhrTask('Actividad',contracts.cases.find(c=>c.id==='community-values')!.description,context)!
  expect(task.activityType).toBe('PORTFOLIO');expect(task.technique).toBe('portafolio')
 })
 it('la frecuencia expresa las reglas observadas sin repetir cumplimiento',()=>{
  const task=contracts.cases.find(c=>c.id==='dialogue-frequency')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toMatch(/^Cumple las reglas de turnos y de referencia respetuosa/i)
  expect(p.criteria[0].progressionLevels?.join(' ')).not.toMatch(/cumple el cumplimiento/i)
 })
 it.each(['religions-elements','jesus-values','family-values'])('la progresión de %s penaliza atribuciones sin sustento, no desacuerdo',id=>{
  const task=contracts.cases.find(c=>c.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  for(const row of p.criteria){
   expect(row.progressionLevels?.[3]).toMatch(/atribuciones no sustentadas/i)
   expect(row.progressionLevels?.[3]).not.toMatch(/contradicen|profesa|obedece|adhesión/i)
  }
 })
})
