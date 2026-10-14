import {describe,it,expect} from 'vitest'
import {recommend,suggestedSelections} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-contracts.json'
import {resolveFirstGradeEnglishTask} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType?:typeof formats[number],maxScore=17.35,activityTitle='Actividad')=>recommend({activityTitle,description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
describe('Inglés común primero: función y modalidad comunicativa',()=>{
 it('distingue comprobación receptiva de calidad comunicativa sin repartir formatos',()=>{
  expect(propose(fixtures.find(f=>f.topic==='weather')!.description).instrumentType).toBe('lista-cotejo')
  expect(propose(fixtures[0].description).instrumentType).toBe('rubrica')
  expect(propose(fixtures[0].description).internalTrace.ruleId).toBe('ENGLISH_COMMUNICATIVE_PURPOSE')
 })
 it('tiempo libre no introduce meteorología',()=>{
  const p=propose('Expresarán oralmente en inglés sus preferencias sobre actividades de tiempo libre.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-1-preferences','ing-1-intelligibility'])
 })
 it('escribir una invitación no obliga a responderla',()=>{
  const p=propose('Escribirán en inglés una invitación a una celebración.')
  expect(p.criteria[0].description).not.toMatch(/acepta|rechaza|recibida/)
 })
 it('responder a una invitación no obliga a formular otra',()=>{
  const p=propose('Responderán oralmente en inglés a una invitación, aceptándola o rechazándola con cortesía.')
  expect(p.criteria[0].description).not.toContain('Formula una invitación')
  expect(p.criteria[0].description).toMatch(/acepta o rechaza/i)
 })
 it('no usa el proveedor fuera de primero común ni por un recurso incidental',()=>{
  for(const change of [{grade:2},{level:'PRIMARY' as const},{subjectCode:'LEN'},{subjectCode:'FRA'},{subjectCode:'NAT'},{optativeExitName:'Humanidades y Lenguas Modernas'}])
   expect(resolveFirstGradeEnglishTask('Actividad',fixtures[0].description,{...context,...change})).toBeNull()
  expect(resolveFirstGradeEnglishTask('Conversación personal','Analizarán una célula. Recursos: diálogo con información personal.',context)).toBeNull()
  expect(resolveFirstGradeEnglishTask('Actividad','Dibujarán un paisaje.',context)).toBeNull()
  expect(resolveFirstGradeEnglishTask('Actividad',fixtures[0].description,{...context,subjectCode:' ing '})).not.toBeNull()
  expect(resolveFirstGradeEnglishTask('Actividad',fixtures[0].description,{...context,subjectCode:'',subjectName:'Inglés'})).not.toBeNull()
 })
 for(const f of fixtures)for(const format of formats)for(const total of [20,17.35])it(`${f.topic} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total),text=JSON.stringify(p.criteria)
  expect(p.activityType).toBe(f.activity)
  expect(p.criteria.map(c=>c.templateId)).toEqual(f.criteria.map(id=>`ing-1-${id}`))
  for(const word of f.contains)expect(text).toContain(word)
  for(const word of f.excludes)expect(text.toLowerCase()).not.toContain(word.toLowerCase())
  expect(p.totalScoreUnits).toBe(Math.round(total*100))
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(p.criteria).toEqual(propose(f.description,format,total,'Pintamos una célula').criteria)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
 })
 for(const [purpose,format] of [
  ['Se valorará la calidad en varias dimensiones.','rubrica'],
  ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
  ['Se registrará la regularidad de cada indicador.','escala'],
  ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
 ] as const)it(`propósito ${format} y elección manual`,()=>{
  const description=fixtures[0].description+' '+purpose
  expect(propose(description).instrumentType).toBe(format)
  expect(suggestedSelections('ORAL_INTERACTION',context,description)).toEqual({suggestedEvaluationTechnique:'observacion-directa',suggestedInstrumentType:format})
  expect(propose(description,'rubrica').instrumentType).toBe('rubrica')
 })
})
