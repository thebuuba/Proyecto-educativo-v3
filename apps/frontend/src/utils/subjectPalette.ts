export type SubjectPalette = {
  color: string
  soft: string
  foreground: string
}

/*
 * Paleta académica basada en la asociación de colores usada tradicionalmente
 * para organizar las materias escolares en República Dominicana.
 *
 * El color se resuelve siempre a partir del nombre normalizado de la asignatura,
 * por lo que una misma materia conserva su identidad visual en Cursos, Horario
 * y cualquier otra vista que use getSubjectPalette.
 *
 * Para la interfaz se usan versiones pastel como fondo, manteniendo un tono
 * principal reconocible y suficiente contraste para el texto.
 */
const subjectPalettes = {
  spanishBlue: { color: '#3579C9', soft: '#DCEBFA', foreground: '#203B5B' },
  mathRed: { color: '#D95A67', soft: '#F7DADD', foreground: '#542B32' },
  socialGreen: { color: '#4D9B67', soft: '#DCEEDF', foreground: '#294634' },
  scienceYellow: { color: '#C79A24', soft: '#FFF0B8', foreground: '#4B4020' },
  religionViolet: { color: '#7C63BC', soft: '#E7DFF5', foreground: '#3D3454' },
  englishOrange: { color: '#DF843D', soft: '#F8DFC8', foreground: '#573821' },
  frenchLightBlue: { color: '#6AA6CE', soft: '#DDECF6', foreground: '#2D4658' },
  artisticPink: { color: '#D45B98', soft: '#F6D8E7', foreground: '#552B40' },
  physicalGray: { color: '#7D8794', soft: '#E7E9EC', foreground: '#343B43' },
  technologyGray: { color: '#66717D', soft: '#E1E5E8', foreground: '#30363C' },

  /* Materias complementarias que no forman parte del código tradicional. */
  humanPink: { color: '#B8638D', soft: '#F1DCE7', foreground: '#4B3040' },
  orientationTeal: { color: '#5B8F8A', soft: '#DCECE9', foreground: '#2D4542' },
  electiveLavender: { color: '#8571AF', soft: '#E7E0F1', foreground: '#40374F' },
} satisfies Record<string, SubjectPalette>

/*
 * Las reglas más específicas van primero. Esto evita que, por ejemplo,
 * “Ciencias de la Naturaleza: Química” reciba otro color distinto al amarillo
 * tradicional reservado para Ciencias de la Naturaleza.
 */
const subjectColorRules: Array<{ terms: string[]; palette: SubjectPalette }> = [
  /* Francés se diferencia de Inglés con azul claro. */
  { terms: ['frances'], palette: subjectPalettes.frenchLightBlue },

  /* Idiomas extranjeros: naranja. */
  { terms: ['ingles', 'idioma extranjero', 'lenguas modernas', 'humanidades y lenguas modernas'], palette: subjectPalettes.englishOrange },

  /* Lengua Española: azul. */
  { terms: ['lengua espanola', 'lengua y literatura', 'literatura', 'comunicacion'], palette: subjectPalettes.spanishBlue },

  /* Matemática: rojo. */
  { terms: ['matematica', 'algebra', 'geometria', 'estadistica', 'calculo', 'trigonometria'], palette: subjectPalettes.mathRed },

  /* Ciencias Sociales: verde. */
  { terms: ['ciencias sociales', 'historia', 'geografia', 'civica', 'ciudadania'], palette: subjectPalettes.socialGreen },

  /*
   * Ciencias de la Naturaleza: amarillo. Incluye sus áreas de Secundaria
   * para que Física, Química, Biología, Ciencias de la Vida y Ciencias de la
   * Tierra y del Universo mantengan la misma identidad curricular.
   */
  {
    terms: [
      'ciencias naturales',
      'ciencias de la naturaleza',
      'ciencias fisicas',
      'fisica',
      'quimica',
      'biologia',
      'ecologia',
      'ciencias de la vida',
      'ciencias de la tierra',
      'tierra y del universo',
      'astronomia',
      'geologia',
    ],
    palette: subjectPalettes.scienceYellow,
  },

  /* Formación Integral, Humana y Religiosa: violeta. */
  {
    terms: [
      'formacion integral humana y religiosa',
      'formacion integral',
      'fih',
      'fihr',
      'religion',
      'educacion religiosa',
      'etica',
    ],
    palette: subjectPalettes.religionViolet,
  },

  /* Educación Artística: rosado/fucsia. */
  { terms: ['educacion artistica', 'artistica', 'arte', 'musica', 'teatro', 'artes visuales'], palette: subjectPalettes.artisticPink },

  /* Educación Física: gris. */
  { terms: ['educacion fisica', 'deporte', 'actividad fisica'], palette: subjectPalettes.physicalGray },

  /* Informática / Computación: gris plateado. */
  { terms: ['informatica', 'computacion', 'tecnologia', 'programacion', 'robotica'], palette: subjectPalettes.technologyGray },

  /* Materias complementarias que aparecen actualmente en AulaBase. */
  { terms: ['sexualidad humana'], palette: subjectPalettes.humanPink },
  { terms: ['orientacion', 'tutoria'], palette: subjectPalettes.orientationTeal },
]

/*
 * Para materias no contempladas explícitamente se mantiene una asignación
 * determinística: el mismo nombre recibe siempre el mismo color.
 */
const fallbackPalettes: SubjectPalette[] = [
  subjectPalettes.spanishBlue,
  subjectPalettes.mathRed,
  subjectPalettes.socialGreen,
  subjectPalettes.scienceYellow,
  subjectPalettes.religionViolet,
  subjectPalettes.englishOrange,
  subjectPalettes.frenchLightBlue,
  subjectPalettes.artisticPink,
  subjectPalettes.physicalGray,
  subjectPalettes.technologyGray,
  subjectPalettes.humanPink,
  subjectPalettes.orientationTeal,
  subjectPalettes.electiveLavender,
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
