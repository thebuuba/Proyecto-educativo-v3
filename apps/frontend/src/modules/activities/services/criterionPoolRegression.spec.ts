import {describe,expect,it} from 'vitest'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {matchingCatalogCriterion,nextCatalogCriterion,appendInstrumentCriterion,completeInstrumentCriterion} from './instrumentCriterionAddition'
import {scoreInstrumentFields} from './instrumentScoring'

export const routineDescription='Los estudiantes prepararán una breve presentación oral en inglés sobre cinco actividades de su rutina diaria. Utilizarán el presente simple y expresiones de tiempo como in the morning, in the afternoon y at night. Al finalizar, responderán una pregunta sencilla de un compañero sobre su rutina.'
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
describe('Evidencias de rutina y recuperación de filas vacías',()=>{
 it.each(formats)('conecta la presentación de la guía sin duplicar su contenido: %s',type=>{
  const p=editableFallbackRecommendation({activityTitle:'Guía de nuestra comunidad',description:'Elaborarán una guía turística con portada, información del lugar, imágenes y cierre. Finalmente, presentarán sus trabajos ante sus compañeros.',academicContext:{level:'SECONDARY',grade:1,subjectCode:'LEN'},secondaryLanguageGrade:1,instrumentType:type,participationMode:'INDIVIDUAL',maxScore:20,includeAdditionalCandidates:true})
  expect(p.criteria.filter(c=>c.templateId==='guide-oral')).toHaveLength(1)
 })
 for(const type of formats)for(const score of [null,20,17.35])it(`recupera requisitos omitidos en .45: ${type} ${score??'pendiente'}`,()=>{
  const input={activityTitle:'Presentamos nuestra rutina diaria en inglés.',description:routineDescription,academicContext:{level:'SECONDARY' as const,grade:1,subjectCode:'ING'},instrumentType:type,participationMode:'INDIVIDUAL' as const,maxScore:score??100}
  const pool=editableFallbackRecommendation({...input,includeAdditionalCandidates:true})
  const oldIds=['ing-1-routine','ing-1-feature-present-simple','ing-1-intelligibility']
  const old={...pool,criteria:pool.criteria.filter(c=>oldIds.includes(c.templateId))}
  const fields=scoreInstrumentFields(recommendationToFields(old,'Rutina'),type,score,old)
  const candidate=nextCatalogCriterion(pool.criteria,fields,type,old.criteria)
  expect(candidate?.templateId).toBe('ing-1-temporal-expressions')
  expect(pool.criteria.find(c=>c.templateId==='ing-1-routine')?.description).toContain('cinco')
  expect(pool.criteria.find(c=>c.templateId==='ing-1-question-response')?.description).toContain('pregunta')
  const blank=appendInstrumentCriterion(fields,type,score,old,null)
  const match=matchingCatalogCriterion(pool.criteria,blank.fields,type,3,blank.recommendation?.criteria)
  expect(match?.templateId).toBe(candidate?.templateId)
  const completed=completeInstrumentCriterion(blank.fields,type,3,match!)
  expect(completed[`${type}:points:3`]).toBe(blank.fields[`${type}:points:3`])
  expect(completed[`${type}:criterion-id:3`]).toBe(blank.fields[`${type}:criterion-id:3`])
  expect(Array.from({length:4},(_,i)=>Math.round(Number(completed[`${type}:points:${i}`])*100)).reduce((a,b)=>a+b,0)).toBe(score===null?0:Math.round(score*100))
 })
 it('usa la descripción con título neutral y no contamina una opinión escrita',()=>{
  const input={academicContext:{level:'SECONDARY' as const,grade:1,subjectCode:'ING'},instrumentType:'rubrica' as const,participationMode:'INDIVIDUAL' as const,maxScore:20}
  const neutral=editableFallbackRecommendation({...input,activityTitle:'Actividad',description:routineDescription})
  expect(neutral.criteria).toHaveLength(5)
  const other=editableFallbackRecommendation({...input,activityTitle:'Rutina',description:'Escribirán en inglés una opinión sobre el cuidado de la escuela.'})
  expect(other.criteria.some(c=>/routine|temporal-expressions|question-response/.test(c.templateId))).toBe(false)
  const excluded=editableFallbackRecommendation({...input,activityTitle:'Actividad',description:'Presentarán oralmente la rutina diaria. No se evaluarán expresiones temporales ni responderán preguntas.'})
  expect(excluded.criteria.some(c=>/temporal-expressions|question-response/.test(c.templateId))).toBe(false)
 })
})
