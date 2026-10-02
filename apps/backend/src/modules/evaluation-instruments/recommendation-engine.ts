import type { CurriculumReference, InstrumentRecommendation, RecommendationCriterion } from '@aula/shared'
import { type EvaluationCatalog, evaluationCatalogV1 } from './catalog-v1'
import { type AcademicContext, type ScopeCandidate, discipline, normalize } from './curriculum-context'

export interface RecommendationInput {
  activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'
  pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; levelCount?: 4 | 5
  preferredInstrumentType?: 'rubrica' | 'lista-cotejo' | 'escala' | 'lista-ponderada'
  selectedCurriculumElementIds?: string[]
}
export interface RankedElement extends CurriculumReference { normalizedText: string }
const stopWords = new Set('a al algo ante bajo con contra cual cuando de del desde durante e el ella en entre es esa ese esta este hay hasta la las le les lo los mas mi muy o para pero por que quien se segun ser si sin sobre su sus un una unos unas y'.split(' '))
// Conservative plural stems; no semantic synonym guessing or cross-scope retrieval.
export const tokens = (text: string) => [...new Set(normalize(text).split(' ').filter(t => t.length > 2 && !stopWords.has(t)).map(t => t.length > 5 ? t.replace(/(?:es|s)$/, '').replace(/[oa]$/, '') : t))]
/** Bounded Damerau-Levenshtein. Two-token prefix gate blocks unrelated words. */
function editDistance(left: string, right: string, limit: number) {
  if (Math.abs(left.length - right.length) > limit) return limit + 1
  const matrix = Array.from({ length: left.length + 1 }, () => new Array<number>(right.length + 1).fill(0))
  for (let i = 0; i <= left.length; i++) matrix[i][0] = i
  for (let j = 0; j <= right.length; j++) matrix[0][j] = j
  for (let i = 1; i <= left.length; i++) for (let j = 1; j <= right.length; j++) {
    matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1))
    if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1)
  }
  return matrix[left.length][right.length]
}
export function similarToken(query: string, candidate: string) {
  if (query === candidate) return true
  if (query.length < 5 || candidate.length < 5 || query.slice(0, 2) !== candidate.slice(0, 2)) return false
  const limit = Math.min(query.length, candidate.length) >= 8 ? 2 : 1
  return editDistance(query, candidate, limit) <= limit
}
const overlap = (query: string[], text: string) => { const values = tokens(text); return query.filter(t => values.some(candidate => similarToken(t, candidate))).length }
const typeWeights: Record<string, number> = { SPECIFIC_COMPETENCY: 12, EVALUATION_CRITERION: 14, ACHIEVEMENT_INDICATOR: 16, CONCEPT: 10, PROCEDURE: 12, ATTITUDE_VALUE: 3 }
const blockTerms: Record<string, string> = { b1: 'comunica comunicacion oral escrita', b2: 'pensamiento razonamiento problemas creativo critico', b3: 'etica ciudadana personal espiritual', b4: 'cientifica tecnologica ambiental salud' }
const boilerplate = tokens('actividad exposición presentación oral experimento experimentación práctica laboratorio producción escrita resolución problemas ejercicios artística observación clasificación estudiantes estudiante realizar mediante sobre tema')
export function topicTerms(title: string, description = '') {
  const fromTitle = tokens(title).filter(t => !boilerplate.includes(t) && !/^\d+$/.test(t))
  const fromDescription = tokens(description).filter(t => !boilerplate.includes(t) && !/^\d+$/.test(t))
  return fromTitle.length >= 2 ? fromTitle : [...new Set([...fromTitle, ...fromDescription])].slice(0, 8)
}
export function detectActivityType(title: string, description: string, catalog: EvaluationCatalog = evaluationCatalogV1) {
  const find = (value: string, descriptionMode = false) => {
    const text = normalize(value)
    const words = tokens(text)
    const matched = (trigger: string) => text.includes(normalize(trigger)) || tokens(trigger).every(part => words.some(word => similarToken(word, part)))
    return catalog.activityTypes.filter(a => (!a.id.startsWith('NEWS_') || /noticia|noticiero/.test(text))
      && (!a.id.startsWith('TOURIST_GUIDE_') || /guias? turisticas?/.test(text)) && a.triggers.some(matched)
      && (!a.id.startsWith('POSTER_') || /afiches?/.test(text))
      && (!a.id.startsWith('READING_REPORT_') || /informe(?:s)? de lectura/.test(text))
      && (!a.id.startsWith('DETECTIVE_STORY_') || /cuento(?:s)? (?:policiacos?|detectivescos?)/.test(text))
      && (!a.id.startsWith('CALLIGRAM_') || /caligramas?/.test(text) || /(?:versos|palabras).*formando (?:la )?silueta/.test(text))
      && (!descriptionMode || a.triggers.some(trigger => {
        const normalizedTrigger = normalize(trigger)
        const actionRoot = normalizedTrigger.split(' ')[0].replace(/(?:ar|er|ir)$/, '')
        return (/^(?:cre|disen|distrib|elabor|hac|produc|redact|escrib|le|analiz|identific|compar|explic|expon|present|narr|cont|recit|declam|interpret|resolv|investig)/.test(normalizedTrigger)
          && new RegExp(`\\b${actionRoot}[a-z]*\\b`).test(text))
          || new RegExp(`(?:realiz|prepar|hacer|present)[a-z]*\\s+(?:una?\\s+)?${normalizedTrigger.replace(/\s+/g, '\\s+')}`).test(text)
      })))
      .sort((a, b) => Math.max(...b.triggers.filter(matched).map(t => t.length)) - Math.max(...a.triggers.filter(matched).map(t => t.length)))[0]
  }
  // The description normally expresses the task the student will perform. The title
  // is supporting context and may only name the topic (for example, "La noticia").
  return find(description, true) ?? find(title) ?? catalog.activityTypes.find(a => a.id === 'OTHER')!
}
export function rankCurriculum(title: string, description: string, activityType: string, competencyBlock: string | undefined,
  scope: ScopeCandidate | null, elements: RankedElement[], catalog: EvaluationCatalog = evaluationCatalogV1) {
  const activity = catalog.activityTypes.find(a => a.id === activityType) ?? catalog.activityTypes.find(a => a.id === 'OTHER')!
  const topic = topicTerms(title, description)
  const detail = tokens(description)
  const attitudeRelevant = /convivencia|cooperaci|valores|respeto|solidaridad|seguridad/.test(normalize(`${title} ${description}`))
  return elements.filter(e => scope && e.scopeId === scope.id && e.versionId === scope.versionId && e.type in typeWeights && (e.type !== 'ATTITUDE_VALUE' || attitudeRelevant))
    .map(element => {
      const matches = overlap(topic, element.normalizedText)
      const topicCoverage = topic.length ? matches / topic.length : 0
      const block = ['SPECIFIC_COMPETENCY', 'EVALUATION_CRITERION', 'ACHIEVEMENT_INDICATOR'].includes(element.type)
        ? overlap(tokens(blockTerms[competencyBlock ?? ''] ?? ''), element.normalizedText) : 0
      const procedure = element.type === 'PROCEDURE' ? overlap(tokens(activity.triggers.join(' ')), element.normalizedText) : 0
      const detailMatches = overlap(detail, element.normalizedText)
      return { element, score: matches ? Math.round(100 * topicCoverage + typeWeights[element.type] + Math.min(block, 3) * 2 + Math.min(procedure, 2) * 3 + Math.min(detailMatches, 4) * 2) : 0,
        topicCoverage, reasons: [`topicTokens=${matches}/${topic.length}`, `typeWeight=${typeWeights[element.type]}`, `blockMatches=${block}`, `procedureMatches=${procedure}`] }
    }).filter(r => r.score > 0).sort((a, b) => b.score - a.score || a.element.elementId.localeCompare(b.element.elementId))
}

