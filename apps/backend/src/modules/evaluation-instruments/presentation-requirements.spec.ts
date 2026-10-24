import {describe,it,expect} from 'vitest'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {recommend} from './recommendation-engine'
import {extractTaskRequirements} from '../../../../../packages/shared/src/task-presentation-requirements'
import {reconcileTaskCriteria} from '../../../../../packages/shared/src/task-requirement-criteria'
import {formatAuthoredCriteria} from '../../../../../packages/shared/src/authored-instrument-format'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/presentation-requirements/cases.json'),'utf8'))
const huerto=bank.cases[0]
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',modalityCode:null,optativeExitName:null}
describe('Requisitos transversales: expectativas fijadas antes de corregir',()=>{
 const task=(id:string)=>bank.cases.find((c:any)=>c.id===id)
 const parse=(id:string)=>extractTaskRequirements(task(id).description)
 it('conserva ámbitos, valores dinámicos y origen literal',()=>{
  const r=parse('scoped-type')
  expect(r.conditions).toEqual(expect.arrayContaining([
   expect.objectContaining({property:'font',values:['Aptos'],scope:'documento'}),
   expect.objectContaining({property:'font-size',values:['13,5'],scope:'documento'}),
   expect.objectContaining({property:'font-size',values:['18'],scope:'título'}),
   expect.objectContaining({property:'font-size',values:['12'],scope:'cuerpo'}),
   expect.objectContaining({property:'emphasis',values:['negrita'],scope:'titular'}),
   expect.objectContaining({property:'line-spacing',values:['1,5'],scope:'cuerpo'}),
   expect.objectContaining({property:'indent',values:['1,25'],unit:'cm',scope:'cuerpo'}),
   expect.objectContaining({property:'alignment',values:['justificado'],scope:'cuerpo'}),
  ]))
  expect(r.issues).toEqual([])
  for(const c of r.conditions)expect(task('scoped-type').description.slice(c.origin.start,c.origin.end)).toBe(c.origin.text)
 })
 it('conserva cantidades y ubicación de imágenes/tablas, pies, referencias y estilo',()=>{
  const r=parse('structure-evidence')
  expect(r.conditions).toEqual(expect.arrayContaining([
   expect.objectContaining({property:'images',values:['dos'],scope:'desarrollo'}),
   expect.objectContaining({property:'captions',scope:'desarrollo'}),
   expect.objectContaining({property:'tables',values:['una'],scope:'anexos'}),
   expect.objectContaining({property:'charts',values:['un'],scope:'cuerpo'}),
   expect.objectContaining({property:'reference-style',values:['APA 7']}),
   expect.objectContaining({property:'bibliography'}),
  ]))
 })
 it('mínimos, máximos, aproximación y exclusión conservan ámbito y unidades',()=>{
  expect(parse('bounds').conditions).toEqual(expect.arrayContaining([
   expect.objectContaining({property:'extent',values:['800'],unit:'palabras',operator:'MAX',scope:'documento'}),
   expect.objectContaining({property:'extent',values:['dos'],unit:'párrafos',operator:'MIN',scope:'introducción'}),
   expect.objectContaining({property:'extent',values:['cuatro'],operator:'APPROX',scope:'cuerpo'}),
   expect.objectContaining({property:'section',values:['portada'],relation:'NEGATED'}),
  ]))
 })
 it.each([
  ['Usen Arial 13.','font-size','13'],['Letra Arial tamaño 14.','font-size','14'],
  ['Fuente Calibri de 11 puntos.','font-size','11'],['Interlineado doble.','line-spacing','doble'],
  ['Interlineado 1,75.','line-spacing','1,75'],['Alineación centrada.','alignment','centrada'],
  ['Alineado a la derecha.','alignment','alineado a la derecha'],['Papel carta.','paper-size','carta'],
  ['Orientación vertical.','orientation','vertical'],['Separación entre párrafos de 6 pt.','paragraph-spacing','6'],
 ])('extrae una construcción independiente: %s',(text,property,value)=>{
  expect(extractTaskRequirements(text).conditions).toContainEqual(expect.objectContaining({property,values:[value]}))
 })
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`huerto ${format}: condiciones vinculadas una vez y totales exactos`,()=>{
  for(const maxScore of [20,17.35]){
   const p=recommend({activityTitle:huerto.title,description:huerto.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
   expect(p.totalScoreUnits).toBe(Math.round(maxScore*100))
   expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   const ids=p.criteria.flatMap(c=>c.taskConditionIds??[])
   expect(new Set(ids).size).toBe(ids.length)
   expect(p.criteria.filter(c=>c.templateId.startsWith('delivery-format')).reduce((s,c)=>s+c.maxScoreUnits,0)).toBeLessThan(p.totalScoreUnits*.2)
   for(const c of p.internalTrace.taskRequirements!.conditions.filter(c=>['REQUIRED','ALTERNATIVE'].includes(c.relation)))expect(ids).toContain(c.id)
   expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  }
 })
 it('no puntúa opciones tipográficas ni imágenes opcionales; la portada no se exige',()=>{
  const c=task('optional-negative')
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},{...context,grade:2},null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>[c.description,...(c.progressionLevels??[])].join(' ')).join('\n')).not.toMatch(/Calibri|tamaño de letra 14|dos imágenes/)
  expect(JSON.stringify(p.criteria)).toContain('sin portada')
 })
 it('archivo OR, extensión excluida, margen por lado y numeración',()=>{
  expect(parse('page-delivery').conditions).toEqual(expect.arrayContaining([
   expect.objectContaining({property:'file-format',values:['Word','PDF'],relation:'ALTERNATIVE'}),
   expect.objectContaining({property:'extent',values:['2','4'],operator:'RANGE',exclusion:'sin contar la portada'}),
   expect.objectContaining({property:'margin',values:['3'],scope:'margen izquierdo'}),
   expect.objectContaining({property:'page-number-start',values:['2']}),
  ]))
 })
 it('mantiene opciones, condición y negación sin convertirlas en obligaciones',()=>{
  expect(parse('optional-negative').conditions).toEqual(expect.arrayContaining([
   expect.objectContaining({property:'font',relation:'OPTIONAL'}),
   expect.objectContaining({property:'section',values:['portada'],relation:'NEGATED'}),
   expect.objectContaining({property:'captions',relation:'CONDITIONAL'}),
  ]))
 })
 it('no interpreta números narrativos, citas ni ejemplos como formato',()=>{
  expect(parse('narrative-quote').conditions.filter(c=>['font','font-size','images'].includes(c.property))).toEqual([])
  expect(parse('brief').conditions).toEqual([])
 })
 it.each([
  'Compara tipografía y caligrafía del mismo poema. No se pide cambiar la fuente ni redactar una conclusión aparte.',
  'Escribe un fragmento de novela con diálogos en estilo directo y voces diferenciadas.',
  'Examina las fuentes históricas proporcionadas y selecciona una fuente pertinente al caso.',
 ])('no confunde contenido académico con formato: %s',text=>{
  expect(extractTaskRequirements(text).conditions.filter(c=>['font','font-size','reference-style'].includes(c.property))).toEqual([])
 })
 it('el nombre del archivo conserva extensión, mayúsculas y números',()=>{
  expect(extractTaskRequirements('Nombre del archivo: Grupo_2_Datos.docx.').conditions).toContainEqual(expect.objectContaining({property:'filename',values:['Grupo_2_Datos.docx']}))
 })
 it('cantidad de gráficos se conserva una sola vez en los componentes del cotejo',()=>{
  const p=['Representa los datos.','Representa los datos con un detalle ausente.','Representa parte de los datos.','Altera los datos.','No representa los datos.'] as [string,string,string,string,string]
  const rows=reconcileTaskCriteria([{templateId:'existing-chart',title:'Gráfico de datos',observable:p[0],progressionLevels:p,weight:3,checklistParts:[{key:'bars',observable:'Las barras representan los datos.',progressionLevels:p},{key:'axis',observable:'Los ejes permiten leer los valores.',progressionLevels:p}]}],'Incluyan dos gráficos.')
  const checks=formatAuthoredCriteria(rows,'lista-cotejo')
  expect(checks).toHaveLength(2)
  expect(checks.filter(c=>c.observable.includes('dos gráficos'))).toHaveLength(1)
  const ids=checks.flatMap(c=>c.coveredTaskConditionIds??[])
  expect(new Set(ids).size).toBe(ids.length)
 })
 it('un mínimo y un máximo en palabras incompatibles se conservan como conflicto',()=>{
  expect(extractTaskRequirements('Mínimo cinco páginas y máximo tres páginas.').issues.some(i=>i.kind==='CONFLICT')).toBe(true)
 })
 it('conflictos son datos internos sin excepción ni resolución silenciosa',()=>{
  const r=parse('contradiction');expect(r.issues.length).toBeGreaterThanOrEqual(3)
  expect(r.conditions.filter(c=>c.property==='font-size').flatMap(c=>c.values)).toEqual(['12','14'])
  const c=task('contradiction')
  const proposal=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(proposal.criteria.map(c=>c.description).join(' ')).not.toContain('sin portada')
 })
 it('reconoce familias no cerradas de fuentes y valores nuevos sin cambiar reglas',()=>{
  for(const [id,font,size] of [['custom-font-format','Liberation Serif','10.5'],['dynamic-variants','Garamond','11,75']]){
   const r=parse(id)
   expect(r.conditions).toContainEqual(expect.objectContaining({property:'font',values:[font]}))
   expect(r.conditions).toContainEqual(expect.objectContaining({property:'font-size',values:[size]}))
  }
 })
 it('huerto: integra tres párrafos en cuerpo, cita atribuida y negrita del titular',()=>{
  const p=recommend({activityTitle:huerto.title,description:huerto.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  const structure=p.criteria.find(c=>c.templateId==='news-structure')!
  expect(structure.description).toMatch(/cuerpo[^.;]*tres párrafos|tres párrafos[^.;]*cuerpo/)
  expect(p.criteria.find(c=>c.templateId==='news-essential')?.description).toMatch(/cantidades|datos proporcionados/)
  expect(p.criteria.some(c=>/declaración|cita/.test(c.title+' '+c.description)&&/comillas/.test(c.description)&&/atribui/.test(c.description))).toBe(true)
  expect(p.criteria.some(c=>/titular[^.;]*negrita|negrita[^.;]*titular/.test(c.description))).toBe(true)
  expect(JSON.stringify(p.criteria)).not.toMatch(/entrevista|fotografías|borrador|investiga nuevas/)
 })
})
