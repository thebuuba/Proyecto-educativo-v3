/** Formulario modal para crear o editar una sección dentro de un grado. */
import { CalendarDays, Info, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
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
      description={isEditing ? `Actualiza la sección ${section?.name} de ${gradeName}.` : `Agrega una sección a ${gradeName}.`}
      icon={UsersRound}
      tone="info"
      className="max-w-xl"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 p-5 sm:p-6">
          <FeedbackBanner tone="info" className="flex items-start gap-2.5">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>{isEditing ? 'Estás actualizando' : 'Estás creando una nueva sección para'} el <strong>{context}</strong>.</span>
          </FeedbackBanner>

          {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

          <fieldset>
            <legend className="text-sm font-extrabold text-foreground">
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
                      'h-11 rounded-xl border text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
                      selected
                        ? 'border-primary/30 bg-primary/12 text-primary-variant ring-1 ring-primary/15'
                        : 'border-border bg-card text-foreground hover:border-primary/25 hover:bg-primary/8',
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
                  'flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
                  customMode
                    ? 'border-primary/30 bg-primary/12 text-primary-variant ring-1 ring-primary/15'
                    : 'border-border bg-card text-foreground hover:border-primary/25 hover:bg-primary/8',
                )}
              >
                Otro <span className="text-xs">✎</span>
              </button>
            </div>
            {customMode ? (
              <label className="mt-3 block text-xs font-bold text-muted-foreground">
                Letra o nombre personalizado
                <Input
                  autoFocus
                  value={name}
                  maxLength={30}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ejemplo: I, J o AA"
                  className="mt-1.5"
                />
              </label>
            ) : null}
          </fieldset>

          <label className="block text-sm font-extrabold text-foreground">
            <span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" /> Año escolar</span>
            <Input readOnly value={schoolYearName || 'Sin año escolar activo'} className="mt-2 cursor-default bg-muted/55" />
            <span className="mt-1.5 block text-xs font-normal text-muted-foreground">La sección se guardará en el año escolar activo.</span>
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} disabled={!name.trim()}>
            {isEditing ? 'Guardar cambios' : 'Crear sección'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
