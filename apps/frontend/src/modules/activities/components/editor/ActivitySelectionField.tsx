import { useEffect, useId, useRef, useState, type ComponentType } from 'react'
import { Check, Search, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'

export type ActivitySelectionOption = { id: string; name: string; searchText?: string }
type Props = {
  label: string
  value: string
  automatic: boolean
  options: ActivitySelectionOption[]
  onConfirm: (value: string) => void
  disabled?: boolean
  emptyLabel?: string
  icon?: ComponentType<{ className?: string }>
}
const normalized = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()

/** Same list, search and action-footer pattern as SubjectAssignmentForm; commits only on confirmation. */
export function ActivitySelectionField({
  label,
  value,
  automatic,
  options,
  onConfirm,
  disabled,
  emptyLabel = 'Sin seleccionar',
  icon = Settings2,
}: Props) {
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.id === value)
  function close() {
    setOpen(false)
    trigger.current?.focus()
  }
  return (
    <div className="min-w-0">
      <button
        ref={trigger}
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center gap-3 border-b border-border py-2 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:opacity-60"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-muted-foreground">{label}</span>
          <span className="block whitespace-normal break-words text-sm font-semibold text-foreground">
            {selected?.name ?? emptyLabel}
          </span>
        </span>
        <span className="shrink-0 text-xs font-bold text-primary">
          {selected ? 'Cambiar' : 'Seleccionar'}
        </span>
      </button>
      {open ? (
        <SelectionDialog
          label={label}
          value={automatic ? '' : value}
          options={options}
          icon={icon}
          onClose={close}
          onConfirm={(choice) => {
            close()
            onConfirm(choice)
          }}
        />
      ) : null}
    </div>
  )
}

function SelectionDialog({
  label,
  value,
  options,
  icon,
  onClose,
  onConfirm,
}: Pick<Props, 'label' | 'value' | 'options' | 'icon' | 'onConfirm'> & { onClose: () => void }) {
  // Mount once per opening: incoming automatic changes never replace a tentative choice.
  const [pending, setPending] = useState(value),
    [query, setQuery] = useState('')
  const id = useId()
  const visible = options.filter((option) =>
    normalized(`${option.name} ${option.searchText ?? ''}`).includes(normalized(query)),
  )
  const searchable = options.length > 8
  useEffect(() => {
    if (searchable) document.getElementById(`${id}-search`)?.focus()
  }, [id, searchable])
  return (
    <Modal
      title={label}
      icon={icon}
      tone="info"
      onClose={onClose}
      className="max-w-xl"
      contentClassName="flex min-h-0 flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-col gap-3 p-5 sm:p-6">
        {searchable ? (
          <label className="relative block shrink-0">
            <span className="sr-only">Buscar {label.toLowerCase()}</span>
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id={`${id}-search`}
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar…"
              className="pl-10"
            />
          </label>
        ) : null}
        <div className="min-h-0 overflow-y-auto rounded-2xl border border-border bg-card">
          <fieldset className="min-w-0">
            <legend className="sr-only">{label}</legend>
            {visible.map((option) => (
              <label
                key={option.id}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center gap-3 border-b border-border px-3 py-2 text-sm last:border-0 focus-within:ring-4 focus-within:ring-inset focus-within:ring-ring/20',
                  pending === option.id
                    ? 'bg-primary/12 text-primary-variant'
                    : 'hover:bg-primary/7',
                )}
              >
                <input
                  type="radio"
                  name={id}
                  value={option.id}
                  checked={pending === option.id}
                  onChange={() => setPending(option.id)}
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="min-w-0 flex-1 whitespace-normal break-words font-semibold">
                  {option.name}
                </span>
                {pending === option.id ? (
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                ) : null}
              </label>
            ))}
            {!visible.length ? (
              <p className="p-5 text-center text-sm text-muted-foreground">
                No hay opciones que coincidan con la búsqueda.
              </p>
            ) : null}
          </fieldset>
        </div>
        <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="radio"
            name={id}
            value=""
            checked={pending === ''}
            onChange={() => setPending('')}
            className="size-4 accent-primary"
          />
          Seleccionar automáticamente
        </label>
      </div>
      <footer className="flex shrink-0 justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => onConfirm(pending)}
          disabled={pending !== '' && !options.some((option) => option.id === pending)}
        >
          Confirmar
        </Button>
      </footer>
    </Modal>
  )
}
