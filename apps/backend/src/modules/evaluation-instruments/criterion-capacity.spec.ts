import {it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import grammar from '../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'
const description=`Leerán un texto en inglés e identificarán ${grammar.map(f=>f.term).join(', ')}.`
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`los candidatos no son un instrumento final: ${preferredInstrumentType}`,()=>{
 const pool=recommend({activityTitle:'Actividad',description,maxScore:100,participationMode:'INDIVIDUAL',preferredInstrumentType,includeAdditionalCandidates:true},{level:'SECONDARY',grade:1,subjectCode:'ING'},null,[],'UNMAPPED',null)
 expect(pool.criteria).toHaveLength(31)
 expect(new Set(pool.criteria.map(c=>c.templateId)).size).toBe(31)
})
it('no descarta requisitos de una consigna que supera la capacidad del instrumento',()=>{
 expect(()=>recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade:1,subjectCode:'ING'},null,[],'UNMAPPED',null)).toThrow(/criterios.*20/)
})
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`conserva los20 requisitos en el límite: ${preferredInstrumentType} ${maxScore}`,()=>{
 const p=recommend({activityTitle:'Actividad',description:`Leerán un texto en inglés e identificarán ${grammar.slice(0,20).map(f=>f.term).join(', ')}.`,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},{level:'SECONDARY',grade:1,subjectCode:'ING'},null,[],'UNMAPPED',null)
 expect(p.criteria).toHaveLength(20)
 expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
})
