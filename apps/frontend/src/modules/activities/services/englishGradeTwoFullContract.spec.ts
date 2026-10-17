import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import grammar from '../../../../../../data/evaluation-instruments/english-grade-two-grammar-contracts.json'
import lexicon from '../../../../../../data/evaluation-instruments/english-grade-two-lexicon-contracts.json'
import strategies from '../../../../../../data/evaluation-instruments/english-grade-two-strategy-contracts.json'
import genres from '../../../../../../data/evaluation-instruments/english-grade-two-genre-contracts.json'
import contexts from '../../../../../../data/evaluation-instruments/english-grade-two-context-contracts.json'
import compositions from '../../../../../../data/evaluation-instruments/english-grade-two-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const cases=[
 ...grammar.flatMap(f=>f.forms.flatMap(form=>[
  {id:`grammar-${f.id}-${form}-read`,description:`Leerán en inglés un texto e identificarán ${form}.`},
  {id:`grammar-${f.id}-${form}-explain`,description:`Explicarán la función de ${form} con ejemplos de un texto en inglés.`},
  {id:`grammar-${f.id}-${form}-write`,description:`Escribirán un mensaje en inglés utilizando ${form}.`},
 ])),
 ...lexicon.flatMap(f=>['Leerán un texto en inglés e identificarán','Escribirán en inglés un mensaje utilizando'].map(action=>({id:`lexicon-${f.id}-${action}`,description:`${action} ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}.`}))),
 ...strategies.map(f=>({id:`strategy-${f.id}-${f.sourceIndex}`,description:f.description})),
 ...genres.flatMap(f=>f.modes.map(mode=>({id:`genre-${f.id}-${mode}`,description:`${mode==='reading'?'Leerán':mode==='oral'?'Presentarán oralmente':'Escribirán'} en inglés una ${f.label} para comunicar la información solicitada.`}))),
 ...contexts.map((f,i)=>({id:`context-${f.id}-${i}`,description:f.description})),
 ...compositions.map(f=>({id:`composition-${f.id}`,description:f.description})),
]
const content=(p:ReturnType<typeof recommend>)=>p.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,weight:c.relativeWeight,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text),progression:c.progressionLevels}))
describe('Segundo: todas las familias conectadas al servicio, alternativa y editor',()=>{
 for(const f of cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${format} ${total}`,()=>{
  const input={activityTitle:'Actividad',description:f.description,participationMode:'INDIVIDUAL' as const,maxScore:total,preferredInstrumentType:format}
  const service=recommend(input,context,null,[],'UNMAPPED',null)
  const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:context})
  expect(content(local)).toEqual(content(service))
  expect(local.activityType).toBe(service.activityType)
  expect(activityDefaultSuggestions('Actividad',f.description,context)?.activityType).toBe(service.activityType)
  const fields=recommendationToFields(local,'Actividad')
  const pending=scoreInstrumentFields(fields,format,null,local)
  const scored=scoreInstrumentFields(pending,format,total,local)
  const direct=scoreInstrumentFields(fields,format,total,local)
  expect(service.criteria.map((_,i)=>pending[`${format}:points:${i}`])).toEqual(service.criteria.map(()=>''))
  expect(service.criteria.map((_,i)=>scored[`${format}:points:${i}`])).toEqual(service.criteria.map(c=>String(c.maxScoreUnits/100)))
  expect(service.criteria.map((_,i)=>direct[`${format}:points:${i}`])).toEqual(service.criteria.map((_,i)=>scored[`${format}:points:${i}`]))
 })
})
