// Layout adapted from the user-provided Polymet design.
import { useState, useEffect } from 'react'
import { CircleCheck, Database, Download, FileArchive, LoaderCircle, Trash2 } from 'lucide-react'
import {
  Button,
  Input,
  AlertDialog2,
  AlertDialogAction2,
  AlertDialogCancel2,
  AlertDialogContent2,
  AlertDialogDescription2,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle2,
  AlertDialogTrigger2,
} from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'

var CONFIRM_WORD = 'ELIMINAR'
function DataManagementCard({ lastExport, onExport, onDeleteAccount }) {
  const [exportState, setExportState] = useState('idle')
  const [confirmText, setConfirmText] = useState('')
  useEffect(() => {
    if (exportState !== 'loading') return
    const t = setTimeout(() => setExportState('ready'), 1800)
    return () => clearTimeout(t)
  }, [exportState])
  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Tus datos"
        description="Descarga una copia de toda tu información en EduNube."
        icon={<Database className="h-5 w-5" />}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <FileArchive className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{'Archivo .zip'}</p>
            <p className="text-xs text-muted-foreground">
              {'Perfil, cursos, notas, certificados y mensajes'}
            </p>
          </div>
        </div>
        <Button
          className="mt-3 h-11 w-full rounded-xl font-semibold"
          variant={exportState === 'ready' ? 'outline' : 'default'}
          disabled={exportState === 'loading'}
          onClick={() => {
            if (exportState === 'ready') return
            setExportState('loading')
            onExport?.()
          }}
        >
          {exportState === 'loading' && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {exportState === 'ready' && <CircleCheck className="mr-2 h-4 w-4 text-emerald-500" />}
          {exportState === 'idle' && <Download className="mr-2 h-4 w-4" />}
          {exportState === 'loading'
            ? 'Preparando archivo…'
            : exportState === 'ready'
              ? 'Te lo enviamos por email'
              : 'Solicitar descarga'}
        </Button>
        {lastExport && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {'Última descarga: '}
            {lastExport}
          </p>
        )}
      </SettingsSectionCard>
      <section className="rounded-3xl border border-dashed border-destructive/30 bg-destructive/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{'Eliminar cuenta'}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {
                'Se borrarán tu progreso, certificados y suscripción. Esta acción no se puede deshacer.'
              }
            </p>
          </div>
        </div>
        <AlertDialog2 onOpenChange={(open) => !open && setConfirmText('')}>
          <AlertDialogTrigger2 asChild={true}>
            <Button
              variant="outline"
              className="mt-5 h-11 w-full rounded-xl border-destructive/30 bg-card font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {'Eliminar mi cuenta'}
            </Button>
          </AlertDialogTrigger2>
          <AlertDialogContent2 className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle2>{'¿Eliminar tu cuenta definitivamente?'}</AlertDialogTitle2>
              <AlertDialogDescription2>
                {'Perderás el acceso a todos tus cursos y certificados. Escribe'}{' '}
                <span className="font-bold text-foreground">{CONFIRM_WORD}</span>
                {' para confirmar.'}
              </AlertDialogDescription2>
            </AlertDialogHeader>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_WORD}
              className="h-11 rounded-xl"
              aria-label="Confirmación"
            />
            <AlertDialogFooter>
              <AlertDialogCancel2 className="rounded-xl">{'Cancelar'}</AlertDialogCancel2>
              <AlertDialogAction2
                disabled={confirmText !== CONFIRM_WORD}
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={onDeleteAccount}
              >
                {'Eliminar cuenta'}
              </AlertDialogAction2>
            </AlertDialogFooter>
          </AlertDialogContent2>
        </AlertDialog2>
      </section>
    </div>
  )
}

export { DataManagementCard }
