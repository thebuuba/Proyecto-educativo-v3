import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import fixtures from '../../../../../../data/evaluation-instruments/language-grade-four-contracts.json'
import subtopics from '../../../../../../data/evaluation-instruments/language-grade-four-subtopic-contracts.json'
import procedures from '../../../../../../data/evaluation-instruments/language-grade-four-procedure-contracts.json'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const content=(result:ReturnType<typeof recommend>)=>result.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text)}))
describe('Lengua 4: servicio y alternativa compartidos',()=>{
 for(const fixture of [...fixtures,...subtopics,...procedures])for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [15,20,17.35])it(`${fixture.description.slice(0,65)} ${instrumentType} ${maxScore}`,()=>{
   const input={activityTitle:'Actividad',description:fixture.description,participationMode:'INDIVIDUAL' as const,maxScore,preferredInstrumentType:instrumentType}
   const service=recommend(input,context,null,[],'UNMAPPED',null)
   const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context,secondaryLanguageGrade:4})
   expect(content(local)).toEqual(content(service))
   expect(local.activityType).toEqual(service.activityType)
   const incompatible={...input,activityTitle:fixture.topic==='soneto'?'El instructivo':'El soneto'}
   expect(content(recommend(incompatible,context,null,[],'UNMAPPED',null))).toEqual(content(service))
   expect(content(editableFallbackRecommendation({...incompatible,instrumentType,academicContext:context,secondaryLanguageGrade:4}))).toEqual(content(service))
   const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
   const scored=scoreInstrumentFields(pending,instrumentType,maxScore,local)
   expect(service.criteria.map((_,i)=>Number(scored[`${instrumentType}:points:${i}`]))).toEqual(service.criteria.map(c=>c.maxScoreUnits/100))
 })
})
