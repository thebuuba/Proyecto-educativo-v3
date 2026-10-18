import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-two-contracts.json'
import procedural from '../../../../../data/evaluation-instruments/social-grade-two-procedural-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
describe('Sociales segundo: lectura de evidencias y contexto del grado',()=>{
 for(const [id,required] of [
  ['mineral-resource-studies','extracción de recursos mineros'],
  ['governments-dictatorships','gobiernos y dictaduras'],
  ['dependent-capitalism','capitalismo dependiente'],
  ['imperialism-dominican-impact','República Dominicana entre 1886 y 1914'],
  ['democratic-contributions','aportes del modelo democrático'],
  ['democracy-authoritarian-contrast','sistemas democráticos y autoritarios'],
  ['constitutional-rule-of-law','artículos constitucionales'],
 ])it(`${id}: la evidencia conserva el objeto del contraste curricular`,()=>{
  const description=procedural.cases.find(t=>t.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.description).join(' ')).toContain(required)
 })
 it('La representación alternativa del símbolo conserva su explicación independiente y evita repetir alternativas equivalentes',()=>{
  const description=procedural.cases.find(t=>t.id==='national-symbol-model')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'lista-cotejo'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>/significado/.test(c.description))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-interpretation'))).toBe(true)
  expect(p.criteria.map(c=>c.description).join(' ')).not.toContain('O BIEN:')
 })
 it('La respuesta a objeciones pertenece a la discusión y no añade un producto de relleno',()=>{
  const description=procedural.cases.find(t=>t.id==='hypothesis-discussion')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-peace-hypothesis-discussion'])
 })
 it('La investigación para acción climática no impone estudiar tipos o factores del clima',()=>{
  const description=procedural.cases.find(t=>t.id==='ecological-educational-proposal')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  const body=p.criteria.map(c=>c.description).join(' ')
  expect(body).toContain('sostenibilidad local')
  expect(body).not.toMatch(/tipos o elementos|factores geográficos/)
 })
 it('Investigar causas de guerra y revolución no impone consecuencias o posguerra',()=>{
  const description=procedural.cases.find(t=>t.id==='war-russian-research-hypotheses')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.filter(c=>c.templateId.endsWith('-research-content')).map(c=>c.description).join(' ')).not.toMatch(/consecuencias|posguerra|actores y cambios/)
 })
 it('La investigación Norte-Sur sin indicadores no exige IDH ni indicadores',()=>{
  const description=procedural.cases.find(t=>t.id==='north-south-research')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toMatch(/indicadores|\bIDH\b/)
 })
 it('La comparación de gráficos poblacionales Norte-Sur conserva una sola evidencia estadística',()=>{
  const description=procedural.cases.find(t=>t.id==='north-south-population-graphs')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-population-structure-statistical-series'])
  expect(p.criteria[0].description).toContain('Norte y del Sur')
 })
 for(const [id,absent] of [
  ['human-impact-hypothesis','calentamiento global'],
  ['financial-power-research','Compara los casos solicitados'],
  ['north-south-scheme','indicadores de desarrollo'],
 ])it(`${id}: conserva el objeto específico solicitado`,()=>{
  const description=procedural.cases.find(t=>t.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toContain(absent)
 })
 for(const [id,key] of [['environmental-protocols','environmental-measures'],['north-south-scheme','organizer-relations']])it(`${id}: la explicación anafórica no repite el contenido`,()=>{
  const description=procedural.cases.find(t=>t.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(new RegExp('-'+key+'$'))
 })
 it('Cambio climático regional no añade otra investigación de tipos de clima',()=>{
  const description=procedural.cases.find(t=>t.id==='regional-climate-research')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-human-impact-research-content','soc-2-human-impact-sources'])
  expect(p.criteria[0].description).toContain('cambio climático')
 })
 it('La incidencia climática en población conserva la relación y no obliga a proponer lo que proponen las fuentes',()=>{
  const description=procedural.cases.find(t=>t.id==='climate-population-research')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-climate-research-content','soc-2-climate-sources'])
  expect(p.criteria[0].description).toContain('crecimiento de la población')
 })
 it('Presentar los hallazgos no añade un producto distinto a la investigación y su pregunta',()=>{
  const description=procedural.cases.find(t=>t.id==='warming-research-project')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-human-impact-research-content','soc-2-human-impact-sources','soc-2-human-impact-question'])
 })
 for(const [id,keys] of [
  ['historical-source-purpose',['soc-2-historical-sources-historical-source-purpose']],
  ['climate-factor-research',['soc-2-climate-research-content','soc-2-climate-sources']],
 ] as const)it(`${id}: no duplica la explicación ni inventa un documento que analizar`,()=>{
  const description=procedural.cases.find(t=>t.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual([...keys])
 })
 it('Justificar cuáles fuentes son confiables no añade otra explicación ni otra postura',()=>{
  const description=procedural.cases.find(t=>t.id==='seismic-source-credibility')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-2-seismic-source-reliability'])
 })
 for(const [id,activityType] of [
  ['historical-source-purpose','ANALYSIS'],['war-us-expository-article','WRITTEN_PRODUCTION'],
  ['hypothesis-discussion','ORAL_INTERACTION'],['weather-instrument-recording','PERFORMANCE'],
 ])it(`${id}: recomienda el propósito de la actividad, no una palabra secundaria`,()=>{
  const description=procedural.cases.find(t=>t.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(activityType)
 })
 it('La argumentación normativa utiliza las normas dadas sin añadir una fila de fuentes repetida',()=>{
  const description=procedural.cases.find(t=>t.id==='human-rights-incident')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  const argument=p.criteria.find(c=>c.templateId.endsWith('-argument'))!
  expect(argument.description).toContain('las normas proporcionadas')
  expect(p.criteria.filter(c=>c.templateId.endsWith('-source-evidence'))).toHaveLength(0)
 })
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
 for(const task of [...contracts.cases,...procedural.cases])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${format}/${maxScore}`,()=>{
  const proposal=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-2-'))).toBe(true)
  if(task.requiredTopic)expect(proposal.criteria.every(c=>c.templateId.startsWith(`soc-2-${task.requiredTopic}-`))).toBe(true)
  for(const key of task.requiredKeys)expect(proposal.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  const body=proposal.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(body).not.toMatch(new RegExp(task.absent,'i'))
  expect(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
 })
})
