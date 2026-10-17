import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {resolveCommonScienceTask,commonScienceCriteria,commonScienceSelections,detectTeachingStrategy} from '@aula/shared'
import fixtures from '../../../../../data/evaluation-instruments/science-grade-1-contracts.json'
const context={level:'SECONDARY' as const,cycle:1,grade:1,subjectCode:'NAT-TU',subjectName:'Ciencias de la Naturaleza',modalityCode:'academic',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
const text=(p:ReturnType<typeof propose>)=>JSON.stringify(p.criteria)
describe('Ciencias común1: acciones y restricciones reales',()=>{
 for(const f of fixtures)for(const description of [f.description,...f.variants??[]])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id}/${format}/${total}/${description}`,()=>{
  const p=propose(description,format,total)
  expect(p.criteria.some(c=>c.templateId.startsWith(`nat-1-${f.id}-`))).toBe(true)
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-1-')||c.templateId.startsWith('delivery-'))).toBe(true)
  expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(propose(description,format,total,'Novela francesa').criteria).toEqual(p.criteria)
 })
 it('construcción de un dispositivo evalúa funcionamiento, no solo contenido',()=>{
  const p=propose('Construye el filtro de agua indicado y registra las observaciones.')
  expect(p.criteria.some(c=>c.templateId.includes('construction'))).toBe(true)
  expect(text(p)).toMatch(/potabilidad/)
 })
 it('interpretar un modelo no requiere producir otro',()=>{
  const p=propose('Interpreta el esquema proporcionado de placas tectónicas sin construir una maqueta.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-analysis'))).toBe(true)
  expect(p.criteria.some(c=>/representation|construction/.test(c.templateId))).toBe(false)
 })
 it('los aspectos pedidos de una exposición no se pierden ni sus apoyos opcionales se vuelven obligatorios',()=>{
  const p=propose('Los estudiantes realizarán una exposición individual en la que explicarán qué son los volcanes, cómo se forman, cuáles son sus principales partes, los diferentes tipos de erupciones y los riesgos que representan para las poblaciones cercanas. Podrán utilizar imágenes, esquemas o modelos como apoyo.')
  for(const facet of ['formation','parts','eruptions','risks'])expect(p.criteria.some(c=>c.templateId.includes(`volcanoes-${facet}-`))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.includes('representation'))).toBe(false)
 })
 it('alternativas de acciones permanecen excluyentes',()=>{
  const p=propose('Explica el ciclo del agua o representa el ciclo del agua con un dibujo.')
  expect(p.criteria.every(c=>c.templateId.includes('alternative'))).toBe(true)
  expect(text(p)).toMatch(/alternativa elegida/)
  const different=propose('Explica el ciclo del agua o representa la estructura interna de la Tierra mediante un dibujo.')
  expect(different.criteria).toHaveLength(1)
  expect(different.criteria[0].description).toMatch(/ciclo del agua|desplazamientos del agua/)
  expect(different.criteria[0].description).toMatch(/capas internas/)
 })
 it('explicar una práctica no significa realizarla',()=>{
  const p=propose('Explica cómo realizar un experimento sobre la erosión del suelo. No realices la práctica ni recolectes datos.')
  expect(p.activityType).toBe('ANALYSIS');expect(p.criteria.every(c=>c.templateId.startsWith('nat-1-'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.includes('explanation'))).toBe(true)
  expect(p.criteria.some(c=>/experiment|collection|safety/.test(c.templateId))).toBe(false)
  const developed=propose('Los estudiantes explicarán cómo realizar un experimento sobre erosión del suelo.')
  expect(developed.activityType).toBe('ANALYSIS')
  expect(developed.criteria.some(c=>/experiment|safety/.test(c.templateId))).toBe(false)
  const calculation=propose('Los estudiantes explicarán cómo calcular la densidad con los datos del ejemplo.')
  expect(calculation.activityType).toBe('ANALYSIS')
  expect(calculation.criteria.some(c=>/calculation|result/.test(c.templateId))).toBe(false)
 })
 it('datos proporcionados no requieren trabajo de campo, gráficos ni hipótesis',()=>{
  const p=propose('Analiza los datos proporcionados de contaminación del agua y explica las diferencias. Sin realizar experimentos ni construir gráficos.')
  expect(text(p)).toMatch(/datos proporcionados/)
  expect(p.criteria.some(c=>/collection|experiment|representation|hypothesis/.test(c.templateId))).toBe(false)
  expect(text(p)).not.toMatch(/salida de campo|debe confirmar|materiales adicionales/)
 })
 it('representación alternativa no exige dos productos ni decoración',()=>{
  const p=propose('Representa las capas de la Tierra mediante un dibujo o una maqueta.')
  expect(text(p)).toMatch(/alternativa elegida/)
  expect(text(p)).not.toMatch(/decoración|habilidad artística|cartulina|plasticina|debe elaborar ambos/)
 })
 it('la hipótesis evalúa su contrastabilidad, nunca que resulte confirmada',()=>{
  const p=propose('Formula una hipótesis sobre la erosión del suelo. No la compruebes experimentalmente.')
  expect(p.criteria.some(c=>c.templateId.includes('hypothesis'))).toBe(true)
  expect(text(p)).toMatch(/contrastable/);expect(p.criteria.some(c=>c.templateId.includes('experiment'))).toBe(false)
  expect(propose('Formula una hipótesis contrastable sobre la lluvia ácida.').criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(false)
 })
 it('práctica evalúa procedimiento y registro sin inventar resultados',()=>{
  const p=propose('Realiza la práctica indicada sobre densidad y registra las observaciones, incluidos resultados inesperados.')
  expect(p.activityType).toBe('LAB_PRACTICE')
  expect(p.criteria.some(c=>c.templateId.includes('experiment-procedure'))).toBe(true)
  expect(text(p)).toMatch(/inesperados/)
  expect(text(p)).not.toMatch(/balanza|probeta|hipótesis confirmada|siempre aumenta/)
  expect(p.criteria.some(c=>c.templateId.endsWith('-observation'))).toBe(false)
 })
 it('frecuencia observada usa niveles de frecuencia, sin fingir oportunidades en una explicación',()=>{
  const p=propose('Observa la regularidad con que se registran las observaciones de la práctica de densidad.','escala')
  expect(p.levels.map(l=>l.label)).toEqual(['Siempre','Frecuentemente','A veces','Todavía no'])
  const explanation=propose('Explica la densidad.','escala')
  expect(explanation.levels.map(l=>l.label)).not.toContain('Siempre')
 })
 it('describir observaciones no duplica la misma evidencia como explicación causal',()=>{
  const p=propose('Observa las muestras de suelo y describe sus características.')
  expect(p.criteria.filter(c=>c.templateId.endsWith('-observation'))).toHaveLength(1)
  expect(p.criteria.some(c=>c.templateId.endsWith('-explanation'))).toBe(false)
 })
 it('formular preguntas investigables no exige investigar fuentes todavía',()=>{
  const p=propose('Formula preguntas investigables sobre los vientos.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-1-winds-question'])
 })
 it('reconoce imperativos habituales sin convertir la consigna en investigación documental',()=>{
  const p=propose('Formulen una hipótesis sobre la erosión del suelo. Realicen la práctica indicada y registren las observaciones.')
  expect(p.activityType).toBe('LAB_PRACTICE')
  for(const key of ['hypothesis','experiment-procedure','experiment-record'])expect(p.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-research'))).toBe(false)
  expect(propose('Expliquen el ciclo del agua.').criteria.some(c=>c.templateId.endsWith('-explanation'))).toBe(true)
  expect(propose('Clasifiquen las rocas proporcionadas.').criteria.some(c=>c.templateId.endsWith('-classification'))).toBe(true)
 })
 it('contrasta hipótesis con resultados inesperados sin pedir confirmación ni comparación de estructuras',()=>{
  const p=propose('Formula una hipótesis sobre la erosión del suelo. Realiza el experimento indicado, registra las observaciones y contrasta la hipótesis con las evidencias, aunque el resultado sea inesperado.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-hypothesis-evidence'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(false)
 })
 it('recomienda comparación para comparar fenómenos, sin forzar una estrategia',()=>{
  expect(propose('Compara tiempo y clima.').activityType).toBe('COMPARISON')
 })
 it('nuevo contenido domina el título y no utiliza contenidos ajenos al grado',()=>{
  expect(propose('Explica las causas de los sismos.','rubrica',20,'La célula vegetal').criteria).toEqual(propose('Explica las causas de los sismos.').criteria)
  expect(resolveCommonScienceTask('Sismos','Compara la célula animal y vegetal.',context)).toBeNull()
  expect(resolveCommonScienceTask('Sismos','Explica los sismos.',{...context,grade:2})).toBeNull()
  expect(resolveCommonScienceTask('Sismos','Explica los sismos.',{...context,optativeExitName:'Ciencias y Tecnología'})).toBeNull()
 })
 it('recursos y ejemplos no se convierten en tareas',()=>{
  const p=propose('Explica el ciclo del agua. Recursos: dibujo del suelo y materiales para construir un filtro.')
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-1-water-cycle-'))).toBe(true)
  expect(p.criteria.some(c=>/representation|experiment/.test(c.templateId))).toBe(false)
 })
 it('inferencia de estrategia prudente',()=>expect(detectTeachingStrategy({...context,description:'Analiza un problema sobre sismos.'}).id).toBeNull())
 it('propósito de los formatos y elección manual independiente',()=>{
  const task=resolveCommonScienceTask('Actividad','Identifica las capas de la Tierra.',context)!
  expect(commonScienceCriteria(task).length).toBeGreaterThan(0)
  expect(commonScienceSelections(task,'Identifica las capas de la Tierra.').suggestedInstrumentType).toBe('lista-cotejo')
  for(const f of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35]){
   const p=propose('Identifica las capas de la Tierra.',f,total)
   expect(p.instrumentType).toBe(f);expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  }
 })
})
