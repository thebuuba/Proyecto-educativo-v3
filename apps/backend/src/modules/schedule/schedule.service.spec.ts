import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __test__clearScheduleCache, ScheduleService } from './schedule.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    academicPeriod: { findFirst: vi.fn() },
    grade: { findMany: vi.fn() },
    schoolYear: { findFirst: vi.fn() },
    scheduleJourney: { findFirst: vi.fn() },
    scheduleEntry: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    section: { findMany: vi.fn(), findFirst: vi.fn() },
    sectionSubject: { findMany: vi.fn(), findFirst: vi.fn() },
    subject: { findMany: vi.fn() },
    teacher: { findMany: vi.fn() },
    timeSlot: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
}))

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('ScheduleService option caching', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearScheduleCache()
  })

  it('loads independent section options in parallel', async () => {
    const sections = deferred<Array<{ id: string; name: string; gradeId: string }>>()
    const grades = deferred<Array<{ id: string; name: string; level: string }>>()
    mocks.prisma.section.findMany.mockReturnValue(sections.promise)
    mocks.prisma.grade.findMany.mockReturnValue(grades.promise)

    const request = new ScheduleService().getSections('school-1')
    await Promise.resolve()

    expect(mocks.prisma.section.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(1)

    sections.resolve([{ id: 'section-1', name: 'A', gradeId: 'grade-1' }])
    grades.resolve([{ id: 'grade-1', name: '1.º', level: 'Secundario' }])
    await expect(request).resolves.toEqual([
      { id: 'section-1', name: 'A', gradeId: 'grade-1', gradeName: '1.º', academicLevelName: 'Secundario' },
    ])
  })

  it('deduplicates option loads per school and keeps tenants isolated', async () => {
    mocks.prisma.teacher.findMany.mockResolvedValue([])
    const service = new ScheduleService()

    await Promise.all([
      service.getTeachers('school-1'),
      service.getTeachers('school-1'),
    ])
    await service.getTeachers('school-2')

    expect(mocks.prisma.teacher.findMany).toHaveBeenCalledTimes(2)
    expect(mocks.prisma.teacher.findMany).toHaveBeenNthCalledWith(1, {
      where: { schoolId: 'school-1', status: 'ACTIVE' },
    })
    expect(mocks.prisma.teacher.findMany).toHaveBeenNthCalledWith(2, {
      where: { schoolId: 'school-2', status: 'ACTIVE' },
    })
  })

  it('invalidates time-slot options after a successful mutation', async () => {
    const original = {
      id: 'slot-1',
      name: 'Primera hora',
      status: 'ACTIVE',
      startTime: new Date('1970-01-01T08:00:00.000Z'),
      endTime: new Date('1970-01-01T08:45:00.000Z'),
    }
    const created = {
      ...original,
      id: 'slot-2',
      name: 'Segunda hora',
    }
    mocks.prisma.timeSlot.findMany
      .mockResolvedValueOnce([original])
      .mockResolvedValueOnce([original])
      .mockResolvedValueOnce([original, created])
    mocks.prisma.timeSlot.create.mockResolvedValue(created)
    const service = new ScheduleService()

    await service.getTimeSlots({ schoolId: 'school-1', ownerUserId: 'user-1' })
    await service.getTimeSlots({ schoolId: 'school-1', ownerUserId: 'user-1' })
    expect(mocks.prisma.timeSlot.findMany).toHaveBeenCalledTimes(2)

    await service.createTimeSlot({ schoolId: 'school-1', ownerUserId: 'user-1' }, {
      name: 'Segunda hora',
      startTime: '08:45',
      endTime: '09:30',
    })
    const refreshed = await service.getTimeSlots({ schoolId: 'school-1', ownerUserId: 'user-1' })

    expect(mocks.prisma.timeSlot.findMany).toHaveBeenCalledTimes(3)
    expect(refreshed).toHaveLength(2)
  })
})

