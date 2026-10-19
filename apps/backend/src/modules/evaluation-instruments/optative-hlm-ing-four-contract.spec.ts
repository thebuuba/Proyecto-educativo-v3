import {describe,it,expect} from 'vitest'
import {commonSecondaryEnglish,resolveCommonEnglishTask} from '@aula/shared'
import contracts from '../../../../../data/evaluation-instruments/optative-hlm-ing-four-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
describe('HLM cuarto: información en inglés',()=>{
 it('solicitar información no exige producir una respuesta',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Escriban en inglés una pregunta para solicitar información sobre el horario proporcionado.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const row=p.criteria.find(r=>r.templateId==='opt-hlm-ing-4-information')!
  expect([row.description,...(row.progressionLevels??[])].join(' ')).not.toMatch(/respuesta|ofrece/)
 })
 it('ofrecer información no exige formular una pregunta',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Escriban un mensaje en inglés para ofrecer información sobre el horario proporcionado.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const row=p.criteria.find(r=>r.templateId==='opt-hlm-ing-4-information')!
  expect([row.description,...(row.progressionLevels??[])].join(' ')).not.toMatch(/pregunta|Solicita/)
 })
 it('una pregunta escrita no impone la cohesión de un mensaje extendido',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Escriban en inglés una pregunta para solicitar información sobre el horario proporcionado.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId==='opt-hlm-ing-4-written')).toBe(false)
 })
 for(const id of ['theme-7','strategy-137-cultural-comparison-14'])it('el tema no exige comunicar acciones de cuidado/'+id,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId==='opt-hlm-ing-4-context-care')).toBe(false)
 })
 it('conserva la comunicación de cuidado expresamente solicitada',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Leerán en inglés un mensaje e identificarán las acciones indicadas para cuidar la salud de la situación proporcionada.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId==='opt-hlm-ing-4-context-care')).toBe(true)
 })
 it('las oraciones independientes no exigen enlazarse como un mensaje',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Escribe oraciones independientes en inglés utilizando will.',maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(r=>r.templateId==='opt-hlm-ing-4-feature-will')).toBe(true)
  expect(p.criteria.some(r=>r.templateId==='opt-hlm-ing-4-written')).toBe(false)
 })
 it('la escala de revisión conserva lo correcto y corrige solo problemas observados',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Escribirán en inglés un mensaje y revisarán el sentido y la corrección del mensaje.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const row=p.criteria.find(r=>r.templateId==='opt-hlm-ing-4-strategy-revision')!
  expect(row.progressionLevels?.join(' ')).toMatch(/conserva lo correcto.*si los hay/)
 })
 it('la lectura breve sugiere cotejo y permite una rúbrica manual',()=>{
  const input={activityTitle:'Actividad',description:'Lee la noticia proporcionada en inglés.',maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe('lista-cotejo')
  expect(recommend({...input,preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null).instrumentType).toBe('rubrica')
 })
 it('explicar conectores de contraste no se convierte en una comparación por el nombre del recurso',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Explicarán en inglés la función de los conectores de contraste con ejemplos proporcionados.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},{...context,subjectCode:'ING',optativeExitName:null},null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS')
 })
 for(const action of ['Contrasta','Contraste'])it('conserva el imperativo de comparar/'+action,()=>{
  const p=recommend({activityTitle:'Actividad',description:action+' en inglés la función del presente simple y el pasado simple en los ejemplos proporcionados.',maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('COMPARISON')
 })
 it('normaliza el código igual que el guard y la alternativa local',()=>{
  const p=recommend({activityTitle:'Actividad',description:contracts.cases[0].description,maxScore:20,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},{...context,subjectCode:' opt-hlm-ing-4 '},null,[],'UNMAPPED',null)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-ing-4-'))).toBe(true)
 })
 it('conserva el guard del componente común',()=>{
  expect(commonSecondaryEnglish(context)).toBe(false)
  expect(resolveCommonEnglishTask('Actividad',contracts.cases[0].description,context)).toBeNull()
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const score of [20,17.35])it(task.id+'/'+format+'/'+score,()=>{
  const mode='participationMode'in task&&task.participationMode==='GROUP'?'GROUP':'INDIVIDUAL'
  const p=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore:score,preferredInstrumentType:format,participationMode:mode},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(r=>r.templateId.startsWith('opt-hlm-ing-4-'))).toBe(true)
  expect(p.instrumentType).toBe(format);expect(p.activityType).toBe(task.activityType);expect(p.participationMode).toBe(mode)
  expect(p.criteria.reduce((n,r)=>n+r.maxScoreUnits,0)).toBe(Math.round(score*100))
  const ids=p.criteria.map(r=>r.templateId.split(':')[0])
  if('expectedAll'in task&&task.expectedAll)for(const id of task.expectedAll)expect(ids).toContain(id)
  if('expectedAny'in task&&task.expectedAny?.length)expect(task.expectedAny.some(id=>ids.includes(id))).toBe(true)
  if('forbiddenTemplateIds'in task&&task.forbiddenTemplateIds)for(const id of task.forbiddenTemplateIds)expect(ids).not.toContain(id)
  if('forbiddenTemplatePrefix'in task&&task.forbiddenTemplatePrefix)expect(ids.some(id=>id.startsWith(task.forbiddenTemplatePrefix!))).toBe(false)
  const full=p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[])].join(' ')).join(' ')
  if('required'in task&&task.required)expect(full).toMatch(new RegExp(task.required,'i'))
  if('forbidden'in task&&task.forbidden)expect(full).not.toMatch(new RegExp(task.forbidden,'i'))
  if('singleGenreChoice'in task&&task.singleGenreChoice)expect(ids.filter(id=>id.includes('-genre-'))).toHaveLength(1)
  expect(p.criteria.map(r=>[r.title,r.description,...(r.progressionLevels??[])].join(' ')).join(' ')).not.toMatch(/células|título antiguo/)
  if(task.id==='news-oral-and-written'){
   expect(p.criteria.some(r=>r.templateId.endsWith('-written'))).toBe(true)
   expect(p.criteria.some(r=>r.templateId.endsWith('-intelligibility'))).toBe(true)
  }
 })
})
