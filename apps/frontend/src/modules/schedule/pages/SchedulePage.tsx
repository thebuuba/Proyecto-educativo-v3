import { useState } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import ScheduleWorkspace from '../polymet/ScheduleWorkspace'
import { createLiveScheduleSource } from '../polymet/lib/live-schedule-source'
import { Toaster } from '../polymet/ui/feedback'
import '../polymet/polymet-theme.css'

export function SchedulePage() {
  const { appUser, hasRole } = useAuth()
  const userId = appUser?.id
  const schoolId = appUser?.schoolId
  const editable = hasRole(['admin', 'director', 'coordinator', 'teacher'])
  return <TeacherSchedule key={`${userId}:${schoolId}`} editable={editable} />
}

function TeacherSchedule({ editable }: { editable: boolean }) {
  const [source] = useState(createLiveScheduleSource)
  return (
    <div className="schedule-polymet-theme">
      <ScheduleWorkspace dataSource={source} permissions={{ canAssign: editable, canEditStructure: editable }} />
      <Toaster />
    </div>
  )
}
