/**
 * Marca de la aplicación con nombre y enlace al inicio.
 */
import { NavLink } from 'react-router-dom'

/** Propiedades del componente AppBrand. */
type AppBrandProps = {
  /** Callback opcional al hacer clic en la marca. */
  onClick?: () => void
}

/**
 * Logotipo textual de la aplicación con las iniciales "AB"
 * y el nombre "Aula Base". Enlaza a la raíz del sitio.
 *
 * @param props.onClick - Callback opcional al hacer clic.
 */
export function AppBrand({ onClick }: AppBrandProps) {
  return (
    <NavLink to="/" className="flex items-center gap-3" onClick={onClick}>
      <span className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
        AB
      </span>
      <span>
        <span className="block text-sm font-semibold text-sidebar-foreground">
          Aula Base
        </span>
        <span className="block text-xs text-sidebar-foreground/65">
          Gestión estudiantil
        </span>
      </span>
    </NavLink>
  )
}
