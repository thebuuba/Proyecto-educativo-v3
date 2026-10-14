import {describe, expect, it} from 'vitest'
import {recommend} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'
import type {InstrumentType} from '@aula/shared'
import subtopics from '../../../../../data/evaluation-instruments/language-grade-one-subtopic-contracts.json'

const context: AcademicContext = {level:'SECONDARY',grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const cases = [
  ['noticia', 'los conectores de orden y temporales', 'conectores'],
  ['noticia', 'los tiempos verbales del indicativo', 'indicativo'],
  ['noticia', 'los sinónimos', 'sinónimos'],
  ['noticia', 'las siglas, abreviaturas y acrónimos', 'siglas'],
  ['noticia', 'los paratextos', 'paratextos'],
  ['guía turística', 'los sustantivos propios, comunes y abstractos', 'sustantivos'],
  ['guía turística', 'los adjetivos calificativos y determinativos', 'adjetivos'],
  ['guía turística', 'el núcleo y los modificadores del grupo nominal', 'grupo nominal'],
  ['guía turística', 'los signos de interrogación y exclamación', 'interrogación'],
  ['informe de lectura', 'los conectores de ejemplificación', 'ejemplificación'],
  ['informe de lectura', 'los verbos en presente y pasado del indicativo', 'indicativo'],
  ['afiche', 'el modo imperativo', 'imperativo'],
  ['afiche', 'las perífrasis de obligación y posibilidad', 'perífrasis'],
  ['afiche', 'la connotación y la elipsis', 'connotación'],
  ['afiche', 'la metáfora, el pleonasmo y la exageración', 'pleonasmo'],
  ['cuento policíaco', 'los actantes', 'actantes'],
  ['cuento policíaco', 'el pretérito indefinido y el pretérito imperfecto', 'pretérito'],
  ['cuento policíaco', 'los adverbios de tiempo y espacio', 'adverbios'],
  ['cuento policíaco', 'los conectores coordinantes y de consecuencia', 'conectores'],
  ['caligrama', 'la tipografía y la caligrafía', 'tipografía'],
  ['caligrama', 'la anáfora y el epíteto', 'anáfora'],
  ['caligrama', 'los sustantivos y adjetivos', 'sustantivos'],
] as const
const formats: InstrumentType[] = ['rubrica','lista-cotejo','escala','lista-ponderada']
describe('Lengua común 1: subtemas conectados al contrato de la consigna', () => {
  it('does not require a negated publication and keeps later affirmative requirements',()=>{
    const run=(description:string)=>recommend({activityTitle:'Trabajo',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    const production=run('Redactarán una noticia sin publicar. Revisarán el borrador con sus compañeros.')
    expect(production.criteria.some(c=>c.templateId.endsWith('-process-publication'))).toBe(false)
    expect(production.criteria.some(c=>c.templateId.endsWith('-process-revision'))).toBe(true)
    const analysis=run('Analizarán en una noticia únicamente los sinónimos, sin estudiar las siglas. Explicarán los conectores temporales.')
    expect(analysis.criteria.some(c=>c.templateId.endsWith('-feature-connectors'))).toBe(true)
    expect(analysis.criteria.some(c=>c.templateId.endsWith('-feature-abbreviations'))).toBe(false)
  })
  for(const subtopic of subtopics) it(`curriculum binding: ${subtopic.topic}, ${subtopic.source.text}`,()=>{
    const result=recommend({activityTitle:'Trabajo',description:subtopic.description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).toContain(subtopic.expectedCriterion)
  })
  for (const [genre, feature, evidence] of cases) for (const format of formats) it(`${genre}: ${feature}, ${format}`, () => {
    const input = {activityTitle:'Trabajo de clase', description:`Analiza en ${genre} únicamente ${feature}, con ejemplos del texto.`, maxScore:17.35, participationMode:'INDIVIDUAL' as const, preferredInstrumentType:format}
    const result = recommend(input,context,null,[],'UNMAPPED',null)
    expect(result.criteria.some(c => `${c.title} ${c.description}`.toLowerCase().includes(evidence))).toBe(true)
    expect(result.criteria.some(c => c.templateId.includes('-feature-'))).toBe(true)
    expect(result.criteria.every(c => !/noticiero|redacta una noticia|crea un|desenlace/.test(c.description.toLowerCase()))).toBe(true)
    expect(result.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  })
  it('presentarán does not turn a written analysis into an oral presentation',()=>{
    for (const product of ['informe','trabajo escrito']) {
      const description=`Los estudiantes analizarán la estructura de la noticia y presentarán un ${product} con ejemplos del texto.`
      expect(recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null).activityType).toBe('NEWS_ANALYSIS')
    }
  })
  it('requires all requested visual resources, but preserves alternatives',()=>{
    const run=(resources:string)=>recommend({activityTitle:'Guía',description:`Elabora una guía turística con ${resources}.`,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(run('mapas y fotografías').criteria.some(c=>/mapas y fotografías/.test(c.description))).toBe(true)
    expect(run('mapas o fotografías').criteria.some(c=>/mapas o fotografías/.test(c.description))).toBe(true)
    expect(JSON.stringify(run('mapas y fotografías').criteria)).not.toMatch(/publicar|publicacion|publicación|guía física o digital/)
  })
  it('selects the format by the evidence being evaluated and respects explicit choices',()=>{
    for (const [purpose,expected] of [
      ['Se valorará la calidad de la interpretación en varias dimensiones.','rubrica'],
      ['Se verificará la presencia o ausencia del titular, la entrada y el cuerpo.','lista-cotejo'],
      ['Se registrará la regularidad con que identifica el hecho y distingue datos de opiniones durante las lecturas.','escala'],
      ['Se asignarán pesos entre los componentes verificables del análisis.','lista-ponderada'],
    ] as const) {
      const input={activityTitle:'La noticia',description:`Analizarán una noticia. ${purpose}`,maxScore:15,participationMode:'INDIVIDUAL' as const}
      expect(recommend(input,context,null,[],'UNMAPPED',null).instrumentType).toBe(expected)
      for(const preferredInstrumentType of formats) expect(recommend({...input,preferredInstrumentType},context,null,[],'UNMAPPED',null).instrumentType).toBe(preferredInstrumentType)
    }
  })
  it('does not impose oral delivery merely because the task says presentar',()=>{
    const result=recommend({activityTitle:'La guía turística',description:'Presentarán una guía turística de la comunidad.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.activityType).toBe('TOURIST_GUIDE_ANALYSIS')
    expect(JSON.stringify(result.criteria)).not.toMatch(/dicción|volumen|oral/)
  })
  it('focuses comparison on the requested dimension, including narrators without a new ending',()=>{
    const result=recommend({activityTitle:'Comparación',description:'Compararán los narradores de dos cuentos policíacos con ejemplos de los fragmentos disponibles.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).toEqual(['detective-feature-narrator'])
    expect(result.criteria[0].description).toMatch(/Contrasta.*narradores/)
    expect(JSON.stringify(result.criteria)).not.toMatch(/desenlace|resolución del misterio|crea un cuento/)
  })
  it('keeps all explicitly requested dimensions when grammar and structure are combined',()=>{
    const result=recommend({activityTitle:'Actividad',description:'Analiza únicamente la estructura y las siglas de la noticia.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).toEqual(['news-structure','news-evidence','news-feature-abbreviations'])
  })
})
