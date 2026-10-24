import {describe,it,expect} from 'vitest'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {recommend} from './recommendation-engine'
import {extractTaskRequirements,resolveCommonScienceTask} from '@aula/shared'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/atmosphere-report/cases.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const proposal=(id:string,format:typeof formats[number]='rubrica',description?:string)=>{
 const c=bank.cases.find((c:any)=>c.id===id)
 return recommend({activityTitle:c.title,description:description??c.description,maxScore:17.35,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},bank.context,null,[],'UNMAPPED',null)
}
const text=(p:ReturnType<typeof proposal>)=>p.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join('\n')
describe('Transferencia del informe descriptivo: expectativas previas a la corrección',()=>{
 it.each(formats)('evalúa capas, comparación, esquema y formato completos en %s',format=>{
  const p=proposal('atmosphere',format),s=text(p)
  expect(p.internalTrace.generatorVersion).toBe('science-descriptive-report-v2')
  for(const value of bank.cases[0].expected)expect(s).toContain(value)
  for(const value of bank.cases[0].forbidden)expect(s).not.toContain(value)
  expect(s).toContain('dos párrafos en desarrollo')
  const compare=p.criteria.find(c=>c.templateId.includes('differences'))!
  expect(compare.description).toContain('ubicación');expect(compare.description).toContain('temperatura')
  const graphic=p.criteria.find(c=>c.templateId.includes('drawing'))!
  for(const v of ['esquema','nombres','orden','desarrollo'])expect(graphic.description).toContain(v)
  const formal=p.criteria.find(c=>c.templateId.startsWith('delivery-format'))!
  for(const v of ['Arial','14','1,5','justificado','20','centrado','negrita','cuerpo','título'])expect(formal.description).toContain(v)
  expect(s).toContain('sin exigir alcanzar el límite')
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
  const ids=p.criteria.flatMap(c=>c.taskConditionIds??[]);expect(new Set(ids).size).toBe(ids.length)
  expect(p.internalTrace.taskRequirements?.issues).toEqual([])
 })
 it.each(['atmosphere-no-format','atmosphere-brief'])('reconoce componentes en %s sin depender del título ni del formato',id=>{
  const p=proposal(id),s=text(p)
  for(const v of ['troposfera','estratosfera','mesosfera','ubicación','temperatura'])expect(s).toContain(v)
  expect(s).not.toMatch(/procedimiento|resultados|medici[oó]n|Arial|Word/)
 })
 it.each(bank.extents)('preserva $text desde el contrato hasta el instrumento',({text:extent,operator,values}:any)=>{
  const description=bank.cases[2].description+' Entreguen en Word o PDF. '+extent+', sin contar la portada.'
  const r=extractTaskRequirements(description),c=r.conditions.find(c=>c.property==='extent')!
  expect(c).toMatchObject({operator,values,exclusion:'sin contar la portada'})
  expect(description.slice(c.origin.start,c.origin.end)).toBe(c.origin.text)
  expect(r.conditions.some(c=>c.property==='section'&&c.values.includes('portada'))).toBe(false)
  const p=proposal('atmosphere-brief','rubrica',description),s=text(p)
  expect(p.internalTrace.taskRequirements?.conditions.find(c=>c.property==='extent')?.operator).toBe(operator)
  expect(s).toContain(operator==='MAX'?'máximo dos páginas':operator==='MIN'?'mínimo dos páginas':operator==='RANGE'?'entre dos y tres páginas':'exactamente dos páginas')
 })
 it('conserva Tierra y una práctica real sin cambiar sus consignas',()=>{
  expect(text(proposal('earth'))).toMatch(/corteza.*manto.*núcleo/)
  const c=bank.cases.find((c:any)=>c.id==='density-experiment')
  expect(resolveCommonScienceTask(c.title,c.description,bank.context)?.activityType).toBe('LAB_PRACTICE')
  expect(text(proposal(c.id))).toMatch(/procedimiento/);expect(text(proposal(c.id))).toMatch(/observaciones/)
 })
 it('no activa componentes atmosféricos fuera de su contexto ni por un título heredado',()=>{
  const c=bank.cases[2]
  expect(resolveCommonScienceTask(c.title,c.description,{...bank.context,gradeSequence:2,subjectCode:'NAT-VIDA'})).toBeNull()
  expect(resolveCommonScienceTask(bank.cases[0].title,'Redacten un informe sobre un tema libre.',bank.context)).toBeNull()
 })
 it('no confunde un esquema HTML con un dibujo científico',()=>{
  expect(extractTaskRequirements('Diseña un esquema HTML. Entrega el esquema en PDF.').conditions.some(c=>c.property==='drawing')).toBe(false)
 })
})
