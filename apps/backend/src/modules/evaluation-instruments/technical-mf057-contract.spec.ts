import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/technical-mf057-five-contracts.json'
import source from '../../../../../docs/curriculum/cobertura-secundaria/technical-ifc006-mf057-5-matriz.json'
import {resolveTechnicalTask,technicalModules} from '../../../../../packages/shared/src/secondary-technical'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'

const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
describe('Administración de Base de Datos: acciones y cuatro instrumentos contextualizados',()=>{
 for(const test of contracts.cases){
  it(test.id+'/acciones solicitadas',()=>{
   const task=resolveTechnicalTask('Entrevista de trabajo en inglés',test.description,context)
   expect(task).not.toBeNull()
   expect([...new Set(task!.actions.flatMap(a=>a.topics.map(t=>t.id)))].sort()).toEqual([...test.topics].sort())
  })
  for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(test.id+'/'+instrumentType+'/'+maxScore,()=>{
   const p=recommend({activityTitle:'Entrevista de trabajo en inglés',description:test.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.criteria.every(r=>r.templateId.startsWith('technical-mf057-'))).toBe(true)
   expect(p.criteria.reduce((sum,r)=>sum+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   expect(p.instrumentType).toBe(instrumentType)
   expect(p.internalTrace.reasons).toContain('module=mf057-5')
   expect(JSON.stringify(p.criteria)).not.toMatch(/pronunciación|fluidez oral|hipótesis científica|talento innato|contraseña personal|crea una cuenta real/i)
   if('alternative' in test&&test.alternative)expect(p.criteria).toHaveLength(1)
   else for(const topic of test.topics)expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf057-'+topic+'-'))).toBe(true)
  })
 }
 it.each(contracts.negativeDescriptions)('no impone Administración de Base de Datos a una descripción incompatible: %s',description=>{
  expect(resolveTechnicalTask('Presentación de diapositivas',description,context)).toBeNull()
 })
 it.each([
  ['dba-definition','description','ANALYSIS'],['dictionary-creation','creation','PROJECT'],
  ['backup-alert-creation','creation','PROJECT'],['data-activities','application','EXERCISE_SET'],
  ['roles-creation','creation','PROJECT'],['security-application','application','EXERCISE_SET'],
  ['database-modification','application','EXERCISE_SET'],['database-trigger','application','EXERCISE_SET'],
  ['backup-creation','application','EXERCISE_SET'],['backup-restoration','application','EXERCISE_SET'],
  ['updates-need','selection','ANALYSIS'],['updates-review','verification','OBSERVATION'],
  ['updates-testing','verification','OBSERVATION'],['monitoring','observation','OBSERVATION'],
  ['roles-modification','application','EXERCISE_SET'],['roles-removal','application','EXERCISE_SET'],
  ['point-in-time-recovery','application','EXERCISE_SET'],['statistics-scheduling','configuration','EXERCISE_SET'],
  ['system-create-role','identification','ANALYSIS'],
 ])('conserva el propósito de %s sin convertir nombres de comandos en acciones', (id,mode,activityType)=>{
  const task=contracts.cases.find(c=>c.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.every(c=>c.templateId.endsWith('-'+mode))).toBe(true)
  expect(p.activityType).toBe(activityType)
 })
 it('vincula adaptaciones a texto oficial sin evaluar actitudes privadas ni orientaciones docentes',()=>{
  const module=technicalModules.find(m=>m.moduleCode==='MF_057_3')
  expect(module).toBeDefined()
  const records=new Map(source.officialRecords.map(r=>[r.id,r]))
  for(const topic of module!.topics)for(const id of topic.sourceRecordIds){
   expect(records.has(id),id).toBe(true)
   expect(['ATTITUDE','TEACHING_STRATEGY']).not.toContain(records.get(id)!.type)
  }
 })
 it('el catálogo146 no incorpora el nuevo módulo retrospectivamente',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Crea el diccionario de datos de la base de datos ficticia proporcionada.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.146')!)
  expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf057-'))).toBe(false)
 })
})
