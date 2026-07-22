import { ServiceUnavailableException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PlanningService } from './planning.service'
import { AttendanceService } from '../attendance/attendance.service'
import { __test__clearGradingCache, GradingService } from '../grading/grading.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    sectionSubject: {
      findFirst: vi.fn(),
    },
    grade: {
      findFirst: vi.fn(),
    },
    section: {
      findFirst: vi.fn(),
    },
    subject: {
      findFirst: vi.fn(),
    },
    academicPeriod: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    planningEntry: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    evaluationActivity: {
      count: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

const config = (values: Record<string, string | undefined>) => ({
  get: vi.fn((key: string) => values[key]),
})

const curriculumFields = {
  fundamentalCompetencies: ['Comunicativa'],
  specificCompetence: 'Competencia oficial extensa.',
  achievementIndicator: 'Indicador oficial.',
  contentConceptual: 'Contenido conceptual oficial.',
  contentProcedural: 'Contenido procedimental oficial.',
  contentAttitudinal: 'Contenido actitudinal oficial.',
}

function generatedDays(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    day: index + 1,
    date: null,
    inicio: `Inicio ${index + 1}.`,
    desarrollo: `Desarrollo ${index + 1}.`,
    cierre: `Cierre ${index + 1}.`,
    evidence: `Evidencia ${index + 1}.`,
    evaluationMethod: `Evaluación ${index + 1}.`,
  }))
}

