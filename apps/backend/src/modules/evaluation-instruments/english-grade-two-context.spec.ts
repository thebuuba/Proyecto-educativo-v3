import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-context-contracts.json'
const context={level:'SECONDARY' as const,grade:2,subjectCode:'ING',cycle:1,optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,format:typeof formats[number]='rubrica',score=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Segundo: actitudes solo como requisitos de comunicación observables',()=>{
 for(const f of fixtures)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${f.contains} ${format} ${score}`,()=>{
  const p=propose(f.description,format,score),c=p.criteria.find(c=>c.templateId===`ing-2-context-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(c!.description).toContain(f.contains)
  expect(p.criteria).toEqual(propose(f.description,format,score,'Motivación y ansiedad').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('no añade actitudes por título, recursos ni traits personales',()=>{
  for(const description of ['Escribirán un mensaje en inglés sobre su motivación y ansiedad.','Dialogarán en inglés para sostener una conversación. No se evaluará la cortesía.','Escribirán un mensaje en inglés. Recursos: normas éticas TIC, salud, puntualidad y hábitos de consumo.']){
   expect(propose(description).criteria.some(c=>c.templateId.startsWith('ing-2-context-'))).toBe(false)
  }
 })
 it('pedir ayuda o describir estados no exige un juicio sobre personalidad',()=>{
  const p=propose('Dialogarán en inglés para ofrecer ayuda a un personaje que describe su estado de ánimo.')
  expect(JSON.stringify(p.criteria)).not.toMatch(/puntúa su empatía|autocontrol|humildad|motivación|ansiedad/)
 })
})
