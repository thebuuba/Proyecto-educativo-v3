export type JournalEntryType = 'quick_note' | 'student_observation' | 'incident' | 'class_observation' | 'pedagogical_idea' | 'course_observation'

export type JournalStudent = { id: string; firstName: string; lastName: string; studentCode: string }

export type JournalEntry = {
  id: string
  entryType: JournalEntryType
  title: string | null
  content: string
  occurredAt: string
  tags: string[]
  requiresFollowUp: boolean
  followUpDate: string | null
  followUpStatus: 'none' | 'pending' | 'completed'
  status: 'ACTIVE' | 'ARCHIVED'
  schoolYearId: string | null
  sectionId: string | null
  sectionSubjectId: string | null
  academicPeriodId: string | null
  schoolYear: { id: string; name: string } | null
  academicPeriod: { id: string; name: string } | null
  section: { id: string; name: string; grade: { name: string } } | null
  sectionSubject: { id: string; subject: { id: string; name: string } } | null
  students: Array<{ student: JournalStudent }>
}

export type SaveJournalEntry = {
  entryType: JournalEntryType
  title?: string
  content: string
  occurredAt: string
  schoolYearId?: string
  sectionId?: string
  sectionSubjectId?: string
  academicPeriodId?: string
  studentIds: string[]
  tags: string[]
  requiresFollowUp: boolean
  followUpDate?: string
  followUpStatus?: 'none' | 'pending' | 'completed'
}