describe('ScheduleService parallel queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearScheduleCache()
  })

  it('starts all independent create-entry validations together', async () => {
    const schoolYear = deferred<null>()
    const section = deferred<{ id: string }>()
    const sectionSubject = deferred<{ id: string }>()
    const timeSlot = deferred<{ id: string }>()
    const academicPeriod = deferred<{ id: string }>()
    mocks.prisma.schoolYear.findFirst.mockReturnValue(schoolYear.promise)
    mocks.prisma.section.findFirst.mockReturnValue(section.promise)
    mocks.prisma.sectionSubject.findFirst.mockReturnValue(sectionSubject.promise)
    mocks.prisma.timeSlot.findFirst.mockReturnValue(timeSlot.promise)
    mocks.prisma.academicPeriod.findFirst.mockReturnValue(academicPeriod.promise)

    const request = new ScheduleService().createEntry({ schoolId: 'school-1', ownerUserId: 'user-1' }, {
      schoolYearId: 'year-1',
      sectionId: 'section-1',
      sectionSubjectId: 'subject-1',
      timeSlotId: 'slot-1',
      academicPeriodId: 'period-1',
      dayOfWeek: 1,
    })

    expect(mocks.prisma.schoolYear.findFirst).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.section.findFirst).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.sectionSubject.findFirst).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.timeSlot.findFirst).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.academicPeriod.findFirst).toHaveBeenCalledTimes(1)

    schoolYear.resolve(null)
    section.resolve({ id: 'section-1' })
    sectionSubject.resolve({ id: 'subject-1' })
    timeSlot.resolve({ id: 'slot-1' })
    academicPeriod.resolve({ id: 'period-1' })
    await expect(request).rejects.toThrow('School year not found')
  })

  it('loads all entry label catalogs in parallel', async () => {
    const sectionSubjects = deferred<Array<{ id: string; subjectId: string; teacherId: string; appearanceColor: string }>>()
    const subjects = deferred<Array<{ id: string; name: string }>>()
    const teachers = deferred<Array<{ id: string; firstName: string; lastName: string }>>()
    const sections = deferred<Array<{ id: string; gradeId: string; name: string }>>()
    const grades = deferred<Array<{ id: string; name: string; level: string }>>()
    const slots = deferred<Array<{ id: string; name: string; startTime: Date; endTime: Date }>>()
    mocks.prisma.scheduleEntry.findMany.mockResolvedValue([
      {
        id: 'entry-1',
        sectionSubjectId: 'ss-1',
        sectionId: 'section-1',
        timeSlotId: 'slot-1',
        status: 'ACTIVE',
      },
    ])
    mocks.prisma.sectionSubject.findMany.mockReturnValue(sectionSubjects.promise)
    mocks.prisma.subject.findMany.mockReturnValue(subjects.promise)
    mocks.prisma.teacher.findMany.mockReturnValue(teachers.promise)
    mocks.prisma.section.findMany.mockReturnValue(sections.promise)
    mocks.prisma.grade.findMany.mockReturnValue(grades.promise)
    mocks.prisma.timeSlot.findMany.mockReturnValue(slots.promise)

    const request = new ScheduleService().findEntries({ schoolId: 'school-1', ownerUserId: 'user-1' })
    await Promise.resolve()
    await Promise.resolve()

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.subject.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.teacher.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.section.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.timeSlot.findMany).toHaveBeenCalledTimes(1)

    sectionSubjects.resolve([{ id: 'ss-1', subjectId: 'subject-1', teacherId: 'teacher-1', appearanceColor: '#10B981' }])
    subjects.resolve([{ id: 'subject-1', name: 'Matemática' }])
    teachers.resolve([{ id: 'teacher-1', firstName: 'Ana', lastName: 'Pérez' }])
    sections.resolve([{ id: 'section-1', gradeId: 'grade-1', name: 'A' }])
    grades.resolve([{ id: 'grade-1', name: '1.º', level: 'Secundario' }])
    slots.resolve([{
      id: 'slot-1',
      name: 'Primera hora',
      startTime: new Date('1970-01-01T08:00:00.000Z'),
      endTime: new Date('1970-01-01T08:45:00.000Z'),
    }])

    await expect(request).resolves.toEqual([
      expect.objectContaining({
        id: 'entry-1',
        subjectName: 'Matemática',
        appearanceColor: '#10B981',
        teacherName: 'Ana Pérez',
        gradeName: '1.º',
        academicLevelName: 'Secundario',
        sectionName: 'A',
        timeSlotName: 'Primera hora',
      }),
    ])
  })
})

describe('ScheduleService integrity issues', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearScheduleCache()
  })

  it('groups schedule blocks affected by an archived subject assignment', async () => {
    mocks.prisma.scheduleEntry.findMany.mockResolvedValue([
      {
        id: 'entry-1',
        sectionSubjectId: 'assignment-1',
        section: {
          id: 'section-1', name: 'A', status: 'ACTIVE',
          grade: { id: 'grade-1', name: '4.º', status: 'ACTIVE' },
        },
        sectionSubject: {
          status: 'INACTIVE',
          subject: { id: 'subject-1', name: 'Matemática', status: 'ACTIVE' },
        },
      },
      {
        id: 'entry-2',
        sectionSubjectId: 'assignment-1',
        section: {
          id: 'section-1', name: 'A', status: 'ACTIVE',
          grade: { id: 'grade-1', name: '4.º', status: 'ACTIVE' },
        },
        sectionSubject: {
          status: 'INACTIVE',
          subject: { id: 'subject-1', name: 'Matemática', status: 'ACTIVE' },
        },
      },
    ])

    await expect(new ScheduleService().getIntegrityIssues({ schoolId: 'school-1', ownerUserId: 'user-1' }, 'year-1')).resolves.toEqual([
      {
        code: 'SUBJECT_ASSIGNMENT_ARCHIVED',
        entryIds: ['entry-1', 'entry-2'],
        affectedClasses: 2,
        gradeName: '4.º',
        sectionName: 'A',
        subjectName: 'Matemática',
        message: 'Matemática ya no está asignada a 4.º A.',
      },
    ])
  })
})

