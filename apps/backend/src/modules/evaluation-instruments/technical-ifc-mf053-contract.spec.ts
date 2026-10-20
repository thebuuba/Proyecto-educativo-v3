import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/technical-ifc-mf053-four-contracts.json'
import source from '../../../../../docs/curriculum/cobertura-secundaria/technical-ifc006-mf053-4-matriz.json'
import {resolveTechnicalTask,technicalModules,technicalSelections} from '../../../../../packages/shared/src/secondary-technical'
import {recommend} from './recommendation-engine'
import {evaluationCatalogForVersion} from './catalog-current'

const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
describe('MF053: contratos de acciones, fuente y cuatro formatos',()=>{
 for(const test of contracts.cases){
  it(test.id+'/temas solicitados',()=>{
   const task=resolveTechnicalTask('Título de otro curso',test.description,context)
   expect(task).not.toBeNull()
   expect([...new Set(task!.actions.flatMap(a=>a.topics.map(t=>t.id)))].sort()).toEqual([...test.topics].sort())
  })
  for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(test.id+'/'+instrumentType+'/'+maxScore,()=>{
   const p=recommend({activityTitle:'Entrevista de trabajo en inglés',description:test.description,maxScore,preferredInstrumentType:instrumentType,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.length).toBeGreaterThan(0)
   expect(p.criteria.every(r=>r.templateId.startsWith('technical-mf053-'))).toBe(true)
   expect(p.criteria.reduce((sum,r)=>sum+r.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   expect(p.instrumentType).toBe(instrumentType)
   expect(p.internalTrace.reasons).toContain('module=ifc006-mf053-4')
   const task=resolveTechnicalTask('',test.description,context)!
   expect(p.activityType).toBe(task.activityType)
   if(test.alternative)expect(p.criteria).toHaveLength(1)
   else for(const topic of test.topics)expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf053-'+topic+'-'))).toBe(true)
   const text=JSON.stringify(p.criteria)
   expect(text).not.toMatch(/pronunciación|fluidez oral|hipótesis científica|despliega la aplicación|contrata|visita una empresa/i)
   if(instrumentType==='escala'&&test.id==='manual-file-frequency')expect(p.levels.map(l=>l.label)).not.toContain('Siempre')
  })
 }
 it('el inventario de adaptaciones referencia solo registros oficiales del módulo y deja las actitudes íntimas fuera',()=>{
  const records=new Map(source.officialRecords.map(r=>[r.id,r]))
  const used=new Set(technicalModules[0].topics.flatMap(t=>t.sourceRecordIds))
  for(const id of used){expect(records.has(id)).toBe(true);expect(id).not.toMatch(/-a-|-m-/)}
  for(const record of source.officialRecords.filter(r=>!/-a-|-m-/.test(r.id)))expect(used.has(record.id),record.id).toBe(true)
 })
 it('un catálogo histórico no recibe automáticamente el nuevo proveedor',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Diseña una interfaz gráfica del sistema.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.141')!)
  expect(p.criteria.some(r=>r.templateId.startsWith('technical-mf053-'))).toBe(false)
 })
 it('la sugerencia automática no impide elegir cualquier otro formato',()=>{
  const task=resolveTechnicalTask('','Diseña una interfaz gráfica del sistema.',context)!
  expect(technicalSelections(task,'Diseña una interfaz gráfica del sistema.').suggestedInstrumentType).toBe('rubrica')
 })
})
