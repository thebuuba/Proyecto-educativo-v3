import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/technical-mf060-six-contracts.json'
import source from '../../../../../docs/curriculum/cobertura-secundaria/technical-ifc006-mf060-6-matriz.json'
import {resolveTechnicalTask,technicalModules} from '../../../../../packages/shared/src/secondary-technical'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'

const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
describe('Desarrollo e Implementación de Soluciones Web y Multimedia: acciones y cuatro instrumentos contextualizados',()=>{
 for(const test of contracts.cases){
  it(test.id+'/acciones solicitadas',()=>{
   const task=resolveTechnicalTask('Entrevista de trabajo en inglés',test.description,context)
   expect(task).not.toBeNull()
   expect([...new Set(task!.actions.flatMap(a=>a.topics.map(t=>t.id)))].sort()).toEqual([...test.topics].sort())
  })
  for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(test.id+'/'+instrumentType+'/'+maxScore,()=>{
   const p=recommend({activityTitle:'Entrevista de trabajo en inglés',description:test.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.criteria.every(r=>r.templateId.startsWith('technical-mf060-'))).toBe(true)
   expect(p.criteria.reduce((sum,r)=>sum+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   expect(p.instrumentType).toBe(instrumentType)
   expect(p.internalTrace.reasons).toContain('module=mf060-6')
   expect(JSON.stringify(p.criteria)).not.toMatch(/pronunciación|fluidez oral|hipótesis científica|talento innato|contraseña personal|crea una cuenta real/i)
   if('alternative' in test&&test.alternative)expect(p.criteria).toHaveLength(1)
   else for(const topic of test.topics)expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf060-'+topic+'-'))).toBe(true)
  })
 }
 it.each(contracts.negativeDescriptions)('no impone Desarrollo e Implementación de Soluciones Web y Multimedia a una descripción incompatible: %s',description=>{
  expect(resolveTechnicalTask('Presentación de diapositivas',description,context)).toBeNull()
 })
 it.each([
  ['language-selection',['selection','explanation'],'ANALYSIS'],['compatibility-tests',['verification'],'OBSERVATION'],
  ['required-application',['application'],'EXERCISE_SET'],['test-environment',['design'],'PROJECT'],
  ['process-documentation',['creation'],'PROJECT'],['query-integration',['application'],'EXERCISE_SET'],
  ['browser-compatibility',['verification'],'OBSERVATION'],['descriptors',['application'],'EXERCISE_SET'],
  ['automatic-publication-simulation',['application'],'EXERCISE_SET'],['element-programming',['coding'],'PROJECT'],
  ['element-configuration',['configuration'],'EXERCISE_SET'],['debugging-functions',['creation','application'],'PROJECT'],
  ['server-installation-simulation',['application'],'EXERCISE_SET'],['installation-requirements',['design'],'PROJECT'],
  ['affected-resources',['identification'],'ANALYSIS'],['server-services',['identification'],'ANALYSIS'],
  ['configuration-parameters',['design'],'PROJECT'],['security-parameters',['design'],'PROJECT'],
  ['installation-packages',['creation','configuration'],'PROJECT'],['execution',['execution'],'OBSERVATION'],
  ['database-storage-tests',['verification'],'OBSERVATION'],['user-training',['execution'],'OBSERVATION'],
  ['user-instructions',['creation'],'PROJECT'],['institutional-objectives',['comparison'],'COMPARISON'],
  ['technology-update-sources',['analysis','selection'],'ANALYSIS'],['technology-timing',['selection'],'ANALYSIS'],
  ['improvement-scenarios',['representation'],'PROJECT'],['implementation-organization',['sequence'],'EXERCISE_SET'],
  ['planning-meeting',['evidence'],'ORAL_PRESENTATION'],['progress-report',['creation'],'REPORT'],
  ['progress-minutes',['creation'],'REPORT'],['development-policies',['representation'],'PROJECT'],
  ['programming-standards',['application'],'EXERCISE_SET'],['authentication',['application'],'EXERCISE_SET'],
  ['certificates',['explanation'],'ANALYSIS'],['firewall',['proposal'],'ANALYSIS'],
  ['innovation-process',['development'],'PROJECT'],['proposal-methods',['development','evidence'],'PROJECT'],
  ['erp-application',['development'],'PROJECT'],['management-configuration',['configuration'],'EXERCISE_SET'],
  ['tools-context',['analysis'],'ANALYSIS'],
 ] as [string,string[],string][])('conserva el propósito solicitado de %s',(id,modes,activityType)=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId.split('-').at(-1))).toEqual(modes)
  expect(p.activityType).toBe(activityType)
 })
 it('seleccionar una fuente de las fichas no añade una entrega de cantidad redundante',()=>{
  const description=contracts.cases.find(c=>c.id==='technology-update-sources')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='delivery-format')).toBe(false)
 })
 it.each([
  'Examina los medios de actualización tecnológica proporcionados y selecciona dos fuentes pertinentes al caso.',
  'Examina los medios de actualización tecnológica proporcionados y selecciona una fuente pertinente al caso. Entrega una fuente con la ficha de selección.',
 ])('conserva cantidades explícitas o entregas de fuentes: %s',description=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>/fuente/.test(c.description)&&c.taskConditionIds?.length)).toBe(true)
 })
 it('vincula adaptaciones a texto oficial sin evaluar actitudes privadas ni orientaciones docentes',()=>{
  const module=technicalModules.find(m=>m.moduleCode==='MF_060_3')
  expect(module).toBeDefined()
  const records=new Map(source.officialRecords.map(r=>[r.id,r]))
  for(const topic of module!.topics)for(const id of topic.sourceRecordIds){
   expect(records.has(id),id).toBe(true)
   expect(['ATTITUDE','TEACHING_STRATEGY']).not.toContain(records.get(id)!.type)
  }
 })
 it('el catálogo149 no incorpora el nuevo módulo retrospectivamente',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Configura el elemento del sitio web de práctica solicitado según el diseño proporcionado.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.149')!)
  expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf060-'))).toBe(false)
 })
})
