/** Servicio de reportes académicos, analítica y exportaciones. */
import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'
import { ExportReportDto, reportKinds } from './dto/export-report.dto'

type ReportKind = Exclude<(typeof reportKinds)[number], 'todos'>
type ReportCell = string | number | null
type ReportSection = { title: string; columns: string[]; rows: ReportCell[][] }

const reportTitles: Record<ReportKind, string> = {
  boletin: 'Boletín por estudiante',
  'registro-grado': 'Registro de grado',
  asistencia: 'Asistencia',
  rendimiento: 'Rendimiento académico',
  promocion: 'Promoción y condición final',
}

@Injectable()
export class ReportsService {
  /** Obtiene el reporte de calificaciones de un estudiante. */
  async getStudentReport(schoolId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId, studentId },
      select: { id: true },
    })
    return prisma.gradesRecord.findMany({
      where: { schoolId, enrollmentId: { in: enrollments.map(({ id }) => id) } },
    })
  }

  /** Datos agregados que alimentan los indicadores y gráficas del panel. */
  async getSummary(schoolId: string, today = new Date()) {
    const schoolYears = await prisma.schoolYear.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
      select: { id: true, name: true, isCurrent: true },
    })
    const currentYear = schoolYears.find(({ isCurrent }) => isCurrent) ?? schoolYears[0] ?? null
    const yearFilter = currentYear ? { schoolYearId: currentYear.id } : {}
    const [enrollments, dailyAttendance, classAttendance, grades] = await Promise.all([
      prisma.enrollment.findMany({
        where: { schoolId, status: 'ACTIVE', ...yearFilter },
        select: { studentId: true, promotionStatus: true, finalCondition: true },
      }),
      prisma.attendanceDaily.findMany({
        where: { schoolId, ...yearFilter },
        select: { attendanceDate: true, status: true },
      }),
      prisma.attendanceClass.findMany({
        where: { schoolId, ...yearFilter },
        select: { attendanceDate: true, status: true },
      }),
      prisma.gradesRecord.findMany({
        where: { schoolId, status: { not: 'VOIDED' }, ...yearFilter },
        select: {
          score: true,
          maxScore: true,
          enrollment: { select: { grade: { select: { name: true } } } },
        },
      }),
    ])

    const attendance = [...dailyAttendance, ...classAttendance]
    const promotion = promotionCounts(enrollments)
    const gradeGroups = new Map<string, number[]>()
    grades.forEach(({ score, maxScore, enrollment }) => {
      const percentage = scorePercentage(score, maxScore)
      if (percentage === null) return
      const name = enrollment.grade.name
      gradeGroups.set(name, [...(gradeGroups.get(name) ?? []), percentage])
    })

    return {
      schoolYearName: currentYear?.name ?? 'Todos los períodos',
      totals: {
        students: new Set(enrollments.map(({ studentId }) => studentId)).size,
        attendanceRate: attendancePercentage(attendance),
        academicAverage: average(grades.map(({ score, maxScore }) => scorePercentage(score, maxScore))),
        promoted: promotion.promoted,
      },
      attendanceByMonth: lastMonths(today, 6).map(({ key, label }) => ({
        label,
        value: attendancePercentage(attendance.filter(({ attendanceDate }) => monthKey(attendanceDate) === key)),
      })),
      performanceByGrade: Array.from(gradeGroups, ([label, values]) => ({
        label,
        value: average(values) ?? 0,
      })).sort((a, b) => b.value - a.value),
      promotion,
      generatedAt: today.toISOString(),
    }
  }

  /** Genera un archivo individual o un documento con todos los reportes. */
  async exportReport(schoolId: string, dto: ExportReportDto) {
    // Conserva el contrato histórico de exportación de calificaciones.
    if (!dto.kind && !dto.format) return this.exportLegacyGrades(schoolId, dto)

    const kind = dto.kind ?? 'rendimiento'
    const format = dto.format ?? 'csv'
    const school = await prisma.school.findFirst({
      where: { id: schoolId },
      select: { name: true, centerCode: true },
    })
    const kinds = kind === 'todos'
      ? (Object.keys(reportTitles) as ReportKind[])
      : [kind]
    const sections = await Promise.all(kinds.map((item) => this.getReportSection(schoolId, item)))
    return buildExportPayload(sections, format, school?.name ?? 'Centro educativo', school?.centerCode)
  }

  private async exportLegacyGrades(schoolId: string, dto: ExportReportDto) {
    if (dto.type === 'student') {
      const student = await prisma.student.findFirst({ where: { id: dto.studentId, schoolId } })
      return { type: 'student', student, records: await this.getStudentReport(schoolId, dto.studentId ?? ''), generatedAt: new Date().toISOString() }
    }
    const records = await prisma.gradesRecord.findMany({
      where: {
        schoolId,
        ...(dto.sectionSubjectId ? { sectionSubjectId: dto.sectionSubjectId } : {}),
        ...(dto.academicPeriodId ? { academicPeriodId: dto.academicPeriodId } : {}),
      },
    })
    return { type: 'grades', records, generatedAt: new Date().toISOString() }
  }

  private async getReportSection(schoolId: string, kind: ReportKind): Promise<ReportSection> {
    if (kind === 'registro-grado' || kind === 'promocion') {
      const records = await prisma.enrollment.findMany({
        where: { schoolId },
        orderBy: [{ grade: { sequence: 'asc' } }, { student: { lastName: 'asc' } }],
        select: {
          student: { select: { studentCode: true, firstName: true, lastName: true } },
          schoolYear: { select: { name: true } },
          grade: { select: { name: true } },
          section: { select: { name: true } },
          academicStatus: true,
          promotionStatus: true,
          finalCondition: true,
        },
      })
      const columns = kind === 'registro-grado'
        ? ['Código', 'Apellidos', 'Nombres', 'Grado', 'Sección', 'Año escolar', 'Estado']
        : ['Código', 'Estudiante', 'Grado', 'Sección', 'Promoción', 'Condición final']
      return {
        title: reportTitles[kind],
        columns,
        rows: records.map((record) => kind === 'registro-grado'
          ? [record.student.studentCode, record.student.lastName, record.student.firstName, record.grade.name, record.section.name, record.schoolYear.name, record.academicStatus]
          : [record.student.studentCode, `${record.student.firstName} ${record.student.lastName}`, record.grade.name, record.section.name, record.promotionStatus, record.finalCondition]),
      }
    }

    if (kind === 'asistencia') {
      const selection = {
        attendanceDate: true,
        status: true,
        notes: true,
        enrollment: { select: { student: { select: { studentCode: true, firstName: true, lastName: true } } } },
        section: { select: { grade: { select: { name: true } }, name: true } },
      } as const
      const [daily, byClass] = await Promise.all([
        prisma.attendanceDaily.findMany({ where: { schoolId }, select: selection, orderBy: { attendanceDate: 'desc' } }),
        prisma.attendanceClass.findMany({ where: { schoolId }, select: selection, orderBy: { attendanceDate: 'desc' } }),
      ])
      return {
        title: reportTitles[kind],
        columns: ['Fecha', 'Código', 'Estudiante', 'Grado', 'Sección', 'Tipo', 'Estado', 'Notas'],
        rows: [
          ...daily.map((record) => attendanceRow(record, 'Diaria')),
          ...byClass.map((record) => attendanceRow(record, 'Por clase')),
        ],
      }
    }

    const records = await prisma.gradesRecord.findMany({
      where: { schoolId, status: { not: 'VOIDED' } },
      orderBy: { createdAt: 'desc' },
      select: {
        assessmentName: true,
        score: true,
        maxScore: true,
        weight: true,
        status: true,
        enrollment: { select: { student: { select: { studentCode: true, firstName: true, lastName: true } }, grade: { select: { name: true } }, section: { select: { name: true } } } },
        sectionSubject: { select: { subject: { select: { name: true } } } },
        academicPeriod: { select: { name: true } },
      },
    })
    return {
      title: reportTitles[kind],
      columns: ['Código', 'Estudiante', 'Grado', 'Sección', 'Asignatura', 'Período', 'Actividad', 'Calificación', 'Máximo', 'Porcentaje', 'Estado'],
      rows: records.map((record) => [
        record.enrollment.student.studentCode,
        `${record.enrollment.student.firstName} ${record.enrollment.student.lastName}`,
        record.enrollment.grade.name,
        record.enrollment.section.name,
        record.sectionSubject.subject.name,
        record.academicPeriod.name,
        record.assessmentName,
        Number(record.score),
        Number(record.maxScore),
        scorePercentage(record.score, record.maxScore),
        record.status,
      ]),
    }
  }
}

