import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-three-context-contracts.json'
const context={level:'SECONDARY' as const,grade:3,cycle:1,subjectCode:'ING',optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,preferredInstrumentType:typeof formats[number]='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,preferredInstrumentType,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Tercero: condiciones comunicativas explícitas y acciones independientes',()=>{
 for(const f of fixtures)for(const format of formats)for(const total of [20,17.35])it(`${f.id} ${f.description.slice(0,12)} ${format} ${total}`,()=>{
  const p=propose(f.description,format,total)
  const c=p.criteria.find(c=>c.templateId===`ing-3-${f.id==='research'?'research':'context-'+f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(c!.progressionLevels?.[4]).toMatch(/^No /)
  expect(p.criteria).toEqual(propose(f.description,format,total,'Una célula').criteria)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
 })
 for(const format of formats)for(const total of [20,17.35])it(`recepción y respuesta escrita ${format} ${total}`,()=>{
  const p=propose('Leerán una noticia breve en inglés e identificarán el acontecimiento. Luego escribirán un correo en inglés para expresar su opinión sobre el hecho con una razón y responder al mensaje proporcionado. Finalmente revisarán el sentido y la corrección del mensaje escrito.',format,total)
  expect(p.activityType).toBe('WRITTEN_PRODUCTION')
  const ids=p.criteria.map(c=>c.templateId)
  for(const id of ['ing-3-news','ing-3-opinion','ing-3-interaction','ing-3-strategy-revision','ing-3-written'])expect(ids).toContain(id)
  expect(p.criteria.find(c=>c.templateId==='ing-3-news')?.description).toContain('texto disponible')
  expect(p.criteria.find(c=>c.templateId==='ing-3-opinion')?.description).toContain('Expresa')
 })
 it('presentación anafórica conserva el producto escrito y no exige repetir sus procedimientos',()=>{
  const p=propose('Escribirán en inglés instrucciones para una tarea escolar y revisarán el mensaje escrito. Luego las presentarán oralmente.')
  expect(p.activityType).toBe('ORAL_PRESENTATION')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-3-written')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-3-intelligibility')
  expect(p.criteria.filter(c=>c.templateId==='ing-3-strategy-revision')).toHaveLength(1)
 })
 it('la finalidad de leer no es una acción independiente y las alternativas no exigen ambos productos',()=>{
  const p=propose('Escribirán en inglés un correo o una carta para expresar una opinión sobre un texto proporcionado, para leer en la feria.')
  expect(p.activityType).toBe('WRITTEN_PRODUCTION')
  const ids=p.criteria.map(c=>c.templateId)
  expect(ids).toContain('ing-3-genre-email-or-letter')
  expect(ids).not.toContain('ing-3-genre-email');expect(ids).not.toContain('ing-3-genre-letter')
 })
 it('un audiovisual explícito evalúa el producto sin añadir una exposición oral',()=>{
  const p=propose('Crearán en inglés un video para comunicar una advertencia sobre un riesgo de una situación ficticia.')
  expect(p.activityType).toBe('AUDIOVISUAL_PRODUCTION')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-3-genre-audiovisual')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-3-intelligibility')
 })
 it('no añade rasgos internos, conducta fuera de la tarea ni contenidos negados o recursos',()=>{
  const p=propose('Dialogarán en inglés para expresar una opinión. No se evaluará la motivación, ansiedad, honestidad ni autocontrol. No se exigirá una predicción ni consultar el diccionario. Recursos: un esquema de voz pasiva.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-3-opinion','ing-3-interaction','ing-3-intelligibility'])
 })
 it('ofrece más de veinte candidatos pero rechaza un instrumento final que excede el límite',()=>{
  const description='Escribirán en inglés un mensaje usando presente simple, presente continuo, pasado simple, pasado continuo, presente perfecto, used to, will, going to, there is, there was, imperativo, let’s, why not, can, should, must, may, might, have to, need to, cláusulas adjetivas, cláusulas sustantivas, condicional, question tags, voz pasiva en pasado, voz pasiva en presente, oraciones exclamativas, sustantivos abstractos, gerundio como sujeto, artículo cero, pronombres relativos, adverbios de duración y adverbios de intensidad.'
  for(const format of formats){
   const input={activityTitle:'Actividad',description,preferredInstrumentType:format,maxScore:17.35,participationMode:'INDIVIDUAL' as const}
   expect(()=>recommend(input,context,null,[],'UNMAPPED',null)).toThrow(/hasta 20/)
   expect(recommend({...input,includeAdditionalCandidates:true},context,null,[],'UNMAPPED',null).criteria.length).toBeGreaterThan(20)
  }
 })
})
