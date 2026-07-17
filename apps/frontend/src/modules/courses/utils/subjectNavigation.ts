export function buildSubjectAttendanceHref(sectionSubjectId: string, returnCourseId: string) {
  return `/asistencia?${new URLSearchParams({
    sectionSubjectId,
    origin: 'subject',
    returnCourseId,
    returnSubjectId: sectionSubjectId,
  }).toString()}`
}
