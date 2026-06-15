/**
 * Componente para indicar estado de carga.
 */

/** Propiedades del componente LoadingState. */
type LoadingStateProps = {
  /** Mensaje de carga personalizado. */
  message?: string
}

/**
 * Indicador de carga con mensaje centrado.
 *
 * @param props.message - Texto mostrado durante la carga.
 */
export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
      {message}
    </div>
  )
}
