import {englishObjectiveId} from './english-quality-test-utils'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:2,subjectCode:'ING',cycle:1,optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,format:typeof formats[number]='rubrica',score=20,title='Actividad',pool=false)=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL',includeAdditionalCandidates:pool},context,null,[],'UNMAPPED',null)
describe('Segundo: acciones independientes, alternativas y límites',()=>{
 for(const f of fixtures)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${format} ${score}`,()=>{
  const p=propose(f.description,format,score)
  expect(p.activityType).toBe(f.activity)
  for(const id of f.criteria)expect(p.criteria.map(c=>englishObjectiveId(c.templateId))).toContain(`ing-2-${id}`)
  for(const id of f.excluded??[])expect(p.criteria.map(c=>c.templateId)).not.toContain(`ing-2-${id}`)
  for(const word of f.contains)expect(JSON.stringify(p.criteria)).toContain(word)
  expect(p.criteria).toEqual(propose(f.description,format,score,'La célula').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('can o could son alternativas en el mismo requisito',()=>{
  const p=propose('Escribirán en inglés una petición de ayuda utilizando can o could, según la alternativa elegida.')
  const c=p.criteria.find(c=>c.templateId==='ing-2-feature-permission')!
  expect(c.title.toLowerCase()).toContain('can o could')
  expect(c.description).not.toContain('can y could')
 })
 it('un correo de respuesta conserva la revisión explícita del significado y la corrección',()=>{
  const p=propose('Leerán un correo en inglés para identificar el día, la hora y el lugar de un encuentro. Luego escribirán un correo de respuesta para hacer planes sobre el encuentro utilizando going to. Revisarán el significado y la corrección del mensaje antes de entregarlo.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-strategy-revision')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-interaction')
  expect(p.criteria.find(c=>c.templateId==='ing-2-plans:writing:2')!.description).not.toContain('información del plan solicitada del plan')
 })
 it('correo o carta no se convierten en dos productos obligatorios',()=>{
  const p=propose('Escribirán en inglés un correo electrónico o una carta para comunicar la información solicitada, eligiendo uno de los dos productos.')
  expect(p.criteria.filter(c=>c.templateId.includes('genre-'))).toHaveLength(1)
  expect(p.criteria.find(c=>c.templateId.includes('genre-'))!.description).toContain('elegid')
 })
 it('comprobar o comprender un menú no activa una compra',()=>{
  const p=propose('Leerán un menú en inglés e identificarán los productos y sus precios. Subrayarán la información solicitada en el texto. Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo',17.35)
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-2-shopping')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-2-strategy-annotation','ing-2-genre-menu'])
 })
 it('la narración de una experiencia no puntúa dos veces los mismos acontecimientos',()=>{
  const description='Escribirán una narración breve en inglés sobre una experiencia ficticia. Utilizarán pasado simple, pasado continuo y conectores de secuencia para enlazar los acontecimientos. Se distribuirán pesos entre los componentes verificables.'
  const p=propose(description,'lista-ponderada',17.35)
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-experience')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-2-genre-narrative')
  expect(propose(description+' Identificarán los personajes de la narración.').criteria.map(c=>c.templateId)).toContain('ing-2-genre-narrative')
 })
 it('conserva el conjunto mayor que20 y rechaza generar más de20 sin recorte',()=>{
  const description='Escribirán un mensaje en inglés utilizando presente simple, pasado simple, presente perfecto, question tags, posesivo s, artículos definidos, comparativo, pronombres interrogativos, pronombres objeto, pronombres posesivos, preposiciones de tiempo, adverbios de tiempo, adverbios de frecuencia, adverbios de intensidad, conectores de coordinación, conectores de tiempo, conectores de secuencia, conectores de causa, pasado continuo, will, be going to, presente continuo, there was, imperativo, let’s, hope, could, should, condicional, voz pasiva, oraciones exclamativas, sustantivos contables, género gramatical, singular y plural, participio presente, participio pasado, how much, why not, pronombres reflexivos, adverbios de cantidad y preposiciones de duración.'
  expect(propose(description,'rubrica',20,'Actividad',true).criteria.length).toBeGreaterThan(20)
  for(const format of formats)expect(()=>propose(description,format)).toThrow(/hasta 20/)
 })
})
