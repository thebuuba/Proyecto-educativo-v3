/** Panel de analítica y exportaciones académicas. */
import {
  CalendarCheck2,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState, type ComponentType } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  FeedbackBanner,
  MetricTile,
  PageHero,
  SectionHeader,
  SemanticIcon,
  type SemanticTone,
} from '@/components/ui/SemanticUI'
import { Select } from '@/components/ui/Select'
import { BarChart } from '@/modules/dashboard/components/BarChart'
import { LineChart } from '@/modules/dashboard/components/LineChart'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import {
  createReportExport,
  getReportSummary,
  type ExportFormat,
  type ExportReportKind,
  type ReportKind,
  type ReportSummary,
} from '@/modules/reports/services/reportExportService'

const reports: Array<{
  kind: ReportKind
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  tone: SemanticTone
}> = [
  { kind: 'boletin', title: 'Boletín por estudiante', description: 'Calificaciones, asignaturas y períodos para cada expediente.', icon: FileText, tone: 'info' },
  { kind: 'registro-grado', title: 'Registro de grado', description: 'Matrícula organizada por grado, sección y año escolar.', icon: ClipboardList, tone: 'warning' },
  { kind: 'asistencia', title: 'Asistencia', description: 'Registros diarios y por clase con estados y observaciones.', icon: CalendarCheck2, tone: 'success' },
  { kind: 'rendimiento', title: 'Rendimiento académico', description: 'Resultados por actividad, materia, período y estudiante.', icon: ChartNoAxesColumnIncreasing, tone: 'info' },
  { kind: 'promocion', title: 'Promoción y condición final', description: 'Decisiones finales y casos que todavía requieren revisión.', icon: GraduationCap, tone: 'success' },
]

