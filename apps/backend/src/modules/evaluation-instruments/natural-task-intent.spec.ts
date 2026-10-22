import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,expect,it} from 'vitest'
import {recommend} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'

type Task={id:string;subjectCode:string;subjectName:string;grade:number;modalityCode?:string;title:string;description:string}
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/realistic-audit-bank-v1.json'),'utf8')) as {cases:Task[]}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
function prepare(id:string,format:typeof formats[number],description?:string){
 const task=bank.cases.find(task=>task.id===id)!
 const context:AcademicContext={level:'SECONDARY',cycle:task.grade<=3?1:2,grade:task.grade,subjectCode:task.subjectCode,subjectName:task.subjectName,modalityCode:task.modalityCode??null,optativeExitName:null}
 return recommend({activityTitle:task.title,description:description??task.description,preferredInstrumentType:format,maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
}
describe('Intención natural: producción frente a objeto estudiado',()=>{
 it.each(formats)('Hagan un informe sigue siendo producción después de retirar requisitos: %s',format=>{
  const p=prepare('B-LEN1-informe-retirado',format)
  expect(p.activityType).toBe('READING_REPORT_WRITING')
  expect(p.totalScoreUnits).toBe(1735)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
  expect(JSON.stringify(p.criteria)).not.toMatch(/Arial|interlineado 1[.,]5|dos fragmentos|2 páginas/)
 })
 it.each(['Haga','Hagamos','Haced'])('reconoce la forma habitual %s sin un título activador',verb=>{
  expect(prepare('B-LEN1-informe-breve','rubrica',`${verb} un informe de lectura del texto trabajado.`).activityType).toBe('READING_REPORT_WRITING')
 })
 it('analizar un informe existente no exige producir otro',()=>{
  expect(prepare('B-LEN1-informe-retirado','rubrica','Analicen la idea central del informe de lectura proporcionado.').activityType).toBe('READING_REPORT_ANALYSIS')
 })
 it.each(formats)('la enumeración natural de grupos y períodos usa el contenido de quinto: %s',format=>{
  const p=prepare('B-NAT5-tabla-reconstruida',format)
  expect(p.activityType).toBe('ORAL_PRESENTATION')
  expect(p.criteria.some(c=>c.templateId.startsWith('nat-5-periodic-position-'))).toBe(true)
  expect(p.criteria.every(c=>c.sourceType==='CONTEXTUALIZED')).toBe(true)
 })
 it('el tema del título no domina una descripción nueva',()=>{
  const p=prepare('B-NAT5-tabla-reconstruida','rubrica','Comparen las propiedades de los gases ideales y reales.')
  expect(p.criteria.some(c=>c.templateId.includes('periodic-position'))).toBe(false)
 })
 it.each(formats)('entregar un documento de Word activa el proveedor de Ofimática: %s',format=>{
  const p=prepare('B-MF0024-formato',format)
  expect(p.activityType).toBe('PROJECT')
  expect(p.criteria.some(c=>c.templateId.startsWith('technical-mf002-'))).toBe(true)
  expect(p.criteria.every(c=>c.sourceType==='CONTEXTUALIZED')).toBe(true)
 })
 it('examinar un documento Word no se convierte en creación por el nombre del recurso',()=>{
  const p=prepare('B-MF0024-formato','rubrica','Analicen el documento de Word proporcionado y expliquen su organización.')
  expect(p.activityType).toBe('ANALYSIS')
  expect(p.criteria.some(c=>c.templateId.endsWith('-creation'))).toBe(false)
 })
})