/** Integer hundredths are the scoring authority; numeric fields are display conveniences. */
export function distributeScore(maxScore: number, weights: number[]) {
  const units = Math.round(maxScore * 100)
  if (!Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 10000 || Math.abs(units / 100 - maxScore) > 1e-9 || !weights.length || weights.some(w => !Number.isInteger(w) || w <= 0)) throw new Error('Puntuación inválida: use hasta dos decimales y pesos enteros positivos.')
  // Prefer whole or half points when the activity total permits it.
  const sum = weights.reduce((a, b) => a + b, 0)
  const smallest = Math.min(...weights)
  const quantum = units % 100 === 0 && units * smallest >= sum * 100 ? 100
    : units % 50 === 0 && units * smallest >= sum * 50 ? 50 : 1
  const slots = units / quantum
  const results = weights.map(w => Math.floor(slots * w / sum))
  const order = weights.map((w, index) => ({ index, remainder: slots * w % sum })).sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  let remaining = slots - results.reduce((a, b) => a + b, 0)
  for (const { index } of order) { if (!remaining) break; results[index]++; remaining-- }
  return results.map(value => value * quantum)
}

function teacherTopic(title: string) {
  const match = title.match(/(?:sobre|de|del|con)\s+(.+)$/i)
  return (match?.[1] ?? title).trim().replace(/[.!?]+$/, '').toLocaleLowerCase('es-DO')
}

function learningDimensions(description: string, topic: string) {
  const text = description.replace(/\s+/g, ' ').trim()
  const dimensions: Array<{ title: string; observable: string }> = []
  const formation = text.match(/(?:explicar(?:[áa]n)?|describir(?:[áa]n)?)\s+c[oó]mo\s+se\s+([\p{L}]+)(?:\s+([^,.;]+?))?(?=\s+(?:e|y)\s+(?:identificar|describir|diferenciar|explicar)|[,.;]|$)/iu)
  if (formation) { const subject = formation[2]?.trim() || topic; dimensions.push({ title: `Comprensión de cómo se ${formation[1]} ${subject}`, observable: `Explica cómo se ${formation[1]} ${subject}` }) }
  const parts = text.match(/identificar(?:[áa]n)?\s+(sus|las|los)\s+([^,.;]+?)(?=\s+(?:e|y)\s+(?:describir|explicar|diferenciar)|[,.;]|$)/iu)
  if (parts) dimensions.push({ title: `Identificación de ${parts[2]} de ${topic}`, observable: `Identifica ${parts[2]} de ${topic}` })
  const processes = text.match(/identificar(?:[áa]n)?\s+si\s+ocurre\s+([^.;]+?)(?=,\s*(?:registrar|explicar)|[.;]|$)/iu)
  if (processes) dimensions.push({ title: `Identificación de ${processes[1]}`, observable: `Identifica ${processes[1]}` })
  const explain = text.match(/explicar(?:[áa]n)?\s+con\s+sus\s+propias\s+palabras\s+([^.;]+)/iu)
  if (explain) dimensions.push({ title: `Explicación de ${explain[1]}`, observable: `Explica con sus propias palabras ${explain[1]}` })
  // These grammatical cues come from the teacher's text, not from an inferred syllabus.
  // A broader clause may contain several cues ("qué son..., cómo se forman..., sus partes...").
  const formationCue = text.match(/c[oó]mo\s+se\s+([\p{L}]+)(?:\s+((?:el|la|los|las)\s+[\p{L}]+))?/iu)
  if (formationCue && !dimensions.some(item => normalize(item.observable).includes(normalize(`como se ${formationCue[1]}`)))) {
    const subject = formationCue[2] ?? topic
    dimensions.push({ title: `Comprensión de cómo se ${formationCue[1]} ${subject}`, observable: `Explica cómo se ${formationCue[1]} ${subject}` })
  }
  if (/\b(?:sus|las|los)\s+(?:principales\s+)?partes\b/iu.test(text) && !dimensions.some(item => /partes/iu.test(item.title))) {
    dimensions.push({ title: `Identificación de las partes de ${topic}`, observable: `Identifica las partes principales de ${topic}` })
  }
  const types = text.match(/\b(?:diferentes\s+)?tipos\s+de\s+([\p{L}]+(?:\s+de\s+[\p{L}]+)?)/iu)
  if (types && !dimensions.some(item => normalize(item.title).includes(normalize(types[1])))) {
    dimensions.push({ title: `Distinción de tipos de ${types[1]}`, observable: `Distingue los tipos de ${types[1]} descritos en la actividad` })
  }
  if (/\briesgos?\b/iu.test(text) && !dimensions.some(item => /riesgos?/iu.test(item.title))) {
    dimensions.push({ title: `Análisis de riesgos de ${topic}`, observable: `Explica los riesgos de ${topic} indicados en la actividad` })
  }
  return dimensions.slice(0, 2).map(item => ({ title: item.title.replace(/\s+/g, ' ').trim(), observable: `${item.observable.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '')}.` }))
}

function contextualDescriptors(observable: string, indexes: number[], title: string, templateId: string) {
  const action = observable.trim().replace(/[.!?]+$/, '')
  const content = ['science-content', 'math-comprehension', 'language-content', 'social-context'].includes(templateId)
  return indexes.map(index => index === 0 ? `${action}; ${content ? 'abarca todos los aspectos indicados y establece relaciones correctas' : 'mantiene el desempeño durante toda la actividad de forma autónoma'}.`
    : index === 1 ? `${action}; cubre los aspectos principales sin errores relevantes.`
      : index === 2 ? `${action}, aunque omite algún aspecto o presenta imprecisiones.`
        : index === 3 ? `${action} solo en parte; necesita apoyo para completar la evidencia.`
          : `No aporta evidencia suficiente para valorar ${title.toLocaleLowerCase('es-DO')}.`)
}

type AuthoredCriterion = { templateId: string; title: string; observable: string; weight: number }

function newsCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  if (activityType === 'NEWSCAST' || /noticiero|present(?:ar|aran).*noticia/.test(text)) return [
    { templateId: 'news-content', title: 'Información periodística', observable: 'Presenta hechos relevantes y verificables, distinguiendo la información principal de los detalles.', weight: 5 },
    { templateId: 'news-structure', title: 'Estructura y preguntas de la noticia', observable: 'Comunica un titular y desarrolla qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.', weight: 5 },
    { templateId: 'news-sequence', title: 'Organización del noticiero', observable: 'Ordena las noticias y enlaza las intervenciones con una secuencia clara para la audiencia.', weight: 3 },
    { templateId: 'news-oral', title: 'Claridad de la comunicación oral', observable: 'Expone con dicción, ritmo, entonación y volumen comprensibles.', weight: 4 },
    { templateId: 'news-individual', title: 'Dominio individual de la noticia asignada', observable: 'Explica su noticia con seguridad y responde por su propio desempeño dentro de la presentación del equipo.', weight: 3 },
  ]
  if (activityType === 'NEWS_ANALYSIS' || /leer|analiz|identific/.test(text)) return [
    { templateId: 'news-purpose', title: 'Identificación de la función de la noticia', observable: 'Reconoce el propósito informativo y el hecho que convierte el texto en noticia.', weight: 4 },
    { templateId: 'news-structure', title: 'Identificación de sus partes', observable: 'Identifica titular, entrada o copete y cuerpo en la noticia analizada.', weight: 5 },
    { templateId: 'news-questions', title: 'Interrogantes fundamentales', observable: 'Localiza qué ocurrió, a quién, dónde, cuándo y cómo ocurrió a partir de la información del texto.', weight: 5 },
    { templateId: 'news-interpretation', title: 'Interpretación de la información', observable: 'Explica la información principal y establece inferencias sustentadas en la noticia.', weight: 4 },
    { templateId: 'news-evidence', title: 'Justificación con evidencias', observable: 'Sustenta sus respuestas con datos o fragmentos pertinentes de la noticia.', weight: 2 },
  ]
  if (activityType === 'NEWS_COMPARISON' || /compar/.test(text)) return [
    { templateId: 'news-purpose', title: 'Propósito y hecho noticioso', observable: 'Identifica el propósito y el hecho principal de cada noticia.', weight: 4 },
    { templateId: 'news-comparison', title: 'Comparación de la información', observable: 'Establece semejanzas y diferencias entre los datos, enfoques y organización de las noticias.', weight: 5 },
    { templateId: 'news-structure', title: 'Comparación de la estructura', observable: 'Contrasta el uso del titular, la entrada y el cuerpo en cada texto.', weight: 4 },
    { templateId: 'news-evidence', title: 'Uso de evidencias', observable: 'Sustenta la comparación con información concreta de ambas noticias.', weight: 4 },
    { templateId: 'news-conclusion', title: 'Conclusión de la comparación', observable: 'Formula una conclusión coherente con las semejanzas y diferencias encontradas.', weight: 3 },
  ]
  if (activityType === 'DEBATE' || /debat/.test(text)) return [
    { templateId: 'news-comprehension', title: 'Comprensión del hecho noticioso', observable: 'Explica el hecho debatido y diferencia datos informativos de opiniones.', weight: 5 },
    { templateId: 'news-evidence', title: 'Argumentos sustentados', observable: 'Defiende su postura con datos pertinentes de la noticia.', weight: 5 },
    { templateId: 'news-counterargument', title: 'Respuesta a otras posturas', observable: 'Escucha y responde a argumentos contrarios sin apartarse del tema.', weight: 4 },
    { templateId: 'news-oral', title: 'Claridad de la intervención', observable: 'Comunica sus ideas con orden, precisión y un tono adecuado.', weight: 3 },
    { templateId: 'news-participation', title: 'Participación en el debate', observable: 'Respeta los turnos y las reglas acordadas para el intercambio.', weight: 3 },
  ]
  return [
    { templateId: 'news-essential', title: 'Información esencial de la noticia', observable: 'Redacta un hecho noticioso claro y responde qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.', weight: 5 },
    { templateId: 'news-structure', title: 'Titular, entrada y cuerpo', observable: 'Organiza la noticia con un titular pertinente, una entrada informativa y un cuerpo que desarrolla los datos.', weight: 5 },
    { templateId: 'news-sequence', title: 'Secuencia y cohesión', observable: 'Ordena la información y utiliza conectores de orden y temporales para relacionar las ideas.', weight: 4 },
    { templateId: 'news-language', title: 'Lenguaje periodístico', observable: 'Emplea un registro formal, vocabulario preciso y formas verbales adecuadas al hecho narrado.', weight: 3 },
    { templateId: 'news-revision', title: 'Revisión de la versión escrita', observable: 'Revisa puntuación, ortografía y claridad antes de presentar la versión final.', weight: 3 },
  ]
}

function requestedPlaceCount(text: string) {
  const match = text.match(/\b(\d+|dos|tres|cuatro|cinco)\s+lugares?\b/)
  return match?.[1] ?? null
}

function touristGuideCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  const count = requestedPlaceCount(text)
  const placeScope = count ? `${count} lugares solicitados` : 'los lugares seleccionados'
  const graphicsRequested = /imagen|foto|mapa|grafico|dibujo|collage|recurso visual/.test(text)
  if (activityType === 'TOURIST_GUIDE_ANALYSIS') return [
    { templateId: 'guide-purpose', title: 'Propósito y destinatario de la guía', observable: 'Explica cómo la guía orienta e informa a sus posibles visitantes.', weight: 4 },
    { templateId: 'guide-structure', title: 'Identificación de la estructura', observable: 'Identifica portada, información, imágenes y cierre, según estén presentes en la guía leída.', weight: 5 },
    { templateId: 'guide-resources', title: 'Recursos para orientar al visitante', observable: 'Analiza cómo el vocabulario descriptivo y persuasivo, las marcas paratextuales y los recursos gráficos disponibles orientan al visitante.', weight: 5 },
    { templateId: 'guide-interpretation', title: 'Interpretación de la información', observable: 'Reconstruye el sentido global y explica la información relevante sobre los lugares descritos.', weight: 4 },
    { templateId: 'guide-evidence', title: 'Justificación con evidencias', observable: 'Sustenta sus respuestas con datos y ejemplos concretos de la guía analizada.', weight: 2 },
  ]
  if (activityType === 'TOURIST_GUIDE_PRESENTATION') return [
    { templateId: 'guide-content', title: `Información de ${placeScope}`, observable: `Presenta información pertinente y veraz sobre ${placeScope}.`, weight: 5 },
    { templateId: 'guide-purpose', title: 'Orientación al visitante', observable: 'Describe los atractivos y cualidades de los lugares con vocabulario adecuado al público.', weight: 4 },
    { templateId: 'guide-organization', title: 'Organización de la presentación', observable: 'Ordena la información de la guía en una secuencia clara y fácil de seguir.', weight: 4 },
    { templateId: 'guide-oral', title: 'Claridad de la comunicación oral', observable: 'Expone con dicción, volumen, ritmo y entonación comprensibles.', weight: 4 },
    { templateId: 'guide-individual', title: 'Dominio individual', observable: 'Explica los lugares asignados y responde preguntas desde su propio dominio del contenido.', weight: 3 },
  ]
  if (activityType === 'TOURIST_GUIDE_COMPARISON') return [
    { templateId: 'guide-purpose', title: 'Propósito y destinatario', observable: 'Compara el propósito y el público al que se dirige cada guía turística.', weight: 4 },
    { templateId: 'guide-comparison', title: 'Comparación del contenido', observable: 'Establece semejanzas y diferencias entre la información y los atractivos presentados.', weight: 5 },
    { templateId: 'guide-structure', title: 'Comparación de la estructura', observable: 'Contrasta la organización de portada, información, imágenes y cierre en las guías.', weight: 4 },
    { templateId: 'guide-resources', title: 'Comparación de recursos', observable: 'Analiza el vocabulario y los recursos gráficos o paratextuales empleados para orientar y persuadir.', weight: 4 },
    { templateId: 'guide-conclusion', title: 'Conclusión sustentada', observable: 'Formula una conclusión apoyada en evidencias concretas de ambas guías.', weight: 3 },
  ]
  return [
    { templateId: 'guide-content', title: `Información de ${placeScope}`, observable: `Incluye información pertinente y veraz sobre ${placeScope}, destacando sus características y atractivos.`, weight: 5 },
    { templateId: 'guide-structure', title: 'Estructura de la guía turística', observable: `Organiza la guía con portada, información y cierre${graphicsRequested ? ', e integra las imágenes solicitadas' : ''}.`, weight: 5 },
    { templateId: 'guide-description', title: 'Descripción y orientación al visitante', observable: 'Describe los lugares con sustantivos propios, adjetivos y verbos en presente, usando vocabulario atractivo adecuado al público.', weight: 4 },
    { templateId: 'guide-organization', title: 'Organización y claridad', observable: 'Distribuye la información en una secuencia comprensible y relaciona el contenido con el propósito de orientar al visitante.', weight: 3 },
    { templateId: 'guide-revision', title: 'Revisión de la versión final', observable: 'Revisa la claridad, la puntuación, la ortografía y la presentación antes de publicar la guía física o digital.', weight: 3 },
  ]
}

