import {describe,it,expect} from 'vitest'
import {recommend,suggestedSelections} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-contracts.json'
import {resolveSecondGradeEnglishTask} from '@aula/shared'
import {evaluationCatalogForVersion} from './catalog-current'

const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
// Pending points belong to the editor adapter; the service requires a positive total.
const propose=(description:string,preferredInstrumentType?:typeof formats[number],maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)

describe('Inglés común segundo: funciones propias del currículo',()=>{
 it('conserva el género gramatical y la enumeración de los datos del encuentro',()=>{
  expect(propose(fixtures.find(f=>f.id==='plans')!.description).criteria[0].description).toContain('el día, la hora y el lugar')
 })
 it('aísla el proveedor y normaliza el contexto académico real',()=>{
  const description=fixtures.find(f=>f.id==='plans')!.description
  for(const change of [{grade:1},{grade:3},{level:'PRIMARY' as const},{subjectCode:'LEN'},{subjectCode:'NAT'},{subjectCode:'FRA'},{optativeExitName:'Humanidades'}])expect(resolveSecondGradeEnglishTask('Actividad',description,{...context,...change})).toBeNull()
  expect(resolveSecondGradeEnglishTask('Actividad',description,{...context,subjectCode:' ing '})).not.toBeNull()
  expect(resolveSecondGradeEnglishTask('Actividad',description,{...context,subjectCode:'',subjectName:'Inglés'})).not.toBeNull()
  expect(resolveSecondGradeEnglishTask('Encuentro','Analizarán una célula. Recursos: correo con un plan de encuentro.',context)).toBeNull()
 })
 it('mantiene el catálogo previo ajeno al proveedor nuevo',()=>{
  const p=recommend({activityTitle:'Actividad',description:fixtures[7].description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.46')!)
  expect(p.catalogVersion).toBe('evaluation-2026.46')
  expect(p.criteria.some(c=>c.templateId.startsWith('ing-2-'))).toBe(false)
 })
 for(const [description,id,activity] of [
  ['Intercambiarán por escrito información en inglés sobre actividades de la vida diaria.','daily','WRITTEN_PRODUCTION'],
  ['Presentarán oralmente en inglés los estados anímicos y físicos de un personaje ficticio.','states','ORAL_PRESENTATION'],
  ['Dialogarán en inglés para ofrecer recomendaciones sobre un problema cotidiano.','advice','ORAL_INTERACTION'],
  ['Conversarán en inglés sobre una situación escolar.','conversation','ORAL_INTERACTION'],
 ] as const)it(`conecta la función con denominación curricular o sinónimo: ${id}`,()=>{
  const p=propose(description)
  expect(p.activityType).toBe(activity)
  expect(p.criteria.map(c=>c.templateId)).toContain(`ing-2-${id}`)
 })
 for(const fixture of fixtures)for(const format of formats)for(const total of [20,17.35])it(`${fixture.id} ${format} ${total}`,()=>{
  const p=propose(fixture.description,format,total),text=JSON.stringify(p.criteria)
  expect(p.activityType).toBe(fixture.activity)
  expect(p.criteria.map(c=>c.templateId)).toEqual(fixture.criteria.map(id=>`ing-2-${id}`))
  for(const value of fixture.contains)expect(text).toContain(value)
  for(const value of fixture.excludes)expect(text.toLowerCase()).not.toContain(value.toLowerCase())
  expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
  expect(p.criteria).toEqual(propose(fixture.description,format,total,'Pintamos una célula').criteria)
  if(total!==undefined)expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const [purpose,format] of [
  ['Se valorará la calidad en varias dimensiones.','rubrica'],
  ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
  ['Se registrará la regularidad de cada indicador.','escala'],
  ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
 ] as const)it(`selección ${format} y prioridad manual`,()=>{
  const description=fixtures[0].description+' '+purpose
  expect(propose(description).instrumentType).toBe(format)
  expect(suggestedSelections('ORAL_INTERACTION',context,description).suggestedInstrumentType).toBe(format)
  expect(propose(description,'rubrica').instrumentType).toBe('rubrica')
 })
})
