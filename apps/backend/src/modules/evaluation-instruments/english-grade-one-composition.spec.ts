import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-composition-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
describe('Acciones independientes de Inglés primero',()=>{
 it('no puntúa dos veces la misma comprensión ni añade horas a la búsqueda de actividades',()=>{
  const p=recommend({activityTitle:'Actividad',description:fixtures.find(f=>f.id==='read-only-actions')!.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-1-genre-schedule','ing-1-weather'])
  expect(p.criteria[0].description).toContain('las actividades solicitadas del horario')
  expect(p.criteria[0].description).not.toContain('momento')
 })
 it('identificar solo el destinatario no exige identificar también el propósito del correo',()=>{
  const p=recommend({activityTitle:'Actividad',description:fixtures[0].description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const row=p.criteria.find(c=>c.templateId==='ing-1-genre-email')!
  expect(row.description).toContain('el destinatario del correo')
  expect(row.description).not.toContain('propósito')
 })
 it('la presentación posterior mantiene la carta como referente y cambia la modalidad',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Los estudiantes redactarán una carta en inglés. Luego la presentarán oralmente.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('ORAL_PRESENTATION')
  expect(p.criteria.some(c=>c.templateId==='ing-1-genre-letter')).toBe(true)
  expect(p.criteria.some(c=>c.templateId==='ing-1-intelligibility')).toBe(true)
 })
 it('un propósito en infinitivo no se convierte en otra modalidad',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Redactarán un correo electrónico en inglés para presentar una invitación.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('WRITTEN_PRODUCTION')
  expect(p.criteria.some(c=>c.templateId.includes('intelligibility'))).toBe(false)
 })
 for(const f of fixtures)for(const preferredInstrumentType of [undefined,'rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${preferredInstrumentType??'auto'} ${maxScore}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:f.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(f.activity)
  expect(p.instrumentType).toBe(preferredInstrumentType??f.instrument)
  for(const [id,meaning] of f.expected)expect(p.criteria.some(c=>c.templateId.startsWith(id)&&c.description.includes(meaning)),`${id}: ${meaning}`).toBe(true)
  expect(new Set(p.criteria.map(c=>c.id)).size).toBe(p.criteria.length)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
 })
 it('acepta la denominación oficial sin código sin confundir otra lengua',()=>{
  const input={activityTitle:'Actividad',description:fixtures[0].description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  expect(recommend(input,{...context,subjectCode:'',subjectName:'Lenguas extranjeras: Inglés'},null,[],'UNMAPPED',null).criteria.some(c=>c.templateId.startsWith('ing-1-'))).toBe(true)
  expect(recommend(input,{...context,subjectCode:'FRA',subjectName:'Inglés'},null,[],'UNMAPPED',null).criteria.some(c=>c.templateId.startsWith('ing-1-'))).toBe(false)
 })
})
