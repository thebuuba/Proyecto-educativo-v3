import '../subject-workspace.css'
import './subject-activities-actions.css'
import { CoursesPage as CoursesPageBase } from './CoursesPageBase'

export {
  ActivityBlockPickerDialog,
  ArchivedSubjectCard,
  CourseSubjectCard,
  EstudiantesTab,
  SubjectActivitiesTab,
  SubjectAppearanceDialog,
  PermanentSubjectDeleteDialog,
} from './CoursesPageBase'

export function CoursesPage() {
  return <CoursesPageBase />
}
