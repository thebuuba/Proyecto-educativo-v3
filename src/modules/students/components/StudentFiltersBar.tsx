import { Search } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
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
  { value: 'inactive', label: 'Inactivos' },
  { value: 'archived', label: 'Archivados' },
  { value: 'all', label: 'Todos' },
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
    <div className="flex flex-col gap-4 border-b border-border bg-card p-4 xl:flex-row xl:items-center">
      <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
        {courseOptions.map((option) => {
          const isSelected = selectedCourse === option.label

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onCourseChange(option.label)}
              className={cn(
                'inline-flex h-11 shrink-0 items-center gap-3 rounded-xl px-5 text-sm font-bold transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-foreground hover:bg-secondary',
              )}
            >
              {option.label}
              <span
                className={cn(
                  'inline-flex min-w-8 items-center justify-center rounded-lg px-2 py-1 text-xs',
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
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre o código..."
            className="h-12 rounded-xl pl-12 text-base"
          />
        </label>

        <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
          Estado
          <Select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                status: event.target.value as StudentFilters['status'],
              })
            }
            className="h-12"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>
    </div>
  )
}
