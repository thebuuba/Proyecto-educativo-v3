import { beforeEach, describe, expect, it, vi } from 'vitest'
import { optionCache, optionCacheKeys } from '../../common/cache/option-cache'
import { __test__clearCoursesCache, CoursesService } from './courses.service'
import { GradingService } from '../grading/grading.service'
import { ScheduleService } from '../schedule/schedule.service'
import { Reflector } from '@nestjs/core'
import type { ExecutionContext } from '@nestjs/common'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CoursesController } from './courses.controller'

const mocks = vi.hoisted(() => ({
  prisma: {
    grade: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), upsert: vi.fn() },
    section: { findMany: vi.fn(), findFirst: vi.fn(), upsert: vi.fn() },
    sectionSubject: { findMany: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
    enrollment: { groupBy: vi.fn() },
    courseTeam: { groupBy: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), count: vi.fn(), create: vi.fn() },
    courseTeamMember: { updateMany: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn() },
    evaluationActivity: { groupBy: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    evaluationActivityGroup: { findMany: vi.fn(), deleteMany: vi.fn() },
    evaluationActivityGroupMember: { deleteMany: vi.fn() },
    evaluationActivityEvidence: { deleteMany: vi.fn() },
    pedagogicalRecovery: { deleteMany: vi.fn() },
    attendanceClass: { findMany: vi.fn(), deleteMany: vi.fn() },
    gradesRecord: { groupBy: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    planningEntry: { findMany: vi.fn(), deleteMany: vi.fn() },
    scheduleEntry: { deleteMany: vi.fn() },
    subjectResource: { count: vi.fn(), deleteMany: vi.fn() },
    teacherJournalEntry: { deleteMany: vi.fn() },
    evaluationActivityResource: { count: vi.fn() },
    subject: { findMany: vi.fn(), findFirst: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
    drAcademicLevel: { findMany: vi.fn() },
    drAcademicCycle: { findMany: vi.fn() },
    drModality: { findMany: vi.fn() },
    teacher: { findMany: vi.fn(), findFirst: vi.fn() },
    schoolYear: { findFirst: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@aula/database', () => ({
  prisma: mocks.prisma,
  RecordStatus: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  },
}))

describe('CoursesService.getCourseData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.prisma.$transaction.mockImplementation(async (callback: (tx: typeof mocks.prisma) => Promise<unknown>) => callback(mocks.prisma))
    mocks.prisma.subjectResource.count.mockResolvedValue(0)
    mocks.prisma.evaluationActivityResource.count.mockResolvedValue(0)
    mocks.prisma.evaluationActivity.findMany.mockResolvedValue([])
    mocks.prisma.gradesRecord.findMany.mockResolvedValue([])
    mocks.prisma.courseTeam.findMany.mockResolvedValue([])
    mocks.prisma.sectionSubject.deleteMany.mockResolvedValue({ count: 1 })
    __test__clearCoursesCache()
    mocks.prisma.grade.findMany.mockResolvedValue([
      {
        id: 'grade-1',
        name: '1ro',
        level: null,
        academicLevelId: 'level-1',
        academicCycleId: 'cycle-1',
        defaultModalityId: 'mod-1',
        sequence: 1,
        status: 'ACTIVE',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ])
    mocks.prisma.section.findMany.mockResolvedValue([
      {
        id: 'section-1',
        gradeId: 'grade-1',
        name: 'A',
        capacity: 30,
        status: 'ACTIVE',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ])
    mocks.prisma.sectionSubject.findMany.mockResolvedValue([
      {
        id: 'ss-1',
        sectionId: 'section-1',
        gradeId: 'grade-1',
        subjectId: 'subject-1',
        teacherId: 'teacher-1',
        appearanceColor: '#7C3AED',
        appearanceIcon: 'calculator',
        status: 'ACTIVE',
        _count: { attendanceClasses: 0, gradesRecords: 1, evaluationActivities: 3, courseTeams: 2, scheduleEntries: 0, planningEntries: 1 },
      },
      {
        id: 'ss-archived',
        sectionId: 'section-1',
        gradeId: 'grade-1',
        subjectId: 'subject-2',
        teacherId: null,
        appearanceColor: null,
        appearanceIcon: null,
        status: 'INACTIVE',
        _count: { attendanceClasses: 0, gradesRecords: 0, evaluationActivities: 0, courseTeams: 0, scheduleEntries: 0, planningEntries: 0 },
      },
    ])
    mocks.prisma.enrollment.groupBy.mockResolvedValue([
      { sectionId: 'section-1', _count: { id: 12 } },
    ])
    mocks.prisma.courseTeam.groupBy.mockResolvedValue([
      { sectionSubjectId: 'ss-1', _count: { id: 2 } },
    ])
    mocks.prisma.evaluationActivity.groupBy.mockResolvedValue([
      { sectionSubjectId: 'ss-1', _count: { id: 3 } },
    ])
    mocks.prisma.attendanceClass.findMany.mockResolvedValue([
      { sectionSubjectId: 'ss-1', attendanceDate: new Date('2026-07-15T00:00:00.000Z') },
    ])
    mocks.prisma.gradesRecord.groupBy.mockResolvedValue([
      { sectionSubjectId: 'ss-1', _avg: { score: 88.5 } },
    ])
    mocks.prisma.planningEntry.findMany.mockResolvedValue([
      { sectionSubjectId: 'ss-1', plannedDate: new Date('2026-07-20T00:00:00.000Z'), createdAt: new Date('2026-07-10T00:00:00.000Z'), title: 'Sistema solar' },
    ])
    mocks.prisma.subject.findMany.mockResolvedValue([
      { id: 'subject-1', code: 'MAT', name: 'Matemática', description: null, credits: null },
      { id: 'subject-2', code: 'ART', name: 'Educación Artística', description: null, credits: null },
    ])
    mocks.prisma.drAcademicLevel.findMany.mockResolvedValue([{ id: 'level-1', code: 'PRI', name: 'Primaria', sequence: 1 }])
    mocks.prisma.drAcademicCycle.findMany.mockResolvedValue([{ id: 'cycle-1', levelId: 'level-1', code: 'C1', name: 'Primer ciclo', sequence: 1, gradeSequenceFrom: 1, gradeSequenceTo: 3 }])
    mocks.prisma.drModality.findMany.mockResolvedValue([{ id: 'mod-1', code: 'GEN', name: 'General', appliesFromGradeSequence: null, appliesToGradeSequence: null }])
    mocks.prisma.teacher.findMany.mockResolvedValue([{ id: 'teacher-1', userId: 'user-1', firstName: 'Ana', lastName: 'Pérez', email: 'ana@test.local' }])
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1', name: '2026-2027' })
  })

  it('returns the frontend course-data shape', async () => {
    const result = await new CoursesService().getCourseData('school-1', 'user-1')

    expect(result.currentSchoolYear).toEqual({ id: 'year-1', name: '2026-2027' })
    expect(result.catalogs.levels[0].name).toBe('Primaria')
    expect(result.grades[0]).toMatchObject({
      id: 'grade-1',
      academicLevelName: 'Primaria',
      academicCycleName: 'Primer ciclo',
      defaultModalityName: 'General',
      status: 'active',
      sections: [
        {
          id: 'section-1',
          studentCount: 12,
          teamCount: 2,
          assignments: [
            {
              id: 'ss-1',
              subjectName: 'Matemática',
              teacherName: 'Ana Pérez',
              teamCount: 2,
              activityCount: 3,
              averageScore: 88.5,
              appearanceColor: '#7C3AED',
              appearanceIcon: 'calculator',
              relatedDataCount: 7,
              canDelete: false,
              lastPlanningTitle: 'Sistema solar',
              status: 'active',
            },
            {
              id: 'ss-archived',
              subjectName: 'Educación Artística',
              teacherId: 'teacher-1',
              teacherName: 'Ana Pérez',
              relatedDataCount: 0,
              canDelete: true,
              status: 'inactive',
            },
          ],
        },
      ],
    })
    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledWith({
      where: { schoolId: 'school-1', schoolYearId: 'year-1' },
      include: {
        _count: {
          select: {
            attendanceClasses: true,
            gradesRecords: true,
            evaluationActivities: true,
            courseTeams: true,
            scheduleEntries: true,
            planningEntries: true,
          },
        },
      },
    })
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledWith({
      where: { schoolId: 'school-1' },
      orderBy: { sequence: 'asc' },
    })
    expect(mocks.prisma.section.findMany).toHaveBeenCalledWith({
      where: { schoolId: 'school-1' },
      orderBy: { name: 'asc' },
    })
  })

  it('updates only the assignment appearance and invalidates course data', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-1', schoolId: 'school-1' })
    mocks.prisma.sectionSubject.update.mockResolvedValue({ id: 'ss-1', appearanceColor: '#0E9F6E', appearanceIcon: 'leaf' })
    const service = new CoursesService()

    const result = await service.updateSectionSubjectAppearance('school-1', 'ss-1', {
      color: '#0E9F6E',
      icon: 'leaf',
    })

    expect(mocks.prisma.sectionSubject.update).toHaveBeenCalledWith({
      where: { id: 'ss-1' },
      data: { appearanceColor: '#0E9F6E', appearanceIcon: 'leaf' },
    })
    expect(result).toMatchObject({ appearanceColor: '#0E9F6E', appearanceIcon: 'leaf' })
  })

  it('blocks permanent deletion of an active assignment even without related data', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-1',
      schoolId: 'school-1',
      status: 'ACTIVE',
      subject: { name: 'Matemática' },
    })

    await expect(
      new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-1', 'ELIMINAR'),
    ).rejects.toThrow('Solo se pueden eliminar permanentemente asignaturas archivadas')
    expect(mocks.prisma.sectionSubject.deleteMany).not.toHaveBeenCalled()
  })

  it('requires ELIMINAR before deleting an archived assignment, even without data', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({
      id: 'ss-archived',
      schoolId: 'school-1',
      status: 'INACTIVE',
      subject: { name: 'Ciencias de la Naturaleza' },
    })

    await expect(
      new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'Ciencias'),
    ).rejects.toThrow('Escribe ELIMINAR')
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled()
  })

  it('deletes an archived assignment and its dependent records in one transaction', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ id: 'ss-archived', status: 'INACTIVE' })
    mocks.prisma.evaluationActivity.findMany.mockResolvedValue([{ id: 'activity-1' }])
    mocks.prisma.evaluationActivityGroup.findMany.mockResolvedValue([{ id: 'group-1' }])
    mocks.prisma.gradesRecord.findMany.mockResolvedValue([{ id: 'record-1' }])
    mocks.prisma.courseTeam.findMany.mockResolvedValue([{ id: 'team-1' }])

    await expect(new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'ELIMINAR'))
      .resolves.toEqual({ deleted: true })
    expect(mocks.prisma.evaluationActivityGroupMember.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.evaluationActivityEvidence.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.pedagogicalRecovery.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.subjectResource.deleteMany).toHaveBeenCalledWith({ where: { schoolId: 'school-1', sectionSubjectId: 'ss-archived' } })
    expect(mocks.prisma.teacherJournalEntry.deleteMany).toHaveBeenCalledWith({ where: { schoolId: 'school-1', sectionSubjectId: 'ss-archived' } })
    expect(mocks.prisma.attendanceClass.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.scheduleEntry.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.planningEntry.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.courseTeamMember.deleteMany).toHaveBeenCalled()
    expect(mocks.prisma.sectionSubject.deleteMany).toHaveBeenCalledWith({ where: { id: 'ss-archived', schoolId: 'school-1', status: 'INACTIVE' } })
    expect(mocks.prisma.subject.deleteMany).not.toHaveBeenCalled()
  })

  it('blocks cross-school deletion and uploaded resources', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ status: 'INACTIVE' })
    await expect(new CoursesService().permanentlyDeleteSectionSubject('other-school', 'ss-archived', 'ELIMINAR'))
      .rejects.toThrow('Asignatura archivada no encontrada')
    expect(mocks.prisma.sectionSubject.findFirst).toHaveBeenCalledWith({ where: { id: 'ss-archived', schoolId: 'other-school' }, select: { status: true } })
    mocks.prisma.subjectResource.count.mockResolvedValueOnce(1)
    await expect(new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'ELIMINAR'))
      .rejects.toThrow('archivos adjuntos')
    expect(mocks.prisma.sectionSubject.deleteMany).not.toHaveBeenCalled()
  })

  it('does not delete the assignment when a dependent deletion fails', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ status: 'INACTIVE' })
    mocks.prisma.gradesRecord.deleteMany.mockRejectedValueOnce(new Error('Database unavailable'))
    await expect(new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'ELIMINAR'))
      .rejects.toThrow('Database unavailable')
    expect(mocks.prisma.sectionSubject.deleteMany).not.toHaveBeenCalled()
    expect(mocks.prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('blocks resources linked to an activity from another assignment', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ status: 'INACTIVE' })
    mocks.prisma.evaluationActivityResource.count.mockResolvedValueOnce(1)
    await expect(new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'ELIMINAR'))
      .rejects.toThrow('otra asignatura')
    expect(mocks.prisma.sectionSubject.deleteMany).not.toHaveBeenCalled()
  })

  it('reports an unexpected foreign-key dependency without removing the assignment', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ status: 'INACTIVE' })
    mocks.prisma.subjectResource.deleteMany.mockRejectedValueOnce({ code: 'P2003' })
    await expect(new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'ELIMINAR'))
      .rejects.toThrow('información vinculada')
    expect(mocks.prisma.sectionSubject.deleteMany).not.toHaveBeenCalled()
  })

  it('reloads course data on sequential requests', async () => {
    const service = new CoursesService()
    mocks.prisma.grade.upsert.mockResolvedValue({ id: 'grade-2', name: '2do', status: 'ACTIVE' })

    await service.getCourseData('school-1')
    await service.getCourseData('school-1')
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(2)

    await service.createGrade('school-1', { name: '2do' })
    await service.getCourseData('school-1')

    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(3)
  })

  it('assigns new subjects to the teacher linked to the authenticated account', async () => {
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1', schoolId: 'school-1' })
    mocks.prisma.grade.findFirst.mockResolvedValue({ id: 'grade-1', schoolId: 'school-1' })
    mocks.prisma.section.findFirst.mockResolvedValue({ id: 'section-1', schoolId: 'school-1', gradeId: 'grade-1' })
    mocks.prisma.subject.findFirst.mockResolvedValue({ id: 'subject-1', schoolId: 'school-1' })
    mocks.prisma.teacher.findFirst.mockResolvedValue({ id: 'teacher-owner', userId: 'user-1', schoolId: 'school-1' })
    mocks.prisma.sectionSubject.findUnique.mockResolvedValue(null)
    mocks.prisma.sectionSubject.create.mockResolvedValue({ id: 'ss-1', teacherId: 'teacher-owner' })

    await new CoursesService().assignSubject('school-1', {
      schoolYearId: 'year-1',
      gradeId: 'grade-1',
      sectionId: 'section-1',
      subjectId: 'subject-1',
    }, 'user-1')

    expect(mocks.prisma.teacher.findFirst).toHaveBeenCalledWith({
      where: { userId: 'user-1', schoolId: 'school-1', status: 'ACTIVE' },
    })
    expect(mocks.prisma.sectionSubject.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ teacherId: 'teacher-owner' }),
    }))
  })

  it('does not silently reactivate a duplicate archived assignment', async () => {
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1', schoolId: 'school-1' })
    mocks.prisma.grade.findFirst.mockResolvedValue({ id: 'grade-1' })
    mocks.prisma.section.findFirst.mockResolvedValue({ id: 'section-1' })
    mocks.prisma.subject.findFirst.mockResolvedValue({ id: 'subject-1' })
    mocks.prisma.sectionSubject.findUnique.mockResolvedValue({ id: 'archived-1', status: 'INACTIVE' })
    await expect(new CoursesService().assignSubject('school-1', {
      schoolYearId: 'year-1', gradeId: 'grade-1', sectionId: 'section-1', subjectId: 'subject-1',
    })).rejects.toThrow('Restáurala')
    expect(mocks.prisma.sectionSubject.create).not.toHaveBeenCalled()
  })

  it('allows assigning the same catalog subject after its archived assignment was deleted', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ status: 'INACTIVE' })
    await new CoursesService().permanentlyDeleteSectionSubject('school-1', 'ss-archived', 'ELIMINAR')
    mocks.prisma.schoolYear.findFirst.mockResolvedValue({ id: 'year-1', schoolId: 'school-1' })
    mocks.prisma.grade.findFirst.mockResolvedValue({ id: 'grade-1' })
    mocks.prisma.section.findFirst.mockResolvedValue({ id: 'section-1' })
    mocks.prisma.subject.findFirst.mockResolvedValue({ id: 'subject-1' })
    mocks.prisma.sectionSubject.findUnique.mockResolvedValue(null)
    mocks.prisma.sectionSubject.create.mockResolvedValue({ id: 'new-assignment' })
    await expect(new CoursesService().assignSubject('school-1', {
      schoolYearId: 'year-1', gradeId: 'grade-1', sectionId: 'section-1', subjectId: 'subject-1',
    })).resolves.toMatchObject({ id: 'new-assignment' })
    expect(mocks.prisma.subject.deleteMany).not.toHaveBeenCalled()
  })

  it('invalidates grading and schedule options after a course mutation', async () => {
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
    mocks.prisma.subject.findMany.mockResolvedValue([
      { id: 'subject-1', name: 'Matemática', status: 'ACTIVE' },
    ])
    mocks.prisma.subject.upsert.mockResolvedValue({
      id: 'subject-2',
      name: 'Ciencias',
      code: 'CIE',
      status: 'ACTIVE',
    })
    const grading = new GradingService()
    const schedule = new ScheduleService()

    await grading.getSectionSubjects('school-1')
    await schedule.getSubjects('school-1')
    await grading.getSectionSubjects('school-1')
    await schedule.getSubjects('school-1')
    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(2)
    expect(mocks.prisma.subject.findMany).toHaveBeenCalledTimes(2)

    await new CoursesService().createSubject('school-1', {
      name: 'Ciencias',
      code: 'CIE',
    })
    await grading.getSectionSubjects('school-1')
    await schedule.getSubjects('school-1')

    expect(mocks.prisma.sectionSubject.findMany).toHaveBeenCalledTimes(3)
    expect(mocks.prisma.subject.findMany).toHaveBeenCalledTimes(3)
  })

  it('invalidates dependent options when course data creates the default school year', async () => {
    const enrollmentLoader = vi.fn().mockResolvedValue('enrollments-without-year')
    const gradingLoader = vi.fn().mockResolvedValue('periods-without-year')
    const attendanceLoader = vi.fn().mockResolvedValue('current-period-without-year')
    const dependentOptions = [
      [optionCacheKeys.students.enrollmentCourses('school-1'), enrollmentLoader],
      [optionCacheKeys.grading.academicPeriods('school-1'), gradingLoader],
      [optionCacheKeys.attendance.currentPeriod('school-1'), attendanceLoader],
    ] as const
    await Promise.all(dependentOptions.map(([key, loader]) => optionCache.withCache(key, loader)))
    mocks.prisma.schoolYear.findFirst.mockResolvedValue(null)
    mocks.prisma.schoolYear.create.mockResolvedValue({ id: 'year-default', name: '2026-2027' })
    const service = new CoursesService()

    await service.getCourseData('school-1')
    await service.getCourseData('school-1')
    await Promise.all(dependentOptions.map(([key, loader]) => optionCache.withCache(key, loader)))

    for (const [, loader] of dependentOptions) {
      expect(loader).toHaveBeenCalledTimes(2)
    }
    expect(mocks.prisma.grade.findMany).toHaveBeenCalledTimes(2)
  })
})

