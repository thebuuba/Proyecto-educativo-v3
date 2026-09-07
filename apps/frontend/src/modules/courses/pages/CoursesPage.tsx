import { useSearchParams } from 'react-router-dom'

import './subject-activities-actions.css'
import { CoursesPage as CoursesPageBase } from './CoursesPageBase'
import { GroupedSubjectActivitiesPage } from './GroupedSubjectActivitiesPage'
import { SubjectActivityDetailModal } from './SubjectActivityDetailModal'

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
  const activityId = searchParams.get('activityId') ?? ''
  const hasSubjectContext = Boolean(courseId && subjectId)
  const tab = searchParams.get('tab')

  if (hasSubjectContext && tab === 'actividades') {
    return <>
      <GroupedSubjectActivitiesPage />
      {activityId ? <SubjectActivityDetailModal sectionSubjectId={subjectId} courseId={courseId} activityId={activityId} /> : null}
    </>
  }
  return <CoursesPageBase />
}
