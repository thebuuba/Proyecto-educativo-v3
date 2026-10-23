import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/realistic-audit-bank-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
function propose(id:string,format:typeof formats[number],description?:string){
 const task=bank.cases.find((c:{id:string})=>c.id===id)
 return recommend({activityTitle:task.title,description:description??task.description,preferredInstrumentType:format,maxScore:17.35,participationMode:'GROUP'},{level:'SECONDARY',grade:task.grade,cycle:task.grade<=3?1:2,subjectCode:task.subjectCode,subjectName:task.subjectName,optativeExitName:null},null,[],'UNMAPPED',null)
}
describe('Intercambio de roles solicitado en actividades lingüísticas realistas',()=>{
 for(const format of formats){
  it(`entrevista literal de inglés sexto: cada estudiante realiza ambos papeles, ${format}`,()=>{
   const p=propose('A-ING6-entrevista',format),text=p.criteria.map(c=>c.description).join(' ')
   expect(text).toMatch(/ambos roles|intercambi\w* los roles/i)
   expect(text).toMatch(/preguntas/);expect(text).toMatch(/experiencia/);expect(text).toMatch(/capacidades/);expect(text).toMatch(/ficticio/)
   expect(text).not.toMatch(/experiencia laboral real|currículum escrito|pronunciación nativa|cinco preguntas|minutos/)
   expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  })
  it(`francés primero: conserva preguntas, respuestas, datos e intercambio, ${format}`,()=>{
   const p=propose('B-FRA1-dialogo',format),text=p.criteria.map(c=>c.description).join(' ')
   for(const requirement of [/saludo/,/pregunta/,/responde|respuesta/i,/nombre/,/edad/,/residencia/,/ambos roles/])expect(text).toMatch(requirement)
   expect(text).not.toMatch(/pronunciación nativa/)
   expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  })
 }
 it('no impone cambiar papeles al retirar la condición de la descripción',()=>{
  const task=bank.cases.find((c:{id:string})=>c.id==='A-ING6-entrevista')
  const p=propose(task.id,'rubrica',task.description.replace('Luego intercambiarán los roles.',''))
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/ambos roles|intercambi\w* los roles/)
 })
 it('el intercambio mencionado en un recurso no se transforma en desempeño solicitado',()=>{
  const p=propose('A-ING6-entrevista','rubrica','Escuchen una entrevista de trabajo en inglés e identifiquen la experiencia del personaje. Como recurso: un video en el que los participantes intercambian los roles.')
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/Desempeña ambos roles|Intercambia los roles|Formula preguntas/)
 })
 for(const id of ['A-ING6-entrevista','B-FRA1-dialogo']){
  for(const condition of ['Si lo desean, pueden intercambiar los roles.','Intercambiar los roles es opcional.','No es obligatorio intercambiar los roles.','No intercambien los roles.']){
   it(`${id}: no impone el intercambio opcional o excluido: ${condition}`,()=>{
    const original=bank.cases.find((c:{id:string})=>c.id===id)
    const p=propose(id,'rubrica',original.description.replace('Luego intercambiarán los roles.',condition))
    expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/Desempeña ambos roles|Intercambia los roles/)
   })
  }
  for(const condition of ['Después alternarán los papeles.','Cada estudiante desempeñará ambos roles.']){
   it(`${id}: reconoce la condición equivalente: ${condition}`,()=>{
    const original=bank.cases.find((c:{id:string})=>c.id===id)
    const p=propose(id,'rubrica',original.description.replace('Luego intercambiarán los roles.',condition))
    expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/Desempeña ambos roles/)
   })
  }
 }
 it('la regla compartida también cubre la consulta simulada de inglés quinto sin inventar datos personales',()=>{
  const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null}
  const p=recommend({activityTitle:'Consulta simulada',description:'En parejas, interactuarán en inglés en una consulta médica simulada con la ficha de un personaje ficticio. Luego intercambiarán los roles.',preferredInstrumentType:'rubrica',maxScore:17.35,participationMode:'GROUP'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.filter(c=>c.templateId==='ing-5-roles')).toHaveLength(1)
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/datos médicos personales|diagnostica/)
 })
 for(const id of ['A-ING6-entrevista','B-FRA1-dialogo','B-LEN1-informe-desarrollado'])it(`${id}: la escala de grado conserva la evidencia propia de cada criterio`,()=>{
  const scale=propose(id,'escala'),rubric=propose(id,'rubrica')
  expect(scale.levels[0].label).toBe('Completo')
  for(const criterion of scale.criteria){
   const authored=rubric.criteria.find(c=>c.templateId===criterion.templateId)!
   expect(criterion.progressionLevels).toEqual(authored.progressionLevels)
   expect(criterion.descriptors.map(d=>d.text)).toEqual(authored.descriptors.map(d=>d.text))
   expect(criterion.descriptors.map(d=>d.text).join(' ')).not.toMatch(/Cumple (?:todos|lo esencial|algunos)/)
  }
 })
 it('la escala conserva frecuencia explícita sin confundirla con calidad',()=>{
  const task=bank.cases.find((c:{id:string})=>c.id==='A-ING6-entrevista')
  const p=propose(task.id,'escala',task.description+' Se registrará la frecuencia de cada indicador.')
  expect(p.levels[0].label).toBe('Siempre')
  expect(p.criteria.every(c=>c.descriptors[0].text==='En todas las oportunidades observadas.')).toBe(true)
 })
 it('las preguntas francesas usan una enumeración legible y concordancia gramatical',()=>{
  const p=propose('B-FRA1-dialogo','rubrica'),row=p.criteria.find(c=>c.templateId==='fra-1-questions')!
  expect(row.description).toContain('el nombre, la edad y el lugar de residencia')
  expect(row.progressionLevels!.join(' ')).not.toMatch(/de el nombre/)
 })
})