describe('ScheduleService personal ownership', () => {
  const ana = { schoolId: 'school-1', ownerUserId: 'ana' }
  const bea = { schoolId: 'school-1', ownerUserId: 'bea' }

  beforeEach(() => {
    vi.resetAllMocks()
    __test__clearScheduleCache()
  })

  it('loads separate blocks for two teachers in the same school', async () => {
    mocks.prisma.timeSlot.findMany.mockImplementation(async ({ where }) => [{
      id: where.ownerUserId === 'ana' ? 'ana-slot' : 'bea-slot',
      status: 'ACTIVE', startTime: '08:00', endTime: '08:45',
    }])
    const service = new ScheduleService()
    const [anaSlots, beaSlots] = await Promise.all([
      service.getTimeSlots(ana), service.getTimeSlots(bea),
    ])
    expect(anaSlots[0].id).toBe('ana-slot')
    expect(beaSlots[0].id).toBe('bea-slot')
  })

  it('always scopes entries to the current owner even with teacher filters', async () => {
    mocks.prisma.scheduleEntry.findMany.mockResolvedValue([])
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([{ id: 'subject-1' }])
    await new ScheduleService().findEntries(ana, undefined, undefined, undefined, 'other-teacher')
    expect(mocks.prisma.scheduleEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ schoolId: 'school-1', timeSlot: { ownerUserId: 'ana' } }),
    }))
  })

  it.each(['updateTimeSlot', 'deleteTimeSlot'] as const)('cannot %s another teacher block', async (method) => {
    mocks.prisma.timeSlot.findFirst.mockImplementation(async ({ where }) =>
      where.ownerUserId === 'ana' ? null : { id: 'bea-slot' })
    await expect(new ScheduleService()[method](ana, 'bea-slot', {})).rejects.toThrow('Time slot not found')
    expect(mocks.prisma.timeSlot.update).not.toHaveBeenCalled()
    expect(mocks.prisma.timeSlot.delete).not.toHaveBeenCalled()
  })

  it.each(['updateEntry', 'deleteEntry'] as const)('cannot %s another teacher assignment', async (method) => {
    mocks.prisma.scheduleEntry.findFirst.mockImplementation(async ({ where }) =>
      where.timeSlot?.ownerUserId === 'ana' ? null : { id: 'bea-entry' })
    await expect(new ScheduleService()[method](ana, 'bea-entry', {})).rejects.toThrow('Schedule entry not found')
    expect(mocks.prisma.scheduleEntry.update).not.toHaveBeenCalled()
    expect(mocks.prisma.scheduleEntry.delete).not.toHaveBeenCalled()
  })

  it('does not link a new block to another teacher journey', async () => {
    mocks.prisma.scheduleJourney.findFirst.mockResolvedValue(null)
    await expect(new ScheduleService().createTimeSlot(ana, {
      name: 'Clase', startTime: '08:00', endTime: '08:45', journeyId: 'bea-journey',
    })).rejects.toThrow('Schedule journey not found')
    expect(mocks.prisma.timeSlot.create).not.toHaveBeenCalled()
  })

  it('does not assign a class to another teacher block', async () => {
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1' })
    mocks.prisma.section.findFirst.mockResolvedValue({ id: 'section-1' })
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'subject-1' })
    mocks.prisma.timeSlot.findFirst.mockResolvedValue(null)
    await expect(new ScheduleService().createEntry(ana, {
      schoolYearId: 'year-1', sectionId: 'section-1', sectionSubjectId: 'subject-1',
      timeSlotId: 'bea-slot', dayOfWeek: 1,
    })).rejects.toThrow('Time slot not found')
    expect(mocks.prisma.timeSlot.findFirst).toHaveBeenCalledWith({
      where: { id: 'bea-slot', schoolId: 'school-1', ownerUserId: 'ana' },
    })
    expect(mocks.prisma.scheduleEntry.create).not.toHaveBeenCalled()
  })
})
