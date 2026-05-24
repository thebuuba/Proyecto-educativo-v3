import { Funnel, Search } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'
import type { StudentFilters } from '@/modules/students/types'

type StudentFiltersBarProps = {
  search: string
  filters: StudentFilters
  courseOptions: { label: string; count: number }[]
  selectedCourse: string
  onSearchChange: (value: string) => void
  onFiltersChange: (filters: StudentFilters) => void
  onCourseChange: (value: string) => void
}

const statusOptions = [
  { value: 'active', label: 'Activos' },
  { value: 'all', label: 'Todos' },
  { value: 'inactive', label: 'Inactivos' },
  { value: 'archived', label: 'Archivados' },
] as const

export function StudentFiltersBar({
  search,
  filters,
  courseOptions,
  selectedCourse,
  onSearchChange,
  onFiltersChange,
  onCourseChange,
}: StudentFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-card p-3 xl:flex-row xl:items-center">
      <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
        {courseOptions.map((option) => {
          const isSelected = selectedCourse === option.label

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onCourseChange(option.label)}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-foreground hover:bg-secondary',
              )}
            >
              {option.label}
              <span
                className={cn(
                  'inline-flex min-w-7 items-center justify-center rounded-md px-1.5 py-0.5 text-[11px]',
                  isSelected
                    ? 'bg-accent/18 text-accent'
                    : 'bg-card text-muted-foreground',
                )}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex min-w-0 flex-1 gap-3">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Buscar estudiante</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="h-10 rounded-xl pl-10 text-sm"
          />
        </label>

        <button
          type="button"
          title={`Estado: ${statusOptions.find((option) => option.value === filters.status)?.label ?? 'Activos'}`}
          aria-label="Cambiar filtro de estado"
          onClick={() => {
            const currentIndex = statusOptions.findIndex((option) => option.value === filters.status)
            const nextOption = statusOptions[(currentIndex + 1) % statusOptions.length]
            onFiltersChange({ ...filters, status: nextOption.value })
          }}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-bold text-primary shadow-sm transition-colors hover:bg-muted"
        >
          <Funnel className="size-4" />
          <span className="hidden sm:inline">
            {statusOptions.find((option) => option.value === filters.status)?.label ?? 'Activos'}
          </span>
        </button>
      </div>
    </div>
  )
}
