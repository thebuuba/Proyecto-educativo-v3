import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-five-contracts.json'
import {recommend} from './recommendation-engine'
import {resolveCommonSocialTask,commonSocialSelections} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}

describe('Sociales quinto: geografía insular e historia dominicana solicitadas',()=>{
 for(const [description,instrument] of [
  ['Identifica las zonas de riesgo de la isla en los mapas proporcionados.','lista-cotejo'],
  ['Analiza las causas de la anexión a España con las fuentes proporcionadas.','rubrica'],
  ['Observa con qué frecuencia se cumplen las reglas de educación vial en la simulación.','escala'],
  ['Analiza los mapas de precipitación proporcionados. Asigna crédito parcial a sus componentes.','lista-ponderada'],
 ] as const)it(`recomienda instrumento por propósito: ${instrument}`,()=>{
  const task=resolveCommonSocialTask('',description,context)!
  expect(task).not.toBeNull()
  expect(commonSocialSelections(task,description).suggestedInstrumentType).toBe(instrument)
 })
 for(const id of ['national-identity-roundtable','everyday-dialogue-reasons'])it(`el intercambio se recomienda observar directamente: ${id}`,()=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ORAL_INTERACTION')
  expect(resolveCommonSocialTask('',description,context)!.technique).toBe('observacion-directa')
 })
 it('el sociodrama representado se recomienda observar como desempeño',()=>{
  const description=contracts.cases.find(c=>c.id==='colonial-resistance-sociodrama')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('PERFORMANCE')
  expect(resolveCommonSocialTask('',description,context)!.technique).toBe('observacion-sistematica')
 })
 for(const [id,keys] of [
  ['environmental-sustainability-proposal',['soc-5-environmental-sustainability-proposal']],
  ['everyday-dialogue-reasons',['soc-5-dialogue-dialogue-contributions']],
  ['community-road-campaign-simulation',['soc-5-road-safety-campaign-participation']],
  ['values-peace-educational-campaign',['soc-5-peace-campaign-message','soc-5-peace-campaign-actions']],
  ['risk-protected-scientific-source-check',['soc-5-scientific-risk-protected-sources-scientific-source-evidence']],
 ] as const)it(`evita actuaciones repetidas y productos ajenos al propósito: ${id}`,()=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(keys)
  if(id==='everyday-dialogue-reasons')expect(p.criteria[0].description).toContain('razones expresadas por las otras partes')
 })
 for(const [id,keys] of [
  ['constitution-structure-analysis',['soc-5-dominican-constitutions-constitutional-structure']],
  ['constitutional-influence-comparison',['soc-5-constitutional-influences-constitutional-influence']],
  ['national-identity-roundtable',['soc-5-national-identity-roundtable']],
 ] as const)it(`integra las explicaciones y respuestas del mismo desempeño: ${id}`,()=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(keys)
 })
 it('los símbolos en multimedia evalúan su significado, sin inventar acontecimientos y actores',()=>{
  const description=contracts.cases.find(c=>c.id==='national-symbol-multimedia')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toContain('valores y significados')
  expect(p.criteria[0].description).not.toContain('acontecimientos, actores')
 })
 it('la alternativa collage conserva una evidencia visual propia',()=>{
  const description=contracts.cases.find(c=>c.id==='occupation-1916-collage-alternative')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toContain('fragmentos visuales del collage')
 })
 it('la resistencia a la anexión no añade otro análisis de toda la anexión',()=>{
  const description=contracts.cases.find(c=>c.id==='antiannexation-text-reading')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-antiannexation-resistance-interpretation','soc-5-antiannexation-resistance-source-evidence'])
 })
 for(const id of ['second-republic-government-research','second-republic-government-action-timeline'])it(`los gobiernos solicitados no se limitan automáticamente a Rojos y Azules: ${id}`,()=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria.map(c=>[c.title,c.description,...c.progressionLevels]))).not.toMatch(/Rojos|Azules/)
  expect(p.criteria[0].description).toContain('gobiernos de la Segunda República')
 })
 it('la monografía comunica los hallazgos investigados sin volver a puntuarlos como otro producto',()=>{
  const description=contracts.cases.find(c=>c.id==='nineteenth-modernity-monograph')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-nineteenth-century-modernity-monograph-content','soc-5-nineteenth-century-modernity-sources'])
 })
 it('las conexiones explicadas pertenecen al esquema sin una comprensión repetida',()=>{
  const description=contracts.cases.find(c=>c.id==='first-republic-economic-political-schema')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-first-republic-organizer-relations'])
 })
 it('la formación y función de la Trinitaria conserva el objeto de análisis',()=>{
  const description=contracts.cases.find(c=>c.id==='trinitaria-historical-role')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toContain('formación y función de la Trinitaria')
 })
 for(const [id,required,absent] of [
  ['eastern-period-school-newspaper','1800–1821','1801 y 1822'],
  ['boyer-regime-crisis','crisis del régimen de Boyer','Causas de gobierno'],
 ] as const)it(`conserva el objeto específico de la consigna: ${id}`,()=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria[0].description).toContain(required)
  expect(JSON.stringify(p.criteria.map(c=>[c.title,c.description,...c.progressionLevels]))).not.toContain(absent)
 })
 it('la cronología de 1801–1809 no incorpora la ocupación de 1822',()=>{
  const description=contracts.cases.find(c=>c.id==='eastern-governments-timeline')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(JSON.stringify(p.criteria.map(c=>[c.title,c.description,...c.progressionLevels,...c.descriptors.map(d=>d.text)]))).not.toMatch(/1822|1844/)
  expect(p.criteria[0].title).toContain('1801–1809')
 })
 it('el alcance XVII y XVIII no se reduce al XVIII',()=>{
  const description=contracts.cases.find(c=>c.id==='seventeenth-eighteenth-change-factors')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toContain('siglos XVII y XVIII')
 })
 it('un cuadro comparativo entre dos períodos conserva una sola evaluación de las mismas relaciones',()=>{
  const description=contracts.cases.find(c=>c.id==='france-spain-comparative-text-chart')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.filter(c=>c.templateId.endsWith('-comparison'))).toHaveLength(1)
  expect(p.criteria.filter(c=>c.templateId.endsWith('-comparative-text'))).toHaveLength(2)
  expect(p.criteria.some(c=>c.title==='Contenido del texto de Era de Francia')).toBe(true)
 })
 it('discutir explicaciones no agrega otra explicación ni objeciones no pedidas',()=>{
  const description=contracts.cases.find(c=>c.id==='historical-belonging-discussion')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-national-identity-discussion'])
  expect(JSON.stringify(p.criteria)).not.toMatch(/objeci[oó]n/)
 })
 it('proponer fuentes y pasos pertenece al plan de investigación, sin otra intervención cívica',()=>{
  const description=contracts.cases.find(c=>c.id==='historical-research-plan')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-historical-periods-research-question','soc-5-historical-periods-research-scope','soc-5-historical-periods-research-method'])
 })
 it('distinguir isla y Estado usa sus ámbitos, sin inventar otros casos comparativos',()=>{
  const description=contracts.cases.find(c=>c.id==='island-position-discussion')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-island-position-discussion','soc-5-island-position-spatial-scope'])
  expect(p.criteria[1].description).toContain('isla de Santo Domingo')
  expect(p.criteria[1].description).toContain('República Dominicana')
 })
 for(const id of ['aquifer-oral-presentation','economic-sectors-presentation'])it(`organizar la presentación no añade otro producto: ${id}`,()=>{
  const description=contracts.cases.find(c=>c.id===id)!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(false)
  expect(p.activityType).toBe('ORAL_PRESENTATION')
 })
 it('caracterizar los hallazgos no exige otra representación',()=>{
  const description=contracts.cases.find(c=>c.id==='climatic-ecological-characterization')!.description
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId).sort()).toEqual(['soc-5-island-climate-research-content','soc-5-island-climate-sources','soc-5-coastal-marine-ecosystems-research-content','soc-5-coastal-marine-ecosystems-sources'].sort())
 })
 for(const [description,keys] of [
  ['Identifica las zonas de riesgo de la isla de Santo Domingo ante los fenómenos naturales indicados en los mapas del ejercicio, relacionando exposición y condiciones del territorio.',['soc-5-risk-zones-risk-location']],
  ['Discute las ventajas y desventajas de la posición, localización, área, límites y superficie de la isla de Santo Domingo en el caso y mapas proporcionados.',['soc-5-island-position-discussion']],
  ['Explica fuentes científicas sobre riesgos y áreas protegidas.',['soc-5-scientific-risk-protected-sources-interpretation']],
  ['Explica proyectos de educación vial y tributaria.',['soc-5-road-tax-projects-interpretation']],
  ['Explica comparación de constituciones liberales y conservadoras.',['soc-5-constitutional-comparison-interpretation']],
  ['Explica influencias constitucionales en República Dominicana.',['soc-5-constitutional-influences-interpretation']],
 ] as const)it(`distingue objeto conceptual, exposición al peligro y acción pedida: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(keys)
  expect(p.activityType).not.toBe('ORAL_PRESENTATION')
 })
 for(const description of ['Explica héroes, heroínas y participación de la mujer en la independencia.','Explica invasiones haitianas durante la Primera República.','Explica déficit monetario de la Primera República.','Explica anarquías políticas de la Segunda República.','Explica economía, capitalismo, deuda y convenciones de la Segunda República.','Explica caudillismo y dictaduras de la Segunda República.'])it(`la explicación breve no añade producto ni repite el período como otro tema: ${description}`,()=>{
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toMatch(/-interpretation$/)
 })
 it('conserva los períodos cuando sí se piden como objetos independientes',()=>{
  const description='Explica la Primera República. Luego explica la Segunda República.'
  const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-first-republic-interpretation','soc-5-second-republic-interpretation'])
 })
 it('explicar el impacto de períodos compara efectos concretos sin otra comprensión general',()=>{
  const task=contracts.cases.find(c=>c.id==='historical-period-event-comparison')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='soc-5-historical-periods-consequences')).toBe(true)
  expect(p.criteria.some(c=>c.templateId==='soc-5-historical-periods-interpretation')).toBe(false)
 })
 it('el caso de alianzas se respalda en sus hechos sin inventar un análisis documental',()=>{
  const task=contracts.cases.find(c=>c.id==='duarte-alliance-exclusion')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['soc-5-independence-movement-nationalist-relations'])
  expect(p.criteria[0].description).toContain('hechos del caso')
 })
 it('investigar y justificar confiabilidad conserva contenido y fiabilidad sin otra fila repetida',()=>{
  const task=contracts.cases.find(c=>c.id==='geomorphology-source-research')!
  const p=recommend({activityTitle:'Actividad',description:task.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId).sort()).toEqual(['soc-5-island-geomorphology-research-content','soc-5-island-geomorphology-source-reliability'])
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${task.id}/${format}/${maxScore}`,()=>{
  const p=recommend({activityTitle:'Un título antiguo de biología',description:task.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(0)
  expect(p.criteria.every(c=>c.templateId.startsWith('soc-5-'))).toBe(true)
  for(const key of task.requiredKeys)expect(p.criteria.some(c=>c.templateId.endsWith('-'+key))).toBe(true)
  expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(JSON.stringify(p.criteria)).not.toMatch(new RegExp(task.absent,'i'))
 })
})
