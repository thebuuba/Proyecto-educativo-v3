import {describe,it,expect} from 'vitest'
import bank from '../../../../../../data/evaluation-instruments/presentation-requirements/cases.json'
import {validateInstrumentDefinition} from '@aula/shared'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
const task=bank.cases[0]
const academicContext={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',modalityCode:null,optativeExitName:null}
describe('Requisitos transversales en el borrador editable',()=>{
 it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('%s conserva condiciones, puntaje pendiente y edición manual',instrumentType=>{
  const proposal=editableFallbackRecommendation({activityTitle:task.title,description:task.description,maxScore:20,instrumentType,participationMode:'INDIVIDUAL',academicContext})
  const initial=recommendationToFields(proposal,task.title)
  const pending=scoreInstrumentFields(initial,instrumentType,null,proposal)
  expect(pending[instrumentType+':meta:scorePending']).toBe('true')
  for(const total of [20,17.35]){
   const fields=scoreInstrumentFields(pending,instrumentType,total,proposal)
   expect(validateInstrumentDefinition(instrumentType,fields,total)).toEqual([])
   const index=proposal.criteria.findIndex(c=>c.templateId.startsWith('delivery-format'))
   expect(fields[`${instrumentType}:description:${index}`]).toMatch(/Arial.*12.*negrita.*titular.*1.5/)
   fields[`${instrumentType}:criterion:0`]='Texto conservado por el docente'
   const aligned=alignRecommendationWithFields(proposal,fields,total)!
   expect(aligned).not.toBeNull()
   expect(aligned.criteria[0].id).toBe(proposal.criteria[0].id)
   expect(aligned.criteria[0].title).toBe('Texto conservado por el docente')
   expect(aligned.totalScoreUnits).toBe(Math.round(total*100))
  }
 })
})
