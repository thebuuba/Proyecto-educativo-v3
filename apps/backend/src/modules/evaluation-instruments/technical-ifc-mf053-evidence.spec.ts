import {describe,expect,it} from 'vitest'
import {resolveTechnicalTask,technicalCriteria,technicalSelections} from '../../../../../packages/shared/src/secondary-technical'

const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'MF_053_3',modalityCode:'technical_professional'}
const task=(description:string)=>resolveTechnicalTask('Entrevista de trabajo en inglés',description,context)
const rows=(description:string)=>technicalCriteria(task(description)!)
const allText=(description:string)=>JSON.stringify(rows(description))

describe('MF053: evidencia técnica independiente de las ciencias y de la cuenta QA',()=>{
 it('separa las tres dimensiones de factibilidad y no añade una no solicitada',()=>{
  expect(task('Analiza la factibilidad económica, técnica y operacional del sistema ficticio.')?.actions.flatMap(a=>a.topics.map(t=>t.id))).toEqual(['feasibility-economic','feasibility-technical','feasibility-operational'])
  expect(rows('Analiza la factibilidad económica del sistema ficticio.')).toHaveLength(1)
  expect(allText('Analiza la factibilidad económica del sistema ficticio.')).not.toMatch(/recursos humanos|compatibilidad técnica/)
 })
 it('no exige aplicar una entrevista cuando solo se describe o diseña',()=>{
  const describe=rows('Describe una entrevista para conocer los requisitos del usuario.')
  expect(describe.some(r=>r.templateId.endsWith('-description'))).toBe(true)
  expect(JSON.stringify(describe)).not.toMatch(/Aplica la entrevista|respuestas obtenidas|respuestas registradas/)
  const design=allText('Diseña una entrevista para conocer los requisitos del usuario.')
  expect(design).toContain('Diseño')
  expect(design).not.toMatch(/Aplica la entrevista|respuestas obtenidas|respuestas registradas/)
 })
 it('aplicar una entrevista simulada exige respuestas y trazabilidad sin empresa real',()=>{
  const value=allText('Aplica una entrevista simulada al usuario ficticio del sistema.')
  expect(value).toContain('respuestas')
  expect(value).not.toMatch(/visita una empresa|contacta usuarios reales|hipótesis científica/)
 })
 it('mantiene la alternativa excluyente entre métodos de recopilación',()=>{
  const value=rows('Diseña una entrevista o elabora un cuestionario para el usuario ficticio del sistema.')
  expect(value).toHaveLength(1)
  expect(value[0].progressionLevels.every(l=>l.includes('O BIEN'))).toBe(true)
  expect(value[0].observable).toContain('alternativa elegida')
 })
 it('no exige ambos productos cuando la alternativa comparte el verbo',()=>{
  const value=rows('Elabora un árbol de decisión o una tabla de decisión con las reglas proporcionadas.')
  expect(value).toHaveLength(1)
  expect(value[0].observable).toContain('O BIEN')
 })
 it('separa clases y objetos cuando ambos están pedidos',()=>{
  expect(task('Identifica las clases y objetos del modelo proporcionado.')?.actions.flatMap(a=>a.topics.map(t=>t.id))).toEqual(['classes','objects'])
 })
 it('conserva organizar, justificar y proponer como acciones explícitas',()=>{
  expect(rows('Organiza los objetivos de la entidad para el sistema.')[0].templateId).toBe('technical-mf053-objectives-sequence')
  const method=rows('Selecciona el análisis estructurado y justifica su adecuación al caso.')
  expect(method.map(r=>r.templateId)).toEqual(['technical-mf053-method-structured-selection','technical-mf053-method-structured-justification'])
  const process=rows('Analiza los indicadores de procesos y propone una mejora de los procesos del caso.')
  expect(process.map(r=>r.templateId)).toEqual(['technical-mf053-process-measurement-analysis','technical-mf053-process-measurement-proposal'])
 })
 it('distingue aplicar la entrevista y registrar respuestas sin duplicar el diseño',()=>{
  const value=rows('Aplica una entrevista simulada y registra las respuestas.')
  expect(value.map(r=>r.templateId)).toEqual(['technical-mf053-interview-application','technical-mf053-interview-recording'])
  expect(value[1].observable).toMatch(/Registra las respuestas/)
  expect(value[1].observable).not.toMatch(/preguntas de la entrevista/)
  expect(value[0].observable).not.toMatch(/registra/)
 })
 it('no usa ni la acción negada ni el recurso opcional como entregable',()=>{
  const value=rows('Diseña una interfaz gráfica del sistema. No programes ni despliegues la aplicación. Opcionalmente puedes consultar un diagrama de clases.')
  expect(value.map(r=>r.templateId)).toEqual(['technical-mf053-interface-design'])
  expect(JSON.stringify(value)).not.toMatch(/diagrama de clases|Implementa el código|Despliega/)
 })
 it('conserva solo el diagrama pedido y no una colección de diagramas',()=>{
  expect(task('Dibuja el diagrama de casos de uso del sistema ficticio.')?.actions.flatMap(a=>a.topics.map(t=>t.id))).toEqual(['diagram-use-case'])
  expect(rows('Dibuja el diagrama de casos de uso del sistema ficticio.')).toHaveLength(1)
 })
 it('el significado técnico evita registros de asistencia, clases lectivas y vectores biológicos',()=>{
  for(const description of ['Describe los vectores del dengue.','Registra la asistencia de la clase.','Explica el sistema circulatorio.'])expect(task(description)).toBeNull()
 })
 it('los registros de archivo no convierten una escala en frecuencia',()=>{
  const resolved=task('Identifica los campos de los registros del archivo ficticio.')!
  expect(technicalSelections(resolved,'Identifica los campos de los registros del archivo ficticio.').suggestedInstrumentType).toBe('lista-cotejo')
 })
 it.each([
  ['Identifica los campos de los registros del archivo ficticio.','ANALYSIS'],
  ['Depura los registros del archivo ficticio según las reglas dadas.','ANALYSIS'],
  ['Identifica los tipos de símbolos del diagrama proporcionado.','ANALYSIS'],
  ['Selecciona los diagramas que corresponden a los requisitos dados.','ANALYSIS'],
  ['Enumera las fases del algoritmo proporcionado para resolver el caso.','ANALYSIS'],
  ['Utiliza expresiones lógicas para resolver las decisiones del caso.','ANALYSIS'],
  ['Dibuja el diagrama de clases del sistema.','PROJECT'],
  ['Redacta un informe sobre la factibilidad técnica del sistema.','REPORT'],
  ['Aplica la observación directa al proceso simulado del caso.','OBSERVATION'],
 ])('clasifica la acción principal, sin convertir el propósito o un sustantivo en otra acción: %s',(description,activityType)=>{
  expect(task(description)?.activityType).toBe(activityType)
 })
 it('la descripción prevalece sobre un título anterior incompatible',()=>{
  expect(rows('Representa la estructura básica de la base de datos del sistema ficticio.').every(r=>r.templateId.startsWith('technical-mf053-'))).toBe(true)
  expect(allText('Representa la estructura básica de la base de datos del sistema ficticio.')).not.toMatch(/inglés|pronunciación|fluidez oral/)
 })
 it('rechaza otros grados, modalidades, módulos y salidas incluso con nombre homónimo',()=>{
  for(const patch of [{grade:5},{cycle:1},{modalityCode:'academic'},{subjectCode:'MF_054_3'},{optativeExitName:'Ciencias y Tecnología'}])expect(resolveTechnicalTask('','Diseña una interfaz gráfica del sistema.',{...context,...patch})).toBeNull()
 })
 it('el contexto normalizado del creador puede inferir ciclo 2 desde cuarto',()=>{
  expect(resolveTechnicalTask('','Diseña una interfaz gráfica del sistema.',{...context,cycle:undefined})).not.toBeNull()
 })
})
