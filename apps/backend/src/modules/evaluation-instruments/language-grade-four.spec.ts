import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-four-contracts.json'
import subtopics from '../../../../../data/evaluation-instruments/language-grade-four-subtopic-contracts.json'
import procedures from '../../../../../data/evaluation-instruments/language-grade-four-procedure-contracts.json'
import {recommend} from './recommendation-engine'
import {findSecondaryLanguageTopic} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Lengua 4: contenido conectado al servicio',()=>{
 for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`informe con datos dados no impone buscar fuentes: ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Trabajo',description:'Redactarán un informe de investigación con los datos proporcionados, relacionando problema, método y resultados.',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId.endsWith('research-sources'))).toBe(false)
 })
 it('mantiene grados, asignaturas y optativas separados',()=>{
  expect(findSecondaryLanguageTopic('Trabajo','Analizarán un soneto.',{...context,subjectCode:' len '})?.id).toBe('soneto')
  expect(findSecondaryLanguageTopic('Trabajo','Analizarán un soneto.',{...context,optativeExitName:'Humanidades'})).toBeNull()
  expect(findSecondaryLanguageTopic('Trabajo','Analizarán un soneto.',{...context,grade:3})).toBeNull()
  expect(findSecondaryLanguageTopic('Trabajo','Analizarán un soneto.',{...context,subjectCode:'NAT'})).toBeNull()
 })
 for(const [purpose,expected] of [
  ['Se valorará la calidad en varias dimensiones.','rubrica'],
  ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
  ['Se registrará la regularidad con que se cumplen los indicadores.','escala'],
  ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
 ] as const)it(`recomienda por propósito y conserva selección explícita: ${expected}`,()=>{
  const input={activityTitle:'Trabajo',description:`Analizarán un instructivo identificando sus pasos. ${purpose}`,maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe(expected)
  for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)expect(recommend({...input,preferredInstrumentType},context,null,[],'UNMAPPED',null).instrumentType).toBe(preferredInstrumentType)
 })
 for(const f of [...fixtures,...subtopics,...procedures])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${f.id} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:f.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(f.type)
  const row=p.criteria.find(c=>c.templateId===`len-4-${f.topic}-${f.criterion}`)
  expect(row).toBeDefined()
  expect(row!.description).toContain(f.contains)
  expect(JSON.stringify(p.criteria)).not.toContain(f.absent)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
 })
})
