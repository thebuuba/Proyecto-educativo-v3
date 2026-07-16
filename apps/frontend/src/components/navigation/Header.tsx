/**
 * Encabezado principal con barra de búsqueda, notificaciones,
 * ayuda, menú móvil y perfil de usuario.
 */
import { Bell, CircleHelp, Menu, Search, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { getCurrentSchoolYear } from '@/services/schoolYearService'
import { api, API_CACHE_TAGS, API_CACHE_TTL } from '@/services/apiClient'
import type { UserRole } from '@/types/domain'

/** Propiedades del componente Header. */
type HeaderProps = {
  /** Función para abrir la barra lateral en mobile. */
  onOpenSidebar: () => void
}

/** Etiquetas mostradas para cada rol de usuario. */
const roleLabels: Record<UserRole, string> = {
  admin: 'ADMIN',
  director: 'DIRECTOR',
  coordinator: 'COORDINADOR',
  teacher: 'DOCENTE',
  student: 'ESTUDIANTE',
  guardian: 'TUTOR',
  viewer: 'LECTOR',
}

/**
 * Encabezado principal con navegación, perfil y período académico activo.
 * Incluye menú responsive, búsqueda global, notificaciones y perfil.
 *
 * @param props.onOpenSidebar - Callback para abrir la barra lateral.
 */
export function Header({ onOpenSidebar }: HeaderProps) {
  const { appUser, roles } = useAuth()
  const location = useLocation()
  const [periodName, setPeriodName] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const displayName = appUser?.fullName?.trim() || 'Usuario'
  const initials = getInitials(displayName)
  const roleLabel = roles[0]?.key ? roleLabels[roles[0].key] : 'USUARIO'
  const profileMeta = periodName ? `${roleLabel} · ${periodName.toUpperCase()}` : roleLabel
  const isPlanningPage = location.pathname.startsWith('/planificaciones')
  const isGradingPage = location.pathname.startsWith('/calificaciones')
  const isCoursesPage = location.pathname === '/cursos'

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadPeriod() {
      try {
        const [year, periods] = await Promise.all([
          getCurrentSchoolYear(),
          api.get<Array<{ name: string; startDate: string; endDate: string }>>(
            '/school-administration/academic-periods',
            {
              cacheTtlMs: API_CACHE_TTL.sessionList,
              cacheTags: [API_CACHE_TAGS.academicPeriods],
            },
          ),
        ])

        if (!year) {
          if (!ignore) setPeriodName(null)
          return
        }

        const today = getDateKey(new Date())
        const current = periods.find(
          (p) => p.startDate <= today && p.endDate >= today
        )

        if (!ignore) {
          setPeriodName(current?.name ?? null)
        }
      } catch (error) {
        console.warn('Header period load failed', error)
        if (!ignore) setPeriodName(null)
      }
    }

    void loadPeriod()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!profileOpen) {
      return undefined
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [profileOpen])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur">
      <div className="flex h-[74px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Abrir navegación"
          onClick={onOpenSidebar}
        >
          <Menu className="size-5" />
        </Button>

        {isGradingPage || isCoursesPage ? (
          <>
            <div className="hidden min-w-0 shrink-0 md:block">
              <h1 className={isCoursesPage ? 'text-2xl font-extrabold leading-none text-foreground' : 'text-3xl font-bold leading-none text-primary'}>
                {isCoursesPage ? 'Mis cursos' : 'Calificaciones'}
              </h1>
            </div>
            <label
              htmlFor="global-header-search"
              className="hidden h-11 min-w-[22rem] max-w-[680px] flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 text-muted-foreground shadow-sm md:flex"
            >
              <Search className="size-4 shrink-0" />
              <input
                ref={searchRef}
                id="global-header-search"
                type="search"
                placeholder={isCoursesPage ? 'Buscar cursos, grados, secciones, asignaturas...' : 'Buscar estudiantes, cursos, actividades...'}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                aria-label={isCoursesPage ? 'Buscar cursos' : 'Buscar estudiantes, cursos, actividades'}
                onChange={isCoursesPage ? (event) => window.dispatchEvent(new CustomEvent('courses:search', { detail: event.target.value })) : undefined}
              />
              {isCoursesPage ? <kbd className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[10px] font-bold text-muted-foreground">Ctrl + K</kbd> : null}
            </label>
          </>
        ) : (
          <label
            htmlFor="global-header-search"
            className="hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 text-muted-foreground shadow-sm md:flex"
          >
            <Search className="size-4 shrink-0" />
            <input
              ref={searchRef}
              id="global-header-search"
              type="search"
              placeholder="Buscar estudiantes, cursos, actividades..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Buscar estudiantes, cursos, actividades"
            />
          </label>
        )}

        <div className="ml-auto flex items-center gap-4">
          {!isPlanningPage ? (
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              aria-label="Notificaciones"
            >
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-accent ring-2 ring-card" />
            </button>
          ) : null}

          <button
            type="button"
            className="hidden size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted sm:flex"
            aria-label="Ayuda"
          >
            <CircleHelp className="size-5" />
          </button>

          <span className="hidden h-10 w-px bg-border md:block" aria-hidden="true" />

          <div ref={profileRef} className="relative">
            <button
              type="button"
              className="flex min-w-0 items-center gap-3 rounded-xl pl-0 transition-colors hover:bg-muted/60 md:pl-2"
              aria-haspopup="dialog"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((current) => !current)}
            >
              <span className="hidden max-w-44 min-w-0 text-right sm:block lg:max-w-56">
                <span className="block truncate text-sm font-bold leading-5 text-foreground">
                  {displayName}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {profileMeta}
                </span>
              </span>

              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {initials}
              </span>
            </button>

            {profileOpen ? (
              <div
                className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl shadow-primary/10"
                role="dialog"
                aria-label="Perfil"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                      Perfil
                    </p>
                    <p className="mt-2 truncate text-base font-bold text-foreground">
                      {displayName}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {appUser?.email ?? 'Sin correo'}
                    </p>
                    <p className="mt-2 truncate text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {profileMeta}
                    </p>
                  </div>
                </div>

                <Link
                  to="/perfil"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-hover"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserRound className="size-4" />
                  Configurar perfil
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Obtiene las iniciales de un nombre (máximo 2 caracteres).
 *
 * @param name - Nombre completo.
 * @returns Iniciales en mayúsculas.
 */
function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return initials || 'AB'
}

/**
 * Convierte una fecha al formato YYYY-MM-DD para comparaciones.
 *
 * @param date - Fecha a formatear.
 * @returns Cadena en formato ISO de fecha.
 */
function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
