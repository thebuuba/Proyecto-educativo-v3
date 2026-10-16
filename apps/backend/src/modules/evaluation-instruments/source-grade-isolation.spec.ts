import {describe,it,expect} from 'vitest'
import {versionAllowsContext} from './evaluation-instruments.service'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'NAT',subjectName:'Ciencias de la Naturaleza',modalityCode:'academic',optativeExitName:null}
describe('Fuentes parciales: aislamiento de grado',()=>{
 it('una fuente de otro grado no desplaza la del contexto genérico NAT',()=>{
  const version={importMetadata:{subjectCodes:['NAT','NAT-VIDA'],grades:[2],commonOnly:true}}
  expect(versionAllowsContext(version,context)).toBe(false)
  expect(versionAllowsContext(version,{...context,grade:2})).toBe(true)
 })
 it('las fuentes completas históricas conservan su política',()=>expect(versionAllowsContext({importMetadata:{}},context)).toBe(true))
 it('no permite optativas en una fuente común',()=>expect(versionAllowsContext({importMetadata:{grades:[1],subjectCodes:['NAT'],commonOnly:true}},{...context,optativeExitName:'Ciencias y Tecnología'})).toBe(false))
})
