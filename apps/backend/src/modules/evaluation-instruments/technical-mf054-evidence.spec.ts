import {describe,it,expect} from 'vitest'
import {resolveTechnicalTask,technicalCriteria,technicalSelections} from '@aula/shared'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'MF_054_3',subjectName:'Desarrollo de Aplicaciones y Sistemas de Información',modalityCode:'technical_professional',optativeExitName:null}
describe('MF054: propósito y evidencias sin requisitos añadidos',()=>{
 it('conserva salidas y validación cuando ambas se piden como productos',()=>{
  const task=resolveTechnicalTask('','Desarrolla las salidas del sistema y la validación de datos según el diseño dado.',context)!
  expect(task.actions.flatMap(a=>a.topics.map(t=>t.id))).toEqual(['output-screen','validation'])
 })
 it.each([
  ['Selecciona el lenguaje de programación según la ficha.','ANALYSIS','lista-cotejo'],
  ['Compara los lenguajes de programación de la ficha.','COMPARISON','rubrica'],
  ['Desarrolla las consultas del sistema de práctica según los requisitos.','PROJECT','lista-cotejo'],
  ['Diseña las interfaces entre módulos según el contrato dado.','PROJECT','rubrica'],
  ['Aplica el patrón de diseño indicado al programa de práctica.','EXERCISE_SET','lista-cotejo'],
  ['Aplica el proceso de respaldo a los datos ficticios según el procedimiento dado.','EXERCISE_SET','lista-cotejo'],
  ['Ejecuta las funciones del programa de práctica con los datos de prueba dados.','OBSERVATION','lista-cotejo'],
  ['Codifica las funciones del programa con crédito parcial y pesos por componente.','PROJECT','lista-ponderada'],
 ] as const)('%s',(description,type,instrument)=>{
  const task=resolveTechnicalTask('Título antiguo de inglés',description,context)!
  expect(task).not.toBeNull()
  expect(task.activityType).toBe(type)
  expect(technicalSelections(task,description).suggestedInstrumentType).toBe(instrument)
 })
 it('hereda codificar en ambas alternativas sin confundir programa con una acción',()=>{
  const task=resolveTechnicalTask('','Codifica las condiciones o las iteraciones del programa de práctica según la ficha.',context)!
  expect(task.alternatives).toHaveLength(2)
  expect(task.alternatives!.flatMap(technicalCriteria).map(c=>c.templateId)).toEqual(['technical-mf054-conditions-coding','technical-mf054-iterations-coding'])
 })
 it('identifica lenguajes sin la expresión redundante identifica la identificación',()=>{
  const task=resolveTechnicalTask('','Identifica los lenguajes de programación según sus características.',context)!
  expect(technicalCriteria(task)[0].observable).toBe('Identifica los lenguajes presentes y sus características según la documentación de la ficha.')
 })
 it.each(['Opcionalmente puedes consultar un ejemplo de credenciales.','Si lo deseas, consulta un ejemplo de credenciales.','Puedes consultar tres ejemplos de credenciales.'])('no añade una cantidad obligatoria a un recurso opcional: %s',optional=>{
  const p=recommend({activityTitle:'Actividad',description:'Reconoce los criterios de acceso del sistema ficticio. '+optional,maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['technical-mf054-access-policy-identification'])
 })
 it('conserva una entrega real después del recurso opcional',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Reconoce los criterios de acceso del sistema ficticio. Opcionalmente puedes consultar un ejemplo de credenciales. Entrega el análisis en PDF.',maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.at(-1)?.description).toContain('archivo en PDF')
  expect(p.criteria.at(-1)?.description).not.toContain('ejemplo')
 })
})
