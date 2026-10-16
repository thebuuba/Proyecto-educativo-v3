import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/science-grade-3-contracts.json'
const context={level:'SECONDARY' as const,grade:3,cycle:1,modalityCode:'academic',subjectCode:'NAT-FISICAS',subjectName:'Ciencias de la Naturaleza',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Ciencias físicas3: contenidos, acciones y formatos',()=>{
 for(const f of fixtures)for(const description of [f.description,...f.variants??[]])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id}/${format}/${total}/${description}`,()=>{
  const p=propose(description,format,total)
  expect(p.criteria.some(c=>c.templateId.startsWith(`nat-3-${f.id}-`))).toBe(true)
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-3-')||c.templateId.startsWith('delivery-'))).toBe(true)
  expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(propose(description,format,total,'Partes de una célula').criteria).toEqual(p.criteria)
 })
 it('interpretar un circuito construido no pide construir otro',()=>{
  const p=propose('Interpreta el circuito en serie construido por el docente, sin realizar otra práctica.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-analysis'))).toBe(true)
  expect(p.criteria.some(c=>/construction|experiment|safety/.test(c.templateId))).toBe(false)
 })
 it('construir circuito sí evalúa construcción, sin imponer un experimento extra',()=>{
  const p=propose('Construye el circuito sencillo según el diseño y las precauciones indicadas.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-construction'))).toBe(true)
  expect(p.criteria.some(c=>/experiment-procedure|experiment-record/.test(c.templateId))).toBe(false)
  expect(JSON.stringify(p.criteria)).not.toMatch(/soldar|enchufe|red doméstica/)
  expect(p.activityType).toBe('PROJECT')
 })
 it('explicar una separación no ejecuta una práctica ni recoge datos',()=>{
  expect(propose('Explica cómo realizar un experimento de separación de mezclas.').criteria.some(c=>/experiment|safety/.test(c.templateId))).toBe(false)
 })
 it('el cálculo eléctrico no añade construcción ni análisis artístico',()=>{
  const p=propose('Calcula la corriente eléctrica con la relación y los datos proporcionados sin construir el circuito.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(true)
  expect(p.criteria.some(c=>/construction|representation|experiment/.test(c.templateId))).toBe(false)
 })
 it('medir, distinguir cambios y diseñar una escala evalúan las acciones expresas',()=>{
  expect(propose('Mide el tiempo según el procedimiento y registra las mediciones.').criteria.some(c=>c.templateId.endsWith('-measurement'))).toBe(true)
  expect(propose('Distingue cambios físicos y químicos con las evidencias proporcionadas.').criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(true)
  expect(propose('Diseña una escala de dureza con los resultados proporcionados.').criteria.some(c=>c.templateId.endsWith('-design'))).toBe(true)
  expect(propose('Diseña una escala de dureza con los resultados proporcionados.').activityType).toBe('PROJECT')
 })
 it('una gráfica se interpreta como datos y clasificar mezclas no duplica soluciones',()=>{
  expect(propose('Interpreta la gráfica proporcionada de velocidad y rapidez.').criteria[0].templateId).toBe('nat-3-speed-data-interpretation')
  expect(propose('Clasifica sustancias, mezclas, soluciones y coloides con los ejemplos proporcionados.').criteria.map(c=>c.templateId)).toEqual(['nat-3-matter-mixtures-classification'])
 })
 it('comparar luz y pigmentos no añade sustancias; las comparaciones exigen relaciones científicas concretas',()=>{
  expect(propose('Compara mezcla de luces y pigmentos con los casos proporcionados.').criteria.map(c=>c.templateId)).toEqual(['nat-3-light-colors-comparison'])
  expect(propose('Compara ondas longitudinales y transversales con los esquemas proporcionados.').criteria[0].description).toMatch(/oscilación.*propagación/)
  expect(propose('Compara radiación ionizante y no ionizante con las fuentes proporcionadas.').criteria[0].description).toMatch(/ionización/)
 })
 it('señales no significa señalar y un circuito de apoyo no impone otra explicación',()=>{
  expect(propose('Explica conducción de señales eléctricas por neuronas y potenciales de acción con el modelo dado.').criteria.map(c=>c.templateId)).toEqual(['nat-3-bioelectricity-explanation'])
  expect(propose('Explica corriente eléctrica, voltaje, pilas y baterías con el circuito proporcionado.').criteria.map(c=>c.templateId)).toEqual(['nat-3-current-voltage-explanation'])
  expect(propose('Explica los cambios de la energía y su conservación en el sistema dado.').criteria[0].description).not.toMatch(/medidas de uso eficiente/)
 })
 it('radar usa ondas electromagnéticas, no se describe como sonido',()=>{
  const only=propose('Explica cómo funciona el radar.')
  expect(only.criteria[0].description).toMatch(/ondas electromagnéticas/)
  expect(only.criteria[0].title).toBe('Explicación de radar')
  const mixed=propose('Compara sonar y radar con las fuentes proporcionadas.')
  expect(mixed.criteria[0].description).toMatch(/mecánicas.*electromagnéticas/)
 })
})
