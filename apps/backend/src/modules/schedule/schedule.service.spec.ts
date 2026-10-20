import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __test__clearScheduleCache, ScheduleService } from './schedule.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    academicPeriod: { findFirst: vi.fn() },
    grade: { findMany: vi.fn() },
    schoolYear: { findFirst: vi.fn(), findMany: vi.fn() },
    scheduleJourney: { findFirst: vi.fn(), findMany: vi.fn() },
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


describe('ScheduleService pending entries', () => {
  const scope = { schoolId: 'school-1', ownerUserId: 'ana' }
  const pending = { id: 'entry-1', timeSlotId: 'old-slot', sectionId: 'section-1', sectionSubjectId: 'subject-1', schoolYearId: 'year-1', dayOfWeek: 1, status: 'ACTIVE', needsPlacement: true }
  beforeEach(() => {
    vi.resetAllMocks()
    __test__clearScheduleCache()
    for (const catalog of ['sectionSubject', 'subject', 'teacher', 'section', 'grade', 'timeSlot', 'scheduleJourney'] as const) mocks.prisma[catalog].findMany.mockResolvedValue([])
    mocks.prisma.schoolYear.findMany.mockResolvedValue([{ id: 'year-1', isCurrent: true }])
  })

  it('returns pending entries separately with historical hours, scoped to the current owner', async () => {
    mocks.prisma.scheduleEntry.findMany.mockImplementation(async ({ where, select }) => {
      if (select) return []
      return where.needsPlacement && where.timeSlot.ownerUserId === 'ana' ? [pending] : []
    })
    mocks.prisma.timeSlot.findMany.mockImplementation(async ({ where }) => where.id ? [{ id: 'old-slot', name: 'Periodo anterior', startTime: '07:30', endTime: '08:10', status: 'INACTIVE' }] : [])
    const service = new ScheduleService()
    const workspace = await service.getWorkspace(scope)
    expect(workspace.entries).toEqual([])
    expect(workspace).toMatchObject({ pendingEntries: [{ id: 'entry-1', startTime: '07:30', endTime: '08:10', needsPlacement: true }] })
    expect(await service.getWorkspace({ ...scope, ownerUserId: 'bea' })).toMatchObject({ pendingEntries: [] })
  })

  it('excludes pending assignments from regular lists', async () => {
    mocks.prisma.scheduleEntry.findMany.mockResolvedValue([])
    await new ScheduleService().findAll(scope)
    expect(mocks.prisma.scheduleEntry.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ needsPlacement: false }) }))
  })

  it('clears pending status when relocating to an active owned period', async () => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValueOnce(pending).mockResolvedValue(null)
    mocks.prisma.timeSlot.findFirst.mockResolvedValue({ id: 'new-slot', blockType: 'CLASS', dayOfWeek: 2, status: 'ACTIVE' })
    mocks.prisma.scheduleEntry.update.mockImplementation(async ({ data }) => ({ ...pending, ...data }))
    const result = await new ScheduleService().updateEntry(scope, pending.id, { timeSlotId: 'new-slot', dayOfWeek: 2 })
    expect(result).toMatchObject({ needsPlacement: false, timeSlotId: 'new-slot', dayOfWeek: 2 })
  })

  it('changes a class course and validates its assignment against the target section', async () => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValue(pending)
    mocks.prisma.section.findFirst.mockImplementation(async ({ where }) => where.schoolId === scope.schoolId && where.id === 'section-2' ? { id: 'section-2' } : null)
    mocks.prisma.sectionSubject.findFirst.mockImplementation(async ({ where }) => where.sectionId === 'section-2' ? { id: 'subject-2' } : null)
    mocks.prisma.scheduleEntry.update.mockImplementation(async ({ data }) => ({ ...pending, ...data }))
    expect(await new ScheduleService().updateEntry(scope, pending.id, { sectionId: 'section-2', sectionSubjectId: 'subject-2' })).toMatchObject({ sectionId: 'section-2', sectionSubjectId: 'subject-2' })
  })

  it('rejects a course from another school', async () => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValue(pending)
    mocks.prisma.section.findFirst.mockResolvedValue(null)
    await expect(new ScheduleService().updateEntry(scope, pending.id, { sectionId: 'foreign-section' })).rejects.toThrow('Section not found')
    expect(mocks.prisma.scheduleEntry.update).not.toHaveBeenCalled()
  })

  it('rejects changing only course when the existing assignment belongs to another course', async () => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValue(pending)
    mocks.prisma.section.findFirst.mockResolvedValue({ id: 'section-2' })
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue(null)
    await expect(new ScheduleService().updateEntry(scope, pending.id, { sectionId: 'section-2' })).rejects.toThrow('Section subject not found')
    expect(mocks.prisma.scheduleEntry.update).not.toHaveBeenCalled()
  })

  it('rejects a second class in the owners occupied period even for another course and teacher', async () => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValueOnce(pending).mockImplementation(async ({ where }) => !where.sectionId && !where.sectionSubjectId && where.needsPlacement === false ? { id: 'another-course-entry', sectionId: 'section-2' } : null)
    mocks.prisma.timeSlot.findFirst.mockResolvedValue({ id: 'new-slot', status: 'ACTIVE', blockType: 'CLASS', dayOfWeek: 1, startTime: '07:30', endTime: '08:10' })
    mocks.prisma.timeSlot.findMany.mockResolvedValue([{ id: 'new-slot' }])
    mocks.prisma.scheduleEntry.update.mockImplementation(async ({ data }) => ({ ...pending, ...data }))
    await expect(new ScheduleService().updateEntry(scope, pending.id, { timeSlotId: 'new-slot' })).rejects.toThrow('Ya existe una clase asignada')
    expect(mocks.prisma.scheduleEntry.update).not.toHaveBeenCalled()
  })

  it('groups pending assignments for review', async () => {
    const entry = { ...pending, section: { id: 'section-1', name: 'A', status: 'ACTIVE', grade: { name: 'Primero', status: 'ACTIVE' } }, sectionSubject: { status: 'ACTIVE', subject: { name: 'Matematica', status: 'ACTIVE' } } }
    mocks.prisma.scheduleEntry.findMany.mockResolvedValue([entry, { ...entry, id: 'entry-2' }])
    expect(await new ScheduleService().getIntegrityIssues(scope, 'year-1')).toMatchObject([{ code: 'NEEDS_PLACEMENT', entryIds: ['entry-1', 'entry-2'], affectedClasses: 2 }])
  })

  it('allows editing a pending room without placing it in its historical period', async () => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValue(pending)
    mocks.prisma.scheduleEntry.update.mockImplementation(async ({ data }) => ({ ...pending, ...data }))
    expect(await new ScheduleService().updateEntry(scope, pending.id, { room: 'Sala 2' })).toMatchObject({ needsPlacement: true, room: 'Sala 2' })
    expect(mocks.prisma.timeSlot.findFirst).not.toHaveBeenCalled()
  })

  it.each(['INACTIVE', 'ARCHIVED'])('rejects relocating pending entries to %s historical periods', async (status) => {
    mocks.prisma.scheduleEntry.findFirst.mockResolvedValue(pending)
    mocks.prisma.timeSlot.findFirst.mockResolvedValue({ id: 'old-slot', blockType: 'CLASS', dayOfWeek: 1, status })
    await expect(new ScheduleService().updateEntry(scope, pending.id, { timeSlotId: 'old-slot' })).rejects.toThrow('Time slot not found')
    expect(mocks.prisma.scheduleEntry.update).not.toHaveBeenCalled()
  })
})
