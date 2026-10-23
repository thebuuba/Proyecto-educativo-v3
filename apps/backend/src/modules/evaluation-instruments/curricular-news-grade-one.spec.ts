import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-noticia-v1.json'),'utf8'))
const reserved=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-noticia-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(number:number,format:typeof formats[number],description?:string)=>{
 const c=bank.cases[number-1]
 return recommend({activityTitle:c.title,description:description??c.description,participationMode:number===4?'GROUP':'INDIVIDUAL',maxScore:17.35,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
}
describe('Currículo completo: noticia de primero con expectativas previas',()=>{
 for(const format of formats){
  it(`${format}: escuchar y reconstruir no convierte el audio en una noticia escrita nueva`,()=>{
   const c=reserved.cases[0],p=recommend({activityTitle:c.title,description:c.description,participationMode:'INDIVIDUAL',maxScore:20,preferredInstrumentType:format},reserved.context,null,[],'UNMAPPED',null)
   const text=p.criteria.map(c=>c.description).join(' ')
   expect(p.activityType).toBe('NEWS_ANALYSIS')
   expect(text).toMatch(/escuchad|audio/)
   expect(text).toMatch(/palabras/)
   expect(text).toMatch(/interés|interes|relevancia/)
   expect(text).not.toMatch(/Redacta|escrit|fragmentos|graba/)
  })
  it(`${format}: el plan con destinatario y la publicación en el mural quedan evaluados`,()=>{
   const c=reserved.cases[1],p=propose(2,format,c.description),text=p.criteria.map(c=>c.description).join(' ')
   expect(text).toMatch(/destinatario/)
   expect(text).toMatch(/mural/)
   expect(text).not.toMatch(/foto|dibujo/)
  })
  it(`${format}: no revisen abreviaturas respeta corrección limitada a signos del original`,()=>{
   const c=reserved.cases[2],p=propose(6,format,c.description),text=p.criteria.map(c=>c.description).join(' ')
   expect(text).not.toMatch(/abreviaturas|sinónimos|Redacta un|titular/)
   expect(text).toMatch(/puntuación/)
   expect(text).toMatch(/palabras/)
  })
  it(`${format}: noticia breve no exige demostrar revisión ni un borrador no solicitado`,()=>{
   const p=propose(1,format)
   expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/borrador|Revisa puntuación.*antes|Muestra cambios/)
  })
  it(`${format}: la consigna breve admite lenguaje claro sin imponer registro formal ni dos clases de conectores`,()=>{
   expect(propose(1,format).criteria.map(c=>c.description).join(' ')).not.toMatch(/registro formal|conectores de orden y temporales/)
  })
  it(`${format}: leer con prohibición de redactar conserva comprensión y paratextos`,()=>{
   const p=propose(3,format),text=p.criteria.map(c=>c.description).join(' ')
   expect(p.activityType).toBe('NEWS_ANALYSIS')
   expect(text).not.toMatch(/Redacta un hecho|Organiza la noticia con|Revisa puntuación/)
   expect(text).toMatch(/fotograf|pie de foto|paratexto/)
   expect(text).toMatch(/relevancia|noticioso|actualidad/)
  })
  it(`${format}: la revisión conserva las tres formas abreviadas después de sin cambiar los hechos`,()=>{
   const p=propose(6,format),text=p.criteria.map(c=>c.description).join(' ')
   for(const requirement of [/siglas/,/abreviaturas/,/acrónimos/])expect(text).toMatch(requirement)
   expect(text).not.toMatch(/foto|entrevista/)
  })
  it(`${format}: una única dimensión evalúa los conectores y la secuencia`,()=>{
   const p=propose(2,format)
   expect(p.criteria.some(c=>c.templateId==='news-sequence')&&p.criteria.some(c=>c.templateId==='news-feature-connectors')).toBe(false)
  })
  it(`${format}: la redacción con ficha evalúa conservación de los hechos suministrados`,()=>{
   expect(propose(2,format).criteria.map(c=>c.description).join(' ')).toMatch(/(?:ficha|proporcionad|suministrad)/)
  })
  it(`${format}: el noticiero considera el orden de los hechos además del turno del equipo`,()=>{
   expect(propose(4,format).criteria.map(c=>c.description).join(' ')).toMatch(/temporal|cronológic/)
  })
  it(`${format}: revisar un texto recibido no exige crear contenido ni reorganizarlo`,()=>{
   const p=propose(6,format)
   expect(p.criteria.map(c=>c.templateId)).not.toEqual(expect.arrayContaining(['news-essential','news-structure','news-sequence']))
   const process=p.criteria.find(c=>c.templateId==='news-process-revision')!
   expect(process.description).not.toMatch(/problemas de contenido|organización/)
   const abbreviated=p.criteria.find(c=>c.templateId==='news-feature-abbreviations')!
   expect(abbreviated.description).toMatch(/explica/)
  })
  it(`${format}: la audiencia solicitada permanece aunque haya requisitos lingüísticos`,()=>{
   expect(propose(2,format).criteria.map(c=>c.description).join(' ')).toMatch(/comunidad escolar/)
  })
  it(`${format}: la forma verbal no obliga a inventar acciones terminadas y en desarrollo`,()=>{
   expect(propose(2,format).criteria.map(c=>c.description).join(' ')).not.toMatch(/distinguir acciones terminadas de situaciones en desarrollo/)
  })
  it(`${format}: comparar titulares no obliga a comparar entrada y cuerpo no solicitados`,()=>{
   const p=propose(5,format),text=p.criteria.map(c=>c.description).join(' ')
   expect(text).toMatch(/corresponden.*hechos|correspondencia.*hechos/)
   expect(text).not.toMatch(/Contrasta el uso del titular, la entrada y el cuerpo/)
  })
  it(`${format}: conectores dentro de una noticia no sustituyen los turnos del noticiero`,()=>{
   const p=propose(4,format,bank.cases[3].description+' Usen conectores temporales en cada noticia.')
   expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/intervenciones/)
   expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/conectores/)
  })
  it(`${format}: lectura con preguntas concretas no añade una inferencia como producto obligatorio`,()=>{
   const p=propose(3,format)
   expect(p.criteria.map(c=>c.templateId)).not.toContain('news-interpretation')
   expect(p.criteria.some(c=>c.templateId==='news-purpose')&&p.criteria.some(c=>c.templateId==='news-feature-newsworthiness')).toBe(false)
  })
 }
 it('la fidelidad a la ficha tiene diferencias observables también en niveles intermedios',()=>{
  const row=propose(2,'escala').criteria.find(c=>c.templateId==='news-essential')!
  expect(row.descriptors.slice(1,-1).map(d=>d.text).join(' ')).toMatch(/ficha|suministrad/)
 })
 it('la exclusión de un producto no elimina la comparación afirmativa',()=>{
  const p=propose(5,'rubrica')
  expect(p.activityType).toBe('NEWS_COMPARISON')
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/Redacta una noticia|Revisa puntuación/)
 })
 it('los cuatro formatos conservan 17.35 exactos sin obligar la elección automática',()=>{
  for(const format of formats){const p=propose(2,format);expect(p.instrumentType).toBe(format);expect(p.totalScoreUnits).toBe(1735)}
 })
})
