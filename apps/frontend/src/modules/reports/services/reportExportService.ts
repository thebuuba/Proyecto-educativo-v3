/**
 * @file Servicio de Reportes
 *
 * Proporciona funciones para generar exportaciones de
 * reportes académicos y de asistencia.
 */

import { api } from '@/services/apiClient'

/** Payload de exportación con contenido y metadatos */
type ExportPayload = { filename: string; mimeType: string; content: string }

/** Solicita la generación de un reporte exportable */
export async function createReportExport(
  schoolId: string,
  kind: string,
  format: string,
): Promise<ExportPayload> {
  return api.post<ExportPayload>('/reports/export', { schoolId, kind, format })
}
