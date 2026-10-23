import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-six-contracts.json'
import {recommend} from './recommendation-engine'
import {resolveCommonSocialTask,commonSocialSelections} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}

describe('Sociales sexto: territorio, población, economía e historia dominicana solicitados',()=>{
 it('conserva el release104 instalado y separa la corrección de vocabulario en105',async()=>{
  const {evaluationCatalogForVersion,evaluationCatalogCurrent}=await import('./catalog-current')
  const old=evaluationCatalogForVersion('evaluation-2026.104')!
  expect(old.socialCommonModules!.map(m=>m.grade)).toEqual([1,2,3,4,5,6])
  expect(old.socialCommonModules![5].topics.find(t=>t.id==='conflict-solutions')!.match).not.toContain('conflicto academico')
  const corrected=evaluationCatalogForVersion('evaluation-2026.105')!
  expect(corrected.socialCommonModules![5].topics.find(t=>t.id==='conflict-solutions')!.match).toContain('conflicto academico')
  expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.156')
 })
 it('conserva la instrucción de ponderación posterior al contenido no democrático',()=>{
  const description='Describe las prácticas no democráticas del caso mediante una lista ponderada.'
  const task=resolveCommonSocialTask('',description,context)!
  expect(commonSocialSelections(task,description).suggestedInstrumentType).toBe('lista-ponderada')
 })
 it('no democráticas es parte del contenido y conserva la cláusula siguiente',()=>{
  const text='Caracteriza prácticas democráticas y no democráticas de los casos dados, relacionando criterios y hechos. No recopiles datos privados.'
  const task=resolveCommonSocialTask('',text,context)!
  expect(task.actions.map(a=>a.text).join(' ')).toContain('no democraticas de los casos dados, relacionando criterios y hechos')
  expect(task.actions.map(a=>a.text).join(' ')).not.toContain('recopiles')
 })
 const proposal=(description:string)=>recommend({activityTitle:'Un título antiguo sobre células',description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
 it('el conflicto académico de una negociación permanece dentro del diálogo solicitado',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='collaborative-conflict-negotiation')!.description)
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.every(c=>c.templateId.startsWith('soc-6-dialogue-negotiation-'))).toBe(true)
 })
 for(const [id,count] of [['historical-map-1916-1930',1],['coup-triumvirate-april-balaguer-relations',1],['duarte-project-comparison',1],['school-civic-campaign-design',2]] as const)it(`integra el contenido y su evidencia sin duplicar desempeño: ${id}`,()=>{
  const p=proposal(contracts.cases.find(t=>t.id===id)!.description)
  expect(p.criteria).toHaveLength(count)
  expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(false)
 })
 it('un proyecto vial y tributario conserva ambos ámbitos con un solo propósito y seguimiento',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='road-tax-norm-project')!.description)
  expect(p.criteria).toHaveLength(3)
  expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/viales/)
  expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/tributarias/)
 })
 it('planificar una feria o exposición no exige presentarla oralmente',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='national-symbol-cultural-fair-plan')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria.some(c=>c.templateId.endsWith('-oral'))).toBe(false)
  expect(p.activityType).not.toBe('ORAL_PRESENTATION')
 })
 it('antes y después de la dictadura delimita el movimiento social y no añade otro análisis',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='democratic-social-movement-analysis')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/-social-movement-relations$/)
 })
 it('distinguir hechos y escenificación permanece en el fundamento de la dramatización',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='april-revolution-dramatization')!.description)
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(false)
 })
 it('la hipótesis de llegada en 1966 no exige contrastarla ni todo el período posterior',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='balaguer-arrival-hypothesis')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toContain('1966')
  expect(p.criteria[0].description).not.toContain('1978')
 })
 it('duración del régimen conserva factores y relaciones sin imponer toda la dictadura',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='regime-duration-factor-selection')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/-regime-duration-factors$/)
 })
 it('la procedencia justificada ya forma parte de la selección documental',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='history-geography-repository-recovery')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toContain('justificando')
 })
 it('integra la relación de seguridad en los hallazgos de mercados fronterizos',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='border-market-research')!.description)
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.find(c=>c.templateId.endsWith('-research-content'))!.description).toContain('seguridad')
 })
 it('los factores ambientales del proyecto de agua no añaden un producto de deterioro global',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='water-access-project-plan')!.description)
  expect(p.criteria.every(c=>c.templateId.startsWith('soc-6-water-access-'))).toBe(true)
 })
 it('distinguir evidencia e incertidumbre no genera representaciones adicionales',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='agrochemical-forestry-mining-risk')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/-resource-impact$/)
 })
 it('la justificación de pasos ambientales no se puntúa también como argumento genérico',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='environmental-project-step-selection')!.description)
  expect(p.criteria.map(c=>c.templateId.split('-').at(-1))).not.toContain('argument')
  expect(p.criteria).toHaveLength(2)
 })
 it('las respuestas de mesa redonda permanecen integradas en el mismo desempeño',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='population-problem-roundtable')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toContain('responde')
 })
 it('identificar registros para la consulta no pide realizar otra investigación',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='national-official-source-identification')!.description)
  expect(p.criteria).toHaveLength(1)
  expect(p.activityType).not.toBe('RESEARCH')
 })
 for(const label of ['fuentes oficiales nacionales del ejercicio','atribuciones del informe antiplagio proporcionado','comparación de Producto Nacional Bruto y Producto Interior Neto'])it(`explicar el concepto no exige otra acción: ${label}`,()=>{
  const p=proposal(`Explica ${label}.`)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/-interpretation$/)
  expect(p.criteria[0].description).toMatch(/^Explica /)
 })
 it('los planteamientos de un proyecto histórico no ordenan diseñar otro proyecto',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='bosch-liberal-democratic-project')!.description)
  expect(p.criteria.some(c=>c.templateId.endsWith('-political-project-relations'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-project-purpose'))).toBe(false)
  expect(p.activityType).not.toBe('PROJECT')
 })
 it('estudiar posición en mapas no exige crear otro mapa',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='dominican-position-source-analysis')!.description)
  expect(p.criteria.some(c=>c.templateId.endsWith('-location'))).toBe(false)
  expect(p.criteria.some(c=>c.templateId.endsWith('-comparison'))).toBe(false)
  expect(p.criteria).toHaveLength(2)
 })
 it('la exposición visual de resistencia no exige hablar en público',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='dictatorship-resistance-exhibition')!.description)
  expect(p.criteria.some(c=>c.templateId.endsWith('-oral'))).toBe(false)
  expect(p.activityType).not.toBe('ORAL_PRESENTATION')
 })
 it('distingue Interior Neto del Nacional Neto sin puntuar ambos',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='national-account-study-comparison')!.description)
  expect(p.criteria.some(c=>c.templateId.startsWith('soc-6-national-products-'))).toBe(false)
  expect(p.criteria.map(c=>c.description).join(' ')).toContain('Producto Interior Neto')
 })
 it('el artículo sobre liberalismo y conservadurismo no impone a Duarte',()=>{
  const p=proposal(contracts.cases.find(t=>t.id==='nation-project-opinion-article')!.description)
  expect(JSON.stringify(p.criteria)).not.toContain('Duarte')
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${format}/${maxScore}`,()=>{
  const p=recommend({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(c=>c.templateId.startsWith('soc-6-'))).toBe(true)
  for(const key of task.requiredKeys)expect(p.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(JSON.stringify(p.criteria)).not.toMatch(new RegExp(task.absent,'i'))
 })
})
