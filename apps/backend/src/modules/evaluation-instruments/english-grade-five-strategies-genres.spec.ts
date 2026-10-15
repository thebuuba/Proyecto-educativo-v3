import {englishObjectiveId} from './english-quality-test-utils'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import strategies from '../../../../../data/evaluation-instruments/english-grade-five-strategy-contracts.json'
import genres from '../../../../../data/evaluation-instruments/english-grade-five-genre-contracts.json'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Quinto: estrategias y listas por modalidad cotejadas en PDF163–165',()=>{
 it('solicitar ayuda y repetición mantiene las dos acciones pedidas',()=>{
  const c=propose('Escucharán un mensaje en inglés y solicitarán ayuda y repetición de la parte que necesitan comprender.').criteria.find(c=>c.templateId==='ing-5-strategy-help')!
  expect(c.description).toContain('ayuda y repetición')
 })
 it('ideas principales solas no exigen secundarias; compensación respeta el recurso pedido',()=>{
  const primary=propose('Leerán un texto en inglés e identificarán únicamente las ideas principales.').criteria.find(c=>c.templateId==='ing-5-strategy-main-secondary')!
  expect(primary.description).not.toContain('secundarias')
  const synonyms=propose('Escribirán en inglés un mensaje utilizando sinónimos como estrategia compensatoria.').criteria.find(c=>c.templateId==='ing-5-strategy-compensation')!
  expect(synonyms.description).not.toContain('comodín')
 })
 it('compara solo derechos sin añadir deberes ni hábitos privados',()=>{
  const c=propose('Compararán en inglés los derechos ciudadanos de los ejemplos proporcionados de República Dominicana y otros países.').criteria.find(c=>c.templateId==='ing-5-strategy-cultural-comparison')!
  expect(c.description).toContain('derechos');expect(c.description).not.toContain('deberes')
 })
 for(const f of strategies)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`estrategia ${f.sourceIndex} ${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),c=p.criteria.find(c=>englishObjectiveId(c.templateId)===`ing-5-strategy-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(p.criteria).toEqual(propose(f.description,format,total,'La célula').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const f of genres)for(const mode of f.modes)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`género ${f.id} ${mode} ${format} ${total}`,()=>{
  const action=mode==='reading'?'Leerán en inglés e identificarán los datos solicitados de':mode==='listening'?'Escucharán en inglés e identificarán los datos solicitados de':mode==='oral'?'Presentarán oralmente en inglés':mode==='interaction'?'Dialogarán en inglés en':mode==='audiovisual'?'Crearán en inglés':'Escribirán en inglés'
  const p=propose(`${action} un ${f.label}.`,format,total)
  expect(p.criteria.some(c=>c.templateId===`ing-5-genre-${f.id}`||f.id==='narrative'&&c.templateId==='ing-5-narrative')).toBe(true)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
