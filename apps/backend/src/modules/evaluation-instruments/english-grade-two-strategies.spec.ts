import {englishObjectiveId} from './english-quality-test-utils'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-strategy-contracts.json'
const context={level:'SECONDARY' as const,grade:2,subjectCode:'ING',cycle:1,optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,format:typeof formats[number]='rubrica',score=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Segundo: procedimientos estratégicos vinculados a evidencias observables',()=>{
 for(const f of fixtures)for(const format of formats)for(const score of [20,17.35])it(`${f.sourceIndex} ${f.id} ${format} ${score}`,()=>{
  const p=propose(f.description,format,score),c=p.criteria.find(c=>englishObjectiveId(c.templateId)===`ing-2-strategy-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(c!.progressionLevels?.[4]).toMatch(/^No /)
  expect(p.criteria).toEqual(propose(f.description,format,score,'La célula').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('no puntúa motivación, ansiedad ni infiere la estrategia de un recurso',()=>{
  const p=propose('Dialogarán en inglés para sostener una conversación. No se evaluará la motivación ni la ansiedad. Recursos: diccionario y guía de inferencia.')
  expect(p.criteria.some(c=>c.templateId.includes('strategy-'))).toBe(false)
 })
 it('conserva el aspecto cultural pedido sin exigir gestos u otros aspectos ausentes',()=>{
  const p=propose(fixtures.find(f=>f.sourceIndex===49)!.description)
  const c=p.criteria.find(c=>c.templateId==='ing-2-strategy-cultural-comparison')!
  expect(c.description).toContain('puntualidad')
  expect(c.description).not.toContain('celebraciones')
  expect(p.criteria.some(c=>c.templateId.includes('nonverbal'))).toBe(false)
 })
})
