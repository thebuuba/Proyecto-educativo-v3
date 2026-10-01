export function exportStudentCsv(rows: Array<Array<string | number>>) {
  const escape = (value: string | number) => {
    const text = String(value)
    const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text
    return `"${safe.replaceAll('"', '""')}"`
  }
  const url = URL.createObjectURL(new Blob(['\uFEFF', rows.map(row => row.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'estudiantes-asignatura.csv'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
