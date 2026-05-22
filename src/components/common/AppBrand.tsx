import { NavLink } from 'react-router-dom'

type AppBrandProps = {
  onClick?: () => void
}

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
