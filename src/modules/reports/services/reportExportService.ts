import { supabase } from '@/services/supabase'
import { assertNoSupabaseError } from '@/utils/helpers'
import type { SchoolProfile } from '@/modules/settings/types'

type ExportFormat = 'csv' | 'xls' | 'pdf'
type ReportKind = 'boletin' | 'registro-grado' | 'asistencia' | 'rendimiento' | 'promocion'

type ExportPayload = {
  filename: string
  mimeType: string
  content: string
}

type SchoolHeader = Pick<
  SchoolProfile,
  | 'name'
  | 'sector'
  | 'regionalCode'
  | 'regionalName'
  | 'districtCode'
  | 'districtName'
  | 'centerCode'
  | 'schoolShift'
>

type StudentExportRow = {
  student_code: string
  first_name: string
  last_name: string
  document_id: string | null
  birth_date: string
  gender: string | null
  status: string
}

type AttendanceExportRow = {
  attendance_date: string
  status: string
  enrollments: {
    students: {
      student_code: string
      first_name: string
      last_name: string
    } | null
    grades: { name: string } | null
    sections: { name: string } | null
  } | null
}

type YearlyAverageRow = {
  student_id: string | null
  subject_id: string | null
  grade_id: string | null
  section_id: string | null
  yearly_average_percent: number | null
  period_count: number | null
  all_periods_passing: boolean | null
  min_passing_percent: number | null
}

export async function createReportExport(
  schoolId: string,
  kind: ReportKind,
  format: ExportFormat,
): Promise<ExportPayload> {
  const [school, currentYear] = await Promise.all([
    getSchoolHeader(schoolId),
    getCurrentSchoolYearName(),
  ])

  const rows = await getRows(kind)
  const title = getReportTitle(kind)
  const table = [
    ['Centro', school.name],
    ['Código centro', school.centerCode ?? ''],
    ['Regional', formatCodeName(school.regionalCode, school.regionalName)],
    ['Distrito', formatCodeName(school.districtCode, school.districtName)],
    ['Sector', school.sector],
    ['Jornada', school.schoolShift],
    ['Año escolar', currentYear],
    [],
    ...rows,
  ]

  if (format === 'pdf') {
    return {
      filename: `${kind}.pdf`,
      mimeType: 'application/pdf',
      content: toSimplePdf(title, table),
    }
  }

  return {
    filename: `${kind}.${format === 'xls' ? 'xls' : 'csv'}`,
    mimeType: format === 'xls'
      ? 'application/vnd.ms-excel;charset=utf-8'
      : 'text/csv;charset=utf-8',
    content: toDelimited(table, format === 'xls' ? '\t' : ','),
  }
}

async function getSchoolHeader(schoolId: string): Promise<SchoolHeader> {
  const { data, error } = await supabase
    .from('schools')
    .select('name, sector, regional_code, regional_name, district_code, district_name, center_code, school_shift')
    .eq('id', schoolId)
    .single()

  assertNoSupabaseError(error, 'No se pudo cargar la institución para exportar.')

  if (!data) {
    throw new Error('No se encontró la institución.')
  }

  return {
    name: data.name,
    sector: mapSector(data.sector),
    regionalCode: data.regional_code,
    regionalName: data.regional_name,
    districtCode: data.district_code,
    districtName: data.district_name,
    centerCode: data.center_code,
    schoolShift: mapShift(data.school_shift),
  }
}

async function getCurrentSchoolYearName() {
  const { data, error } = await supabase
    .from('school_years')
    .select('name')
    .eq('is_current', true)
    .maybeSingle()

  assertNoSupabaseError(error, 'No se pudo cargar el año escolar.')
  return data?.name ?? ''
}

