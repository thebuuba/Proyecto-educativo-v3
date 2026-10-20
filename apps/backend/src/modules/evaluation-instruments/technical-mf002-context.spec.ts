import {describe,expect,it} from 'vitest'
import {discipline,resolveScope,type AcademicContext,type ScopeCandidate} from './curriculum-context'
import {versionAllowsContext} from './evaluation-instruments.service'
import {evaluationCatalogV142} from './catalog-v142'
import {evaluationCatalogForVersion} from './catalog-current'

const context:AcademicContext={level:'SECONDARY',cycle:2,grade:4,subjectCode:'MF_002_3',subjectName:'Ofimática',modalityCode:'technical_professional',optativeExitName:null}
const scope:ScopeCandidate={id:'reviewed-mf002',versionId:'reviewed-mf002-version',cycle:2,grade:4,areaName:'Informática y Comunicaciones',subjectName:'Ofimática',modalityName:'Técnico Profesional',optativeExitName:null}
const metadata={subjectCodes:['MF_002_3'],grades:[4],modalityCodes:['technical_professional'],technicalModuleCode:'MF_002_3',technicalProgramCode:'IFC007_3',technicalProgramCodes:['IFC006_3','IFC007_3'],commonOnly:false}

describe('Ofimática: ámbito compartido de cuarto técnico',()=>{
 it('resuelve un módulo documental único por código, grado, ciclo y modalidad',()=>{
  expect(discipline(null,context)).toBe('technical')
  expect(resolveScope(context,[scope])).toMatchObject({status:'RESOLVED',scope,reason:'REVIEWED_TECHNICAL_MODULE_CODE'})
  expect(resolveScope({...context,subjectName:'Aplicaciones de oficina'},[scope])).toMatchObject({status:'RESOLVED',scope})
 })
 it.each([
  {level:'PRIMARY'},{grade:1,cycle:1},{grade:3,cycle:1},{grade:5},{grade:6},{cycle:1},
  {modalityCode:'academic'},{modalityCode:'general'},{modalityCode:'arts'},{modalityCode:null},
  {optativeExitName:'Ciencias y Tecnología'},{subjectCode:'MF_999_3'},
 ] as Partial<AcademicContext>[])('un mapping no salva un contexto incompatible %j',override=>{
  expect(resolveScope({...context,...override},[scope],[scope.id]).status).not.toBe('RESOLVED')
  expect(discipline(null,{...context,...override})).not.toBe('technical')
  expect(versionAllowsContext({importMetadata:metadata},{...context,...override})).toBe(false)
 })
 it('excluye homónimos de otra modalidad y no elige arbitrariamente entre dos ámbitos',()=>{
  const academic={...scope,id:'academic',modalityName:'Académica'}
  expect(resolveScope(context,[academic,scope])).toMatchObject({status:'RESOLVED',scope})
  expect(resolveScope(context,[academic]).status).toBe('UNMAPPED')
  expect(resolveScope(context,[scope,{...scope,id:'duplicate'}]).status).toBe('AMBIGUOUS')
  expect(resolveScope(context,[scope],['another-scope']).status).toBe('CONFLICT')
 })
 it('admite solamente la procedencia revisada de ambas fuentes, con IFC007 principal',()=>{
  expect(versionAllowsContext({importMetadata:metadata},context)).toBe(true)
  expect(versionAllowsContext({importMetadata:{...metadata,technicalProgramCodes:['IFC007_3','IFC006_3']}},context)).toBe(true)
 })
 it.each([
  {},{subjectCodes:['MF_002_3']},{...metadata,technicalProgramCode:'IFC006_3'},
  {...metadata,technicalProgramCodes:undefined},{...metadata,technicalProgramCodes:['IFC007_3']},
  {...metadata,technicalProgramCodes:['IFC006_3','IFC007_3','IFC008_2']},
  {...metadata,technicalProgramCodes:['IFC006_3','IFC006_3','IFC007_3']},
  {...metadata,technicalModuleCode:'MF_053_3'},{...metadata,grades:[5]},
  {...metadata,modalityCodes:['academic']},{...metadata,subjectCodes:['MF_053_3']},
  {...metadata,commonOnly:true},
 ])('impide que una fuente histórica o incompatible capture el módulo %j',importMetadata=>{
  expect(versionAllowsContext({importMetadata},context)).toBe(false)
 })
 it('la metadata documenta fuentes; no inventa un campo de programa en la matrícula',()=>{
  expect(context).not.toHaveProperty('programCode')
  expect(versionAllowsContext({importMetadata:metadata},context)).toBe(true)
 })
 it('una fuente técnica desconocida no captura materias comunes ni módulos no revisados',()=>{
  expect(versionAllowsContext({importMetadata:{}},{...context,subjectCode:'MF_999_3'})).toBe(false)
  expect(versionAllowsContext({importMetadata:{technicalModuleCode:'MF_999_3'}},{...context,subjectCode:'MAT',subjectName:'Matemática',modalityCode:'academic'})).toBe(false)
 })
 it('conserva el payload142 congelado sin Ofimática',()=>{
  expect(evaluationCatalogForVersion('evaluation-2026.142')).toEqual(evaluationCatalogV142)
  expect(evaluationCatalogV142.technicalModules!.map(m=>m.moduleCode)).toEqual(['MF_053_3'])
 })
})
