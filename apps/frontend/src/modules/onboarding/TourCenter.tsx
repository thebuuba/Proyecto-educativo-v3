import { CheckCircle2, CirclePlay, RotateCcw } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import { useGuidedTours } from './GuidedTourProvider'

export function TourCenter({ onClose }: { onClose: () => void }) {
  const { availableTours, progress, startTour, replayTour } = useGuidedTours()
  return (
    <Modal title="Guías y recorridos" description="Aprende cada área a tu ritmo. Tu avance se guarda automáticamente." onClose={onClose}>
      <div className="space-y-3 p-5">
        {availableTours.map((tour) => {
          const saved = progress[tour.key]
          const complete = saved?.status === 'COMPLETED'
          const resume = saved?.status === 'IN_PROGRESS'
          return (
            <article key={tour.key} className="flex items-center gap-4 rounded-2xl border border-border p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {complete ? <CheckCircle2 className="size-5" /> : <CirclePlay className="size-5" />}
              </span>
              <div className="min-w-0 flex-1"><h4 className="font-bold">{tour.title}</h4><p className="mt-1 text-sm text-muted-foreground">{tour.description}</p></div>
              <Button variant={complete ? 'outline' : 'primary'} onClick={() => { onClose(); complete ? replayTour(tour) : startTour(tour, resume ? saved.lastStep : 0) }}>
                {complete ? <><RotateCcw className="size-4" /> Repetir</> : resume ? 'Continuar' : 'Comenzar'}
              </Button>
            </article>
          )
        })}
      </div>
    </Modal>
  )
}
