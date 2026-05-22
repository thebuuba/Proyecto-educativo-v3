import { AlertCircle } from 'lucide-react'

type ErrorStateProps = {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
