/**
 * Componente ImportStudentsModal — Modal para importar estudiantes
 * desde un archivo CSV con vista previa y validación.
 */

import { AlertCircle, FileUp, Table, Upload } from 'lucide-react'
import { useState } from 'react'

import { DEFAULTS } from '@/constants'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'
import type {
  ImportValidationError,
  ParsedStudentRow,
} from '@/modules/students/services/importService'
import { parseCSVFile } from '@/modules/students/services/importService'

type ImportResult = {
  imported: number
  errors: { row: number; reason: string }[]
}

type ImportStudentsModalProps = {
  /** Callback para importar las filas parseadas. */
  onImport: (rows: ParsedStudentRow[]) => Promise<ImportResult>
  /** Callback para cerrar el modal. */
  onClose: () => void
}

const MAX_PREVIEW = DEFAULTS.PREVIEW_MAX_ROWS

/** Modal de importación de estudiantes desde CSV. */
export function ImportStudentsModal({ onImport, onClose }: ImportStudentsModalProps) {
  const [rows, setRows] = useState<ParsedStudentRow[]>([])
  const [errors, setErrors] = useState<ImportValidationError[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parseResult, setParseResult] = useState<{
    imported: number
    skipped: number
    parseErrors: ImportValidationError[]
  } | null>(null)

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setErrorMessage('')

    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Solo se aceptan archivos CSV.')
      return
    }

    try {
      const result = await parseCSVFile(file)
      setRows(result.rows)
      setErrors(result.errors)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al leer el archivo.',
      )
      setRows([])
      setErrors([])
    }
  }

  async function handleImport() {
    if (rows.length === 0) return

    setIsSubmitting(true)

    try {
      const result = await onImport(rows)
      setParseResult({
        imported: result.imported,
        skipped: result.errors.length,
        parseErrors: result.errors,
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al importar.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (parseResult) {
    return (
      <Modal title="Importación completada" onClose={onClose}>
        <div className="space-y-4 p-5">
          <div className="rounded-lg border border-success/20 bg-success/12 p-4">
            <p className="text-sm font-semibold text-success">
              {parseResult.imported} estudiante{parseResult.imported === 1 ? '' : 's'} importado{parseResult.imported === 1 ? '' : 's'} correctamente
            </p>
          </div>

          {parseResult.parseErrors.length > 0 ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-4">
              <p className="mb-2 text-sm font-semibold text-destructive">
                {parseResult.parseErrors.length} fila{parseResult.parseErrors.length === 1 ? '' : 's'} omitida{parseResult.parseErrors.length === 1 ? '' : 's'}
              </p>
              <ul className="space-y-1">
                {parseResult.parseErrors.slice(0, 5).map((err) => (
                  <li key={err.row} className="text-xs text-destructive">
                    Fila {err.row}: {err.reason}
                  </li>
                ))}
                {parseResult.parseErrors.length > 5 ? (
                  <li className="text-xs text-muted-foreground">
                    ... y {parseResult.parseErrors.length - 5} error{parseResult.parseErrors.length - 5 === 1 ? '' : 'es'} más
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button variant="primary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title="Importar estudiantes"
      description="Sube un archivo CSV con los datos de los estudiantes."
      onClose={onClose}
    >
      <div className="space-y-5 p-5">
        {errorMessage ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        {rows.length === 0 ? (
          <label
            className={cn(
              'flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors',
              'hover:border-accent hover:bg-accent/5',
            )}
          >
            <FileUp className="size-12 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">
                Haz clic para seleccionar un archivo CSV
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Obligatorias: nombre y apellido. Opcionales: codigo, fecha de nacimiento, documento, genero, direccion
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Upload className="size-4" />
              Seleccionar archivo
            </span>
            <input
              type="file"
              accept=".csv"
              className="sr-only"
              onChange={handleFileSelected}
            />
          </label>
        ) : null}

        {rows.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                <Table className="mr-2 inline size-4 align-sub text-muted-foreground" />
                {rows.length} registro{rows.length === 1 ? '' : 's'} detectado{rows.length === 1 ? '' : 's'}
                {errors.length > 0 ? (
                  <span className="ml-2 text-destructive">
                    ({errors.length} con errores)
                  </span>
                ) : null}
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Apellido</th>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nacimiento</th>
                    <th className="px-4 py-3">Documento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.slice(0, MAX_PREVIEW).map((row) => (
                    <tr key={row.rowNumber} className="bg-card">
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {row.rowNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {row.firstName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.lastName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.studentCode || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.birthDate || '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.documentId || '—'}
                      </td>
                    </tr>
                  ))}
                  {rows.length > MAX_PREVIEW ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-3 text-center text-sm text-muted-foreground"
                      >
                        ... y {rows.length - MAX_PREVIEW} registro{rows.length - MAX_PREVIEW === 1 ? '' : 's'} más
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {errors.length > 0 ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-destructive">
                  Errores de validación
                </p>
                <ul className="space-y-1">
                  {errors.slice(0, 5).map((err) => (
                    <li key={err.row} className="text-xs text-destructive">
                      Fila {err.row}: {err.reason}
                    </li>
                  ))}
                  {errors.length > 5 ? (
                    <li className="text-xs text-muted-foreground">
                      ... y {errors.length - 5} error{errors.length - 5 === 1 ? '' : 'es'} más
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                disabled={rows.length === 0 || isSubmitting}
                loading={isSubmitting}
                onClick={handleImport}
              >
                {isSubmitting
                  ? 'Importando...'
                  : `Importar ${rows.length} registro${rows.length === 1 ? '' : 's'}`}
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}
