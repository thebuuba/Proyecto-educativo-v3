import type { PlanningEntryWithDetails } from '@/modules/planning/types'

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

function formatDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function paragraph(value?: string | null) {
  return escapeHtml(value || 'Pendiente').replaceAll('\n', '<br>')
}

function section(title: string, body?: string | null) {
  return `
    <section class="doc-section">
      <h2>${escapeHtml(title)}</h2>
      <p>${paragraph(body)}</p>
    </section>
  `
}

export function buildPlanningDocumentHtml(entry: PlanningEntryWithDetails) {
  const course = `${entry.gradeName} ${entry.sectionName}`.trim()

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(entry.title)}</title>
  <style>
    body { color: #12213a; font-family: Arial, sans-serif; margin: 0; background: #f4f7fb; }
    main { background: #fff; margin: 32px auto; max-width: 860px; padding: 42px; box-shadow: 0 16px 40px rgba(15, 23, 42, .10); }
    header { border-bottom: 3px solid #1f4e95; padding-bottom: 18px; }
    .eyebrow { color: #1f4e95; font-size: 11px; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; }
    h1 { font-size: 26px; margin: 10px 0 6px; }
    .subtitle { color: #536176; margin: 0; }
    .meta { display: grid; gap: 10px; grid-template-columns: repeat(2, 1fr); margin: 24px 0; }
    .box { border: 1px solid #d9e2ef; border-radius: 8px; padding: 12px 14px; }
    .label { color: #536176; display: block; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .value { display: block; font-weight: 700; margin-top: 4px; }
    .doc-section { border-top: 1px solid #d9e2ef; padding: 16px 0; }
    .doc-section h2 { color: #1f4e95; font-size: 15px; margin: 0 0 8px; }
    .doc-section p { line-height: 1.55; margin: 0; }
    .moments { display: grid; gap: 12px; grid-template-columns: repeat(3, 1fr); }
    @media print {
      body { background: #fff; }
      main { box-shadow: none; margin: 0; max-width: none; padding: 24px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">Planificacion docente</div>
      <h1>${escapeHtml(entry.title)}</h1>
      <p class="subtitle">${escapeHtml(entry.subjectName)} · ${escapeHtml(course)} · ${escapeHtml(entry.periodName)}</p>
    </header>

    <div class="meta">
      <div class="box"><span class="label">Centro educativo</span><span class="value">${escapeHtml(entry.schoolNameSnapshot || entry.schoolName || 'AulaBase')}</span></div>
      <div class="box"><span class="label">Docente</span><span class="value">${escapeHtml(entry.teacherNameSnapshot || entry.teacherName || 'Docente')}</span></div>
      <div class="box"><span class="label">Area curricular</span><span class="value">${escapeHtml(entry.curricularArea || entry.subjectName)}</span></div>
      <div class="box"><span class="label">Tema</span><span class="value">${escapeHtml(entry.topic || entry.title)}</span></div>
      <div class="box"><span class="label">Grado y seccion</span><span class="value">${escapeHtml(course)}</span></div>
      <div class="box"><span class="label">Asignatura</span><span class="value">${escapeHtml(entry.subjectName)}</span></div>
      <div class="box"><span class="label">Tipo</span><span class="value">${escapeHtml(planningTypeLabels[entry.planningType ?? 'DAILY'])}</span></div>
      ${entry.planningType && entry.planningType !== 'DAILY' ? `<div class="box"><span class="label">Cantidad de dias</span><span class="value">${escapeHtml(entry.durationDays ?? 1)}</span></div>` : ''}
      <div class="box"><span class="label">Fecha</span><span class="value">${escapeHtml(formatDate(entry.plannedDate))}</span></div>
      <div class="box"><span class="label">Duracion</span><span class="value">${entry.durationMinutes ? `${entry.durationMinutes} minutos` : 'Pendiente'}</span></div>
      <div class="box"><span class="label">Periodo</span><span class="value">${escapeHtml(entry.periodName)}</span></div>
      <div class="box"><span class="label">Ano escolar</span><span class="value">${escapeHtml(entry.schoolYearName || 'Activo')}</span></div>
      <div class="box"><span class="label">Estado</span><span class="value">${escapeHtml(entry.status)}</span></div>
      <div class="box"><span class="label">Creada</span><span class="value">${escapeHtml(formatDate(entry.createdAt))}</span></div>
      <div class="box"><span class="label">Ultima modificacion</span><span class="value">${escapeHtml(formatDate(entry.updatedAt))}</span></div>
    </div>

    ${section('Competencias', entry.specificCompetence || entry.fundamentalCompetenceName || '')}
    ${section('Contenidos conceptuales', entry.contentConceptual)}
    ${section('Contenidos procedimentales', entry.contentProcedural)}
    ${section('Actitudes y valores', entry.contentAttitudinal)}
    ${section('Indicadores de logro', entry.achievementIndicator)}
    ${section('Intencion pedagogica', entry.evidence)}
    ${section('Eje transversal', entry.transversalAxis || 'No especificado')}
    ${entry.curriculumVersion ? section('Fuente curricular', `MINERD ${entry.curriculumVersion} · ${entry.curriculumOrdinance || 'Normativa no registrada'}${entry.curriculumSourcePages ? ` · paginas ${entry.curriculumSourcePages}` : ''}`) : ''}
    ${section('Estrategia de ensenanza', entry.strategies)}

    <section class="doc-section">
      <h2>Momentos de clase</h2>
      <div class="moments">
        <div class="box"><span class="label">Inicio</span><p>${paragraph(entry.activities?.inicio)}</p></div>
        <div class="box"><span class="label">Desarrollo</span><p>${paragraph(entry.activities?.desarrollo)}</p></div>
        <div class="box"><span class="label">Cierre</span><p>${paragraph(entry.activities?.cierre)}</p></div>
      </div>
    </section>

    ${section('Actividades', [entry.activities?.inicio, entry.activities?.desarrollo, entry.activities?.cierre].filter(Boolean).join('\n\n'))}
    ${section('Tecnicas de evaluacion', entry.evaluationMethod)}
    ${section('Instrumentos', entry.evaluationInstruments)}
    ${section('Recursos', entry.resources)}
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
  const blob = new Blob([buildPlanningDocumentHtml(entry)], {
    type: 'application/msword;charset=utf-8',
  })
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
