import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const read=(name:string)=>JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/'+name+'.json'),'utf8'))
const values=read('len1-guia-actitudes-v1'),limits=read('len1-guia-escritura-limites-v1')
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(bank:typeof values,index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
describe('Guía1: actitudes observables, escritura y recursos realmente pedidos',()=>{
 for(const format of formats){
  it(`${format}: interés geográfico, cultural y gastronómico con datos de fichas`,()=>{
   const p=run(values,0,format),c=p.criteria.find(r=>r.templateId==='guide-content')!
   expect(c.description).toMatch(/geográfic.*cultural.*gastronómic/)
   expect(c.description).toMatch(/fichas/)
   expect(c.description).toMatch(/interés|pertinen/)
  })
  it(`${format}: representación respetuosa evalúa expresiones y no estados internos`,()=>{
   const p=run(values,0,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/identidad|identidades/)
   expect(t).toMatch(/estereotipos/)
   expect(t).toMatch(/burlas/)
   expect(t).toMatch(/superior|jerarqu/)
   expect(t).not.toMatch(/orgullo|entusiasmo|talento|visita de campo|dibuja una/)
   expect(p.criteria.find(r=>r.templateId==='guide-visual')!.description).toMatch(/dibujo dado/)
  })
  it(`${format}: museo y ficha singular forman parte de la precisión del producto`,()=>{
   const p=run(limits,0,format),t=p.criteria.map(c=>c.description).join(' ')
   expect(t).toMatch(/museo local/)
   expect(t).toMatch(/ficha dada/)
   expect(t).not.toMatch(/mapa|investiga|publica|borrador/)
  })
  it(`${format}: usa todos los signos pedidos, incluidas preguntas formuladas habitualmente`,()=>{
   const p=run(limits,0,format),t=p.criteria.map(c=>c.description).join(' ')
   expect(t).toMatch(/comas.*dos puntos.*comillas/)
   expect(t).toMatch(/interrogación|preguntas/)
   expect(t).toMatch(/exclamación|exclamaciones/)
   expect(t).toMatch(/enumeraci[oó]n|enumerar/)
   expect(t).toMatch(/cita/)
   expect(t).not.toMatch(/Identifica.*signos|texto leído/)
   expect(p.criteria.some(c=>c.templateId==='guide-process-revision')).toBe(false)
  })
  it(`${format}: plan con mapa único no añade gráfico, collage ni fotografía`,()=>{
   const p=run(limits,1,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/mapa/)
   expect(t).toMatch(/previsto|prevé|plan/)
   expect(t).not.toMatch(/gráfico|collage|fotografía|dicción|volumen|Crea un mapa/)
  })
  it(`${format}: qué creen desde dibujo conserva anticipación y contraste de audio`,()=>{
   const p=run(limits,2,format),t=JSON.stringify(p.criteria)
   expect(p.activityType).toBe('TOURIST_GUIDE_ANALYSIS')
   expect(t).toMatch(/predicción|anticipación/)
   expect(t).toMatch(/dibujo/)
   expect(t).toMatch(/contrasta|comprueba/)
   expect(t).toMatch(/audio|escuchad/)
   expect(t).not.toMatch(/título|mapa|fotografía|texto leído/)
  })
 }
})
