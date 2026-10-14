import {it,expect} from 'vitest'
import {editableFallbackRecommendation} from './instrumentPreparation'
import grammar from '../../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'
const description=`Leerán un texto en inglés e identificarán ${grammar.map(f=>f.term).join(', ')}.`
for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`la alternativa ${instrumentType} no entrega una propuesta de más de20 criterios`,()=>{
 expect(()=>editableFallbackRecommendation({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL',instrumentType,academicContext:{level:'SECONDARY',grade:1,subjectCode:'ING'}})).toThrow(/criterios.*20/)
})
