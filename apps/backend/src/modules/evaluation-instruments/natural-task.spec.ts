import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import {explicitEnglishFeatureRequest} from '../../../../../packages/shared/src/english-feature-request'
import {requestedEnglishGrammar} from '../../../../../packages/shared/src/secondary-english-grade-one-grammar'
import {deliveryConditions} from '@aula/shared'

export const futureDescription='Los estudiantes elaborarán una presentación oral y escrita en inglés sobre sus planes y metas para el futuro, utilizando las estructuras gramaticales will y going to. Describirán sus aspiraciones académicas, profesionales y personales mediante oraciones sencillas y coherentes. Finalmente, compartirán sus presentaciones con sus compañeros, fortaleciendo sus habilidades de expresión oral, escritura y comunicación en inglés.'
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,grade=4,subjectCode='ING',format:typeof formats[number]='rubrica',maxScore=20)=>recommend({activityTitle:'Actividad',description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},{level:'SECONDARY',grade,cycle:grade<4?1:2,subjectCode,subjectName:subjectCode==='LEN'?'Lengua Española':'Inglés',optativeExitName:null},null,[],'UNMAPPED',null)
describe('Consignas naturales y condiciones explícitas',()=>{
 for(const description of ['Relaciona las secciones con los hechos e interpretaciones.','Analiza las secciones del documento proporcionado.','Relaciona las secciones de tu informe con los hechos proporcionados.','Analiza las secciones de un informe proporcionado.'])it(`mencionar secciones no impone otra entrega: ${description}`,()=>{
  expect(deliveryConditions(description)).toEqual([])
 })
 for(const description of ['Incluye las secciones: introducción, desarrollo y conclusión.','El informe tendrá secciones de introducción, desarrollo y conclusión.','Apartados: introducción, desarrollo y conclusión.','Incluye las secciones introducción, desarrollo y conclusión.','Secciones de introducción, desarrollo y conclusión.'])it(`conserva la lista explícita de secciones: ${description}`,()=>{
  expect(deliveryConditions(description)).toContainEqual({key:'sections',label:'apartados solicitados: introduccion, desarrollo y conclusion'})
 })
 for(const description of ['Elabora un periódico con secciones y artículos sustentados en los materiales proporcionados.','Redacta el borrador con las secciones expresamente indicadas en la pauta dada.'])it('no inventa una lista de apartados a partir de una referencia genérica: '+description,()=>{
  expect(deliveryConditions(description).some(c=>c.key==='sections')).toBe(false)
 })
 it('analizar un informe proporcionado no añade una condición de entrega',()=>{
  const p=propose('Analiza las secciones de un informe proporcionado sobre la ocupación haitiana de 1822–1844.',5,'SOC')
  expect(p.criteria.some(c=>c.templateId.startsWith('delivery-'))).toBe(false)
 })
 it('reconoce la solicitud literal de una sola forma',()=>{
  expect(explicitEnglishFeatureRequest('leeran un texto en ingles e identificaran will','\\b(?:will|(?:be )?going to)\\b','will|going to')).toBe(true)
  expect(requestedEnglishGrammar('leeran un texto en ingles e identificaran will').map(f=>f.id)).toContain('future')
 })
 it('consigna de ejercicios conserva las operaciones sin inventar unidades ni explicación',()=>{
  const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'MAT',subjectName:'Matemática',optativeExitName:null,modalityCode:'academic'}
  const p=recommend({activityTitle:'Actividad',description:'Los estudiantes resuelven ejercicios de suma y resta',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('EXERCISE_SET');expect(p.instrumentType).toBe('lista-cotejo')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['mat-2-arithmetic-calculation','mat-2-arithmetic-result:suma','mat-2-arithmetic-result:resta'])
  expect(JSON.stringify(p.criteria)).toContain('suma y resta');expect(JSON.stringify(p.criteria)).not.toMatch(/unidades|investigación|bibliografía|oral|materiales/)
  expect(p.internalTrace.reasons).toContain('coverage=ACTION_ONLY')
 })
 for(const format of formats)it(`My Future Plans representa requisitos y ambas modalidades ${format}`,()=>{
  const p=propose(futureDescription,4,'ING',format),ids=p.criteria.map(c=>c.templateId)
  expect(ids).toContain('ing-4-feature-will');expect(ids).toContain('ing-4-feature-going-to')
  expect(ids).toContain('ing-4-written');expect(ids).toContain('ing-4-intelligibility')
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(2000)
 })
 for(const wording of ['utilizando will y going to','utilizando las estructuras gramaticales will y going to','deben usar las formas de futuro will y going to','con will y going to','usando will o going to, a elección'])it(`reconoce ${wording}`,()=>{
  const ids=propose(`Presentan sus planes en inglés ${wording}`).criteria.map(c=>c.templateId)
  if(wording.includes(' o '))expect(ids.filter(id=>id.includes('feature-'))).toEqual(['ing-4-feature-will-or-going-to'])
  else {expect(ids).toContain('ing-4-feature-will');expect(ids).toContain('ing-4-feature-going-to')}
 })
 for(const wording of ['Willow presenta sus planes en inglés.','Presentan sus planes en inglés. No deben usar will ni going to.','Presentan sus planes en inglés. Como recurso: video con will y going to.'])it(`no infiere formas ${wording}`,()=>{
  expect(propose(wording).criteria.some(c=>/feature-(?:will|going-to)/.test(c.templateId))).toBe(false)
 })
 for(let grade=1;grade<=6;grade++)it(`conserva producción oral y escrita en Inglés ${grade}`,()=>{
  const ids=propose('Elaboran una presentación oral y escrita en inglés con presente simple sobre información de un personaje ficticio.',grade).criteria.map(c=>c.templateId)
  expect(ids).toContain(`ing-${grade}-written`);expect(ids).toContain(`ing-${grade}-intelligibility`)
 })
 for(const format of formats)it(`condiciones independientes de entrega ${format}`,()=>{
  const p=propose('Hacen un informe de lectura de una noticia. Entre una y tres páginas, interlineado 1,5, fuente Arial, tamaño 12 y con portada.',1,'LEN',format)
  const rows=p.criteria.filter(c=>c.taskConditionIds?.length)
  // Agrupa sin exigir un número fijo de filas; preserva todos los valores y ámbitos.
  const text=JSON.stringify(rows);expect(text).toMatch(/una.*tres.*páginas/);expect(text).toContain('1,5');expect(text).toContain('Arial');expect(text).toContain('12');expect(text).toContain('portada')
  expect(p.criteria.filter(c=>!c.templateId.startsWith('delivery-')).length).toBeGreaterThan(0)
 })
 it('registra requisitos contradictorios sin elegir un límite ni bloquear',()=>{
  expect(propose('Escriben un informe de lectura de una noticia. Mínimo cinco páginas y máximo tres páginas.',1,'LEN').internalTrace.taskRequirements?.issues.some(i=>i.kind==='CONFLICT')).toBe(true)
 })
 it('no exige formato ausente ni portada excluida',()=>{
  expect(propose('Hacen un informe de lectura de una noticia',1,'LEN').criteria.some(c=>c.templateId.startsWith('delivery-'))).toBe(false)
  const rows=propose('Hacen un informe de lectura de una noticia. Arial o Calibri, sin portada.',1,'LEN','lista-cotejo').criteria.filter(c=>c.taskConditionIds?.length)
  expect(rows.length).toBeGreaterThan(0);expect(JSON.stringify(rows)).toContain('Arial o Calibri');expect(JSON.stringify(rows)).toContain('sin portada')
 })
 for(let grade=1;grade<=6;grade++)it(`informe breve de noticia sin investigación ni ficción añadidas ${grade}`,()=>{
  const p=propose('Hacen un informe de lectura de una noticia',grade,'LEN'),text=JSON.stringify(p.criteria)
  expect(text).not.toMatch(/texto literario seleccionado|procedimiento de la investigaci|pregunta investigada/)
  expect(text).toMatch(/ideas principales|resume|resumen/i)
 })
 for(const [a,b] of [
  ['Presentan sus planes en inglés con will y going to','Precentan sus planes en ingles utilisando will y going to'],
  ['Hacen un informe de lectura de una noticia','Hacen un informe de letura de una noticia'],
  ['Comparan dos noticias','Comapran dos noticias'],
 ] as const)it(`tolerancia acotada de escritura: ${b}`,()=>{
  const code=a.includes('planes')?'ING':'LEN',grade=code==='ING'?4:1
  expect(propose(b,grade,code).criteria.map(c=>c.templateId)).toEqual(propose(a,grade,code).criteria.map(c=>c.templateId))
 })
 for(const format of formats)for(const description of ['Write a message using will and going to.','Write a message using will or going to.'])it(`instrucción inglesa acotada ${format} ${description}`,()=>{
  const rows=propose(description,4,'ING',format).criteria
  expect(rows.some(r=>r.templateId==='ing-4-written')).toBe(true)
  expect(rows.filter(r=>r.templateId.includes('feature-')).map(r=>r.templateId)).toEqual(description.includes(' or ')?['ing-4-feature-will-or-going-to']:['ing-4-feature-going-to','ing-4-feature-will'])
 })
})
