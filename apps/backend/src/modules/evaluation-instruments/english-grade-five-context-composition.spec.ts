import {englishObjectiveId} from './english-quality-test-utils'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import contexts from '../../../../../data/evaluation-instruments/english-grade-five-context-contracts.json'
import compositions from '../../../../../data/evaluation-instruments/english-grade-five-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'ING',optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType:typeof formats[number]='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Quinto: contexto solicitado y consignas mixtas',()=>{
 it('identificar deseos y aspiraciones mantiene ambos componentes',()=>{
  const c=propose(contexts.find(c=>c.id==='wishes')!.description).criteria.find(c=>c.templateId==='ing-5-context-wishes')!
  expect(c.description).toContain('los deseos y las aspiraciones')
 })
 it('un deseo o un plan futuro son alternativas de interpretación',()=>{
  const p=propose('Leerán un mensaje en inglés e identificarán un deseo o un plan futuro del personaje, eligiendo una intención.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-5-context-wishes-or-plans')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-5-context-wishes')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-5-context-plans')
 })
 it('planificar el mensaje oral no exige planes futuros ni entregar el discurso',()=>{
  const p=propose('Planificarán en inglés el mensaje oral para la situación y el propósito indicados.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-5-strategy-planning')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-5-context-plans')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-5-intelligibility')
 })
 it('una fecha de la fuente no exige usar fórmulas para expresar una fecha',()=>{
  const p=propose(contexts.find(c=>c.id==='source-information')!.description)
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-5-lexicon-date')
 })
 for(const f of contexts)for(const format of formats)for(const total of [20,17.35])it(`contexto ${f.id} ${f.description.slice(0,12)} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),c=p.criteria.find(c=>c.templateId===f.templateId)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(p.criteria).toEqual(propose(f.description,format,total,'La célula animal').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const f of compositions)for(const format of formats)for(const total of [20,17.35])it(`composición ${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total)
  expect(p.activityType).toBe(f.activity)
  for(const id of f.criteria)expect(p.criteria.map(c=>englishObjectiveId(c.templateId))).toContain(`ing-5-${id}`)
  for(const id of f.excluded??[])expect(p.criteria.map(c=>c.templateId)).not.toContain(`ing-5-${id}`)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