function posterTopic(title: string, description: string) {
  const text = normalize(`${title} ${description}`)
  if (/agua/.test(text)) return 'el cuidado y ahorro del agua'
  if (/convivencia escolar/.test(text)) return 'la convivencia escolar'
  if (/cuidado del entorno|cuidar el entorno/.test(text)) return 'el cuidado del entorno'
  const about = text.match(/afiche (?:sobre|para promover|para prevenir) ([^,.;]+)/)?.[1]
  return about?.trim() || 'el tema indicado'
}

function posterCriteria(activityType: string, title: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  const topic = posterTopic(title, description)
  const visualsRequested = /imagen|imagenes|elementos visuales|forma|color|tipo de letra/.test(text)
  if (activityType === 'POSTER_ANALYSIS') return [
    { templateId: 'poster-purpose', title: 'Propósito y destinatarios del afiche', observable: `Interpreta la intención comunicativa del afiche sobre ${topic} e identifica a quién se dirige.`, weight: 4 },
    { templateId: 'poster-message', title: 'Interpretación del mensaje', observable: `Explica el mensaje principal sobre ${topic} y realiza inferencias coherentes a partir del afiche.`, weight: 5 },
    { templateId: 'poster-persuasion', title: 'Recursos para convencer', observable: 'Identifica y explica cómo las palabras clave, los argumentos y los recursos persuasivos buscan atraer, motivar o convencer.', weight: 5 },
    { templateId: 'poster-visuals', title: 'Relación entre texto y elementos visuales', observable: 'Analiza cómo imágenes, letras, colores y distribución espacial contribuyen al mensaje.', weight: 4 },
    { templateId: 'poster-evidence', title: 'Evidencias del afiche', observable: 'Justifica su interpretación con palabras, frases o elementos visuales concretos del afiche leído.', weight: 2 },
  ]
  if (activityType === 'POSTER_COMPARISON') return [
    { templateId: 'poster-purpose', title: 'Propósito y destinatarios', observable: `Compara el propósito y el público de los dos afiches sobre ${topic}.`, weight: 4 },
    { templateId: 'poster-comparison', title: 'Comparación de mensajes y argumentos', observable: 'Establece semejanzas y diferencias entre los mensajes, argumentos y recursos persuasivos.', weight: 5 },
    { templateId: 'poster-visuals', title: 'Comparación de recursos visuales', observable: 'Contrasta la relación entre texto, imágenes, letras, colores y organización en ambos afiches.', weight: 4 },
    { templateId: 'poster-effectiveness', title: 'Eficacia comunicativa', observable: 'Valora cuál afiche comunica mejor su mensaje considerando claridad, público y capacidad de convencer.', weight: 4 },
    { templateId: 'poster-evidence', title: 'Justificación con evidencias', observable: 'Sustenta su valoración con elementos concretos de ambos afiches.', weight: 3 },
  ]
  if (activityType === 'POSTER_PRESENTATION') return [
    { templateId: 'poster-message', title: `Mensaje sobre ${topic}`, observable: `Explica con precisión el mensaje que comunica su afiche sobre ${topic}.`, weight: 5 },
    { templateId: 'poster-audience', title: 'Propósito y público destinatario', observable: 'Explica a quién se dirige el afiche y cómo busca motivar, orientar o convencer a ese público.', weight: 4 },
    { templateId: 'poster-decisions', title: 'Justificación de decisiones comunicativas', observable: 'Justifica la elección de palabras, argumentos y elementos visuales en relación con el propósito.', weight: 4 },
    { templateId: 'poster-oral', title: 'Claridad de la presentación oral', observable: 'Presenta sus ideas con orden, dicción, volumen y ritmo comprensibles.', weight: 4 },
    { templateId: 'poster-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre el contenido y las decisiones de su propio afiche.', weight: 3 },
  ]
  return [
    { templateId: 'poster-message', title: `Mensaje sobre ${topic}`, observable: `Comunica acciones o ideas pertinentes sobre ${topic} mediante un mensaje breve, claro y persuasivo.`, weight: 5 },
    { templateId: 'poster-audience', title: 'Adecuación al público destinatario', observable: 'Adapta el vocabulario, el tono y el llamado a la acción a la comunidad o público indicado.', weight: 4 },
    { templateId: 'poster-persuasion', title: 'Argumentos y recursos persuasivos', observable: 'Usa recomendaciones, argumentos o expresiones persuasivas pertinentes, sin inventar datos.', weight: 4 },
    { templateId: 'poster-visuals', title: 'Relación entre texto y elementos visuales', observable: visualsRequested ? 'Integra las imágenes solicitadas con el texto para reforzar el mensaje sin dificultar su lectura.' : 'Organiza el texto y los elementos visuales elegidos para reforzar el mensaje sin imponer un recurso específico.', weight: 4 },
    { templateId: 'poster-legibility', title: 'Organización, legibilidad y corrección', observable: 'Presenta la información con jerarquía visual, lectura clara, ortografía cuidada y contenido pertinente.', weight: 3 },
  ]
}

function readingReportCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const text = normalize(description)
  const literaryText = text.match(/(?:cuento|leyenda|fabula|novela)(?:\s+[^,.;]+)?/)?.[0] ?? 'el texto literario seleccionado'
  if (activityType === 'READING_REPORT_ANALYSIS') return [
    { templateId: 'report-purpose', title: 'Función y propósito del informe', observable: 'Explica para qué se elaboró el informe de lectura y qué texto analiza.', weight: 4 },
    { templateId: 'report-structure', title: 'Identificación de la estructura', observable: 'Identifica título, introducción, desarrollo y conclusión en el informe leído.', weight: 4 },
    { templateId: 'report-summary', title: 'Comprensión del resumen', observable: `Reconoce las ideas principales de ${literaryText} recuperadas en el informe sin confundirlas con el análisis.`, weight: 4 },
    { templateId: 'report-analysis', title: 'Interpretación del análisis sociocultural', observable: 'Explica las interpretaciones del informe sobre comportamientos, costumbres o valores presentes en el texto.', weight: 5 },
    { templateId: 'report-evidence', title: 'Justificación con evidencias', observable: 'Sustenta sus respuestas con información concreta del informe de lectura.', weight: 3 },
  ]
  if (activityType === 'READING_REPORT_PRESENTATION') return [
    { templateId: 'report-summary', title: `Síntesis de ${literaryText}`, observable: `Presenta las ideas principales de ${literaryText} de forma fiel y comprensible.`, weight: 5 },
    { templateId: 'report-analysis', title: 'Análisis sociocultural', observable: 'Explica patrones socioculturales del texto y sustenta su interpretación con ejemplos.', weight: 5 },
    { templateId: 'report-structure', title: 'Organización del informe oral', observable: 'Organiza la exposición con introducción, desarrollo y conclusión reconocibles.', weight: 4 },
    { templateId: 'report-oral', title: 'Claridad de la exposición', observable: 'Expone con orden, dicción, volumen y ritmo comprensibles.', weight: 3 },
    { templateId: 'report-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre el texto y el análisis presentado.', weight: 3 },
  ]
  if (activityType === 'READING_REPORT_COMPARISON') return [
    { templateId: 'report-purpose', title: 'Propósito y textos analizados', observable: 'Compara el propósito y los textos literarios abordados en ambos informes.', weight: 4 },
    { templateId: 'report-structure', title: 'Comparación de la estructura', observable: 'Contrasta la organización de título, introducción, desarrollo y conclusión.', weight: 4 },
    { templateId: 'report-analysis', title: 'Comparación de interpretaciones', observable: 'Establece semejanzas y diferencias entre los análisis socioculturales.', weight: 5 },
    { templateId: 'report-evidence', title: 'Uso de evidencias', observable: 'Sustenta la comparación con información concreta de ambos informes.', weight: 4 },
    { templateId: 'report-conclusion', title: 'Conclusión comparativa', observable: 'Formula una conclusión coherente con las diferencias y semejanzas identificadas.', weight: 3 },
  ]
  return [
    { templateId: 'report-summary', title: `Resumen de ${literaryText}`, observable: `Resume las ideas principales de ${literaryText} mediante selección, omisión, generalización y reconstrucción, sin alterar su sentido.`, weight: 5 },
    { templateId: 'report-analysis', title: 'Análisis sociocultural', observable: 'Analiza comportamientos, costumbres, estilos de vida o valores presentes en el texto y aporta ejemplos pertinentes.', weight: 5 },
    { templateId: 'report-structure', title: 'Estructura del informe de lectura', observable: 'Organiza título, introducción, desarrollo y conclusión de acuerdo con el propósito del informe.', weight: 4 },
    { templateId: 'report-coherence', title: 'Coherencia y recursos lingüísticos', observable: 'Relaciona resumen y análisis con vocabulario adecuado, verbos consistentes y conectores de adición o ejemplificación.', weight: 3 },
    { templateId: 'report-revision', title: 'Revisión y versión final', observable: 'Revisa organización, cohesión, puntuación, ortografía y claridad antes de publicar la versión física o digital.', weight: 3 },
  ]
}

function detectiveStoryCriteria(activityType: string): AuthoredCriterion[] {
  if (activityType === 'DETECTIVE_STORY_ANALYSIS') return [
    { templateId: 'detective-structure', title: 'Estructura y trama del cuento', observable: 'Interpreta inicio, nudo y desenlace, y explica cómo progresa el misterio o conflicto.', weight: 5 },
    { templateId: 'detective-narrator', title: 'Narrador, personajes y ambiente', observable: 'Identifica el narrador, caracteriza personajes y ambiente, y explica sus relaciones en la historia.', weight: 5 },
    { templateId: 'detective-clues', title: 'Pistas y comprensión del desenlace', observable: 'Relaciona acciones y pistas del texto con la comprensión del desenlace.', weight: 4 },
    { templateId: 'detective-resources', title: 'Recursos narrativos', observable: 'Explica el efecto de recursos lingüísticos o literarios presentes en el cuento.', weight: 3 },
    { templateId: 'detective-evidence', title: 'Evidencias del cuento', observable: 'Justifica su interpretación con ejemplos concretos del texto leído.', weight: 3 },
  ]
  if (activityType === 'DETECTIVE_STORY_NARRATION') return [
    { templateId: 'detective-sequence', title: 'Secuencia de la narración', observable: 'Narra inicio, nudo y desenlace en un orden comprensible.', weight: 5 },
    { templateId: 'detective-mystery', title: 'Desarrollo del misterio', observable: 'Comunica el conflicto, las acciones y la resolución sin contradicciones.', weight: 5 },
    { templateId: 'detective-voice', title: 'Voces de narrador y personajes', observable: 'Diferencia las intervenciones mediante tono, ritmo y volumen pertinentes.', weight: 4 },
    { templateId: 'detective-language', title: 'Claridad y recursos expresivos', observable: 'Emplea vocabulario descriptivo y conectores que dan cohesión al relato oral.', weight: 3 },
    { templateId: 'detective-individual', title: 'Dominio individual', observable: 'Mantiene la narración y responde preguntas sobre los hechos relatados.', weight: 3 },
  ]
  if (activityType === 'DETECTIVE_STORY_COMPARISON') return [
    { templateId: 'detective-comparison', title: 'Comparación de tramas', observable: 'Establece semejanzas y diferencias entre los misterios y la organización de ambos cuentos.', weight: 5 },
    { templateId: 'detective-characters', title: 'Personajes y ambientes', observable: 'Compara personajes, motivaciones y ambientes con ejemplos de ambos textos.', weight: 4 },
    { templateId: 'detective-resolution', title: 'Resolución del misterio', observable: 'Contrasta cómo las acciones y pistas conducen al desenlace de cada cuento.', weight: 5 },
    { templateId: 'detective-evidence', title: 'Evidencias comparativas', observable: 'Sustenta las semejanzas y diferencias con información de ambos cuentos.', weight: 3 },
    { templateId: 'detective-conclusion', title: 'Conclusión', observable: 'Formula una conclusión coherente con la comparación realizada.', weight: 3 },
  ]
  if (activityType === 'DETECTIVE_STORY_ANALYSIS_PRESENTATION') return [
    { templateId: 'detective-analysis', title: 'Interpretación del cuento', observable: 'Explica la trama, el narrador, los personajes, el ambiente y la resolución del misterio.', weight: 6 },
    { templateId: 'detective-evidence', title: 'Sustento textual', observable: 'Justifica el análisis con acciones, descripciones o pistas del cuento.', weight: 5 },
    { templateId: 'detective-organization', title: 'Organización del análisis oral', observable: 'Presenta las ideas en una secuencia clara y diferencia resumen de interpretación.', weight: 4 },
    { templateId: 'detective-oral', title: 'Claridad de la exposición', observable: 'Expone con dicción, volumen y ritmo comprensibles.', weight: 3 },
    { templateId: 'detective-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre su interpretación del texto.', weight: 2 },
  ]
  return [
    { templateId: 'detective-structure', title: 'Inicio, nudo y desenlace', observable: 'Organiza el cuento con inicio, nudo y desenlace claramente relacionados.', weight: 4 },
    { templateId: 'detective-mystery', title: 'Misterio, pistas y resolución', observable: 'Relaciona las pistas y acciones con un desenlace que explica coherentemente el misterio.', weight: 5 },
    { templateId: 'detective-characters', title: 'Personajes y ambiente', observable: 'Caracteriza a los personajes y construye un ambiente pertinente para la trama detectivesca.', weight: 4 },
    { templateId: 'detective-narrator', title: 'Consistencia del narrador', observable: 'Mantiene un narrador reconocible y una perspectiva consistente durante el cuento.', weight: 3 },
    { templateId: 'detective-revision', title: 'Cohesión y revisión final', observable: 'Usa conectores y recursos expresivos pertinentes, y revisa claridad, puntuación y ortografía.', weight: 4 },
  ]
}

