import {describe,it,expect} from 'vitest'
import {editableAuthoredRecommendation,distributeScoreUnits,type ContextualTopicCriterion} from '@aula/shared'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {matchingCatalogCriterion,nextCatalogCriterion,appendInstrumentCriterion,completeInstrumentCriterion} from './instrumentCriterionAddition'
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const descriptions=[
 'Leerán en inglés un curriculum vitae e identificarán la experiencia y capacidades del perfil proporcionado de un personaje ficticio.',
 'Escribirán en inglés un correo electrónico con un mensaje para un personaje ficticio. Revisarán el sentido y la corrección del texto.',
 'Leerán en inglés un horario e identificarán la actividad y el momento que le corresponde.',
 'Leerán en inglés una tarjeta de presentación e identificarán el nombre, teléfono y correo electrónico.',
 'Escribirán en inglés un curriculum vitae del personaje ficticio e incluirán su experiencia y capacidades.',
]
const academic=(grade:number)=>({level:'SECONDARY' as const,grade,cycle:(grade<4?1:2) as 1|2,modalityCode:'academic',subjectCode:'ING',subjectName:'Inglés',optativeExitName:null})
const content=(p:ReturnType<typeof recommend>)=>p.criteria.map(c=>({template:c.templateId,title:c.title,description:c.description,points:c.maxScoreUnits,weight:c.relativeWeight,progression:c.progressionLevels,descriptors:c.descriptors.map(d=>d.text)}))
describe('Calidad Inglés: equivalencia y edición de evidencias independientes',()=>{
 for(let grade=1;grade<=6;grade++)for(const format of formats)for(const total of [20,17.35])for(const description of descriptions)it(`servicio/alternativa ${grade} ${format} ${total} ${description}`,()=>{
  const input={activityTitle:'Actividad',description,maxScore:total,participationMode:'INDIVIDUAL' as const,preferredInstrumentType:format}
  const service=recommend(input,academic(grade),null,[],'UNMAPPED',null)
  const fallback=editableFallbackRecommendation({...input,academicContext:academic(grade),instrumentType:format})
  expect(content(fallback)).toEqual(content(service))
  const original=recommendationToFields(service,'Actividad'),pending=scoreInstrumentFields(original,format,null,service)
  expect(service.criteria.map((_,i)=>pending[`${format}:points:${i}`])).toEqual(service.criteria.map(()=>''))
  const final=scoreInstrumentFields(pending,format,total,service)
  expect(service.criteria.map((_,i)=>final[`${format}:points:${i}`])).toEqual(service.criteria.map(c=>String(c.maxScoreUnits/100)))
 })
 for(let grade=1;grade<=6;grade++)it(`añadir/completar CV separado sin perder manuales ${grade}`,()=>{
  const full=editableFallbackRecommendation({activityTitle:'Actividad',description:descriptions[0],instrumentType:'lista-cotejo',academicContext:academic(grade),participationMode:'INDIVIDUAL',maxScore:17.35})
  const prior={...full,criteria:full.criteria.slice(0,1)}
  const fields=scoreInstrumentFields(recommendationToFields(prior,'Actividad'),'lista-cotejo',17.35,prior)
  fields['lista-cotejo:criterion:0']='Experiencia del perfil, ajustada por el docente'
  const next=nextCatalogCriterion(full.criteria,fields,'lista-cotejo',prior.criteria)
  expect(next?.templateId).toBe(`ing-${grade}-genre-cv:capacities`)
  expect(nextCatalogCriterion(full.criteria,{...fields,'lista-cotejo:criterion:0':next!.title},'lista-cotejo',prior.criteria)).toBeNull()
  const added=appendInstrumentCriterion(fields,'lista-cotejo',17.35,prior,next)
  expect(added.fields['lista-cotejo:criterion:0']).toBe(fields['lista-cotejo:criterion:0'])
  expect(nextCatalogCriterion(full.criteria,added.fields,'lista-cotejo',added.recommendation?.criteria)).toBeNull()
  const blank=appendInstrumentCriterion(fields,'lista-cotejo',17.35,prior,null)
  const match=matchingCatalogCriterion(full.criteria,blank.fields,'lista-cotejo',1,blank.recommendation?.criteria)
  expect(match?.templateId).toBe(next?.templateId)
  const completed=completeInstrumentCriterion(blank.fields,'lista-cotejo',1,match!)
  for(let i=0;i<2;i++)for(const part of ['points','criterion-id'])expect(completed[`lista-cotejo:${part}:${i}`]).toBe(blank.fields[`lista-cotejo:${part}:${i}`])
 })
 for(const format of formats)it(`completar revisión parcial conserva textos, pesos e identidad ${format}`,()=>{
  const p=editableFallbackRecommendation({activityTitle:'Actividad',description:descriptions[1],instrumentType:format,academicContext:academic(6),participationMode:'INDIVIDUAL',maxScore:17.35})
  const index=p.criteria.findIndex(c=>c.templateId.includes('strategy-revision'))
  let fields=scoreInstrumentFields(recommendationToFields(p,'Actividad'),format,17.35,p)
  if(format==='lista-ponderada'){
   const weights=distributeScoreUnits(10000,p.criteria.map((_,i)=>i?1:7))
   weights.forEach((w,i)=>{fields[`${format}:weight:${i}`]=String(w/100)})
   fields=scoreInstrumentFields(fields,format,17.35,p)
  }
  fields[`${format}:criterion:${index}`]='Comprobación observada por el docente'
  const missing=format==='lista-ponderada'?`${format}:indicator:${index}`:`${format}:description:${index}`
  fields[missing]=''
  const completed=completeInstrumentCriterion(fields,format,index,p.criteria[index])
  expect(completed[missing]).toContain('mantiene lo correcto')
  expect(completed[`${format}:criterion:${index}`]).toBe(fields[`${format}:criterion:${index}`])
  for(const [key,value] of Object.entries(fields))if(/:points:|:weight:|:criterion-id:/.test(key))expect(completed[key]).toBe(value)
 })
 it('controla capacidad después de expandir y conserva peso del criterio',()=>{
  const base:ContextualTopicCriterion={templateId:'ing-6-fixture',title:'Datos',observable:'Identifica datos.',weight:4,progressionLevels:['Completo','Esencial','Parte','Erróneo','Ausente'],checklistParts:[{key:'a',observable:'Dato A',progressionLevels:['A','A','A','A','A']},{key:'b',observable:'Dato B',progressionLevels:['B','B','B','B','B']}]}
  const rows=[base,...Array.from({length:19},(_,i)=>({...base,checklistParts:undefined,templateId:`ing-6-relational-${i}`}))]
  const input={activityTitle:'Actividad',instrumentType:'lista-cotejo' as const,participationMode:'INDIVIDUAL' as const,maxScore:17.35}
  expect(()=>editableAuthoredRecommendation(rows,input,'READING_COMPREHENSION','ingles-calidad')).toThrow(/admite hasta 20/)
  const pool=editableAuthoredRecommendation(rows,{...input,includeAdditionalCandidates:true},'READING_COMPREHENSION','ingles-calidad')
  expect(pool.criteria).toHaveLength(21)
  expect(pool.criteria.slice(0,2).reduce((s,c)=>s+c.relativeWeight!,0)).toBe(4)
 })
})
