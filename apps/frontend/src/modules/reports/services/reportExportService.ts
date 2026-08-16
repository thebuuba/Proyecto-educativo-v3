/** Cliente del panel de reportes y sus exportaciones. */
import { api, API_CACHE_TTL } from '@/services/apiClient'

export type ReportKind = 'boletin' | 'registro-grado' | 'asistencia' | 'rendimiento' | 'promocion'
export type ExportReportKind = ReportKind | 'todos'
export type ExportFormat = 'csv' | 'xls' | 'pdf'

export type ReportSummary = {
  schoolYearName: string
  totals: {
    students: number
    attendanceRate: number | null
    academicAverage: number | null
    promoted: number
  }
  attendanceByMonth: Array<{ label: string; value: number | null }>
  performanceByGrade: Array<{ label: string; value: number }>
  promotion: { promoted: number; pending: number; retained: number }
  generatedAt: string
}

type ExportPayload = {
  filename: string
  mimeType: string
  content: string
  disposition: 'download' | 'print'
}

export function getReportSummary() {
  return api.get<ReportSummary>('/reports/summary', { cacheTtlMs: API_CACHE_TTL.sessionList })
}

export function createReportExport(kind: ExportReportKind, format: ExportFormat) {
  return api.post<ExportPayload>('/reports/export', { kind, format })
}
