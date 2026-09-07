import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import './subject-activities-actions.css'
import { CoursesPage as CoursesPageBase } from './CoursesPageBase'
import { GroupedSubjectActivitiesPage } from './GroupedSubjectActivitiesPage'
import { SubjectGradesPage } from './SubjectGradesPage'
import { SubjectSchedulePage } from './SubjectSchedulePage'

export {
  ActivityBlockPickerDialog,
  CourseSubjectCard,
  EstudiantesTab,
  SubjectActivitiesTab,
  SubjectAppearanceDialog,
} from './CoursesPageBase'

export function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const courseId = searchParams.get('courseId') ?? ''
  const subjectId = searchParams.get('subjectId') ?? ''
  const hasSubjectContext = Boolean(courseId && subjectId)
  const tab = searchParams.get('tab')

  useEffect(() => {
    if (!hasSubjectContext || tab) return

    const promoteLegacyGradesRoute = () => {
      const legacyGradesVisible = Array.from(document.querySelectorAll('h2')).some(
        (heading) => heading.textContent?.trim() === 'Libro de calificaciones',
      )
      if (!legacyGradesVisible) return false

      const next = new URLSearchParams(window.location.search)
      if (!next.get('courseId') || !next.get('subjectId')) return false
      next.set('tab', 'calificaciones')
      setSearchParams(next, { replace: true })
      return true
    }

    if (promoteLegacyGradesRoute()) return

    const observer = new MutationObserver(() => {
      if (promoteLegacyGradesRoute()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [hasSubjectContext, setSearchParams, tab])

  if (hasSubjectContext && tab === 'actividades') return <GroupedSubjectActivitiesPage />
  if (hasSubjectContext && tab === 'calificaciones') return <SubjectGradesPage />
  if (hasSubjectContext && tab === 'horario') return <SubjectSchedulePage />
  return <CoursesPageBase />
}
