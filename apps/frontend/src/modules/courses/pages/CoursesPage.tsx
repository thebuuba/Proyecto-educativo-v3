import { useSearchParams } from 'react-router-dom'

import './subject-activities-actions.css'
import { CoursesPage as CoursesPageBase } from './CoursesPageBase'
import { GroupedSubjectActivitiesPage } from './GroupedSubjectActivitiesPage'
import { SubjectGradesPage } from './SubjectGradesPage'

export {
  ActivityBlockPickerDialog,
  CourseSubjectCard,
  EstudiantesTab,
  SubjectActivitiesTab,
  SubjectAppearanceDialog,
} from './CoursesPageBase'

export function CoursesPage() {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId') ?? ''
  const subjectId = searchParams.get('subjectId') ?? ''
  const hasSubjectContext = Boolean(courseId && subjectId)
  const tab = searchParams.get('tab')

  if (hasSubjectContext && tab === 'actividades') return <GroupedSubjectActivitiesPage />
  if (hasSubjectContext && tab === 'calificaciones') return <SubjectGradesPage />
  return <CoursesPageBase />
}
