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
    },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

const config = (values: Record<string, string | undefined>) => ({
  get: vi.fn((key: string) => values[key]),
})

describe('PlanningService.generateEntryDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearGradingCache()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('requires an OpenAI API key', async () => {
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
                specificCompetence: 'Produce entrevistas orales y escritas.',
                achievementIndicator: 'Realiza preguntas pertinentes.',
                contentConceptual: 'La entrevista y sus partes.',
                contentProcedural: 'Redaccion de preguntas.',
                contentAttitudinal: 'Respeto al escuchar.',
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
      config({ OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'test-model' }) as never,
    ).generateEntryDraft('school-1', {
      sectionSubjectId: 'ss-1',
      title: 'La entrevista',
    })

    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      }),
    )
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string)).toMatchObject({
      model: 'test-model',
    })
    expect(result.activities.desarrollo).toContain('entrevista')
    expect(result.durationMinutes).toBe(90)
  })

  it('generates and creates the planning entry in one server operation', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-1',
      gradeId: 'grade-1',
      sectionId: 'section-1',
      subjectId: 'subject-1',
    })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({ id: 'period-1' })
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
                specificCompetence: 'Produce entrevistas.',
                achievementIndicator: 'Formula preguntas pertinentes.',
                contentConceptual: 'La entrevista.',
                contentProcedural: 'Elaboracion de guion.',
                contentAttitudinal: 'Escucha respetuosa.',
                strategies: 'Trabajo colaborativo.',
                activities: {
                  inicio: 'Conversan sobre entrevistas.',
                  desarrollo: 'Preparan el guion.',
                  cierre: 'Comparten hallazgos.',
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
      config({ OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'test-model' }) as never,
    ).generateAndCreateEntry('school-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      plannedDate: '2026-06-25',
    })

    expect(mocks.prisma.planningEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        schoolId: 'school-1',
        sectionSubjectId: 'ss-1',
        academicPeriodId: 'period-1',
        title: 'La entrevista',
        activities: expect.objectContaining({ desarrollo: 'Preparan el guion.' }),
      }),
    })
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
                specificCompetence: 'Produce entrevistas.',
                achievementIndicator: 'Formula preguntas pertinentes.',
                contentConceptual: 'La entrevista.',
                contentProcedural: 'Elaboracion de guion.',
                contentAttitudinal: 'Escucha respetuosa.',
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
        config({ OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'test-model' }) as never,
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
