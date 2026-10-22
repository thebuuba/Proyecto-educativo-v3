import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/technical-mf057-five-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:null}
const proposal=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'lista-cotejo',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
const sample=(id:string)=>proposal(contracts.cases.find(c=>c.id===id)!.description)
const text=(p:ReturnType<typeof proposal>)=>p.criteria.map(c=>c.description).join(' ')

describe('MF057: hallazgos de lectura y requisitos realmente solicitados',()=>{
 it('el plan genérico no obliga a índices, estadísticas y consistencia',()=>{
  const p=sample('weighted-components');expect(p.criteria).toHaveLength(1)
  expect(text(p)).not.toMatch(/índices|estadísticas|consistencia/)
 })
 it('separa las tres acciones de mantenimiento expresamente pedidas en cotejo',()=>{
  const p=sample('maintenance-plan');expect(p.criteria).toHaveLength(3)
  expect(p.criteria.map(c=>c.templateId)).toEqual(expect.arrayContaining(['indices','statistics','consistency'].map(id=>'technical-mf057-maintenance-plan-'+id+'-creation')))
 })
 it('un plan limitado a estadísticas no exige otros mantenimientos',()=>{
  const p=proposal('Crea el plan de mantenimiento de la base de datos ficticia para actualizar las estadísticas según el diagnóstico dado.')
  expect(p.criteria).toHaveLength(1);expect(text(p)).toMatch(/estadísticas/);expect(text(p)).not.toMatch(/índices|consistencia/)
 })
 it('separa datos, log y temporales cuando se solicita su ubicación',()=>{
  const p=sample('disk-layout');expect(p.criteria).toHaveLength(3)
  expect(p.criteria.map(c=>c.templateId)).toEqual(expect.arrayContaining(['data','log','temporary'].map(id=>'technical-mf057-database-disk-layout-'+id+'-configuration')))
 })
 it('ubicar únicamente archivos de datos no exige log o temporales',()=>{
  const p=proposal('Configura en la simulación de bases de datos la ubicación de los archivos de datos en el disco indicado.')
  expect(p.criteria).toHaveLength(1);expect(text(p)).not.toMatch(/\blog\b|temporales/)
 })
 it('generar documentación es crear el producto pedido',()=>{
  const p=sample('database-documentation');expect(p.criteria[0].templateId).toMatch(/-creation$/);expect(p.activityType).toBe('PROJECT')
 })
 it('planificar consultas conserva un diseño concreto',()=>{
  const p=sample('query-planning');expect(p.criteria[0].templateId).toMatch(/-design$/);expect(p.activityType).toBe('PROJECT')
 })
 it('aplicar pruebas de comunicación y respuesta es verificación',()=>{
  const p=sample('server-tests');expect(p.criteria).toHaveLength(2);expect(p.criteria.every(c=>c.templateId.endsWith('-verification'))).toBe(true);expect(p.activityType).toBe('OBSERVATION')
 })
 it('analizar retención y elegir copias evalúa evidencias distintas',()=>{
  const p=sample('old-backup-cleanup');expect(p.criteria).toHaveLength(2)
  expect(p.criteria.find(c=>c.templateId.endsWith('-analysis'))!.description).toMatch(/política de retención/)
  expect(p.criteria.find(c=>c.templateId.endsWith('-selection'))!.description).toMatch(/copias que deben conservarse/)
 })
 it('crear roles no exige cambiar roles anteriores',()=>{
  const p=sample('roles-creation');expect(text(p)).toMatch(/roles creados/);expect(text(p)).not.toMatch(/cambio de roles/)
 })
 it('actualizar estadísticas no depende de interpretar práctica como un verbo',()=>{
  const p=proposal('Actualiza las estadísticas de la base de datos ficticia según el procedimiento indicado.')
  expect(p.criteria[0].templateId).toMatch(/-application$/);expect(p.activityType).toBe('EXERCISE_SET')
 })
 it('establecer períodos conserva la configuración solicitada',()=>{
  expect(sample('review-periods').criteria[0].templateId).toMatch(/-configuration$/)
 })
 it('realizar correcciones conserva el propósito correctivo',()=>{
  expect(sample('server-corrections').criteria[0].templateId).toMatch(/-correction$/)
 })
})
