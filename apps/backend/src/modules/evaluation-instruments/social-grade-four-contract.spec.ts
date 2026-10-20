import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-four-contracts.json'
import {recommend} from './recommendation-engine'
import {resolveCommonSocialTask,commonSocialSelections} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}

describe('Sociales cuarto: contratos de geografía universal, historia y ciudadanía',()=>{
 for(const [id,key,absent] of [
  ['dialogue-viewpoint-only','dialogue-contributions',/reformula|registra acuerdos|negociación|alternativas/],
  ['campaign-actions-only','campaign-actions',/Elabora el mensaje|Mensaje de la campaña/],
  ['road-talk-without-demonstration','interactive-talk-plan',/demostración|recursos proporcionados/],
 ] as const)it(`${id}: no añade acciones o recursos que fueron excluidos`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(new RegExp('-'+key+'$'))
  expect(JSON.stringify(p.criteria)).not.toMatch(absent)
 })
 for(const [description,instrument] of [
  ['Identifica los ríos y lagos indicados en el mapa proporcionado.','lista-cotejo'],
  ['Elabora el mensaje y las acciones de una campaña escolar simulada de educación vial para los destinatarios del caso.','rubrica'],
  ['Observa con qué frecuencia se cumplen las reglas de educación vial en la simulación.','escala'],
  ['Analiza los mapas de recursos hídricos proporcionados. Asigna crédito parcial a sus componentes.','lista-ponderada'],
 ] as const)it(`instrumento por propósito: ${instrument}`,()=>{
  const task=resolveCommonSocialTask('',description,context)!
  expect(commonSocialSelections(task,description).suggestedInstrumentType).toBe(instrument)
 })
 it('el diálogo observado usa observación directa, sin exigir un producto escrito',()=>{
  const description=contracts.cases.find(t=>t.id==='peaceful-dialogue-consensus')!.description
  expect(resolveCommonSocialTask('',description,context)!.technique).toBe('observacion-directa')
 })
 for(const [id,type] of [
  ['peaceful-dialogue-consensus','ORAL_INTERACTION'],['rights-forum','ORAL_INTERACTION'],
  ['rivers-lakes-map','PROJECT'],['rivers-lakes-model','PROJECT'],['peace-campaign-message','PROJECT'],
  ['constitution-brochure','PROJECT'],['interactive-road-talk-plan','PROJECT'],
  ['geographic-representation-reading','ANALYSIS'],['reformation-thematic-report','REPORT'],
 ])it(`${id}: recomienda el tipo según la acción real`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(type)
 })
 it('explicar el concepto de diálogo no recomienda practicarlo',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Explica escucha y diálogo.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ANALYSIS')
 })
 it('las ventajas educativas del estilo de vida conservan el alcance social y estatal',()=>{
  const task=contracts.cases.find(t=>t.id==='healthy-lifestyle-benefits')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toContain('ventajas sociales y para el Estado')
  expect(p.criteria[0].description).toContain('datos del material educativo')
 })
 it('la mesa redonda ya integra aportes y respuestas',()=>{
  const task=contracts.cases.find(t=>t.id==='global-warming-roundtable')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-climate-change-roundtable'])
 })
 it('explicar la viabilidad de las alternativas conserva una propuesta con fundamento',()=>{
  const task=contracts.cases.find(t=>t.id==='coexistence-proposal')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-peace-proposal'])
  expect(p.criteria[0].description).toContain('condiciones y derechos')
 })
 it('las propuestas de convivencia integran la justificación de sus propias acciones',()=>{
  const task=contracts.cases.find(t=>t.id==='civic-coexistence-proposals')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-peace-proposal','soc-4-road-safety-proposal','soc-4-taxes-proposal'])
 })
 it('las partidas presupuestarias no duplican su identificación como tarea genérica',()=>{
  const task=contracts.cases.find(t=>t.id==='tax-investment-identification')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-taxes-budget-evidence'])
 })
 it('el foro integra sus respuestas sin exigir otro producto',()=>{
  const task=contracts.cases.find(t=>t.id==='rights-forum')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-human-rights-forum-contributions'])
 })
 it('el ensayo de convenios separa análisis y argumento sin duplicar respaldo documental',()=>{
  const task=contracts.cases.find(t=>t.id==='rights-convention-essay')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-human-rights-convention-evidence','soc-4-human-rights-argument'])
 })
 it('la investigación de monumentos conserva historia y significado sin añadir comparación',()=>{
  const task=contracts.cases.find(t=>t.id==='national-monument-presentation')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-national-identity-research-content','soc-4-national-identity-sources','soc-4-national-identity-oral'])
  expect(p.criteria[0].description).toContain('historia y significado cultural')
  expect(p.criteria[0].description).toContain('monumentos y lugares emblemáticos')
 })
 it('la comparación explícita se conserva aunque después se distingan contextos',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Compara los monumentos y lugares emblemáticos de la nación dados, distinguiendo su historia y significado cultural.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='soc-4-national-identity-comparison')).toBe(true)
 })
 it('las soluciones diferenciadas no añaden una comparación de casos',()=>{
  const task=contracts.cases.find(t=>t.id==='road-tax-proposals')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-road-safety-proposal','soc-4-taxes-proposal'])
 })
 it('el debate valora la respuesta a réplicas sin añadir un producto',()=>{
  const task=contracts.cases.find(t=>t.id==='human-rights-debate')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-human-rights-argument','soc-4-human-rights-response'])
  expect(p.criteria[1].description).toContain('réplicas')
 })
 it('el folleto constitucional utiliza los artículos dados sin inventar vigencia',()=>{
  const task=contracts.cases.find(t=>t.id==='constitution-brochure')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toContain('artículos constitucionales proporcionados')
  expect(p.criteria[0].description).toContain('sin atribuir vigencia no comprobada')
 })
 it('la línea del siglo XIX no añade siglo XVIII ni otra comparación',()=>{
  const task=contracts.cases.find(t=>t.id==='nineteenth-century-timeline')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-europe-eighteenth-nineteenth-sequence'])
  expect(JSON.stringify(p.criteria)).not.toContain('XVIII')
 })
 it('la justificación de procedencia documental no duplica una argumentación temática',()=>{
  const task=contracts.cases.find(t=>t.id==='digital-historical-recovery')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-digital-history-sources-digital-source-recovery'])
 })
 for(const [id,keys] of [
  ['reformation-thematic-report',['soc-4-reformation-report-content','soc-4-reformation-source-evidence']],
  ['us-independence-factors',['soc-4-us-independence-causes','soc-4-us-independence-source-evidence']],
 ] as const)it(`${id}: las precisiones anafóricas no duplican la evidencia principal`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(keys)
 })
 it('investigar civilizaciones conserva espacios y períodos sin imponer otra comparación',()=>{
  const task=contracts.cases.find(t=>t.id==='american-civilization-research')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-american-civilizations-research-content','soc-4-american-civilizations-sources'])
 })
 it('el periódico de civilizaciones modernas no exige además las antiguas',()=>{
  const task=contracts.cases.find(t=>t.id==='modern-civilization-newspaper')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toContain('antiguas')
 })
 it('las respuestas en la discusión no se convierten en un producto nuevo',()=>{
  const task=contracts.cases.find(t=>t.id==='medieval-guided-discussion')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-medieval-europe-discussion','soc-4-medieval-europe-response'])
  expect(p.criteria[1].description).toContain('Responde')
 })
 it('el esquema de especies representa ramificaciones sin añadir comparación de creencias',()=>{
  const task=contracts.cases.find(t=>t.id==='human-evolution-organizer')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-hominization-organizer-relations'])
  expect(p.criteria[0].description).toContain('ramificación')
  expect(p.criteria[0].description).toContain('fuentes proporcionadas')
  expect(p.criteria[0].description).not.toContain('tipos de justificación')
 })
 it('las etapas de prehistoria no añaden una segunda identificación de toda la historia',()=>{
  const task=contracts.cases.find(t=>t.id==='prehistoric-stages-identification')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-prehistory-identification'])
 })
 it('distinguir procedencia y evidencia de hallazgos no compara casos nuevos',()=>{
  const task=contracts.cases.find(t=>t.id==='human-action-research')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-human-impact-research-content','soc-4-human-impact-sources'])
 })
 it('el análisis documental del acuerdo ya incorpora el respaldo de sus afirmaciones',()=>{
  const task=contracts.cases.find(t=>t.id==='kyoto-agreement-analysis')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-kyoto-agreements-agreement-evidence'])
 })
 for(const [id,key,meaning] of [
  ['political-geography-decisions','causes','decisiones internacionales'],
  ['continental-position-influence','causes','economía, política y cultura'],
  ['boundary-stability-analysis','interpretation','estabilidad y la paz'],
 ])it(`${id}: conserva el efecto o relación expresamente solicitado`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  const row=p.criteria.find(c=>c.templateId.endsWith('-'+key))!
  expect(row.description).toContain(meaning)
  expect(row.title).not.toMatch(/^Causas de (geografía|distribución)/)
 })
 it('presentar hallazgos no añade un producto a la investigación del relieve',()=>{
  const task=contracts.cases.find(t=>t.id==='continental-relief-research')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'GROUP',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-continental-relief-research-content','soc-4-continental-relief-sources'])
 })
 it('formular una hipótesis con observaciones dadas no ejecuta lo que queda por contrastar',()=>{
  const task=contracts.cases.find(t=>t.id==='earth-shape-hypothesis')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-earth-shape-hypothesis'])
 })
 it('contrastar explícitamente la hipótesis sí exige evidencia, sin ejecutar otra observación',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Formula y contrasta una hipótesis provisional sobre la forma de la Tierra con las observaciones dadas.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-4-earth-shape-hypothesis','soc-4-earth-shape-hypothesis-evidence'])
 })
 for(const [id,topic] of [['time-zone-source-history','time-zones'],['hydrological-research-comparison','water-cycle']])it(`${id}: el contraste de fuentes integra afirmaciones, evidencias y contexto sin otra fila repetida`,()=>{
  const task=contracts.cases.find(t=>t.id===id)!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual([`soc-4-${topic}-comparison`])
  expect(p.criteria[0].description).toContain('afirmaciones, evidencias y conclusiones')
 })
 for(const [description,id] of [
  ['Explica escucha y diálogo.','dialogue'],
  ['Explica recuperación de fuentes históricas digitales.','digital-history-sources'],
 ])it(`explicar el concepto no obliga a realizarlo: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual([`soc-4-${id}-interpretation`])
 })
 for(const society of ['China','India','islam','África','Rusia'])it(`permite estudiar solo ${society} hasta el sigloXVI sin imponer las otras sociedades`,()=>{
  const p=recommend({activityTitle:'Actividad',description:`Explica los procesos de ${society} hasta el siglo XVI.`,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.every(c=>c.templateId==='soc-4-societies-sixteenth-century-interpretation')).toBe(true)
  const body=p.criteria.map(c=>JSON.stringify({...c,id:undefined})).join(' ')
  for(const other of ['China','India','islam','África','Rusia'].filter(c=>c!==society))expect(body).not.toMatch(new RegExp(other,'i'))
 })
 for(const [description,unrequested] of [
  ['Explica métodos e información geográfica y social.','método indicado'],
  ['Explica planetas del sistema solar.','fuentes examinadas'],
  ['Explica forma de la Tierra.','Explica las explicaciones'],
  ['Explica placas tectónicas y desplazamientos.','referencias de las fuentes'],
  ['Explica zonas volcánicas y sísmicas continentales.','límites de sus datos'],
  ['Explica corrientes marinas continentales.','espacios y fuentes'],
  ['Explica producción pesquera.','contextos y fuentes'],
  ['Explica cambio climático y calentamiento global.','acciones examinadas'],
  ['Explica bloques económicos del mundo.','informaciones cuantitativas o cualitativas'],
  ['Explica Protocolo de Kioto y acuerdos climáticos.','acuerdos climáticos proporcionados'],
  ['Analiza el Protocolo de Kioto.','acuerdos climáticos proporcionados'],
  ['Explica Constitución dominicana.','disposiciones constitucionales expresamente proporcionadas'],
  ['Explica Estado de derecho y poderes del Estado.','documentos del ejercicio'],
  ['Explica sondeos y encuestas de la comunidad.','expresamente proporcionados o autorizados'],
  ['Explica reservas naturales y áreas protegidas.','documentos del ejercicio'],
  ['Explica Revolución haitiana.','fuentes del ejercicio'],
  ['Explica Revolución China.','fuentes indicadas'],
 ])it(`la consigna breve no impone una condición o redacción ausente: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toContain(unrequested)
 })
 it('la identificación de áreas conserva ubicaciones y categorías sin inventar vigencia legal',()=>{
  const task=contracts.cases.find(t=>t.id==='protected-area-identification')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/ubicaciones y categorías/)
  expect(p.criteria.map(c=>c.description).join(' ')).toContain('sin afirmar vigencia legal no comprobada')
 })
 it('la actividad de símbolos valora significado e historia sin sentimientos patrióticos',()=>{
  const task=contracts.cases.find(t=>t.id==='symbol-community-contribution')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/historia, significado/)
  expect(p.criteria.map(c=>c.description).join(' ')).toContain('sin puntuar adhesión o sentimientos personales')
 })
 it('conserva el payload101 congelado sin añadirle el proveedor de cuarto',async()=>{
  const {evaluationCatalogForVersion,evaluationCatalogCurrent}=await import('./catalog-current')
  const frozen=evaluationCatalogForVersion('evaluation-2026.101')!
  expect(frozen.socialCommonModules!.map(m=>m.grade)).toEqual([1,2,3])
  expect(frozen.socialCommonModules![2].topics).toHaveLength(46)
  expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.141')
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${format}/${maxScore}`,()=>{
  const proposal=recommend({activityTitle:'Título antiguo de biología',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(proposal.criteria.length).toBeGreaterThan(0)
  expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-4-'))).toBe(true)
  for(const key of task.requiredKeys)expect(proposal.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  expect(proposal.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  expect(proposal.criteria.length).toBeLessThanOrEqual(20)
  const body=proposal.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join(' ')
  expect(body).not.toMatch(new RegExp(task.absent,'i'))
 })
})
