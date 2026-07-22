import { describe, expect, it } from 'vitest'

import {
  curriculumPromptExcerpt,
  quickPlanningValidationError,
} from '@/modules/planning/utils/quickPlanningValidation'

const completePlanning = {
  courseKey: 'Secundaria::1.º::A',
  sectionSubjectId: 'subject',
  academicPeriodId: 'period',
  plannedDate: '2026-08-20',
  topic: 'La célula',
  duration: '90',
  inicio: 'Recuperar saberes previos.',
  desarrollo: 'Construir un modelo.',
  cierre: 'Explicar lo aprendido.',
  evidence: 'Modelo explicado mediante una lista de cotejo.',
  fundamentalCompetencies: ['Comunicativa'],
  specificCompetence: 'Explica los procesos celulares.',
  achievementIndicator: 'Describe las partes de la célula.',
}

describe('planificación rápida', () => {
  it('solo exige decisiones docentes al principio y valida el currículo al guardar', () => {
    expect(quickPlanningValidationError(1, { ...completePlanning, inicio: '', evidence: '' })).toBe('')
    expect(quickPlanningValidationError(2, { ...completePlanning, desarrollo: '' })).toContain('actividad principal')
    expect(quickPlanningValidationError(3, { ...completePlanning, specificCompetence: '' })).toContain('competencias específicas')
    expect(quickPlanningValidationError(3, completePlanning)).toBe('')
  })

  it('limita el contexto curricular enviado al generador', () => {
    const officialCurriculum = 'Competencia oficial. '.repeat(100)
    const excerpt = curriculumPromptExcerpt(officialCurriculum)

    expect(excerpt.length).toBeLessThanOrEqual(1_000)
    expect(excerpt.endsWith('…')).toBe(true)
    expect(curriculumPromptExcerpt('Texto breve')).toBe('Texto breve')
  })
})