describe('autorización del borrado permanente', () => {
  it('deniega el endpoint a un docente sin rol administrativo', () => {
    const handler = CoursesController.prototype.permanentlyDeleteSectionSubject
    const context = {
      getHandler: () => handler,
      getClass: () => CoursesController,
      switchToHttp: () => ({ getRequest: () => ({ user: { roles: ['teacher'] } }) }),
    } as unknown as ExecutionContext
    expect(new RolesGuard(new Reflector()).canActivate(context)).toBe(false)
  })
})

describe('CoursesService team lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.prisma.$transaction.mockImplementation(async (callback: (tx: typeof mocks.prisma) => unknown) => callback(mocks.prisma))
  })

  it('archives without deactivating memberships', async () => {
    mocks.prisma.courseTeam.findFirst.mockResolvedValue({ id: 'team-1', schoolId: 'school-1', status: 'ACTIVE' })
    mocks.prisma.courseTeam.update.mockResolvedValue({ id: 'team-1', status: 'INACTIVE' })

    await new CoursesService().archiveCourseTeam('school-1', 'team-1')

    expect(mocks.prisma.courseTeam.update).toHaveBeenCalledWith({ where: { id: 'team-1' }, data: { status: 'INACTIVE' } })
    expect(mocks.prisma.courseTeamMember.updateMany).not.toHaveBeenCalled()
  })

  it('returns a clear conflict when a team name already exists', async () => {
    mocks.prisma.sectionSubject.findFirst.mockResolvedValue({ sectionId: 'section-1', schoolYearId: 'year-1' })
    mocks.prisma.courseTeam.count.mockResolvedValue(1)
    mocks.prisma.courseTeam.create.mockRejectedValue({ code: 'P2002' })

    await expect(new CoursesService().createCourseTeam('school-1', 'user-1', 'subject-1', {
      name: 'Equipo 1',
      teamType: 'permanent',
      members: [],
    })).rejects.toThrow('Ya existe un equipo llamado "Equipo 1" en esta asignatura')
  })

  it('blocks direct deletion when an active team has academic history', async () => {
    mocks.prisma.courseTeam.findFirst.mockResolvedValue({ id: 'team-1', name: 'Equipo Newton', status: 'ACTIVE', _count: { activityGroups: 1 } })

    await expect(new CoursesService().deleteCourseTeamPermanently('school-1', 'team-1', 'Equipo Newton')).rejects.toThrow('historial')
    expect(mocks.prisma.courseTeam.delete).not.toHaveBeenCalled()
  })
})

