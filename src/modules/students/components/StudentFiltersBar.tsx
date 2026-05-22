import { Search } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { StudentFilters } from '@/modules/students/types'

type StudentFiltersBarProps = {
  search: string
  filters: StudentFilters
  onSearchChange: (value: string) => void
  onFiltersChange: (filters: StudentFilters) => void
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
  onSearchChange,
  onFiltersChange,
}: StudentFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full lg:max-w-md">
        <span className="sr-only">Buscar estudiante</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre, apellido o código"
          className="pl-9"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        Estado
        <Select
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              status: event.target.value as StudentFilters['status'],
            })
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  )
}
