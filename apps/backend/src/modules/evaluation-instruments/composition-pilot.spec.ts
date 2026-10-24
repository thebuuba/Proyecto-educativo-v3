import {describe,it,expect} from 'vitest'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {extractPilotContract,composePilotInstrument} from '../../../../../packages/shared/src/instrument-composition-pilot'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/composition-pilot/bank.json'),'utf8'))
const context=(subjectCode:string)=>({level:'SECONDARY' as const,grade:1,cycle:1,subjectCode,subjectName:subjectCode,modalityCode:null,optativeExitName:null})
const task=(id:string)=>bank.cases.find((c:any)=>c.id===id)
const proposal=(id:string,instrumentType:any='rubrica',maxScore=20)=>{const c=task(id);return composePilotInstrument({description:c.description,context:context(c.subjectCode),instrumentType,maxScore,participationMode:'INDIVIDUAL'})!}
describe('Piloto: requisitos trazables reconciliados antes del formato',()=>{
 it.each(bank.cases.map((c:any)=>[c.id,c]))('%s: origen literal, enlaces concretos y cobertura detectada',(_,c:any)=>{
  const p=proposal(c.id),trace=p.internalTrace.composition!
  expect(trace.version).toBe('composition-pilot-v1')
  expect(trace.uncovered).toEqual([])
  for(const r of trace.contract.requirements){expect(c.description.slice(r.origin.start,r.origin.end)).toBe(r.origin.text);expect(r.origin.text.length).toBeGreaterThan(0)}
  for(const link of trace.links)expect(link.requirementIds.length+link.dimensionIds.length).toBeGreaterThan(0)
 })
 it('identifica el contenido sin activar por título ni invadir otros grados o materias',()=>{
  expect(extractPilotContract('Realiza una entrevista.',context('LEN'))).toBeNull()
  expect(extractPilotContract(task('LEN02').description,{...context('LEN'),grade:2})).toBeNull()
  expect(extractPilotContract(task('LEN02').description,context('ING'))).toBeNull()
  expect(extractPilotContract('Analiza una noticia proporcionada.',context('LEN'))).toBeNull()
  expect(extractPilotContract('Lee una noticia; no redactes una noticia nueva.',context('LEN'))).toBeNull()
  expect(extractPilotContract('Redactarán una noticia sin publicar. Revisarán el borrador con sus compañeros.',context('LEN'))).toBeNull()
  expect(extractPilotContract('Elige entre un afiche o una exposición de todos los planetas del sistema solar.',context('NAT'))).toBeNull()
 })
 it('normaliza el código real NAT-TU de primero, sin aceptar códigos de otros componentes',()=>{
  const c=task('B-NAT1-solar-exacta'),input={description:c.description,instrumentType:'rubrica' as const,maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(composePilotInstrument({...input,context:context('NAT-TU')})).toEqual(composePilotInstrument({...input,context:context('NAT')}))
  expect(extractPilotContract(c.description,context('NAT-VIDA'))).toBeNull()
 })
 it('noticia: conserva requisitos previos sin convertir revisión en dos entregas',()=>{
  for(const id of ['LEN02','NEW-A2']){
   const p=proposal(id),text=JSON.stringify(p.criteria)
   for(const required of ['news-essential','news-structure','news-sequence','news-language','news-revision'])expect(p.criteria.some((c:any)=>c.templateId===required)).toBe(true)
   expect(text).not.toMatch(/borrador|versión inicial|cambios realizados/)
  }
  const format=proposal('NEW-A2').criteria.find((c:any)=>c.templateId==='delivery-format')?.description??''
  for(const detail of ['Arial','12','1.5','sangría','azul'])expect(format).toContain(detail)
 })
 it('contenido, oralidad y duración son evidencias distintas; duración exacta, máxima y aproximada no se igualan',()=>{
  for(const [id,mode] of [['B-NAT1-solar-exacta','EXACT'],['B-NAT1-solar-maxima','MAX'],['NEW-B2','APPROX']]){
   const p=proposal(id),t=p.internalTrace.composition!
   expect(t.contract.requirements.find((r:any)=>r.key==='duration')?.mode).toBe(mode)
   expect(p.criteria.some((r:any)=>r.templateId==='pilot-oral-communication')).toBe(true)
   expect(p.criteria.some((r:any)=>r.templateId==='pilot-duration')).toBe(false)
   expect(p.criteria.find((r:any)=>r.templateId==='pilot-oral-communication')?.description).toMatch(/minutos/)
  }
  expect(JSON.stringify(proposal('NEW-B2').criteria)).not.toMatch(/±|entre [0-9]|exactamente/)
  expect(proposal('NEW-B1').criteria.some((r:any)=>r.templateId==='pilot-support')).toBe(false)
 })
 it('evalúa realmente tabla, barras, medidas y conclusión sin recolectar otros datos',()=>{
  const p=proposal('MAT03')
  for(const id of ['pilot-frequency-table','pilot-bar-chart','pilot-mean','pilot-median','pilot-data-conclusion'])expect(p.criteria.some((c:any)=>c.templateId===id)).toBe(true)
  expect(JSON.stringify(p.criteria)).not.toMatch(/encuesta|investiga|fuentes|unidades/)
  expect(proposal('NEW-C2').criteria.some((c:any)=>c.templateId==='pilot-data-interpretation')).toBe(true)
 })
 it('mantiene OR como una decisión de evidencia; no dos criterios obligatorios',()=>{
  for(const id of ['MAT04','NEW-C1','NEW-C2','NEW-B2']){
   const p=proposal(id),trace=p.internalTrace.composition!,alternative=trace.contract.requirements.find((r:any)=>r.mode==='OR')
   expect(alternative?.alternatives).toHaveLength(2)
   expect(trace.links.filter((l:any)=>l.requirementIds.includes(alternative!.id))).toHaveLength(1)
   expect(JSON.stringify(p.criteria)).toMatch(/ o /)
  }
 })
 it('no oculta una acción no resuelta con una fila genérica',()=>{
  const p=composePilotInstrument({description:'Escribe una noticia sobre el recreo. Traduce el texto al alemán.',context:context('LEN'),instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'})!
  expect(p.internalTrace.composition!.uncovered.length).toBeGreaterThan(0)
  expect(JSON.stringify(p.criteria)).not.toMatch(/alemán|traduce/)
 })
 it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('%s: cuatro formatos, unidades exactas e identidades estables',format=>{
  for(const id of ['LEN02','B-NAT1-solar-exacta','MAT04'])for(const maxScore of [20,17.35]){
   const p=proposal(id,format,maxScore)
   expect(p.criteria.reduce((sum:any,c:any)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   expect(new Set(p.criteria.map((c:any)=>c.templateId)).size).toBe(p.criteria.length)
   expect(p.criteria.every((c:any)=>c.progressionLevels?.length===5)).toBe(true)
   expect(p.levels.length).toBe(format==='rubrica'||format==='escala'?4:0)
  }
 })
 it('conserva la ruta anterior para comparación interna y el catálogo histórico',()=>{
  const c=task('MAT04'),args=[{activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL' as const},context('MAT'),null,[],'UNMAPPED',null] as const
  const old=recommend(...args,evaluationCatalogForVersion('evaluation-2026.172')!)
  expect(old.internalTrace.composition).toBeUndefined()
  expect(recommend(...args).internalTrace.composition).toBeDefined()
 })
})
