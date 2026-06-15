/**
 * Componente para mostrar errores en línea dentro de la interfaz.
 */
import { AlertCircle } from 'lucide-react'

/** Propiedades del componente ErrorState. */
type ErrorStateProps = {
  /** Mensaje de error a mostrar. */
  message: string
}

/**
 * Alerta de error con ícono y mensaje.
 *
 * @param props.message - Texto descriptivo del error.
 */
export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
