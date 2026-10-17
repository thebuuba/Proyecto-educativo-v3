import {englishObjectiveId} from './english-quality-test-utils'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-strategy-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
describe('Estrategias observables de Inglés primero',()=>{
 it('la comparación cultural conserva el aspecto y no lo cambia por gustos propios o pronóstico',()=>{
  for(const aspect of ['celebraciones','puntualidad','gustos y preferencias','formas de interactuar','rasgos físicos','efecto del clima en las condiciones de vida']){
   const p=recommend({activityTitle:'Actividad',description:`Leerán información en inglés y compararán ${aspect} de República Dominicana y de otro país según los ejemplos disponibles.`,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-1-strategy-cultural-comparison'])
   expect(p.criteria[0].description).toContain(aspect)
  }
 })
 it('detecta ensayo y planificación sin exigir la palabra oral o escribir',()=>{
  for(const [description,expected] of [['Ensayarán palabras y pautas de entonación en inglés.','ORAL_PRESENTATION'],['Planificarán las ideas para un mensaje en inglés.','WRITTEN_PRODUCTION']]){
   const p=recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
   expect(p.activityType).toBe(expected)
   expect(p.criteria.some(c=>c.templateId.startsWith('ing-1-strategy-'))).toBe(true)
  }
 })
 it('no duplica la petición de aclaración ni confunde comparativos con comparar culturas',()=>{
  const result=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  const p=result('Escucharán un mensaje en inglés y solicitarán aclaración de la parte no comprendida.')
  expect(p.criteria.map(c=>c.templateId)).toEqual(['ing-1-strategy-help'])
  expect(result('Escribirán en inglés comparativos sobre ciudades de otros países.').criteria.some(c=>c.templateId.includes('cultural-comparison'))).toBe(false)
 })
 for(const f of fixtures)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${f.id} ${preferredInstrumentType} ${maxScore}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:f.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  const row=p.criteria.find(c=>englishObjectiveId(c.templateId)===`ing-1-strategy-${f.id}`)
  expect(row).toBeDefined()
  expect(row!.description).toContain(f.meaning)
  expect(row!.progressionLevels?.length).toBe(5)
  expect(p.activityType).toBe(f.mode)
  expect(p.totalScoreUnits).toBe(Math.round(maxScore*100))
  expect(JSON.stringify(p.criteria)).not.toMatch(/mantiene contacto visual|ausencia de ansiedad|acento nativo|personalidad correcta/)
 })
 it('no convierte condiciones de apoyo en criterios de personalidad',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Conversarán en inglés para ofrecer información personal. Podrán usar apoyos para controlar su ansiedad. Recursos: diccionario y gestos.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.every(c=>!c.templateId.includes('strategy-'))).toBe(true)
 })
 it('subrayar no exige también tomar notas ni consultar un diccionario',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Leerán un mensaje en inglés y subrayarán los datos solicitados.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId==='ing-1-strategy-annotation')).toBe(true)
  expect(JSON.stringify(p.criteria)).not.toMatch(/anotaciones|diccionario/)
 })
})
