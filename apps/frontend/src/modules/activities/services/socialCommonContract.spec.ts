import {describe,it,expect} from 'vitest'
import {resolveCommonSocialTask,socialGradeOneTopics,validateInstrumentDefinition} from '@aula/shared'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {activityDefaultSuggestions} from '../utils/activityDefaultSuggestions'
import {completeInstrumentCriterion,nextCatalogCriterion} from './instrumentCriterionAddition'
import proceduralContracts from '../../../../../../data/evaluation-instruments/social-grade-one-procedural-contracts.json'
import productContracts from '../../../../../../data/evaluation-instruments/social-grade-one-product-contracts.json'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
const samples=[
 ['alternative-media','Realiza un panel o una infografía sobre la expansión colonial en el Caribe.'],
 ['positive-news-media','Redacta una noticia sobre las Revoluciones burguesas con titular, entrada, cuerpo, una foto proporcionada y pie de foto. Usa conectores de orden y temporales.'],
 ['causal','Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas.'],
 ['chronology','Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.'],
 ['spatial','Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.'],
 ['perspectives','Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados.'],
 ['alternative','Elabora una línea de tiempo o un mapa sobre la expansión colonial europea.'],
 ['argument','Debate sobre los efectos sociales de la Segunda Revolución Industrial y justifica los argumentos con las fuentes proporcionadas.'],
 ['questions-hypotheses','Formula preguntas e hipótesis provisionales sobre la expansión colonial europea. No investigues nuevas fuentes.'],
 ['source-reliability','Identifica cuáles de las fuentes proporcionadas para el estudio geográfico son confiables y justifica tu selección.'],
 ['historical-news','Redacta una noticia sobre las revoluciones burguesas. Incluye titular, entrada y cuerpo. Sin fotografías ni pie de foto.'],
 ['digital-prevention','Analiza los riesgos de compartir información personal en redes sociales y propone medidas de protección para el caso ficticio. No compartas datos propios.'],
 ...proceduralContracts.cases.map(c=>[c.id,c.description]),
 ...productContracts.cases.map(c=>[c.id,c.description]),
 ...socialGradeOneTopics.map(t=>[t.id,`Explica ${t.label}.`]),
]
const normalized=(p:ReturnType<typeof editableFallbackRecommendation>)=>({activity:p.activityType,type:p.instrumentType,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...c})=>c)})
describe('Sociales primero: motor, alternativa y controles conservados',()=>{
 for(const [id,description] of samples)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${id}/${instrumentType}/${maxScore}`,()=>{
   const base={activityTitle:'Un título antiguo sobre células',description,maxScore,participationMode:'INDIVIDUAL' as const}
   const local=editableFallbackRecommendation({...base,instrumentType,academicContext:context})
   const remote=recommend({...base,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
   expect(normalized(local)).toEqual(normalized(remote))
   expect(local.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   expect(local.criteria.length).toBeGreaterThan(0)
   expect(activityDefaultSuggestions(base.activityTitle,description,context)?.activityType).toBe(resolveCommonSocialTask('',description,context)?.activityType)
   const pending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
   expect(pending[`${instrumentType}:meta:scorePending`]).toBe('true')
   expect(pending[`${instrumentType}:points:0`]).toBe('')
   const fields=scoreInstrumentFields(pending,instrumentType,maxScore,local)
   expect(validateInstrumentDefinition(instrumentType,fields,maxScore)).toEqual([])
   expect(local.criteria.reduce((s,_,i)=>s+Math.round(Number(fields[`${instrumentType}:points:${i}`])*100),0)).toBe(Math.round(maxScore*100))
   const completed=completeInstrumentCriterion({...fields,[`${instrumentType}:criterion:0`]:'Texto manual',[`${instrumentType}:description:0`]:''},instrumentType,0,local.criteria[0])
   expect(completed[`${instrumentType}:criterion:0`]).toBe('Texto manual')
   expect(completed[`${instrumentType}:description:0`]).toBe(local.criteria[0].description)
   expect(nextCatalogCriterion(local.criteria,fields,instrumentType)).toBeNull()
  })
 }
 it('no extiende la cobertura a primaria, otro grado ni una salida optativa',()=>{
  for(const academicContext of [{...context,level:'PRIMARY' as const},{...context,grade:2},{...context,subjectCode:'OPT-HCS-SOC'},{...context,optativeExitName:'Humanidades y Ciencias Sociales'}])expect(resolveCommonSocialTask('','Analiza la Revolución Francesa.',academicContext)).toBeNull()
 })
})
