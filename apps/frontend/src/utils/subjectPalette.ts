export type SubjectPalette = {
  color: string
  soft: string
  foreground: string
}

/*
 * Paleta original de AulaBase para asignaturas.
 * Mantiene las cuatro familias cromáticas que se usaban antes del rediseño
 * del calendario: azul, verde, coral y dorado, con variantes oscuras.
 */
const subjectPalettes = {
  blue: { color: '#3CB7E2', soft: '#3CB7E226', foreground: '#1F4B5A' },
  blueDark: { color: '#3890B2', soft: '#3CB7E220', foreground: '#23424E' },
  green: { color: '#66D64F', soft: '#66D64F26', foreground: '#315A28' },
  greenDark: { color: '#56A64B', soft: '#66D64F20', foreground: '#304F2B' },
  coral: { color: '#F6886F', soft: '#F6886F26', foreground: '#65382F' },
  coralDark: { color: '#BA6F62', soft: '#F6886F20', foreground: '#563A34' },
  gold: { color: '#F9C46B', soft: '#F9C46B30', foreground: '#674F27' },
  goldDark: { color: '#BC995F', soft: '#F9C46B28', foreground: '#55452D' },
} satisfies Record<string, SubjectPalette>

const subjectColorRules: Array<{ terms: string[]; palette: SubjectPalette }> = [
  { terms: ['educacion fisica', 'deporte'], palette: subjectPalettes.coral },
  { terms: ['ciencias de la vida', 'biologia', 'ecologia'], palette: subjectPalettes.green },
  { terms: ['ciencias de la tierra', 'tierra y del universo', 'geologia', 'astronomia'], palette: subjectPalettes.greenDark },
  { terms: ['quimica'], palette: subjectPalettes.blueDark },
  { terms: ['ciencias fisicas', 'fisica'], palette: subjectPalettes.blue },
  { terms: ['ciencias naturales', 'ciencias de la naturaleza'], palette: subjectPalettes.green },
  { terms: ['matematica', 'algebra', 'geometria'], palette: subjectPalettes.coralDark },
  { terms: ['lengua espanola', 'literatura', 'comunicacion'], palette: subjectPalettes.coral },
  { terms: ['ingles', 'frances', 'idioma', 'lenguas modernas'], palette: subjectPalettes.blue },
  { terms: ['ciencias sociales', 'historia', 'geografia', 'civica'], palette: subjectPalettes.goldDark },
  { terms: ['educacion artistica', 'arte', 'musica'], palette: subjectPalettes.coral },
  { terms: ['tecnologia', 'informatica', 'computacion'], palette: subjectPalettes.blueDark },
  { terms: ['formacion integral', 'etica', 'religion'], palette: subjectPalettes.gold },
  { terms: ['orientacion', 'tutoria'], palette: subjectPalettes.goldDark },
]

const fallbackPalettes: SubjectPalette[] = [
  subjectPalettes.blue,
  subjectPalettes.green,
  subjectPalettes.coral,
  subjectPalettes.gold,
  subjectPalettes.blueDark,
  subjectPalettes.greenDark,
  subjectPalettes.coralDark,
  subjectPalettes.goldDark,
]

function normalizeSubjectName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function stableSubjectPalette(subjectName: string) {
  const normalized = normalizeSubjectName(subjectName) || 'asignatura'
  let hash = 0

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0
  }

  return fallbackPalettes[hash % fallbackPalettes.length]
}

export function getSubjectPalette(subjectName: string) {
  const normalized = normalizeSubjectName(subjectName)
  const match = subjectColorRules.find(({ terms }) => terms.some((term) => normalized.includes(term)))
  return match?.palette ?? stableSubjectPalette(subjectName)
}
