import { AlertCircle, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { getGradesWithSections } from '@/modules/students/services/studentsService'
import type { GradeWithSections } from '@/modules/students/types'
import type { EnrollmentStatus } from '@/types/domain'

type EnrollmentFormProps = {
  studentId: string
  submitting: boolean
  error: string | null
  onSubmit: (input: {
    studentId: string
    gradeId: string
    sectionId: string
    schoolYearId: string
    enrollmentDate: string
    status: EnrollmentStatus
  }) => Promise<void>
  onClose: () => void
}

const statusOptions: { value: EnrollmentStatus; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'transferred', label: 'Transferido' },
  { value: 'withdrawn', label: 'Retirado' },
  { value: 'completed', label: 'Completado' },
]

export function EnrollmentForm({
  studentId,
  submitting,
  error,
  onSubmit,
  onClose,
}: EnrollmentFormProps) {
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [grades, setGrades] = useState<GradeWithSections[]>([])
  const [schoolYear, setSchoolYear] = useState<{ id: string; name: string } | null>(null)
  const [gradeId, setGradeId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [status, setStatus] = useState<EnrollmentStatus>('active')
  const [enrollmentDate, setEnrollmentDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const [gradesData, currentYear] = await Promise.all([
          getGradesWithSections(),
          getCurrentSchoolYear(),
        ])
        if (!isMounted) return
        setGrades(gradesData)
        setSchoolYear(currentYear)
      } catch (error) {
        if (isMounted) {
          setValidationError('No se pudieron cargar los datos del formulario.')
          console.error('Error al cargar formulario de matrícula:', error)
        }
      } finally {
        if (isMounted) setLoadingOptions(false)
      }
    }

    void load()
    return () => { isMounted = false }
  }, [])

  const selectedGrade = grades.find((g) => g.id === gradeId)
  const availableSections = selectedGrade?.sections ?? []

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!gradeId) {
      setValidationError('Selecciona un grado.')
      return
    }

    if (!sectionId) {
      setValidationError('Selecciona una sección.')
      return
    }

    if (!enrollmentDate) {
      setValidationError('Selecciona una fecha de matrícula.')
      return
    }

    await onSubmit({
      studentId,
      gradeId,
      sectionId,
      schoolYearId: schoolYear?.id ?? '',
      enrollmentDate,
      status,
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div ref={dialogRef} className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Agregar curso</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Asocia el estudiante a un grado y sección.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cerrar formulario"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <form className="flex-1 overflow-y-auto space-y-5 p-5" onSubmit={handleSubmit}>
          {validationError || error ? (
            <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{validationError || error}</p>
            </div>
          ) : null}

          {loadingOptions ? (
            <div className="rounded-lg border border-border bg-muted p-4 text-sm font-medium text-muted-foreground">
              Cargando...
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Año escolar">
                <Input
                  type="text"
                  value={schoolYear?.name ?? 'No hay año escolar activo'}
                  disabled
                />
              </Field>

              <Field label="Grado">
                <Select
                  value={gradeId}
                  onChange={(e) => {
                    setGradeId(e.target.value)
                    setSectionId('')
                  }}
                >
                  <option value="">Selecciona un grado</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Sección">
                <Select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  disabled={!gradeId}
                >
                  <option value="">
                    {gradeId ? 'Selecciona una sección' : 'Primero elige un grado'}
                  </option>
                  {availableSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Estado">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EnrollmentStatus)}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Fecha de matrícula">
                <Input
                  type="date"
                  value={enrollmentDate}
                  onChange={(e) => setEnrollmentDate(e.target.value)}
                />
              </Field>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || loadingOptions}
              loading={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-muted-foreground">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}
