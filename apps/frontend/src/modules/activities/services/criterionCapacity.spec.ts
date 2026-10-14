import {it,expect} from 'vitest'
import {editableFallbackRecommendation} from './instrumentPreparation'
import grammar from '../../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'
import {recommendationToFields} from './instrumentPreparation'
import {nextCatalogCriterion,appendInstrumentCriterion,completeInstrumentCriterion} from './instrumentCriterionAddition'
const description=`Leerán un texto en inglés e identificarán ${grammar.map(f=>f.term).join(', ')}.`
for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`añade una estructura distinta aunque comparta palabras: ${instrumentType}`,()=>{
 const pool=editableFallbackRecommendation({activityTitle:'Actividad',description,maxScore:100,participationMode:'INDIVIDUAL',instrumentType,academicContext:{level:'SECONDARY',grade:1,subjectCode:'ING'},includeAdditionalCandidates:true})
 const first=pool.criteria.find(c=>c.templateId==='ing-1-feature-present-simple')!
 const second=pool.criteria.find(c=>c.templateId==='ing-1-feature-present-continuous')!
 const proposal={...pool,criteria:[first]}
 const fields=recommendationToFields(proposal,'Actividad')
 expect(nextCatalogCriterion([first,second],fields,instrumentType,[first])?.templateId).toBe(second.templateId)
 const completed=completeInstrumentCriterion({...fields,[`${instrumentType}:description:0`]:''},instrumentType,0,first)
 expect(completed[`${instrumentType}:criterion-id:0`]).toBe(fields[`${instrumentType}:criterion-id:0`])
 const added=appendInstrumentCriterion(fields,instrumentType,null,proposal,second)
 expect(added.fields[`${instrumentType}:criterion-id:0`]).toBe(first.id)
 expect(nextCatalogCriterion([second],added.fields,instrumentType,added.recommendation?.criteria)).toBeNull()
 expect(()=>appendInstrumentCriterion({...fields,[`${instrumentType}:meta:criteriaCount`]:'20'},instrumentType,20,proposal,second)).toThrow(/20/)
})
for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`los candidatos ${instrumentType} pueden incluir más de20 opciones`,()=>{
 const pool=editableFallbackRecommendation({activityTitle:'Actividad',description,maxScore:100,participationMode:'INDIVIDUAL',instrumentType,academicContext:{level:'SECONDARY',grade:1,subjectCode:'ING'},includeAdditionalCandidates:true})
 expect(pool.criteria).toHaveLength(31)
})
for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`la alternativa ${instrumentType} no entrega una propuesta de más de20 criterios`,()=>{
 expect(()=>editableFallbackRecommendation({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL',instrumentType,academicContext:{level:'SECONDARY',grade:1,subjectCode:'ING'}})).toThrow(/criterios.*20/)
})