function calligramCriteria(activityType: string, description: string): AuthoredCriterion[] {
  const freeVerse = /verso libre/.test(normalize(description))
  if (activityType === 'CALLIGRAM_ANALYSIS') return [
    { templateId: 'calligram-relation', title: 'Relación entre texto y figura', observable: 'Interpreta cómo la figura formada por las palabras se relaciona con el tema y mensaje del poema.', weight: 6 },
    { templateId: 'calligram-intention', title: 'Intención y sentimientos', observable: 'Explica la intención comunicativa y los sentimientos expresados en el caligrama.', weight: 4 },
    { templateId: 'calligram-resources', title: 'Recursos expresivos presentes', observable: 'Analiza el vocabulario y las figuras literarias efectivamente presentes, sin exigir recursos ausentes.', weight: 4 },
    { templateId: 'calligram-visual', title: 'Organización visual', observable: 'Explica cómo tipografía, disposición y legibilidad contribuyen al significado.', weight: 3 },
    { templateId: 'calligram-evidence', title: 'Evidencias del caligrama', observable: 'Justifica su interpretación con palabras, versos y rasgos visuales concretos.', weight: 3 },
  ]
  if (activityType === 'CALLIGRAM_COMPARISON') return [
    { templateId: 'calligram-message', title: 'Comparación de mensajes', observable: 'Compara los temas, mensajes y sentimientos de ambos caligramas.', weight: 4 },
    { templateId: 'calligram-figure', title: 'Comparación de figuras', observable: 'Contrasta la relación entre las palabras y la figura formada en cada texto.', weight: 5 },
    { templateId: 'calligram-resources', title: 'Recursos expresivos', observable: 'Establece semejanzas y diferencias en vocabulario y recursos literarios presentes.', weight: 4 },
    { templateId: 'calligram-visual', title: 'Organización visual', observable: 'Compara disposición, tipografía y legibilidad con evidencias de ambos textos.', weight: 4 },
    { templateId: 'calligram-conclusion', title: 'Conclusión comparativa', observable: 'Formula una conclusión coherente sobre las decisiones poéticas y visuales.', weight: 3 },
  ]
  if (activityType === 'CALLIGRAM_RECITATION') return [
    { templateId: 'calligram-clarity', title: 'Claridad de la recitación', observable: 'Recita el texto con dicción y volumen comprensibles.', weight: 5 },
    { templateId: 'calligram-expression', title: 'Entonación y expresión', observable: 'Ajusta la entonación, el ritmo y las pausas a los sentimientos del poema.', weight: 5 },
    { templateId: 'calligram-meaning', title: 'Comprensión del poema', observable: 'Comunica el sentido global del caligrama durante la recitación.', weight: 4 },
    { templateId: 'calligram-fluency', title: 'Fluidez', observable: 'Mantiene continuidad sin que las vacilaciones impidan comprender el texto.', weight: 3 },
    { templateId: 'calligram-individual', title: 'Desempeño individual', observable: 'Sostiene personalmente la recitación del caligrama seleccionado.', weight: 3 },
  ]
  if (activityType === 'CALLIGRAM_EXPLANATION') return [
    { templateId: 'calligram-relation', title: 'Tema, palabras y figura', observable: 'Explica la relación entre el tema, las palabras elegidas y la figura de su caligrama.', weight: 6 },
    { templateId: 'calligram-decisions', title: 'Decisiones poéticas y visuales', observable: 'Justifica el vocabulario, los recursos expresivos y la disposición visual empleados.', weight: 5 },
    { templateId: 'calligram-feelings', title: 'Ideas y sentimientos', observable: 'Explica las ideas, emociones o sentimientos que buscó comunicar.', weight: 4 },
    { templateId: 'calligram-oral', title: 'Claridad de la explicación', observable: 'Presenta sus decisiones con orden, dicción y volumen comprensibles.', weight: 3 },
    { templateId: 'calligram-individual', title: 'Dominio individual', observable: 'Responde preguntas sobre su proceso y producto.', weight: 2 },
  ]
  return [
    { templateId: 'calligram-relation', title: 'Relación entre tema y figura', observable: 'Dispone los versos formando una figura relacionada con el tema del poema.', weight: 5 },
    { templateId: 'calligram-expression', title: 'Expresión de ideas y sentimientos', observable: 'Comunica ideas, sentimientos o emociones coherentes con el tema elegido.', weight: 4 },
    { templateId: 'calligram-visual', title: 'Organización visual y legibilidad', observable: 'Organiza las palabras para construir la figura sin dificultar innecesariamente la lectura.', weight: 4 },
    { templateId: 'calligram-resources', title: 'Vocabulario y recursos expresivos', observable: `Usa vocabulario y recursos poéticos pertinentes${freeVerse ? ' en verso libre, sin exigir rima' : ''}.`, weight: 4 },
    { templateId: 'calligram-revision', title: 'Coherencia y revisión final', observable: 'Revisa la coherencia del poema, la relación texto-figura, la ortografía y la versión final.', weight: 3 },
  ]
}

