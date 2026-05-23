import { AlertCircle, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import type {
  CreateStudentInput,
  StudentListItem,
  StudentStatus,
} from '@/modules/students/types'
import { formatCedula, isValidCedula } from '@/utils/cedula'

type StudentFormProps = {
  student?: StudentListItem | null
  submitting: boolean
  error: string | null
  onSubmit: (input: CreateStudentInput) => Promise<void>
  onClose: () => void
}

const statusOptions: { value: StudentStatus; label: string }[] = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'archived', label: 'Archivado' },
]

const genderOptions = [
  { value: '', label: 'No especificado' },
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
]

export function StudentForm({
  student,
  submitting,
  error,
  onSubmit,
  onClose,
}: StudentFormProps) {
  const [studentCode, setStudentCode] = useState(student?.studentCode ?? '')
  const [firstName, setFirstName] = useState(student?.firstName ?? '')
  const [lastName, setLastName] = useState(student?.lastName ?? '')
  const [documentId, setDocumentId] = useState(student?.documentId ?? '')
  const [birthDate, setBirthDate] = useState(student?.birthDate ?? '')
  const [gender, setGender] = useState(student?.gender ?? '')
  const [address, setAddress] = useState(student?.address ?? '')
  const [status, setStatus] = useState<StudentStatus>(student?.status ?? 'active')
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')

    if (!studentCode.trim() || !firstName.trim() || !lastName.trim() || !birthDate) {
      setValidationError('Completa código, nombre, apellido y fecha de nacimiento.')
      return
    }

    if (documentId.trim() && !isValidCedula(documentId)) {
      setValidationError('La cédula debe tener 11 dígitos válidos.')
      return
    }

    await onSubmit({
      studentCode,
      firstName,
      lastName,
      documentId,
      birthDate,
      gender,
      address,
      status,
    })
  }

  const dialogRef = useRef<HTMLDivElement>(null)
  useFocusTrap({ ref: dialogRef, active: true, onEscape: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/45 px-4 py-6">
      <div ref={dialogRef} className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {student ? 'Editar estudiante' : 'Nuevo estudiante'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Registra los datos base del expediente académico.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código">
              <Input
                type="text"
                required
                value={studentCode}
                onChange={(event) => setStudentCode(event.target.value)}
              />
            </Field>

            <Field label="Fecha de nacimiento">
              <Input
                type="date"
                required
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </Field>

            <Field label="Nombre">
              <Input
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Field>

            <Field label="Apellido">
              <Input
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </Field>

            <Field label="Documento">
              <Input
                type="text"
                value={documentId}
                onChange={(event) => setDocumentId(event.target.value)}
                onBlur={() => setDocumentId((current) => formatCedula(current))}
                placeholder="000-0000000-0"
              />
            </Field>

            <Field label="Género">
              <Select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
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
                onChange={(event) => setStatus(event.target.value as StudentStatus)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Dirección">
              <Input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Field>
          </div>

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
