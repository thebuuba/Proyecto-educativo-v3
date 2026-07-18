import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  computeAttendanceStats,
  deleteAttendance,
  getAttendanceWorkspace,
  getClassAttendanceForMonth,
  getStudentsBySection,
  upsertAttendance,
} from '@/modules/attendance/services/attendanceService'
import type {
  MonthlyAttendanceCell,
  MonthlyAttendanceMark,
  StudentAttendanceRow,
} from '@/modules/attendance/types'
import {
  buildMonthlyRows,
  computeMonthlyStats,
  getCalendarYearForSchoolMonth,
  getInitialSchoolMonth,
  getNextMark,
  getWorkedDaysForMonth,
  markToStatus,
} from '@/modules/attendance/utils/monthlyAttendance'
import { getScheduleEntries } from '@/modules/schedule/services/scheduleService'
import type { EnrollmentCourse } from '@/modules/students/types'
import { createScopedTtlCache } from '@/utils/scopedTtlCache'

type AttendanceInitialData = {
  courses: EnrollmentCourse[]
  academicPeriodId: string | null
}

const attendanceInitialCache = createScopedTtlCache<AttendanceInitialData>(60_000)

function cloneAttendanceByDate(source: Map<string, Map<string, MonthlyAttendanceCell>>) {
  return new Map(
    Array.from(source.entries()).map(([date, attendance]) => [date, new Map(attendance)]),
  )
}

function updateAttendanceCell(
  source: Map<string, Map<string, MonthlyAttendanceCell>>,
  date: string,
  enrollmentId: string,
  cell: MonthlyAttendanceCell | null,
) {
  const next = cloneAttendanceByDate(source)
  const dailyAttendance = new Map(next.get(date) ?? [])

  if (cell) {
    dailyAttendance.set(enrollmentId, cell)
  } else {
    dailyAttendance.delete(enrollmentId)
  }

  if (dailyAttendance.size > 0) {
    next.set(date, dailyAttendance)
  } else {
    next.delete(date)
  }

  return next
}