export function recommend(input: RecommendationInput, context: AcademicContext | null, scope: ScopeCandidate | null,
  elements: RankedElement[], mappingStatus: string, curriculumStatus: string | null, catalog: EvaluationCatalog = evaluationCatalogV1): InstrumentRecommendation {
  const text = normalize(`${input.activityTitle} ${input.description ?? ''}`)
  const explicit = input.pedagogicalActivityType ? catalog.activityTypes.find(a => a.id === input.pedagogicalActivityType) : undefined
  if (input.pedagogicalActivityType && !explicit) throw new Error('Tipo pedagógico desconocido.')
  const detectedByCatalog = detectActivityType(input.activityTitle, input.description ?? '', catalog)
  const detected = detectedByCatalog.id === 'OTHER' && /observ(?:ar|an|aran|arán).*(?:registr|tabla)/.test(text)
    ? catalog.activityTypes.find(entry => entry.id === 'OBSERVATION')! : detectedByCatalog
  const activity = explicit ?? detected
  const band = context?.level === 'PRIMARY' ? context.cycle === 1 ? 'PRIMARY_FIRST' : 'PRIMARY_SECOND' : 'SECONDARY'
  const area = discipline(scope, context)
  const attitudeRelevant = /convivencia|cooperaci|valores|respeto|solidaridad|seguridad/.test(text)
  // Keep content/genre words (poema, ensayo, pintura). Strip only pedagogical boilerplate.
  const ranking = rankCurriculum(input.activityTitle, input.description ?? '', activity.id, input.competencyBlock, scope, elements, catalog)
  const explicitIds = input.selectedCurriculumElementIds
  const manuallySelected = explicitIds?.map(id => elements.find(e => e.elementId === id && e.scopeId === scope?.id && e.versionId === scope?.versionId)).filter((e): e is RankedElement => Boolean(e)) ?? []
  if (explicitIds && manuallySelected.length !== explicitIds.length) throw new Error('Elemento curricular ajeno al ámbito.')
  const topCoverage = ranking[0]?.topicCoverage ?? 0
  const confidence = explicitIds?.length ? 'HIGH' : !scope || topCoverage < 0.6 ? 'LOW' : topCoverage >= 0.85 ? 'HIGH' : 'MEDIUM'
  // Diverse evidence candidates, bounded independently of criterion count.
  const selected = explicitIds ? manuallySelected.map(element => ({ element, topicCoverage: 1, score: 100, reasons: ['teacher-selection'] }))
    : confidence === 'LOW' ? [] : ranking.filter(r => r.topicCoverage >= 0.6).filter((r, i, all) => all.slice(0, i).filter(p => p.element.type === r.element.type).length < 2).slice(0, 12)
  const selectedRefs = selected.map(({ element: { normalizedText: _text, ...reference } }) => reference)
  const count = band === 'PRIMARY_FIRST' ? (input.maxScore <= 10 ? 3 : 4) : band === 'PRIMARY_SECOND' ? 5 : activity.family === 'SCIENTIFIC' ? 6 : 5
  const topic = teacherTopic(input.activityTitle)
  const dimensions = area === 'science' ? learningDimensions(input.description ?? '', topic) : []
  const visualResources = /imagenes|recursos visuales|laminas|diapositivas/.test(text)
  const allCandidates = catalog.criterionTemplates.filter(t => (t.area === area || t.area === '*') && t.bands.includes(band)
    && (area === '*' || !t.families.length || t.families.includes(activity.family)) && t.evidence.some(e => activity.evidence.includes(e))
    && (!t.attitude || attitudeRelevant) && (!t.requires || t.requires.some(word => text.includes(normalize(word)))))
    .map(t => ({ template: t, score: t.weight + (t.area === area && area !== '*' ? 10 : 0)
      + (activity.family === 'ORAL' && ['organization', 'communication'].includes(t.id) ? 17 : 0)
      + (activity.family === 'SCIENTIFIC' && ['science-procedure', 'science-data', 'science-interpretation', 'science-conclusion', 'science-safety'].includes(t.id) ? 12 : 0)
      + overlap(tokens(t.keywords.join(' ')), text)
      + Math.min(2, selected.reduce((sum, r) => sum + overlap(tokens(t.keywords.join(' ')), r.element.normalizedText), 0)) }))
    .sort((a, b) => b.score - a.score || a.template.id.localeCompare(b.template.id))
  const byId = (id: string) => allCandidates.find(candidate => candidate.template.id === id)
  const priorityIds = area === 'science' && activity.family === 'ORAL' && dimensions.length
    ? dimensions.length > 1 ? ['science-content', 'science-content', 'science-accuracy', 'organization', visualResources ? 'instructions' : 'communication']
      : ['science-content', 'science-accuracy', 'communication', 'organization', 'instructions']
    : area === 'science' && activity.family === 'OBSERVATIONAL' && dimensions.length > 1
      ? ['science-content', 'science-content', 'science-data', 'science-accuracy', 'science-interpretation'] : []
  const prioritized = priorityIds.map(byId).filter((candidate): candidate is (typeof allCandidates)[number] => Boolean(candidate))
  const candidates = [...prioritized, ...allCandidates.filter(candidate => !prioritized.includes(candidate))].slice(0, count)
  const scores = distributeScore(input.maxScore, candidates.map((candidate, index) => priorityIds.length && dimensions.length > 1 && candidates.length === 5
    ? [5, 4, 4, 4, 3][index] : candidate.template.weight))
  const rule = catalog.recommendationRules.filter(r => (!r.families.length || r.families.includes(activity.family)) && (!r.band || r.band === band)
    && (!r.maxScore || input.maxScore <= r.maxScore) && (!r.evidence || r.evidence.every(e => activity.evidence.includes(e))))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0]
  const levelCount = input.levelCount ?? 4
  const chosenInstrument = input.preferredInstrumentType ?? rule.instrument
  const template = catalog.instrumentTemplates.find(t => t.id === chosenInstrument)!
  const levels = template.descriptors ? catalog.descriptorPatterns.scales[levelCount].map((label, index) => ({ id: `L${levelCount - index}`, label, proportion: (levelCount - index - 1) / (levelCount - 1) })) : []
  const genericCriteria: RecommendationCriterion[] = candidates.map(({ template: criterion }, index) => {
    const relevant = selected.filter(r => overlap(tokens(criterion.keywords.join(' ')), r.element.normalizedText) > 0)
    const literal = relevant.find(r => r.element.type === 'EVALUATION_CRITERION' && r.topicCoverage >= 0.5)
    const isContentCriterion = ['science-content', 'math-comprehension', 'language-content', 'art-intention', 'fihr-comprehension', 'social-context'].includes(criterion.id)
    const content = (isContentCriterion ? selected : relevant).find(r => r.element.type === 'CONCEPT' && r.element.text.length <= 160)
      ?? relevant.find(r => ['PROCEDURE', 'ACHIEVEMENT_INDICATOR', 'SPECIFIC_COMPETENCY'].includes(r.element.type) && r.element.text.length <= 300)
    // Literal extraction stays literal. Contextualized descriptions quote retrieved terms, never new claims.
    const reference = literal?.element ?? content?.element
    const observable = band === 'PRIMARY_FIRST' ? criterion.simple : criterion.observable
    const dimension = criterion.id === 'science-content' ? dimensions[candidates.slice(0, index).filter(candidate => candidate.template.id === 'science-content').length]
      ?? (topic !== input.activityTitle ? { title: `Comprensión de ${topic}`, observable: `Explica las ideas principales de ${topic}.` } : undefined) : undefined
    const contextual = dimension?.observable ?? (criterion.id === 'instructions' && visualResources && activity.family === 'ORAL' ? `Utiliza imágenes o recursos visuales para apoyar la explicación de ${topic}.` : null) ?? (criterion.id === 'science-accuracy' && /vocabulario cientifico/.test(text) ? `Emplea vocabulario científico adecuado al explicar ${topic}.` : null) ?? (criterion.id === 'organization' && activity.family === 'ORAL' ? `Organiza y comunica las ideas sobre ${topic} en una secuencia comprensible.` : null) ?? (criterion.id === 'organization' && area === 'science' && ['PROJECT_BASED', 'WRITTEN'].includes(activity.family) && topic !== input.activityTitle ? `Organiza las ideas y evidencias sobre ${topic} en una secuencia comprensible.` : null) ?? (topic !== input.activityTitle && criterion.id === 'art-intention' ? `Expresa ${topic} mediante decisiones visuales reconocibles.` : null) ?? (topic !== input.activityTitle && criterion.id === 'art-composition' && /pintura/.test(text) ? `Organiza los elementos de la pintura para comunicar ${topic}.` : null) ?? (topic !== input.activityTitle && criterion.id === 'social-context' ? `Ubica ${topic} en tiempo, lugar y contexto.` : null) ?? (topic !== input.activityTitle && criterion.id === 'social-causes' && /causas|consecuencias/.test(text) ? `Explica causas y consecuencias de ${topic} con evidencia.` : null) ?? (topic && topic !== input.activityTitle && ['science-accuracy', 'organization', 'communication', 'math-comprehension', 'math-procedure', 'math-reasoning', 'math-accuracy', 'math-interpretation', 'language-content', 'language-structure', 'language-coherence'].includes(criterion.id)
      ? `${observable.replace(/[.!?]+$/, '')} ${area === 'language' ? `en la producción de ${topic}` : `al abordar ${topic}`}.` : null)
    const description = contextual ?? (literal ? literal.element.text : content ? `${observable} Relacionado con ${content.element.text}.` : observable)
    const sourceType = contextual || content ? 'CONTEXTUALIZED' : literal ? 'CURRICULUM_DERIVED' : 'ACTIVITY_TEMPLATE'
    const sourceReferences = !contextual && reference ? selectedRefs.filter(r => r.elementId === reference.elementId) : []
    const patterns = band === 'PRIMARY_FIRST' ? catalog.descriptorPatterns.simple : catalog.descriptorPatterns.regular
    const patternIndexes = levelCount === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4]
    const title = dimension?.title ?? (criterion.id === 'instructions' && visualResources && activity.family === 'ORAL' ? 'Uso de recursos de apoyo' : topic && topic !== input.activityTitle && criterion.id === 'science-accuracy' ? `Precisión científica sobre ${topic}` : criterion.id === 'organization' && activity.family === 'ORAL' ? 'Organización y comunicación de la exposición' : criterion.id === 'organization' && area === 'science' && ['PROJECT_BASED', 'WRITTEN'].includes(activity.family) ? `Organización de la evidencia sobre ${topic}` : criterion.id === 'art-intention' && topic !== input.activityTitle ? `Intención expresiva sobre ${topic}` : criterion.id === 'art-composition' && /pintura/.test(text) ? 'Composición de la pintura' : criterion.id === 'social-context' && topic !== input.activityTitle ? `Contexto de ${topic}` : criterion.id === 'social-causes' && /causas|consecuencias/.test(text) ? `Causas y consecuencias de ${topic}` : area === 'language' && criterion.id === 'language-structure' && /cuento/.test(text) ? 'Estructura narrativa del cuento' : criterion.title)
    const texts = contextual ? contextualDescriptors(description, patternIndexes, title, criterion.id) : patternIndexes.map(i => `${observable} ${patterns[i]}`)
    return { id: `proposal:${catalog.version}:${scope?.id ?? 'fallback'}:${criterion.id}:${index}`, templateId: criterion.id,
      title, description, maxScore: scores[index] / 100, maxScoreUnits: scores[index], sourceType, sourceReferences,
      descriptors: levels.map((level, i) => ({ levelId: level.id, text: texts[i], scoreUnits: Math.round(scores[index] * level.proportion) })) }
  })
  const newsModule = context?.level === 'SECONDARY' && context.grade === 1 && area === 'language' && /\bnotici(?:a|as|ero)\b/.test(text)
  const touristGuideModule = context?.level === 'SECONDARY' && context.grade === 1 && area === 'language' && /\bguias? turisticas?\b/.test(text)
  const posterModule = context?.level === 'SECONDARY' && context.grade === 1 && area === 'language' && /\bafiches?\b/.test(text)
  const readingReportModule = context?.level === 'SECONDARY' && context.grade === 1 && area === 'language' && /\binforme(?:s)? de lectura\b/.test(text)
  const detectiveModule = context?.level === 'SECONDARY' && context.grade === 1 && area === 'language' && /\bcuento(?:s)? (?:policiacos?|detectivescos?)\b/.test(text) && !readingReportModule
  const calligramModule = context?.level === 'SECONDARY' && context.grade === 1 && area === 'language' && (/\bcaligramas?\b/.test(text) || /(?:versos|palabras).*formando (?:la )?silueta/.test(text))
  const authored = newsModule ? newsCriteria(activity.id, input.description ?? '')
    : touristGuideModule ? touristGuideCriteria(activity.id, input.description ?? '')
      : posterModule ? posterCriteria(activity.id, input.activityTitle, input.description ?? '')
        : readingReportModule ? readingReportCriteria(activity.id, input.description ?? '')
          : detectiveModule ? detectiveStoryCriteria(activity.id)
            : calligramModule ? calligramCriteria(activity.id, input.description ?? '') : []
  const authoredScores = authored.length ? distributeScore(input.maxScore, authored.map(item => item.weight)) : []
  const authoredPatternIndexes = levelCount === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4]
  const criteria: RecommendationCriterion[] = authored.length ? authored.map((item, index) => ({
    id: `proposal:${catalog.version}:${scope?.id ?? 'fallback'}:${item.templateId}:${index}`,
    templateId: item.templateId, title: item.title, description: item.observable,
    maxScore: authoredScores[index] / 100, maxScoreUnits: authoredScores[index],
    sourceType: 'CONTEXTUALIZED', sourceReferences: [],
    descriptors: levels.map((level, levelIndex) => ({ levelId: level.id,
      text: contextualDescriptors(item.observable, authoredPatternIndexes, item.title, item.templateId)[levelIndex],
      scoreUnits: Math.round(authoredScores[index] * level.proportion) })),
  })) : genericCriteria
  const totalScoreUnits = criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)
  const result: InstrumentRecommendation = { kind: 'RECOMMENDATION', catalogVersion: catalog.version, instrumentType: chosenInstrument, confidence,
    activityType: activity.id, evidenceTypes: [...new Set([...activity.evidence, ...criteria.filter(c => catalog.criterionTemplates.find(t => t.id === c.templateId)?.attitude).map(() => 'ATTITUDE' as const)])],
    participationMode: input.participationMode, curriculumVersionId: scope?.versionId ?? null, curriculumScopeId: scope?.id ?? null,
    selectedCurriculumElements: selectedRefs, criteria, levels, totalScore: input.maxScore, totalScoreUnits, scoreUnit: 0.01,
    internalTrace: { mappingStatus, reasons: [`band=${band}`, `discipline=${area}`, ...(newsModule ? ['module=lengua-secundaria-1-la-noticia'] : []), ...(touristGuideModule ? ['module=lengua-secundaria-1-guia-turistica'] : []), ...(posterModule ? ['module=lengua-secundaria-1-el-afiche'] : []), ...(readingReportModule ? ['module=lengua-secundaria-1-informe-de-lectura'] : []), ...(detectiveModule ? ['module=lengua-secundaria-1-cuento-policiaco'] : []), ...(calligramModule ? ['module=lengua-secundaria-1-caligrama'] : []), 'No se consultan otros ámbitos; coincidencia temática no equivale a aprobación curricular.'],
      ruleId: input.preferredInstrumentType ? `${rule.id}:TEACHER_OVERRIDE` : rule.id, activityTypeOrigin: explicit ? 'EXPLICIT' : detected.id !== 'OTHER' ? 'DETECTED' : 'DEFAULT',
      ranking: ranking.slice(0, 24).map(r => ({ elementId: r.element.elementId, score: r.score, topicCoverage: r.topicCoverage, reasons: r.reasons })),
      curriculumStatus, lowCurriculumConfidence: confidence === 'LOW', consideredTypes: Object.keys(typeWeights) } }
  assertValidRecommendation(result)
  return result
}

