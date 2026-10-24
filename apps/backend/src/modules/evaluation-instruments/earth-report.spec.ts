import {describe,it,expect} from 'vitest'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'
import {extractTaskRequirements,resolveCommonScienceTask} from '@aula/shared'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/earth-report/cases.json'),'utf8'))
const task=(id:string)=>bank.cases.find((c:any)=>c.id===id)
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const proposal=(id:string,format:typeof formats[number]='rubrica')=>{const c=task(id);return recommend({activityTitle:c.title,description:c.description,maxScore:17.35,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},bank.context,null,[],'UNMAPPED',null)}
const text=(p:ReturnType<typeof proposal>)=>p.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join('\n')
describe('Informe real de la Tierra: expectativas congeladas antes de corregir',()=>{
 it('no atribuye el generador nuevo a un catálogo antiguo que no activa este proveedor',()=>{
  const c=task('earth'),p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL'},bank.context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.86')!)
  expect(p.criteria.some(c=>c.templateId.includes('-descriptive-'))).toBe(false)
  expect(p.internalTrace.generatorVersion).toBeUndefined()
 })
 it('conserva cuerpo/título sin conflictos ficticios ni exclusión de archivo',()=>{
  const r=extractTaskRequirements(task('earth').description)
  expect(r.issues).toEqual([])
  expect(r.conditions).toEqual(expect.arrayContaining([
   expect.objectContaining({property:'font',values:['Calibri'],scope:'cuerpo'}),
   expect.objectContaining({property:'font-size',values:['13'],scope:'cuerpo'}),
   expect.objectContaining({property:'line-spacing',values:['1,5'],scope:'cuerpo'}),
   expect.objectContaining({property:'alignment',values:['justificado'],scope:'cuerpo'}),
   expect.objectContaining({property:'font-size',values:['18'],scope:'título'}),
   expect.objectContaining({property:'alignment',values:['centrado'],scope:'título'}),
   expect.objectContaining({property:'emphasis',values:['negrita'],scope:'título'}),
   expect.objectContaining({property:'extent',values:['dos','tres'],scope:'documento',exclusion:'sin contar la portada'}),
   expect.objectContaining({property:'drawing',scope:'desarrollo'}),
  ]))
  expect(r.conditions.find(c=>c.property==='file-format')?.exclusion).toBeUndefined()
  expect(r.conditions.filter(c=>c.property==='section').some(c=>c.values.includes('portada'))).toBe(false)
  for(const c of r.conditions)expect(task('earth').description.slice(c.origin.start,c.origin.end)).toBe(c.origin.text)
 })
 it.each(formats)('expresa todos los requisitos evaluables en %s sin convertirlos en investigación',format=>{
  const p=proposal('earth',format),s=text(p)
  expect(p.instrumentType).toBe(format)
  expect(p.internalTrace.generatorVersion).toBe('science-descriptive-report-v1')
  expect(p.activityType).toBe('REPORT')
  expect(s).toMatch(/corteza/);expect(s).toMatch(/manto/);expect(s).toMatch(/núcleo/)
  expect(s).toMatch(/diferencias/);expect(s).toMatch(/dibujo/);expect(s).toMatch(/nombres|rótulos/)
  expect(s).toMatch(/ortograf/)
  expect(s).not.toMatch(/pregunta investigada|procedimiento.*investigaci[oó]n|resultados obtenidos|hip[oó]tesis|materiales|borrador/)
  const formal=p.criteria.find(c=>c.templateId.startsWith('delivery-format'))!
  expect(formal).toBeDefined()
  for(const value of ['Calibri','13','1,5','justificado','18','centrado','negrita','cuerpo','título'])expect(formal.description).toContain(value)
  const org=p.criteria.find(c=>c.templateId.includes('organization'))!
  expect(org.description).toContain('tres párrafos en desarrollo')
  expect(org.description).toMatch(/introducción/);expect(org.description).toMatch(/conclusión/)
  expect(p.criteria.find(c=>c.description.includes('dibujo'))?.description).toContain('desarrollo')
  expect(s).not.toContain('archivo en Word o PDF sin contar')
  expect(s).toContain('entre dos y tres páginas sin contar la portada')
  expect(p.totalScoreUnits).toBe(1735)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(1735)
  const ids=p.criteria.flatMap(c=>c.taskConditionIds??[]);expect(new Set(ids).size).toBe(ids.length)
  const scientific=p.criteria.filter(c=>c.templateId.includes('description')||c.templateId.includes('differences')||c.templateId.includes('drawing'))
  expect(scientific.reduce((s,c)=>s+c.maxScoreUnits,0)).toBeGreaterThan(1735/2)
 })
 it('no añade presentación o entrega al eliminar esas instrucciones',()=>{
  const p=proposal('earth-no-format');expect(text(p)).toMatch(/corteza.*manto.*núcleo/)
  expect(text(p)).not.toMatch(/Calibri|interlineado|archivo en|Word|PDF|investigaci[oó]n/)
 })
 it('conserva otra fuente y otros valores por ámbito sin nuevas reglas',()=>{
  const p=proposal('earth-variant'),s=text(p)
  for(const v of ['Aptos','11,5','21','cursiva','izquierda','cuatro párrafos en desarrollo','entre tres y cinco páginas sin contar la portada'])expect(s).toContain(v)
  expect(p.internalTrace.taskRequirements?.issues).toEqual([])
 })
 it('aplica el producto descriptivo a otro tema científico ya existente',()=>{
  const s=text(proposal('atmosphere-report'))
  expect(s).toMatch(/atmósfera/);expect(s).toMatch(/diferencias/);expect(s).toMatch(/dibujo/);expect(s).toMatch(/rótulos|nombres/);expect(s).toMatch(/ortograf/)
  expect(s).not.toMatch(/procedimiento|investigaci[oó]n|hip[oó]tesis|resultados/)
 })
 it('mantiene procedimiento y resultados cuando sí se pide una práctica',()=>{
  const c=task('density-experiment'),p=proposal(c.id)
  expect(resolveCommonScienceTask(c.title,c.description,bank.context)?.activityType).toBe('LAB_PRACTICE')
  expect(text(p)).toMatch(/procedimiento/);expect(text(p)).toMatch(/observaciones/);expect(text(p)).toMatch(/resultado/)
 })
})
