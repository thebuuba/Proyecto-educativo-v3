export type SubjectPalette = {
  color: string
  soft: string
  foreground: string
}

/*
 * Paleta inspirada en el calendario de referencia: tonos pastel fríos y cálidos,
 * suficientemente distintos entre sí pero con el mismo nivel visual. La asignación
 * se hace siempre a partir del nombre normalizado de la materia, por lo que una
 * asignatura conserva el mismo color en Cursos, Horario y cualquier otra vista que
 * use getSubjectPalette.
 */
const subjectPalettes = {
  sky: { color: '#4A9CB1', soft: '#C4ECF7', foreground: '#20383E' },
  periwinkle: { color: '#627FA8', soft: '#D7E5F5', foreground: '#263444' },
  lavender: { color: '#7465A7', soft: '#D7CDF3', foreground: '#312C45' },
  pink: { color: '#A65B8E', soft: '#F9D9F3', foreground: '#432D3E' },
  peach: { color: '#A87547', soft: '#F8E2CB', foreground: '#443327' },
  sage: { color: '#67847C', soft: '#C5DAD5', foreground: '#293A35' },
  mint: { color: '#56877E', soft: '#D8EEE9', foreground: '#273B36' },
  butter: { color: '#947C43', soft: '#F5E7B9', foreground: '#403823' },
  coral: { color: '#9B685B', soft: '#F4D8CF', foreground: '#402F2A' },
  aqua: { color: '#4D8790', soft: '#CFEAEC', foreground: '#26393D' },
  lilac: { color: '#89679A', soft: '#E7D8EF', foreground: '#3B2E42' },
  sand: { color: '#92775F', soft: '#EEDFD1', foreground: '#3F342B' },
} satisfies Record<string, SubjectPalette>

/*
 * Reglas explícitas para las materias más comunes. Las más específicas deben ir
 * primero para evitar que nombres como “Ciencias de la Naturaleza: Química” caigan
 * en la regla genérica de Ciencias Naturales.
 */
const subjectColorRules: Array<{ terms: string[]; palette: SubjectPalette }> = [
  { terms: ['sexualidad humana'], palette: subjectPalettes.pink },
  { terms: ['humanidades y lenguas modernas'], palette: subjectPalettes.lavender },
  { terms: ['ciencias fisicas'], palette: subjectPalettes.sky },
  { terms: ['ciencias de la tierra y del universo', 'tierra y del universo', 'astronomia', 'geologia'], palette: subjectPalettes.peach },
  { terms: ['ciencias de la vida'], palette: subjectPalettes.sage },
  { terms: ['biologia', 'ecologia'], palette: subjectPalettes.mint },
  { terms: ['quimica'], palette: subjectPalettes.lavender },
  { terms: ['fisica'], palette: subjectPalettes.periwinkle },
  { terms: ['matematica', 'algebra', 'geometria', 'estadistica'], palette: subjectPalettes.peach },
  { terms: ['lengua espanola', 'literatura', 'comunicacion'], palette: subjectPalettes.pink },
  { terms: ['ingles', 'frances', 'idioma', 'lenguas modernas'], palette: subjectPalettes.lavender },
  { terms: ['ciencias sociales', 'historia', 'geografia', 'civica'], palette: subjectPalettes.butter },
  { terms: ['educacion artistica', 'arte', 'musica', 'teatro'], palette: subjectPalettes.coral },
  { terms: ['tecnologia', 'informatica', 'computacion', 'programacion'], palette: subjectPalettes.aqua },
  { terms: ['educacion fisica', 'deporte'], palette: subjectPalettes.sage },
  { terms: ['formacion integral', 'etica', 'religion'], palette: subjectPalettes.sand },
  { terms: ['orientacion', 'tutoria'], palette: subjectPalettes.lilac },
  { terms: ['ciencias naturales', 'ciencias de la naturaleza'], palette: subjectPalettes.sky },
]

const fallbackPalettes: SubjectPalette[] = [
  subjectPalettes.sky,
  subjectPalettes.peach,
  subjectPalettes.pink,
  subjectPalettes.lavender,
  subjectPalettes.sage,
  subjectPalettes.periwinkle,
  subjectPalettes.mint,
  subjectPalettes.butter,
  subjectPalettes.coral,
  subjectPalettes.aqua,
  subjectPalettes.lilac,
  subjectPalettes.sand,
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
