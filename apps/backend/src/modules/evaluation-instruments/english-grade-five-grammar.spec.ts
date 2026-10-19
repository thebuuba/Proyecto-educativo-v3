import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-five-grammar-contracts.json'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Quinto: formas y propositos de PDF164-167',()=>{
 it('analizar adverbios de probabilidad no exige comunicar otra posibilidad',()=>{
  const p=propose('Explicarán la función de los adverbios de probabilidad con ejemplos de un texto en inglés.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-5-feature-probability-adverbs')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-5-probability')
 })
 it('can’t no exige can de solicitud ni presente perfecto continuo exige perfecto simple',()=>{
  const negative=propose('Escribirán en inglés una prohibición utilizando can’t.')
  expect(negative.criteria.map(c=>c.templateId)).toContain('ing-5-feature-modal-cannot')
  expect(negative.criteria.map(c=>c.templateId)).not.toContain('ing-5-feature-modal-can')
  const continuous=propose('Escribirán en inglés un mensaje utilizando presente perfecto continuo.')
  expect(continuous.criteria.map(c=>c.templateId)).not.toContain('ing-5-feature-present-perfect')
 })
 for(const f of fixtures)for(const form of f.forms)for(const action of ['Leerán un texto en inglés e identificarán','Explicarán la función de','Escribirán un mensaje en inglés utilizando','Compararán la función de','Investigarán en textos en inglés el uso de'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${form} ${action} ${format} ${total}`,()=>{
  // These source-purpose assertions use their stated curricular situation;
  // generic school contexts are separately checked without inventing a scenario.
  const situation=['present-simple','present-perfect','present-perfect-continuous','medical-verbs'].includes(f.id)?' de una consulta médica simulada':f.id.startsWith('modal-')?' de una compra simulada de bienes y servicios':''
  const description=`${action} ${form} con ejemplos de los textos proporcionados${situation}.`
  const p=propose(description,format,total),c=p.criteria.find(c=>c.templateId===`ing-5-feature-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  if(action.startsWith('Escribirán'))expect(c!.description.toLowerCase()).toContain(f.purpose.toLowerCase())
  if(action.startsWith('Compararán'))expect(c!.description).toContain('Contrasta')
  if(action.startsWith('Investigarán'))expect(c!.description).toContain('Identifica')
  expect(p.criteria).toEqual(propose(description,format,total,'La célula animal').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
