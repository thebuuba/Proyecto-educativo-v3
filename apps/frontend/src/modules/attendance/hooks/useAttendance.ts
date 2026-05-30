import { useCallback, useEffect, useState } from 'react'

import {
  computeAttendanceStats,
  getAttendance,
  getCurrentAcademicPeriodId,
  getCurrentSchoolYearId,
  getSections,
  getStudentsBySection,
  upsertAttendance,
} from '@/modules/attendance/services/attendanceService'
import type {
  AttendanceStats,
  SectionOption,
  StudentAttendanceRow,
} from '@/modules/attendance/types'
import type { AttendanceStatus } from '@/types/domain'

export function useAttendance() {
  const [sections, setSections] = useState<SectionOption[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string>('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<StudentAttendanceRow[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearId, setSchoolYearId] = useState<string | null>(null)
  const [academicPeriodId, setAcademicPeriodId] = useState<string | null>(null)

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [sectionList, yearId, periodId] = await Promise.all([
        getSections(),
        getCurrentSchoolYearId(),
        getCurrentAcademicPeriodId(),
      ])
      setSections(sectionList)
      setSchoolYearId(yearId)
      setAcademicPeriodId(periodId)

      if (sectionList.length > 0 && !selectedSectionId) {
        setSelectedSectionId(sectionList[0].id)
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los datos iniciales.',
      )
    } finally {
      setLoading(false)
    }
  }, [selectedSectionId])

  useEffect(() => {
    void loadInitialData()
  }, [loadInitialData])

  const loadStudents = useCallback(
    async (sectionId: string, selectedDate: string) => {
      if (!schoolYearId) return

      setLoading(true)
      setError(null)

      try {
        const studentRows = await getStudentsBySection(sectionId, schoolYearId)
        const attendanceMap = await getAttendance(sectionId, selectedDate)

        const rows = studentRows.map((row) => {
          const existing = attendanceMap.get(row.enrollmentId)
          return {
            ...row,
            status: existing?.status ?? null,
            attendanceId: existing?.attendanceId ?? null,
          }
        })

        setStudents(rows)
        setStats(computeAttendanceStats(rows))
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los estudiantes.',
        )
        setStudents([])
      } finally {
        setLoading(false)
      }
    },
    [schoolYearId],
  )

  useEffect(() => {
    if (!selectedSectionId || !schoolYearId) return

    const timeoutId = window.setTimeout(() => {
      void loadStudents(selectedSectionId, date)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [selectedSectionId, date, schoolYearId, loadStudents])

  const toggleStatus = useCallback(
    async (enrollmentId: string, newStatus: AttendanceStatus) => {
      if (!academicPeriodId || !schoolYearId) return

      const student = students.find((s) => s.enrollmentId === enrollmentId)
      if (!student) return

      setSaving(true)

      try {
        await upsertAttendance({
          enrollmentId,
          academicPeriodId,
          sectionId: selectedSectionId,
          schoolYearId,
          attendanceDate: date,
          status: newStatus,
          attendanceId: student.attendanceId,
        })

        const updated = students.map((s) =>
          s.enrollmentId === enrollmentId
            ? { ...s, status: s.status === newStatus ? null : newStatus }
            : s,
        )
        setStudents(updated)
        setStats(computeAttendanceStats(updated))
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo guardar la asistencia.',
        )
      } finally {
        setSaving(false)
      }
    },
    [academicPeriodId, date, schoolYearId, selectedSectionId, students],
  )

  return {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    date,
    setDate,
    students,
    stats,
    loading,
    saving,
    error,
    toggleStatus,
    refresh: () => {
      if (selectedSectionId) {
        void loadStudents(selectedSectionId, date)
      }
    },
  }
}
