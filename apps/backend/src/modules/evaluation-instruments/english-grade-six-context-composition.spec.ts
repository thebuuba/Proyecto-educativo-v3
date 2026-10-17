import {englishObjectiveId} from './english-quality-test-utils'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import contexts from '../../../../../data/evaluation-instruments/english-grade-six-context-contracts.json'
import compositions from '../../../../../data/evaluation-instruments/english-grade-six-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ING',optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType:typeof formats[number]='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Sexto: contexto y composicion propios',()=>{
 for(const f of contexts)for(const format of formats)for(const total of [20,17.35])it(`contexto ${f.id} ${f.description.slice(0,12)} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),c=p.criteria.find(c=>c.templateId===f.templateId)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(p.criteria).toEqual(propose(f.description,format,total,'La célula animal').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const f of compositions)for(const format of formats)for(const total of [20,17.35])it(`composición ${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total)
  expect(p.activityType).toBe(f.activity)
  for(const id of f.criteria)expect(p.criteria.map(c=>englishObjectiveId(c.templateId))).toContain(`ing-6-${id}`)
  for(const id of f.excluded??[])expect(p.criteria.map(c=>c.templateId)).not.toContain(`ing-6-${id}`)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
