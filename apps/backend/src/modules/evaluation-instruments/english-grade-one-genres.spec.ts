import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-genre-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
describe('Géneros y productos de Inglés primero',()=>{
 it('reconoce el análisis de un género aunque la consigna no diga leer',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Analizarán un correo electrónico en inglés para identificar su información solicitada.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('READING_COMPREHENSION')
  expect(p.criteria.some(c=>c.templateId==='ing-1-genre-email')).toBe(true)
 })
 it('el video es una producción audiovisual sin exigir narración oral cuando no se pidió',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Crearán un video en inglés con imágenes y textos breves para describir un lugar. No se requiere narración oral.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('AUDIOVISUAL_PRODUCTION')
  expect(p.criteria.some(c=>c.templateId==='ing-1-genre-audiovisual')).toBe(true)
  expect(p.criteria.some(c=>c.templateId==='ing-1-intelligibility')).toBe(false)
 })
 it('la receta como fuente de imperativos no añade una comprensión completa de sus pasos',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Leerán una receta en inglés e identificarán los imperativos.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-1-feature-imperative'])
 })
 it('los imperativos mencionados en la fuente no se evalúan si solo se piden las acciones',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Leerán una receta en inglés con imperativos e identificarán las acciones y su orden.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='ing-1-feature-imperative')).toBe(false)
  expect(JSON.stringify(p.criteria)).toContain('orden')
 })
 for(const f of fixtures)for(const mode of ['reading','writing','oral'] as const)if(f[mode])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${mode} ${preferredInstrumentType} ${maxScore}`,()=>{
  const description=mode==='reading'?`Leerán un texto del tipo ${f.name} en inglés e identificarán la información solicitada.`:mode==='writing'?`Redactarán un texto del tipo ${f.name} en inglés para la situación acordada.`:`Presentarán oralmente un texto del tipo ${f.name} en inglés para la situación acordada.`
  const p=recommend({activityTitle:'Actividad',description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  const reused:Record<string,string>={recipe:'instructions',forecast:'weather',description:'description'}
  const row=p.criteria.find(c=>c.templateId===`ing-1-genre-${f.id}`||c.templateId===`ing-1-${reused[f.id]}`)
  expect(row).toBeDefined()
  expect(row!.description).toContain(f.id==='recipe'?'acciones':f.meaning)
  if(f.id==='recipe')expect(JSON.stringify(row)).toContain('orden')
  expect(row!.progressionLevels?.length).toBe(5)
  expect(p.totalScoreUnits).toBe(Math.round(maxScore*100))
  if(mode==='reading')expect(row!.description).not.toMatch(/Redacta|Compone|Produce|cocina/)
  expect(JSON.stringify(p.criteria)).not.toMatch(/acento nativo|construye físicamente|experiencia laboral obligatoria/)
 })
 it('elabora un afiche escrito sin clasificarlo como arte',()=>{
  const p=recommend({activityTitle:'Creatividad',description:'Elaborarán un afiche en inglés para comunicar un aviso a la comunidad.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('WRITTEN_PRODUCTION')
  expect(p.criteria.some(c=>c.templateId==='ing-1-genre-poster')).toBe(true)
 })
})
