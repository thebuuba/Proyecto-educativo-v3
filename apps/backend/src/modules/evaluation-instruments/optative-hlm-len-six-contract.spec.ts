import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hlm-len-six-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('HLM sexto: textos periodísticos y publicitarios',()=>{
 it('una consigna breve de planificación conserva la relación propia del editorial',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Planifica el editorial solicitado.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/tesis.*argumentos/)
  expect(p.criteria[0].description).not.toMatch(/personajes|sucesos/)
 })
 it('la presentación oral conserva el registro expresamente acordado',()=>{
  const task=contracts.cases.find(c=>c.id==='ad-oral')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.endsWith('feature-register'))).toBe(true)
 })
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it('los cinco canales de recursos pedidos conservan evidencias independientes/'+format,()=>{
  const task=contracts.cases.find(c=>c.id==='concept-430f12ae')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:17.35,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(5)
  expect(new Set(p.criteria.map(r=>r.templateId)).size).toBe(5)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(1735)
 })
 for(const id of ['procedure-0a4b5984','procedure-533ceac7'])it('las correcciones ortográficas no exigen cambiar contenido u organización/'+id,()=>{
  const task=contracts.cases.find(c=>c.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/ortogr/)
  expect(p.criteria[0].progressionLevels?.join(' ')).not.toMatch(/contenido|organizaci/)
 })
 for(const id of ['procedure-80ade1e2','procedure-409d3bae','procedure-2c1afdd7'])it('anticipar mediante título o imagen no añade un análisis independiente de esos apoyos/'+id,()=>{
  const task=contracts.cases.find(c=>c.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/procedure-prediction$/)
 })
 it('prototipo de anuncio no se interpreta como una petición de clasificar tipos de anuncio',()=>{
  const task=contracts.cases.find(c=>c.id==='ad-design')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.endsWith('feature-ad-types'))).toBe(false)
 })
 it('evaluar presencia o ausencia de manipulación permite justificar una ausencia sin inventar ejemplos',()=>{
  const task=contracts.cases.find(c=>c.id==='propaganda-critique')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const full=p.criteria.flatMap(r=>[r.description,...(r.progressionLevels??[])]).join(' ')
  expect(full).toMatch(/ausencia/)
  expect(full).not.toMatch(/explica.*su función|No localiza ejemplos pertinentes/)
 })
 for(const id of ['editorial-oral','ad-oral'])it('presentar el texto preparado evalúa producción oral y no lectura analítica/'+id,()=>{
  const task=contracts.cases.find(c=>c.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const descriptors=p.criteria.flatMap(r=>r.progressionLevels?.slice(0,1)??[]).join(' ')
  expect(descriptors).not.toMatch(/Identifica .* en el texto|Reconoce la tesis y la postura/)
  const dimensions=p.criteria.map(r=>r.templateId.replace('-feature-','-'))
  expect(new Set(dimensions).size).toBe(dimensions.length)
 })
 it('subrayar tesis y argumentos sugiere cotejo sin imponer explicaciones',()=>{
  const task=contracts.cases.find(c=>c.id==='column-underlining')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.instrumentType).toBe('lista-cotejo')
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/explica|función/)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const mode='participationMode'in task&&task.participationMode==='GROUP'?'GROUP':'INDIVIDUAL'
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:mode},context,null,[],'UNMAPPED',null)
  expect(p.participationMode).toBe(mode)
  expect(p.activityType).toBe(task.activityType);expect(p.instrumentType).toBe(instrumentType)
  expect(p.criteria.length).toBeGreaterThan(0);expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-6-'))).toBe(true)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/Experimento antiguo|células/)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
 })
})
