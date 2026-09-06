import { useSearchParams } from 'react-router-dom'

import { CoursesPage as CoursesPageBase } from './CoursesPageBase'
import { GroupedSubjectActivitiesPage } from './GroupedSubjectActivitiesPage'
import { SubjectAttendancePage } from './SubjectAttendancePage'

export {
  ActivityBlockPickerDialog,
  CourseSubjectCard,
  EstudiantesTab,
  SubjectActivitiesTab,
  SubjectAppearanceDialog,
} from './CoursesPageBase'

export function CoursesPage() {
  const [searchParams] = useSearchParams()
  const hasSubjectContext = Boolean(searchParams.get('courseId')) && Boolean(searchParams.get('subjectId'))
  const tab = searchParams.get('tab')

  if (hasSubjectContext && tab === 'actividades') return <GroupedSubjectActivitiesPage />
  if (hasSubjectContext && tab === 'asistencia') return <SubjectAttendancePage />
  return <CoursesPageBase />
}
