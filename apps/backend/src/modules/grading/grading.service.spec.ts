import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __test__clearGradingCache, GradingService } from './grading.service'
import { recommend } from '../evaluation-instruments/recommendation-engine'

const mocks = vi.hoisted(() => ({
  prisma: {
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
    academicPeriod: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      createMany: vi.fn(),
    },
    schoolYear: {
      findFirst: vi.fn(),
    },
    sectionSubject: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    enrollment: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    gradesRecord: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    evaluationActivity: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    evaluationInstrument: { create: vi.fn() },
    evaluationInstrumentSnapshot: { create: vi.fn(), findUnique: vi.fn() },
    evaluationSnapshotSource: { createMany: vi.fn() },
    teacherInstrumentPreference: { upsert: vi.fn() },
    teacher: { findFirst: vi.fn() },
    courseTeam: { findMany: vi.fn() },
  },
}))

describe('GradingService activity teams', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects competency weights that do not add up to 100 percent', async () => {
    await expect(new GradingService().saveActivity('school-1', 'user-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      competencyBlockId: 'b1',
      competencyBlockWeights: { b1: 0.7, b2: 0.2 },
      name: 'Proyecto interdisciplinario',
      maxScore: 20,
    })).rejects.toThrow('100%')
    expect(mocks.prisma.sectionSubject.findFirst).not.toHaveBeenCalled()
  })

  it('rejects teams from outside the selected subject', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({ id: 'period-1', schoolYearId: 'year-1' })
    mocks.prisma.courseTeam.findMany.mockResolvedValue([])

    await expect(new GradingService().saveActivity('school-1', 'user-1', {
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      competencyBlockId: 'b1',
      name: 'Proyecto grupal',
      maxScore: 20,
      activityType: 'group',
      teamIds: ['team-other-subject'],
    })).rejects.toThrow('asignatura')
    expect(mocks.prisma.evaluationActivity.create).not.toHaveBeenCalled()
  })

  it('guarda el instrumento preparado dentro de una sola transacción y revierte si falla el snapshot', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1', gradeId: 'grade-1', subjectId: 'subject-1', teacherId: null })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({ id: 'period-1', schoolYearId: 'year-1' })
    mocks.prisma.teacher.findFirst.mockResolvedValue(null)
    const proposal = recommend({ activityTitle: 'Exposición sobre un tema', participationMode: 'INDIVIDUAL', maxScore: 20 }, null, null, [], 'NO_PUBLISHED_VERSION', null)
    mocks.prisma.$transaction.mockImplementation(async (callback: (tx: typeof mocks.prisma) => Promise<unknown>) => callback(mocks.prisma))
    mocks.prisma.evaluationInstrument.create.mockResolvedValue({ id: 'instrument-1' })
    mocks.prisma.evaluationInstrumentSnapshot.create.mockRejectedValue(new Error('snapshot write failed'))
    const instrumentCriteria: Record<string, string> = { [`${proposal.instrumentType}:meta:criteriaCount`]: String(proposal.criteria.length) }
    proposal.criteria.forEach((criterion, index) => {
      instrumentCriteria[`${proposal.instrumentType}:criterion:${index}`] = criterion.title
      instrumentCriteria[`${proposal.instrumentType}:points:${index}`] = String(criterion.maxScore)
      criterion.descriptors.forEach((descriptor, levelIndex) => {
        instrumentCriteria[`rubrica:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
      })
    })
    const dto = { sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', competencyBlockId: 'b1',
      name: 'Exposición sobre un tema', maxScore: 20, activityType: 'individual' as const,
      instrumentType: proposal.instrumentType, pedagogicalActivityType: proposal.activityType,
      instrumentCriteria, instrumentSnapshot: proposal }
    await expect(new GradingService().saveActivity('school-1', 'user-1', dto)).rejects.toThrow('snapshot write failed')
    expect(mocks.prisma.$transaction).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.evaluationInstrument.create).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.evaluationActivity.create).not.toHaveBeenCalled()
  })

  it('no permite al docente guardar un instrumento preparado en otra asignatura', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1', teacherId: 'teacher-other' })
    mocks.prisma.teacher.findFirst.mockResolvedValue(null)
    await expect(new GradingService().saveActivity('school-1', 'user-1', { sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1', competencyBlockId: 'b1', name: 'Actividad', maxScore: 20,
      instrumentSnapshot: {} as never }, ['teacher'])).rejects.toThrow('Asignatura no disponible')
    expect(mocks.prisma.evaluationInstrument.create).not.toHaveBeenCalled()
  })

  it('bloquea cambios estructurales después de guardar una versión', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({ id: 'period-1', schoolYearId: 'year-1' })
    mocks.prisma.evaluationActivity.findFirst.mockResolvedValue({ id: 'activity-1', instrumentSnapshotId: 'snapshot-1' })
    mocks.prisma.gradesRecord.count.mockResolvedValue(0)
    await expect(new GradingService().saveActivity('school-1', 'user-1', { id: 'activity-1', sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1', competencyBlockId: 'b1', name: 'Cambio', maxScore: 20 })).rejects.toThrow('versionado')
    expect(mocks.prisma.evaluationInstrument.create).not.toHaveBeenCalled()
  })

  it('bloquea cambios estructurales de actividades legacy tras iniciar calificaciones', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({ id: 'period-1', schoolYearId: 'year-1' })
    mocks.prisma.evaluationActivity.findFirst.mockResolvedValue({ id: 'activity-legacy', instrumentSnapshotId: null })
    mocks.prisma.gradesRecord.count.mockResolvedValue(1)
    await expect(new GradingService().saveActivity('school-1', 'user-1', { id: 'activity-legacy', sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1', competencyBlockId: 'b1', name: 'Cambio', maxScore: 20 })).rejects.toThrow('ya tiene calificaciones')
    expect(mocks.prisma.evaluationActivity.update).not.toHaveBeenCalled()
  })
})

describe('GradingService instrument evidence', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects criterion totals that do not match the saved grade', async () => {
    await expect(new GradingService().saveGrade('school-1', {
      score: 18,
      instrumentResult: {
        instrumentType: 'rubrica',
        selections: [0, 1],
        criterionScores: [10, 5],
        completedAt: '2026-09-01T12:00:00.000Z',
      },
    })).rejects.toThrow('no coincide')
  })

  it('rejects incomplete criterion selections', async () => {
    await expect(new GradingService().saveGrade('school-1', {
      score: 15,
      instrumentResult: {
        instrumentType: 'lista-cotejo',
        selections: [0, null],
        criterionScores: [15, 0],
        completedAt: '2026-09-01T12:00:00.000Z',
      },
    })).rejects.toThrow('no es valido')
  })

  it('vincula cada resultado a la versión y conserva el texto histórico por criterio', async () => {
    mocks.prisma.gradesRecord.findFirst.mockResolvedValue({ id: 'grade-1', schoolId: 'school-1',
      sectionSubjectId: 'ss-1', academicPeriodId: 'period-1', evaluationActivityId: 'activity-1' })
    mocks.prisma.evaluationActivity.findFirst.mockResolvedValue({ id: 'activity-1', sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1', maxScore: 20, instrumentSnapshotId: 'snapshot-1' })
    mocks.prisma.evaluationInstrumentSnapshot.findUnique.mockResolvedValue({ id: 'snapshot-1', versionNo: 1,
      payload: { criteria: [{ id: 'c1', title: 'Procedimiento', description: 'Sigue los pasos', maxScoreUnits: 1200,
        descriptors: [{ text: 'Lo logra', scoreUnits: 1200 }, { text: 'En proceso', scoreUnits: 600 }] },
      { id: 'c2', title: 'Comunicación', description: 'Explica datos', maxScoreUnits: 800,
        descriptors: [{ text: 'Lo logra', scoreUnits: 800 }, { text: 'En proceso', scoreUnits: 400 }] }] } })
    mocks.prisma.gradesRecord.update.mockImplementation(async ({ data }) => ({ id: 'grade-1', enrollmentId: 'enrollment-1',
      score: data.score, maxScore: data.maxScore, weight: 1, assessmentName: 'Actividad', status: 'DRAFT',
      evaluationActivityId: 'activity-1', ...data }))
    const saved = await new GradingService().saveGrade('school-1', { gradeId: 'grade-1', score: 15,
      instrumentResult: { instrumentType: 'rubrica', selections: [0, 1], criterionScores: [10, 5],
        completedAt: '2026-09-27T12:00:00.000Z' } })
    expect(saved.instrumentSnapshotId).toBe('snapshot-1')
    expect(saved.instrumentResult.criterionSnapshots[0].title).toBe('Procedimiento')
    expect(saved.instrumentResult.criterionSnapshots[1].selectedDescriptor.text).toBe('En proceso')
  })
})

describe('GradingService activity grade persistence', () => {
  beforeEach(() => vi.clearAllMocks())

  function mockValidContext(maxScore = 20) {
    mocks.prisma.enrollment.findMany.mockResolvedValue([])
    mocks.prisma.enrollment.findFirst.mockResolvedValue({
      id: 'enrollment-1',
      sectionId: 'section-1',
      schoolYearId: 'year-1',
    })
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-1',
      sectionId: 'section-1',
      schoolYearId: 'year-1',
    })
    mocks.prisma.academicPeriod.findFirst.mockResolvedValue({ id: 'period-1', schoolYearId: 'year-1' })
    mocks.prisma.evaluationActivity.findFirst.mockResolvedValue({
      id: 'activity-1',
      schoolId: 'school-1',
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      maxScore,
      status: 'ACTIVE',
    })
  }

  it('rechaza una nota superior al máximo almacenado de la actividad', async () => {
    mockValidContext(20)

    await expect(new GradingService().saveGrade('school-1', {
      enrollmentId: 'enrollment-1',
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      evaluationActivityId: 'activity-1',
      score: 21,
    })).rejects.toThrow('no puede superar 20')
    expect(mocks.prisma.$queryRaw).not.toHaveBeenCalled()
  })

  it('impide eliminar una actividad que ya tiene calificaciones', async () => {
    mocks.prisma.evaluationActivity.findFirst.mockResolvedValue({ id: 'activity-1' })
    mocks.prisma.gradesRecord.count.mockResolvedValue(2)

    await expect(new GradingService().deleteActivity('school-1', 'activity-1')).rejects.toThrow(
      'tiene calificaciones registradas',
    )
    expect(mocks.prisma.evaluationActivity.update).not.toHaveBeenCalled()
  })

  it('acepta cero como nota real y usa el guardado idempotente de la actividad', async () => {
    mockValidContext(20)
    mocks.prisma.$queryRaw.mockResolvedValue([{
      id: 'grade-1',
      enrollmentId: 'enrollment-1',
      score: 0,
      maxScore: 20,
      weight: 1,
      assessmentName: 'Diagnóstico inicial',
      status: 'DRAFT',
      evaluationActivityId: 'activity-1',
      instrumentResult: null,
    }])

    const saved = await new GradingService().saveGrade('school-1', {
      enrollmentId: 'enrollment-1',
      sectionSubjectId: 'ss-1',
      academicPeriodId: 'period-1',
      evaluationActivityId: 'activity-1',
      assessmentName: 'Diagnóstico inicial',
      score: 0,
    })

    expect(saved.score).toBe(0)
    expect(saved.maxScore).toBe(20)
    expect(mocks.prisma.$queryRaw).toHaveBeenCalledOnce()
  })
})

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

describe('GradingService.getAcademicPeriods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearGradingCache()
  })

  it('creates the four base grading periods when none exist', async () => {
    const createdPeriods = [
      { id: 'p1', name: 'P1 — Agosto, septiembre y octubre', sequence: 1 },
      { id: 'p2', name: 'P2 — Noviembre, diciembre y enero', sequence: 2 },
      { id: 'p3', name: 'P3 — Febrero, marzo y abril', sequence: 3 },
      { id: 'p4', name: 'P4 — Mayo', sequence: 4 },
    ]
    mocks.prisma.academicPeriod.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(createdPeriods)
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({
      id: 'year-1',
      startDate: new Date('2026-08-01T00:00:00.000Z'),
    })

    const result = await new GradingService().getAcademicPeriods('school-1')

    expect(mocks.prisma.academicPeriod.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          schoolId: 'school-1',
          schoolYearId: 'year-1',
          name: 'P1 — Agosto, septiembre y octubre',
          sequence: 1,
        }),
        expect.objectContaining({
          name: 'P4 — Mayo',
          sequence: 4,
        }),
      ]),
      skipDuplicates: true,
    })
    expect(result).toEqual(createdPeriods)
  })
})

describe('GradingService optimized workspaces', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearGradingCache()
  })

  it('loads section subjects with their relations in a single query', async () => {
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'ss-1',
        sectionId: 'section-1',
        schoolYearId: 'year-1',
        subject: { name: 'Matemática' },
        section: { name: 'A' },
        grade: {
          name: '1.º',
          sequence: 1,
          level: 'Primario',
          academicLevel: { name: 'Nivel Primario', sequence: 1 },
        },
        schoolYear: { name: '2026-2027' },
      },
    ])

    const result = await new GradingService().getSectionSubjects('school-1')

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
      expect.objectContaining({
        id: 'ss-1',
        subjectName: 'Matemática',
        sectionName: 'A',
        gradeName: '1.º',
        academicLevelName: 'Nivel Primario',
      }),
    ])
  })

  it('deduplicates section-subject option loads per school', async () => {
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([])
    const service = new GradingService()

    await Promise.all([
      service.getSectionSubjects('school-1'),
      service.getSectionSubjects('school-1'),
    ])
    await service.getSectionSubjects('school-2')

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(2)
    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { schoolId: 'school-1', status: 'ACTIVE' } }),
    )
    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { schoolId: 'school-2', status: 'ACTIVE' } }),
    )
  })

  it('returns options, students, records and activities in one workspace', async () => {
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'ss-1',
        sectionId: 'section-1',
        schoolYearId: 'year-1',
        subject: { name: 'Matemática' },
        section: { name: 'A' },
        grade: { name: '1.º', sequence: 1, level: 'Primario', academicLevel: null },
        schoolYear: { name: '2026-2027' },
      },
    ])
    mocks.prisma.academicPeriod.findMany.mockResolvedValue([
      { id: 'period-1', schoolYearId: 'year-1', name: 'P1', sequence: 1 },
    ])
    mocks.prisma.enrollment.findMany.mockResolvedValue([
      {
        id: 'enrollment-1',
        studentId: 'student-1',
        listNumber: 1,
        student: { studentCode: '001', firstName: 'Ana', lastName: 'Pérez' },
      },
    ])
    mocks.prisma.gradesRecord.findMany.mockResolvedValue([])
    mocks.prisma.evaluationActivity.findMany.mockResolvedValue([])

    const result = await new GradingService().getWorkspace('school-1')

    expect(result.selectedSectionSubjectId).toBe('ss-1')
    expect(result.selectedAcademicPeriodId).toBe('period-1')
    expect(result.students).toEqual([
      expect.objectContaining({ firstName: 'Ana', lastName: 'Pérez', listNumber: 1 }),
    ])
    expect(mocks.prisma.enrollment.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.gradesRecord.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.evaluationActivity.findMany).toHaveBeenCalledTimes(1)
  })

  it('groups annual records and activities without per-period queries', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolYearId: 'year-1' })
    mocks.prisma.academicPeriod.findMany.mockResolvedValue([
      { id: 'period-1', sequence: 1, name: 'P1' },
      { id: 'period-2', sequence: 2, name: 'P2' },
    ])
    mocks.prisma.gradesRecord.findMany.mockResolvedValue([
      {
        id: 'grade-1',
        enrollmentId: 'enrollment-1',
        academicPeriodId: 'period-1',
        score: 18,
        maxScore: 20,
        weight: 1,
        assessmentName: 'Actividad',
        status: 'DRAFT',
        evaluationActivityId: null,
      },
    ])
    mocks.prisma.evaluationActivity.findMany.mockResolvedValue([])

    const result = await new GradingService().getAnnualWorkspace('school-1', 'ss-1')

    expect(result).toHaveLength(2)
    expect(result[0].gradeRecords).toEqual([
      expect.objectContaining({ id: 'grade-1', score: 18, status: 'draft' }),
    ])
    expect(result[1].gradeRecords).toEqual([])
    expect(mocks.prisma.gradesRecord.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.evaluationActivity.findMany).toHaveBeenCalledTimes(1)
  })
})
