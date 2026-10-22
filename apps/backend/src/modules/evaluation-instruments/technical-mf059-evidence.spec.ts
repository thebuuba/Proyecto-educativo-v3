import {describe,it,expect} from 'vitest'
import {resolveTechnicalTask,technicalCriteria,technicalSelections,technicalModules} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'MF_059_3',subjectName:'Diseño de Portales Web y Recursos Multimedia',modalityCode:'technical_professional',optativeExitName:null}
describe('MF059: propósito web y requisitos observables',()=>{
 it('una consigna de dosacciones no cruza las referencias oficiales de sus temas',()=>{
  const topics=technicalModules.find(m=>m.moduleCode==='MF_059_3')!.topics
  expect(topics.find(t=>t.id==='image-attributes')!.sourceRecordIds).not.toContain('ifc006-mf059-CE7.3.1')
  expect(topics.find(t=>t.id==='navigation-diagram')!.sourceRecordIds).not.toContain('ifc006-mf059-CE7.2.4')
 })
 it('definir regiones de un mapa produce un diseño, no una descripción',()=>{
  const task=resolveTechnicalTask('','Define las regiones del mapa de imagen HTML según las zonas dadas.',context)!
  expect(task.activityType).toBe('PROJECT');expect(technicalCriteria(task).map(r=>r.templateId)).toEqual(['technical-mf059-image-map-regions-design'])
 })
 it.each([
  ['Modifica el color de la imagen del diseño web según la muestra dada.',/espacio|finalidad/],
  ['Modifica la opacidad de la animación del diseño web según la muestra dada.',/duración|secuencia/],
  ['Aplica la animación dada al recurso web en la posición indicada.',/secuencia/],
  ['Documenta el fichero HTML de práctica describiendo únicamente su estructura.',/decisiones de diseño/],
  ['Comprueba la accesibilidad de la página web según la condición indicada.',/herramienta/],
  ['Identifica las características de los programas de diseño web de las fichas.',/función de cada/],
 ] as const)('no añade otro requisito a %s',(description,unrequested)=>{
  const rows=technicalCriteria(resolveTechnicalTask('',description,context)!)
  expect(rows.length).toBeGreaterThan(0);expect(JSON.stringify(rows)).not.toMatch(unrequested)
 })
 it.each(['MP3','WAV','MIDI'])('describir únicamente%s no impone otrosformatos',format=>{
  const rows=technicalCriteria(resolveTechnicalTask('',`Describe el formato de sonido ${format} de la ficha para el recurso web.`,context)!)
  expect(rows).toHaveLength(1);expect(rows[0].title).toContain(format)
  for(const other of ['MP3','WAV','MIDI'].filter(f=>f!==format))expect(JSON.stringify(rows)).not.toContain(other)
 })
 it('MIDI es un nombre de formato, no una acción de medir que duplique criterios',()=>{
  const task=resolveTechnicalTask('','Compara los formatos de sonido MP3, WAV y MIDI de la ficha.',context)!
  expect(task.actions).toHaveLength(1);const rows=technicalCriteria(task)
  expect(rows).toHaveLength(3);expect(rows.every(r=>r.templateId.endsWith('-comparison'))).toBe(true)
 })
 it.each(['PHP','JavaScript'])('clasificar únicamente%s no exige losotroslenguajes',name=>{
  const rows=technicalCriteria(resolveTechnicalTask('',`Clasifica ${name} de la ficha histórica según su función en el desarrollo web.`,context)!)
  expect(rows).toHaveLength(1);expect(rows[0].title).toContain(name)
  for(const other of ['HTML','PHP','Java','JavaScript','ASP'].filter(n=>n!==name))expect(JSON.stringify(rows)).not.toMatch(new RegExp('\\b'+other+'\\b'))
 })
 it('utilizar el sitio y comprobar suusabilidad conservan evidencias distintas',()=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Utiliza el sitio web de práctica para realizar el recorrido dado y comprobar su usabilidad.',context)!)
  expect(rows).toHaveLength(2);expect(rows.find(r=>r.templateId.endsWith('-application'))?.observable).toMatch(/recorrido/)
  expect(rows.find(r=>r.templateId.endsWith('-verification'))?.observable).toMatch(/facilidad|dificultad|obstáculos/)
 })
 it.each([
  ['Define la accesibilidad web con el ejemplo dado.','description','ANALYSIS'],
  ['Define la usabilidad web con el ejemplo dado.','description','ANALYSIS'],
  ['Documenta el fichero HTML de práctica según su estructura.','creation','PROJECT'],
  ['Inserta el audio dado en la página web de práctica.','application','EXERCISE_SET'],
  ['Modifica la imagen proporcionada para el espacio del diseño web.','application','EXERCISE_SET'],
  ['Configura los recursos de video de la página web de práctica.','configuration','EXERCISE_SET'],
  ['Cambia el color del texto de la página web de práctica.','application','EXERCISE_SET'],
  ['Desactiva el elemento del formulario HTML indicado.','application','EXERCISE_SET'],
  ['Vincula las regiones del mapa de imagen HTML con los destinos dados.','application','EXERCISE_SET'],
  ['Adapta el sitio web de práctica al problema de usabilidad indicado.','application','EXERCISE_SET'],
  ['Prueba la página web local en los dos navegadores indicados.','verification','OBSERVATION'],
  ['Comprueba la accesibilidad de la página web de práctica según el criterio dado.','verification','OBSERVATION'],
 ] as const)('%s',(description,mode,type)=>{
  const task=resolveTechnicalTask('Título antiguo sobre células',description,context)!
  expect(task).not.toBeNull();expect(task.activityType).toBe(type)
  expect(technicalCriteria(task).every(r=>r.templateId.endsWith('-'+mode))).toBe(true)
 })
 it('las dos opciones de herramienta se reconocen como alternativas completas',()=>{
  const task=resolveTechnicalTask('','Selecciona el software o el hardware para el diseño web según la alternativa elegida y los requisitos dados.',context)!
  expect(task.alternatives).toHaveLength(2);expect(technicalCriteria(task)).toHaveLength(1)
  expect(task.alternatives!.map(t=>technicalCriteria(t)[0].templateId)).toEqual(['technical-mf059-software-selection-selection','technical-mf059-hardware-selection-selection'])
 })
 it('el sustantivo documentoHTML no impone documentar el fichero',()=>{
  const task=resolveTechnicalTask('','Elabora la estructura básica del documento HTML de práctica según el contenido dado.',context)!
  expect(technicalCriteria(task).map(r=>r.templateId)).toEqual(['technical-mf059-html-structure-representation'])
 })
 it('describir atributos no obliga a insertar ni modificar una imagen',()=>{
  const rows=technicalCriteria(resolveTechnicalTask('','Describe los atributos de la imagen HTML proporcionada.',context)!)
  expect(rows.map(r=>r.templateId)).toEqual(['technical-mf059-image-attributes-description'])
  expect(rows[0].observable).not.toMatch(/inserta|modifica|instala/i)
 })
 it('el diseño de usabilidad no agrega accesibilidad ni publicación',()=>{
  const task=resolveTechnicalTask('','Diseña un sitio web usable para la tarea del usuario indicada.',context)!,rows=technicalCriteria(task)
  expect(rows.map(r=>r.templateId)).toEqual(['technical-mf059-usability-design-design'])
  expect(JSON.stringify(rows)).not.toMatch(/accesibilidad|publica|contrata|cuenta real/i)
  expect(technicalSelections(task,'Diseña un sitio web usable para la tarea indicada.').suggestedInstrumentType).toBe('rubrica')
 })
})
