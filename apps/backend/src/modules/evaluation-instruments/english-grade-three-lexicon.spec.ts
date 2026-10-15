import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-three-lexicon-contracts.json'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',score=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Tercero: vocabulario e intenciones expresivas propios, PDF146–147',()=>{
 for(const f of fixtures)for(const action of ['Leerán un texto en inglés e identificarán','Explicarán el significado de','Escribirán en inglés un mensaje utilizando'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35])it(`${f.id} ${action} ${format} ${score}`,()=>{
  const description=`${action} ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}${action.startsWith('Explicarán')?' con ejemplos de un texto en inglés':''}.`
  const p=propose(description,format,score),c=p.criteria.find(c=>c.templateId===`ing-3-lexicon-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(c!.description).not.toContain('Actividad')
  expect(p.criteria).toEqual(propose(description,format,score,'El circuito eléctrico').criteria)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('no traslada dinero, medicamentos o tallas de segundo',()=>{
  for(const term of ['dinero','medicamentos','tallas'])expect(propose(`Escribirán en inglés un mensaje utilizando vocabulario de ${term}.`).criteria.some(c=>c.templateId.startsWith('ing-3-lexicon-'))).toBe(false)
 })
 it('no exige compartir rasgos o dificultades reales para nombrar léxico',()=>{
  const p=propose('Escribirán en inglés un mensaje con vocabulario de estados de ánimo y problemáticas sociales de personajes ficticios.')
  expect(JSON.stringify(p.criteria)).not.toMatch(/debe padecer|su enfermedad|su personalidad|datos privados/)
 })
})
