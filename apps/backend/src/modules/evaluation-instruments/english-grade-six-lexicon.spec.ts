import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-six-lexicon-contracts.json'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ING',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Sexto:17 familias lexicas y4 intenciones propias de PDF170',()=>{
 for(const f of fixtures)for(const action of ['Leerán en inglés un texto e identificarán','Explicarán con ejemplos del texto en inglés','Escribirán en inglés un mensaje utilizando','Compararán en textos en inglés','Investigarán en textos en inglés'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${action} ${format} ${total}`,()=>{
  const description=`${action} ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}.`
  const p=propose(description,format,total),c=p.criteria.find(c=>c.templateId===`ing-6-lexicon-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  if(action.startsWith('Compararán')){expect(c!.description).toContain('Contrasta');expect(p.activityType).toBe('COMPARISON')}
  expect(p.criteria).toEqual(propose(description,format,total,'Una célula animal').criteria)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
})
