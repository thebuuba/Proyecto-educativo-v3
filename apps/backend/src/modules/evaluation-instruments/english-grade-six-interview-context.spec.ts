import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import personalCase from '../../../../../data/evaluation-instruments/english-grade-six-personal-interview.json'
const context={level:'SECONDARY' as const,cycle:2,grade:6,subjectCode:'ING',subjectName:'Inglés',modalityCode:'academic',optativeExitName:null}
const {description}=personalCase
describe('Caso personal de entrevista laboral de Inglés6.º: roles y recursos efectivos',()=>{
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35]){
  it(`${format}/${score}: ambos roles sin inventar una ficha`,()=>{
   const p=recommend({activityTitle:'Una entrevista de trabajo en inglés.',description,preferredInstrumentType:format,maxScore:score,participationMode:'GROUP'},context,null,[],'UNMAPPED',null)
   expect(p.activityType).toBe('ORAL_INTERACTION')
   expect(p.criteria.some(c=>c.templateId==='ing-6-job-interview-questions')).toBe(true)
   expect(p.criteria.some(c=>c.templateId==='ing-6-job-interview')).toBe(true)
   expect(JSON.stringify(p.criteria)).not.toMatch(/ficha/i)
   expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(score*100))
  })
  it(`${format}/${score}: conserva la ficha cuando se solicita`,()=>{
   const p=recommend({activityTitle:'Actividad',description:description+' Utilizarán la ficha proporcionada del personaje ficticio.',preferredInstrumentType:format,maxScore:score,participationMode:'GROUP'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.find(c=>c.templateId==='ing-6-job-interview')!.description).toMatch(/ficha/i)
  })
  it(`${format}/${score}: responder solamente no obliga a entrevistar`,()=>{
   const p=recommend({activityTitle:'Actividad',description:'Interactuarán en inglés para responder sobre la experiencia y las capacidades del personaje ficticio durante una entrevista de trabajo simulada. No formularán preguntas ni intercambiarán roles.',preferredInstrumentType:format,maxScore:score,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.some(c=>c.templateId==='ing-6-job-interview-questions')).toBe(false)
  })
 }
})
