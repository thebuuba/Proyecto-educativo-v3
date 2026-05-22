import { Search } from 'lucide-react'

import type { StudentFilters } from '@/modules/students/types'

type StudentFiltersBarProps = {
  search: string
  filters: StudentFilters
  onSearchChange: (value: string) => void
  onFiltersChange: (filters: StudentFilters) => void
}

export function StudentFiltersBar({
  search,
  filters,
  onSearchChange,
  onFiltersChange,
}: StudentFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full lg:max-w-md">
        <span className="sr-only">Buscar estudiante</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre, apellido o código"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        Estado
        <select
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              status: event.target.value as StudentFilters['status'],
            })
          }
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
        >
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="archived">Archivados</option>
          <option value="all">Todos</option>
        </select>
      </label>
    </div>
  )
}
