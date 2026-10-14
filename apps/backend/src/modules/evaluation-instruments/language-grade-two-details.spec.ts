import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-two-final-contracts.json'
import families from '../../../../../data/evaluation-instruments/language-grade-two-family-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Lengua 2: requisitos finos y productos de comprensión',()=>{
 for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const description of ['Elaborarán una guía turística sin mapas ni fotografías.','Elaborarán una guía turística por escrito, sin exposición oral.'])it(`excluye requisitos negados: ${description} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Trabajo',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('TOURIST_GUIDE_CREATION')
  expect(p.criteria.some(c=>/-graphics$|-oral-communication$/.test(c.templateId))).toBe(false)
 })
 for(const fixture of [...fixtures,...families])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${fixture.id} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Trabajo',description:fixture.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(fixture.type)
  const row=p.criteria.find(c=>c.templateId===fixture.criterion)
  expect(row).toBeDefined()
  expect(row!.description).toContain(fixture.contains)
  expect(JSON.stringify(p.criteria)).not.toContain(fixture.absent)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
 })
})
