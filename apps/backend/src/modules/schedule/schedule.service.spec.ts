import { beforeEach, describe, expect, it, vi } from 'vitest'
import { __test__clearScheduleCache, ScheduleService } from './schedule.service'

const mocks = vi.hoisted(() => ({
  prisma: {
    academicPeriod: { findFirst: vi.fn() },
    grade: { findMany: vi.fn() },
    schoolYear: { findFirst: vi.fn() },
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
    const grades = deferred<Array<{ id: string; name: string }>>()
    mocks.prisma.section.findMany.mockReturnValue(sections.promise)
    mocks.prisma.grade.findMany.mockReturnValue(grades.promise)

    const request = new ScheduleService().getSections('school-1')
    await Promise.resolve()

    expect(mocks.prisma.section.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(1)

    sections.resolve([{ id: 'section-1', name: 'A', gradeId: 'grade-1' }])
    grades.resolve([{ id: 'grade-1', name: '1.º' }])
    await expect(request).resolves.toEqual([
      { id: 'section-1', name: 'A', gradeId: 'grade-1', gradeName: '1.º' },
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

    await service.getTimeSlots('school-1')
    await service.getTimeSlots('school-1')
    expect(mocks.prisma.timeSlot.findMany).toHaveBeenCalledTimes(2)

    await service.createTimeSlot('school-1', {
      name: 'Segunda hora',
      startTime: '08:45',
      endTime: '09:30',
    })
    const refreshed = await service.getTimeSlots('school-1')

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

    const request = new ScheduleService().createEntry('school-1', {
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
    const sectionSubjects = deferred<Array<{ id: string; subjectId: string; teacherId: string }>>()
    const subjects = deferred<Array<{ id: string; name: string }>>()
    const teachers = deferred<Array<{ id: string; firstName: string; lastName: string }>>()
    const sections = deferred<Array<{ id: string; gradeId: string; name: string }>>()
    const grades = deferred<Array<{ id: string; name: string }>>()
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

    const request = new ScheduleService().findEntries('school-1')
    await Promise.resolve()
    await Promise.resolve()

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.subject.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.teacher.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.section.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(1)
    expect(mocks.prisma.timeSlot.findMany).toHaveBeenCalledTimes(1)

    sectionSubjects.resolve([{ id: 'ss-1', subjectId: 'subject-1', teacherId: 'teacher-1' }])
    subjects.resolve([{ id: 'subject-1', name: 'Matemática' }])
    teachers.resolve([{ id: 'teacher-1', firstName: 'Ana', lastName: 'Pérez' }])
    sections.resolve([{ id: 'section-1', gradeId: 'grade-1', name: 'A' }])
    grades.resolve([{ id: 'grade-1', name: '1.º' }])
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
        teacherName: 'Ana Pérez',
        gradeName: '1.º',
        sectionName: 'A',
        timeSlotName: 'Primera hora',
      }),
    ])
  })
})
