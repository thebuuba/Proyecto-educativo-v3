import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {explicitWritingProcess} from '../../../../../packages/shared/src/language-feature-criteria'
import {deliveryConditions} from '../../../../../packages/shared/src/task-delivery-requirements'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/engine-evaluation/bank-v1.json'),'utf8'))
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',modalityCode:null,optativeExitName:null}
describe('Causas compartidas: requisitos explícitos y evidencias del proceso',()=>{
 it.each(['noticia','guía turística','informe de lectura'])('revisar %s no crea una segunda entrega',genre=>{
  expect(explicitWritingProcess('Revisa la organización, la ortografía y la puntuación antes de entregar.','test',genre)).toEqual([])
 })
 it('conserva proceso cuando sí se solicitan las dos versiones',()=>{
  expect(explicitWritingProcess('Entrega el borrador y la versión final; revisa los errores y explica las correcciones.','test','texto')).toHaveLength(1)
 })
 it('publicar no elimina las convenciones escritas del producto final',()=>{
  const p=recommend({activityTitle:'Guía turística',description:'Redacta una guía turística, revisa la ortografía y publica la versión final en la plataforma del curso.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId==='guide-process-publication')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='guide-revision')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='guide-process-revision')).toBe(false)
 })
 it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('noticia: composición conserva dimensiones esenciales en %s',format=>{
  const c=bank.cases.find(c=>c.id==='LEN02'),p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId==='news-process-revision')).toBe(false)
  expect(p.criteria.some(r=>r.templateId==='news-language')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='news-revision')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='news-essential')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='news-structure')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='news-sequence')).toBe(true)
 })
 it('formato agrupado conserva fuente, tamaño, color y condiciones de párrafo',()=>{
  const c=bank.cases.find(c=>c.id==='LEN03'),conditions=deliveryConditions(c.description)
  expect(conditions).toEqual(expect.arrayContaining([{key:'font',label:'fuente Arial'},{key:'size',label:'tamaño de letra 12'},{key:'color',label:'títulos en color azul'},{key:'spacing',label:'interlineado 1.5'},{key:'indent',label:'sangría solicitada'}]))
 })
 it('compara lugares dentro de una guía creada; no sustituye el producto por comparar guías',()=>{
  const c=bank.cases.find(c=>c.id==='LEN03'),p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('TOURIST_GUIDE_CREATION')
 })
})