export function assertValidRecommendation(result: InstrumentRecommendation) {
  if (!result.criteria.length) throw new Error('Recomendación inválida: no contiene criterios.')
  if (!Number.isInteger(result.totalScoreUnits) || result.totalScoreUnits <= 0 || !Number.isFinite(result.totalScore)) throw new Error('Recomendación inválida: puntuación total no válida.')
  const scoreTotal = result.criteria.reduce((total, criterion) => total + criterion.maxScoreUnits, 0)
  if (scoreTotal !== result.totalScoreUnits) throw new Error('Recomendación inválida: los criterios no suman la puntuación total.')
  for (const criterion of result.criteria) {
    if (!criterion.title.trim() || !criterion.description.trim()) throw new Error('Recomendación inválida: criterio vacío.')
    if (!Number.isInteger(criterion.maxScoreUnits) || criterion.maxScoreUnits <= 0 || !Number.isFinite(criterion.maxScore)) throw new Error('Recomendación inválida: puntuación de criterio no válida.')
    if ((result.instrumentType === 'rubrica' || result.instrumentType === 'escala') && (criterion.descriptors.length !== result.levels.length || criterion.descriptors.some(item => !item.text.trim()))) throw new Error('Recomendación inválida: descriptor de desempeño vacío o incompleto.')
  }
}
