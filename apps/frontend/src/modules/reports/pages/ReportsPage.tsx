/**
 * @file Página de Reportes
 *
 * Vista principal de reportes exportables con formato
 * CSV, XLS y PDF.
 */

import { Download, FileSpreadsheet, Printer } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  createReportExport,
} from '@/modules/reports/services/reportExportService'

/** Tipo de reporte disponible */
type ReportKind = 'boletin' | 'registro-grado' | 'asistencia' | 'rendimiento' | 'promocion'
/** Formato de exportación */
type ExportFormat = 'csv' | 'xls' | 'pdf'

/** Catálogo de reportes disponibles */
const reports: { kind: ReportKind; title: string; description: string }[] = [
  {
    kind: 'boletin',
    title: 'Boletín por estudiante',
    description: 'Listado base para boletines y expedientes académicos.',
  },
  {
    kind: 'registro-grado',
    title: 'Registro de grado',
    description: 'Exportable operativo para revisión de estudiantes por grado.',
  },
  {
    kind: 'asistencia',
    title: 'Asistencia mensual/anual',
    description: 'Registros recientes de asistencia con centro, grado y sección.',
  },
  {
    kind: 'rendimiento',
    title: 'Rendimiento académico',
    description: 'Promedio anual por estudiante, asignatura, grado y sección.',
  },
  {
    kind: 'promocion',
    title: 'Promoción y condición final',
    description: 'Resumen de asignaturas aprobadas y en revisión por estudiante.',
  },
]

export function ReportsPage() {
  const { schoolId } = useAuth()
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleExport(kind: ReportKind, format: ExportFormat) {
    if (!schoolId) return

    const key = `${kind}:${format}`
    setLoadingKey(key)
    setError(null)

    try {
      const exportPayload = await createReportExport(schoolId, kind, format)
      const blob = new Blob([exportPayload.content], { type: exportPayload.mimeType })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = exportPayload.filename
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo generar el reporte.')
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
          Exportables oficiales
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
          Reportes
        </h1>
        <p className="mt-3 text-base leading-6 text-muted-foreground">
          Informes operativos con encabezados de centro y año escolar.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.kind}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  loading={loadingKey === `${report.kind}:csv`}
                  onClick={() => void handleExport(report.kind, 'csv')}
                >
                  <Download className="size-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  loading={loadingKey === `${report.kind}:xls`}
                  onClick={() => void handleExport(report.kind, 'xls')}
                >
                  <FileSpreadsheet className="size-4" />
                  XLS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  loading={loadingKey === `${report.kind}:pdf`}
                  onClick={() => void handleExport(report.kind, 'pdf')}
                >
                  <Printer className="size-4" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
