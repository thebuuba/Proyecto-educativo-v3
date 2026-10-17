import {describe,expect,it} from 'vitest'
import {validateInstrumentDefinition,detectTeachingStrategy,resolveCommonScienceTask} from '@aula/shared'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {appendInstrumentCriterion,completeInstrumentCriterion,nextCatalogCriterion} from './instrumentCriterionAddition'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import topics from '../../../../../../data/evaluation-instruments/science-grade-1-contracts.json'
import topicsTwo from '../../../../../../data/evaluation-instruments/science-grade-2-contracts.json'
import topicsThree from '../../../../../../data/evaluation-instruments/science-grade-3-contracts.json'
import topicsFour from '../../../../../../data/evaluation-instruments/science-grade-4-contracts.json'
import topicsFive from '../../../../../../data/evaluation-instruments/science-grade-5-contracts.json'
import topicsSix from '../../../../../../data/evaluation-instruments/science-grade-6-contracts.json'
for(const {grade,code,fixtures} of [{grade:1,code:'NAT-TU',fixtures:topics},{grade:2,code:'NAT-VIDA',fixtures:topicsTwo},{grade:3,code:'NAT-FISICAS',fixtures:topicsThree},{grade:4,code:'NAT-BIO',fixtures:topicsFour},{grade:5,code:'NAT-QUI',fixtures:topicsFive},{grade:6,code:'NAT-FIS',fixtures:topicsSix}]){
const cases=fixtures.flatMap(f=>[f,...(f.variants??[]).map(description=>({description,id:f.id}))])
const context={level:'SECONDARY' as const,grade,cycle:grade<=3?1:2,modalityCode:'academic',subjectCode:code,subjectName:'Ciencias de la Naturaleza',optativeExitName:null}
describe(`Ciencias ${grade}.º: paridad, formatos, edición y precisión`,()=>{
  for(const f of cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35])it(`${f.id}/${format}/${score}`,()=>{
    const input={activityTitle:'Actividad',description:f.description,maxScore:score,participationMode:'INDIVIDUAL' as const}
    const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:context})
    const server=recommend({...input,preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
    const content=(p:typeof local)=>({activity:p.activityType,format:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceType,sourceReferences,...row})=>row)})
    expect(content(local)).toEqual(content(server))
    expect(activityDefaultSuggestions('Título neutral',f.description,context)?.activityType).toBe(resolveCommonScienceTask('',f.description,context)?.activityType)
    const fields=scoreInstrumentFields(recommendationToFields(local,'Actividad'),format,null,local)
    expect(fields[`${format}:meta:scorePending`]).toBe('true');expect(fields[`${format}:points:0`]).toBe('')
    const scored=scoreInstrumentFields(fields,format,score,local)
    expect(validateInstrumentDefinition(format,scored,score)).toEqual([])
    expect(local.criteria.reduce((sum,_,i)=>sum+Math.round(Number(scored[`${format}:points:${i}`])*100),0)).toBe(Math.round(score*100))
    const blank={...scored,[`${format}:criterion:0`]:'Mi texto manual',[`${format}:description:0`]:''}
    const completed=completeInstrumentCriterion(blank,format,0,local.criteria[0])
    expect(completed[`${format}:criterion:0`]).toBe('Mi texto manual')
    expect(completed[`${format}:description:0`]).toBe(local.criteria[0].description)
    if(local.criteria.length>1){
      const count=local.criteria.length,missing={...completed,[`${format}:meta:criteriaCount`]:String(count-1)}
      for(const key of Object.keys(missing))if(key.startsWith(`${format}:descriptor:${count-1}:`)||new RegExp(`^${format}:(?:criterion(?:-[a-z]+)?|description|indicator|points|weight):${count-1}$`).test(key))delete missing[key]
      const candidate=nextCatalogCriterion(local.criteria,missing,format,local.criteria.slice(0,-1))
      expect(candidate?.templateId).toBe(local.criteria.at(-1)?.templateId)
      const added=appendInstrumentCriterion(missing,format,score,{...local,criteria:local.criteria.slice(0,-1)},candidate)
      expect(added.fields[`${format}:criterion:0`]).toBe('Mi texto manual')
      expect(nextCatalogCriterion(local.criteria,added.fields,format,added.recommendation?.criteria)).toBeNull()
      expect(validateInstrumentDefinition(format,added.fields,score)).toEqual([])
      expect(()=>appendInstrumentCriterion({...added.fields,[`${format}:meta:criteriaCount`]:'20'},format,score,local,local.criteria[0])).toThrow(RangeError)
    }
    expect(nextCatalogCriterion(local.criteria,scored,format)).toBeNull()
  })
  it('no toma un ejercicio por una estrategia completa basada en problemas',()=>{
    expect(detectTeachingStrategy({...context,description:'Analiza un problema sobre sismos.'}).id).toBeNull()
  })
})

}
