import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {resolveSecondGradeEnglishTask,secondGradeEnglishCriteria} from '@aula/shared'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-grammar-contracts.json'
const context={level:'SECONDARY' as const,grade:2,subjectCode:'ING',cycle:1,optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,format:typeof formats[number]='rubrica',score=17.35,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Gramática común de segundo: cada familia, uso, reconocimiento y explicación',()=>{
 for(const f of fixtures)for(const form of f.forms)for(const [mode,description] of [
  ['reading',`Leerán en inglés un texto breve e identificarán ${form}.`],
  ['explanation',`Explicarán la función de ${form} con ejemplos de un texto en inglés.`],
  ['writing',`Escribirán un mensaje en inglés utilizando ${form}.`],
 ] as const)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${form} ${mode} ${format} ${score}`,()=>{
  const p=propose(description,format,score),c=p.criteria.find(c=>c.templateId===`ing-2-feature-${f.id}`)
  expect(c).toBeDefined()
  expect(c!.progressionLevels?.length).toBe(5)
  expect(c!.progressionLevels?.[0]).toContain(mode==='writing'?'Emplea':'Identifica')
  expect(c!.progressionLevels?.[0]).toContain(mode==='explanation'?'explica':'inglés')
  expect(c!.progressionLevels?.[4]).toMatch(/^No /)
  expect(p.criteria).toEqual(propose(description,format,score,'La célula animal').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('conserva la forma única solicitada sin exigir alternativas simultáneas',()=>{
  for(const [form,id,absent] of [['there was','there-past','there were'],['how much','how-much-many','how many'],['why not','why-suggestion','why don’t']] as const){
   const c=propose(`Escribirán en inglés un mensaje utilizando ${form}.`).criteria.find(c=>c.templateId===`ing-2-feature-${id}`)!
   expect(c.title).not.toContain(absent)
  }
 })
 it('una exclusión de gramática no borra requisitos afirmativos posteriores',()=>{
  const p=propose('Escribirán en inglés un mensaje con presente simple. No se evaluará el pasado continuo. Usarán be going to para expresar un plan.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-feature-going-to')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-2-feature-past-continuous')
 })
 it('explica una comparación de estructuras sin exigir escribir otro producto',()=>{
  const p=propose('Compararán el pasado continuo y el pasado simple en dos textos en inglés y explicarán sus funciones con ejemplos de cada texto.')
  expect(p.activityType).toBe('COMPARISON')
  expect(p.criteria.filter(c=>c.templateId.includes('feature-'))).toHaveLength(2)
  expect(p.criteria.every(c=>!c.templateId.endsWith('written'))).toBe(true)
 })
 it('no conecta estructuras de primero ajenas al alcance de segundo',()=>{
  for(const label of ['would en invitaciones','adverbios de certeza','preposiciones de lugar']){
   const task=resolveSecondGradeEnglishTask('Actividad',`Escribirán en inglés un mensaje utilizando ${label}.`,context)
   expect(task?secondGradeEnglishCriteria(task).some(c=>c.templateId.includes('feature-')):false).toBe(false)
  }
 })
 for(const [form,id,target,absent] of [
  ['pasado continuo','past-continuous','estado','interrumpe'],
  ['will','will','pedido','plan futuro'],
  ['presente continuo','present-continuous','compra','futuro acordado'],
 ] as const)it(`respeta el uso curricular de ${form} en el contexto pedido`,()=>{
  const description=id==='past-continuous'?`Escribirán un mensaje en inglés describiendo el estado físico de un personaje utilizando ${form}.`:`Dialogarán en inglés simulando una compra y utilizarán ${form} para formular su pedido.`
  const c=propose(description).criteria.find(c=>c.templateId===`ing-2-feature-${id}`)!
  expect(c.description).toContain(target)
  expect(c.description).not.toContain(absent)
 })
 it('un mes, un nombre y un lema de anuncio no imponen estructuras gramaticales',()=>{
  for(const [description,id] of [
   ['Leerán en inglés un mensaje e identificarán la fecha May 12 y el lugar del encuentro.','permission'],
   ['Leerán en inglés un anuncio que dice For sale e identificarán el producto anunciado.','duration-prepositions'],
   ['Escribirán en inglés un mensaje para un personaje llamado Will sobre sus planes.','will'],
  ] as const)expect(propose(description).criteria.some(c=>c.templateId===`ing-2-feature-${id}`)).toBe(false)
 })
})
