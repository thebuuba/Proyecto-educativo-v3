import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-two-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
describe('Sociales segundo: lectura de evidencias y contexto del grado',()=>{
 for(const [description,absent] of [
  ['Explica fallas geológicas.','mapas proporcionados'],
  ['Explica canales de Suez y Panamá.','mapas y períodos proporcionados'],
  ['Explica neocolonialismo y descolonización.','mapas proporcionados'],
  ['Explica riesgo y prevención de desastres.','indicaciones oficiales proporcionadas'],
  ['Explica clima y factores geográficos.','disponibles utilizando'],
  ['Explica el IDH.','Compara los indicadores económicos'],
  ['Representa en el mapamundi las rutas migratorias dadas, indicando origen, destino, dirección del flujo y leyenda.','leyenda del mapa proporcionado'],
 ])it(`No impone recursos ausentes: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.description).join(' ')).not.toContain(absent)
 })
 it('Indicadores es un sustantivo; no añade un producto a una explicación',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Explica Norte y Sur e indicadores de desarrollo.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-north-south-interpretation'])
 })
 it('Un proyecto con democracia y paz comparte las acciones y conserva ambos contenidos',()=>{
  const description=contracts.cases.find(t=>t.id==='democratic-project')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.filter(c=>c.templateId.endsWith('-project-actions'))).toHaveLength(1)
  const purpose=p.criteria.find(c=>c.templateId.endsWith('-project-purpose'))!.description
  expect(purpose).toContain('Estado de derecho');expect(purpose).toContain('conflicto')
 })
 for(const id of ['conflict-hypothesis','modern-postmodern-argument'])it(`${id}: distinguir datos o mencionar diferencias no exige comparar casos`,()=>{
  const description=contracts.cases.find(t=>t.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(false)
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${format}/${maxScore}`,()=>{
  const proposal=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-2-'))).toBe(true)
  if(task.requiredTopic)expect(proposal.criteria.every(c=>c.templateId.startsWith(`soc-2-${task.requiredTopic}-`))).toBe(true)
  for(const key of task.requiredKeys)expect(proposal.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  const body=proposal.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(body).not.toMatch(new RegExp(task.absent,'i'))
  expect(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
 })
})