export function useAttendance() {
  const { appUser } = useAuth()
  const cacheScope = appUser ? `${appUser.id}:${appUser.schoolId}` : null
  const cached = attendanceInitialCache.read(cacheScope)
  const [courses, setCourses] = useState<EnrollmentCourse[]>(cached?.courses ?? [])
  const [selectedCourseId, setSelectedCourseId] = useState(cached?.courses[0]?.id ?? '')
  const [selectedMonth, setSelectedMonth] = useState(getInitialSchoolMonth)
  const [students, setStudents] = useState<StudentAttendanceRow[]>([])
  const [academicPeriodId, setAcademicPeriodId] = useState<string | null>(
    cached?.academicPeriodId ?? null,
  )
  const [classWeekdays, setClassWeekdays] = useState<number[]>([])
  const [loading, setLoading] = useState(!cached)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  )
  const calendarYear = getCalendarYearForSchoolMonth(selectedMonth, selectedCourse?.schoolYearName)
  const workedDays = useMemo(
    () =>
      selectedCourse
        ? getWorkedDaysForMonth({ year: calendarYear, month: selectedMonth, classWeekdays })
        : [],
    [calendarYear, classWeekdays, selectedCourse, selectedMonth],
  )
  const [attendanceByDate, setAttendanceByDate] = useState<Map<string, Map<string, MonthlyAttendanceCell>>>(new Map())
  const monthlyRows = useMemo(
    () => buildMonthlyRows({ students, workedDays, attendanceByDate }),
    [attendanceByDate, students, workedDays],
  )
  const recordedDays = useMemo(
    () => Array.from(attendanceByDate.values()).filter((attendance) => attendance.size > 0).length,
    [attendanceByDate],
  )
  const monthlyStats = useMemo(
    () => computeMonthlyStats(monthlyRows, recordedDays),
    [monthlyRows, recordedDays],
  )
  const stats = useMemo(() => computeAttendanceStats(students), [students])

  const loadInitialData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const workspace = await getAttendanceWorkspace()
      const courseList = workspace.courses
      const period = workspace.academicPeriodId
      setCourses(courseList)
      setAcademicPeriodId(period)
      attendanceInitialCache.write(cacheScope, {
        courses: courseList,
        academicPeriodId: period,
      })
      if (courseList.length > 0) {
        setSelectedCourseId((current) => current || courseList[0].id)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudieron cargar los cursos.')
    } finally {
      setLoading(false)
    }
  }, [cacheScope])

  useEffect(() => {
    const freshCache = attendanceInitialCache.read(cacheScope)
    if (freshCache) {
      setCourses(freshCache.courses)
      setAcademicPeriodId(freshCache.academicPeriodId)
      if (freshCache.courses.length > 0) {
        setSelectedCourseId((current) => current || freshCache.courses[0].id)
      }
      setError(null)
      setLoading(false)
      return
    }
    void loadInitialData()
  }, [cacheScope, loadInitialData])

  const loadMonthlyAttendance = useCallback(async () => {
    if (!selectedCourse) {
      setStudents([])
      setAttendanceByDate(new Map())
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [studentRows, scheduleEntries] = await Promise.all([
        getStudentsBySection(selectedCourse.sectionId, selectedCourse.schoolYearId),
        getScheduleEntries({
          sectionId: selectedCourse.sectionId,
          sectionSubjectId: selectedCourse.id,
          schoolYearId: selectedCourse.schoolYearId,
        }),
      ])
      const weekdays = Array.from(new Set(scheduleEntries.map((entry) => entry.dayOfWeek)))
        .filter((day) => day >= 1 && day <= 7)
        .sort((first, second) => first - second)
      setClassWeekdays(weekdays)

      const days = getWorkedDaysForMonth({
        year: getCalendarYearForSchoolMonth(selectedMonth, selectedCourse.schoolYearName),
        month: selectedMonth,
        classWeekdays: weekdays,
      })
      const attendance = await getClassAttendanceForMonth(
        selectedCourse.id,
        days.map((day) => day.date),
      )

      setStudents(studentRows)
      setAttendanceByDate(attendance)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo cargar la asistencia mensual.')
      setStudents([])
      setAttendanceByDate(new Map())
    } finally {
      setLoading(false)
    }
  }, [selectedCourse, selectedMonth])

  useEffect(() => {
    void loadMonthlyAttendance()
  }, [loadMonthlyAttendance])

  const toggleCell = useCallback(
    async (enrollmentId: string, date: string, currentMark: MonthlyAttendanceMark) => {
      if (!selectedCourse || !academicPeriodId) return

      const nextMark = getNextMark(currentMark)
      const nextStatus = markToStatus(nextMark)
      const row = monthlyRows.find((item) => item.enrollmentId === enrollmentId)
      const cell = row?.cells[date]
      if (!row) return

      const previousAttendance = cloneAttendanceByDate(attendanceByDate)
      setError(null)
      setAttendanceByDate((current) =>
        updateAttendanceCell(
          current,
          date,
          enrollmentId,
          nextStatus
            ? {
                attendanceId: cell?.attendanceId ?? null,
                status: nextStatus,
                mark: nextMark,
              }
            : null,
        ),
      )
      setSaving(true)
      try {
        if (!nextStatus) {
          if (cell?.attendanceId) {
            await deleteAttendance(cell.attendanceId, 'class')
          }
        } else {
          const savedAttendance = await upsertAttendance({
            type: 'class',
            enrollmentId,
            academicPeriodId,
            sectionSubjectId: selectedCourse.id,
            attendanceDate: date,
            status: nextStatus,
            notes: nextMark === 'R' ? 'retired' : null,
          })
          setAttendanceByDate((current) =>
            updateAttendanceCell(current, date, enrollmentId, {
              attendanceId: savedAttendance.id,
              status: nextStatus,
              mark: nextMark,
            }),
          )
        }
      } catch (error) {
        setAttendanceByDate(previousAttendance)
        setError(error instanceof Error ? error.message : 'No se pudo guardar la asistencia.')
      } finally {
        setSaving(false)
      }
    },
    [academicPeriodId, attendanceByDate, monthlyRows, selectedCourse],
  )

  return {
    courses,
    selectedCourse,
    selectedCourseId,
    setSelectedCourseId,
    selectedMonth,
    setSelectedMonth,
    workedDays,
    students,
    monthlyRows,
    monthlyStats,
    stats,
    loading,
    saving,
    error,
    toggleCell,
    refresh: loadMonthlyAttendance,
  }
}
