import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { useSchoolAdministration } from './useSchoolAdministration'
import * as service from '../services/schoolAdministrationService'
import * as planning from '@/modules/planning/services/planningService'
vi.mock('@/modules/auth/hooks/useAuth', () => ({ useAuth: () => ({ schoolId: 'school-1' }) }))
vi.mock('../services/schoolAdministrationService', () => ({ getSchoolProfile: vi.fn(), getSchoolYears: vi.fn(), createSchoolYear: vi.fn(), updateSchoolProfile: vi.fn(), updateSchoolYear: vi.fn(), setCurrentSchoolYear: vi.fn() }))
vi.mock('@/modules/planning/services/planningService', () => ({ getAcademicPeriods: vi.fn() }))
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(service.getSchoolYears).mockResolvedValue([{ id: 'year', isCurrent: true }] as never)
  vi.mocked(planning.getAcademicPeriods).mockRejectedValue(new Error('Sin cobertura'))
})
it('permite recuperar cobertura sin consultar rutas académicas al deshabilitar la carga del centro', async () => {
  const { result } = renderHook(() => useSchoolAdministration(false))
  await waitFor(() => expect(result.current.loading).toBe(false))
  await act(() => result.current.refetch())
  expect(service.getSchoolProfile).not.toHaveBeenCalled()
  expect(service.getSchoolYears).not.toHaveBeenCalled()
  expect(planning.getAcademicPeriods).not.toHaveBeenCalled()
  expect(result.current.error).toBeNull()
})
