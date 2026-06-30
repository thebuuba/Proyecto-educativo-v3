/**
 * Componente ImportStudentsModal - Importacion de estudiantes por pegado.
 */

import { AlertCircle, CheckCircle2, ClipboardList } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type {
  CourseImportPreview,
  ImportCourseStudentRow,
} from '@/modules/students/types'
import { parsePastedStudents } from '@/modules/students/utils/pasteImport'
import { cn } from '@/utils/cn'

type ImportResult = {
  imported: number
  errors: { row: number; reason: string }[]
}

type ImportStudentsModalProps = {
  onPreview: (rows: ImportCourseStudentRow[]) => Promise<CourseImportPreview>
  onImport: (rows: ImportCourseStudentRow[]) => Promise<ImportResult>
  onClose: () => void
}

const MAX_PREVIEW = 8

export function ImportStudentsModal({
  onPreview,
  onImport,
  onClose,
}: ImportStudentsModalProps) {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<CourseImportPreview | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  async function handlePreview() {
    const parsedRows = parsePastedStudents(text)

    if (parsedRows.length === 0) {
      setErrorMessage('Pega al menos un estudiante.')
      setPreview(null)
      return
    }

    setIsPreviewing(true)
    setErrorMessage('')

    try {
      setPreview(await onPreview(parsedRows))
    } catch (error) {
      setPreview(null)
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudo generar la vista previa.',
      )
    } finally {
      setIsPreviewing(false)
    }
  }

  async function handleImport() {
    if (!preview) return

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      setResult(
        await onImport(
          preview.rows.map(({ studentCode, fullName }) => ({ studentCode, fullName })),
        ),
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudo importar.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <Modal title="Importación completada" onClose={onClose}>
        <div className="space-y-4 p-5">
          <div className="rounded-lg border border-success/20 bg-success/12 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <CheckCircle2 className="size-4" />
              {result.imported} estudiante{result.imported === 1 ? '' : 's'} importado{result.imported === 1 ? '' : 's'}
            </p>
          </div>

          {result.errors.length > 0 ? (
            <ErrorList
              title={`${result.errors.length} fila${result.errors.length === 1 ? '' : 's'} omitida${result.errors.length === 1 ? '' : 's'}`}
              errors={result.errors.map((item) => `Fila ${item.row}: ${item.reason}`)}
            />
          ) : null}

          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title="Importar estudiantes"
      description="Pega una lista en formato código - nombre, código, nombre, o solo nombre."
      onClose={onClose}
    >
      <div className="space-y-5 p-5">
        {errorMessage ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <label className="block text-sm font-medium text-muted-foreground">
          Lista de estudiantes
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setPreview(null)
            }}
            aria-label="Lista de estudiantes"
            className="mt-2 min-h-44 w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
            placeholder={'A001 - Ana Cruz\nA002, Luis Pérez\nMaría Solano'}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPreviewing || isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handlePreview} loading={isPreviewing} disabled={isSubmitting}>
            Generar vista previa
          </Button>
        </div>

        {preview ? (
          <div className="space-y-4 border-t border-border pt-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <PreviewStat label="Detectados" value={preview.detectedStudents} />
              <PreviewStat label="Códigos" value={preview.detectedCodes} />
              <PreviewStat label="Duplicados" value={preview.duplicates} />
              <PreviewStat label="Errores" value={preview.errors} tone={preview.errors > 0 ? 'error' : 'default'} />
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {preview.rows.slice(0, MAX_PREVIEW).map((row) => (
                    <tr key={row.rowNumber} className="bg-card">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{row.rowNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.studentCode || '-'}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{row.fullName || '-'}</td>
                      <td className="px-4 py-3">
                        {row.errors.length > 0 || row.duplicate ? (
                          <span className="text-xs font-semibold text-destructive">
                            {[row.duplicate ? 'Duplicado' : '', ...row.errors].filter(Boolean).join(', ')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                            <CheckCircle2 className="size-3.5" />
                            Listo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {preview.rows.length > MAX_PREVIEW ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-sm text-muted-foreground">
                        ... y {preview.rows.length - MAX_PREVIEW} registro{preview.rows.length - MAX_PREVIEW === 1 ? '' : 's'} más
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                loading={isSubmitting}
                disabled={preview.detectedStudents === 0 || isPreviewing}
              >
                <ClipboardList className="size-4" />
                Confirmar importación
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

function PreviewStat({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number
  tone?: 'default' | 'error'
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-xl font-bold text-primary', tone === 'error' && 'text-destructive')}>
        {value}
      </p>
    </div>
  )
}

function ErrorList({ title, errors }: { title: string; errors: string[] }) {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-4">
      <p className="mb-2 text-sm font-semibold text-destructive">{title}</p>
      <ul className="space-y-1">
        {errors.slice(0, 5).map((error) => (
          <li key={error} className="text-xs text-destructive">
            {error}
          </li>
        ))}
        {errors.length > 5 ? (
          <li className="text-xs text-muted-foreground">
            ... y {errors.length - 5} error{errors.length - 5 === 1 ? '' : 'es'} más
          </li>
        ) : null}
      </ul>
    </div>
  )
}
