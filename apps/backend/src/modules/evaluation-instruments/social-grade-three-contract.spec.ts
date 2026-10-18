import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-three-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}

describe('Sociales tercero: contratos de acciones de América y ciudadanía',()=>{
 for(const [id,absent] of [['war-crisis-research-plan','déficit'],['war-deficit-graphs','crisis']] as const)it(`${id}: no arrastra el otro contenido del grupo económico`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toMatch(new RegExp(absent,'i'))
 })
 it('el contraste de recursos naturales conserva las consecuencias sociales, ambientales y económicas',()=>{
  const task=contracts.cases.find(t=>t.id==='natural-resource-impacts')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.find(c=>c.templateId.endsWith('-comparison'))!.description).toContain('consecuencias socioambientales y económicas')
 })
 it('la atribución de autores y contextos no impone comparar casos al interpretar corrientes sociales',()=>{
  const task=contracts.cases.find(t=>t.id==='social-thought-sources')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-social-theories-perspectives','soc-3-social-theories-source-evidence'])
 })
 it('usar evidencias y responder en la mesa redonda no agrega un producto de relleno',()=>{
  const task=contracts.cases.find(t=>t.id==='coldwar-mural-roundtable')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-coldwar-latin-america-visual-information','soc-3-coldwar-latin-america-roundtable'])
 })
 it('la explicación prehispánica conserva la evidencia sin inventar una bibliografía o fila de fuentes separada',()=>{
  const task=contracts.cases.find(t=>t.id==='prehispanic-theories')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-prehispanic-societies-interpretation'])
  expect(p.criteria[0].description).toContain('evidencias de sus contextos')
 })
 it('la palabra contextos no equivale a textos proporcionados',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Explica la crisis de 1929 y sus contextos americanos.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-great-depression-interpretation'])
 })
 for(const [description,unrequested] of [
  ['Explica presupuesto y uso de los impuestos.','extracto presupuestario|documento presupuestario del ejercicio'],
  ['Explica derechos humanos.','textos proporcionados'],
  ['Explica símbolos patrios.','referencias proporcionadas'],
  ['Explica educación vial.','normas de tránsito expresamente proporcionadas'],
  ['Explica el poblamiento histórico de América.','indicados en las fuentes'],
  ['Explica el crecimiento poblacional de América.','períodos de los datos'],
 ])it(`la explicación breve no impone recursos o datos ausentes: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toMatch(new RegExp(unrequested,'i'))
  if(description.includes('presupuesto'))expect(p.criteria.some(c=>c.templateId.endsWith('-budget-evidence'))).toBe(false)
 })
 it('seleccionar fuentes confiables es una acción completa sin un segundo verbo',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Selecciona las fuentes confiables proporcionadas sobre la política del Gran Garrote.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-big-stick-source-reliability'])
 })
 it('elaborar un artículo sobre hipótesis proporcionadas no exige formular otra hipótesis',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Elabora un artículo de opinión sobre las hipótesis proporcionadas del origen geológico de América y argumenta su respaldo en los datos. No formules una nueva hipótesis.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId.endsWith('-hypothesis'))).toBe(false)
 })
 it('plantear una hipótesis sobre Panamá sí conserva su carácter provisional',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Plantea una hipótesis provisional sobre las implicaciones de la construcción del Canal de Panamá y la separación de Colombia a partir de los hechos dados.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='soc-3-panama-canal-separation-hypothesis')).toBe(true)
 })
 for(const [description,topic] of [
  ['Explica el impacto de la Segunda Guerra Mundial y la Guerra Fría en la República Dominicana con las fuentes dadas.','dominican-war-coldwar'],
  ['Investiga las dictaduras surgidas después de la Segunda Guerra Mundial en las fuentes dadas.','dictatorships'],
  ['Organiza un plan de investigación sobre la crisis económica durante la Segunda Guerra Mundial.','world-war-two-economy'],
  ['Analiza los gráficos de déficit económico de los países participantes en la Segunda Guerra Mundial proporcionados.','world-war-two-economy'],
  ['Investiga el fin de la Guerra Fría y la caída del socialismo en las fuentes indicadas.','coldwar-end'],
  ['Investiga el fin de la Segunda Guerra Mundial y la hegemonía de Estados Unidos en las fuentes dadas.','postwar-hegemony'],
  ['Compara el populismo de Getulio Vargas en Brasil y Juan Domingo Perón en Argentina con las fuentes proporcionadas.','populism'],
  ['Compara las actividades económicas de Brasil y México con las fuentes proporcionadas.','economic-activities'],
 ])it(`el contexto no obliga a estudiar otro tema: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.every(c=>c.templateId.startsWith(`soc-3-${topic}-`))).toBe(true)
 })
 for(const [id,type] of [
  ['geological-theory-discussion','ORAL_INTERACTION'],['colonial-societies-discussion','ORAL_INTERACTION'],
  ['coldwar-mural-roundtable','ORAL_INTERACTION'],['population-production-monograph','REPORT'],
  ['occupation-resistance-article','WRITTEN_PRODUCTION'],['mexican-revolution-newspaper','WRITTEN_PRODUCTION'],
  ['geological-opinion-article','WRITTEN_PRODUCTION'],['hegemony-essay','ESSAY'],['road-campaign-video','PROJECT'],
 ])it(`${id}: recomienda el propósito del producto o intercambio solicitado`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(type)
 })
 for(const description of [
  'Compara los artículos de opinión proporcionados sobre la crisis de 1929, distinguiendo sus afirmaciones y evidencias. No redactes otro artículo.',
  'Compara las monografías proporcionadas sobre el crecimiento poblacional de América. No elabores una monografía.',
  'Analiza el vídeo proporcionado de una campaña de educación vial. No crees otro vídeo ni participes en una campaña.',
  'Analiza el vídeo creado para la campaña de educación vial en el caso proporcionado. No crees otro vídeo.',
  'Analiza el vídeo producido para la campaña de educación vial en el caso proporcionado. No produzcas otro vídeo.',
 ])it(`un recurso proporcionado no se transforma en producción: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId).join(' ')).not.toMatch(/argumentative-text|monograph-content|campaign-message|multimedia-relations/)
  expect(p.activityType).not.toMatch(/WRITTEN_PRODUCTION|PROJECT|REPORT/)
 })
 it('separar hallazgos de inferencias no impone una comparación de modelos productivos',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Investiga en distintas fuentes los modelos de producción del continente americano indicados, diferenciando los hallazgos de tus inferencias. No estudies un modelo ausente de los casos.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-production-models-research-content','soc-3-production-models-sources'])
 })
 it('la frase «datos y explicaciones provisionales» no crea otra acción de explicación',()=>{
  const task=contracts.cases.find(t=>t.id==='millions-depression-hypothesis')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-great-depression-hypothesis'])
 })
 it('diferenciar antecedentes y efectos conserva las dos evidencias causales sin imponer otro contraste',()=>{
  const task=contracts.cases.find(t=>t.id==='dictatorship-causes-effects')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-dictatorships-causes','soc-3-dictatorships-consequences'])
 })
 it('la infografía de economía dominicana durante la guerra no exige también la Guerra Fría',()=>{
  const task=contracts.cases.find(t=>t.id==='dominican-war-economy-infographic')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(2)
  const text=p.criteria.map(c=>JSON.stringify({...c,templateId:undefined})).join(' ')
  expect(text).not.toMatch(/Guerra Fría/i)
  expect(text).toMatch(/economía dominicana/)
 })
 it('explicar las conexiones del mapa conceptual integra la evidencia del organizador',()=>{
  const task=contracts.cases.find(t=>t.id==='dominican-war-coldwar-organizer')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-dominican-war-coldwar-organizer-relations'])
 })
 it('investigar historia y significado de símbolos no puntúa dos veces el mismo contenido',()=>{
  const task=contracts.cases.find(t=>t.id==='symbol-history-research')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-national-symbols-research-content','soc-3-national-symbols-sources'])
 })
 it('las funciones de los organismos se investigan sin imponer una comparación entre otros casos',()=>{
  const task=contracts.cases.find(t=>t.id==='state-violence-prevention')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-violence-prevention-research-content','soc-3-violence-prevention-sources'])
 })
 it('explicar el alcance de las normas investigadas integra los hallazgos sin otra fila repetida',()=>{
  const task=contracts.cases.find(t=>t.id==='traffic-law-source-research')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-road-safety-research-content','soc-3-road-safety-sources'])
 })
 it('el contenido del artículo de opinión incluye el análisis sin duplicar otra fila de comprensión',()=>{
  const task=contracts.cases.find(t=>t.id==='geological-opinion-article')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-american-geology-argumentative-text','soc-3-american-geology-argument'])
 })
 it('el informe de coincidencias conserva atribución y contexto sin duplicar la misma evidencia de fuentes',()=>{
  const task=contracts.cases.find(t=>t.id==='antiplagiarism-report')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-world-war-two-similarity-context','soc-3-world-war-two-attribution-correction'])
 })
 it('comparar vulneraciones en dictaduras no exige estudiar también la Declaración Universal',()=>{
  const task=contracts.cases.find(t=>t.id==='dictatorships-human-rights')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toMatch(/Declaración Universal/i)
  expect(p.criteria.find(c=>c.templateId==='soc-3-human-rights-comparison')!.description).toMatch(/vulneraciones.*derechos.*hechos/)
 })
 it('realizar un vídeo educativo sí conserva su propósito de producción',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Realiza en equipo un vídeo para una campaña de educación vial que comunique las normas proporcionadas al destinatario indicado.',maxScore:20,participationMode:'GROUP',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('PROJECT')
  expect(p.criteria.some(c=>c.templateId.endsWith('-campaign-message'))).toBe(true)
 })
 it('el contraste de las informaciones publicadas integra afirmaciones, evidencia y conclusiones sin duplicar otra fila de fuentes',()=>{
  const task=contracts.cases.find(t=>t.id==='depression-authors-comparison')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-great-depression-comparison'])
  expect(p.criteria[0].description).toMatch(/afirmaciones, evidencias y conclusiones/)
 })
 it('distinguir afirmaciones y evidencias no convierte la interpretación de autores en comparación de casos',()=>{
  const task=contracts.cases.find(t=>t.id==='pollution-studies')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-3-pollution-perspectives','soc-3-pollution-source-evidence'])
 })
 it('conserva el100 congelado con las políticas de Inglés y Sociales realmente instaladas',async()=>{
  const {evaluationCatalogForVersion}=await import('./catalog-current')
  const frozen=evaluationCatalogForVersion('evaluation-2026.100')!
  expect(frozen.socialCommonModules).toHaveLength(2)
  expect(frozen.socialCommonModules![1].topics).toHaveLength(39)
  expect(frozen.socialCommonModules![1].policy).toBe('REQUESTED_SOCIAL_EVIDENCE_V2')
  expect(frozen.englishGradeSixModule!.policy).toBe('COMMON_SIXTH_GRADE_DEFINED_FAMILIES_REVIEW_PENDING_V2')
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${format}/${maxScore}`,()=>{
  const p=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(c=>c.templateId.startsWith('soc-3-'))).toBe(true)
  for(const key of task.requiredKeys)expect(p.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  const body=p.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(body).not.toMatch(new RegExp(task.absent,'i'))
 })
})