describe('CoursesService write idempotency', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __test__clearCoursesCache()
  })

  it('creates grades by school, name, level and cycle instead of merging levels', async () => {
    mocks.prisma.grade.findFirst.mockResolvedValue(null)
    mocks.prisma.grade.create.mockResolvedValue({ id: 'grade-1', name: '1.º', status: 'ACTIVE' })

    const result = await new CoursesService().createGrade('school-1', {
      name: '1.º',
      level: 'Secundario',
      academicLevelId: 'level-1',
      academicCycleId: 'cycle-1',
      sequence: 1,
    })

    expect(result).toEqual({ id: 'grade-1', name: '1.º', status: 'ACTIVE' })
    expect(mocks.prisma.grade.findFirst).toHaveBeenCalledWith({
      where: {
        schoolId: 'school-1',
        name: '1.º',
        academicLevelId: 'level-1',
        academicCycleId: 'cycle-1',
      },
    })
    expect(mocks.prisma.grade.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        schoolId: 'school-1',
        name: '1.º',
        academicLevelId: 'level-1',
        academicCycleId: 'cycle-1',
      }),
    }))
  })

  it('upserts sections by grade and name after validating the grade', async () => {
    mocks.prisma.grade.findFirst.mockResolvedValue({ id: 'grade-1', schoolId: 'school-1' })
    mocks.prisma.section.upsert.mockResolvedValue({ id: 'section-1', name: 'A', status: 'ACTIVE' })

    const result = await new CoursesService().createSection('school-1', {
      gradeId: 'grade-1',
      name: 'A',
    })

    expect(result).toEqual({ id: 'section-1', name: 'A', status: 'ACTIVE' })
    expect(mocks.prisma.section.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { gradeId_name: { gradeId: 'grade-1', name: 'A' } },
      update: expect.objectContaining({ status: 'ACTIVE' }),
    }))
  })
})
