// Layout adapted from the user-provided Polymet design.
import { useState } from 'react'
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
  const [exportError, setExportError] = useState('')
  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Tus datos"
        description={onExport ? 'Solicita una copia de tus datos personales.' : 'La exportación de datos personales aún no está disponible.'}
        icon={<Database className="h-5 w-5" />}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <FileArchive className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{'Archivo de datos personales'}</p>
            <p className="text-xs text-muted-foreground">
              {'Perfil, cursos, notas, certificados y mensajes'}
            </p>
          </div>
        </div>
        <Button
          className="mt-3 h-11 w-full rounded-xl font-semibold"
          variant={exportState === 'ready' ? 'outline' : 'default'}
          disabled={!onExport || exportState === 'loading'}
          onClick={async () => {
            if (!onExport || exportState === 'loading') return
            setExportState('loading')
            setExportError('')
            try { await onExport(); setExportState('ready') }
            catch { setExportState('idle'); setExportError('No se pudo preparar el archivo.') }
          }}
        >
          {exportState === 'loading' && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {exportState === 'ready' && <CircleCheck className="mr-2 h-4 w-4 text-emerald-500" />}
          {exportState === 'idle' && <Download className="mr-2 h-4 w-4" />}
          {exportState === 'loading'
            ? 'Preparando archivo…'
            : exportState === 'ready'
              ? 'Archivo preparado'
              : 'Solicitar descarga'}
        </Button>
        {exportError && <p role="alert" className="mt-2 text-xs text-destructive">{exportError}</p>}
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
                onDeleteAccount ? 'Revisa el alcance y confirma la eliminación de tu cuenta.' : 'La eliminación de cuenta aún no está disponible en este panel.'
              }
            </p>
          </div>
        </div>
        <AlertDialog2 onOpenChange={(open) => !open && setConfirmText('')}>
          <AlertDialogTrigger2 asChild={true}>
            <Button
              variant="outline"
              disabled={!onDeleteAccount}
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
                disabled={!onDeleteAccount || confirmText !== CONFIRM_WORD}
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
