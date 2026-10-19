import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hlm-len-four-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('Optativa HLM: Apreciación y Producción Literarias de cuarto',()=>{
 it('identificar dos figuras permite cotejar cada reconocimiento sin una explicación no pedida',()=>{
  const task=contracts.cases.find(c=>c.id==='poetry-figures-only')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.instrumentType).toBe('lista-cotejo')
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/explica|función|funcion/)
  expect(p.criteria.some(r=>r.description.includes('metáfora'))).toBe(true)
  expect(p.criteria.some(r=>r.description.includes('comparación'))).toBe(true)
 })
 it('al escuchar conserva la intención y el vocabulario pedidos como evidencias independientes',()=>{
  const task=contracts.cases.find(c=>c.id==='poetry-listening')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>/meaning$/.test(r.templateId))).toBe(true)
  expect(p.criteria.some(r=>/procedure-vocabulary$/.test(r.templateId))).toBe(true)
 })
 for(const description of ['Escribe un poema romántico sobre la situación dada.','Narra oralmente una novela breve de aventuras según la situación ficticia.'])it('los niveles de creación evalúan el producto sin pedir explicaciones adicionales/'+description,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).not.toHaveLength(0)
  expect(p.criteria.map(r=>r.progressionLevels?.[2]).join(' ')).not.toMatch(/no explica/)
 })
 it('un gerundio dependiente de narrar no añade un análisis escrito independiente',()=>{
  const task=contracts.cases.find(c=>c.id==='novel-oral-narration')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.includes('-analysis-'))).toBe(false)
 })
 it('distinguir quién habla no exige analizar rasgos y motivaciones de los personajes',()=>{
  const task=contracts.cases.find(c=>c.id==='novel-listening')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.endsWith('-narrator'))).toBe(true)
  expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/rasgos|motivaciones/)
 })
 it('corregir solo ortografía no exige revisar contenido ni organización',()=>{
  const task=contracts.cases.find(c=>c.id==='poetry-revision-no-publication')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/ortogr[aá]f/)
  expect(p.criteria[0].progressionLevels?.join(' ')).not.toMatch(/contenido|organizaci/)
 })
 it('comunicar la intención al recitar no añade una explicación analítica',()=>{
  const task=contracts.cases.find(c=>c.id==='poetry-recitation')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId.endsWith('-meaning'))).toBe(false)
  expect(p.criteria.some(r=>r.templateId.endsWith('-recitation-expression'))).toBe(true)
 })
 it('la escala gradúa evidencia narrativa y no frecuencia de conducta',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza únicamente el narrador y su frecuencia de aparición en el fragmento de novela de viajes y aventuras proporcionado.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.levels[0].label).toBe('Completo')
  expect(p.criteria.every(r=>r.descriptors.some(d=>/narrador|narrativ|perspectiva/.test(d.text)))).toBe(true)
 })
 for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it('conserva análisis y escritura independientes/'+instrumentType,()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza el poema romántico proporcionado. Luego escribe otro poema romántico según la situación dada. No se pide recitar ni publicar.',maxScore:17.35,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>/Explica el sentido/.test(r.progressionLevels?.[0]??''))).toBe(true)
  expect(p.criteria.some(r=>/Desarrolla el tema/.test(r.progressionLevels?.[0]??''))).toBe(true)
 })
 for(const task of contracts.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(task.id+'/'+instrumentType+'/'+maxScore,()=>{
  const p=recommend({activityTitle:'Experimento antiguo sobre células',description:task.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(task.activityType)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-len-4-'))).toBe(true)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[]),...r.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(full).not.toMatch(/células|Experimento antiguo/)
  if('required'in task)expect(full).toMatch(new RegExp(task.required!,'i'))
  if('forbidden'in task)expect(full).not.toMatch(new RegExp(task.forbidden!,'i'))
  if('onlyEvidence'in task)expect(p.criteria.every(r=>r.templateId.includes(task.onlyEvidence!))).toBe(true)
 })
})
