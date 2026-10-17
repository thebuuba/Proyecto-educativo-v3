import { Transform, Type } from 'class-transformer'
import { ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength, ValidateBy, ValidateIf, ValidateNested } from 'class-validator'
import { PROFILE_COUNTRIES, PROFILE_INTERESTS, PROFILE_LEVELS } from '@aula/shared'

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value
function CivilDate() {
  return ValidateBy({ name: 'civilDate', validator: { validate: (v: unknown) => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
    const d = new Date(`${v}T00:00:00Z`)
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === v && v <= new Date().toISOString().slice(0, 10)
  }, defaultMessage: () => 'La fecha de nacimiento debe ser una fecha válida y no futura.' } })
}
function Timezone() {
  return ValidateBy({ name: 'timezone', validator: { validate: (v: unknown) => {
    try { if (typeof v !== 'string' || !v || v.length > 100) return false; new Intl.DateTimeFormat('es', { timeZone: v }); return true } catch { return false }
  }, defaultMessage: () => 'La zona horaria no es válida.' } })
}
export class ProfilePreferencesDto {
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) publicName?: string | null
  @IsOptional() @Transform(trim) @IsString() @MaxLength(240) bio?: string | null
  @IsOptional() @CivilDate() birthDate?: string | null
  @IsOptional() @IsIn(PROFILE_COUNTRIES.map(c => c.value)) country?: string | null
  @IsOptional() @Transform(trim) @IsString() @MaxLength(120) city?: string | null
  @IsOptional() @IsIn(PROFILE_LEVELS.map(l => l.value)) educationLevel?: string | null
  @ValidateIf((_o, v) => v !== undefined) @IsIn(['es']) language?: 'es'
  @ValidateIf((_o, v) => v !== undefined) @Timezone() timezone?: string
  @ValidateIf((_o, v) => v !== undefined) @IsArray() @ArrayMaxSize(5) @ArrayUnique() @IsIn(PROFILE_INTERESTS, { each: true }) interests?: string[]
}
export class UpdateProfileSettingsDto {
  @ValidateIf((_o, v) => v !== undefined) @Transform(trim) @IsString() @IsNotEmpty() @MaxLength(200) fullName?: string
  @IsOptional() @Transform(trim) @IsString() @MaxLength(50) phone?: string | null
  @ValidateIf((_o, v) => v !== undefined) @IsObject() @ValidateNested() @Type(() => ProfilePreferencesDto) preferences?: ProfilePreferencesDto
}
