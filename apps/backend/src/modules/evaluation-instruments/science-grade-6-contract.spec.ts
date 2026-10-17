import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/science-grade-6-contracts.json'
import previous from '../../../../../data/evaluation-instruments/science-regressions.json'
const context={level:'SECONDARY' as const,grade:6,cycle:2,modalityCode:'academic',subjectCode:'NAT-FIS',subjectName:'Ciencias de la Naturaleza',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Física6: contenidos, acciones y formatos',()=>{
 for(const f of fixtures)for(const description of [f.description,...f.variants])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id}/${format}/${total}/${description}`,()=>{
  const p=propose(description,format,total)
  expect(p.criteria.some(c=>c.templateId.startsWith(`nat-6-${f.id}-`))).toBe(true)
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-6-')||c.templateId.startsWith('delivery-'))).toBe(true)
  expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(propose(description,format,total,'Una entrevista en francés').criteria).toEqual(p.criteria)
 })
 it('interpreta circuitos proporcionados sin exigir construcción ni práctica',()=>{
  const p=propose('Interpreta el circuito en serie proporcionado sin construirlo ni realizar otra práctica.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-6-circuits-analysis'])
 })
 it('construir un circuito no inventa una práctica adicional',()=>{
  const p=propose('Construye el circuito según el diseño y las precauciones indicadas.')
  expect(p.activityType).toBe('PROJECT');expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-6-circuits-construction','nat-6-circuits-construction-safety'])
 })
 it('conserva el antecedente completo de Ohm y sus cinco evidencias sin construir',()=>{
  const p=propose(previous.find(f=>f.id==='ohm')!.description)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['science-ohm-data','science-ohm-formula','science-ohm-calculation','science-ohm-interpretation','science-ohm-diagram'])
  expect(JSON.stringify(p.criteria)).not.toContain('Construye')
 })
 it('una explicación de incertidumbre es conceptual y no exige medir ni diagnosticar',()=>{
  const p=propose('Explica el principio de incertidumbre con el modelo cuántico dado.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-6-uncertainty-explanation'])
  expect(p.criteria[0].description).toMatch(/distribuciones|dispersión/)
 })
 it.each([
  ['Explica la ley cero de la termodinámica.',/equilibrio térmico/,/dirección de los procesos|balance de energía/],
  ['Explica la fuerza electromotriz del modelo dado.',/energía por unidad de carga/,/potencia como/],
  ['Representa el sistema solar mediante un dibujo.',/sistema solar/,/galaxia|galaxias/],
  ['Explica el principio de continuidad del flujo dado.',/conservación de masa/,/balance energético/],
  ['Explica los isótopos del modelo dado.',/protones y neutrones/,/desintegración solicitada/],
  ['Explica la ley de Ohm sin realizar cálculos.',/V = I × R/,/despejando|Procedimiento de cálculo/],
  ['Calcula la potencia eléctrica con los datos dados.',/energía por unidad de tiempo/,/electromotriz/],
 ] as const)('delimita el concepto pedido: %s',(description,required,forbidden)=>{
  const p=propose(description),text=JSON.stringify(p.criteria)
  expect(text).toMatch(required);expect(text).not.toMatch(forbidden)
 })
 it('la temperatura como estado microscópico no añade transferencia de calor',()=>{
  const p=propose('Interpreta el movimiento de átomos y moléculas y su relación con la temperatura.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-6-internal-energy-analysis'])
 })
 it('una predicción ondulatoria no impone experimento, medición ni confirmación',()=>{
  const p=propose('Predice el comportamiento de las ondas con el modelo dado, sin realizar experimentos ni medir.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-6-waves-properties-prediction'])
  expect(p.criteria[0].description).toContain('sin exigir comprobación experimental')
 })
 it.each([
  'Explica el experimento de conservación de energía proporcionado sin realizarlo.',
  'Analiza los datos de la práctica de movimiento circular proporcionados sin realizarla.',
  'Formula una hipótesis sobre la presión en fluidos sin realizar experimentos.',
 ])('no convierte una tarea cognitiva en ejecución: %s',description=>{
  const p=propose(description)
  expect(p.activityType).not.toBe('LAB_PRACTICE')
  expect(p.criteria.some(c=>/experiment-procedure|experiment-record|safety$/.test(c.templateId))).toBe(false)
 })
})
