import { THRESHOLD } from '@/constants'
import type { StudentListItem } from '@/modules/students/types'

export function getStudentInitials(student: StudentListItem) {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()
}

export function getCourseLabel(student: StudentListItem) {
  const gradeName = student.currentEnrollment?.gradeName
  const sectionName = student.currentEnrollment?.sectionName

  if (gradeName && sectionName) {
    return `${gradeName} ${sectionName}`
  }

  return gradeName ?? sectionName ?? 'Sin curso'
}

export function getProgressTone(value: number | null) {
  if (value === null) return 'bg-muted'
  if (value < THRESHOLD.ATTENDANCE_LOW) return 'bg-destructive'
  if (value < THRESHOLD.ATTENDANCE_WARNING) return 'bg-accent'
  return 'bg-success'
}

export function getAverageTone(value: number | null) {
  if (value === null) return 'text-muted-foreground'
  if (value < THRESHOLD.GRADE_LOW) return 'text-destructive'
  if (value < THRESHOLD.GRADE_WARNING) return 'text-accent'
  return 'text-success'
}

export function getDisplayStatus(student: StudentListItem) {
  if (student.status === 'inactive') {
    return {
      label: 'Inactivo',
      className: 'bg-warning/14 text-warning',
      dotClassName: 'bg-warning',
    }
  }

  if (student.status === 'archived') {
    return {
      label: 'Archivado',
      className: 'bg-muted text-muted-foreground',
      dotClassName: 'bg-muted-foreground',
    }
  }

  const { attendancePercentage, averageScore, pendingCount } = student.metrics

  if (
    (attendancePercentage !== null && attendancePercentage < THRESHOLD.ATTENDANCE_LOW) ||
    (averageScore !== null && averageScore < THRESHOLD.GRADE_LOW)
  ) {
    return {
      label: 'En riesgo',
      className: 'bg-destructive/12 text-destructive',
      dotClassName: 'bg-destructive',
    }
  }

  if (
    pendingCount > 0 ||
    (attendancePercentage !== null && attendancePercentage < THRESHOLD.ATTENDANCE_WARNING) ||
    (averageScore !== null && averageScore < THRESHOLD.GRADE_WARNING)
  ) {
    return {
      label: 'Atención',
      className: 'bg-accent/18 text-accent-foreground',
      dotClassName: 'bg-accent',
    }
  }

  return {
    label: 'Al día',
    className: 'bg-success/12 text-success',
    dotClassName: 'bg-success',
  }
}
