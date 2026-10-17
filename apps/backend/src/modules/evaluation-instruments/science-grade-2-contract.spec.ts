import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {resolveCommonScienceTask,commonScienceSelections} from '@aula/shared'
import fixtures from '../../../../../data/evaluation-instruments/science-grade-2-contracts.json'
const context={level:'SECONDARY' as const,grade:2,cycle:1,modalityCode:'academic',subjectCode:'NAT-VIDA',subjectName:'Ciencias de la Naturaleza',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Ciencias de la Vida2: contenidos, familias y formatos',()=>{
 for(const f of fixtures)for(const description of [f.description,...f.variants??[]])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id}/${format}/${total}/${description}`,()=>{
  const p=propose(description,format,total)
  expect(p.criteria.some(c=>c.templateId.startsWith(`nat-2-${f.id}-`))).toBe(true)
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-2-')||c.templateId.startsWith('delivery-'))).toBe(true)
  expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(propose(description,format,total,'Ley de Ohm').criteria).toEqual(p.criteria)
 })
 it('explicar partes y funciones no exige dibujo, rótulos ni materiales',()=>{
  const p=propose('Explica las partes y funciones de una célula.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-functions'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(false)
  expect(JSON.stringify(p.criteria)).not.toMatch(/rotula|plastilina|cartulina|creatividad|belleza/)
 })
 it('dibujo o maqueta mantiene una alternativa y no añade organelos de ejemplo',()=>{
  const p=propose('Representa la célula vegetal mediante un dibujo o una maqueta. Por ejemplo, puedes consultar una imagen con núcleo y mitocondrias.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(true)
  expect(JSON.stringify(p.criteria)).toMatch(/alternativa elegida/)
  expect(JSON.stringify(p.criteria)).not.toMatch(/núcleo|mitocondrias|decoración/)
 })
 it('analizar datos de fotosíntesis no exige experimentar ni graficar',()=>{
  const p=propose('Interpreta los datos proporcionados de fotosíntesis. No realices experimentos ni construyas gráficos.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-data-interpretation'))).toBe(true)
  expect(p.criteria.some(c=>/experiment|representation|collection/.test(c.templateId))).toBe(false)
 })
 it('datos propios se distinguen de datos proporcionados',()=>{
  const p=propose('Realiza la práctica indicada sobre enzimas. Registra las observaciones y analiza los datos obtenidos en la práctica.')
  expect(JSON.stringify(p.criteria.filter(c=>c.templateId.endsWith('-data-interpretation')))).toMatch(/datos registrados/)
 })
 it('ordenar etapas exige la secuencia solicitada, sin inventar acciones adicionales',()=>{
  const p=propose('Ordena las etapas del embarazo en el esquema proporcionado.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-2-pregnancy-sequence'])
  expect(propose('Explica las etapas del embarazo sin ordenarlas en un esquema.').criteria.some(c=>c.templateId.endsWith('-sequence'))).toBe(false)
 })
 it('resolver herencia no equivale siempre a calcular números',()=>{
  const p=propose('Resuelve los ejercicios de herencia mendeliana con los datos ficticios proporcionados.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-problem-reasoning'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
 })
 it('el propósito argumentativo u oral admite progresión de calidad',()=>{
  for(const description of ['Debate aplicaciones de la ingeniería genética con evidencias.','Prepara una presentación oral sobre higiene y salud.']){
   const task=resolveCommonScienceTask('Actividad',description,context)!
   expect(commonScienceSelections(task,description).suggestedInstrumentType).toBe('rubrica')
  }
 })
 it('imágenes y modelos proporcionados no piden producir otra representación',()=>{
  for(const description of ['Compara la metamorfosis de los seres vivos representados en las imágenes.','Interpreta el modelo de ADN elaborado por el docente.']){
   const p=propose(description)
   expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(false)
   expect(resolveCommonScienceTask('Actividad',description,context)!.activityType).not.toBe('PROJECT')
  }
 })
 it('explicar la función inmunitaria no añade una alteración o caso ficticio',()=>{
  expect(propose('Explica la función del sistema inmunológico.').criteria[0].description).not.toMatch(/alteración|caso ficticio/)
 })
 it('el flujo energético del ecosistema no se duplica como otra dimensión general',()=>{
  const p=propose('Representa el flujo de energía del ecosistema mediante un esquema.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-2-food-energy-representation'])
 })
})