async function getRows(kind: ReportKind): Promise<string[][]> {
  if (kind === 'asistencia') {
    const { data, error } = await supabase
      .from('attendance_daily')
      .select(`
        attendance_date,
        status,
        enrollments(
          students(student_code, first_name, last_name),
          grades(name),
          sections(name)
        )
      `)
      .order('attendance_date', { ascending: false })
      .limit(500)

    assertNoSupabaseError(error, 'No se pudo generar el reporte de asistencia.')
    return [
      ['Fecha', 'Código', 'Estudiante', 'Grado', 'Sección', 'Estado'],
      ...((data ?? []) as AttendanceExportRow[]).map((row) => {
        const student = row.enrollments?.students
        return [
          row.attendance_date,
          student?.student_code ?? '',
          student ? `${student.first_name} ${student.last_name}` : '',
          row.enrollments?.grades?.name ?? '',
          row.enrollments?.sections?.name ?? '',
          row.status,
        ]
      }),
    ]
  }

  if (kind === 'rendimiento' || kind === 'promocion' || kind === 'boletin' || kind === 'registro-grado') {
    const { data, error } = await supabase
      .from('student_yearly_averages')
      .select('student_id, subject_id, grade_id, section_id, yearly_average_percent, period_count, all_periods_passing, min_passing_percent')
      .limit(500)

    assertNoSupabaseError(error, 'No se pudo generar el reporte de rendimiento.')
    const averages = (data ?? []) as YearlyAverageRow[]
    if (averages.length === 0 && (kind === 'boletin' || kind === 'registro-grado')) {
      return getStudentRosterRows(kind)
    }

    const [students, subjects, grades, sections] = await Promise.all([
      getLookup('students', averages.map((row) => row.student_id), 'student_code, first_name, last_name'),
      getLookup('subjects', averages.map((row) => row.subject_id), 'name'),
      getLookup('grades', averages.map((row) => row.grade_id), 'name'),
      getLookup('sections', averages.map((row) => row.section_id), 'name'),
    ])

    const header = kind === 'promocion'
      ? ['Código', 'Estudiante', 'Grado', 'Sección', 'Asignaturas', 'Aprobadas', 'En revisión', 'Condición final']
      : ['Código', 'Estudiante', 'Grado', 'Sección', 'Asignatura', 'Promedio anual', 'Mínima', 'Períodos', 'Condición']

    if (kind === 'promocion') {
      const byStudent = new Map<string, {
        student: Record<string, unknown> | undefined
        grade: string
        section: string
        total: number
        passed: number
        review: number
      }>()

      for (const row of averages) {
        const studentId = row.student_id ?? ''
        const current = byStudent.get(studentId) ?? {
          student: students.get(studentId),
          grade: getString(grades.get(row.grade_id ?? ''), 'name'),
          section: getString(sections.get(row.section_id ?? ''), 'name'),
          total: 0,
          passed: 0,
          review: 0,
        }

        current.total += 1
        if (row.all_periods_passing) current.passed += 1
        else current.review += 1
        byStudent.set(studentId, current)
      }

      return [
        header,
        ...Array.from(byStudent.values()).map((row) => [
          getString(row.student, 'student_code'),
          row.student ? `${getString(row.student, 'first_name')} ${getString(row.student, 'last_name')}` : '',
          row.grade,
          row.section,
          row.total.toString(),
          row.passed.toString(),
          row.review.toString(),
          row.review === 0 ? 'Promovido' : 'Revisión/recuperación',
        ]),
      ]
    }

    const title = kind === 'boletin'
      ? 'Boletín académico por asignatura'
      : kind === 'registro-grado'
        ? 'Registro de grado por asignatura'
        : 'Rendimiento académico'

    return [
      [title],
      header,
      ...averages.map((row) => {
        const student = students.get(row.student_id ?? '')
        return [
          getString(student, 'student_code'),
          student ? `${getString(student, 'first_name')} ${getString(student, 'last_name')}` : '',
          getString(grades.get(row.grade_id ?? ''), 'name'),
          getString(sections.get(row.section_id ?? ''), 'name'),
          getString(subjects.get(row.subject_id ?? ''), 'name'),
          row.yearly_average_percent?.toString() ?? '',
          row.min_passing_percent?.toString() ?? '',
          row.period_count?.toString() ?? '',
          row.all_periods_passing ? 'Promovible' : 'Revisión',
        ]
      }),
    ]
  }

  return getStudentRosterRows(kind)
}

