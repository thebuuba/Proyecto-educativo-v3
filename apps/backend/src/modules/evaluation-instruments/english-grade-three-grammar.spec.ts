import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-three-grammar-contracts.json'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',score=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Tercero: formas y usos propios, PDF147–150',()=>{
 for(const f of fixtures)for(const action of ['Compararán la función de','Investigarán en textos en inglés el uso de'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${action} ${format} ${total}`,()=>{
  const p=propose(`${action} ${f.forms[0]} con ejemplos de los textos proporcionados.`,format,total)
  expect(p.activityType).toBe(action.startsWith('Compararán')?'COMPARISON':'RESEARCH')
  const c=p.criteria.find(c=>c.templateId===`ing-3-feature-${f.id}`)
  expect(c).toBeDefined();expect(c!.description).not.toMatch(/^Emplea /)
  expect(c!.description).toContain(action.startsWith('Compararán')?'Contrasta':'Identifica')
 })
 it('will o going to son alternativas, no dos usos obligatorios',()=>{
  const p=propose('Escribirán una predicción en inglés utilizando will o going to, según la alternativa elegida.')
  expect(p.criteria.filter(c=>c.templateId.startsWith('ing-3-feature-'))).toHaveLength(1)
  expect(p.criteria.find(c=>c.templateId.startsWith('ing-3-feature-'))!.title).toContain(' o ')
 })
 it('usando introduce un requisito igual que utilizando',()=>{
  const description='Escribirán en inglés una predicción usando will.'
  expect(propose(description).criteria).toEqual(propose(description.replace('usando','utilizando')).criteria)
 })
 for(const f of fixtures)for(const form of f.forms)for(const action of ['Leerán un texto en inglés e identificarán','Explicarán la función de','Escribirán un mensaje en inglés utilizando'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35])it(`${f.id} ${form} ${action} ${format} ${score}`,()=>{
  const description=`${action} ${form}${action.startsWith('Explicarán')?' con ejemplos de un texto en inglés':''}.`
  const p=propose(description,format,score),c=p.criteria.find(c=>c.templateId===`ing-3-feature-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  if(action.startsWith('Escribirán'))expect(c!.description.toLowerCase()).toContain(f.purpose.toLowerCase())
  expect(p.criteria).toEqual(propose(description,format,score,'La célula animal').criteria)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('no evalúa estructuras ajenas ni requisitos negados',()=>{
  for(const term of ['posesivo ’s','pronombres posesivos','adverbios de frecuencia','sustantivos contables'])expect(propose(`Escribirán en inglés un mensaje utilizando ${term}.`).criteria.some(c=>c.templateId.startsWith('ing-3-feature-'))).toBe(false)
  const p=propose('Escribirán en inglés una historia usando pasado simple. No se evaluará used to. Usarán conectores de secuencia.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-3-feature-sequence-connectors')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-3-feature-used-to')
 })
 it('distingue el uso de presente perfecto para noticias del de segundo para experiencias',()=>{
  const c=propose('Escribirán en inglés una noticia utilizando presente perfecto.').criteria.find(c=>c.templateId==='ing-3-feature-present-perfect')!
  expect(c.description).toContain('noticia');expect(c.description).not.toContain('experiencia personal')
 })
 it('no interpreta fechas, nombres o citas como modales pedidos',()=>{
  const p=propose('Leerán en inglés una noticia: Will escribe el anuncio "May 4: I can help". Identificarán el acontecimiento comunicado.')
  expect(p.criteria.some(c=>/feature-(?:will|modal-)/.test(c.templateId))).toBe(false)
 })
})
