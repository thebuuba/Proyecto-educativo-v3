import {describe,it,expect} from 'vitest'
import bank from '../../../../../../data/evaluation-instruments/earth-report/cases.json'
import {validateInstrumentDefinition} from '@aula/shared'
import {recommend} from '../../../../../../apps/backend/src/modules/evaluation-instruments/recommendation-engine'
import {activityDescriptionText,descriptionToEditorHtml} from '../components/editor/editorPresentation'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
const academicContext={...bank.context,level:'SECONDARY' as const,cycle:1,modalityCode:null,optativeExitName:null}
const shape=(p:ReturnType<typeof editableFallbackRecommendation>)=>p.criteria.map(c=>({templateId:c.templateId,title:c.title,description:c.description,progressionLevels:c.progressionLevels,descriptors:c.descriptors.map(d=>d.text),maxScoreUnits:c.maxScoreUnits,taskConditionIds:c.taskConditionIds}))
describe('Informe descriptivo: contenido visible y paridad',()=>{
 for(const task of bank.cases)it.each(task.id==='earth'?['rubrica','lista-cotejo','escala','lista-ponderada'] as const:['rubrica'] as const)(task.id+' %s',instrumentType=>{
  const description=activityDescriptionText(descriptionToEditorHtml(task.description))
  expect(description).toBe(task.description.replace(/\s+/g,' ').trim())
  const input={activityTitle:task.title,description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext})
  const server=recommend({...input,preferredInstrumentType:instrumentType},academicContext,null,[],'UNMAPPED',null)
  expect(shape(local)).toEqual(shape(server))
  expect(local.internalTrace.generatorVersion).toBe(server.internalTrace.generatorVersion)
  const initial=scoreInstrumentFields(recommendationToFields(local,task.title),instrumentType,null,local)
  expect(initial[instrumentType+':meta:scorePending']).toBe('true')
  expect(initial[instrumentType+':points:0']).toBe('')
  for(const total of [20,17.35]){
   const fields=scoreInstrumentFields(initial,instrumentType,total,local)
   expect(validateInstrumentDefinition(instrumentType,fields,total)).toEqual([])
   fields[instrumentType+':criterion:0']='Descripción conservada manualmente'
   const snapshot=alignRecommendationWithFields(local,fields,total)!
   expect(snapshot.totalScoreUnits).toBe(Math.round(total*100))
   expect(snapshot.criteria[0].id).toBe(local.criteria[0].id)
   expect(snapshot.criteria[0].title).toBe('Descripción conservada manualmente')
   if(task.id==='earth'){
    const content=Object.values(fields).join(' ')
    for(const v of ['corteza','manto','núcleo','13','18','justificado','centrado','negrita','ortografía','dibujo','tres párrafos en desarrollo','Word o PDF'])expect(content).toContain(v)
   }
  }
 })
})
