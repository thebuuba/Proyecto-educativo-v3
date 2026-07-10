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
    <NavLink to="/inicio" className="flex items-center gap-3" onClick={onClick}>
      <img
        src="/favicon.svg"
        alt=""
        className="size-10 rounded-2xl shadow-[0_4px_12px_rgba(31,78,95,.30)]"
      />
      <span>
        <span className="block text-sm font-extrabold text-sidebar-foreground">
          Aula Base
        </span>
        <span className="block text-[11px] text-sidebar-accent-foreground">
          Sistema docente
        </span>
      </span>
    </NavLink>
  )
}
