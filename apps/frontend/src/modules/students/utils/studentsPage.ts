import type { EnrollmentCourse } from '@/modules/students/types'

export function getCourseSubjects(course: EnrollmentCourse) {
  return course.subjects?.length
    ? course.subjects
    : [{ id: course.subjectId, name: course.subjectName, area: course.area }]
}

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName.trim()
  return { firstName, lastName: parts.join(' ') || 'Sin apellido' }
}

export function toStudentStatus(status?: string) {
  return status === 'active' ? 'active' as const : 'inactive' as const
}

export function buildStudentsCsv(students: Array<{ studentCode: string; fullName: string; status: string }>, course: EnrollmentCourse) {
  const headers = ['codigo', 'nombre', 'estado', 'grado', 'seccion', 'area', 'asignatura', 'tanda', 'anio_escolar']
  const rows = students.map((student) => [student.studentCode, student.fullName, student.status, course.gradeName, course.sectionName, course.area, getCourseSubjects(course).map((subject) => subject.name).join(' | '), course.shift, course.schoolYearName])
  return [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
}
