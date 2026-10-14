import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-lexicon-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const descriptionFor=(term:string,index:number,receptive:boolean)=>receptive?`Leerán un texto en inglés e identificarán ${index<39?'vocabulario de':'expresiones para'} ${term}.`:`Escribirán un mensaje en inglés usando ${index<39?'vocabulario de':'expresiones para'} ${term}.`
describe('Léxico y expresiones explícitos de Inglés primero',()=>{
 for(const [index,f] of fixtures.entries())for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${preferredInstrumentType} ${maxScore}`,()=>{
  for(const receptive of [false,true]){
   const p=recommend({activityTitle:'Actividad',description:descriptionFor(f.term,index,receptive),maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
   const row=p.criteria.find(c=>c.templateId===`ing-1-lexicon-${f.id}`)
   expect(row,JSON.stringify(p.criteria.map(c=>c.templateId))).toBeDefined()
   expect(row!.progressionLevels?.length).toBe(5)
   if(!receptive)expect(row!.description).toContain(f.meaning)
   else expect(row!.description).not.toMatch(/explica|Emplea|Redacta/)
   expect(p.totalScoreUnits).toBe(Math.round(maxScore*100))
   expect(row!.descriptors.length).toBe(['rubrica','escala'].includes(preferredInstrumentType)?4:0)
  }
 })
 it('no añade campos léxicos negados ni materiales incidentales',()=>{
  const p=recommend({activityTitle:'Los colores',description:'Escribirán un mensaje en inglés usando vocabulario de deportes. No se requiere vocabulario de colores. Recursos: cartel de alimentos.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.filter(c=>c.templateId.includes('lexicon')).map(c=>c.templateId)).toEqual(['ing-1-lexicon-sports'])
 })
 it('no traslada las familias a otros grados, asignaturas u optativas',()=>{
  for(const override of [{grade:2},{subjectCode:'LEN'},{optativeExitName:'Inglés optativo'}]){
   const p=recommend({activityTitle:'Actividad',description:'Escribirán en inglés usando vocabulario de alimentos.',maxScore:20,participationMode:'INDIVIDUAL'},{...context,...override},null,[],'UNMAPPED',null)
   expect(p.criteria.every(c=>!c.templateId.startsWith('ing-1-'))).toBe(true)
  }
 })
})
