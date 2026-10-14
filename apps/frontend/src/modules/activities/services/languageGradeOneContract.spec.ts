import {describe,it,expect} from 'vitest'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from './instrumentPreparation'
import {scoreInstrumentFields} from './instrumentScoring'
import {automaticInstrumentType} from '../utils/automaticInstrumentType'
import {detectSecondaryLanguageActivity,type InstrumentType} from '@aula/shared'

const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const descriptions=[
  'Analiza en una noticia los sinónimos y las siglas con ejemplos del texto.',
  'Investiga los datos del hecho que aparece en la noticia y documenta su origen.',
  'Elabora una guía turística con mapas y fotografías de los lugares. Revisa el borrador y publica la versión final.',
  'Investiga los lugares para una guía turística y comprueba los datos de sus fuentes.',
  'Analiza únicamente los adjetivos y conectores de ejemplificación del informe de lectura.',
  'Elabora un afiche para un evento e incluye fecha, lugar y horario.',
  'Redacta un informe sobre un cuento policíaco, analiza el narrador y los actantes.',
  'Compara únicamente las figuras literarias de dos caligramas.',
  'Recita un caligrama y enfatiza la anáfora.',
]
const formats: InstrumentType[]=['rubrica','lista-cotejo','escala','lista-ponderada']
const content=(result:ReturnType<typeof recommend>)=>result.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description,points:c.maxScoreUnits,descriptors:c.descriptors.map(d=>d.text)}))
describe('Lengua 1: servicio y alternativa, puntuación y contratos',()=>{
  for(const description of descriptions) for(const instrumentType of formats) for(const maxScore of [15,20,17.35]) it(`${description.slice(0,48)} ${instrumentType} ${maxScore}`,()=>{
    const input={activityTitle:'Actividad',description,participationMode:'INDIVIDUAL' as const,maxScore,preferredInstrumentType:instrumentType}
    const service=recommend(input,context,null,[],'UNMAPPED',null)
    const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context,secondaryLanguageGrade:1})
    expect(content(local)).toEqual(content(service))
    const fromPending=scoreInstrumentFields(recommendationToFields(local,'Actividad'),instrumentType,null,local)
    const assigned=scoreInstrumentFields(fromPending,instrumentType,maxScore,local)
    expect(service.criteria.map((_,i)=>Number(assigned[`${instrumentType}:points:${i}`]))).toEqual(service.criteria.map(c=>c.maxScoreUnits/100))
    expect(service.criteria.every(c=>!c.templateId.startsWith('task-'))).toBe(true)
  })
  for(const [purpose,expected] of [
    ['Se valorará la calidad en varias dimensiones.','rubrica'],
    ['Se comprobará la presencia o ausencia de sus partes.','lista-cotejo'],
    ['Se registrará la regularidad de sus identificaciones.','escala'],
    ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
  ] as const) it(`automatic purpose: ${expected}`,()=>{
    const description=`Analizarán una noticia. ${purpose}`
    const activity=detectSecondaryLanguageActivity('Trabajo',description,context)!
    expect(automaticInstrumentType(activity,context,15,description)).toBe(expected)
    expect(recommend({activityTitle:'Trabajo',description,participationMode:'INDIVIDUAL',maxScore:15},context,null,[],'UNMAPPED',null).instrumentType).toBe(expected)
  })
})
