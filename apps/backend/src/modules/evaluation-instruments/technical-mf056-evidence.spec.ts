import {describe,it,expect} from 'vitest'
import {resolveTechnicalTask,technicalCriteria,technicalSelections} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'MF_056_3',subjectName:'Diseño y Desarrollo de Base de Datos',modalityCode:'technical_professional',optativeExitName:null}
describe('MF056: propósito y evidencias propias de bases de datos',()=>{
 it.each([
  ['Describe la consulta SQL dada según su resultado.','ANALYSIS','lista-cotejo'],
  ['Crea la consulta SQL de la base de datos de práctica según los requisitos.','PROJECT','lista-cotejo'],
  ['Diseña el diccionario de datos del modelo ficticio.','PROJECT','rubrica'],
  ['Aplica la normalización al modelo de datos ficticio.','EXERCISE_SET','lista-cotejo'],
  ['Compara las funciones de los gestores de bases de datos de la ficha.','COMPARISON','rubrica'],
  ['Crea la tabla de práctica con crédito parcial y pesos por componente.','PROJECT','lista-ponderada'],
 ] as const)('%s',(description,type,instrument)=>{
  const task=resolveTechnicalTask('Título antiguo',description,context)!
  expect(task).not.toBeNull();expect(task.activityType).toBe(type);expect(technicalSelections(task,description).suggestedInstrumentType).toBe(instrument)
 })
 it('distingue describir, diseñar y crear el diccionario sin imponer las otrasacciones',()=>{
  const criteria=['Describe','Diseña','Crea'].map(verb=>technicalCriteria(resolveTechnicalTask('',verb+' el diccionario de datos del modelo ficticio.',context)!))
  expect(criteria.map(rows=>rows[0].templateId)).toEqual(['technical-mf056-data-dictionary-description','technical-mf056-data-dictionary-design','technical-mf056-data-dictionary-creation'])
  expect(criteria[0][0].observable).not.toMatch(/crea|configura|implementa/i)
 })
 it('FROM yWHERE conservan la relación específica de su cláusula',()=>{
  const from=technicalCriteria(resolveTechnicalTask('','Explica el efecto de la cláusula FROM en la consulta SQL dada.',context)!)[0]
  const where=technicalCriteria(resolveTechnicalTask('','Explica el efecto de la cláusula WHERE en la consulta SQL dada.',context)!)[0]
  expect(from.observable).toMatch(/tablas|origen/);expect(from.observable).not.toMatch(/filtra|agrupa/i)
  expect(where.observable).toMatch(/condici|filtr/);expect(where.observable).not.toMatch(/agrupa/i)
 })
 it('seleccionar alta disponibilidad no impone implementarla',()=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Selecciona la estrategia de alta disponibilidad de la base de datos según el escenario ficticio.',context)!)
  expect(rows).toHaveLength(1);expect(rows[0].observable).not.toMatch(/instala|implementa|configura|contrata/i)
 })
 it('la alternativa hereda crear y no obliga a entregar ambosobjetos',()=>{
  const task=resolveTechnicalTask('','Crea la vista o el procedimiento almacenado de la base de datos de práctica según la alternativa elegida.',context)!
  expect(task.alternatives).toHaveLength(2);expect(technicalCriteria(task)).toHaveLength(1)
  expect(task.alternatives!.flatMap(technicalCriteria).every(r=>r.templateId.endsWith('-creation'))).toBe(true)
 })
 it('eliminar un índice comprueba su ausencia y conserva los otros objetos',()=>{
  const removed=technicalCriteria(resolveTechnicalTask('','Elimina el índice indicado de la base de datos de práctica usando DROP INDEX.',context)!)[0]
  const created=technicalCriteria(resolveTechnicalTask('','Crea el índice de la tabla ficticia según la necesidad dada.',context)!)[0]
  expect(removed.observable).toMatch(/ausencia del índice/)
  expect(removed.observable).toMatch(/conservación de los demás objetos/)
  expect(created.observable).not.toMatch(/ausencia|eliminad/)
 })
 it.each([
  ['relacional',/tablas.*claves/],['jerárquico',/árbol.*padre.*hijos/],['en red',/registros.*múltiples vínculos/],
 ] as const)('distingue la estructura del modelo %s',(model,pattern)=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Diseña el modelo de datos '+model+' para los requisitos del caso ficticio.',context)!)
  expect(rows).toHaveLength(1);expect(rows[0].observable).toMatch(pattern)
 })
 it.each([
  ['Failover Clustering',/nodos.*conmutación/],['Real Application Clustering',/instancias.*base de datos compartida/],
  ['Database Mirroring',/principal.*espejo/],['Database Replication',/distribución.*sincronización/],
  ['Log Shipping',/copias.*registros de transacciones.*secundaria/],['Always On Availability Groups',/grupo.*réplicas/],
 ] as const)('describe el funcionamiento propio de %s sin exigir instalarlo',(name,pattern)=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Describe la estrategia '+name+' de la base de datos ficticia según los recursos y requisitos dados.',context)!)
  expect(rows).toHaveLength(1);expect(rows[0].observable).toMatch(pattern)
  expect(rows[0].observable).not.toMatch(/instala|configura|implementa|contrata/i)
 })
 it.each([
  ['nombre',/identificador.*campo/],['tipo',/tipo.*valores admitidos/],['tamaño',/capacidad.*campo/],
  ['alias',/nombre alternativo.*campo/],['contenido',/significado.*valores del campo/],['organización',/organización.*campos.*relaciones/],
 ] as const)('explica solo la propiedad %s del diccionario',(property,pattern)=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Explica la propiedad '+property+' del diccionario de datos del modelo ficticio proporcionado.',context)!)
  expect(rows).toHaveLength(1);expect(rows[0].observable).toMatch(pattern)
  expect(rows[0].templateId).not.toBe('technical-mf056-data-dictionary-explanation')
 })
 it('describir las funciones de un gestor no exige analizar necesidades institucionales',()=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Describe los gestores de bases de datos de la ficha y su función.',context)!)
  expect(rows[0].observable).not.toMatch(/necesidades/)
 })
 it.each([
  'Diseña el modelo de datos relacional o jerárquico para el caso ficticio.',
  'Describe la estrategia Database Mirroring o Database Replication de la base de datos ficticia.',
  'Explica la propiedad nombre o alias del diccionario de datos del modelo ficticio.',
 ])('las alternativas abreviadas de un mismo aspecto no exigen ambas entregas: %s',description=>{
  const rows=technicalCriteria(resolveTechnicalTask('',description,context)!)
  expect(rows).toHaveLength(1);expect(rows[0].observable).toMatch(/alternativa elegida/)
 })
 it('la conjunción conserva ambas estructuras de modelos expresamente solicitadas',()=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Diseña el modelo de datos relacional y jerárquico para el caso ficticio.',context)!)
  expect(rows).toHaveLength(2);expect(rows[0].observable).not.toMatch(/alternativa elegida/)
 })
})