function attendanceRow(record: {
  attendanceDate: Date
  status: string
  notes: string | null
  enrollment: { student: { studentCode: string; firstName: string; lastName: string } }
  section: { grade: { name: string }; name: string }
}, type: string): ReportCell[] {
  return [record.attendanceDate.toISOString().slice(0, 10), record.enrollment.student.studentCode, `${record.enrollment.student.firstName} ${record.enrollment.student.lastName}`, record.section.grade.name, record.section.name, type, record.status, record.notes]
}

function scorePercentage(score: { toString(): string }, maxScore: { toString(): string }) {
  const max = Number(maxScore)
  return max > 0 ? Math.round((Number(score) / max) * 100) : null
}

function average(values: Array<number | null>) {
  const valid = values.filter((value): value is number => value !== null)
  return valid.length ? Math.round(valid.reduce((total, value) => total + value, 0) / valid.length) : null
}

function attendancePercentage(records: Array<{ status: string }>) {
  if (!records.length) return null
  const attended = records.filter(({ status }) => status === 'PRESENT' || status === 'LATE').length
  return Math.round((attended / records.length) * 100)
}

function promotionCounts(records: Array<{ promotionStatus: string | null; finalCondition: string | null }>) {
  return records.reduce((counts, record) => {
    const value = `${record.promotionStatus ?? ''} ${record.finalCondition ?? ''}`.trim().toLowerCase()
    if (!value) counts.pending += 1
    else if (value.includes('promov') || value.includes('aprob')) counts.promoted += 1
    else counts.retained += 1
    return counts
  }, { promoted: 0, pending: 0, retained: 0 })
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function lastMonths(today: Date, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - count + index + 1, 1))
    return { key: monthKey(date), label: new Intl.DateTimeFormat('es-DO', { month: 'short' }).format(date).replace('.', '') }
  })
}

