import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type {
  CourseCatalogs,
  CreateSubjectInput,
  Subject,
} from '@/modules/grades-sections/types'

type SubjectAssignmentFormProps = {
  sectionLabel: string
  catalogs: Pick<CourseCatalogs, 'subjects' | 'teachers'>
  submitting: boolean
  error: string | null
  onCreateSubject: (input: CreateSubjectInput) => Promise<Subject>
  onAssign: (input: { subjectId: string; teacherId: string | null }) => Promise<void>
  onClose: () => void
}

export function SubjectAssignmentForm({
  sectionLabel,
  catalogs,
  submitting,
  error,
  onCreateSubject,
  onAssign,
  onClose,
}: SubjectAssignmentFormProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [subjectId, setSubjectId] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [credits, setCredits] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    let selectedSubjectId = subjectId
    if (mode === 'new') {
      if (!code.trim() || !name.trim()) return
      const subject = await onCreateSubject({
        code,
        name,
        description,
        credits: credits ? Number(credits) : null,
      })
      selectedSubjectId = subject.id
    }

    if (!selectedSubjectId) return

    await onAssign({
      subjectId: selectedSubjectId,
      teacherId: teacherId || null,
    })
  }

  return (
    <Modal
      title="Asignar asignatura"
      description={`Agrega una materia a ${sectionLabel} para el año escolar activo.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              mode === 'existing' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
            onClick={() => setMode('existing')}
          >
            Existente
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              mode === 'new' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
            onClick={() => setMode('new')}
          >
            Nueva
          </button>
        </div>

        {mode === 'existing' ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Asignatura</span>
            <select
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              required
            >
              <option value="">Selecciona una asignatura</option>
              {catalogs.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Código</span>
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="MAT"
                required={mode === 'new'}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Nombre</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Matemática"
                required={mode === 'new'}
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-foreground">Descripción</span>
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Opcional"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Créditos / carga</span>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={credits}
                onChange={(event) => setCredits(event.target.value)}
                placeholder="Opcional"
              />
            </label>
          </div>
        )}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Docente</span>
          <select
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/35"
            value={teacherId}
            onChange={(event) => setTeacherId(event.target.value)}
          >
            <option value="">Sin docente asignado</option>
            {catalogs.teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={submitting}
            disabled={mode === 'existing' ? !subjectId : !code.trim() || !name.trim()}
          >
            Asignar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
