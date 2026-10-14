import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const result=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Requisitos gramaticales explícitos de Inglés primero',()=>{
 it('separa el adjetivo comparativo de las formas del verbo comparar',()=>{
  for(const verb of ['Comparen','Compara','Compararán','Comparar']){
   const p=result(`${verb} por escrito en inglés dos objetos usando comparativos.`)
   expect(p.criteria[0].templateId).toBe('ing-1-comparison')
  }
  expect(result('Escribirán frases en inglés usando comparativos.').criteria.map(c=>c.templateId)).toEqual(['ing-1-feature-comparative'])
 })
 it('conserva las estructuras de listas coordinadas sin añadir categorías vecinas',()=>{
  for(const [terms,ids] of [
   ['adverbios de tiempo, frecuencia y modo',['time-adverbs','frequency-adverbs','manner-adverbs']],
   ['preposiciones de tiempo y lugar',['time-prepositions','place-prepositions']],
   ['conectores de coordinación, tiempo y secuencia',['coordination-connectors','time-connectors','sequence-connectors']],
  ] as const){
   const p=result(`Leerán un texto en inglés e identificarán ${terms}.`)
   expect(p.criteria.filter(c=>c.templateId.includes('-feature-')).map(c=>c.templateId)).toEqual(ids.map(id=>`ing-1-feature-${id}`))
  }
 })
 it('no nombra estructuras alternativas que la consigna no pidió',()=>{
  for(const [term,id,excluded] of [['will','future','be going to'],['verbo like','preference-verbs','enjoy'],['comparativos','comparative','superlativo'],['can’t','declining-forms','have to']]){
   const p=result(`Escribirán un mensaje en inglés usando ${term}.`)
   expect(p.criteria.find(c=>c.templateId===`ing-1-feature-${id}`)?.description).not.toContain(excluded)
  }
 })
 for(const f of fixtures)for(const mode of ['production','recognition','explanation'])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${mode} ${preferredInstrumentType} ${maxScore}`,()=>{
  const description=mode==='production'?f.production:`Leerán un texto en inglés e identificarán ${f.term}${mode==='explanation'?' explicando su función en el mensaje':''}.`
  const p=recommend({activityTitle:'Actividad',description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  const features=p.criteria.filter(c=>c.templateId.includes('-feature-'))
  expect(features.map(c=>c.templateId)).toEqual([`ing-1-feature-${f.id}`])
  expect(features[0].progressionLevels?.length).toBe(5)
  if(mode!=='recognition')expect(features[0].description).toContain(f.meaning)
  else expect(features[0].description).not.toMatch(/explica|Emplea/)
  expect(p.totalScoreUnits).toBe(Math.round(maxScore*100))
  expect(features[0].descriptors.length).toBe(['rubrica','escala'].includes(preferredInstrumentType)?4:0)
 })
 it('valora el presente simple en la rutina sin exigir todos los tiempos',()=>{
  const p=result('Escribirán en inglés una rutina diaria usando el presente simple.')
  expect(p.criteria.some(c=>c.templateId==='ing-1-feature-present-simple')).toBe(true)
  expect(JSON.stringify(p.criteria)).not.toContain('presente perfecto')
 })
 it('un análisis de conectores no requiere redactar un texto nuevo',()=>{
  const p=result('Leerán un texto en inglés e identificarán los conectores de causa y consecuencia explicando la relación entre las ideas.')
  expect(p.criteria.some(c=>c.templateId==='ing-1-feature-cause-connectors')).toBe(true)
  expect(p.criteria[0].description).toMatch(/Identifica/)
  expect(JSON.stringify(p.criteria)).not.toMatch(/Redacta|Enlaza frases breves|presente simple/)
 })
 it('negación y recursos no incorporan estructuras descartadas',()=>{
  const p=result('Escribirán en inglés una rutina diaria. No se requiere presente perfecto. Recursos: cartel de comparativos.')
  expect(p.criteria.every(c=>!c.templateId.includes('feature-'))).toBe(true)
 })
})
