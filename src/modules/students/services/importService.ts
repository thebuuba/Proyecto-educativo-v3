export type ParsedStudentRow = {
  rowNumber: number
  firstName: string
  lastName: string
  studentCode: string
  documentId: string
  birthDate: string
  gender: string
  address: string
}

export type ImportValidationError = {
  row: number
  reason: string
}

const columnAliases: Record<string, keyof ParsedStudentRow> = {
  nombre: 'firstName',
  nombres: 'firstName',
  name: 'firstName',
  'first name': 'firstName',
  first_name: 'firstName',
  apellido: 'lastName',
  apellidos: 'lastName',
  'last name': 'lastName',
  last_name: 'lastName',
  'código': 'studentCode',
  codigo: 'studentCode',
  code: 'studentCode',
  'student code': 'studentCode',
  student_code: 'studentCode',
  matrícula: 'studentCode',
  matricula: 'studentCode',
  'fecha de nacimiento': 'birthDate',
  'fecha nacimiento': 'birthDate',
  fecha_nacimiento: 'birthDate',
  'fecha de nac': 'birthDate',
  'fecha nac': 'birthDate',
  nacimiento: 'birthDate',
  'birth date': 'birthDate',
  birth_date: 'birthDate',
  date_of_birth: 'birthDate',
  dob: 'birthDate',
  documento: 'documentId',
  document: 'documentId',
  'cédula': 'documentId',
  cedula: 'documentId',
  dni: 'documentId',
  'género': 'gender',
  genero: 'gender',
  gender: 'gender',
  sexo: 'gender',
  'dirección': 'address',
  direccion: 'address',
  address: 'address',
  domicilio: 'address',
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

function detectColumnMapping(headers: string[]): Map<keyof ParsedStudentRow, string> {
  const mapping = new Map<keyof ParsedStudentRow, string>()

  for (const header of headers) {
    const normalized = normalizeHeader(header)
    const field = columnAliases[normalized]

    if (field && !mapping.has(field)) {
      mapping.set(field, header)
    }
  }

  return mapping
}

function parseDate(value: string): string {
  const trimmed = value?.trim()

  if (!trimmed) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const parts = trimmed.split(/[/-]/)

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const iso = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
      const date = new Date(`${iso}T00:00:00`)
      if (Number.isFinite(date.getTime())) return iso
    }

    const day = parts[0].padStart(2, '0')
    const month = parts[1].padStart(2, '0')
    const year = parts[2]
    const iso = `${year}-${month}-${day}`
    const date = new Date(`${iso}T00:00:00`)
    if (Number.isFinite(date.getTime())) return iso
  }

  return trimmed
}

export async function parseCSVFile(file: File): Promise<{
  rows: ParsedStudentRow[]
  errors: ImportValidationError[]
  totalRows: number
}> {
  const Papa = await import('papaparse')

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      encoding: 'UTF-8',
      skipEmptyLines: true,
      fastMode: false,
      error(error) {
        reject(new Error(`Error al leer el CSV: ${error.message}`))
      },
      complete(results) {
        if (results.errors.length > 0) {
          const firstError = results.errors[0]
          reject(
            new Error(
              `Error en línea ${firstError.row}: ${firstError.message}`,
            ),
          )
          return
        }

        const data = results.data
        if (data.length < 2) {
          reject(new Error('El archivo no contiene datos más allá del encabezado.'))
          return
        }

        const headers = data[0] as string[]
        const mapping = detectColumnMapping(headers)
        const required: (keyof ParsedStudentRow)[] = ['firstName', 'lastName']

        for (const field of required) {
          if (!mapping.has(field)) {
            const error = field === 'firstName' ? 'nombre' : 'apellido'
            reject(
              new Error(
                `No se encontró una columna de "${error}". Columnas detectadas: ${headers.join(', ')}`,
              ),
            )
            return
          }
        }

        const rows: ParsedStudentRow[] = []
        const errors: ImportValidationError[] = []
        const firstNameHeader = mapping.get('firstName')!
        const lastNameHeader = mapping.get('lastName')!
        const studentCodeHeader = mapping.get('studentCode')
        const documentIdHeader = mapping.get('documentId')
        const birthDateHeader = mapping.get('birthDate')
        const genderHeader = mapping.get('gender')
        const addressHeader = mapping.get('address')

        const headerIndex = new Map(headers.map((h, i) => [h.trim(), i]))

        function getValue(row: string[], field: string): string {
          const idx = headerIndex.get(field)
          return idx !== undefined && idx < row.length ? (row[idx] ?? '').trim() : ''
        }

        for (let i = 1; i < data.length; i++) {
          const row = data[i]

          if (!row || row.every((cell) => !cell?.trim())) {
            continue
          }

          const firstName = getValue(row, firstNameHeader)
          const lastName = getValue(row, lastNameHeader)

          if (!firstName || !lastName) {
            errors.push({
              row: i + 1,
              reason: 'Falta nombre o apellido',
            })
            continue
          }

          rows.push({
            rowNumber: i + 1,
            firstName,
            lastName,
            studentCode: studentCodeHeader ? getValue(row, studentCodeHeader) : '',
            documentId: documentIdHeader ? getValue(row, documentIdHeader) : '',
            birthDate: birthDateHeader ? parseDate(getValue(row, birthDateHeader)) : '',
            gender: genderHeader ? getValue(row, genderHeader) : '',
            address: addressHeader ? getValue(row, addressHeader) : '',
          })
        }

        resolve({ rows, errors, totalRows: data.length - 1 })
      },
    })
  })
}
