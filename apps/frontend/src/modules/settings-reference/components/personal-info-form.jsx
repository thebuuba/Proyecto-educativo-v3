// Layout adapted from the user-provided Polymet design.
import { UserRound } from 'lucide-react'
import {
  Input,
  Textarea,
  Label2,
  Select2,
  SelectContent2,
  SelectItem2,
  SelectTrigger2,
  SelectValue2,
} from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'
import { countries } from '../data/profile-catalogs'

var inputClass = 'h-11 rounded-xl bg-muted/50 border-transparent focus-visible:bg-card'
var BIO_MAX = 240
function PersonalInfoForm({ values, onChange }) {
  return (
    <SettingsSectionCard
      title="Información personal"
      description="Tu información personal y de contacto en AulaBase."
      icon={<UserRound className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label2 htmlFor="fullName">{'Nombre completo'}</Label2>
          <Input
            id="fullName"
            className={inputClass}
            value={values.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="publicName">{'Nombre público'}</Label2>
          <Input
            id="publicName"
            className={inputClass}
            value={values.publicName}
            onChange={(e) => onChange('publicName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="email">{'Correo electrónico'}</Label2>
          <div className="relative">
            <Input
              id="email"
              type="email"
              className={`${inputClass} pr-28`}
              value={values.email}
              readOnly={true}
            />

          </div>
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="phone">{'Teléfono'}</Label2>
          <Input
            id="phone"
            type="tel"
            className={inputClass}
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="birthDate">{'Fecha de nacimiento'}</Label2>
          <Input
            id="birthDate"
            type="date"
            className={inputClass}
            value={values.birthDate}
            onChange={(e) => onChange('birthDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="country">{'País'}</Label2>
          <Select2 value={values.country} onValueChange={(v) => onChange('country', v)}>
            <SelectTrigger2 id="country" className={inputClass}>
              <SelectValue2 placeholder="Selecciona un país" />
            </SelectTrigger2>
            <SelectContent2 className="rounded-xl">
              {countries.map((c) => (
                <SelectItem2 key={c.value} value={c.value}>
                  {c.label}
                </SelectItem2>
              ))}
            </SelectContent2>
          </Select2>
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="city">{'Ciudad'}</Label2>
          <Input
            id="city"
            className={inputClass}
            value={values.city}
            onChange={(e) => onChange('city', e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label2 htmlFor="bio">{'Biografía'}</Label2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {values.bio.length}
              {'/'}
              {BIO_MAX}
            </span>
          </div>
          <Textarea
            id="bio"
            rows={4}
            maxLength={BIO_MAX}
            className="resize-none rounded-xl border-transparent bg-muted/50 focus-visible:bg-card"
            value={values.bio}
            onChange={(e) => onChange('bio', e.target.value)}
          />
        </div>
      </div>
    </SettingsSectionCard>
  )
}

export { PersonalInfoForm }
