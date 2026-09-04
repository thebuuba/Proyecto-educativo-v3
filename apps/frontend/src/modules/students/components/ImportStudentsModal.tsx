/**
 * Componente ImportStudentsModal - Importación de estudiantes por pegado.
 */

import { CheckCircle2, ClipboardList, Upload } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, MetricTile, SemanticIcon, StatusBadge } from '@/components/ui/SemanticUI'
import type {
  CourseImportPreview,
  ImportCourseStudentRow,
} from '@/modules/students/types'
import { parsePastedStudents } from '@/modules/students/utils/pasteImport'

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
  const hasBlockingPreviewIssues = Boolean(
    preview && (preview.errors > 0 || preview.duplicates > 0),
  )

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
      <Modal
        title="Importación completada"
        description="La matrícula fue procesada y los registros válidos ya están disponibles."
        onClose={onClose}
      >
        <div className="space-y-5 p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-success/12 p-4">
            <SemanticIcon icon={CheckCircle2} tone="success" className="size-10 rounded-xl" iconClassName="size-4" />
            <div>
              <p className="text-sm font-extrabold text-foreground">
                {result.imported} estudiante{result.imported === 1 ? '' : 's'} importado{result.imported === 1 ? '' : 's'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Los registros correctos se añadieron a la matrícula activa.</p>
            </div>
          </div>

          {result.errors.length > 0 ? (
            <ErrorList
              title={`${result.errors.length} fila${result.errors.length === 1 ? '' : 's'} omitida${result.errors.length === 1 ? '' : 's'}`}
              errors={result.errors.map((item) => `Fila ${item.row}: ${item.reason}`)}
            />
          ) : null}

          <div className="flex justify-end border-t border-border pt-4">
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
        <div className="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3">
          <SemanticIcon icon={Upload} tone="success" className="size-10 rounded-xl" iconClassName="size-4" />
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Carga rápida</p>
            <p className="mt-0.5 text-sm font-bold text-foreground">Revisa primero; importa después</p>
          </div>
        </div>

        {errorMessage ? <FeedbackBanner role="alert" tone="danger">{errorMessage}</FeedbackBanner> : null}

        <label className="block text-sm font-semibold text-foreground">
          Lista de estudiantes
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setPreview(null)
            }}
            aria-label="Lista de estudiantes"
            className="mt-2 min-h-44 w-full resize-y rounded-xl border border-input bg-card px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
            placeholder={'A001 - Ana Cruz\nA002, Luis Pérez\nMaría Solano'}
          />
          <span className="mt-2 block text-xs font-normal text-muted-foreground">
            Cada estudiante debe ir en una línea independiente.
          </span>
        </label>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPreviewing || isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handlePreview} loading={isPreviewing} disabled={isSubmitting}>
            Generar vista previa
          </Button>
        </div>

        {preview ? (
          <div className="space-y-4 border-t border-border pt-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile icon={ClipboardList} label="Detectados" value={preview.detectedStudents} tone="success" />
              <MetricTile label="Con código" value={preview.detectedCodes} tone="info" />
              <MetricTile label="Duplicados" value={preview.duplicates} tone={preview.duplicates > 0 ? 'warning' : 'neutral'} />
              <MetricTile label="Errores" value={preview.errors} tone={preview.errors > 0 ? 'danger' : 'neutral'} />
            </div>

            {hasBlockingPreviewIssues ? (
              <FeedbackBanner tone="warning">
                Corrige los duplicados o errores antes de confirmar la importación.
              </FeedbackBanner>
            ) : (
              <FeedbackBanner tone="success">
                La vista previa está lista para importar.
              </FeedbackBanner>
            )}

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {preview.rows.slice(0, MAX_PREVIEW).map((row) => {
                    const invalid = row.errors.length > 0 || row.duplicate
                    return (
                      <tr key={row.rowNumber}>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{row.rowNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.studentCode || '-'}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row.fullName || '-'}</td>
                        <td className="px-4 py-3">
                          {invalid ? (
                            <StatusBadge tone={row.duplicate ? 'warning' : 'danger'}>
                              {[row.duplicate ? 'Duplicado' : '', ...row.errors].filter(Boolean).join(', ')}
                            </StatusBadge>
                          ) : (
                            <StatusBadge tone="success">Listo</StatusBadge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
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

            <div className="flex justify-end border-t border-border pt-4">
              <Button
                onClick={handleImport}
                loading={isSubmitting}
                disabled={preview.detectedStudents === 0 || hasBlockingPreviewIssues || isPreviewing}
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

function ErrorList({ title, errors }: { title: string; errors: string[] }) {
  return (
    <FeedbackBanner tone="danger">
      <p className="mb-2 font-extrabold">{title}</p>
      <ul className="space-y-1">
        {errors.slice(0, 5).map((error) => (
          <li key={error} className="text-xs">
            {error}
          </li>
        ))}
        {errors.length > 5 ? (
          <li className="text-xs text-muted-foreground">
            ... y {errors.length - 5} error{errors.length - 5 === 1 ? '' : 'es'} más
          </li>
        ) : null}
      </ul>
    </FeedbackBanner>
  )
}