describe('PlanningService.generateEntryDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearGradingCache()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('requires a DeepSeek API key', async () => {
    const service = new PlanningService(config({}) as never)

    await expect(service.generateEntryDraft('school-1', {})).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    )
  })

  it('generates a complete planning draft using school data', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-1',
      gradeId: 'grade-1',
      sectionId: 'section-1',
      subjectId: 'subject-1',
    })
    mocks.prisma.grade.findFirst.mockResolvedValue({ name: '4to' })
    mocks.prisma.section.findFirst.mockResolvedValue({ name: 'A' })
    mocks.prisma.subject.findFirst.mockResolvedValue({ name: 'Lengua Española' })

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: 'La entrevista',
                strategies: 'Situacion de aprendizaje y trabajo colaborativo.',
                activities: {
                  inicio: 'Exploran entrevistas conocidas.',
                  desarrollo: 'Preparan y realizan una entrevista.',
                  cierre: 'Socializan aprendizajes.',
                },
                resources: 'Cuaderno, pizarra y grabadora.',
                evaluationMethod: 'Observacion y retroalimentacion.',
                evidence: 'Guion y entrevista realizada.',
                evaluationInstruments: 'Lista de cotejo.',
                durationMinutes: 90,
              }),
            },
          },
        ],
      }),
    } as never)

    const result = await new PlanningService(
      config({ DEEPSEEK_API_KEY: 'test-key', DEEPSEEK_MODEL: 'test-model' }) as never,
    ).generateEntryDraft('school-1', {
      sectionSubjectId: 'ss-1',
      title: 'La entrevista',
      curricularPolicyContext: 'Ciudadanía digital y uso ético de la inteligencia artificial.',
    })

    expect(fetch).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      }),
    )
    const requestBody = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string)
    expect(requestBody).toMatchObject({
      model: 'test-model',
      thinking: { type: 'disabled' },
      response_format: { type: 'json_object' },
      max_tokens: 1500,
    })
    expect(requestBody.messages[1].content).toContain('Ciudadanía digital')
    expect(result.activities.desarrollo).toContain('entrevista')
    expect(result.durationMinutes).toBe(90)
  })

  it('retries once when DeepSeek returns empty JSON content', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ choices: [{ message: { content: '' } }] }),
      } as never)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                title: 'La entrevista',
                strategies: 'Trabajo colaborativo.',
                activities: { inicio: 'Exploran.', desarrollo: 'Entrevistan.', cierre: 'Reflexionan.' },
                resources: 'Cuaderno.',
                evaluationMethod: 'Observación.',
                evidence: 'Guion.',
                evaluationInstruments: 'Lista de cotejo.',
                durationMinutes: 45,
              }),
            },
          }],
        }),
      } as never)

    await new PlanningService(
      config({ DEEPSEEK_API_KEY: 'test-key' }) as never,
    ).generateEntryDraft('school-1', {})

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('generates and creates the planning entry in one server operation', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-1',
      gradeId: 'grade-1',
      sectionId: 'section-1',
      subjectId: 'subject-1',
      schoolYearId: 'year-1',
    })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      id: 'period-1',
      schoolYearId: 'year-1',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-30'),
    })
    mocks.prisma.grade.findFirst.mockResolvedValue({ name: '4to' })
    mocks.prisma.section.findFirst.mockResolvedValue({ name: 'A' })
    mocks.prisma.subject.findFirst.mockResolvedValue({ name: 'Lengua Española' })
    mocks.prisma.planningEntry.create.mockResolvedValue({ id: 'planning-1' })

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: 'La entrevista',
                strategies: 'Trabajo colaborativo.',
                activities: {
                  inicio: 'Conversan sobre entrevistas.',
                  desarrollo: 'Preparan el guion.',
                  cierre: 'Comparten hallazgos.',
                  days: generatedDays(5),
                },
                resources: 'Cuaderno y pizarra.',
                evaluationMethod: 'Observacion.',
                evidence: 'Guion.',
                evaluationInstruments: 'Lista de cotejo.',
                durationMinutes: 90,
              }),
            },
          },
        ],
      }),
    } as never)

    await new PlanningService(
      config({ DEEPSEEK_API_KEY: 'test-key', DEEPSEEK_MODEL: 'test-model' }) as never,
    ).generateAndCreateEntry('school-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      plannedDate: '2026-06-22',
      title: 'Título definido por el docente',
      durationMinutes: 45,
      planningType: 'SEQUENCE',
      durationDays: 5,
      ...curriculumFields,
    })

    expect(mocks.prisma.planningEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        schoolId: 'school-1',
        sectionSubjectId: 'ss-1',
        academicPeriodId: 'period-1',
        title: 'Título definido por el docente',
        planningType: 'SEQUENCE',
        durationDays: 5,
        sequence: 1,
        durationMinutes: 45,
        specificCompetence: 'Competencia oficial extensa.',
        achievementIndicator: 'Indicador oficial.',
        contentConceptual: 'Contenido conceptual oficial.',
        activities: expect.objectContaining({
          desarrollo: 'Preparan el guion.',
          days: expect.arrayContaining([
            expect.objectContaining({ day: 5, date: '2026-06-26' }),
          ]),
        }),
      }),
    })
  })

  it('does not save when AI detects a clear subject mismatch', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-1', gradeId: 'grade-1', sectionId: 'section-1', subjectId: 'subject-1', schoolYearId: 'year-1',
    })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      id: 'period-1', schoolYearId: 'year-1', startDate: new Date('2026-08-01'), endDate: new Date('2026-10-31'),
    })
    mocks.prisma.grade.findFirst.mockResolvedValue({ name: '1ro' })
    mocks.prisma.section.findFirst.mockResolvedValue({ name: 'A' })
    mocks.prisma.subject.findFirst.mockResolvedValue({ name: 'Lengua Española' })
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ choices: [{ message: { content: JSON.stringify({
        title: 'La materia', strategies: '',
        activities: { inicio: 'Exploran.', desarrollo: 'Clasifican.', cierre: 'Explican.' },
        resources: '', evaluationMethod: '', evidence: '', evaluationInstruments: '', durationMinutes: 45,
        alignmentWarning: 'El tema corresponde a Ciencias de la Naturaleza, no a Lengua Española.',
      }) } }] }),
    } as never)

    await expect(new PlanningService(
      config({ DEEPSEEK_API_KEY: 'test-key' }) as never,
    ).generateAndCreateEntry('school-1', {
      sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', title: 'La materia',
      ...curriculumFields,
    })).rejects.toThrow('Revisa la coherencia curricular')
    expect(mocks.prisma.planningEntry.create).not.toHaveBeenCalled()
  })

  it('rejects a period from a different school year', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      schoolYearId: 'year-2',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
    })

    await expect(new PlanningService(config({}) as never).createEntry('school-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      title: 'Planificación',
    })).rejects.toThrow('El curso y el período deben pertenecer al mismo año escolar.')
  })

  it('rejects a planned date outside its academic period', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      schoolYearId: 'year-1',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
    })

    await expect(new PlanningService(config({}) as never).createEntry('school-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      title: 'Planificación',
      plannedDate: '2026-11-01',
    })).rejects.toThrow('Todas las fechas de la planificación deben estar dentro del período académico.')
  })

  it('rejects a multi-day planning whose last weekday exceeds the period', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      schoolYearId: 'year-1',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
    })

    await expect(new PlanningService(config({}) as never).createEntry('school-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      title: 'Secuencia',
      plannedDate: '2026-10-30',
      planningType: 'SEQUENCE',
      durationDays: 2,
      activities: { inicio: '', desarrollo: '', cierre: '', days: generatedDays(2) },
      ...curriculumFields,
    })).rejects.toThrow('Todas las fechas de la planificación deben estar dentro del período académico.')
  })

  it('revalidates the academic period when updating a planning', async () => {
    mocks.prisma.planningEntry.findFirst.mockResolvedValue({
      id: 'planning-1',
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      plannedDate: new Date('2026-08-20'),
      planningType: 'DAILY',
      durationDays: 1,
      activities: { inicio: 'Inicio.', desarrollo: 'Desarrollo.', cierre: 'Cierre.' },
      ...curriculumFields,
    })
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      schoolYearId: 'year-1',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
    })

    await expect(new PlanningService(config({}) as never).updateEntry('school-1', 'planning-1', {
      plannedDate: '2026-11-01',
    })).rejects.toThrow('Todas las fechas de la planificación deben estar dentro del período académico.')
    expect(mocks.prisma.planningEntry.update).not.toHaveBeenCalled()
  })

  it('rejects linked activities from another course or period', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({
      schoolYearId: 'year-1',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-10-31'),
    })
    mocks.prisma.evaluationActivity.count.mockResolvedValue(1)

    await expect(new PlanningService(config({}) as never).createEntry('school-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      title: 'Planificación',
      linkedActivityIds: ['activity-1', 'activity-2'],
      ...curriculumFields,
    })).rejects.toThrow('Las actividades vinculadas deben pertenecer al mismo curso y período.')
  })

  it('rejects incomplete generated activities', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: 'La entrevista',
                strategies: 'Trabajo colaborativo.',
                activities: { inicio: '', desarrollo: 'Preparan el guion.', cierre: 'Comparten.' },
                resources: 'Cuaderno.',
                evaluationMethod: 'Observacion.',
                evidence: 'Guion.',
                evaluationInstruments: 'Lista de cotejo.',
                durationMinutes: 90,
              }),
            },
          },
        ],
      }),
    } as never)

    await expect(
      new PlanningService(
        config({ DEEPSEEK_API_KEY: 'test-key', DEEPSEEK_MODEL: 'test-model' }) as never,
      ).generateEntryDraft('school-1', {}),
    ).rejects.toThrow('La IA no generó la secuencia completa de actividades.')
  })

  it('invalidates grading and attendance options after changing a period', async () => {
    const period = {
      id: 'period-1',
      schoolId: 'school-1',
      schoolYearId: 'year-1',
      name: 'P1',
      sequence: 1,
      status: 'ACTIVE',
    }
    mocks.prisma.academicPeriod.findMany.mockResolvedValue([period])
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue(period)
    mocks.prisma.academicPeriod.update.mockResolvedValue({ ...period, name: 'Primer período' })
    const grading = new GradingService()
    const attendance = new AttendanceService()

    await grading.getAcademicPeriods('school-1')
    await attendance.getCurrentPeriod('school-1')
    await grading.getAcademicPeriods('school-1')
    await attendance.getCurrentPeriod('school-1')
    expect(mocks.prisma.academicPeriod.findMany).toHaveBeenCalledTimes(2)
    expect(mocks.prisma.academicPeriod.findFirst).toHaveBeenCalledTimes(2)

    await new PlanningService(config({}) as never).updateAcademicPeriod(
      'school-1',
      'period-1',
      { name: 'Primer período' },
    )
    await grading.getAcademicPeriods('school-1')
    await attendance.getCurrentPeriod('school-1')

    expect(mocks.prisma.academicPeriod.findMany).toHaveBeenCalledTimes(3)
    expect(mocks.prisma.academicPeriod.findFirst).toHaveBeenCalledTimes(4)
  })
})
