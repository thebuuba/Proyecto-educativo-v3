import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-five-contracts.json'


import subtopics from '../../../../../data/evaluation-instruments/language-grade-five-subtopic-contracts.json'
import procedures from '../../../../../data/evaluation-instruments/language-grade-five-procedure-contracts.json'
import {recommend} from './recommendation-engine'
import {findSecondaryLanguageTopic} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Lengua 5: contenido conectado al servicio',()=>{
 it('recitación satírica: sentido crítico sin duplicar entonación',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Declamarán un poema satírico con entonación.',maxScore:15,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId.endsWith('-feature-nonverbal'))).toBe(false)
  expect(p.criteria.find(c=>c.templateId.endsWith('-recitation-expression'))?.description).toContain('la crítica')
 })
 it('una puesta en escena usa el tipo y técnica de representación existentes',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Representarán un entremés teatral.',maxScore:15,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('PERFORMANCE')
 })
 for(const f of [...fixtures,...subtopics,...procedures])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${f.id} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:f.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(f.type)
  const row=p.criteria.find(c=>c.templateId===`len-5-${f.topic}-${f.criterion}`)
  expect(row).toBeDefined()
  expect(row!.description).toContain(f.contains)
  expect(JSON.stringify(p.criteria)).not.toContain(f.absent)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
 })
})
