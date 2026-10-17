import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {detectTeachingStrategy} from '@aula/shared'
import fixtures from '../../../../../data/evaluation-instruments/science-grade-5-contracts.json'
const context={level:'SECONDARY' as const,grade:5,cycle:2,modalityCode:'academic',subjectCode:'NAT-QUI',subjectName:'Ciencias de la Naturaleza',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Química5: contenidos, acciones y formatos',()=>{
 for(const f of fixtures)for(const description of [f.description,...f.variants])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id}/${format}/${total}/${description}`,()=>{
  const p=propose(description,format,total)
  expect(p.criteria.some(c=>c.templateId.startsWith(`nat-5-${f.id}-`))).toBe(true)
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-5-')||c.templateId.startsWith('delivery-'))).toBe(true)
  expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(propose(description,format,total,'Partes de una célula').criteria).toEqual(p.criteria)
 })
 it('balancear evalúa coeficientes y conservación sin modificar subíndices',()=>{
  const p=propose('Balancea la ecuación química dada sin modificar las fórmulas de las sustancias.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-5-stoichiometry-balancing'])
  expect(p.criteria[0].description).toMatch(/coeficientes/);expect(p.criteria[0].description).toMatch(/subíndices/)
 })
 it('un modelo construido es proyecto; interpretar el modelo proporcionado no exige construirlo',()=>{
  expect(propose('Construye un modelo atómico.').activityType).toBe('PROJECT')
  const p=propose('Interpreta el modelo atómico proporcionado sin construirlo.')
  expect(p.activityType).toBe('ANALYSIS');expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-5-atomic-models-analysis'])
 })
 it('explicar una práctica no agrega procedimiento, registro ni seguridad de ejecución',()=>{
  const p=propose('Explica cómo realizar el experimento termoquímico descrito, sin ejecutarlo.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-5-thermochemistry-explanation'])
 })
 it('no asigna indagación o problemas por palabras del contenido',()=>{
  expect(detectTeachingStrategy({...context,description:'Calcula la energía libre de Gibbs con los datos del problema.'}).id).toBeNull()
 })
 it('la consigna de un catalizador no exige alterar equilibrio o energía de reacción',()=>{
  const p=propose('Explica el efecto de un catalizador en una reacción.')
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/equilibrio/)
 })
 it('niega balanceo, sin convertirlo en una obligación junto al cálculo pedido',()=>{
  const p=propose('Calcula las cantidades estequiométricas con los datos dados, sin balancear otra ecuación.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-5-stoichiometry-calculation','nat-5-stoichiometry-result'])
 })
 it('reconoce caracterización y predicción explícitas sin convertirlas en experimentación',()=>{
  expect(propose('Caracteriza carbohidratos con las estructuras dadas.').criteria.map(c=>c.templateId)).toEqual(['nat-5-carbohydrates-observation'])
 })
 it('reconoce predicción sin imponer comprobarla experimentalmente',()=>{
  expect(propose('Predice el comportamiento de los elementos por su ubicación en la tabla periódica.').criteria.map(c=>c.templateId)).toEqual(['nat-5-periodic-position-prediction'])
 })
 it('relacionar bloques y subniveles no duplica una explicación general de energía',()=>{
  expect(propose('Explica la relación de los bloques de la tabla periódica con sus subniveles electrónicos.').criteria.map(c=>c.templateId)).toEqual(['nat-5-periodic-blocks-explanation'])
 })
 it('nombra el elemento y la propiedad pedidos sin imponer los otros contenidos del grupo',()=>{
  expect(propose('Investiga aplicaciones del mercurio en las fuentes dadas.').criteria[0].title).toMatch(/mercurio/)
  const p=propose('Explica la regla de Pauli en el modelo dado.')
  expect(p.criteria[0].title).toMatch(/Pauli/);expect(p.criteria[0].description).not.toMatch(/Hund|degenerados/)
  expect(propose('Explica la electronegatividad de los elementos indicados.').criteria[0].title).toMatch(/electronegatividad/)
 })
 it('reconoce símbolos sigma y pi del texto oficial',()=>{
  expect(propose('Identifica enlaces σ y π en el modelo dado.').criteria.map(c=>c.templateId)).toEqual(['nat-5-carbon-bonds-identification'])
 })
 it('el puente de hidrógeno no añade una investigación sobre el elemento',()=>{
  expect(propose('Explica el puente de hidrógeno y las fuerzas de Van der Waals.').criteria.map(c=>c.templateId)).toEqual(['nat-5-intermolecular-forces-explanation'])
 })
 it('el cálculo de gas ideal no impone comparar gas real',()=>{
  const p=propose('Calcula el volumen del gas ideal con los datos dados.')
  expect(p.criteria.every(c=>!c.title.includes('reales'))).toBe(true)
 })
 it('interpretar resonancia aromática no exige etapas de sustitución',()=>{
  const p=propose('Interpreta las especies de resonancia del sistema aromático proporcionado.')
  expect(p.criteria[0].description).not.toMatch(/etapas|sustitución/)
 })
 it('una hibridación o eliminación específica no exige las otras',()=>{
  expect(propose('Explica la hibridación sp2 en el modelo dado.').criteria[0].description).not.toMatch(/sp3/)
  expect(propose('Explica el mecanismo E1 proporcionado.').criteria[0].title).not.toMatch(/E2/)
 })
})
