export { PROFILE_COUNTRIES as countries, PROFILE_LEVELS as educationLevels, PROFILE_INTERESTS as allInterests } from '@aula/shared'
export const languages = [{ value: 'es', label: 'Español' }]
export const timezones = ['UTC', 'America/Santo_Domingo', 'America/La_Paz', 'Europe/Madrid', 'America/Mexico_City', 'America/Bogota', 'America/Buenos_Aires'].map(value => ({ value, label: value.replaceAll('_', ' ') }))
