import {describe,expect,it} from 'vitest'
import {discipline,resolveScope,type AcademicContext,type ScopeCandidate} from './curriculum-context'
import {versionAllowsContext} from './evaluation-instruments.service'

const context:AcademicContext={level:'SECONDARY',cycle:2,grade:4,subjectCode:'MF_053_3',subjectName:'Análisis y Diseño de Sistemas Informáticos',modalityCode:'technical_professional',optativeExitName:null}
const scope:ScopeCandidate={id:'reviewed-mf053-scope',versionId:'reviewed-ifc-version',cycle:2,grade:4,areaName:'Informática y Comunicaciones',subjectName:context.subjectName,modalityName:'Técnico Profesional',optativeExitName:null}
const metadata={subjectCodes:['MF_053_3'],grades:[4],modalityCodes:['technical_professional'],technicalProgramCode:'IFC006_3',technicalModuleCode:'MF_053_3',commonOnly:false}

describe('contexto técnico revisado de MF053',()=>{
 it('distingue la disciplina técnica solo para el contexto revisado',()=>{
  expect(discipline(scope,context)).toBe('technical')
  expect(discipline(null,{...context,modalityCode:'academic'})).not.toBe('technical')
  expect(discipline(null,{...context,subjectCode:'MF_054_3'})).not.toBe('technical')
 })
 it('resuelve el módulo técnico por su código, cuarto, ciclo y modalidad',()=>{
  expect(resolveScope(context,[scope])).toMatchObject({status:'RESOLVED',scope,reason:'REVIEWED_TECHNICAL_MODULE_CODE'})
 })
 it('usa identidad del módulo aunque el nombre operativo haya sido abreviado',()=>{
  expect(resolveScope({...context,subjectName:'Análisis y diseño'},[scope])).toMatchObject({status:'RESOLVED',scope})
 })
 it.each([
  {level:'PRIMARY'},{grade:3,cycle:1},{grade:5},{grade:6},{cycle:1},
  {modalityCode:'academic'},{modalityCode:'general'},{modalityCode:'arts'},{modalityCode:null},
  {optativeExitName:'Ciencias y Tecnología'},
 ] as Partial<AcademicContext>[])('un mapping no salva un contexto incompatible %j',override=>{
  expect(resolveScope({...context,...override},[scope],[scope.id]).status).not.toBe('RESOLVED')
 })
 it('no habilita otro módulo técnico por compartir el nombre',()=>{
  expect(resolveScope({...context,subjectCode:'MF_054_3'},[scope],[scope.id]).status).not.toBe('RESOLVED')
 })
 it('excluye ámbitos académicos, artísticos y optativos con el mismo nombre',()=>{
  const wrong=[{...scope,id:'academic',modalityName:'Académica'},{...scope,id:'arts',modalityName:'Artes'},{...scope,id:'exit',optativeExitName:'Ciencias y Tecnología'}]
  expect(resolveScope(context,wrong).status).toBe('UNMAPPED')
  expect(resolveScope(context,[...wrong,scope])).toMatchObject({status:'RESOLVED',scope})
  expect(resolveScope(context,[scope],['academic']).status).toBe('CONFLICT')
 })
 it('no cambia la resolución del componente académico común técnico',()=>{
  const common={...scope,id:'common',subjectName:'Matemática',modalityName:'Académica'}
  expect(resolveScope({...context,subjectCode:'MAT',subjectName:'Matemática'},[common])).toMatchObject({status:'RESOLVED',scope:common,reason:'COMMON_ACADEMIC_COMPONENT'})
 })
})

describe('selección de la versión técnica explícita',()=>{
 it('admite exclusivamente el manifest revisado para ese contexto',()=>{
  expect(versionAllowsContext({importMetadata:metadata},context)).toBe(true)
 })
 it.each([
  {},{subjectCodes:['MF_053_3']}, {...metadata,modalityCodes:['academic']},
  {...metadata,technicalProgramCode:'IFC007_3'},{...metadata,technicalModuleCode:'MF_054_3'},
  {...metadata,subjectCodes:['MF_054_3']},{...metadata,grades:[5]},
 ])('no deja que un catálogo histórico o una fuente incompatible capture MF053: %j',importMetadata=>{
  expect(versionAllowsContext({importMetadata},context)).toBe(false)
 })
 it('rechaza la versión técnica en un contexto académico homónimo',()=>{
  expect(versionAllowsContext({importMetadata:metadata},{...context,modalityCode:'academic'})).toBe(false)
 })
 it('conserva la política histórica para materias comunes',()=>{
  expect(versionAllowsContext({importMetadata:{}},{...context,subjectCode:'MAT',subjectName:'Matemática',modalityCode:'academic'})).toBe(true)
 })
})
