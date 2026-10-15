import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import strategies from '../../../../../data/evaluation-instruments/english-grade-four-strategy-contracts.json'
import genres from '../../../../../data/evaluation-instruments/english-grade-four-genre-contracts.json'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Cuarto: estrategias y listas distintas por modalidad cotejadas en PDF158–161',()=>{
 for(const f of strategies)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`estrategia ${f.sourceIndex} ${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),c=p.criteria.find(c=>c.templateId===`ing-4-strategy-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(p.criteria).toEqual(propose(f.description,format,total,'La célula').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const f of genres)for(const mode of f.modes)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`género ${f.id} ${mode} ${format} ${total}`,()=>{
  const action=mode==='reading'?'Leerán en inglés e identificarán los datos solicitados de':mode==='listening'?'Escucharán en inglés e identificarán los datos solicitados de':mode==='oral'?'Presentarán oralmente en inglés':mode==='interaction'?'Dialogarán en inglés en':mode==='audiovisual'?'Crearán en inglés':'Escribirán en inglés'
  const p=propose(`${action} un ${f.label}.`,format,total)
  expect(p.criteria.some(c=>c.templateId===`ing-4-genre-${f.id}`||f.id==='news'&&c.templateId==='ing-4-news'||f.id==='advertisement'&&c.templateId==='ing-4-announcement'||f.id==='instructions'&&c.templateId==='ing-4-instructions'||f.id==='narrative'&&c.templateId==='ing-4-experience')).toBe(true)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 it('identificar solo la idea principal no exige detalles; planificar un mensaje oral no exige escribir',()=>{
  const p=propose(strategies.find(f=>f.id==='main-details'&&f.description.includes('únicamente la idea'))!.description)
  const c=p.criteria.find(c=>c.templateId==='ing-4-strategy-main-details')!
  expect(c.description).not.toContain('detalles')
  const oral=propose(strategies.find(f=>f.sourceIndex===25)!.description)
  expect(oral.activityType).toBe('ORAL_PRESENTATION');expect(JSON.stringify(oral.criteria)).not.toContain('mensaje escrito')
 })
 it('comprensión y dudas conjuntas no se convierten en alternativas',()=>{
  const c=propose('Escucharán un mensaje en inglés e indicarán qué comprendieron y qué necesitan aclarar.').criteria.find(c=>c.templateId==='ing-4-strategy-understanding')!
  expect(c.description).toContain('comprendido y qué necesita aclarar')
 })
 it('compara solo las tradiciones pedidas; un ejemplo no añade valores o creencias',()=>{
  const c=propose('Compararán en inglés las tradiciones de los ejemplos proporcionados de República Dominicana y otros países, que incluyen celebraciones.').criteria.find(c=>c.templateId==='ing-4-strategy-cultural-comparison')!
  expect(c.description).toContain('tradiciones')
  expect(c.description).not.toContain('valores');expect(c.description).not.toContain('creencias')
 })
 it('tres productos alternativos constituyen una elección, sin perder ninguno ni exigirlos todos',()=>{
  const p=propose('Escribirán en inglés un correo o una carta o un aviso para comunicar la información solicitada, eligiendo uno de los tres productos.')
  expect(p.criteria.filter(c=>c.templateId.includes('genre-'))).toHaveLength(1)
  expect(p.criteria.find(c=>c.templateId.includes('genre-'))!.templateId).toBe('ing-4-genre-email-or-letter-or-notice')
 })
 it('no hereda del catálogo de recepción un producto oral o escrito inexistente',()=>{
  const written=propose('Escribirán en inglés un catálogo para comunicar la información solicitada.')
  expect(written.criteria.some(c=>c.templateId==='ing-4-genre-catalog')).toBe(false)
  const oral=propose('Presentarán oralmente en inglés una factura.')
  expect(oral.criteria.some(c=>c.templateId==='ing-4-genre-invoice')).toBe(false)
 })
})
