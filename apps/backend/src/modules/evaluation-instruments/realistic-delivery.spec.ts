import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {deliveryConditions,deliveryCriteria,TaskRequirementError} from '@aula/shared'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/realistic-audit-bank-v1.json'),'utf8'))
const task=(id:string)=>bank.cases.find((c:{id:string})=>c.id===id)
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const proposal=(id:string,format:typeof formats[number])=>{
 const c=task(id)
 return recommend({activityTitle:c.title,description:c.description,preferredInstrumentType:format,maxScore:17.35,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade:c.grade,cycle:c.grade<=3?1:2,subjectCode:c.subjectCode,subjectName:c.subjectName,modalityCode:c.modalityCode??null,optativeExitName:null},null,[],'UNMAPPED',null)
}
describe('Requisitos realistas: extracción y agrupación de presentación',()=>{
 it('no convierte las oraciones que deben conservarse en extensión de una entrega nueva',()=>{
  expect(deliveryConditions('Revisa una oración del mensaje y conserva las otras dos oraciones. Entrega la versión revisada junto al borrador.')).toEqual([])
  expect(deliveryConditions('Conserva las otras dos oraciones y añade tres ejemplos.')).toEqual([{key:'quantity-ejemplo',label:'3 ejemplos'}])
 })
 it('extrae las condiciones naturales del documento Word sin inventar medidas',()=>{
  const conditions=deliveryConditions(task('B-MF0024-formato').description)
  expect(conditions).toEqual(expect.arrayContaining([
   {key:'file-format',label:'documento de Word'},{key:'title',label:'incluye título'},
   {key:'font',label:'fuente Arial'},{key:'size',label:'tamaño de letra 12'},
   {key:'spacing',label:'interlineado 1.5'},{key:'indent',label:'sangría solicitada'},
   {key:'color',label:'color indicado'},
  ]))
  expect(JSON.stringify(conditions)).not.toMatch(/centímetro|azul|rojo|introducción|conclusión/)
 })
 it('reconoce Arial 12 precedido por Usen en el informe desarrollado',()=>{
  expect(deliveryConditions(task('B-LEN1-informe-desarrollado').description)).toEqual(expect.arrayContaining([
   {key:'font',label:'fuente Arial'},{key:'size',label:'tamaño de letra 12'},{key:'indent',label:'sangría al comenzar los párrafos'},
  ]))
 })
 it.each(['Usen Arial 12.','Utilicen fuente Arial 12.','Con Arial 12.'])('reconoce la instrucción %s',text=>{
  expect(deliveryConditions(text)).toEqual(expect.arrayContaining([{key:'font',label:'fuente Arial'},{key:'size',label:'tamaño de letra 12'}]))
 })
 it.each(['Analicen el documento de Word con título y sangría proporcionado.','La noticia menciona Arial 12.','No se exige Arial 12 ni sangría.','Pueden usar Arial 12 y sangría.','Como recurso: un documento Word con Arial 12 y sangría.'])('no convierte insumos u opciones en exigencias: %s',text=>{
  expect(deliveryConditions(text)).toEqual([])
 })
 it('no impone la fuente retirada ni transforma una alternativa en dos condiciones',()=>{
  expect(deliveryConditions('Usen Arial o Calibri, tamaño 12.').find(c=>c.key==='font')?.label).toBe('fuente Arial o Calibri')
  expect(deliveryConditions(task('B-LEN1-informe-retirado').description)).toEqual([])
 })
 it('rechaza tamaños incompatibles expresados sin la palabra tamaño',()=>{
  expect(()=>deliveryConditions('Usen Arial 12. Usen Arial 14.')).toThrow(TaskRequirementError)
 })
 it.each(['No usen Arial 12 ni sangría.','No deben utilizar fuente Arial 12.','Analicen la sangría del documento proporcionado.'])('respeta exclusiones o análisis de insumos: %s',text=>{
  expect(deliveryConditions(text)).toEqual([])
 })
 it('conserva la medida explícita de sangría sin sustituirla por una referencia vaga',()=>{
  expect(deliveryConditions('Entreguen un documento de Word con sangría de 1,25 cm.')).toContainEqual({key:'indent',label:'sangría de 1.25 cm'})
 })
 it('conserva contenido pedido en Word al retirar solo el criterio genérico de formato',()=>{
  const c=task('B-MF0024-formato')
  const p=recommend({activityTitle:'Actividad',description:'Creen un documento de Word con los datos proporcionados. Usen fuente Arial 12.',preferredInstrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade:c.grade,cycle:2,subjectCode:c.subjectCode,subjectName:c.subjectName,modalityCode:c.modalityCode,optativeExitName:null},null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='technical-mf002-document-creation'),JSON.stringify(p.criteria.map(c=>c.templateId))).toBe(true)
  expect(p.criteria.some(c=>c.templateId==='technical-mf002-text-format-creation')).toBe(false)
 })
 it('separa formato y secciones de contenido sin una fila por detalle tipográfico',()=>{
  const rows=deliveryCriteria('Entreguen un informe en Word. Usen Arial 12, interlineado 1.5 y sangría. Secciones: introducción, desarrollo y conclusión.')
  const presentation=rows.find(r=>r.title==='Formato del documento')!
  const structure=rows.find(r=>r.title==='Organización solicitada')!
  expect(presentation).toBeDefined();expect(structure).toBeDefined()
  expect(presentation.observable).not.toContain('conclusion')
  expect(structure.observable).not.toContain('Arial')
  expect(presentation.checklistParts?.length).toBeLessThanOrEqual(2)
  expect(new Set(presentation.progressionLevels).size).toBe(5)
  expect(presentation.progressionLevels[1]).not.toBe(presentation.progressionLevels[0])
 })
 for(const format of formats)it(`Word completo y sin valoración duplicada: ${format}`,()=>{
  const p=proposal('B-MF0024-formato',format),text=p.criteria.map(c=>c.description).join('\n')
  for(const term of ['Word','título','Arial','12','1.5','sangría','color indicado'])expect(text).toContain(term)
  expect(text).not.toMatch(/según el modelo|introducción|conclusión/)
  expect(p.criteria.some(c=>/^technical-mf002-(?:document|text-format)-creation/.test(c.templateId))).toBe(false)
  expect(p.criteria.length).toBeLessThanOrEqual(format==='lista-cotejo'?4:2)
  // Una condición binaria de archivo no admite por sí sola niveles de logro distintos.
  if(format!=='lista-cotejo')expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/Cumple la condición de entrega solicitada: documento de Word/)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
  if(format==='lista-cotejo')expect(text).toContain('Sí solo si')
 })
 it('un número de fragmentos es evidencia de contenido, no un ajuste de apariencia',()=>{
  const rows=deliveryCriteria('Entreguen un informe. Usen Arial 12. Justifiquen con dos fragmentos del texto.')
  expect(rows.find(r=>r.title==='Formato del documento')?.observable).not.toContain('fragmentos')
  expect(rows.find(r=>r.title==='Evidencias solicitadas')?.observable).toContain('2 fragmentos')
 })
})
