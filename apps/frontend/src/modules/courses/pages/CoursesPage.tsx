import { useSearchParams } from 'react-router-dom'

import { CoursesPage as CoursesPageBase } from './CoursesPageBase'
import { GroupedSubjectActivitiesPage } from './GroupedSubjectActivitiesPage'

export {
  ActivityBlockPickerDialog,
  CourseSubjectCard,
  EstudiantesTab,
  SubjectActivitiesTab,
  SubjectAppearanceDialog,
} from './CoursesPageBase'

export function CoursesPage() {
  const [searchParams] = useSearchParams()
  const isSubjectActivities =
    searchParams.get('tab') === 'actividades'
    && Boolean(searchParams.get('courseId'))
    && Boolean(searchParams.get('subjectId'))

  return isSubjectActivities ? <GroupedSubjectActivitiesPage /> : <CoursesPageBase />
}
