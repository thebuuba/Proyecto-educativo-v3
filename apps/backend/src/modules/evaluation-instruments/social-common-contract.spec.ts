import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {commonSocialSelections,resolveCommonSocialTask} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
const propose=(description:string,title='Actividad',format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica')=>recommend({activityTitle:title,description,maxScore:17.35,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
const content=(p:ReturnType<typeof propose>)=>p.criteria.map(c=>c.description+' '+c.descriptors.map(d=>d.text).join(' ')).join(' ')
describe('Sociales primero: hechos, espacio, fuentes y argumentos solicitados',()=>{
 for(const [description,instrument] of [
  ['Identifica en el mapa los puntos cardinales señalados.','lista-cotejo'],
  ['Ordena los hechos de la Revolución Francesa en una línea de tiempo.','lista-cotejo'],
  ['Registra la frecuencia con que se aplican las reglas de seguridad vial en las situaciones observadas.','escala'],
  ['Analiza las causas de la expansión colonial europea.','rubrica'],
  ['Identifica los poderes del Estado con puntos por cada componente.','lista-ponderada'],
 ] as const){
  it(`recomienda por propósito: ${description}`,()=>{
   const task=resolveCommonSocialTask('Actividad',description,context)
   expect(task).not.toBeNull()
   expect(commonSocialSelections(task!,description).suggestedInstrumentType).toBe(instrument)
  })
 }
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const){
  it(`${format}: causas y consecuencias sin imponer producto ni trabajo de campo`,()=>{
   const p=propose('Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas. No elabores mapas ni hagas entrevistas.','La Revolución Francesa',format)
   expect(p.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   expect(p.criteria.some(c=>c.templateId.endsWith('-causes'))).toBe(true)
   expect(p.criteria.some(c=>c.templateId.endsWith('-consequences'))).toBe(true)
   expect(content(p)).not.toMatch(/Revolución Francesa|entrevista|trabajo de campo|realiza un mapa/i)
  })
  it(`${format}: cronología no es una lista genérica de calidad del texto`,()=>{
   const p=propose('Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.','Actividad',format)
   expect(p.criteria.some(c=>c.templateId.endsWith('-sequence'))).toBe(true)
   expect(content(p)).toMatch(/secuencia|cronol/i)
   expect(content(p)).not.toMatch(/caligrafía|decoración|creatividad artística/i)
  })
  it(`${format}: mapas y puntos cardinales no exigen Mercator ni GPS`,()=>{
   const p=propose('Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.','Colonialismo',format)
   expect(p.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   expect(content(p)).toMatch(/cardinal|orientación/i)
   expect(content(p)).not.toMatch(/Mercator|GPS|escala numérica/)
   expect(p.criteria.some(c=>/soc-1-(?:scale|gps)-/.test(c.templateId))).toBe(false)
  })
 }
 it('comprender dos posturas no exige adherirse a ninguna',()=>{
  const p=propose('Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados. No defiendas una postura personal.')
  expect(content(p)).toMatch(/perspectivas|posturas/)
  expect(content(p)).not.toMatch(/debe apoyar|adhesión|convicción personal|cree en/)
 })
 it('alternativa de productos no exige ambos',()=>{
  const p=propose('Elabora una línea de tiempo o un mapa sobre la expansión colonial europea.')
  expect(content(p)).toMatch(/alternativa elegida/)
  expect(p.criteria.some(c=>c.templateId.endsWith('-alternative'))).toBe(true)
  expect(content(p)).not.toMatch(/hechos indicados de mapas y planos/)
 })
 it('no toma un título viejo como contenido de la descripción nueva',()=>{
  const p=propose('Analiza los derechos y deberes de la Constitución dominicana.','Comercio triangular')
  expect(content(p)).toMatch(/derechos|deberes/)
  expect(content(p)).not.toMatch(/comercio triangular|colonización/)
 })
 it('una prohibición no elimina la acción independiente posterior',()=>{
  const p=propose('No elabores un mapa y analiza las causas de la Revolución Francesa.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-causes'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.includes('cartography'))).toBe(false)
 })
 it('conserva el proveedor histórico al pedir un catálogo anterior',async()=>{
  const {evaluationCatalogForVersion}=await import('./catalog-current')
  const old=recommend({activityTitle:'Actividad',description:'Analiza las causas de la expansión colonial europea.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.93')!)
  expect(old.criteria.some(c=>c.templateId.startsWith('soc-1-'))).toBe(false)
 })
})
