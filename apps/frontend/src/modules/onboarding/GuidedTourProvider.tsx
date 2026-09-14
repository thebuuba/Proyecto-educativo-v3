import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SETUP_TOUR_START_EVENT, type SetupTourStep } from '@/modules/dashboard/setupTour'
import { getToursForRoles, type TourDefinition } from './tourCatalog'
import { listTourProgress, saveTourProgress, type TourProgress } from './onboardingService'
import { GuidedToursContext } from './guidedTourContext'
const emptySetup = { courseCount: 0, studentCount: 0, activeEnrollments: 0, scheduleEntryCount: 0, attendanceCount: 0, planningCount: 0 }

export function GuidedTourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { appUser, roles } = useAuth()
  const [progress, setProgress] = useState<Record<string, TourProgress>>({})
  const activeDriver = useRef<Driver | null>(null)
  const availableTours = useMemo(() => getToursForRoles(roles.map((role) => role.key), emptySetup), [roles])

  useEffect(() => {
    if (!appUser) return
    let cancelled = false
    void listTourProgress().then((items) => {
      if (!cancelled) setProgress(Object.fromEntries(items.map((item) => [item.tourKey, item])))
    }).catch(() => undefined)
    return () => { cancelled = true }
  }, [appUser])

  const persist = useCallback((tour: TourDefinition, status: TourProgress['status'], lastStep: number) => {
    const value = { tourKey: tour.key, version: tour.version, status, lastStep }
    setProgress((current) => ({ ...current, [tour.key]: value }))
    void saveTourProgress(tour.key, value).catch(() => undefined)
  }, [])

  const startTour = useCallback((tour: TourDefinition, requestedStep = 0) => {
    activeDriver.current?.destroy()
    let finished = false
    const instance = driver({
      animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      allowClose: true,
      allowKeyboardControl: true,
      overlayColor: '#0f172a', overlayOpacity: 0.55, stagePadding: 8, stageRadius: 16,
      popoverClass: 'aulabase-setup-tour', showProgress: true,
      progressText: 'Paso {{current}} de {{total}}', nextBtnText: 'Siguiente', prevBtnText: 'Atrás', doneBtnText: 'Terminar',
      steps: tour.steps.map((step) => ({
        ...(step.selector ? { element: step.selector, waitForElement: 5000 } : {}),
        popover: { title: step.title, description: step.description, side: step.side ?? 'bottom', align: 'center' },
      })),
      onHighlighted: (_element, _step, options) => {
        const index = options.state.activeIndex ?? 0
        const path = tour.steps[index]?.path
        if (path) navigate(path)
        persist(tour, 'IN_PROGRESS', index)
      },
      onDestroyed: (_element, _step, options) => {
        const index = options.state.activeIndex ?? requestedStep
        persist(tour, finished ? 'COMPLETED' : 'SKIPPED', index)
        activeDriver.current = null
      },
      onNextClick: () => {
        const index = instance.getActiveIndex() ?? 0
        if (index >= tour.steps.length - 1) {
          finished = true
          instance.destroy()
          return
        }
        const next = tour.steps[index + 1]
        if (next.path) navigate(next.path)
        window.setTimeout(() => instance.moveNext(), next.path ? 180 : 0)
      },
    })
    activeDriver.current = instance
    instance.drive(Math.min(requestedStep, tour.steps.length - 1))
  }, [navigate, persist])

  useEffect(() => {
    const handleSetup = (event: Event) => {
      const step = (event as CustomEvent<SetupTourStep>).detail
      if (!step) return
      startTour({ key: 'management-setup', version: 1, title: step.title, description: step.description, steps: [
        { title: step.title, description: `${step.description} Te mostraré exactamente dónde comenzar.` },
        { title: 'Ve a esta sección', description: 'Este es el módulo que necesitas.', selector: step.navSelector, path: step.path, side: 'right' },
        { title: step.title, description: 'Haz clic en la acción resaltada. El avance se actualizará cuando guardes.', selector: step.actionSelector, side: 'bottom' },
      ] })
    }
    window.addEventListener(SETUP_TOUR_START_EVENT, handleSetup)
    return () => {
      window.removeEventListener(SETUP_TOUR_START_EVENT, handleSetup)
      activeDriver.current?.destroy()
    }
  }, [startTour])

  const value = useMemo(() => ({ availableTours, progress, startTour, replayTour: (tour: TourDefinition) => startTour(tour, 0) }), [availableTours, progress, startTour])
  return <GuidedToursContext.Provider value={value}>{children}</GuidedToursContext.Provider>
}
