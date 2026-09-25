export type SubjectPalette = {
  color: string
  soft: string
  foreground: string
}

// Bases de semantic-palette.css y una variante verde, en hex para el selector de color.
const colors = {
  blue: '#2B96EE',
  green: '#10B981',
  coral: '#EB5247',
  gold: '#FBBF24',
  violet: '#8B5CF6',
  teal: '#14B8A6',
  orange: '#F97316',
  rose: '#F43F5E',
  slate: '#64748B',
  greenDeep: '#0E9F70',
} as const

const rules: Array<{ terms: string[]; color: string }> = [
  { terms: ['optativa: ciencias y tecnologia'], color: colors.slate },
  { terms: ['optativa: matematica y tecnologia'], color: colors.violet },
  { terms: ['optativa: humanidades y lenguas'], color: colors.blue },
  { terms: ['biologia', 'ciencias de la vida', 'ecologia'], color: colors.green },
  { terms: ['ciencias de la tierra', 'tierra y del universo', 'geologia', 'astronomia'], color: colors.greenDeep },
  { terms: ['ciencias naturales', 'ciencias de la naturaleza'], color: colors.green },
  { terms: ['matematica', 'algebra', 'geometria'], color: colors.violet },
  { terms: ['lengua espanola', 'literatura', 'comunicacion'], color: colors.orange },
  { terms: ['ingles'], color: colors.blue },
  { terms: ['frances'], color: colors.teal },
  { terms: ['idioma', 'lenguas modernas'], color: colors.blue },
  { terms: ['ciencias sociales', 'historia', 'geografia', 'civica'], color: colors.gold },
  { terms: ['educacion artistica', 'arte', 'musica'], color: colors.rose },
  { terms: ['educacion fisica', 'deporte'], color: colors.orange },
  { terms: ['formacion integral', 'etica', 'religion'], color: colors.gold },
  { terms: ['quimica', 'ciencias fisicas', 'fisica'], color: colors.blue },
  { terms: ['tecnologia', 'informatica', 'computacion'], color: colors.violet },
]

function normalizeSubjectName(value: string) {
  return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function getSubjectPalette(subjectName: string, appearanceColor?: string | null): SubjectPalette {
  const normalized = normalizeSubjectName(subjectName)
  const match = rules.find(({ terms }) => terms.some((term) => normalized.includes(term)))
  let hash = 0
  for (const character of normalized || 'asignatura') hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  const fallbackColors = Object.values(colors)
  const color = appearanceColor && /^#[0-9a-f]{6}$/i.test(appearanceColor)
    ? appearanceColor
    : match?.color ?? fallbackColors[hash % fallbackColors.length]
  return { color, soft: `color-mix(in srgb, ${color} 15%, white)`, foreground: 'var(--foreground)' }
}
