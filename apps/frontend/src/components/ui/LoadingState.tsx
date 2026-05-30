type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
      {message}
    </div>
  )
}
