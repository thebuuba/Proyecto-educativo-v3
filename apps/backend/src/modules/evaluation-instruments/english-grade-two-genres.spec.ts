import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-two-genre-contracts.json'
const context={level:'SECONDARY' as const,grade:2,subjectCode:'ING',cycle:1,optativeExitName:null}
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const propose=(description:string,format:typeof formats[number]='rubrica',score=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore:score,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Segundo: géneros de recepción y productos por modalidad oficial',()=>{
 for(const f of fixtures)for(const mode of f.modes)for(const format of formats)for(const score of [20,17.35])it(`${f.id} ${mode} ${format} ${score}`,()=>{
  const description=mode==='reading'?`Leerán en inglés una ${f.label} e identificarán la información solicitada.`:mode==='oral'?`Presentarán oralmente en inglés una ${f.label} para comunicar la información solicitada.`:`Escribirán en inglés una ${f.label} para comunicar la información solicitada.`
  const p=propose(description,format,score),c=p.criteria.find(c=>c.templateId===`ing-2-genre-${f.id}`)
  expect(c).toBeDefined();expect(c!.progressionLevels).toHaveLength(5)
  expect(p.criteria).toEqual(propose(description,format,score,'La célula').criteria)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(score*100))
 })
 it('el horario leído para localizar verbos no exige un producto horario',()=>{
  const p=propose('Leerán en inglés un horario e identificarán el presente simple.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-2-feature-present-simple'])
 })
 it('respeta la consulta limitada al destinatario de un correo',()=>{
  const p=propose('Leerán en inglés un correo electrónico e identificarán el destinatario.')
  const c=p.criteria.find(c=>c.templateId==='ing-2-genre-email')!
  expect(c.description).toContain('destinatario')
  expect(c.description).not.toContain('propósito')
 })
 it('no elimina un dato de comprensión pedido junto a una estructura',()=>{
  const p=propose('Leerán en inglés un correo electrónico e identificarán el destinatario y el presente simple.')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-genre-email')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-feature-present-simple')
 })
 it('no mezcla la lista de recepción con los productos escritos',()=>{
  const p=propose('Escribirán en inglés una guía turística con información del lugar.')
  expect(p.criteria.some(c=>c.templateId==='ing-2-genre-tourist-guide')).toBe(false)
 })
 it('video es evidencia de la tarea explícita, no un género curricular añadido',()=>{
  const p=propose('Grabarán un video en inglés para comunicar consejos a un personaje sobre un problema cotidiano.')
  expect(p.activityType).toBe('AUDIOVISUAL_PRODUCTION')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-genre-audiovisual')
  expect(p.criteria.map(c=>c.templateId)).toContain('ing-2-advice')
 })
 it('localizar productos y precios de un menú no obliga a simular una compra',()=>{
  const p=propose('Leerán en inglés un menú e identificarán los productos y sus precios.')
  expect(p.criteria.map(c=>c.templateId)).not.toContain('ing-2-shopping')
  expect(p.criteria.find(c=>c.templateId==='ing-2-genre-menu')!.description).toContain('precios')
 })
})
