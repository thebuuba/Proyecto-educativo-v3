import {describe,it,expect} from 'vitest'
import {recommend,suggestedSelections} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-three-contracts.json'
import {evaluationCatalogForVersion} from './catalog-current'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType?:typeof formats[number],maxScore=20,title='Actividad',academic:Parameters<typeof recommend>[1]=context)=>recommend({activityTitle:title,description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},academic,null,[],'UNMAPPED',null)
describe('Inglés común tercero: funciones propias cotejadas en PDF146–151',()=>{
 it('identifica las familias definidas de tercero en la traza',()=>{
  expect(propose(fixtures[0].description).internalTrace.reasons).toContain('coverage=DEFINED_COMMON_THIRD_GRADE_PROVIDERS')
 })
 for(const f of fixtures)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${format} ${score}`,()=>{
  const p=propose(f.description,format,score)
  expect(p.activityType).toBe(f.activity)
  expect(p.criteria.map(c=>c.templateId)).toEqual(f.criteria.map(id=>`ing-3-${id}`))
  for(const word of f.contains)expect(JSON.stringify(p.criteria)).toContain(word)
  for(const word of f.excludes)expect(JSON.stringify(p.criteria).toLowerCase()).not.toContain(word)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria).toEqual(propose(f.description,format,score,'Dibujamos una célula').criteria)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('no activa tercero en catálogos anteriores ni en otros ámbitos',()=>{
  const input={activityTitle:'Actividad',description:fixtures[0].description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  for(const version of ['evaluation-2026.46','evaluation-2026.48','evaluation-2026.53'])expect(recommend(input,context,null,[],'UNMAPPED',null,evaluationCatalogForVersion(version)!).criteria.some(c=>c.templateId.startsWith('ing-3-'))).toBe(false)
  for(const change of [{grade:1},{grade:2},{grade:4},{level:'PRIMARY' as const},{subjectCode:'LEN'},{subjectCode:'NAT'},{subjectCode:'FRA'},{optativeExitName:'Humanidades'}])expect(propose(fixtures[0].description,'rubrica',20,'Actividad',{...context,...change}).criteria.some(c=>c.templateId.startsWith('ing-3-'))).toBe(false)
 })
 for(const [purpose,instrument] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']] as const)it(`recomienda ${instrument} por propósito y conserva elección manual`,()=>{
  const description=fixtures[0].description+' '+purpose
  expect(propose(description).instrumentType).toBe(instrument)
  expect(suggestedSelections('ORAL_INTERACTION',context,description).suggestedInstrumentType).toBe(instrument)
  expect(propose(description,'rubrica').instrumentType).toBe('rubrica')
 })
})
