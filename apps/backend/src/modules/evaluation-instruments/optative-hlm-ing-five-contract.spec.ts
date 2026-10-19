import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hlm-ing-five-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('HLM quinto: literatura anglófona',()=>{
 it('el cotejo separa las ideas principales y secundarias cuando se solicitan ambas',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Lean un texto en inglés e identifiquen las ideas principales y secundarias solicitadas.',maxScore:17.35,preferredInstrumentType:'lista-cotejo',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const rows=p.criteria.filter(r=>r.templateId.startsWith('opt-hlm-ing-5-strategy-main-secondary:'))
  expect(rows).toHaveLength(2);expect(rows[0].description).toContain('ideas principales');expect(rows[1].description).toContain('ideas secundarias')
 })
 it('adverbios de frecuencia es contenido gramatical y no pide una escala de frecuencia',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Explicarán en inglés la función de los adverbios de frecuencia con los ejemplos proporcionados.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.levels.map(l=>l.label)).toEqual(['Completo','Suficiente','Parcial','Aún no logrado'])
  expect(p.criteria[0].progressionLevels?.[0]).toBe('Cumple todos los aspectos del indicador.')
 })
 it('conserva la escala de frecuencia cuando se solicita observar la regularidad',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Dialogarán en inglés para comunicar un consejo. Se registrará la regularidad de cada indicador.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.levels[0].label).toBe('Siempre');expect(p.criteria[0].progressionLevels?.[0]).toBe('En todas las oportunidades observadas.')
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35])it(task.id+'/'+format+'/'+score,()=>{
  const mode='participationMode'in task&&task.participationMode==='GROUP'?'GROUP':'INDIVIDUAL'
  const p=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore:score,preferredInstrumentType:format,participationMode:mode},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-ing-5-'))).toBe(true)
  expect(p.instrumentType).toBe(format);expect(p.activityType).toBe(task.activityType);expect(p.participationMode).toBe(mode)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(score*100))
  const ids=p.criteria.map(r=>r.templateId.split(':')[0])
  if('expectedAll'in task&&task.expectedAll)for(const id of task.expectedAll)expect(ids).toContain(id)
  if('expectedAny'in task&&task.expectedAny?.length)expect(task.expectedAny.some(id=>ids.includes(id))).toBe(true)
  if('forbiddenTemplateIds'in task&&task.forbiddenTemplateIds)for(const id of task.forbiddenTemplateIds)expect(ids).not.toContain(id)
  if('forbiddenTemplatePrefix'in task&&task.forbiddenTemplatePrefix)expect(ids.some(id=>id.startsWith(task.forbiddenTemplatePrefix!))).toBe(false)
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[])].join(' ')).join(' ')
  if('required'in task&&task.required)expect(full).toMatch(new RegExp(task.required,'i'))
  if('forbidden'in task&&task.forbidden)expect(full).not.toMatch(new RegExp(task.forbidden,'i'))
  if('singleGenreChoice'in task&&task.singleGenreChoice)expect(ids.filter(id=>id.includes('-genre-'))).toHaveLength(1)
  expect(p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[])].join(' ')).join(' ')).not.toMatch(/células|título antiguo/)
 })
})
