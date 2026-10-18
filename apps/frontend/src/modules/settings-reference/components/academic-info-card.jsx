// Layout adapted from the user-provided Polymet design.
import { GraduationCap } from 'lucide-react'
import {
  Input,
  Label2,
  Select2,
  SelectContent2,
  SelectItem2,
  SelectTrigger2,
  SelectValue2,
} from '../reference-ui'
import { SettingsSectionCard } from './settings-section-card'
import { educationLevels, languages, timezones } from '../data/profile-catalogs'

var fieldClass = 'h-11 rounded-xl bg-muted/50 border-transparent focus-visible:bg-card'
function AcademicInfoCard({ values, onChange }) {
  return (
    <SettingsSectionCard
      title="Perfil académico"
      description="Tu institución y preferencias académicas."
      icon={<GraduationCap className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label2 htmlFor="institution">{'Institución educativa'}</Label2>
          <Input
            id="institution"
            className={fieldClass}
            value={values.institution}
            readOnly={true}
          />
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="education-level">{'Nivel educativo'}</Label2>
          <Select2 value={values.educationLevel} onValueChange={(v) => onChange('educationLevel', v)}>
            <SelectTrigger2 id="education-level" className={fieldClass}>
              <SelectValue2 placeholder="Selecciona una opción" />
            </SelectTrigger2>
            <SelectContent2 className="rounded-xl">
              {educationLevels.map((l) => (
                <SelectItem2 key={l.value} value={l.value}>
                  {l.label}
                </SelectItem2>
              ))}
            </SelectContent2>
          </Select2>
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="studentId">{values.academicIdentifier?.label ?? 'Identificador académico'}</Label2>
          <div className="relative">
            <Input
              id="studentId"
              readOnly={true}
              className={`${fieldClass} pr-10 font-mono text-muted-foreground`}
              value={values.academicIdentifier?.value ?? 'Sin identificador asignado'}
            />

          </div>
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="platform-language">{'Idioma de la plataforma'}</Label2>
          <Select2 value={values.language} onValueChange={(v) => onChange('language', v)}>
            <SelectTrigger2 id="platform-language" className={fieldClass}>
              <SelectValue2 />
            </SelectTrigger2>
            <SelectContent2 className="rounded-xl">
              {languages.map((l) => (
                <SelectItem2 key={l.value} value={l.value}>
                  {l.label}
                </SelectItem2>
              ))}
            </SelectContent2>
          </Select2>
        </div>
        <div className="space-y-2">
          <Label2 htmlFor="timezone">{'Zona horaria'}</Label2>
          <Select2 value={values.timezone} onValueChange={(v) => onChange('timezone', v)}>
            <SelectTrigger2 id="timezone" className={fieldClass}>
              <SelectValue2 />
            </SelectTrigger2>
            <SelectContent2 className="rounded-xl">
              {(timezones.some(t => t.value === values.timezone) ? timezones : [...timezones, { value: values.timezone, label: values.timezone }]).map((t) => (
                <SelectItem2 key={t.value} value={t.value}>
                  {t.label}
                </SelectItem2>
              ))}
            </SelectContent2>
          </Select2>
        </div>
      </div>
    </SettingsSectionCard>
  )
}

export { AcademicInfoCard }
