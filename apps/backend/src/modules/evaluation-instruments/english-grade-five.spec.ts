import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-five-contracts.json'
import {evaluationCatalogForVersion} from './catalog-current'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null}
const propose=(description:string,preferredInstrumentType:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Quinto común: funciones de PDF163–168',()=>{
 it('mantiene concordancia de los descriptores de sugerencia',()=>{
  const c=propose(fixtures.find(f=>f.id==='suggestion')!.description).criteria.find(c=>c.templateId==='ing-5-suggestion')!
  expect(c.progressionLevels![1]).toMatch(/^La sugerencia solicitada o comunicada /)
  expect(c.progressionLevels![2]).toContain('una sugerencia')
  expect(c.progressionLevels![4]).toContain('una sugerencia')
 })
 it('no activa el proveedor en catálogos anteriores, otras asignaturas o salidas optativas',()=>{
  const input={activityTitle:'Actividad',description:fixtures[0].description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  for(const version of ['evaluation-2026.46','evaluation-2026.55','evaluation-2026.60'])expect(recommend(input,context,null,[],'UNMAPPED',null,evaluationCatalogForVersion(version)!).criteria.some(c=>c.templateId.startsWith('ing-5-'))).toBe(false)
  for(const change of [{grade:1},{grade:2},{grade:3},{grade:4},{grade:6},{level:'PRIMARY' as const},{subjectCode:'LEN'},{subjectCode:'NAT'},{subjectCode:'FRA'},{optativeExitName:'Humanidades'}])expect(recommend(input,{...context,...change},null,[],'UNMAPPED',null).criteria.some(c=>c.templateId.startsWith('ing-5-'))).toBe(false)
 })
 for(const [purpose,instrument] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']] as const)it(`recomienda ${instrument} por propósito y respeta la elección manual`,()=>{
  const input={activityTitle:'Actividad',description:fixtures[0].description+' '+purpose,maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe(instrument)
  expect(propose(input.description,'rubrica').instrumentType).toBe('rubrica')
 })
 for(const f of fixtures)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total)
  expect(p.activityType).toBe(f.activity)
  expect(p.criteria.map(c=>c.templateId)).toEqual(f.criteria.map(id=>`ing-5-${id}`))
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria).toEqual(propose(f.description,format,total,'Células animales y vegetales').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 it('no exige datos médicos personales ni ofrece diagnósticos',()=>{
  const text=JSON.stringify(propose(fixtures.find(f=>f.id==='medical-interaction')!.description).criteria)
  expect(text).toContain('ficha');expect(text).not.toContain('diagnostica')
 })
})
