import {describe,expect,it} from 'vitest'
import {resolveTechnicalTask,technicalCriteria,technicalSelections} from '../../../../../packages/shared/src/secondary-technical'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'MF_002_3',modalityCode:'technical_professional'}
const rows=(description:string)=>technicalCriteria(resolveTechnicalTask('Actividad de otro tema',description,context)!)
describe('Ofimática: lectura disciplinar de los instrumentos',()=>{
 it('tabulaciones de formato no se convierten en tabular datos',()=>{
  const criteria=rows('Aplica fuente, párrafos, sangrías y tabulaciones al documento de texto según el modelo dado.')
  expect(criteria.map(r=>r.templateId)).toEqual(['technical-mf002-text-format-application'])
  expect(criteria[0].observable).not.toMatch(/manteniendo la aplicación|Tabula/)
 })
 it('reorganizar bloques de creación no inventa crear otro documento',()=>{
  expect(rows('Reorganiza el esquema de títulos y los bloques de creación del documento.').map(r=>r.templateId)).toEqual(['technical-mf002-word-outline-sequence'])
 })
 it('archivo adjunto no se interpreta como la orden de archivar',()=>{
  expect(rows('Redacta un correo simulado con asunto, destinatario ficticio y archivo adjunto según la ficha.').map(r=>r.templateId)).toEqual(['technical-mf002-email-draft-creation'])
 })
 it('comprueba conserva la verificación explícita',()=>{
  const criteria=rows('Comprueba y corrige los errores de la presentación de diapositivas antes de guardar la versión solicitada.')
  expect(criteria.map(r=>r.templateId)).toEqual(['technical-mf002-slide-review-verification','technical-mf002-slide-review-correction'])
 })
 it('registrar la práctica de teclado evalúa las mediciones y no vuelve a pedir la transcripción',()=>{
  const recording=rows('Practica mecanografía con el texto dado y registra velocidad y precisión.').find(r=>r.templateId.endsWith('-recording'))!
  expect(recording.observable).toMatch(/mediciones|velocidad.*precisión/)
  expect(recording.observable).not.toMatch(/fidelidad del texto transcrito/)
 })
 it('distinguir hardware de software no exige además clasificar software de sistema y de aplicación',()=>{
  const criteria=rows('Distingue hardware y software del equipo de la ficha.')
  expect(JSON.stringify(criteria)).not.toMatch(/programas de sistema y de aplicación/)
 })
 it('no impone200palabras ni envío real al crear un documento o preparar un correo',()=>{
  expect(JSON.stringify(rows('Crea un documento de texto con los datos dados.'))).not.toMatch(/200|por minuto|conserva la conservación/)
  expect(JSON.stringify(rows('Redacta un correo simulado con los datos dados.'))).not.toMatch(/Envía|envío real|cuenta real|contraseña/)
 })
 it('insertar una tabla y organizar sus datos tienen evidencias diferentes',()=>{
  const criteria=rows('Inserta una tabla en el documento de texto y organiza los datos dados en sus celdas.')
  expect(criteria.find(r=>r.templateId.endsWith('-application'))!.observable).toMatch(/estructura/)
  expect(criteria.find(r=>r.templateId.endsWith('-sequence'))!.observable).toMatch(/ubicación/)
 })
 it('ordena registros de la tabla sin repetir la evaluación de su fórmula',()=>{
  const criteria=rows('Aplica una fórmula y ordena los datos de la tabla del procesador de textos según la ficha.')
  expect(criteria.find(r=>r.templateId.endsWith('-application'))!.observable).toMatch(/fórmula/)
  expect(criteria.find(r=>r.templateId.endsWith('-sequence'))!.observable).toMatch(/orden indicado/)
 })
 it('comparar documentos no exige combinarlos cuando no se pide',()=>{
  expect(JSON.stringify(rows('Compara las dos versiones del documento de texto proporcionadas.'))).not.toMatch(/combinarlas|combina|Combina/)
 })
 it('justificar la comparación tampoco exige combinar los documentos',()=>{
  const criteria=rows('Compara las dos versiones del documento de texto del caso concreto y justifica tu decisión con los datos dados.')
  expect(criteria.map(r=>r.templateId)).toEqual(['technical-mf002-word-comparison-comparison','technical-mf002-word-comparison-justification'])
  expect(JSON.stringify(criteria)).not.toMatch(/combinarlas|combina|Combina/)
 })
 it('crear, duplicar y organizar hojas con objeto compartido conserva las tres acciones',()=>{
  const criteria=rows('Crea, duplica y organiza las hojas del libro de cálculo de práctica según la ficha.')
  expect(criteria.map(r=>r.templateId)).toEqual(['technical-mf002-workbooks-creation','technical-mf002-workbooks-application','technical-mf002-workbooks-sequence'])
  expect(criteria[1].observable).toMatch(/copia|duplicado/)
 })
 it('una tabla dinámica no exige un gráfico y un gráfico dinámico no duplica la fila genérica',()=>{
  expect(JSON.stringify(rows('Crea una tabla dinámica con los datos ficticios dados.'))).not.toMatch(/gráficos/)
  expect(rows('Crea un gráfico dinámico en la hoja de cálculo con los datos dados.').map(r=>r.templateId)).toEqual(['technical-mf002-pivot-table-creation'])
 })
 it('distingue el metabuscador cuando está pedido sin imponerlo a otra consigna',()=>{
  expect(JSON.stringify(rows('Distingue navegador, buscador y metabuscador según las funciones de la ficha.'))).toMatch(/varios buscadores/)
  expect(JSON.stringify(rows('Distingue navegador y buscador según la ficha.'))).not.toMatch(/varios buscadores/)
 })
 it('las redacciones de identificación y presentación evitan repetir el verbo como sustantivo',()=>{
  expect(JSON.stringify(rows('Identifica las condiciones de autoría de las fuentes digitales.'))).not.toMatch(/Identifica la identificación/)
  expect(JSON.stringify(rows('Elabora una presentación de diapositivas con la información dada.'))).not.toMatch(/conserva la conservación/)
 })
 it('la frecuencia observada permite escala sin convertir un archivo de datos en observación',()=>{
  const description='Observa la organización de archivos y carpetas de práctica y registra la frecuencia de cumplimiento de las reglas dadas.'
  const task=resolveTechnicalTask('',description,context)!
  expect(task.activityType).toBe('OBSERVATION')
  expect(technicalSelections(task,description).suggestedInstrumentType).toBe('escala')
  const regular=resolveTechnicalTask('','Organiza archivos y carpetas ficticios según la ficha.',context)!
  expect(technicalSelections(regular,'Organiza archivos y carpetas ficticios según la ficha.').suggestedInstrumentType).toBe('lista-cotejo')
 })
 it('exportar con pronombre conserva una segunda acción sobre la presentación',()=>{
  const criteria=rows('Configura una presentación personalizada y expórtala a vídeo según las opciones de la ficha.')
  expect(criteria.map(r=>r.templateId)).toEqual(['technical-mf002-slide-config-configuration','technical-mf002-slide-config-application'])
  expect(criteria[1].observable).toMatch(/archivo exportado/)
 })
 it('la fila de registro de frecuencia evalúa las observaciones registradas',()=>{
  const criteria=rows('Observa la organización de archivos y carpetas de práctica y registra la frecuencia de cumplimiento de las reglas dadas.')
  expect(criteria.find(r=>r.templateId.endsWith('-recording'))!.observable).toMatch(/frecuencia.*observaciones|observaciones.*frecuencia/)
 })
 it('el gráfico dinámico conserva su representación y no solo el resumen tabular',()=>{
  expect(rows('Crea un gráfico dinámico en la hoja de cálculo con los datos dados.')[0].observable).toMatch(/representación.*gráfic|gráfic.*representación/)
 })
 it('comparar hardware y software no titula la fila como otra clasificación',()=>{
  expect(rows('Distingue hardware y software del equipo de la ficha.').find(r=>r.templateId.includes('-software-'))!.title).toBe('Comparación: Software del equipo')
 })
 it('reorganizar un documento es una práctica verificable y no análisis por defecto',()=>{
  expect(resolveTechnicalTask('','Reorganiza el esquema de títulos y los bloques de creación del documento.',context)!.activityType).toBe('EXERCISE_SET')
 })
})
