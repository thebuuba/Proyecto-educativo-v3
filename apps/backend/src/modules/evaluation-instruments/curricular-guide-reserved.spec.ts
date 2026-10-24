import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-guia-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
const descriptions=(p:ReturnType<typeof run>)=>p.criteria.map(c=>c.description).join(' ')
describe('Guía1: reservas con expectativas anteriores a sus salidas',()=>{
 for(const format of formats){
  it(`${format}: corrección acotada no inventa clases, grados ni original`,()=>{
   const p=run(0,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/calificativos/)
   expect(t).toMatch(/explica.*cambio|cambio.*explica/i)
   expect(t).not.toMatch(/determinativos|grado|Entrega el original|Ambas versiones|borrador/)
  })
  it(`${format}: respeta otro destinatario y publicación digital sin pedir dos versiones`,()=>{
   const p=run(1,format),t=descriptions(p)
   expect(t).toMatch(/estudiantes nuevos/)
   expect(t).toMatch(/registro/)
   expect(t).toMatch(/dibujo/)
   expect(t).toMatch(/digital.*plataforma|plataforma.*digital/)
   // La consigna exige calidad del escrito final, sin una entrega del proceso.
   expect(p.criteria.some(c=>c.templateId==='guide-revision')).toBe(true)
   expect(p.criteria.some(c=>c.templateId==='guide-process-revision')).toBe(false)
   expect(t).not.toMatch(/familias|mural|borrador|ambas versiones|compañero|mapa/)
  })
  it(`${format}: paráfrasis de escucha no impone recursos ni soporte de respuesta`,()=>{
   const p=run(2,format),t=descriptions(p)
   expect(t).toMatch(/escuchada/)
   expect(t).toMatch(/propias palabras/)
   expect(t).toMatch(/calificativos/)
   expect(t).not.toMatch(/esquema|respuesta oral|mapa|título|predicción|clasifica|texto leído/)
  })
  it(`${format}: lectura con gramática mantiene propósito, partes y anticipación`,()=>{
   const p=run(3,format),t=descriptions(p)
   expect(p.activityType).toBe('TOURIST_GUIDE_ANALYSIS')
   expect(t).toMatch(/propósito.*lectura|para qué.*leer/)
   expect(t).toMatch(/predicción|anticipación/)
   expect(t).toMatch(/título.*fotografía/)
   expect(t).toMatch(/contrasta|comprueba/)
   expect(t).toMatch(/intención comunicativa/)
   expect(t).toMatch(/portada.*información.*imágenes.*cierre/)
   expect(t).toMatch(/presente.*indicativo/)
   expect(t).toMatch(/sustantivos propios.*comunes.*abstractos/)
   expect(t).toMatch(/adjetivos/)
   expect(t).toMatch(/interrogativas.*exclamativas|interrogación.*exclamación/)
   expect(t).toMatch(/clasifi|categorías/)
   expect(t).toMatch(/gráfico.*o.*digital/)
   expect(t).not.toMatch(/acciones terminadas|Crea|Emplea.*producción/)
   expect(p.criteria.some(c=>c.templateId==='guide-interpretation')).toBe(false)
   expect(p.criteria.find(c=>c.templateId==='guide-structure')!.description).toMatch(/Explica.*orientan|función/)
   expect(t).toMatch(/organizan la información/)
  })
  it(`${format}: el plan de una futura presentación no evalúa su ejecución`,()=>{
   const p=run(4,format),t=descriptions(p)
   expect(t).toMatch(/intención.*público.*tema.*diseño/)
   expect(t).toMatch(/fichas/)
   expect(t).toMatch(/clasifi|categorías/)
   expect(t).toMatch(/esquema/)
   expect(t).toMatch(/mapa.*gráfico.*collage/)
   expect(t).toMatch(/topográfica|ubicación/)
   expect(t).not.toMatch(/dicción|volumen|Expone|Comunica oralmente|Presenta la guía|versión final|Incorpora.*recurso/)
  })
  it(`${format}: producción usa grados, sintagma nominal y oraciones sin requisitos negados`,()=>{
   const p=run(5,format),t=descriptions(p)
   expect(t).toMatch(/parques/)
   expect(t).toMatch(/visitantes jóvenes/)
   expect(t).toMatch(/presente.*indicativo/)
   expect(t).toMatch(/grados/)
   expect(t).toMatch(/núcleo.*modificadores directo e indirecto/)
   expect(t).toMatch(/interrogativas.*exclamativas/)
   expect(t).not.toMatch(/acciones terminadas|mapa|borrador|ambas versiones|publica|Identifica.*explica.*ejemplos/)
   expect(p.criteria.some(c=>c.templateId==='guide-process-revision')).toBe(false)
   expect(p.totalScoreUnits).toBe(1735)
  })
 }
})