async function getStudentRosterRows(kind: ReportKind): Promise<string[][]> {
  const { data, error } = await supabase
    .from('students')
    .select('student_code, first_name, last_name, document_id, birth_date, gender, status')
    .order('last_name', { ascending: true })
    .limit(500)

  assertNoSupabaseError(error, 'No se pudo generar el reporte de estudiantes.')
  const title = kind === 'boletin' ? 'Boletín' : 'Registro de grado'

  return [
    [title],
    ['Código', 'Estudiante', 'Documento', 'Nacimiento', 'Sexo', 'Estado'],
    ...((data ?? []) as StudentExportRow[]).map((row) => [
      row.student_code,
      `${row.first_name} ${row.last_name}`,
      row.document_id ?? '',
      row.birth_date,
      row.gender ?? '',
      row.status,
    ]),
  ]
}

async function getLookup(
  table: 'students' | 'subjects' | 'grades' | 'sections',
  ids: (string | null)[],
  columns: string,
): Promise<Map<string, Record<string, unknown>>> {
  const uniqueIds = Array.from(new Set(ids.filter((id): id is string => Boolean(id))))
  if (uniqueIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from(table)
    .select(`id, ${columns}`)
    .in('id', uniqueIds)

  assertNoSupabaseError(error, 'No se pudieron cargar datos relacionados del reporte.')
  return new Map(((data ?? []) as unknown as Record<string, unknown>[]).map((row) => [String(row.id), row]))
}

function getString(row: Record<string, unknown> | undefined, key: string) {
  const value = row?.[key]
  return typeof value === 'string' ? value : ''
}

function mapSector(value: string | null | undefined): SchoolHeader['sector'] {
  if (value === 'public' || value === 'semiofficial') return value
  return 'private'
}

function mapShift(value: string | null | undefined): SchoolHeader['schoolShift'] {
  if (
    value === 'morning'
    || value === 'afternoon'
    || value === 'night'
    || value === 'full_day'
  ) {
    return value
  }

  return 'extended'
}

function getReportTitle(kind: ReportKind) {
	  const titles: Record<ReportKind, string> = {
	    boletin: 'Boletín por estudiante',
	    'registro-grado': 'Registro de grado',
	    asistencia: 'Asistencia mensual/anual',
	    rendimiento: 'Rendimiento por sección/asignatura',
	    promocion: 'Promoción y condición final',
	  }
  return titles[kind]
}

function formatCodeName(code: string | null, name: string | null) {
  return [code, name].filter(Boolean).join(' - ')
}

function toDelimited(rows: string[][], delimiter: string) {
  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(delimiter),
    )
    .join('\n')
}

function toSimplePdf(title: string, rows: string[][]) {
  const lines = [title, '', ...rows.map((row) => row.join(' | '))]
    .flatMap((line) => wrapPdfLine(line, 96))
    .slice(0, 52)
  const content = [
    'BT',
    '/F1 9 Tf',
    '36 780 Td',
    '12 TL',
    ...lines.map((line, index) => `${index === 0 ? '' : 'T* '}${toPdfText(line)}`),
    'ET',
  ].join('\n')
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
  ]
  let body = '%PDF-1.4\n'
  const offsets = [0]
  for (const object of objects) {
    offsets.push(body.length)
    body += `${object}\n`
  }
  const xrefStart = body.length
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  body += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')
  body += `\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return body
}

function toPdfText(value: string) {
  return `(${String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[()\\]/g, '\\$&')}) Tj`
}

function wrapPdfLine(value: string, width: number) {
  const text = String(value ?? '')
  const lines: string[] = []
  for (let i = 0; i < text.length; i += width) {
    lines.push(text.slice(i, i + width))
  }
  return lines.length ? lines : ['']
}
