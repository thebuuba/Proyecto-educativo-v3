import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hcs-len-four-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('Optativa HCS cuarto: novela autobiográfica y realismo mágico',()=>{
 it('escuchar como preparación para explicar solo estructura conserva ese foco',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='magic-listening')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/feature-novel-structure$/)
 })
 it('inferir vocabulario no añade una segunda explicación genérica de la función léxica',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='magic-inference')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/procedure-vocabulary$/)
 })
 it('escuchar para distinguir voces no exige explicar su función',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='auto-listening')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.instrumentType).toBe('lista-cotejo')
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/explica|función|rasgos/)
 })
 for(const id of ['auto-oral-plan','magic-oral-plan'])it('el plan conserva la intención expresamente solicitada/'+id,()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id===id)!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(r=>r.description).join(' ')).toMatch(/intención/)
 })
 it('revisar puntuación no exige corregir contenido u organización no pedidos',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='magic-revision')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria.flatMap(r=>[r.description,...r.progressionLevels??[]]).join(' ')).not.toMatch(/contenido|organización/)
 })
 it('el estilo del autor no añade una tarea independiente de identificar al autor',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='concept-26')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria.every(r=>r.templateId.endsWith('-feature-author-style'))).toBe(true)
 })
 it('distinguir voces no exige rasgos y acciones de personajes',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='concept-47')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/rasgos y acciones/)
 })
 it('inferir motivaciones no añade descripción de rasgos de los personajes',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id==='magic-causality')!.description,maxScore:20},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/rasgos y acciones/)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:('participationMode'in task?task.participationMode:'INDIVIDUAL') as 'INDIVIDUAL'|'GROUP'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hcs-len-4-'))).toBe(true)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/células|Experimento antiguo/)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
  if('onlyEvidence'in task)expect(p.criteria.every(r=>r.templateId.includes(task.onlyEvidence!))).toBe(true)
 })
})