export function buildExportPayload(sections: ReportSection[], format: 'csv' | 'xls' | 'pdf', schoolName: string, centerCode?: string | null) {
  const baseName = sections.length > 1 ? 'reportes-completos' : slug(sections[0]?.title ?? 'reporte')
  if (format === 'csv') {
    const content = sections.flatMap((section) => [
      [section.title], section.columns, ...section.rows, [],
    ]).map((row) => row.map(csvCell).join(',')).join('\n')
    return { filename: `${baseName}.csv`, mimeType: 'text/csv;charset=utf-8', content: `\uFEFF${content}`, disposition: 'download' as const }
  }

  const tables = sections.map((section) => `<section><h2>${html(section.title)}</h2><table><thead><tr>${section.columns.map((column) => `<th>${html(column)}</th>`).join('')}</tr></thead><tbody>${section.rows.map((row) => `<tr>${row.map((cell) => `<td>${html(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`).join('')
  const document = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${html(baseName)}</title><style>body{font:12px Arial,sans-serif;color:#172033;margin:28px}header{border-bottom:3px solid #1e4f8f;margin-bottom:24px;padding-bottom:12px}h1{margin:0;color:#1e4f8f}h2{margin:24px 0 8px;page-break-after:avoid}table{border-collapse:collapse;width:100%;margin-bottom:24px}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#edf4fb}tr:nth-child(even){background:#f8fafc}@media print{body{margin:0}section{break-inside:avoid}}</style></head><body><header><h1>${html(schoolName)}</h1><p>${centerCode ? `Código: ${html(centerCode)} · ` : ''}Generado: ${new Date().toLocaleString('es-DO')}</p></header>${tables}</body></html>`
  return format === 'xls'
    ? { filename: `${baseName}.xls`, mimeType: 'application/vnd.ms-excel;charset=utf-8', content: document, disposition: 'download' as const }
    : { filename: `${baseName}.pdf`, mimeType: 'text/html;charset=utf-8', content: document, disposition: 'print' as const }
}

function csvCell(value: ReportCell) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function html(value: ReportCell) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
}

function slug(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
