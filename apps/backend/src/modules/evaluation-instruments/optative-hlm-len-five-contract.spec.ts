import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hlm-len-five-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
const proposal=(id:string,type:'rubrica'|'lista-cotejo'='rubrica')=>recommend({activityTitle:'Actividad',description:contracts.cases.find(c=>c.id===id)!.description,maxScore:17.35,preferredInstrumentType:type,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('HLM quinto: epopeya y novela policíaca',()=>{
 it('reconoce novela policial en singular dentro del mismo ámbito optativo',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza la novela policial proporcionada.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-5-novela-policiaca-'))).toBe(true)
 })
 it('comparar solo estructura no exige forma ni división',()=>{
  const p=proposal('epic-comparison')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].title).toBe('La estructura')
  expect(p.criteria[0].description).not.toMatch(/forma y|división/)
 })
 it('el plan conserva la alternativa de verso o prosa sin exigir el texto final',()=>{
  const p=proposal('epic-writing-plan')
  expect(p.criteria.map(r=>r.description).join(' ')).toMatch(/verso.*o.*prosa/)
  expect(p.criteria.every(r=>r.templateId.includes('procedure-outline'))).toBe(true)
 })
 it('analizar solo el protagonista no convierte sus valores en requisito',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza únicamente el protagonista de la epopeya proporcionada.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).not.toMatch(/valores/)
 })
 it('analizar únicamente seres fantásticos no exige otros hechos fantásticos',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza únicamente los seres fantásticos de la epopeya proporcionada.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].title).toBe('Los seres fantásticos')
 })
 it('inferir únicamente motivaciones no añade un estudio general de personajes',()=>{
  const p=proposal('epic-reading-motives')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toContain('feature-motivations')
 })
 it('reconocer dos figuras permite cotejar dos evidencias sin explicar su función',()=>{
  const p=proposal('epic-figures-only','lista-cotejo')
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/explica|función/)
 })
 it('una alternativa de reconocimiento no impone las dos secuencias',()=>{
  const p=proposal('novel-sequences-alternative','lista-cotejo')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/narrativa.*o.*argumentativa/)
 })
 it('el narrador omnisciente se evalúa una sola vez sin otro criterio genérico de narrador',()=>{
  const p=proposal('epic-omniscient-only')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/omnisciente/)
 })
 it('analizar pistas no obliga a crear hipótesis ni otra novela',()=>{
  const p=proposal('novel-clues-only')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/pistas.*investigador|investigador.*pistas/)
  expect(p.criteria[0].description).not.toMatch(/escribe|elabora.*hipótesis/)
 })
 it('el análisis y la creación independientes conservan sus evidencias propias',()=>{
  const p=proposal('novel-independent-products')
  expect(p.criteria.some(r=>r.templateId.includes('-analysis-'))).toBe(true)
  expect(p.criteria.some(r=>r.templateId.includes('-written_production-'))).toBe(true)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.instrumentType).toBe(instrumentType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-5-'))).toBe(true)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/células|Experimento antiguo/)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
 })
})
