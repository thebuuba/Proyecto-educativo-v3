import type { PlanningDay, PlanningEntryWithDetails } from '@/modules/planning/types'

const planningTypeLabels = {
  DAILY: 'Planificación diaria',
  UNIT: 'Unidad de aprendizaje',
  SEQUENCE: 'Secuencia didáctica',
} as const

function escapeHtml(value?: string | number | null) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('`', '&#96;')
}

function paragraph(value?: string | null) {
  return escapeHtml(value || 'Pendiente').replaceAll('\n', '<br>')
}

function formatDate(value?: string | null) {
  if (!value) return 'Pendiente'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-DO', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

function planningRows(entry: PlanningEntryWithDetails): PlanningDay[] {
  if (entry.activities?.days?.length) return entry.activities.days
  return [{
    day: 1,
    date: entry.plannedDate,
    inicio: entry.activities?.inicio ?? '',
    desarrollo: entry.activities?.desarrollo ?? '',
    cierre: entry.activities?.cierre ?? '',
    evidence: entry.evidence,
    evaluationMethod: entry.evaluationMethod,
    evaluationInstruments: entry.evaluationInstruments,
    metacognition: entry.activities?.metacognition,
    resources: entry.resources,
  }]
}

function infoCell(label: string, value?: string | number | null) {
  return `<td><span class="label">${escapeHtml(label)}</span><strong>${escapeHtml(value || 'Pendiente')}</strong></td>`
}

function curriculumCell(title: string, value?: string | null) {
  return `<td><span class="curriculum-title">${escapeHtml(title)}</span><p>${paragraph(value)}</p></td>`
}

function sequenceRows(entry: PlanningEntryWithDetails) {
  return planningRows(entry).map((day) => `
    <tr>
      <td class="date"><strong>Día ${escapeHtml(day.day)}</strong><br>${escapeHtml(formatDate(day.date))}</td>
      <td class="activities">
        <p><strong>Inicio:</strong> ${paragraph(day.inicio)}</p>
        <p><strong>Desarrollo:</strong> ${paragraph(day.desarrollo)}</p>
        <p><strong>Cierre:</strong> ${paragraph(day.cierre)}</p>
      </td>
      <td>${paragraph(day.evidence || entry.evidence)}</td>
      <td><strong>Técnica</strong><p>${paragraph(day.evaluationMethod || entry.evaluationMethod)}</p><strong>Instrumento</strong><p>${paragraph(day.evaluationInstruments || entry.evaluationInstruments)}</p></td>
      <td>${paragraph(day.metacognition || day.cierre)}</td>
      <td>${paragraph(day.resources || entry.resources)}</td>
    </tr>
  `).join('')
}

export function buildPlanningDocumentHtml(entry: PlanningEntryWithDetails) {
  const course = `${entry.gradeName} ${entry.sectionName}`.trim()
  const rows = planningRows(entry)
  const duration = entry.planningType && entry.planningType !== 'DAILY'
    ? `${entry.durationDays ?? rows.length} días - ${entry.durationMinutes ?? '—'} minutos`
    : `${entry.durationMinutes ?? '—'} minutos`

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(entry.title)}</title>
  <style>
    @page { size: A4 landscape; margin: 9mm; }
    * { box-sizing: border-box; }
    body { background: #eef3f9; color: #17233a; font-family: Arial, Helvetica, sans-serif; font-size: 10px; margin: 0; }
    main { background: #fff; border: 1px solid #cbd8e8; margin: 20px auto; max-width: 1120px; }
    .hero { background: #1f4e95; color: #fff; padding: 16px 18px; }
    .hero-table { border: 0; color: #fff; width: 100%; }
    .hero-table td { border: 0; padding: 0; vertical-align: middle; }
    .hero-table td:last-child { text-align: right; }
    .eyebrow { font-size: 8px; font-weight: 700; letter-spacing: .2em; opacity: .75; text-transform: uppercase; }
    h1 { font-size: 20px; margin: 4px 0 0; }
    .content { padding: 14px; }
    .band { background: #1f4e95; color: #fff; font-size: 9px; font-weight: 700; letter-spacing: .13em; margin: 12px 0 0; padding: 6px 8px; text-transform: uppercase; }
    table { border-collapse: collapse; table-layout: fixed; width: 100%; }
    td, th { border: 1px solid #cbd8e8; padding: 7px; vertical-align: top; }
    .meta td { width: 25%; }
    .label, .curriculum-title { color: #627087; display: block; font-size: 7px; font-weight: 700; letter-spacing: .1em; margin-bottom: 3px; text-transform: uppercase; }
    .curriculum-title { color: #1f4e95; font-size: 8px; }
    p { line-height: 1.4; margin: 0; }
    .context td { width: 50%; }
    .sequence thead { display: table-header-group; }
    .sequence th { background: #eaf1fa; color: #1f4e95; font-size: 8px; letter-spacing: .05em; text-align: left; text-transform: uppercase; }
    .sequence tbody tr { break-inside: avoid; page-break-inside: avoid; }
    .sequence tbody tr:nth-child(even) { background: #f7f9fc; }
    .sequence .date { width: 10%; }
    .sequence .activities { width: 34%; }
    .sequence th:nth-child(3) { width: 14%; }
    .sequence th:nth-child(4) { width: 16%; }
    .sequence th:nth-child(5), .sequence th:nth-child(6) { width: 13%; }
    .activities p { margin-bottom: 6px; }
    .activities p:last-child { margin-bottom: 0; }
    .source { border-top: 1px solid #cbd8e8; color: #627087; display: flex; font-size: 8px; justify-content: space-between; margin-top: 10px; padding-top: 7px; }
    @media print {
      body { background: #fff; }
      main { border: 0; margin: 0; max-width: none; }
      .content { padding: 10px 0 0; }
      .hero { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .band, .sequence th { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <main>
    <header class="hero">
      <table class="hero-table"><tr><td><div class="eyebrow">Planificación docente</div><h1>${escapeHtml(entry.title)}</h1></td><td><strong>${escapeHtml(entry.schoolNameSnapshot || entry.schoolName || 'AulaBase')}</strong><br>${escapeHtml(planningTypeLabels[entry.planningType ?? 'DAILY'])}</td></tr></table>
    </header>
    <div class="content">
      <h2 class="band">Datos generales</h2>
      <table class="meta">
        <tr>${infoCell('Docente', entry.teacherNameSnapshot || entry.teacherName || 'Docente')}${infoCell('Área / asignatura', `${entry.curricularArea || entry.subjectName} - ${entry.subjectName}`)}${infoCell('Grado y sección', course)}${infoCell('Período', `${entry.periodName} - ${entry.schoolYearName || 'Año activo'}`)}</tr>
        <tr>${infoCell('Tema', entry.topic || entry.title)}${infoCell('Fecha', formatDate(entry.plannedDate))}${infoCell('Duración', duration)}${infoCell('Eje transversal', entry.transversalAxis || 'No especificado')}</tr>
      </table>

      <h2 class="band">Articulación curricular</h2>
      <table>
        <tr>${curriculumCell('Competencias fundamentales', entry.fundamentalCompetencies?.join('\n') || entry.fundamentalCompetenceName)}${curriculumCell('Competencias específicas', entry.specificCompetence)}${curriculumCell('Indicadores de logro', entry.achievementIndicator)}</tr>
        <tr>${curriculumCell('Contenidos conceptuales', entry.contentConceptual)}${curriculumCell('Contenidos procedimentales', entry.contentProcedural)}${curriculumCell('Actitudes y valores', entry.contentAttitudinal)}</tr>
      </table>

      <table class="context">
        <tr>${curriculumCell('Situación de aprendizaje', entry.activities?.learningSituation || entry.topic || entry.evidence)}${curriculumCell('Estrategia de enseñanza y aprendizaje', entry.strategies)}</tr>
      </table>

      <h2 class="band">Secuencia didáctica</h2>
      <table class="sequence">
        <thead><tr><th>Fecha</th><th>Actividades de aprendizaje</th><th>Evidencias</th><th>Evaluación</th><th>Metacognición</th><th>Recursos</th></tr></thead>
        <tbody>${sequenceRows(entry)}</tbody>
      </table>

      <footer class="source"><span>Fuente curricular: MINERD ${escapeHtml(entry.curriculumVersion || 'currículo vigente')} - ${escapeHtml(entry.curriculumOrdinance || 'normativa aplicable')}${entry.curriculumSourcePages ? ` - páginas ${escapeHtml(entry.curriculumSourcePages)}` : ''}</span><span>AulaBase - ${escapeHtml(formatDate(entry.updatedAt))}</span></footer>
    </div>
  </main>
</body>
</html>`
}

function filename(entry: PlanningEntryWithDetails, extension: string) {
  const safeTitle = entry.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return `${safeTitle || 'planificacion'}.${extension}`
}

export function exportPlanningToWord(entry: PlanningEntryWithDetails) {
  const blob = new Blob([buildPlanningDocumentHtml(entry)], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename(entry, 'doc')
  link.click()
  URL.revokeObjectURL(url)
}

export function exportPlanningToPdf(entry: PlanningEntryWithDetails) {
  const printWindow = window.open('', 'planning-print', 'noopener,noreferrer')
  if (!printWindow) return
  printWindow.document.open()
  printWindow.document.write(buildPlanningDocumentHtml(entry))
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}
