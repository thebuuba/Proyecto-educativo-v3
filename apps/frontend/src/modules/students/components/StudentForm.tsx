/**
 * Componente StudentForm - Modal rápido para matricular estudiantes por curso.
 */

import { ArrowRightLeft, ChevronDown, ChevronUp, PencilLine, UserPlus } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner, SemanticIcon, StatusBadge, type SemanticTone } from '@/components/ui/SemanticUI'
import { Select } from '@/components/ui/Select'
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

const modePresentation: Record<StudentFormMode, {
  title: string
  description: string
  eyebrow: string
  tone: SemanticTone
  icon: typeof UserPlus
}> = {
  create: {
    title: 'Agregar estudiante',
    description: 'Registra los datos esenciales para incorporarlo a la matrícula activa.',
    eyebrow: 'Nueva matrícula',
    tone: 'success',
    icon: UserPlus,
  },
  edit: {
    title: 'Editar estudiante',
    description: 'Actualiza los datos del expediente sin alterar su historial académico.',
    eyebrow: 'Expediente',
    tone: 'info',
    icon: PencilLine,
  },
  transfer: {
    title: 'Trasladar estudiante',
    description: 'Selecciona el curso destino y conserva el registro del movimiento.',
    eyebrow: 'Traslado',
    tone: 'warning',
    icon: ArrowRightLeft,
  },
}

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
    mode === 'transfer'
      ? 'transferred'
      : student?.status === 'inactive'
        ? 'retired'
        : 'active',
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

  const presentation = modePresentation[mode]
  const PresentationIcon = presentation.icon

  return (
    <Modal
      title={presentation.title}
      description={presentation.description}
      onClose={onClose}
      className="max-w-2xl"
      contentClassName="p-0"
    >
      <form className="space-y-5 p-5" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-success/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <SemanticIcon
              icon={PresentationIcon}
              tone={presentation.tone}
              className="size-10 rounded-xl"
              iconClassName="size-4"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                {presentation.eyebrow}
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-foreground">
                {student?.fullName || 'Nuevo expediente estudiantil'}
              </p>
            </div>
          </div>
          <StatusBadge tone={mode === 'transfer' ? 'warning' : mode === 'edit' ? 'info' : 'success'}>
            {mode === 'transfer' ? 'Cambio de curso' : mode === 'edit' ? 'Edición' : 'Matrícula activa'}
          </StatusBadge>
        </div>

        {validationError || error ? (
          <FeedbackBanner role="alert" tone="danger">
            {validationError || error}
          </FeedbackBanner>
        ) : null}

        <section aria-labelledby="student-essential-data" className="space-y-4">
          <div>
            <h4 id="student-essential-data" className="text-sm font-extrabold text-foreground">
              Datos esenciales
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Código o matrícula y nombre completo son obligatorios.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código o matrícula" required>
              <Input
                type="text"
                required
                value={studentCode}
                onChange={(event) => setStudentCode(event.target.value)}
              />
            </Field>

            <Field label="Nombre completo" required>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </Field>
          </div>

          {mode === 'transfer' ? (
            <Field label="Curso destino" required>
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
        </section>

        <div className="border-t border-border/70 pt-4">
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-bold text-primary-variant transition hover:text-primary"
            aria-expanded={showMore}
            onClick={() => setShowMore((value) => !value)}
          >
            {showMore ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            {showMore ? 'Ocultar información adicional' : 'Agregar información adicional'}
          </button>
        </div>

        {showMore ? (
          <section className="grid gap-4 rounded-2xl bg-muted/55 p-4 sm:grid-cols-2" aria-label="Información adicional del estudiante">
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
          </section>
        ) : null}

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={submitting}>
            {mode === 'transfer' ? 'Confirmar traslado' : mode === 'edit' ? 'Guardar cambios' : 'Agregar estudiante'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      <span className="inline-flex items-center gap-1">
        {label}
        {required ? <span className="text-destructive" aria-hidden="true">*</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}
