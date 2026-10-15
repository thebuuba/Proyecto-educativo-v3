import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-six-contracts.json'
import {evaluationCatalogForVersion} from './catalog-current'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Sexto comun: funciones de PDF169-174',()=>{
 it('aísla el grado, asignatura, optativas y versiones anteriores',()=>{
  const input={activityTitle:'Actividad',description:fixtures[0].description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  for(const version of ['evaluation-2026.46','evaluation-2026.60','evaluation-2026.62'])expect(recommend(input,context,null,[],'UNMAPPED',null,evaluationCatalogForVersion(version)!).criteria.some(c=>c.templateId.startsWith('ing-6-'))).toBe(false)
  for(const change of [{grade:1},{grade:2},{grade:3},{grade:4},{grade:5},{level:'PRIMARY' as const},{subjectCode:'LEN'},{subjectCode:'NAT'},{subjectCode:'FRA'},{optativeExitName:'Humanidades'}])expect(recommend(input,{...context,...change},null,[],'UNMAPPED',null).criteria.some(c=>c.templateId.startsWith('ing-6-'))).toBe(false)
 })
 for(const [purpose,instrument] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']] as const)it(`recomienda ${instrument} por propósito y respeta la elección manual`,()=>{
  const input={activityTitle:'Actividad',description:fixtures[5].description+' '+purpose,maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe(instrument)
  expect(propose(input.description,'rubrica').instrumentType).toBe('rubrica')
 })
 it('explicar una función tecnológica es contenido comunicativo y la función gramatical es objeto de estudio',()=>{
  const scientific=propose('Explicarán oralmente en inglés la función del recurso tecnológico con los datos proporcionados.')
  expect(scientific.criteria.map(c=>c.templateId)).toContain('ing-6-explanations')
  const grammar=propose('Explicarán oralmente en inglés la función de used to con ejemplos proporcionados.')
  expect(grammar.criteria.map(c=>c.templateId)).not.toContain('ing-6-explanations')
 })
 for(const [verb,id] of [['Explicarán','explanations'],['Razonarán','reasoning']] as const)it(`reconoce ${verb} como acción comunicativa`,()=>{
  expect(propose(`${verb} oralmente en inglés lo ocurrido en el caso, relacionando los hechos y los datos proporcionados.`).criteria.map(c=>c.templateId)).toContain(`ing-6-${id}`)
 })
 for(const description of ['Interactuarán en inglés en una entrevista de trabajo simulada con la ficha de un personaje ficticio.','Realizarán en inglés una entrevista de trabajo simulada con el perfil proporcionado de un personaje ficticio.'])it(`reconoce la interacción pedida: ${description}`,()=>{
  const p=propose(description)
  expect(p.activityType).toBe('ORAL_INTERACTION');expect(p.criteria.map(c=>c.templateId)).toContain('ing-6-job-interview')
 })
 it('hipotetizar no exige una entrega escrita cuando no se indicó el medio',()=>{
  const p=propose('Hipotetizarán en inglés sobre una situación pasada del caso ficticio, relacionando la condición no cumplida y su resultado alternativo.')
  expect(p.criteria.find(c=>c.templateId==='ing-6-past-hypothesis')?.description).toMatch(/^Formula /)
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-6-written')
 })
 for(const f of fixtures)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total)
  expect(p.activityType).toBe(f.activity)
  expect(p.criteria.map(c=>c.templateId)).toEqual(f.criteria.map(id=>`ing-6-${id}`))
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria).toEqual(propose(f.description,format,total,'Células animales y vegetales').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
