import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import functions from '../../../../../../data/evaluation-instruments/english-grade-four-contracts.json'
import grammar from '../../../../../../data/evaluation-instruments/english-grade-four-grammar-contracts.json'
import lexicon from '../../../../../../data/evaluation-instruments/english-grade-four-lexicon-contracts.json'
import strategies from '../../../../../../data/evaluation-instruments/english-grade-four-strategy-contracts.json'
import genres from '../../../../../../data/evaluation-instruments/english-grade-four-genre-contracts.json'
const academic={level:'SECONDARY' as const,grade:4,cycle:2,modalityCode:'academic',subjectCode:'ING',subjectName:'Inglés',optativeExitName:null}
const cases=[...functions,...grammar.flatMap(f=>f.forms.flatMap(form=>[
 {id:`${f.id}-${form}-read`,description:`Leerán en inglés un texto e identificarán ${form}.`},
 {id:`${f.id}-${form}-explain`,description:`Explicarán la función de ${form} con ejemplos de un texto en inglés.`},
 {id:`${f.id}-${form}-write`,description:`Escribirán en inglés un mensaje utilizando ${form}.`},
 ])),...grammar.flatMap(f=>['Compararán la función de','Investigarán en textos en inglés el uso de'].map(action=>({id:`${f.id}-${action}`,description:`${action} ${f.forms[0]} con ejemplos proporcionados.`}))) ]
const content=(p:ReturnType<typeof recommend>)=>p.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,weight:c.relativeWeight,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text),progression:c.progressionLevels}))
cases.push(...strategies,...lexicon.flatMap(f=>['Leerán en inglés e identificarán','Explicarán con ejemplos en inglés','Escribirán en inglés un mensaje utilizando','Compararán en textos en inglés','Investigarán en textos en inglés'].map(action=>({id:`lexicon-${f.id}-${action}`,description:`${action} ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}.`}))),...genres.flatMap(g=>g.modes.map(mode=>({id:`genre-${g.id}-${mode}`,description:`${mode==='reading'?'Leerán':mode==='listening'?'Escucharán':mode==='writing'?'Escribirán':mode==='interaction'?'Dialogarán':mode==='audiovisual'?'Crearán':'Presentarán oralmente'} en inglés un ${g.label}.`}))))
describe('Cuarto: funciones/gramática en servicio, alternativa y adaptador',()=>{
 for(const f of cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${format} ${total}`,()=>{
  const input={activityTitle:'Actividad',description:f.description,participationMode:'INDIVIDUAL' as const,maxScore:total,preferredInstrumentType:format}
  const service=recommend(input,academic,null,[],'UNMAPPED',null)
  const local=editableFallbackRecommendation({...input,instrumentType:format,academicContext:academic})
  expect(content(local)).toEqual(content(service))
  expect(local.activityType).toBe(service.activityType)
  expect(activityDefaultSuggestions('Actividad',f.description,academic)?.activityType).toBe(service.activityType)
  const fields=recommendationToFields(local,'Actividad'),pending=scoreInstrumentFields(fields,format,null,local)
  const after=scoreInstrumentFields(pending,format,total,local),before=scoreInstrumentFields(fields,format,total,local)
  expect(service.criteria.map((_,i)=>pending[`${format}:points:${i}`])).toEqual(service.criteria.map(()=>''))
  expect(service.criteria.map((_,i)=>after[`${format}:points:${i}`])).toEqual(service.criteria.map(c=>String(c.maxScoreUnits/100)))
  expect(service.criteria.map((_,i)=>before[`${format}:points:${i}`])).toEqual(service.criteria.map((_,i)=>after[`${format}:points:${i}`]))
 })
})
