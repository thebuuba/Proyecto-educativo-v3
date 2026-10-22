import {describe,expect,it} from 'vitest'
import {discipline,resolveScope,type AcademicContext,type ScopeCandidate} from './curriculum-context'
import {versionAllowsContext} from './evaluation-instruments.service'
import {evaluationCatalogV146} from './catalog-v146'
import {evaluationCatalogForVersion} from './catalog-current'

const context:AcademicContext={level:'SECONDARY',grade:5,cycle:2,subjectCode:'MF_057_3',subjectName:'Administración de Base de Datos',modalityCode:'technical_professional',optativeExitName:null}
const scope:ScopeCandidate={id:'reviewed-mf057',versionId:'reviewed-mf057-version',cycle:2,grade:5,areaName:'Informática y Comunicaciones',subjectName:context.subjectName,modalityName:'Técnico Profesional',optativeExitName:null}
const metadata={subjectCodes:['MF_057_3'],grades:[5],modalityCodes:['technical_professional'],technicalModuleCode:'MF_057_3',technicalProgramCode:'IFC006_3',technicalProgramCodes:['IFC006_3'],commonOnly:false}

describe('MF057: Administración de Base de Datos exclusivamente en quinto técnico',()=>{
 it('resuelve el código revisado incluso con nombre operativo abreviado',()=>{
  expect(discipline(null,context)).toBe('technical')
  expect(resolveScope(context,[scope])).toMatchObject({status:'RESOLVED',scope})
  expect(resolveScope({...context,subjectName:'Administración BD'},[scope])).toMatchObject({status:'RESOLVED',scope})
  expect(versionAllowsContext({importMetadata:metadata},context)).toBe(true)
 })
 it.each([
  {level:'PRIMARY'},{grade:1,cycle:1},{grade:3,cycle:1},{grade:4},{grade:6},{cycle:1},
  {modalityCode:'academic'},{modalityCode:'arts'},{modalityCode:'general'},{modalityCode:null},
  {optativeExitName:'Matemática y Tecnología'},{subjectCode:'MF_999_3'},
 ] as Partial<AcademicContext>[])('rechaza otro contexto incluso con mapping %j',override=>{
  const actual={...context,...override}
  expect(resolveScope(actual,[scope],[scope.id]).status).not.toBe('RESOLVED')
  expect(discipline(null,actual)).not.toBe('technical')
  expect(versionAllowsContext({importMetadata:metadata},actual)).toBe(false)
 })
 it.each([
  {},{subjectCodes:['MF_057_3']},{...metadata,technicalProgramCode:'IFC007_3'},
  {...metadata,technicalProgramCodes:['IFC006_3','IFC007_3']},{...metadata,technicalProgramCodes:['IFC006_3','IFC006_3']},
  {...metadata,technicalModuleCode:'MF_059_3'},{...metadata,grades:[4]},
  {...metadata,modalityCodes:['academic']},{...metadata,subjectCodes:['MF_002_3']},{...metadata,commonOnly:true},
 ])('rechaza fuente histórica o técnica incompatible %j',importMetadata=>{
  expect(versionAllowsContext({importMetadata},context)).toBe(false)
 })
 it('no decide entre ámbitos duplicados ni otra modalidad',()=>{
  const arts={...scope,id:'arts',modalityName:'Artes'}
  expect(resolveScope(context,[arts,scope])).toMatchObject({status:'RESOLVED',scope})
  expect(resolveScope(context,[arts]).status).toBe('UNMAPPED')
  expect(resolveScope(context,[scope,{...scope,id:'duplicate'}]).status).toBe('AMBIGUOUS')
  expect(resolveScope(context,[scope],['other']).status).toBe('CONFLICT')
 })
 it('no inventa un programa de matrícula ausente en el esquema',()=>{
  expect(context).not.toHaveProperty('programCode')
  expect(versionAllowsContext({importMetadata:{...metadata,technicalProgramCodes:undefined}},context)).toBe(true)
 })
 it('el payload146 conserva exclusivamente los cinco proveedores publicados',()=>{
  expect(evaluationCatalogForVersion('evaluation-2026.146')).toEqual(evaluationCatalogV146)
  expect(evaluationCatalogV146.technicalModules!.map(m=>m.moduleCode)).toEqual(['MF_053_3','MF_002_3','MF_054_3','MF_056_3','MF_059_3'])
 })
})
