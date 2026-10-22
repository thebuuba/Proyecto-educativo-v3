import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/technical-mf056-four-contracts.json'
import source from '../../../../../docs/curriculum/cobertura-secundaria/technical-ifc006-mf056-4-matriz.json'
import {resolveTechnicalTask,technicalModules} from '../../../../../packages/shared/src/secondary-technical'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'

const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
describe('Base de datos: acciones y cuatro instrumentos contextualizados',()=>{
 for(const test of contracts.cases){
  it(test.id+'/acciones solicitadas',()=>{
   const task=resolveTechnicalTask('Entrevista de trabajo en inglés',test.description,context)
   expect(task).not.toBeNull()
   expect([...new Set(task!.actions.flatMap(a=>a.topics.map(t=>t.id)))].sort()).toEqual([...test.topics].sort())
  })
  for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(test.id+'/'+instrumentType+'/'+maxScore,()=>{
   const p=recommend({activityTitle:'Entrevista de trabajo en inglés',description:test.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.criteria.every(r=>r.templateId.startsWith('technical-mf056-'))).toBe(true)
   expect(p.criteria.reduce((sum,r)=>sum+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   expect(p.instrumentType).toBe(instrumentType)
   expect(p.internalTrace.reasons).toContain('module=mf056-4')
   expect(JSON.stringify(p.criteria)).not.toMatch(/pronunciación|fluidez oral|hipótesis científica|talento innato|contraseña personal|crea una cuenta real/i)
   if('alternative' in test&&test.alternative)expect(p.criteria).toHaveLength(1)
   else for(const topic of test.topics)expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf056-'+topic+'-'))).toBe(true)
  })
 }
 it.each(contracts.negativeDescriptions)('no impone Base de datos a una descripción incompatible: %s',description=>{
  expect(resolveTechnicalTask('Presentación de diapositivas',description,context)).toBeNull()
 })
 it('vincula adaptaciones a texto oficial sin evaluar actitudes privadas ni orientaciones docentes',()=>{
  const module=technicalModules.find(m=>m.moduleCode==='MF_056_3')
  expect(module).toBeDefined()
  const records=new Map(source.officialRecords.map(r=>[r.id,r]))
  for(const topic of module!.topics)for(const id of topic.sourceRecordIds){
   expect(records.has(id),id).toBe(true)
   expect(['ATTITUDE','TEACHING_STRATEGY']).not.toContain(records.get(id)!.type)
  }
 })
 it('el catálogo144 no incorpora el nuevo módulo retrospectivamente',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Crea la tabla de la base de datos de práctica según el modelo dado.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.144')!)
  expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf056-'))).toBe(false)
 })
})
