/** Formulario modal para crear o editar una sección dentro de un grado. */
import { CalendarDays, Info, Pencil, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  defaultSectionOptions,
  normalizeAcademicText,
} from '@/modules/courses/data/academicAssignmentCatalog'
import type { Section } from '@/modules/courses/types'
import { cn } from '@/utils/cn'

type SectionFormProps = {
  gradeName: string
  cycleName?: string | null
  schoolYearName?: string | null
  sections: Section[]
  section?: Section
  submitting: boolean
  error: string | null
  onSubmit: (input: { name: string }) => Promise<void>
  onClose: () => void
}

export function SectionForm({
  gradeName,
  cycleName,
  schoolYearName,
  sections,
  section,
  submitting,
  error,
  onSubmit,
  onClose,
}: SectionFormProps) {
  const firstAvailableSection = defaultSectionOptions.find((option) => !sections.some(
    (item) => item.status === 'active'
      && item.id !== section?.id
      && normalizeAcademicText(item.name) === normalizeAcademicText(option),
  ))
  const initialName = section?.name ?? firstAvailableSection ?? ''
  const initialIsCustom = Boolean(initialName && !defaultSectionOptions.includes(initialName.toUpperCase()))
  const [name, setName] = useState(initialName)
  const [customMode, setCustomMode] = useState(initialIsCustom)
  const isEditing = Boolean(section)

  const availableSections = useMemo(() => {
    const usedSectionNames = new Set(
      sections
        .filter((item) => item.id !== section?.id && item.status === 'active')
        .map((item) => normalizeAcademicText(item.name)),
    )
    return defaultSectionOptions.filter(
      (option) => !usedSectionNames.has(normalizeAcademicText(option)),
    )
  }, [section?.id, sections])
  const suggestedSections = useMemo(() => {
    const suggestions = availableSections.slice(0, 7)
    if (!initialName || !availableSections.includes(initialName) || suggestions.includes(initialName)) return suggestions
    return [...suggestions.slice(0, 6), initialName]
  }, [availableSections, initialName])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    await onSubmit({ name: name.trim() })
  }

  function chooseSection(option: string) {
    setCustomMode(false)
    setName(option)
  }

  function enableCustomName() {
    if (!customMode) setName('')
    setCustomMode(true)
  }

  const context = cycleName ? `grado ${gradeName} del ${cycleName}` : `grado ${gradeName}`

  return (
    <Modal
      title={isEditing ? 'Editar sección' : 'Nueva sección'}
      hideHeader
      className="max-w-xl rounded-2xl"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <header className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              {isEditing ? 'Editar sección' : 'Nueva sección'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing ? `Actualiza la sección ${section?.name} de ${gradeName}.` : `Agrega una sección a ${gradeName}.`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </header>

        <div className="space-y-6 px-6 py-5">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-6 text-slate-700">
            <Info className="mt-0.5 size-5 shrink-0 text-emerald-600" />
            <p>
              {isEditing ? 'Estás actualizando' : 'Estás creando una nueva sección para'} el <strong>{context}</strong>.
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          ) : null}

          <fieldset>
            <legend className="text-sm font-bold text-foreground">
              Sección <span className="text-destructive">*</span>
            </legend>
            <p className="mt-1 text-xs text-muted-foreground">Selecciona la letra o escribe el nombre de la sección.</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {suggestedSections.map((option) => {
                const selected = !customMode && name === option
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseSection(option)}
                    className={cn(
                      'h-12 rounded-xl border text-sm font-extrabold transition-all hover:border-violet-300 hover:bg-violet-50/50',
                      selected
                        ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-200'
                        : 'border-border bg-card text-foreground',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
              <button
                type="button"
                aria-pressed={customMode}
                onClick={enableCustomName}
                className={cn(
                  'flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition-all hover:border-violet-300 hover:bg-violet-50/50',
                  customMode
                    ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-200'
                    : 'border-border bg-card text-foreground',
                )}
              >
                Otro <Pencil className="size-4" />
              </button>
            </div>
            {customMode ? (
              <label className="mt-3 block text-xs font-bold text-muted-foreground">
                Letra o nombre personalizado
                <input
                  autoFocus
                  value={name}
                  maxLength={30}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ejemplo: I, J o AA"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm font-semibold text-foreground outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </label>
            ) : null}
          </fieldset>

          <label className="block text-sm font-bold text-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" /> Año escolar</span>
            <input readOnly value={schoolYearName || 'Sin año escolar activo'} className="mt-2 h-12 w-full cursor-default rounded-xl border border-input bg-muted/40 px-3 text-sm font-semibold text-foreground outline-none" />
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">La nueva sección se creará en el año escolar activo.</span>
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <Button variant="outline" type="button" className="h-11 min-w-28 rounded-xl" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={!name.trim()} className="h-11 min-w-36 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:from-violet-700 hover:to-indigo-700">
            {isEditing ? 'Guardar cambios' : 'Crear sección'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
