import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

import { SETUP_TOUR_START_EVENT, type SetupTourStep } from '@/modules/dashboard/setupTour'

export function GuidedSetupTour() {
  const navigate = useNavigate()

  useEffect(() => {
    const start = (event: Event) => {
      const step = (event as CustomEvent<SetupTourStep>).detail
      if (!step) return

      const tour = driver({
        animate: true,
        allowClose: true,
        allowKeyboardControl: true,
        overlayColor: '#0f172a',
        overlayOpacity: 0.58,
        stagePadding: 8,
        stageRadius: 16,
        popoverClass: 'aulabase-setup-tour',
        showProgress: true,
        progressText: 'Paso {{current}} de {{total}}',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        doneBtnText: 'Entendido',
        steps: [
          {
            popover: {
              title: step.title,
              description: `${step.description} Te mostraré exactamente dónde comenzar.`,
            },
          },
          {
            element: step.navSelector,
            popover: {
              title: 'Ve a esta sección',
              description: 'Este es el módulo que necesitas. Pulsa Siguiente y te llevaré allí.',
              side: 'right',
              align: 'center',
              onNextClick: () => {
                navigate(step.path)
                tour.moveNext()
              },
            },
          },
          {
            element: step.actionSelector,
            waitForElement: 5000,
            popover: {
              title: step.title,
              description: 'Haz clic en el elemento resaltado para realizar este paso. Cuando guardes, la guía reconocerá tu progreso automáticamente.',
              side: 'bottom',
              align: 'center',
              showButtons: ['previous', 'close'],
            },
            advanceOnClick: true,
          },
        ],
      })

      tour.drive()
    }

    window.addEventListener(SETUP_TOUR_START_EVENT, start)
    return () => window.removeEventListener(SETUP_TOUR_START_EVENT, start)
  }, [navigate])

  return null
}
