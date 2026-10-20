import * as scheduleService from '@/modules/schedule/services/scheduleService'
import type { ScheduleDataSource } from './schedule-data-source'
import type { ScheduleWorkspaceAPI } from './schedule-types'

/** One instance per signed-in user and school; no module-level workspace cache. */
export function createLiveScheduleSource(): ScheduleDataSource {
  let workspaceRequest: Promise<ScheduleWorkspaceAPI> | undefined
  const readWorkspace = () => {
    const request = scheduleService.getScheduleWorkspace()
    workspaceRequest = request
    void request.catch(() => {
      if (workspaceRequest === request) workspaceRequest = undefined
    })
    return request
  }

  return {
    async getWorkspace() {
      const workspace = await readWorkspace()
      const pending = (workspace.pendingEntries ?? []).map(entry => ({ ...entry, needsPlacement: true }))
      const pendingIds = new Set(pending.map(entry => entry.id))
      return { ...workspace, entries: [...workspace.entries.filter(entry => !pendingIds.has(entry.id)), ...pending] }
    },
    async getAssignableClasses() {
      const workspace = await (workspaceRequest ?? readWorkspace())
      const options = await Promise.all(workspace.sections.map(async section => {
        const subjects = await scheduleService.getSectionSubjects(section.id)
        return subjects.map(subject => ({
          sectionSubjectId: subject.id,
          sectionId: section.id,
          subjectName: subject.subjectName,
          appearanceColor: subject.appearanceColor,
          sectionName: section.name,
          gradeName: section.gradeName,
          academicLevelName: section.academicLevelName,
        }))
      }))
      return options.flat()
    },
    saveStructure: scheduleService.saveScheduleStructure,
    deleteStructure: scheduleService.deleteScheduleStructure,
    createEntry: scheduleService.createScheduleEntry,
    updateEntry(id, input) {
      const { schoolYearId: _schoolYearId, academicPeriodId: _academicPeriodId, ...allowed } = input
      return scheduleService.updateScheduleEntry(id, allowed)
    },
    deleteEntry: scheduleService.deleteScheduleEntry,
  }
}
