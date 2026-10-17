import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-four-lexicon-contracts.json'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Cuarto: quince ámbitos léxicos y quince intenciones de trece registros expresivos',()=>{
 for(const f of fixtures)for(const action of ['Leerán en inglés un texto e identificarán','Explicarán con ejemplos del texto en inglés','Escribirán en inglés un mensaje utilizando','Compararán en textos en inglés','Investigarán en textos en inglés'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${action} ${format} ${total}`,()=>{
  const description=`${action} ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}.`
  const p=propose(description,format,total),c=p.criteria.find(c=>c.templateId===`ing-4-lexicon-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  if(action.startsWith('Compararán')){expect(c!.description).toContain('Contrasta');expect(p.activityType).toBe('COMPARISON')}
  expect(p.criteria).toEqual(propose(description,format,total,'Una célula animal').criteria)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  if(f.id==='experiences')expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-4-experience')
  if(['ask-opinion','opinion','news'].includes(f.id))expect(p.criteria.map(c=>c.templateId)).not.toContain(`ing-4-${f.id==='ask-opinion'?'opinion':f.id}`)
 })
 it('pedir una opinión no obliga a ofrecer el punto de vista propio',()=>{
  const p=propose('Dialogarán en inglés para pedir opiniones sobre una situación proporcionada.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-4-lexicon-ask-opinion')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-4-opinion')
 })
 it('descompone las intenciones unidas de la fuente y conserva sus alternativas',()=>{
  const opinion=propose('Escribirán en inglés un mensaje utilizando expresiones para pedir y dar opiniones.')
  for(const id of ['ask-opinion','opinion'])expect(opinion.criteria.map(c=>c.templateId)).toContain(`ing-4-lexicon-${id}`)
  expect(opinion.criteria.map(c=>c.templateId)).not.toContain('ing-4-opinion')
  const both=propose('Escribirán en inglés un mensaje utilizando expresiones para expresar interés y asombro.')
  for(const id of ['interest','amazement'])expect(both.criteria.map(c=>c.templateId)).toContain(`ing-4-lexicon-${id}`)
  const either=propose('Escribirán en inglés un mensaje utilizando expresiones para expresar interés o asombro.')
  const rows=either.criteria.filter(c=>c.templateId.includes('lexicon-'))
  expect(rows).toHaveLength(1);expect(rows[0].title).toContain(' o ')
 })
 it('acuerdo y desacuerdo, o coincidencia y discrepancia, conservan ambas acciones cuando son conjuntas',()=>{
  for(const label of ['expresar acuerdo y desacuerdo','coincidir y discrepar']){
   const c=propose(`Escribirán en inglés un mensaje utilizando expresiones para ${label}.`).criteria.find(c=>c.templateId.includes('lexicon-'))!
   expect(c.description).toContain(label)
  }
 })
 it('no exige experiencias privadas ni puntúa sentimientos reales o vocabulario negado',()=>{
  const p=propose('Dialogarán en inglés para expresar una opinión sobre los personajes. No se evaluará la motivación ni la ansiedad. No se exigirá vocabulario de experiencias personales. Recursos: diccionario y lista de herramientas.')
  expect(p.criteria.some(c=>c.templateId.includes('lexicon-'))).toBe(false)
 })
})
