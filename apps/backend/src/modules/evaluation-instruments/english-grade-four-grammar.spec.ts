import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-four-grammar-contracts.json'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Cuarto: formas y propósitos gramaticales de PDF159–161',()=>{
 it('explicar oralmente una función gramatical no se convierte en utilizarla para otra intención',()=>{
  const p=propose('Explicarán oralmente en inglés la función del presente continuo con ejemplos proporcionados.')
  expect(p.activityType).toBe('ORAL_PRESENTATION')
  const c=p.criteria.find(c=>c.templateId==='ing-4-feature-present-continuous')!
  expect(c.description).toContain('explica');expect(c.description).not.toMatch(/^Emplea /)
 })
 it('conserva una alternativa cuando aparece en orden inverso al catálogo',()=>{
  const p=propose('Escribirán una predicción en inglés utilizando will o going to, según la alternativa elegida.')
  const rows=p.criteria.filter(c=>c.templateId.startsWith('ing-4-feature-'))
  expect(rows).toHaveLength(1);expect(rows[0].templateId).toBe('ing-4-feature-will-or-going-to')
 })
 for(const f of fixtures)for(const form of f.forms)for(const action of ['Leerán un texto en inglés e identificarán','Explicarán la función de','Escribirán un mensaje en inglés utilizando','Compararán la función de','Investigarán en textos en inglés el uso de'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${form} ${action} ${format} ${total}`,()=>{
  const description=`${action} ${form} con ejemplos de los textos proporcionados.`
  const p=propose(description,format,total),c=p.criteria.find(c=>c.templateId===`ing-4-feature-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  if(action.startsWith('Escribirán'))expect(c!.description.toLowerCase()).toContain(f.purpose.toLowerCase())
  if(action.startsWith('Compararán'))expect(c!.description).toContain('Contrasta')
  if(action.startsWith('Investigarán'))expect(c!.description).toContain('Identifica')
  expect(p.criteria).toEqual(propose(description,format,total,'La célula animal').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 it('no hereda modales ni otras estructuras no definidas para cuarto',()=>{
  for(const term of ['should','may','might','must','can','pronombres posesivos','cláusulas sustantivas','adverbios de certeza'])expect(propose(`Escribirán en inglés un mensaje utilizando ${term}.`).criteria.some(c=>c.templateId.startsWith('ing-4-feature-'))).toBe(false)
 })
 it('omite requisitos negados y no confunde un nombre, fecha o cita con una forma solicitada',()=>{
  const p=propose('Leerán una noticia en inglés: Will publica "Hope, May 4: Look after the dog". Identificarán el acontecimiento. No se exigirá futuro continuo ni voz pasiva.')
  expect(p.criteria.some(c=>c.templateId.startsWith('ing-4-feature-'))).toBe(false)
 })
})
