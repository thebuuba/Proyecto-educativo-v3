import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import strategies from '../../../../../data/evaluation-instruments/english-grade-six-strategy-contracts.json'
import genres from '../../../../../data/evaluation-instruments/english-grade-six-genre-contracts.json'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Sexto: estrategias y generos de PDF169-171',()=>{
 it('lo comprendido no exige dudas y creencias no exige valores',()=>{
  const c=propose('Escucharán un mensaje en inglés e indicarán lo que comprendieron.').criteria.find(c=>c.templateId==='ing-6-strategy-understanding')!
  expect(c.description).not.toContain('aclarar')
  const culture=propose('Compararán en inglés las creencias de los ejemplos proporcionados de República Dominicana y otros países.').criteria.find(c=>c.templateId==='ing-6-strategy-cultural-comparison')!
  expect(culture.description).toContain('creencias');expect(culture.description).not.toContain('valores')
 })
 for(const f of strategies)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`estrategia ${f.sourceIndex} ${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),c=p.criteria.find(c=>c.templateId===`ing-6-strategy-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(p.criteria).toEqual(propose(f.description,format,total,'La célula').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const f of genres)for(const mode of f.modes)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`género ${f.id} ${mode} ${format} ${total}`,()=>{
  const action=mode==='reading'?'Leerán en inglés e identificarán los datos solicitados de':mode==='listening'?'Escucharán en inglés e identificarán los datos solicitados de':mode==='oral'?'Presentarán oralmente en inglés':mode==='interaction'?'Dialogarán en inglés en':mode==='audiovisual'?'Crearán en inglés':'Escribirán en inglés'
  const p=propose(`${action} un ${f.label}.`,format,total)
  expect(p.criteria.some(c=>c.templateId===`ing-6-genre-${f.id}`||f.id==='narrative'&&c.templateId==='ing-6-detailed-narrative')).toBe(true)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
