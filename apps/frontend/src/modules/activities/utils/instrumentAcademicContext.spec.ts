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
 it('conserva modalidad y salida configuradas para la optativa',()=>{
  const option={...subject,gradeSequence:10,subjectCode:'OPT-HLM-LEN-4',subjectName:'Apreciación y Producción Literarias',modalityCode:'academic',optativeExitName:'Humanidades y Lenguas Modernas'}
  expect(instrumentAcademicContext(option)).toMatchObject({level:'SECONDARY',grade:4,subjectCode:'OPT-HLM-LEN-4',modalityCode:'academic',optativeExitName:'Humanidades y Lenguas Modernas'})
 })
 it('no infiere modalidad académica por el nombre o código optativo',()=>{
  const option={...subject,gradeSequence:4,subjectCode:'OPT-HLM-LEN-4',subjectName:'Apreciación y Producción Literarias'}
  expect(instrumentAcademicContext(option)).toMatchObject({modalityCode:null,optativeExitName:null})
  expect(instrumentAcademicContext({...option,modalityCode:'technical_professional',optativeExitName:'Humanidades y Ciencias Sociales'})).toMatchObject({modalityCode:'technical_professional',optativeExitName:'Humanidades y Ciencias Sociales'})
 })
})
