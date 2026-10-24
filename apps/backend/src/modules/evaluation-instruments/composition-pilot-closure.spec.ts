import {describe,it,expect} from 'vitest'
import {extractPilotContract,composePilotInstrument} from '../../../../../packages/shared/src/instrument-composition-pilot'

const context=(subjectCode:string)=>({level:'SECONDARY' as const,grade:1,cycle:1,subjectCode,subjectName:subjectCode,modalityCode:null,optativeExitName:null})
describe('Cierre del piloto: procedencia numérica y duración observable',()=>{
 it.each([
  'Compara −0.75 y −2/3.',
  'Compara −0,75 y −2/3.',
  'Compara +1.25 y -3/2; escribe después.',
  'Compara 0, 1, 2 y 3.',
  'Compara −0.75 y −2/3.5.',
 ])('conserva el fragmento numérico original: %s',comparison=>{
  const description='Introducción. '+comparison+' Justifica con una recta numérica o con un texto con cálculos. No entregues ambos.'
  const contract=extractPilotContract(description,context('MAT'))!
  const requirement=contract.requirements.find(r=>r.key==='comparison')!
  expect(requirement.origin.text).toBe(comparison.split(';')[0].replace(/\.$/,''))
  expect(description.slice(requirement.origin.start,requirement.origin.end)).toBe(requirement.origin.text)
  expect(requirement.origin.text).not.toContain('Justifica')
 })
 it('mantiene índices originales con acentos descompuestos antes y dentro del requisito',()=>{
  const description='Introduccio\u0301n. Compara −0.75 y −2/3. Justifica con una recta nume\u0301rica o una explicacio\u0301n escrita con ca\u0301lculos.'
  const contract=extractPilotContract(description,context('MAT'))!
  expect(contract).not.toBeNull()
  for(const r of contract.requirements)expect(description.slice(r.origin.start,r.origin.end)).toBe(r.origin.text)
  expect(contract.requirements.find(r=>r.key==='comparison')?.origin.text).toBe('Compara −0.75 y −2/3')
  expect(contract.requirements.find(r=>r.key==='reasoning-choice')?.origin.text).toContain('ca\u0301lculos')
 })
 it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('%s no gradúa la incertidumbre ni puntúa dos veces la duración',instrumentType=>{
  for(const duration of ['cinco minutos','máximo cinco minutos','aproximadamente cinco minutos']){
   const description=`Expongan todos los planetas del sistema solar y expliquen qué son. La exposición durará ${duration}. Utilicen un dibujo o una lámina como material de apoyo.`
   const p=composePilotInstrument({description,context:context('NAT-TU'),maxScore:17.35,instrumentType,participationMode:'INDIVIDUAL'})!
   const rows=p.criteria.filter(c=>/cinco minutos/.test(JSON.stringify(c)))
   expect(rows).toHaveLength(1)
   const text=JSON.stringify(p.criteria)
   expect(text).not.toMatch(/no permite confirmar|evidencia disponible|aproxima la duración|siempre|casi siempre|a veces|±|entre \d/)
   expect(text).toContain('dibujo o la lámina')
   expect(p.internalTrace.composition!.uncovered).toEqual([])
   expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
   if(instrumentType==='lista-cotejo')expect(rows[0].templateId).toBe('pilot-duration')
   else {expect(rows[0].templateId).toBe('pilot-oral-communication');expect(p.criteria.some(c=>c.templateId==='pilot-duration')).toBe(false)}
   if(instrumentType==='lista-ponderada')expect(rows[0].description.split('Parcial (50%):')[1]).not.toMatch(/duración|cinco minutos|no supera/)
  }
 })
 it('distingue preparación y presentación en la misma oración',()=>{
  const description='Expongan todos los planetas del sistema solar y expliquen qué son. Tienen diez minutos para preparar y cinco minutos para exponer. No usen material de apoyo.'
  const c=extractPilotContract(description,context('NAT'))!
  const duration=c.requirements.find(r=>r.key==='duration')
  expect(duration?.origin.text).toBe('cinco minutos')
  expect(duration?.mode).toBe('EXACT')
  expect(extractPilotContract('Expongan todos los planetas del sistema solar y expliquen qué son. Tienen diez minutos para preparar.',context('NAT'))?.requirements.some(r=>r.key==='duration')).toBe(false)
 })
})
