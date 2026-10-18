// Layout adapted from the user-provided Polymet design.
import { CalendarDays, Camera, Crown } from 'lucide-react'
import { Button, Avatar2, AvatarFallback2, AvatarImage2, Progress2 } from '../reference-ui'

function ProfileIdentityCard({
  name,
  username,
  avatarUrl,
  role,
  memberSince,
  stats,
  completeness,
  onChangePhoto,
  onRemovePhoto,
  pending = false,
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-xs">
      <div className="relative h-28 bg-gradient-to-br from-primary via-sky-400 to-blue-600">
        <div
          aria-hidden={true}
          className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15"
        />
        <div
          aria-hidden={true}
          className="absolute bottom-[-40px] left-10 h-24 w-24 rounded-full bg-white/10"
        />
      </div>
      <div className="px-5 pb-6 sm:px-6">
        <div className="-mt-12 flex items-end justify-between">
          <div className="relative">
            <Avatar2 className="h-24 w-24 ring-4 ring-card shadow-lg">
              <AvatarImage2 src={avatarUrl} alt={name} />
              <AvatarFallback2 className="bg-accent text-xl font-bold text-primary">
                {initials}
              </AvatarFallback2>
            </Avatar2>
            <button
              type="button"
              onClick={onChangePhoto}
              disabled={pending}
              aria-label="Cambiar foto"
              className="absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-card transition-transform hover:scale-105"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <span className="mb-1 inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
            <Crown className="h-3 w-3" />
            {role}
          </span>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-extrabold tracking-tight">{name}</h2>
          <p className="text-sm text-muted-foreground">
            {username ? `@${username}` : 'Completa tu nombre público'}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {'Miembro desde '}
            {memberSince}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.id} className="rounded-2xl bg-muted/70 px-2 py-3 text-center">
              <p className={`${s.value === 'No disponible' || s.value === 'No aplica' ? 'text-xs' : 'text-lg tabular-nums'} font-semibold`}>{s.value}</p>
              <p className="text-[11px] leading-tight text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{'Perfil completado'}</span>
            <span className="font-bold text-primary">
              {completeness}
              {'%'}
            </span>
          </div>
          <Progress2 value={completeness} className="mt-2.5 h-2 bg-muted" />
          <p className="mt-2 text-xs text-muted-foreground">
            {'El porcentaje refleja tus datos guardados y tu foto. Horas y certificados aún no están disponibles.'}
          </p>
        </div>
        <div className="mt-5 flex gap-2">
          <Button className="h-10 flex-1 rounded-xl font-semibold" onClick={onChangePhoto} disabled={pending}>
            {'Subir nueva foto'}
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl bg-card font-semibold"
            onClick={onRemovePhoto}
            disabled={pending || !avatarUrl}
          >
            {'Quitar'}
          </Button>
        </div>
      </div>
    </section>
  )
}

export { ProfileIdentityCard }
