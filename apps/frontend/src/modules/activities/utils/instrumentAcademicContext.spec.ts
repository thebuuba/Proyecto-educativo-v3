import {describe,it,expect} from 'vitest'
import {instrumentAcademicContext} from './instrumentAcademicContext'
import {commonSecondaryLanguageGrade} from '@aula/shared'
const subject={id:'local',sectionName:'A',academicLevelCode:'secundario',gradeName:'3.º',gradeSequence:9,subjectName:'Lengua Española',subjectCode:'LEN'}
describe('contexto del creador para Lengua común de los seis grados',()=>{
 for(const grade of [1,2,3,4,5,6])it(`normaliza secuencia local y global de ${grade}`,()=>{
  for(const gradeSequence of [grade,grade+6])expect(commonSecondaryLanguageGrade(instrumentAcademicContext({...subject,gradeSequence}))).toBe(grade)
 })
 it('usa el nombre oficial cuando falta código y conserva códigos explícitos de otras asignaturas',()=>{
  expect(commonSecondaryLanguageGrade(instrumentAcademicContext({...subject,subjectCode:undefined}))).toBe(3)
  expect(commonSecondaryLanguageGrade(instrumentAcademicContext({...subject,subjectCode:' len '}))).toBe(3)
  expect(commonSecondaryLanguageGrade(instrumentAcademicContext({...subject,subjectCode:'LEN-OPT'}))).toBeNull()
  expect(commonSecondaryLanguageGrade(instrumentAcademicContext({...subject,subjectCode:undefined,subjectName:'Lengua Española optativa'}))).toBeNull()
 })
})
