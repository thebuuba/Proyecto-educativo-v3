import { AlertCircle, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import type {
  CreateStudentInput,
  StudentListItem,
  StudentStatus,
} from '@/modules/students/types'

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-950">
              {student ? 'Editar estudiante' : 'Nuevo estudiante'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Registra los datos base del expediente académico.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar formulario"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>

        <form className="space-y-5 p-5" onSubmit={handleSubmit}>
          {validationError || error ? (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{validationError || error}</p>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código">
              <input
                type="text"
                required
                value={studentCode}
                onChange={(event) => setStudentCode(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </Field>

            <Field label="Fecha de nacimiento">
              <input
                type="date"
                required
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </Field>

            <Field label="Nombre">
              <input
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </Field>

            <Field label="Apellido">
              <input
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </Field>

            <Field label="Documento">
              <input
                type="text"
                value={documentId}
                onChange={(event) => setDocumentId(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </Field>

            <Field label="Género">
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                <option value="">No especificado</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </Field>

            <Field label="Estado">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as StudentStatus)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Dirección">
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
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
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}
