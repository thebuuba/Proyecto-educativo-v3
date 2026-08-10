import { describe, expect, it } from 'vitest'

import type { PlanningEntryWithDetails } from '@/modules/planning/types'
import { buildPlanningDocumentHtml } from '@/modules/planning/utils/planningDocumentExport'

describe('documento de planificación', () => {
  it('genera el formato dominicano horizontal y escapa el contenido docente', () => {
    const html = buildPlanningDocumentHtml({
      title: 'La célula <script>alert(1)</script>',
      planningType: 'SEQUENCE',
      durationDays: 2,
      durationMinutes: 90,
      activities: {
        learningSituation: 'El curso investigará su entorno.',
        inicio: '',
        desarrollo: '',
        cierre: '',
        days: [{
          day: 1,
          date: '2026-08-20',
          inicio: 'Recuperación de saberes.',
          desarrollo: 'Construcción de un modelo.',
          cierre: 'Socialización.',
          evidence: 'Modelo celular.',
          evaluationMethod: 'Observación.',
          evaluationInstruments: 'Lista de cotejo.',
          metacognition: '¿Cómo lo aprendí?',
          resources: 'Cartulina y marcadores.',
        }],
      },
      subjectName: 'Ciencias de la Naturaleza',
      gradeName: '2.º',
      sectionName: 'A',
      periodName: 'P1',
      specificCompetence: 'Explica procesos celulares.',
      achievementIndicator: 'Describe las partes de la célula.',
      contentConceptual: 'La célula.',
      contentProcedural: 'Construcción de modelos.',
      contentAttitudinal: 'Trabajo colaborativo.',
      strategies: 'Indagación.',
      evidence: 'Modelo celular.',
      evaluationMethod: 'Observación.',
      evaluationInstruments: 'Lista de cotejo.',
      resources: 'Cartulina.',
      updatedAt: '2026-07-22',
    } as PlanningEntryWithDetails)

    expect(html).toContain('@page { size: A4 landscape;')
    expect(html).toContain('Situación de aprendizaje')
    expect(html).toContain('Metacognición')
    expect(html).toContain('Lista de cotejo.')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).not.toContain('<script>alert(1)</script>')
  })
})
