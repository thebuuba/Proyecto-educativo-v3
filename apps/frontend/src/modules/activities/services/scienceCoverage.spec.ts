import { describe, expect, it } from 'vitest'
import fixtures from '../../../../../../data/evaluation-instruments/science-regressions.json'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'
import { activityDescriptionText } from '../components/editor/editorPresentation'
import { activityDefaultSuggestions } from '../utils/activityDefaultSuggestions'
import { instrumentAcademicContext } from '../utils/instrumentAcademicContext'
import { validateInstrumentDefinition, instrumentEvaluationConfiguration, findSecondaryScienceTopic, secondaryScienceCriteria, scientificTaskType } from '@aula/shared'

describe('Ciencias compartida con la alternativa local y el editor', () => {
  for (const fixture of fixtures) for (const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for (const maxScore of [20,17.35]) for (const neutral of [false,true]) {
    it(`${fixture.id} ${format} ${maxScore} neutral=${neutral}`, () => {
      const title = neutral ? 'Actividad de aprendizaje' : fixture.activityTitle
      const description = activityDescriptionText(`<p>${fixture.description}</p>`)
      expect(description).toBe(fixture.description)
      const context = instrumentAcademicContext({ id:'qa', subjectName:fixture.name, subjectCode:fixture.code.toLowerCase(), gradeName:'QA', gradeSequence:fixture.grade+6, academicLevelCode:'secundario', sectionName:'QA' })!
      expect(context.grade).toBe(fixture.grade)
      expect(activityDefaultSuggestions(title, description)?.activityType).toBe(fixture.expectedType)
      const result = editableFallbackRecommendation({activityTitle:title,description,academicContext:context,maxScore,instrumentType:format,participationMode:'INDIVIDUAL'})
      expect(result.criteria).toHaveLength(5)
      expect(result.criteria.every(c=>c.templateId.startsWith(fixture.id==='cells'?'nat-2-cells-':`science-${fixture.id}-`))).toBe(true)
      const fields = recommendationToFields(result,title)
      if (format === 'lista-cotejo' || format === 'escala') expect(result.criteria[0].title).toBe(result.criteria[0].description)
      if (format === 'escala') expect(instrumentEvaluationConfiguration(format,fields,maxScore).criteria[0].descriptors).toEqual(result.criteria[0].descriptors.map(d=>d.text))
      if (format === 'escala') expect(validateInstrumentDefinition(format,{...fields,'escala:descriptor:0:1':''},maxScore).length).toBeGreaterThan(0)
      const pending = scoreInstrumentFields(fields,format,null,result)
      expect(pending[`${format}:meta:scorePending`]).toBe('true')
      const scored = scoreInstrumentFields(pending,format,maxScore,result)
      expect(validateInstrumentDefinition(format,scored,maxScore)).toEqual([])
      for (const key of Object.keys(fields).filter(key=>/:criterion:|:description:|:descriptor:/.test(key))) expect(scored[key]).toBe(fields[key])
      expect(JSON.stringify(result.criteria)).not.toContain('construye un circuito')
      expect(result.criteria.every(c=>c.descriptors.every(d=>!d.text.startsWith('Explica con precisión el contenido')))).toBe(true)
    })
  }
  it('no confunde arte, otros temas ni asignaturas con células/Ohm', () => {
    const art='Los estudiantes elaborarán un dibujo de un paisaje usando color y composición para expresar su creatividad.'
    expect(activityDefaultSuggestions('Paisaje',art)?.activityType).toBe('ARTISTIC_PRODUCTION')
    expect(scientificTaskType('Arte',art)).toBeNull()
    const contexts = [{level:'SECONDARY' as const,grade:2,subjectCode:'ART'}, {level:'SECONDARY' as const,grade:6,subjectCode:'MAT'}, {level:'PRIMARY' as const,grade:2,subjectCode:'NAT'}, {level:'SECONDARY' as const,grade:6,subjectCode:'NAT-QUI'}]
    for (const context of contexts) for(const fixture of fixtures) expect(findSecondaryScienceTopic(fixture.activityTitle,fixture.description,context)).toBeNull()
    for(const description of ['Observar la germinación y registrar el crecimiento de plantas.','Investigar la fotosíntesis.','Analizar las migraciones dominicanas.','Resolver ecuaciones de primer grado.','Redactar una noticia.']) expect(findSecondaryScienceTopic('Actividad',description,{level:'SECONDARY',grade:2,subjectCode:'NAT-VIDA'})).toBeNull()
  })
  it('respeta las acciones, el tipo celular único y las alternativas de representación', () => {
    const cells = secondaryScienceCriteria('cells','Dibuja una célula vegetal e identifica su núcleo.')
    expect(cells.map(c=>c.templateId)).toEqual(['science-cells-structures','science-cells-representation'])
    expect(JSON.stringify(cells)).not.toContain('célula animal')
    expect(cells[1].observable).not.toContain('maqueta')
    const oral = secondaryScienceCriteria('cells','Explica oralmente las funciones de los organelos celulares.')
    expect(JSON.stringify(oral)).not.toContain('comparación')
    expect(secondaryScienceCriteria('ohm','Analiza la aplicación cotidiana de la Ley de Ohm.').map(c=>c.templateId)).toEqual(['science-ohm-interpretation'])
    expect(secondaryScienceCriteria('ohm','Resuelve ejercicios sobre la Ley de Ohm.').map(c=>c.templateId)).toEqual(['science-ohm-data','science-ohm-formula','science-ohm-calculation'])
  })
  it('normaliza sinónimos y códigos sin admitir contradicciones de grado', () => {
    expect(activityDescriptionText('<p>Representa la célula</p><p>animal y vegetal</p>')).toBe('Representa la célula animal y vegetal')
    expect(findSecondaryScienceTopic('Actividad','Calcula tensión, corriente y resistencia con la ley de Ohm.',{level:'SECONDARY',grade:6,subjectCode:' nat-fis '})).toBe('ohm')
    expect(findSecondaryScienceTopic('Actividad','Explica las funciones de los orgánulos celulares.',{level:'SECONDARY',grade:2,subjectCode:'NAT-VIDA'})).toBe('cells')
    expect(findSecondaryScienceTopic('Células','Modelo celular',{level:'SECONDARY',grade:6,subjectCode:'NAT-VIDA'})).toBeNull()
  })
})
