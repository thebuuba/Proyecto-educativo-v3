import '../subject-workspace.css'
import './subject-activities-actions.css'
import { CoursesPage as CoursesPageBase } from './CoursesPageBase'

export {
  ActivityBlockPickerDialog,
  CourseSubjectCard,
  EstudiantesTab,
  SubjectActivitiesTab,
  SubjectAppearanceDialog,
} from './CoursesPageBase'

export function CoursesPage() {
  return <CoursesPageBase />
}
