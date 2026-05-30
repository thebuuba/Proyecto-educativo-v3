import { api } from '@/services/apiClient'

type ExportPayload = { filename: string; mimeType: string; content: string }

export async function createReportExport(
  schoolId: string,
  kind: string,
  format: string,
): Promise<ExportPayload> {
  return api.post<ExportPayload>('/reports/export', { schoolId, kind, format })
}