export function ReportsPage() {
  const { schoolId } = useAuth()
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [exportKind, setExportKind] = useState<ExportReportKind>('todos')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xls')
  const [actionsOpen, setActionsOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    if (!schoolId) {
      setSummaryLoading(false)
      return () => { active = false }
    }
    setSummaryLoading(true)
    getReportSummary()
      .then((data) => { if (active) setSummary(data) })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el resumen.') })
      .finally(() => { if (active) setSummaryLoading(false) })
    return () => { active = false }
  }, [schoolId])

  useEffect(() => {
    if (!actionsOpen) return
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setActionsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setActionsOpen(false)
      actionsRef.current?.querySelector('button')?.focus()
    }
    document.addEventListener('pointerdown', closeOnPointerDown)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [actionsOpen])

  async function handleExport(kind: ExportReportKind, format: ExportFormat) {
    if (!schoolId || loadingKey) return
    const key = `${kind}:${format}`
    const printWindow = format === 'pdf' ? window.open('', '_blank') : null
    if (format === 'pdf' && !printWindow) {
      setError('Permite las ventanas emergentes para abrir la vista de impresión en PDF.')
      return
    }
    if (printWindow) printWindow.document.write('<p style="font-family:sans-serif;padding:24px">Preparando documento…</p>')
    setLoadingKey(key)
    setError(null)
    setMessage(null)

    try {
      const payload = await createReportExport(kind, format)
      if (payload.disposition === 'print' && printWindow) {
        printWindow.document.open()
        printWindow.document.write(payload.content)
        printWindow.document.close()
        printWindow.focus()
        window.setTimeout(() => printWindow.print(), 250)
        setMessage('Documento listo. Selecciona “Guardar como PDF” en el diálogo de impresión.')
      } else {
        downloadPayload(payload)
        setMessage(kind === 'todos' ? 'Todos los reportes se exportaron en un solo archivo.' : 'Reporte exportado correctamente.')
      }
      setActionsOpen(false)
    } catch (requestError) {
      printWindow?.close()
      setError(requestError instanceof Error ? requestError.message : 'No se pudo generar el reporte.')
    } finally {
      setLoadingKey(null)
    }
  }

  const attendanceTrend = summary?.attendanceByMonth
    .filter((item): item is { label: string; value: number } => item.value !== null) ?? []
  const promotionTotal = summary ? summary.promotion.promoted + summary.promotion.pending + summary.promotion.retained : 0
  const promotedPercent = promotionTotal ? (summary!.promotion.promoted / promotionTotal) * 100 : 0
  const pendingPercent = promotionTotal ? (summary!.promotion.pending / promotionTotal) * 100 : 0

  const actions = (
    <div ref={actionsRef} className="relative">
      <Button aria-expanded={actionsOpen} aria-controls="report-export-actions" aria-haspopup="dialog" onClick={() => setActionsOpen((open) => !open)}>
        <Download className="size-4" /> Acciones <ChevronDown className={`size-4 transition-transform ${actionsOpen ? 'rotate-180' : ''}`} />
      </Button>
      {actionsOpen ? (
        <div id="report-export-actions" role="dialog" aria-label="Exportar reportes" className="absolute right-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 text-foreground shadow-xl">
          <p className="text-sm font-extrabold">Exportar reportes</p>
          <p className="mt-1 text-xs text-muted-foreground">Selecciona el contenido y el formato de salida.</p>
          <label className="mt-4 block text-xs font-bold text-muted-foreground">
            Reporte
            <Select value={exportKind} onChange={(event) => setExportKind(event.target.value as ExportReportKind)} className="mt-1.5 h-10">
              <option value="todos">Todos los reportes</option>
              {reports.map((report) => <option key={report.kind} value={report.kind}>{report.title}</option>)}
            </Select>
          </label>
          <label className="mt-3 block text-xs font-bold text-muted-foreground">
            Formato
            <Select value={exportFormat} onChange={(event) => setExportFormat(event.target.value as ExportFormat)} className="mt-1.5 h-10">
              <option value="xls">Excel (.xls)</option>
              <option value="csv">Datos (.csv)</option>
              <option value="pdf">Imprimir / PDF</option>
            </Select>
          </label>
          <Button className="mt-4 w-full" loading={loadingKey === `${exportKind}:${exportFormat}`} disabled={loadingKey !== null} onClick={() => void handleExport(exportKind, exportFormat)}>
            <Download className="size-4" /> Exportar
          </Button>
        </div>
      ) : null}
    </div>
  )

  return (
    <section className="w-full min-w-0 space-y-5">
      <PageHero
        title="Reportes"
        description="Analiza el estado académico del centro y exporta los documentos que necesites."
        icon={ChartNoAxesColumnIncreasing}
        tone="info"
        actions={actions}
      >
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{summary?.schoolYearName ?? 'Año escolar actual'}</span>
          {summary ? <span>Actualizado {new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(summary.generatedAt))}</span> : null}
        </div>
      </PageHero>

      {error ? <FeedbackBanner role="alert" tone="danger">{error}</FeedbackBanner> : null}
      {message ? <FeedbackBanner tone="success">{message}</FeedbackBanner> : null}

      <SectionHeader title="Resumen ejecutivo" description="Indicadores principales del período académico actual." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={Users} label="Estudiantes activos" value={summaryLoading ? '…' : (summary?.totals.students ?? '—')} tone="info" />
        <MetricTile icon={CalendarCheck2} label="Asistencia acumulada" value={summaryLoading ? '…' : (percent(summary?.totals.attendanceRate) ?? '—')} tone="success" />
        <MetricTile icon={TrendingUp} label="Promedio académico" value={summaryLoading ? '…' : (percent(summary?.totals.academicAverage) ?? '—')} tone="info" />
        <MetricTile icon={GraduationCap} label="Promoción confirmada" value={summaryLoading ? '…' : (summary?.totals.promoted ?? '—')} tone="success" />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader><CardTitle>Tendencia de asistencia</CardTitle><CardDescription>Porcentaje mensual de presentes y tardanzas.</CardDescription></CardHeader>
          <CardContent><LineChart data={attendanceTrend} ariaLabel="Tendencia mensual de asistencia" emptyMessage="Registra asistencia para ver la tendencia." /></CardContent>
        </Card>
        <Card className="xl:col-span-4">
          <CardHeader><CardTitle>Rendimiento por grado</CardTitle><CardDescription>Promedio porcentual, ordenado de mayor a menor.</CardDescription></CardHeader>
          <CardContent><BarChart data={summary?.performanceByGrade.slice(0, 10) ?? []} ariaLabel="Promedio académico por grado" emptyMessage="Publica calificaciones para comparar los grados." /></CardContent>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader><CardTitle>Condición final</CardTitle><CardDescription>Estado de las decisiones de promoción.</CardDescription></CardHeader>
          <CardContent className="flex min-h-64 flex-col items-center justify-center">
            {promotionTotal ? (
              <>
                <div role="img" aria-label={`${summary!.promotion.promoted} promovidos, ${summary!.promotion.pending} pendientes y ${summary!.promotion.retained} no promovidos`} className="relative size-36 rounded-full" style={{ background: `conic-gradient(var(--success) 0 ${promotedPercent}%, var(--warning) ${promotedPercent}% ${promotedPercent + pendingPercent}%, var(--destructive) ${promotedPercent + pendingPercent}% 100%)` }}>
                  <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-card"><span className="text-3xl font-extrabold">{promotionTotal}</span><span className="text-xs text-muted-foreground">estudiantes</span></div>
                </div>
                <div className="mt-5 grid w-full gap-2 text-xs font-semibold">
                  <Legend color="bg-success" label="Promovidos" value={summary!.promotion.promoted} />
                  <Legend color="bg-warning" label="Pendientes" value={summary!.promotion.pending} />
                  <Legend color="bg-destructive" label="No promovidos" value={summary!.promotion.retained} />
                </div>
              </>
            ) : <p className="text-center text-sm font-medium text-muted-foreground">Aún no hay decisiones finales registradas.</p>}
          </CardContent>
        </Card>
      </div>

      <SectionHeader title="Biblioteca de reportes" description="Cada documento conserva la misma semántica visual del sistema." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon
          return (
            <Card key={report.kind} className="flex min-h-44 flex-col transition-shadow hover:shadow-md">
              <CardHeader className="flex-1 border-b-0">
                <SemanticIcon icon={Icon} tone={report.tone} className="mb-4" />
                <CardTitle>{report.title}</CardTitle>
                <CardDescription className="leading-5">{report.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return <div className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${color}`} /><span className="flex-1 text-muted-foreground">{label}</span><span className="text-foreground">{value}</span></div>
}

function percent(value: number | null | undefined) {
  return value === null || value === undefined ? null : `${value}%`
}

function downloadPayload(payload: { filename: string; mimeType: string; content: string }) {
  const url = URL.createObjectURL(new Blob([payload.content], { type: payload.mimeType }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = payload.filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
