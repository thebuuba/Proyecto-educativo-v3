import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {commonSocialSelections,resolveCommonSocialTask} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
const propose=(description:string,title='Actividad',format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica')=>recommend({activityTitle:title,description,maxScore:17.35,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
const content=(p:ReturnType<typeof propose>)=>p.criteria.map(c=>c.description+' '+c.descriptors.map(d=>d.text).join(' ')).join(' ')
describe('Sociales primero: hechos, espacio, fuentes y argumentos solicitados',()=>{
 for(const [description,instrument] of [
  ['Identifica en el mapa los puntos cardinales señalados.','lista-cotejo'],
  ['Ordena los hechos de la Revolución Francesa en una línea de tiempo.','lista-cotejo'],
  ['Registra la frecuencia con que se aplican las reglas de seguridad vial en las situaciones observadas.','escala'],
  ['Analiza las causas de la expansión colonial europea.','rubrica'],
  ['Identifica los poderes del Estado con puntos por cada componente.','lista-ponderada'],
 ] as const){
  it(`recomienda por propósito: ${description}`,()=>{
   const task=resolveCommonSocialTask('Actividad',description,context)
   expect(task).not.toBeNull()
   expect(commonSocialSelections(task!,description).suggestedInstrumentType).toBe(instrument)
  })
 }
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const){
  for(const [description,absent] of [
   ['Explica la escala numérica del mapa. Sin estudiar proyecciones cartográficas.',/Mercator|proyección/],
   ['Explica los derechos y deberes establecidos en la Constitución dominicana.',/organización del Estado|funciones solicitados/],
   ['Explica el concepto de geografía.',/ramas solicitadas|actividades humanas y medio/],
   ['Explica los movimientos de la Tierra.',/modelos explicativos|ubicación de la Tierra/],
   ['Analiza los riesgos de compartir información en redes sociales.',/medidas de protección|propone una respuesta/],
  ] as const){
   it(`${format}: limita las evidencias al aspecto pedido: ${description}`,()=>{
    expect(content(propose(description,'Actividad',format))).not.toMatch(absent)
   })
  }
  it(`${format}: causas y consecuencias sin imponer producto ni trabajo de campo`,()=>{
   const p=propose('Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas. No elabores mapas ni hagas entrevistas.','La Revolución Francesa',format)
   expect(p.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   expect(p.criteria.some(c=>c.templateId.endsWith('-causes'))).toBe(true)
   expect(p.criteria.some(c=>c.templateId.endsWith('-consequences'))).toBe(true)
   expect(content(p)).not.toMatch(/Revolución Francesa|entrevista|trabajo de campo|realiza un mapa/i)
  })
  it(`${format}: cronología no es una lista genérica de calidad del texto`,()=>{
   const p=propose('Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.','Actividad',format)
   expect(p.criteria.some(c=>c.templateId.endsWith('-sequence'))).toBe(true)
   expect(content(p)).toMatch(/secuencia|cronol/i)
   expect(content(p)).not.toMatch(/caligrafía|decoración|creatividad artística/i)
  })
  it(`${format}: mapas y puntos cardinales no exigen Mercator ni GPS`,()=>{
   const p=propose('Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.','Colonialismo',format)
   expect(p.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   expect(content(p)).toMatch(/cardinal|orientación/i)
   expect(content(p)).not.toMatch(/Mercator|GPS|escala numérica/)
   expect(p.criteria.some(c=>/soc-1-(?:scale|gps)-/.test(c.templateId))).toBe(false)
  })
 }
 it('comprender dos posturas no exige adherirse a ninguna',()=>{
  const p=propose('Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados. No defiendas una postura personal.')
  expect(content(p)).toMatch(/perspectivas|posturas/)
  expect(content(p)).not.toMatch(/debe apoyar|adhesión|convicción personal|cree en/)
 })
 it('formular preguntas e hipótesis no se sustituye por organizar información',()=>{
  const p=propose('Formula preguntas e hipótesis provisionales sobre la expansión colonial europea. No investigues nuevas fuentes.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-question'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('-hypothesis'))).toBe(true)
  expect(content(p)).not.toMatch(/Selecciona información|debe consultar|experimento|laboratorio/)
 })
 it('evaluar las fuentes geográficas no obliga investigar ni explicar toda la geografía',()=>{
  const p=propose('Identifica cuáles de las fuentes proporcionadas para el estudio geográfico son confiables y justifica tu selección.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-source-reliability'))).toBe(true)
  expect(content(p)).not.toMatch(/ramas solicitadas|actividades humanas y medio|selecciona información pertinente sobre/i)
  expect(p.criteria).toHaveLength(1)
 })
 it('una noticia histórica conserva los componentes expresamente pedidos',()=>{
  const p=propose('Redacta una noticia sobre las revoluciones burguesas. Incluye titular, entrada y cuerpo. Sin fotografías ni pie de foto.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-news-structure'))).toBe(true)
  expect(content(p)).toMatch(/titular|entrada|cuerpo/)
  expect(content(p)).not.toMatch(/fotografía|pie de foto|caligrafía/)
 })
 it('la prevención digital trata decisiones observables, sin pedir información privada',()=>{
  const p=propose('Analiza los riesgos de compartir información personal en redes sociales y propone medidas de protección para el caso ficticio. No compartas datos propios.')
  expect(p.criteria.every(c=>c.templateId.startsWith('soc-1-digital-safety-'))).toBe(true)
  expect(content(p)).toMatch(/riesgos|protección|seguridad/)
  expect(content(p)).not.toMatch(/entrega tu|contraseña personal|captura de tu cuenta|demuestra que eres/)
  expect(content(p)).not.toMatch(/compara los casos|semejanzas y diferencias/i)
 })
 it('el cotejo separa los componentes independientes pedidos en la noticia',()=>{
  const p=propose('Redacta una noticia sobre las revoluciones burguesas. Incluye titular, entrada y cuerpo. Sin fotografías ni pie de foto.','Actividad','lista-cotejo')
  for(const part of ['titular','entrada','cuerpo'])expect(p.criteria.some(c=>c.templateId.endsWith(`news-structure:${part}`))).toBe(true)
 })
 it('un pie de foto sobre imagen proporcionada no exige producir una fotografía',()=>{
  const p=propose('Redacta una noticia sobre las revoluciones burguesas. Incluye titular y pie de foto para la imagen proporcionada.','Actividad','lista-cotejo')
  expect(p.criteria.some(c=>c.templateId.endsWith('news-structure:pie de foto'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.endsWith('news-structure:foto'))).toBe(false)
 })
 it('alternativa de productos no exige ambos',()=>{
  const p=propose('Elabora una línea de tiempo o un mapa sobre la expansión colonial europea.')
  expect(content(p)).toMatch(/alternativa elegida/)
  expect(p.criteria.some(c=>c.templateId.endsWith('-alternative'))).toBe(true)
  expect(content(p)).not.toMatch(/hechos indicados de mapas y planos/)
 })
 it('no toma un título viejo como contenido de la descripción nueva',()=>{
  const p=propose('Analiza los derechos y deberes de la Constitución dominicana.','Comercio triangular')
  expect(content(p)).toMatch(/derechos|deberes/)
  expect(content(p)).not.toMatch(/comercio triangular|colonización/)
 })
 it('una prohibición no elimina la acción independiente posterior',()=>{
  const p=propose('No elabores un mapa y analiza las causas de la Revolución Francesa.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-causes'))).toBe(true)
  expect(p.criteria.some(c=>c.templateId.includes('cartography'))).toBe(false)
 })
 it('conserva el proveedor histórico al pedir un catálogo anterior',async()=>{
  const {evaluationCatalogForVersion}=await import('./catalog-current')
  const old=recommend({activityTitle:'Actividad',description:'Analiza las causas de la expansión colonial europea.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,evaluationCatalogForVersion('evaluation-2026.93')!)
  expect(old.criteria.some(c=>c.templateId.startsWith('soc-1-'))).toBe(false)
 })
 it('el catálogo94 congelado no adquiere los temas nuevos de95',async()=>{
  const {evaluationCatalogForVersion}=await import('./catalog-current')
  const frozen=evaluationCatalogForVersion('evaluation-2026.94')!
  expect(frozen.socialCommonModules![0].topics).toHaveLength(29)
  expect(frozen.socialCommonModules![0].policy).toBe('REQUESTED_SOCIAL_EVIDENCE_V1')
  const old=recommend({activityTitle:'Actividad',description:'Analiza los riesgos de compartir información personal en redes sociales.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null,frozen)
  expect(old.criteria.some(c=>c.templateId.startsWith('soc-1-digital-safety-'))).toBe(false)
 })
 for(const [description,topic] of [['Explica orientación geográfica.','orientation'],['Explica escalas cartográficas.','scale']] as const){
  it(`una denominación específica no agrega el área general: ${description}`,()=>{
   const p=propose(description)
   expect(p.criteria.every(c=>c.templateId.startsWith(`soc-1-${topic}-`))).toBe(true)
  })
 }
 it('conserva los95 y96 realmente instalados al ampliar el proveedor actual',async()=>{
  const {evaluationCatalogForVersion,evaluationCatalogCurrent}=await import('./catalog-current')
  const actual95=evaluationCatalogForVersion('evaluation-2026.95')!
  expect(actual95).toEqual({...evaluationCatalogForVersion('evaluation-2026.94'),version:'evaluation-2026.95'})
  expect(evaluationCatalogCurrent.version).toBe('evaluation-2026.153')
  expect(evaluationCatalogForVersion('evaluation-2026.96')!.socialCommonModules![0].topics).toHaveLength(31)
  expect(evaluationCatalogForVersion('evaluation-2026.97')!.socialCommonModules![0].topics).toHaveLength(31)
  expect(evaluationCatalogForVersion('evaluation-2026.98')!.socialCommonModules).toHaveLength(1)
  expect(evaluationCatalogCurrent.socialCommonModules[0].topics).toHaveLength(33)
 })
})
