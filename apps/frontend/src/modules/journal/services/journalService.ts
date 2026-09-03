import { api } from '@/services/apiClient'
import type { JournalEntry, SaveJournalEntry } from '@/modules/journal/types'

export const getJournalEntries = () => api.get<JournalEntry[]>('/journal', { forceRefresh: true })
export const createJournalEntry = (input: SaveJournalEntry) => api.post<JournalEntry>('/journal', input)
export const updateJournalEntry = (id: string, input: SaveJournalEntry) => api.patch<JournalEntry>(`/journal/${id}`, input)
export const archiveJournalEntry = (id: string) => api.post<JournalEntry>(`/journal/${id}/archive`)
export const restoreJournalEntry = (id: string) => api.post<JournalEntry>(`/journal/${id}/restore`)
export const completeJournalFollowUp = (id: string) => api.post<JournalEntry>(`/journal/${id}/complete`)
export const deleteJournalEntry = (id: string) => api.delete<{ id: string }>(`/journal/${id}`)
