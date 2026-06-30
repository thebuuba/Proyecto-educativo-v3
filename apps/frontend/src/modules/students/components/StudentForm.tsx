/**
 * Componente StudentForm - Modal rapido para matricular estudiantes por curso.
 */

import { AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type {
  CourseStudent,
  CreateCourseStudentInput,
  EnrollmentCourse,
} from '@/modules/students/types'
import { formatCedula, isValidCedula } from '@/utils/cedula'

type StudentFormMode = 'create' | 'edit' | 'transfer'

type StudentFormProps = {
  student?: CourseStudent | null
  mode?: StudentFormMode
  courses?: EnrollmentCourse[]
  transferCourseId?: string
  submitting: boolean
  error: string | null
  onSubmit: (input: CreateCourseStudentInput) => Promise<void>
  onTransferCourseChange?: (courseId: string) => void
  onClose: () => void
}

const statusOptions: { value: NonNullable<CreateCourseStudentInput['status']>; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'retired', label: 'Retirado' },
  { value: 'transferred', label: 'Transferido' },
]

const genderOptions = [
  { value: '', label: 'No especificado' },
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
]

export function StudentForm({
  student,
  mode = student ? 'edit' : 'create',
  courses = [],
  transferCourseId = '',
  submitting,
  error,
  onSubmit,
  onTransferCourseChange,
  onClose,
}: StudentFormProps) {
  const [studentCode, setStudentCode] = useState(student?.studentCode ?? '')
  const [fullName, setFullName] = useState(
    student?.fullName ?? `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim(),
  )
  const [documentId, setDocumentId] = useState(student?.documentId ?? '')
  const [birthDate, setBirthDate] = useState(student?.birthDate?.slice(0, 10) ?? '')
  const [gender, setGender] = useState(student?.gender ?? '')
  const [address, setAddress] = useState(student?.address ?? '')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [observations, setObservations] = useState('')
  const [status, setStatus] = useState<NonNullable<CreateCourseStudentInput['status']>>(
    mode === 'transfer' ? 'transferred' : 'active',
  )
  const [showMore, setShowMore] = useState(false)
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!studentCode.trim() || !fullName.trim()) {
      setValidationError('Completa código o matrícula y nombre completo.')
      return
    }

    if (mode === 'transfer' && !transferCourseId) {
      setValidationError('Selecciona el curso destino.')
      return
    }

    if (documentId.trim() && !isValidCedula(documentId)) {
      setValidationError('La cédula debe tener 11 dígitos válidos.')
      return
    }

    await onSubmit({
      studentCode: studentCode.trim(),
      fullName: fullName.trim(),
      documentId: documentId.trim() || undefined,
      birthDate: birthDate || undefined,
      gender: gender || undefined,
      address: address.trim() || undefined,
      guardianPhone: guardianPhone.trim() || undefined,
      guardianEmail: guardianEmail.trim() || undefined,
      observations: observations.trim() || undefined,
      status,
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  const title = {
    create: 'Agregar estudiante',
    edit: 'Editar estudiante',
    transfer: 'Trasladar estudiante',
  }[mode]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div ref={dialogRef} className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Código o matrícula y nombre completo son obligatorios.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código o matrícula">
              <Input
                type="text"
                required
                value={studentCode}
                onChange={(event) => setStudentCode(event.target.value)}
              />
            </Field>

            <Field label="Nombre completo">
              <Input
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </Field>
          </div>

          {mode === 'transfer' ? (
            <Field label="Curso destino">
              <Select
                value={transferCourseId}
                onChange={(event) => onTransferCourseChange?.(event.target.value)}
                required
                className="w-full"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.label}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"
            onClick={() => setShowMore((value) => !value)}
          >
            {showMore ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            Más información del estudiante
          </button>

          {showMore ? (
            <div className="grid gap-4 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
              <Field label="Documento">
                <Input
                  type="text"
                  value={documentId}
                  onChange={(event) => setDocumentId(event.target.value)}
                  onBlur={() => setDocumentId((current) => formatCedula(current))}
                  placeholder="000-0000000-0"
                />
              </Field>

              <Field label="Fecha de nacimiento">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </Field>

              <Field label="Género">
                <Select value={gender} onChange={(event) => setGender(event.target.value)}>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Estado">
                <Select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as NonNullable<CreateCourseStudentInput['status']>)
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Teléfono del tutor">
                <Input
                  type="tel"
                  value={guardianPhone}
                  onChange={(event) => setGuardianPhone(event.target.value)}
                />
              </Field>

              <Field label="Correo del tutor">
                <Input
                  type="email"
                  value={guardianEmail}
                  onChange={(event) => setGuardianEmail(event.target.value)}
                />
              </Field>

              <Field label="Dirección">
                <Input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </Field>

              <Field label="Observaciones">
                <Input
                  type="text"
                  value={observations}
                  onChange={(event) => setObservations(event.target.value)}
                />
              </Field>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} loading={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm font-medium text-muted-foreground">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}
