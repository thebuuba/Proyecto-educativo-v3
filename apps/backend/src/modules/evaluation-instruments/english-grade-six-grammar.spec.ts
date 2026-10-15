import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-six-grammar-contracts.json'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Sexto: formas y propositos de PDF170-173',()=>{
 it('las estructuras de adaptación no exigen used to; la omisión no exige pronombre presente',()=>{
  for(const form of ['be used to','get used to'])expect(propose(`Escribirán en inglés un mensaje utilizando ${form}.`).criteria.map(c=>c.templateId)).not.toContain('ing-6-feature-used-to')
  const omission=propose('Escribirán en inglés un mensaje utilizando omisión del pronombre relativo.')
  expect(omission.criteria.map(c=>c.templateId)).toContain('ing-6-feature-relative-omission')
  expect(omission.criteria.map(c=>c.templateId)).not.toContain('ing-6-feature-relative-pronouns')
 })
 for(const f of fixtures)for(const form of f.forms)for(const action of ['Leerán un texto en inglés e identificarán','Explicarán la función de','Escribirán un mensaje en inglés utilizando','Compararán la función de','Investigarán en textos en inglés el uso de'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${form} ${action} ${format} ${total}`,()=>{
  const description=`${action} ${form} con ejemplos de los textos proporcionados.`
  const p=propose(description,format,total),c=p.criteria.find(c=>c.templateId===`ing-6-feature-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  if(action.startsWith('Escribirán'))expect(c!.description.toLowerCase()).toContain(f.purpose.toLowerCase())
  if(action.startsWith('Compararán'))expect(c!.description).toContain('Contrasta')
  if(action.startsWith('Investigarán'))expect(c!.description).toContain('Identifica')
  expect(p.criteria).toEqual(propose(description,format,total,'La célula animal').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
