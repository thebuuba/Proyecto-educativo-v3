import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const propose=(description:string,grade=6,format:'rubrica'|'lista-cotejo'|'escala'='rubrica')=>recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade,cycle:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null},null,[],'UNMAPPED',null)
describe('La evidencia solicitada distingue el contenido del recurso inglés',()=>{
 for(const grade of [5,6])for(const target of ['el vocabulario de los elementos de una narración','el pasado simple'])it(`narración proporcionada no impone analizar su trama/${grade}/${target}`,()=>{
  const p=propose(`Lean una narración en inglés e identifiquen únicamente ${target} solicitado con los ejemplos proporcionados.`,grade)
  expect(p.criteria.some(c=>new RegExp(`^ing-${grade}-(?:narrative|detailed-narrative|genre-narrative)$`).test(c.templateId))).toBe(false)
  expect(p.criteria.some(c=>c.templateId.includes(target.includes('vocabulario')?'lexicon-':'feature-'))).toBe(true)
 })
 it('medioambiente no es una solicitud de ambiente narrativo',()=>{
  const p=propose('Escriban en inglés una narración sobre el medioambiente de la situación ficticia proporcionada.')
  expect(p.criteria.filter(c=>c.templateId==='ing-6-genre-narrative')).toHaveLength(0)
 })
 it('explicar datos ambientales no exige acciones de cuidado no solicitadas',()=>{
  const p=propose('Escriban en inglés un razonamiento para justificar la explicación de los datos del medioambiente proporcionados.')
  expect(p.criteria.some(c=>c.templateId==='ing-6-context-care-reasons')).toBe(false)
 })
 it('leer una valoración no exige expresar un juicio propio',()=>{
  const p=propose('Lean en inglés el juicio sobre el hecho de discriminación del caso e identifiquen la valoración y los hechos que la sustentan.')
  expect(p.criteria.find(c=>c.templateId==='ing-6-context-critical-judgment')?.description).toMatch(/Relaciona.*valoración.*texto/)
 })
 it('explicar lo ocurrido produce una explicación y no comprende otra ya dada',()=>{
  const p=propose('Expliquen en inglés lo ocurrido en el caso ficticio, relacionando los hechos y motivos proporcionados.')
  expect(p.criteria.find(c=>c.templateId==='ing-6-explanations')?.description).toContain('Explica en inglés lo ocurrido')
 })
 for(const target of ['principales y secundarias','secundarias y principales'])it('cotejo separa las ideas conjuntas/'+target,()=>{
  const p=propose(`Lean en inglés e identifiquen las ideas ${target} solicitadas.`,6,'lista-cotejo')
  expect(p.criteria.filter(c=>c.templateId.startsWith('ing-6-strategy-main-secondary:'))).toHaveLength(2)
 })
 it('la alternativa de ideas no impone ambas',()=>{
  const p=propose('Lean en inglés e identifiquen las ideas principales o secundarias según la alternativa elegida.')
  expect(p.criteria.find(c=>c.templateId==='ing-6-strategy-main-secondary')?.description).toContain('alternativa elegida')
 })
 it('evaluar dos fuentes proporcionadas no exige entregar otras dos',()=>{
  const p=propose('Evalúen en inglés la fiabilidad de las dos fuentes proporcionadas según sus evidencias.')
  expect(p.criteria.some(c=>c.templateId==='delivery-format')).toBe(false)
 })
 it('conserva una cantidad de fuentes solicitada como entrega',()=>{
  const p=propose('Escriban en inglés una explicación e incluyan dos fuentes con los datos de la tarea.')
  expect(p.criteria.some(c=>c.templateId==='delivery-format')).toBe(true)
 })
})
