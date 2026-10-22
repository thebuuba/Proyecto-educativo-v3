import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/technical-mf058-five-contracts.json'
import source from '../../../../../docs/curriculum/cobertura-secundaria/technical-ifc006-mf058-5-matriz.json'
import {resolveTechnicalTask,technicalModules} from '../../../../../packages/shared/src/secondary-technical'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'

const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
describe('Análisis y Diseño de Reporte: acciones y cuatro instrumentos contextualizados',()=>{
 for(const test of contracts.cases){
  it(test.id+'/acciones solicitadas',()=>{
   const task=resolveTechnicalTask('Entrevista de trabajo en inglés',test.description,context)
   expect(task).not.toBeNull()
   expect([...new Set(task!.actions.flatMap(a=>a.topics.map(t=>t.id)))].sort()).toEqual([...test.topics].sort())
  })
  for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(test.id+'/'+instrumentType+'/'+maxScore,()=>{
   const p=recommend({activityTitle:'Entrevista de trabajo en inglés',description:test.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.criteria.every(r=>r.templateId.startsWith('technical-mf058-'))).toBe(true)
   expect(p.criteria.reduce((sum,r)=>sum+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   expect(p.instrumentType).toBe(instrumentType)
   expect(p.internalTrace.reasons).toContain('module=mf058-5')
   expect(JSON.stringify(p.criteria)).not.toMatch(/pronunciación|fluidez oral|hipótesis científica|talento innato|contraseña personal|crea una cuenta real/i)
   if('alternative' in test&&test.alternative)expect(p.criteria).toHaveLength(1)
   else for(const topic of test.topics)expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf058-'+topic+'-'))).toBe(true)
  })
 }
 it.each(contracts.negativeDescriptions)('no impone Análisis y Diseño de Reporte a una descripción incompatible: %s',description=>{
  expect(resolveTechnicalTask('Presentación de diapositivas',description,context)).toBeNull()
 })
 it.each([
  ['report-needs','analysis','ANALYSIS'],['report-type','selection','ANALYSIS'],['report-order','selection','ANALYSIS'],
  ['project-creation','creation','PROJECT'],['connection-ado','design','PROJECT'],['table-relations','design','PROJECT'],
  ['report-execution','execution,verification','OBSERVATION'],['tables-addition','application','EXERCISE_SET'],
  ['section-page-header','creation','PROJECT'],['format-dates','application','EXERCISE_SET'],
  ['column-width','configuration','EXERCISE_SET'],['groups','application','EXERCISE_SET'],
  ['filters','application,verification','EXERCISE_SET'],['data-order','sequence','EXERCISE_SET'],
  ['formulas','application,verification','EXERCISE_SET'],['functions','application,verification','EXERCISE_SET'],
  ['messages','configuration,verification','EXERCISE_SET'],['output-screen','application,verification','EXERCISE_SET'],
  ['output-storage','application,verification','EXERCISE_SET'],['output-print','creation','PROJECT'],
 ])('conserva el propósito explícito de %s',(id,mode,activityType)=>{
  const test=contracts.cases.find(c=>c.id===id)!
  const p=recommend({activityTitle:'Actividad',description:test.description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId.split('-').at(-1))).toEqual(mode.split(','));expect(p.activityType).toBe(activityType)
 })
 it('vincula adaptaciones a texto oficial sin evaluar actitudes privadas ni orientaciones docentes',()=>{
  const module=technicalModules.find(m=>m.moduleCode==='MF_058_3')
  expect(module).toBeDefined()
  const records=new Map(source.officialRecords.map(r=>[r.id,r]))
  for(const topic of module!.topics)for(const id of topic.sourceRecordIds){
   expect(records.has(id),id).toBe(true)
   expect(['ATTITUDE','TEACHING_STRATEGY']).not.toContain(records.get(id)!.type)
  }
 })
 it('el catálogo148 no incorpora el nuevo módulo retrospectivamente',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Crea y estructura un proyecto de reportes de práctica según los requisitos dados.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.148')!)
  expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf058-'))).toBe(false)
 })
 it('hereda crear en las dos alternativas sin confundir el sustantivo consulta con una acción',()=>{
  const test=contracts.cases.find(c=>c.id==='alternative-dataset-query')!
  const task=resolveTechnicalTask('',test.description,context)!
  expect(task.alternatives).toHaveLength(2)
  expect(task.alternatives!.every(branch=>branch.activityType==='PROJECT')).toBe(true)
  const p=recommend({activityTitle:'Actividad',description:test.description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).not.toMatch(/Aplica el procedimiento/)
  expect(p.criteria[0].description.match(/El producto creado/g)).toHaveLength(2)
 })
 it.each([
  ['Diseña la estructura general del reporte según las secciones del caso ficticio.',/títulos|subtotales|pie de página/],
  ['Analiza las necesidades de información del usuario ficticio.',/territorial|período/],
  ['Clasifica las herramientas de diseño de reportes de las fichas dadas.',/seleccionad|selección/],
  ['Selecciona las herramientas de diseño de reportes adecuadas al caso ficticio.',/clasificación/],
  ['Analiza la matriz proporcionada para organizar los datos del reporte ficticio.',/\blistas?\b/],
  ['Analiza la lista proporcionada para organizar los datos del reporte ficticio.',/matri/],
 ])('no incorpora requisitos ajenos: %s',(description,unrequested)=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(row=>row.templateId.startsWith('technical-mf058-'))).toBe(true)
  expect(JSON.stringify(p.criteria.map(row=>({title:row.title,description:row.description,progression:row.progressionLevels})))).not.toMatch(unrequested)
 })
 it.each([
  ['Calcula los subtotales del reporte con los registros ficticios de cada grupo.',['technical-mf058-totals-subtotal-calculation']],
  ['Calcula los totales del reporte con los registros ficticios proporcionados.',['technical-mf058-totals-total-calculation']],
  ['Calcula los totales diarios del reporte con los registros ficticios proporcionados.',['technical-mf058-daily-totals-calculation']],
  ['Calcula el total general del reporte con los registros ficticios proporcionados.',['technical-mf058-general-total-calculation']],
  ['Calcula los totales o subtotales del reporte según la alternativa elegida.',['technical-mf058-totals-alternative']],
 ])('evalúa únicamente el resumen numérico solicitado: %s',(description,ids)=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(row=>row.templateId)).toEqual(ids)
  expect(p.criteria.reduce((sum,row)=>sum+row.maxScoreUnits,0)).toBe(1735)
 })
 it('mantiene el período y ámbito territorial cuando sí se piden en el análisis de necesidades',()=>{
  const description=contracts.cases.find(c=>c.id==='report-needs')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toMatch(/período/)
  expect(p.criteria[0].description).toMatch(/territorial/)
 })
 it('reconoce matrices en plural sin exigir listas adicionales',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analiza las matrices proporcionadas del reporte con datos ficticios.',maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(row=>row.templateId)).toEqual(['technical-mf058-matrices-lists-matrix-analysis'])
  expect(p.criteria[0].description).not.toMatch(/lista/)
 })
 it('separa analizar, crear y comprobar en la consigna de acciones independientes',()=>{
  const description=contracts.cases.find(c=>c.id==='independent-actions')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(row=>row.templateId)).toEqual(['technical-mf058-report-needs-analysis','technical-mf058-filters-creation','technical-mf058-filters-verification'])
 })
})
