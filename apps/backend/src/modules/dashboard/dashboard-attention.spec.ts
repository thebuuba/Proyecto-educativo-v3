import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dashboardAttentionPolicy } from '../../config/dashboard-attention-policy'
import { getDashboardAttention } from './dashboard-attention'

const db = vi.hoisted(() => ({
  enrollment: { findMany: vi.fn() }, sectionSubject: { findMany: vi.fn() }, gradesRecord: { findMany: vi.fn() },
  attendanceClass: { findMany: vi.fn() }, teacherJournalStudent: { findMany: vi.fn() },
}))
vi.mock('@aula/database', () => ({ prisma: db }))
const user = { id: 'user', schoolId: 'school', email: 'test@example.invalid', roles: ['admin'] }
const management = { view: 'management', teacherId: null }
const today = new Date('2026-10-14T00:00:00Z')
const enrollment = (index: number) => ({ id: String(index).padStart(6, '0'), studentId: `student-${index}`, student: { firstName: 'Estudiante', lastName: String(index) }, grade: { name: 'Primero' }, section: { name: 'A' } })

beforeEach(() => {
  vi.resetAllMocks()
  db.gradesRecord.findMany.mockResolvedValue([])
  db.attendanceClass.findMany.mockResolvedValue([])
  db.teacherJournalStudent.findMany.mockResolvedValue([])
  db.enrollment.findMany.mockResolvedValue([])
})
afterEach(() => vi.unstubAllEnvs())

describe('alertas para todas las matrículas', () => {
  it('incluye al estudiante 501 y mantiene el filtro del centro en cada lote', async () => {
    const first = Array.from({ length: 500 }, (_, index) => enrollment(index + 1))
    db.enrollment.findMany.mockResolvedValueOnce(first).mockResolvedValueOnce([enrollment(501)])
    db.gradesRecord.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([{ enrollmentId: '000501', score: 40, maxScore: 100 }])
    const result = await getDashboardAttention(user, 'year', 'period', management, today)
    expect(result.map((item) => item.id)).toEqual(['student-501'])
    expect(db.enrollment.findMany).toHaveBeenCalledTimes(2)
    expect(db.enrollment.findMany).toHaveBeenNthCalledWith(2, expect.objectContaining({ where: { schoolId: 'school', schoolYearId: 'year', status: 'ACTIVE', id: { gt: '000500' } }, orderBy: { id: 'asc' }, take: 500 }))
    for (const call of db.gradesRecord.findMany.mock.calls) expect(call[0].where.schoolId).toBe('school')
  })
  it('aplica el límite visual después de examinar todos los lotes', async () => {
    vi.stubEnv('DASHBOARD_ATTENTION_PAGE_SIZE', '2')
    vi.stubEnv('DASHBOARD_ATTENTION_DISPLAY_LIMIT', '1')
    db.enrollment.findMany.mockResolvedValueOnce([enrollment(1), enrollment(2)]).mockResolvedValueOnce([enrollment(3)])
    db.gradesRecord.findMany.mockResolvedValueOnce([{ enrollmentId: '000001', score: 50, maxScore: 100 }]).mockResolvedValueOnce([{ enrollmentId: '000003', score: 10, maxScore: 100 }])
    expect((await getDashboardAttention(user, 'year', 'period', management, today)).map((item) => item.id)).toEqual(['student-3'])
  })
  it('usa los umbrales configurados tanto en la alerta como en su texto', async () => {
    vi.stubEnv('DASHBOARD_ATTENDANCE_MINIMUM', '95')
    db.enrollment.findMany.mockResolvedValueOnce([enrollment(1)])
    db.attendanceClass.findMany.mockResolvedValue(Array.from({ length: 10 }, (_, i) => ({ enrollmentId: '000001', status: i === 0 ? 'ABSENT' : 'PRESENT' })))
    const [result] = await getDashboardAttention(user, 'year', 'period', management, today)
    expect(result.attendance).toBe(90)
    expect(result.note).toContain('95%')
  })
  it('no inventa calificaciones ni alertas al faltar registros', async () => {
    db.enrollment.findMany.mockResolvedValueOnce([enrollment(1)])
    expect(await getDashboardAttention(user, 'year', 'period', management, today)).toEqual([])
  })
  it('mantiene el alcance del docente', async () => {
    db.sectionSubject.findMany.mockResolvedValue([{ sectionId: 'section' }])
    db.enrollment.findMany.mockResolvedValueOnce([enrollment(1)])
    await getDashboardAttention(user, 'year', 'period', { view: 'teacher', teacherId: 'teacher' }, today)
    expect(db.enrollment.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ sectionId: { in: ['section'] }, schoolId: 'school' }) }))
    expect(db.gradesRecord.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ sectionSubject: { teacherId: 'teacher' } }) }))
  })
  it('no consulta matrículas para vistas no autorizadas o docentes sin perfil', async () => {
    expect(await getDashboardAttention(user, 'year', 'period', { view: 'teacher', teacherId: null }, today)).toEqual([])
    expect(await getDashboardAttention(user, 'year', 'period', { view: 'student', teacherId: null }, today)).toEqual([])
    expect(db.enrollment.findMany).not.toHaveBeenCalled()
  })
  it.each([{ DASHBOARD_ATTENTION_PAGE_SIZE: '0' }, { DASHBOARD_GRADE_MINIMUM: 'NaN' }, { DASHBOARD_ATTENDANCE_MINIMUM: '101' }, { DASHBOARD_OBSERVATION_MINIMUM: '1.5' }])('rechaza configuraciones inválidas', (env) => {
    expect(() => dashboardAttentionPolicy(env)).toThrow()
  })
})
