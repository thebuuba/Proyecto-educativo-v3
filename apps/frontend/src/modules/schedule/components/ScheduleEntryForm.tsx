/**
 * @file Componente ScheduleEntryForm
 *
 * Formulario modal para crear una clase a partir de un curso existente.
 */

import { AlertCircle, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { getSectionSubjects, getSections, getTimeSlots } from '@/modules/schedule/services/scheduleService'
import type { CreateScheduleEntryInput, SectionOption, TimeSlot } from '@/modules/schedule/types'

const dayOptions = [
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
]

type SectionSubjectOption = {
  id: string
  subjectName: string
  teacherName: string
}

type CourseOption = {
  sectionId: string
  sectionSubjectId: string
  label: string
}

type ScheduleEntryFormProps = {
  schoolYearId: string
  defaultDayOfWeek?: number
  defaultTimeSlotId?: string
  submitting: boolean
  error: string | null
  onSubmit: (input: CreateScheduleEntryInput) => Promise<void>
  onClose: () => void
}

export function ScheduleEntryForm({
  schoolYearId,
  defaultDayOfWeek,
  defaultTimeSlotId,
  submitting,
  error,
  onSubmit,
  onClose,
}: ScheduleEntryFormProps) {
  const [sections, setSections] = useState<SectionOption[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([])
  const [courseKey, setCourseKey] = useState('')
  const [timeSlotId, setTimeSlotId] = useState(defaultTimeSlotId ?? '')
  const [dayOfWeek, setDayOfWeek] = useState(defaultDayOfWeek ? String(defaultDayOfWeek) : '')
  const [validationError, setValidationError] = useState('')
  const [loadingDeps, setLoadingDeps] = useState(true)

  useEffect(() => {
    async function loadDeps() {
      try {
        const [sectionsData, slotsData] = await Promise.all([
          getSections(),
          getTimeSlots(),
        ])
        const courseData = await Promise.all(
          sectionsData.map(async (section) => {
            const subjects = await getSectionSubjects(section.id)
            return subjects.map((subject: SectionSubjectOption) => ({
              sectionId: section.id,
              sectionSubjectId: subject.id,
              label: `${section.gradeName} ${section.name} - ${subject.subjectName}`,
            }))
          }),
        )
        setSections(sectionsData)
        setTimeSlots(slotsData)
        setCourseOptions(courseData.flat())
      } catch (error) {
        setValidationError('No se pudieron cargar los datos del formulario.')
        console.error('Error al cargar formulario de horario:', error)
      } finally {
        setLoadingDeps(false)
      }
    }
    void loadDeps()
  }, [])

  const selectedCourse = useMemo(
    () => courseOptions.find((course) => `${course.sectionId}:${course.sectionSubjectId}` === courseKey),
    [courseKey, courseOptions],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!selectedCourse || !timeSlotId || !dayOfWeek) {
      setValidationError('Completa curso, día y bloque horario.')
      return
    }

    await onSubmit({
      schoolYearId,
      sectionSubjectId: selectedCourse.sectionSubjectId,
      sectionId: selectedCourse.sectionId,
      timeSlotId,
      dayOfWeek: Number(dayOfWeek),
      room: null,
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div
        ref={dialogRef}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Nueva clase
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona un curso existente para ocupar este bloque.
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

        <form className="flex-1 space-y-5 overflow-y-auto p-5" onSubmit={handleSubmit}>
          {validationError || error ? (
            <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{validationError || error}</p>
            </div>
          ) : null}

          {loadingDeps ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : (
            <>
              <Field label="Curso">
                <Select
                  value={courseKey}
                  onChange={(event) => setCourseKey(event.target.value)}
                >
                  <option value="">
                    {courseOptions.length > 0 ? 'Seleccionar curso' : 'No hay cursos disponibles'}
                  </option>
                  {courseOptions.map((course) => (
                    <option
                      key={`${course.sectionId}:${course.sectionSubjectId}`}
                      value={`${course.sectionId}:${course.sectionSubjectId}`}
                    >
                      {course.label}
                    </option>
                  ))}
                </Select>
              </Field>

              {sections.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                  Crea primero cursos en Gestión Académica para poder asignarlos al horario.
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Día">
                  <Select
                    value={dayOfWeek}
                    onChange={(event) => setDayOfWeek(event.target.value)}
                  >
                    <option value="">Seleccionar día</option>
                    {dayOptions.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Bloque horario">
                  <Select
                    value={timeSlotId}
                    onChange={(event) => setTimeSlotId(event.target.value)}
                  >
                    <option value="">Seleccionar bloque</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.name} ({slot.startTime} - {slot.endTime})
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} disabled={loadingDeps}>
              Guardar clase
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
