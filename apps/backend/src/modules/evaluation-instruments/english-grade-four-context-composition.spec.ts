import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import contexts from '../../../../../data/evaluation-instruments/english-grade-four-context-contracts.json'
import compositions from '../../../../../data/evaluation-instruments/english-grade-four-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'ING',optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType:typeof formats[number]='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Cuarto: contexto observable y composición de requisitos',()=>{
 it('solidaridad se observa en la respuesta de apoyo, sin puntuar un rasgo interno',()=>{
  const c=propose('Dialogarán en inglés para formular una respuesta solidaria de apoyo a la necesidad comunicada por un personaje ficticio.').criteria.find(c=>c.templateId==='ing-4-context-empathetic-response')
  expect(c?.description).toContain('necesidad')
 })
 it('planificar no exige entregar ni exponer el mensaje todavía',()=>{
  const p=propose('Planificarán en inglés el mensaje oral con instrucciones para el propósito y destinatario proporcionados.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-4-strategy-planning')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-4-intelligibility')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-4-written')
 })
 it('contrastar opiniones conserva el contraste en los cinco niveles',()=>{
  const c=propose(compositions.find(f=>f.id==='views-compared')!.description).criteria.find(c=>c.templateId==='ing-4-opinion')!
  expect(c.progressionLevels!.every(level=>/contrast|semejanz|diferenci/i.test(level))).toBe(true)
 })
 it('valora la correspondencia con la fuente al compartir información científica confiable',()=>{
  const c=propose('Escribirán en inglés un mensaje para compartir información científica válida y confiable, contrastando los datos con las fuentes proporcionadas.').criteria.find(c=>c.templateId==='ing-4-context-source-information')
  expect(c?.description).toContain('fuentes')
  expect(c?.progressionLevels).toHaveLength(5)
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
  for(const id of f.criteria)expect(p.criteria.map(c=>c.templateId)).toContain(`ing-4-${id}`)
  for(const id of f.excluded??[])expect(p.criteria.map(c=>c.templateId)).not.toContain(`ing-4-${id}`)
  for(const word of f.contains)expect(JSON.stringify(p.criteria)).toContain(word)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 it('no impone equipo, causas, prevención ni hábitos personales cuando no se solicitan',()=>{
  const solution=propose('Escribirán en inglés una propuesta individual para solucionar un problema comunitario ficticio.')
  expect(JSON.stringify(solution.criteria)).not.toContain('equipo')
  const description=propose('Describirán oralmente en inglés el problema cotidiano del personaje con los detalles proporcionados.')
  expect(description.criteria.map(c=>c.templateId)).not.toContain('ing-4-problem-causes')
  const risk=propose('Describirán oralmente en inglés el riesgo para la salud de un personaje de los ejemplos proporcionados.')
  expect(risk.criteria.find(c=>c.templateId==='ing-4-context-risk-care')?.description).not.toContain('orientaciones')
 })
 it('una inferencia de significado no se convierte en otra conclusión sobre lo ocurrido',()=>{
  const p=propose('Leerán en inglés un texto e inferirán el significado de una palabra mediante las pistas del contexto.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-4-strategy-inference')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-4-context-inference')
 })
})
