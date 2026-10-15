import {describe,it,expect} from 'vitest'
import {recommend,suggestedSelections} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-four-contracts.json'
import {evaluationCatalogForVersion} from './catalog-current'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType?:typeof formats[number],maxScore=20,title='Actividad',academic:Parameters<typeof recommend>[1]=context)=>recommend({activityTitle:title,description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},academic,null,[],'UNMAPPED',null)
describe('Inglés común cuarto: funciones propias cotejadas en PDF158–162',()=>{
 it('identifica cuarto como conexión parcial sin atribuirle el cierre de tercero',()=>{
  expect(propose(fixtures[0].description).internalTrace.reasons).toContain('coverage=COMMON_FOURTH_GRADE_PROVIDERS_PARTIAL')
 })
 for(const f of fixtures)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${format} ${score}`,()=>{
  const p=propose(f.description,format,score)
  expect(p.activityType).toBe(f.activity)
  expect(p.criteria.map(c=>c.templateId)).toEqual(f.criteria.map(id=>`ing-4-${id}`))
  for(const word of f.contains)expect(JSON.stringify(p.criteria)).toContain(word)
  for(const word of f.excludes)expect(JSON.stringify(p.criteria).toLowerCase()).not.toContain(word)
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria).toEqual(propose(f.description,format,score,'Dibujamos una célula').criteria)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('no activa cuarto en catálogos anteriores, otros grados, asignaturas u optativas',()=>{
  const input={activityTitle:'Actividad',description:fixtures[0].description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  for(const version of ['evaluation-2026.46','evaluation-2026.53','evaluation-2026.55'])expect(recommend(input,context,null,[],'UNMAPPED',null,evaluationCatalogForVersion(version)!).criteria.some(c=>c.templateId.startsWith('ing-4-'))).toBe(false)
  for(const change of [{grade:1},{grade:2},{grade:3},{grade:5},{grade:6},{level:'PRIMARY' as const},{subjectCode:'LEN'},{subjectCode:'NAT'},{subjectCode:'FRA'},{optativeExitName:'Humanidades'}])expect(propose(fixtures[0].description,'rubrica',20,'Actividad',{...context,...change}).criteria.some(c=>c.templateId.startsWith('ing-4-'))).toBe(false)
 })
 for(const [purpose,instrument] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']] as const)it(`recomienda ${instrument} por propósito y respeta elección manual`,()=>{
  const description=fixtures[0].description+' '+purpose
  expect(propose(description).instrumentType).toBe(instrument)
  expect(suggestedSelections('ORAL_INTERACTION',context,description).suggestedInstrumentType).toBe(instrument)
  expect(propose(description,'rubrica').instrumentType).toBe('rubrica')
 })
})
