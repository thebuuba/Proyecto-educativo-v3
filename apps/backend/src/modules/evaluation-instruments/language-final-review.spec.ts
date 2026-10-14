import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,cycle:2,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const proposal=(grade:number,description:string,preferredInstrumentType:typeof formats[number])=>recommend({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},{...context,grade},null,[],'UNMAPPED',null)
describe('revisión pedagógica final de Lengua',()=>{
 for(const format of formats){
  it(`la recitación no puntúa dos veces el ritmo: ${format}`,()=>{
   const p=proposal(6,'Declamarán un poema social comunicando sus sentimientos mediante ritmo y entonación.',format)
   expect(p.criteria.map(c=>c.templateId)).toEqual(['len-6-poesia-social-recitation-sequence','len-6-poesia-social-recitation-expression'])
  })
  it(`conserva una rima solicitada además de la expresión: ${format}`,()=>{
   const p=proposal(6,'Recitarán un poema social haciendo perceptibles su rima y su ritmo.',format)
   expect(p.criteria.some(c=>c.templateId.endsWith('-feature-verse'))).toBe(true)
   expect(p.criteria.find(c=>c.templateId.endsWith('-feature-verse'))!.description).toContain('la rima')
  })
  it(`la actuación no exige una fila de exposición general: ${format}`,()=>{
   const p=proposal(5,'Representarán un entremés teatral mostrando el conflicto y la crítica social.',format)
   expect(p.criteria.some(c=>c.templateId.endsWith('-oral'))).toBe(false)
   expect(p.criteria.some(c=>c.templateId.endsWith('-performance'))).toBe(true)
  })
 }
 it('contrae de el en descriptores del orden narrativo',()=>{
  const p=proposal(6,'Analizarán el orden cronológico y el orden de la narración de una novela.','rubrica')
  expect(JSON.stringify(p.criteria)).not.toMatch(/\bde el\b/)
 })
})
