import { describe, expect, it } from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/art-grade-one-contracts.json'
import { recommend } from './recommendation-engine'

const context = {
  level: 'SECONDARY' as const,
  grade: 1,
  cycle: 1,
  subjectCode: 'ART',
  subjectName: 'Educación Artística',
  modalityCode: null,
  optativeExitName: null,
}

describe('Artística primero: evidencia expresiva y técnica solicitada', () => {
  it('relacionar argumentos con signos de la obra no inventa una producción simbólica', () => {
    const proposal = recommend(
      {
        activityTitle: 'Actividad',
        description: contracts.cases.find((task) => task.id === 'work-appreciation')!.description,
        preferredInstrumentType: 'rubrica',
        maxScore: 20,
        participationMode: 'INDIVIDUAL',
      },
      context,
      null,
      [],
      'UNMAPPED',
      null,
    )
    expect(proposal.criteria).toHaveLength(1)
    expect(proposal.criteria[0].templateId).toMatch(/^art-1-appreciation-analysis-/)
    expect(proposal.criteria[0].description).not.toMatch(/mensaje ficticio|producción propia/)
  })
  it('el plan coreográfico conserva dos dimensiones sin duplicarlas como una ejecución', () => {
    const proposal = recommend(
      {
        activityTitle: 'Actividad',
        description: contracts.cases.find((task) => task.id === 'collective-choreography-plan')!
          .description,
        preferredInstrumentType: 'rubrica',
        maxScore: 20,
        participationMode: 'GROUP',
      },
      context,
      null,
      [],
      'UNMAPPED',
      null,
    )
    expect(proposal.activityType).toBe('PROJECT')
    expect(proposal.criteria).toHaveLength(2)
    expect(
      proposal.criteria.every((row) => row.templateId.startsWith('art-1-choreography-plan-')),
    ).toBe(true)
    expect(new Set(proposal.criteria.map((row) => row.description)).size).toBe(2)
    expect(proposal.criteria.map((row) => row.description).join(' ')).not.toMatch(
      /ejecuta|ejecución realizada/,
    )
  })
  it('la danza y el personaje representados exigen evidencia de interpretación', () => {
    for (const [id, pattern] of [
      ['adapted-dance-performance', /ejecuta|ejecución/],
      ['character-performance', /interpreta/],
    ] as const) {
      const proposal = recommend(
        {
          activityTitle: 'Actividad',
          description: contracts.cases.find((task) => task.id === id)!.description,
          preferredInstrumentType: 'rubrica',
          maxScore: 20,
          participationMode: 'INDIVIDUAL',
        },
        context,
        null,
        [],
        'UNMAPPED',
        null,
      )
      expect(proposal.criteria.some((row) => pattern.test(row.description.toLowerCase()))).toBe(
        true,
      )
    }
  })
  it('el dibujo con puntos y líneas no impone planos ausentes', () => {
    const proposal = recommend(
      {
        activityTitle: 'Actividad',
        description: contracts.cases.find(
          (task) => task.id === 'independent-creation-and-comparison',
        )!.description,
        preferredInstrumentType: 'rubrica',
        maxScore: 20,
        participationMode: 'INDIVIDUAL',
      },
      context,
      null,
      [],
      'UNMAPPED',
      null,
    )
    expect(
      JSON.stringify(
        proposal.criteria.filter((row) => row.templateId.startsWith('art-1-drawing-')),
      ),
    ).not.toMatch(/planos|volumen/)
  })
  it('la verificación de requisitos distingue puntos y líneas sin pedir calidad expresiva', () => {
    const proposal = recommend(
      {
        activityTitle: 'Actividad',
        description: contracts.cases.find((task) => task.id === 'drawing-requirements-only')!
          .description,
        preferredInstrumentType: 'lista-cotejo',
        maxScore: 20,
        participationMode: 'INDIVIDUAL',
      },
      context,
      null,
      [],
      'UNMAPPED',
      null,
    )
    expect(proposal.criteria).toHaveLength(2)
    expect(proposal.criteria.map((row) => row.title).join(' ')).toMatch(/puntos/)
    expect(proposal.criteria.map((row) => row.title).join(' ')).toMatch(/líneas/)
    expect(proposal.criteria.map((row) => row.description).join(' ')).not.toMatch(
      /explica|justifica|calidad expresiva/i,
    )
  })
  it('evalúa la intención comunicativa pedida sin duplicarla cuando ya está integrada', () => {
    const proposal = (id: string) =>
      recommend(
        {
          activityTitle: 'Actividad',
          description: contracts.cases.find((task) => task.id === id)!.description,
          preferredInstrumentType: 'rubrica',
          maxScore: 20,
          participationMode: 'INDIVIDUAL',
        },
        context,
        null,
        [],
        'UNMAPPED',
        null,
      )
    expect(
      proposal('two-dimensional-drawing').criteria.some((row) =>
        /mensaje|idea ficticia/.test(row.description),
      ),
    ).toBe(true)
    expect(
      proposal('graphic-design').criteria.filter((row) => /mensaje/.test(row.description)),
    ).toHaveLength(1)
  })
  for (const task of contracts.cases)
    for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const)
      for (const maxScore of [20, 17.35]) {
        it(`${task.id}/${instrumentType}/${maxScore}`, () => {
          const proposal = recommend(
            {
              activityTitle: 'Un título antiguo sobre células',
              description: task.description,
              preferredInstrumentType: instrumentType,
              maxScore,
              participationMode: 'INDIVIDUAL',
            },
            context,
            null,
            [],
            'UNMAPPED',
            null,
          )
          expect(proposal.criteria.length).toBeGreaterThan(0)
          expect(
            proposal.criteria.every((criterion) => criterion.templateId.startsWith('art-1-')),
          ).toBe(true)
          for (const topicId of task.topicIds) {
            const mode =
              'topicModes' in task
                ? (task.topicModes as Record<string, string>)[topicId]
                : task.purpose.toLowerCase()
            expect(
              proposal.criteria.some((criterion) =>
                criterion.templateId.startsWith(`art-1-${topicId}-${mode}-`),
              ),
            ).toBe(true)
          }
          expect(JSON.stringify(proposal.criteria)).not.toMatch(/células|titulo antiguo/i)
          if ('forbidden' in task)
            expect(
              proposal.criteria.map((criterion) => criterion.description).join(' '),
            ).not.toMatch(new RegExp(task.forbidden!, 'i'))
          expect(
            proposal.criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0),
          ).toBe(Math.round(maxScore * 100))
        })
      }
})
