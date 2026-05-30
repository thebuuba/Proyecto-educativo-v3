import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
    <Card className="min-h-[300px] p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-foreground">Pendientes</h3>
        <span className="flex size-8 items-center justify-center rounded-full bg-accent/18 text-sm font-bold text-accent">
          {tasks.length}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {tasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            No tienes pendientes abiertos.
          </p>
        ) : (
          tasks.map((task) => (
            <label key={task.id} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 size-5 rounded border-border accent-[var(--accent)]"
                disabled={loading}
                onChange={() => void onCompleteTask(task.id)}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{task.title}</span>
                <span
                  className={cn(
                    'mt-1 block text-xs',
                    task.priority === 'high' ? 'text-accent' : 'text-muted-foreground',
                  )}
                >
                  {task.dueDate ? formatDueDate(task.dueDate) : 'Sin fecha'}
                </span>
              </span>
            </label>
          ))
        )}
      </div>

      {isAdding ? (
        <form className="mt-6 flex gap-1 rounded-xl bg-muted p-1" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nueva tarea"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            disabled={loading}
            autoFocus
          />
          <Button size="icon" variant="ghost" aria-label="Cancelar" onClick={() => setIsAdding(false)}>
            <X className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Agregar tarea" loading={loading}>
            <Plus className="size-4" />
          </Button>
        </form>
      ) : (
        <button
          type="button"
          className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-muted text-sm font-bold text-foreground transition-colors hover:bg-secondary"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="size-4" />
          Agregar tarea
        </button>
      )}
    </Card>
  )
}

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`))
}
