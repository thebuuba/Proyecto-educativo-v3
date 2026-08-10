export type SubjectPalette = { color: string; soft: string }

const subjectColorRules: Array<{ terms: string[]; palette: SubjectPalette }> = [
  { terms: ['educacion fisica', 'deporte'], palette: { color: '#e23f49', soft: '#e23f491a' } },
  { terms: ['ciencias de la vida', 'biologia', 'ecologia'], palette: { color: '#06945c', soft: '#06945c1a' } },
  { terms: ['ciencias de la tierra', 'tierra y del universo', 'geologia', 'astronomia'], palette: { color: '#008d82', soft: '#008d821a' } },
  { terms: ['quimica'], palette: { color: '#00869b', soft: '#00869b1a' } },
  { terms: ['ciencias fisicas', 'fisica'], palette: { color: '#7040dc', soft: '#7040dc1a' } },
  { terms: ['ciencias naturales', 'ciencias de la naturaleza'], palette: { color: '#138a4b', soft: '#138a4b1a' } },
  { terms: ['matematica', 'algebra', 'geometria'], palette: { color: '#6734d1', soft: '#6734d11a' } },
  { terms: ['lengua espanola', 'literatura', 'comunicacion'], palette: { color: '#1d61c7', soft: '#1d61c71a' } },
  { terms: ['ingles', 'frances', 'idioma', 'lenguas modernas'], palette: { color: '#0086a6', soft: '#0086a61a' } },
  { terms: ['ciencias sociales', 'historia', 'geografia', 'civica'], palette: { color: '#d96008', soft: '#d960081a' } },
  { terms: ['educacion artistica', 'arte', 'musica'], palette: { color: '#d12f7c', soft: '#d12f7c1a' } },
  { terms: ['tecnologia', 'informatica', 'computacion'], palette: { color: '#007fb8', soft: '#007fb81a' } },
  { terms: ['formacion integral', 'etica', 'religion'], palette: { color: '#4f54ca', soft: '#4f54ca1a' } },
  { terms: ['orientacion', 'tutoria'], palette: { color: '#b87500', soft: '#b875001a' } },
]

const defaultSubjectColor: SubjectPalette = { color: '#3f5872', soft: '#3f587218' }

function normalizeSubjectName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function getSubjectPalette(subjectName: string) {
  const normalized = normalizeSubjectName(subjectName)
  const match = subjectColorRules.find(({ terms }) => terms.some((term) => normalized.includes(term)))
  return match?.palette ?? defaultSubjectColor
}
