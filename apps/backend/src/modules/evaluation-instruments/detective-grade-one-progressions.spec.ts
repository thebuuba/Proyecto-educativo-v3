import {describe,expect,it} from 'vitest'
import {recommend} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'
const context: AcademicContext={level:'SECONDARY',grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const tasks=[
  ['DETECTIVE_STORY_WRITING','Escribirán un cuento policíaco con inicio, nudo y desenlace, personajes, ambiente, narrador y pistas que permitan explicar la resolución del misterio. Revisarán conectores y ortografía.'],
  ['DETECTIVE_STORY_ANALYSIS','Analizarán un cuento policíaco e identificarán estructura, narrador, personajes, ambiente y pistas; justificarán la interpretación del desenlace con ejemplos del texto.'],
  ['DETECTIVE_STORY_COMPARISON','Compararán dos cuentos policíacos atendiendo a sus tramas, personajes y pistas; explicarán cómo se resuelve cada misterio con evidencias de ambos textos.'],
  ['DETECTIVE_STORY_NARRATION','Narrarán un cuento policíaco en una secuencia comprensible, con conflicto, pistas y resolución.'],
  ['DETECTIVE_STORY_ANALYSIS_PRESENTATION','Presentarán el análisis de un cuento policíaco explicando el narrador, los personajes y las pistas con ejemplos del texto.'],
] as const
describe('Cuento policíaco de primero: progresiones por acción',()=>{
  for(const [activity,description] of tasks) for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [20,17.35]) it(`${activity} ${format} ${maxScore}`,()=>{
    const result=recommend({activityTitle:'Actividad 1',description,pedagogicalActivityType:activity,preferredInstrumentType:format,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.every(c=>c.templateId.startsWith('detective-'))).toBe(true)
    expect(result.totalScoreUnits).toBe(Math.round(maxScore*100))
    expect(JSON.stringify(result.criteria)).not.toMatch(/No aporta evidencia suficiente para valorar|responde preguntas/i)
    if(format==='lista-ponderada') expect(result.criteria.every(c=>c.description.includes('Parcial (50%):'))).toBe(true)
  })
  it('analiza solamente narrador y pistas cuando la consigna es focalizada',()=>{
    const result=recommend({activityTitle:'El cuento policíaco',description:'Analizarán un cuento policíaco para identificar el narrador y relacionar las pistas con el desenlace.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).toEqual(['detective-narrator','detective-clues'])
    expect(JSON.stringify(result.criteria)).not.toMatch(/caracteriza personajes|ambiente|recursos literarios/i)
  })
  it('no exige dramatización de voces ni responder preguntas al narrar',()=>{
    const result=recommend({activityTitle:'El cuento policíaco',description:tasks[3][1],maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).not.toContain('detective-voice')
    expect(JSON.stringify(result.criteria)).not.toMatch(/responde preguntas|dicción|volumen|ritmo/i)
  })
})
