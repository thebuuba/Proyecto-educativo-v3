import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-three-contracts.json'
import subtopics from '../../../../../data/evaluation-instruments/language-grade-three-subtopic-contracts.json'
import procedures from '../../../../../data/evaluation-instruments/language-grade-three-procedure-contracts.json'
import {recommend,firstSecondaryLanguageSelections} from './recommendation-engine'
import {findSecondaryLanguageTopic,detectSecondaryLanguageActivity} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Lengua 3: contenido conectado al servicio',()=>{
 it('la investigación escrita recomienda analizar evidencias, sin exigir exposición',()=>{
  expect(firstSecondaryLanguageSelections('RESEARCH')?.suggestedEvaluationTechnique).toBe('analisis-producciones')
 })
 it('evalúa los gestos de recitación mediante expresión corporal, sin convertirlos en pausas',()=>{
  const proposal=recommend({activityTitle:'Trabajo',description:'Recitarán un madrigal usando gestos para expresar los sentimientos de los versos.',maxScore:15,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  const row=proposal.criteria.find(c=>c.templateId==='len-3-madrigal-feature-nonverbal')!
  expect(row.description).toContain('Relaciona los gestos')
  expect(row.description).not.toContain('mediante pausas')
  expect(row.descriptors.at(-1)!.text).toContain('No aporta evidencia gestual')
 })
 it('excluye optativas y otros grados; normaliza el código sin deducirlo del título',()=>{
  expect(findSecondaryLanguageTopic('La entrevista','', {...context,subjectCode:' len '})?.id).toBe('entrevista')
  expect(findSecondaryLanguageTopic('La entrevista','', {...context,optativeExitName:'Humanidades'})).toBeNull()
  expect(findSecondaryLanguageTopic('La entrevista','', {...context,grade:4})).toBeNull()
  expect(findSecondaryLanguageTopic('La entrevista','', {...context,subjectCode:'NAT'})).toBeNull()
  expect(detectSecondaryLanguageActivity('La noticia','Redactarán una noticia.',{...context,grade:1,optativeExitName:'Humanidades'})).toBeNull()
 })
 for(const [purpose,expected] of [
  ['Se valorará la calidad en varias dimensiones.','rubrica'],
  ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
  ['Se registrará la regularidad con que se cumplen los indicadores.','escala'],
  ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
 ] as const)it(`recomienda por propósito y conserva selección explícita: ${expected}`,()=>{
  const input={activityTitle:'Trabajo',description:`Analizarán una entrevista identificando sus roles y preguntas. ${purpose}`,maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe(expected)
  for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)expect(recommend({...input,preferredInstrumentType},context,null,[],'UNMAPPED',null).instrumentType).toBe(preferredInstrumentType)
 })
 for(const f of [...fixtures,...subtopics,...procedures])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${f.id} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:f.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(f.type)
  const row=p.criteria.find(c=>c.templateId===`len-3-${f.topic}-${f.criterion}`)
  expect(row).toBeDefined()
  expect(row!.description).toContain(f.contains)
  expect(JSON.stringify(p.criteria)).not.toContain(f.absent)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
 })
})
