type ActivityDefaults = { activityType: string; technique: string; instrument: string }

const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** Immediate defaults from the teacher's task, using only options already offered by the creator. */
export function activityDefaultSuggestions(title: string, description: string): ActivityDefaults | null {
  if (!title.trim() || !description.trim()) return null
  const heading = normalize(title)
  const task = normalize(description)
  const text = `${heading} ${task}`
  const has = (pattern: RegExp) => pattern.test(text)
  if (has(/\binformes?\b/) && has(/\b(?:elabor\w*|redact\w*|escrib\w*|prepar\w*|entreg\w*)\b/))
    return { activityType: 'REPORT', technique: 'analisis-producciones', instrument: 'rubrica' }
  if (has(/\bensayos?\b/)) return { activityType: 'ESSAY', technique: 'ensayo', instrument: 'rubrica' }
  if (has(/\bdebates?\b|\bdebat\w*\b/)) return { activityType: 'DEBATE', technique: 'debate', instrument: 'rubrica' }
  if (has(/\bexperimentos?\b|\bexperiment\w*\b/)) return { activityType: 'EXPERIMENT', technique: 'observacion-sistematica', instrument: 'rubrica' }
  if (has(/\blaboratorios?\b/)) return { activityType: 'LAB_PRACTICE', technique: 'observacion-sistematica', instrument: 'rubrica' }
  if (has(/\b(?:exposicion|exponer|expondr\w*)\b/)) return { activityType: 'EXPOSITION', technique: 'exposicion', instrument: 'rubrica' }
  if (has(/\bpresentacion oral\b/)) return { activityType: 'ORAL_PRESENTATION', technique: 'presentacion', instrument: 'rubrica' }
  if (has(/\b(?:investigacion|investigar\w*)\b/)) return { activityType: 'RESEARCH', technique: 'proyecto', instrument: 'rubrica' }
  if (has(/\bproyectos?\b/)) return { activityType: 'PROJECT', technique: 'proyecto', instrument: 'rubrica' }
  if (has(/\b(?:resolucion de problemas|resolver\w* problemas?)\b/)) return { activityType: 'PROBLEM_SOLVING', technique: 'resolucion-problemas', instrument: 'lista-ponderada' }
  if (has(/\b(?:mapas? conceptuales?|esquemas? conceptuales?)\b/)) return { activityType: 'CONCEPT_MAP', technique: 'mapa-conceptual', instrument: 'rubrica' }
  if (has(/\bportafolios?\b/)) return { activityType: 'PORTFOLIO', technique: 'portafolio', instrument: 'lista-cotejo' }
  if (has(/\b(?:cuestionarios?|examen(?:es)?|pruebas? escritas?)\b/)) return { activityType: 'QUIZ_TEST', technique: 'prueba-escrita', instrument: 'rubrica' }
  if (has(/\b(?:pintura|dibujo|escultura|produccion artistica)\b/)) return { activityType: 'ARTISTIC_PRODUCTION', technique: 'analisis-producciones', instrument: 'rubrica' }
  if (has(/\b(?:dramatizacion|representacion escenica)\b/)) return { activityType: 'PERFORMANCE', technique: 'dramatizacion', instrument: 'rubrica' }
  if (has(/\b(?:deporte|practica motriz|actividad deportiva)\b/)) return { activityType: 'MOTOR_SPORTS_PRACTICE', technique: 'observacion-directa', instrument: 'escala' }
  if (has(/\b(?:observacion|clasificacion)\b/)) return { activityType: 'OBSERVATION', technique: 'observacion-sistematica', instrument: 'lista-cotejo' }
  if (has(/\b(?:ejercicios?|practicas?)\b/)) return { activityType: 'EXERCISE_SET', technique: 'analisis-producciones', instrument: 'rubrica' }
  if (has(/\b(?:informe|cuento|poema|texto escrito|redact\w*|escrib\w*)\b/)) return { activityType: 'WRITTEN_PRODUCTION', technique: 'analisis-producciones', instrument: 'rubrica' }
  return { activityType: 'OTHER', technique: 'observacion-directa', instrument: 'lista-cotejo' }
}
