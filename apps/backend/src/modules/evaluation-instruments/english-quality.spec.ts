import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'

const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const cv='Leerán en inglés un curriculum vitae e identificarán la experiencia y capacidades del perfil proporcionado de un personaje ficticio.'
const revision='Escribirán en inglés un correo electrónico con un mensaje para un personaje ficticio. Revisarán el sentido y la corrección del texto.'
const propose=(grade:number,description:string,format:typeof formats[number]='lista-cotejo',maxScore=17.35)=>recommend({activityTitle:'Actividad',description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType:format},{level:'SECONDARY',grade,cycle:grade<4?1:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null},null,[],'UNMAPPED',null)
describe('Calidad Inglés común1–6: evidencia independiente y revisión observable',()=>{
 for(let grade=1;grade<=6;grade++)for(const total of [20,17.35])it(`separa datos independientes del CV en cotejo ${grade} ${total}`,()=>{
  const p=propose(grade,cv,'lista-cotejo',total)
  expect(p.criteria.filter(c=>c.templateId.includes('genre-cv')).map(c=>c.templateId)).toEqual([`ing-${grade}-genre-cv:experience`,`ing-${grade}-genre-cv:capacities`])
  expect(p.criteria).toHaveLength(2)
  expect(p.criteria.find(c=>c.templateId.endsWith(':experience'))?.description).not.toMatch(/capacidades/)
  expect(p.criteria.find(c=>c.templateId.endsWith(':capacities'))?.description).not.toMatch(/experiencia/)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(p.criteria).toEqual(propose(grade,cv,'lista-cotejo',total).criteria)
 })
 for(let grade=1;grade<=6;grade++)for(const format of formats)it(`revisión admite conservar texto correcto ${grade} ${format}`,()=>{
  const p=propose(grade,revision,format),rows=p.criteria.filter(c=>c.templateId.includes('strategy-revision'))
  expect(rows.length).toBeGreaterThan(0)
  for(const row of rows){
   expect(row.description).toMatch(/mantiene lo correcto|conserva lo correcto/)
   expect(row.description).toMatch(/observa|observable/)
   expect(row.description).not.toMatch(/Los cambios realizados|borrador|registro de cambios/)
   expect(row.progressionLevels?.[0]).toMatch(/cuando|si /)
   if(format==='rubrica'||format==='lista-ponderada')expect(row.progressionLevels?.[2]).toMatch(/comprob|revisión/)
  }
  expect(propose(grade,revision.split(' Revisarán')[0],format).criteria.some(c=>c.templateId.includes('strategy-revision'))).toBe(false)
 })
 for(const format of formats)it(`conserva desempeños relacionales y representaciones de ${format}`,()=>{
  const p=propose(6,'Leerán en inglés un horario e identificarán la actividad y el momento que le corresponde.',format)
  expect(p.criteria.filter(c=>c.templateId.includes('genre-schedule'))).toHaveLength(1)
  if(format!=='lista-cotejo')expect(propose(6,cv,format).criteria.filter(c=>c.templateId.includes('genre-cv'))).toHaveLength(1)
  const email=propose(6,'Leerán en inglés un correo e identificarán el destinatario y el propósito.',format)
  expect(JSON.stringify(email.criteria)).not.toContain('de el correo')
  for(const grade of [1,2,3,4,5,6]){
   const profile=propose(grade,cv,format).criteria.filter(c=>c.templateId.includes('genre-cv'))
   expect(JSON.stringify(profile)).toContain('experiencia');expect(JSON.stringify(profile)).toContain('capacidades')
  }
 })
 for(const format of formats)for(const scenario of ['correcto-sin-cambios','problemas-corregidos','problemas-pendientes'])it(`evidencia de revisión: ${scenario} ${format}`,()=>{
  const rows=propose(6,revision,format).criteria.filter(c=>c.templateId.includes('strategy-revision'))
  for(const row of rows){
   if(scenario==='correcto-sin-cambios')expect(row.description).toMatch(/mantiene lo correcto.*cuando/)
   if(scenario==='problemas-corregidos')expect(row.description).toMatch(/identifica y corrige/)
   if(scenario==='problemas-pendientes')expect(row.progressionLevels?.[2]).toMatch(/problemas observados sin resolver/)
   expect(row.progressionLevels?.[4]).toContain('producto final por sí solo')
  }
 })
 it('separa campos explícitos de factura sin dividir una alternativa',()=>{
  const p=propose(6,'Leerán en inglés una factura e identificarán el emisor, la fecha y el total.')
  expect(p.criteria.filter(c=>c.templateId.includes('genre-invoice'))).toHaveLength(3)
  expect(propose(6,'Leerán en inglés un curriculum vitae e identificarán la experiencia o las capacidades del perfil.').criteria.filter(c=>c.templateId.includes('genre-cv'))).toHaveLength(1)
 })
 it('separa dos procedimientos pedidos sin dividir una relación de ideas',()=>{
  expect(propose(6,'Leerán un texto en inglés. Subrayarán y anotarán las expresiones solicitadas.').criteria.filter(c=>c.templateId.includes('strategy-annotation'))).toHaveLength(2)
  const ideas=propose(6,'Leerán en inglés un texto e identificarán las ideas principales y secundarias, relacionándolas con el asunto.').criteria.filter(c=>c.templateId.includes('strategy-main-secondary'))
  expect(ideas.map(c=>c.templateId)).toEqual(['ing-6-strategy-main-secondary:main','ing-6-strategy-main-secondary:secondary'])
  expect(ideas[0].description).toContain('ideas principales');expect(ideas[1].description).toContain('ideas secundarias')
  for(const alternative of ['subrayarán o anotarán','anotarán o subrayarán'])expect(propose(6,`Leerán un texto en inglés y ${alternative} las expresiones solicitadas.`).criteria.filter(c=>c.templateId.includes('strategy-annotation'))).toHaveLength(1)
 })
 for(const grade of [1,2,3,4,5,6])it(`cotejo de datos independientes en un CV escrito ${grade}`,()=>{
  const p=propose(grade,'Escribirán en inglés un curriculum vitae del personaje ficticio e incluirán su experiencia y capacidades.')
  const rows=p.criteria.filter(c=>c.templateId.includes('genre-cv'))
  expect(rows.map(c=>c.templateId)).toEqual([`ing-${grade}-genre-cv:experience`,`ing-${grade}-genre-cv:capacities`])
  expect(rows.every(c=>c.description.startsWith('Incluye en inglés'))).toBe(true)
 })
 it('completar campos de un formulario no añade una segunda presentación personal',()=>{
  const p=propose(1,'Completarán en inglés un formulario con el nombre y edad del personaje ficticio.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-1-genre-form:name','ing-1-genre-form:age'])
 })
 it('separa datos personales explícitos y estados independientes en su proveedor funcional',()=>{
  const personal=propose(1,'Presentarán oralmente en inglés información personal de un personaje ficticio, indicando nombre y edad.')
  expect(personal.criteria.filter(c=>c.templateId.startsWith('ing-1-personal')).map(c=>c.templateId)).toEqual(['ing-1-personal:name','ing-1-personal:age'])
  const states=propose(2,'Leerán en inglés un mensaje e identificarán el estado de ánimo y la sensación física del personaje ficticio.')
  expect(states.criteria.filter(c=>c.templateId.startsWith('ing-2-states')).map(c=>c.templateId)).toEqual(['ing-2-states:mood','ing-2-states:physical'])
 })
 it('rechaza el cotejo que pasa de20 al separar datos sin recortar requisitos',()=>{
  const description='Leerán en inglés un curriculum vitae, una factura, una tarjeta de presentación, una lista, un anuncio, una receta, un letrero, un aviso, un afiche, un correo electrónico, una carta, un formulario, una noticia, un horario, una agenda, un menú, un croquis, un cuestionario y un folleto. Identificarán la experiencia, capacidades, emisor, fecha, total, nombre y teléfono.'
  expect(propose(6,description,'rubrica').criteria.length).toBeLessThanOrEqual(20)
  expect(()=>propose(6,description,'lista-cotejo')).toThrow(/hasta 20/)
  const p=recommend({activityTitle:'Actividad',description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:'lista-cotejo',includeAdditionalCandidates:true},{level:'SECONDARY',grade:6,cycle:2,subjectCode:'ING',optativeExitName:null},null,[],'UNMAPPED',null)
  expect(p.criteria.length).toBeGreaterThan(20)
 })
 it('recomienda por la tarea habitual sin dictar el formato',()=>{
  expect(propose(6,cv).instrumentType).toBe('lista-cotejo')
  const input={activityTitle:'Actividad',description:cv,maxScore:20,participationMode:'INDIVIDUAL' as const}
  const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null}
  expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe('lista-cotejo')
  expect(recommend({...input,description:revision},context,null,[],'UNMAPPED',null).instrumentType).toBe('rubrica')
 })
})
