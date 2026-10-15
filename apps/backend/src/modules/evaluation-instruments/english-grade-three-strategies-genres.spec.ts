import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import strategies from '../../../../../data/evaluation-instruments/english-grade-three-strategy-contracts.json'
import genres from '../../../../../data/evaluation-instruments/english-grade-three-genre-contracts.json'
const context={level:'SECONDARY' as const,grade:3,subjectCode:'ING',cycle:1,optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada',maxScore:number,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Tercero: estrategias y géneros propios según modalidad y fuente',()=>{
 for(const f of strategies)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`estrategia ${f.sourceIndex} ${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),c=p.criteria.find(c=>c.templateId===`ing-3-strategy-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(c!.progressionLevels?.[4]).toMatch(/^No /)
  expect(p.criteria).toEqual(propose(f.description,format,total,'La célula').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const f of genres)for(const mode of f.modes)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`género ${f.id} ${mode} ${format} ${total}`,()=>{
  const action=mode==='reading'?'Leerán en inglés e identificarán los datos solicitados de':mode==='listening'?'Escucharán en inglés e identificarán los datos solicitados de':mode==='oral'?'Presentarán oralmente en inglés':mode==='interaction'?'Dialogarán en inglés en':mode==='audiovisual'?'Crearán en inglés':'Escribirán en inglés'
  const p=propose(`${action} un ${f.label}.`,format,total)
  expect(p.criteria.some(c=>c.templateId===`ing-3-genre-${f.id}`||f.id==='news'&&c.templateId==='ing-3-news'||f.id==='narrative'&&c.templateId==='ing-3-narrative')).toBe(true)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 it('compara solo el aspecto cultural pedido y no añade narrativa, gestos ni rasgos privados',()=>{
  for(const f of strategies.filter(s=>s.id==='cultural-comparison')){
   const p=propose(f.description,'rubrica',20)
   expect(p.criteria.some(c=>c.templateId==='ing-3-narrative'||c.templateId.includes('nonverbal'))).toBe(false)
   expect(p.criteria.find(c=>c.templateId==='ing-3-strategy-cultural-comparison')?.description).not.toContain('puntualidad')
  }
 })
 it('un recurso, una finalidad o una estrategia negada no se convierte en evidencia',()=>{
  const p=propose('Dialogarán en inglés para expresar una opinión. No se evaluará la motivación ni la ansiedad. No se exigirá consultar un diccionario. Recursos: diccionario y guía de inferencia.','rubrica',20)
  expect(p.criteria.some(c=>c.templateId.includes('strategy-'))).toBe(false)
 })
 it('la comprensión y la dificultad son ambas evidencias cuando así se solicita',()=>{
  const p=propose('Escucharán una noticia en inglés e indicarán qué comprendieron y qué necesitan aclarar.','lista-cotejo',17.35)
  const c=p.criteria.find(c=>c.templateId==='ing-3-strategy-understanding')!
  expect(c.description).toContain('comprendido y qué necesita aclarar')
 })
})
