import {describe,expect,it} from 'vitest'
import {recommend} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'
const context: AcademicContext={level:'SECONDARY',grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const cases=[
  ['POSTER_CREATION','Elaborarán un afiche sobre la convivencia escolar con mensaje breve, público destinatario, argumentos y una imagen o símbolo, cuidando la legibilidad.'],
  ['POSTER_ANALYSIS','Analizarán un afiche e identificarán propósito, público, mensaje y recursos persuasivos, justificando sus interpretaciones con evidencias.'],
  ['POSTER_COMPARISON','Compararán dos afiches de convivencia escolar considerando sus mensajes y recursos persuasivos; justificarán cuál resulta más eficaz.'],
  ['POSTER_PRESENTATION','Presentarán un afiche de convivencia escolar y explicarán su mensaje, público y decisiones comunicativas.'],
] as const
describe('Afiche de primero: contenido específico y progresivo',()=>{
  for(const [activity,description] of cases) for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [20,17.35]) {
    it(`${activity} ${format} ${maxScore}`,()=>{
      const result=recommend({activityTitle:'Actividad 1',description,participationMode:'INDIVIDUAL',maxScore,preferredInstrumentType:format,pedagogicalActivityType:activity},context,null,[],'UNMAPPED',null)
      expect(result.criteria.every(c=>c.templateId.startsWith('poster-'))).toBe(true)
      expect(result.totalScoreUnits).toBe(Math.round(maxScore*100))
      if(result.levels.length) expect(result.criteria.every(c=>c.descriptors.at(-1)?.text.includes('No aporta evidencia suficiente para valorar')===false)).toBe(true)
      if(format==='lista-ponderada') expect(result.criteria.every(c=>c.description.includes('Parcial (50%):'))).toBe(true)
    })
  }
  it('no impone responder preguntas en una presentación',()=>{
    const result=recommend({activityTitle:'El afiche',description:cases[3][1],participationMode:'INDIVIDUAL',maxScore:20},context,null,[],'UNMAPPED',null)
    expect(JSON.stringify(result.criteria)).not.toMatch(/responde preguntas/i)
    expect(JSON.stringify(result.criteria)).not.toContain('sobre convivencia escolar y explicarán')
  })
  it('no impone imágenes ni producción al analizar solo propósito y mensaje',()=>{
    const result=recommend({activityTitle:'El afiche',description:'Analizarán un afiche de solo texto e identificarán su propósito y mensaje.',participationMode:'INDIVIDUAL',maxScore:20},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).toEqual(['poster-purpose','poster-message'])
    expect(JSON.stringify(result.criteria)).not.toMatch(/imágenes|colores/)
  })
  it('prioriza la descripción y conserva el tema sin inventar ahorro',()=>{
    for(const title of ['Cuidemos el agua','Actividad 1','¿Cómo podemos comunicar nuestras ideas en la comunidad?']) {
      const result=recommend({activityTitle:title,description:'Elaborarán un afiche sobre el ciclo del agua con una imagen o símbolo.',participationMode:'INDIVIDUAL',maxScore:20},context,null,[],'UNMAPPED',null)
      expect(JSON.stringify(result.criteria)).not.toMatch(/ahorro|cuidemos el agua/i)
      expect(result.criteria.find(c=>c.templateId==='poster-visuals')?.description).toContain('imagen o símbolo')
    }
  })
})
