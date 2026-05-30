import { CircleAlert, Plus } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import type {
  CreateDashboardTaskInput,
  DashboardTask,
} from '@/modules/dashboard/types/dashboard'
import { cn } from '@/utils/cn'

type DashboardTasksProps = {
  tasks: DashboardTask[]
  loading: boolean
  onAddTask: (input: CreateDashboardTaskInput) => Promise<void>
  onCompleteTask: (id: string) => Promise<void>
}

export function DashboardTasks({
  tasks,
  loading,
  onAddTask,
  onCompleteTask,
}: DashboardTasksProps) {
  const [title, setTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return

    await onAddTask({ title: nextTitle })
    setTitle('')
    setIsAdding(false)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm" style={{ boxShadow: '0 1px 2px rgba(26,31,58,0.04)' }}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-bold tracking-tight text-foreground">Pendientes</h3>
        <span className="flex size-8 items-center justify-center rounded-full bg-accent/18 text-sm font-bold text-accent">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No tienes pendientes abiertos.
          </p>
        ) : (
          tasks.map((task) => (
            <label
              key={task.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-muted/70"
            >
              <input
                type="checkbox"
                className="size-4 rounded border-border accent-accent"
                disabled={loading}
                onChange={() => void onCompleteTask(task.id)}
              />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-foreground">{task.title}</span>
                <div className="mt-0.5 flex items-center gap-1">
                  {task.priority === 'high' && <CircleAlert className="size-3 text-accent" />}
                  <span className={cn('text-[10px]', task.priority === 'high' ? 'text-accent' : 'text-muted-foreground')}>
                    {task.dueDate ? formatDueDate(task.dueDate) : 'Sin fecha'}
                  </span>
                </div>
              </div>
            </label>
          ))
        )}
      </div>

      {isAdding ? (
        <form className="mt-3 flex gap-1 rounded-xl bg-muted p-1" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nueva tarea"
            className="min-w-0 flex-1 bg-transparent px-2 text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
            disabled={loading}
            autoFocus
          />
          <Button size="icon" variant="ghost" aria-label="Cancelar" onClick={() => setIsAdding(false)}>
            <Plus className="size-4 rotate-45" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Agregar tarea" loading={loading}>
            <Plus className="size-4" />
          </Button>
        </form>
      ) : (
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="size-3.5" />
          Agregar tarea
        </button>
      )}
    </div>
  )
}

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`))
}
