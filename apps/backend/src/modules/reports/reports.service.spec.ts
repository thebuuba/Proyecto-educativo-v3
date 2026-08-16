import { describe, expect, it } from 'vitest'
import { buildExportPayload } from './reports.service'

const sections = [{
  title: 'Rendimiento académico',
  columns: ['Estudiante', 'Calificación'],
  rows: [['Ana "Luz"', 95], ['<script>alert(1)</script>', null]],
}]

describe('report exports', () => {
  it('creates safe spreadsheet and printable payloads', () => {
    const csv = buildExportPayload(sections, 'csv', 'Escuela Central')
    const xls = buildExportPayload(sections, 'xls', 'Escuela Central')
    const pdf = buildExportPayload(sections, 'pdf', 'Escuela Central')

    expect(csv.filename).toBe('rendimiento-academico.csv')
    expect(csv.content).toContain('"Ana ""Luz"""')
    expect(xls.mimeType).toContain('application/vnd.ms-excel')
    expect(xls.content).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(pdf.disposition).toBe('print')
  })
})
