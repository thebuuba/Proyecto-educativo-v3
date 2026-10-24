import {describe,it,expect} from 'vitest'
import bank from '../../../../../../data/evaluation-instruments/atmosphere-report/cases.json'
import {validateInstrumentDefinition,extractTaskRequirements} from '@aula/shared'
import {recommend} from '../../../../../../apps/backend/src/modules/evaluation-instruments/recommendation-engine'
import {activityDescriptionText,descriptionToEditorHtml} from '../components/editor/editorPresentation'
import {editableFallbackRecommendation,recommendationToFields,alignRecommendationWithFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
const academicContext={...bank.context,level:'SECONDARY' as const,cycle:1,modalityCode:null,optativeExitName:null}
const shape=(p:ReturnType<typeof editableFallbackRecommendation>)=>p.criteria.map(c=>({templateId:c.templateId,title:c.title,description:c.description,progressionLevels:c.progressionLevels,descriptors:c.descriptors.map(d=>d.text),maxScoreUnits:c.maxScoreUnits,taskConditionIds:c.taskConditionIds}))
describe('Atmósfera: editor HTML, contenido visible y paridad',()=>{
 for(const task of bank.cases)it.each(task.id==='atmosphere'?['rubrica','lista-cotejo','escala','lista-ponderada'] as const:['rubrica'] as const)(task.id+' %s',instrumentType=>{
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
   if(task.id==='atmosphere'){
    const content=Object.values(fields).join(' ')
    for(const v of bank.cases[0].expected!.concat(['Arial','14','20','1,5','justificado','centrado','negrita','dos párrafos en desarrollo','Word o PDF']))expect(content).toContain(v)
   }
  }
 })
})

describe('Operadores de extensión en campos y snapshot locales/servidor',()=>{
 it.each(bank.extents)('$text',extent=>{
  const description=activityDescriptionText(descriptionToEditorHtml(bank.cases[2].description+' Entreguen en Word o PDF. '+extent.text+', sin contar la portada.'))
  const input={activityTitle:bank.cases[2].title,description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  const local=editableFallbackRecommendation({...input,instrumentType:'rubrica',academicContext})
  const server=recommend({...input,preferredInstrumentType:'rubrica'},academicContext,null,[],'UNMAPPED',null)
  expect(shape(local)).toEqual(shape(server))
  const fields=scoreInstrumentFields(recommendationToFields(local,input.activityTitle),'rubrica',20,local)
  const snapshot=alignRecommendationWithFields(local,fields,20)!
  expect(snapshot.internalTrace.taskRequirements?.conditions.find(c=>c.property==='extent')?.operator).toBe(extent.operator)
  const label=extent.operator==='MAX'?'máximo dos páginas':extent.operator==='MIN'?'mínimo dos páginas':extent.operator==='RANGE'?'entre dos y tres páginas':'exactamente dos páginas'
  expect(Object.values(fields).join(' ')).toContain(label)
  expect(snapshot.criteria.map(c=>c.description).join(' ')).toContain(label)
  expect(extractTaskRequirements(description).issues).toEqual([])
 })
})
