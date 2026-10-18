import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-one-procedural-contracts.json'
import {recommend} from './recommendation-engine'
import {commonSocialSelections,resolveCommonSocialTask} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
describe('procedimientos específicos de Sociales primero: evidencia y límites',()=>{
 const proposalFor=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
 it('evalúa los recursos coloniales investigados y no solo el contexto general',()=>{
  const proposal=proposalFor(contracts.cases.find(c=>c.id==='historical-research')!.description)
  expect(proposal.criteria.find(c=>c.templateId.endsWith('-research-content'))?.description).toMatch(/recursos naturales.*continentes colonizados/i)
  expect(proposal.criteria.some(c=>c.templateId.endsWith('-interpretation'))).toBe(false)
 })
 it('no confunde la escala evaluativa con escalas cartográficas',()=>{
  const proposal=proposalFor(contracts.cases.find(c=>c.id==='observed-frequency')!.description)
  expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-1-road-safety-'))).toBe(true)
 })
 it('no duplica la ubicación del registro GPS como una segunda tarea cartográfica',()=>{
  const proposal=proposalFor(contracts.cases.find(c=>c.id==='gps-record')!.description)
  expect(proposal.criteria.map(c=>c.templateId)).toEqual(['soc-1-gps-gps-position'])
 })
 it('conserva el objeto específico de hipótesis y silogismos',()=>{
  const hypothesis=proposalFor(contracts.cases.find(c=>c.id==='hypothesis-check')!.description)
  expect(hypothesis.criteria.every(c=>/origen de la Tierra/.test(c.description))).toBe(true)
  const syllogism=proposalFor(contracts.cases.find(c=>c.id==='syllogism')!.description)
  expect(syllogism.criteria.every(c=>/calentamiento global/.test(c.description))).toBe(true)
 })
 it('no exige un registro proporcionado cuando solo se explica qué es GPS',()=>{
  expect(proposalFor('Explica qué es el posicionamiento global GPS.').criteria.some(c=>c.templateId.endsWith('-gps-position'))).toBe(false)
 })
 it('no transforma situaciones simuladas que se analizan en una actuación',()=>{
  const description='Analiza las decisiones de seguridad vial en las situaciones simuladas proporcionadas.'
  expect(resolveCommonSocialTask('',description,context)?.activityType).toBe('ANALYSIS')
  expect(proposalFor(description).criteria.some(c=>c.templateId.endsWith('-simulation'))).toBe(false)
 })
 it('no toma frecuencia estadística como frecuencia de conducta',()=>{
  const description='Analiza la frecuencia de los problemas de seguridad vial en los registros proporcionados.'
  const task=resolveCommonSocialTask('',description,context)!
  expect(commonSocialSelections(task,description).suggestedInstrumentType).toBe('rubrica')
  expect(proposalFor(description).criteria.some(c=>c.templateId.endsWith('-observed-conduct'))).toBe(false)
 })
 it('utiliza la acción del título si no existe descripción y no confunde compartir con comparar',()=>{
  const task=resolveCommonSocialTask('Analiza las causas de la Revolución Francesa.','',context)!
  expect(commonSocialSelections(task,'').suggestedInstrumentType).toBe('rubrica')
  expect(proposalFor('Comparte la información sobre la Revolución Francesa.').criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(false)
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${format}/${maxScore}`,()=>{
   const proposal=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
   expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   for(const key of task.requiredKeys)expect(proposal.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
   const body=proposal.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join(' ')
   expect(body).not.toMatch(new RegExp(task.absent,'i'))
   expect(proposal.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
   if(task.frequencyScale&&format==='escala')expect(proposal.levels.map(l=>l.label)).toEqual(['Siempre','Casi siempre','A veces','Nunca'])
  })
 }
})
