import type { InstrumentRecommendation } from '@aula/shared'
import { api } from '@/services/apiClient'

export type ActivityInterpretation = {
  suggestedActivityType: string
  activityType: string
  activityTypes: string[]
  curriculumVersionId: string | null
  curriculumScopeId: string | null
  curriculumCandidates: Array<{ elementId: string; type: string; text: string; sources: Array<{ documentId: string; pdfPage: number; printedPage: string | null }> }>
  curriculumMatch: 'SUGGESTED' | 'NONE'
  message: string
}

export function interpretActivity(input: { sectionSubjectId: string; activityTitle: string; description?: string; pedagogicalActivityType?: string; competencyBlock?: string }, signal?: AbortSignal) {
  return api.post<ActivityInterpretation>('/evaluation-instruments/interpret', input, { signal })
}

export function prepareInstrument(input: { sectionSubjectId: string; activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; curriculumVersionId?: string; preferredInstrumentType?: string; selectedCurriculumElementIds?: string[] }) {
  return api.post<InstrumentRecommendation>('/evaluation-instruments/recommend', input)
}

export function preparationFingerprint(input: { name: string; description: string; maxScore: string; pedagogicalActivityType?: string; activityType: string; instrumentType: string; selectedCurriculumElementIds?: string[] }) {
  return JSON.stringify([input.name, input.description, input.maxScore, input.pedagogicalActivityType, input.activityType, input.instrumentType, input.selectedCurriculumElementIds ?? []])
}

export function editableFallbackRecommendation(input: { activityTitle: string; description?: string; maxScore: number; instrumentType: InstrumentRecommendation['instrumentType']; participationMode: 'INDIVIDUAL' | 'GROUP' }): InstrumentRecommendation {
  const text = `${input.activityTitle} ${input.description ?? ''}`.toLocaleLowerCase('es-DO')
  const news = /noticia|noticiero/.test(text)
  const touristGuide = /gu[ií]a tur[ií]stica/.test(text)
  const poster = /afiche/.test(text)
  const readingReport = /informe de lectura/.test(text)
  const detectiveStory = /cuento (?:polic[ií]aco|detectivesco)/.test(text) && !readingReport
  const calligram = /caligrama/.test(text) || /(?:versos|palabras).*formando (?:la )?silueta/.test(text)
  const analyzing = /leer|analizar|identificar/.test(text)
  const oral = /noticiero|presentar|exponer/.test(text)
  const comparing = /comparar|comparaci[oó]n/.test(text)
  const graphicsRequested = /imagen|im[aá]genes|foto|mapa|gr[aá]fico|dibujo|collage|recurso visual/.test(text)
  const posterTopic = /agua/.test(text) ? 'el cuidado y ahorro del agua' : /convivencia escolar/.test(text) ? 'la convivencia escolar' : /entorno/.test(text) ? 'el cuidado del entorno' : 'el tema indicado'
  const reciting = /recitar|declamar/.test(text)
  const authored = detectiveStory && analyzing ? [
    ['Estructura y trama', 'Interpreta inicio, nudo y desenlace y explica cómo progresa el misterio.'],
    ['Narrador, personajes y ambiente', 'Identifica y relaciona estos elementos en la historia.'],
    ['Pistas y desenlace', 'Relaciona acciones y pistas con la comprensión del desenlace.'],
    ['Recursos narrativos', 'Explica recursos lingüísticos o literarios presentes.'],
    ['Evidencias del cuento', 'Justifica su interpretación con ejemplos del texto.'],
  ] : detectiveStory && comparing ? [
    ['Comparación de tramas', 'Compara los misterios y la organización de ambos cuentos.'],
    ['Personajes y ambientes', 'Compara personajes y ambientes con ejemplos.'],
    ['Resolución del misterio', 'Contrasta cómo las pistas conducen a cada desenlace.'],
    ['Evidencias', 'Sustenta la comparación con ambos cuentos.'],
    ['Conclusión', 'Formula una conclusión coherente.'],
  ] : detectiveStory && oral ? [
    ['Secuencia narrativa', 'Comunica inicio, nudo y desenlace en orden.'],
    ['Desarrollo del misterio', 'Relaciona conflicto, acciones y resolución.'],
    ['Voces y expresión', 'Usa tono, ritmo y volumen para diferenciar intervenciones.'],
    ['Claridad oral', 'Narra o explica con vocabulario comprensible.'],
    ['Dominio individual', 'Responde por su propio desempeño.'],
  ] : detectiveStory ? [
    ['Inicio, nudo y desenlace', 'Organiza las partes del cuento de forma relacionada.'],
    ['Misterio, pistas y resolución', 'Relaciona las pistas con un desenlace coherente.'],
    ['Personajes y ambiente', 'Caracteriza personajes y ambiente para la trama.'],
    ['Narrador', 'Mantiene una perspectiva narrativa consistente.'],
    ['Cohesión y revisión', 'Revisa conectores, claridad, puntuación y ortografía.'],
  ] : calligram && analyzing ? [
    ['Relación texto-figura', 'Interpreta cómo la figura formada por palabras se relaciona con el poema.'],
    ['Intención y sentimientos', 'Explica el mensaje y los sentimientos expresados.'],
    ['Recursos presentes', 'Analiza únicamente los recursos expresivos presentes.'],
    ['Organización visual', 'Explica cómo disposición y tipografía aportan significado.'],
    ['Evidencias', 'Justifica con versos y rasgos visuales concretos.'],
  ] : calligram && comparing ? [
    ['Mensajes', 'Compara temas, mensajes y sentimientos.'],
    ['Figuras', 'Contrasta la relación entre palabras y figura.'],
    ['Recursos expresivos', 'Compara vocabulario y recursos presentes.'],
    ['Organización visual', 'Compara disposición y legibilidad.'],
    ['Conclusión', 'Formula una conclusión sustentada.'],
  ] : calligram && reciting ? [
    ['Claridad', 'Recita con dicción y volumen comprensibles.'],
    ['Entonación y expresión', 'Ajusta ritmo y pausas a los sentimientos del poema.'],
    ['Comprensión', 'Comunica el sentido global durante la recitación.'],
    ['Fluidez', 'Mantiene continuidad comprensible.'],
    ['Desempeño individual', 'Sostiene personalmente la recitación.'],
  ] : calligram && oral ? [
    ['Tema, palabras y figura', 'Explica la relación entre los componentes de su caligrama.'],
    ['Decisiones poéticas y visuales', 'Justifica vocabulario, recursos y disposición.'],
    ['Ideas y sentimientos', 'Explica lo que buscó comunicar.'],
    ['Claridad oral', 'Presenta sus decisiones con orden y dicción.'],
    ['Dominio individual', 'Responde preguntas sobre su producto.'],
  ] : calligram ? [
    ['Tema y figura', 'Dispone los versos formando una figura relacionada con el tema.'],
    ['Ideas y sentimientos', 'Comunica ideas o emociones coherentes.'],
    ['Organización visual', 'Construye la figura sin impedir la lectura.'],
    ['Recursos expresivos', /verso libre/.test(text) ? 'Usa recursos pertinentes en verso libre, sin exigir rima.' : 'Usa vocabulario y recursos pertinentes.'],
    ['Revisión final', 'Revisa coherencia, relación texto-figura y ortografía.'],
  ] : readingReport && analyzing ? [
    ['Función y propósito', 'Explica para qué se elaboró el informe de lectura y qué texto analiza.'],
    ['Estructura del informe', 'Identifica título, introducción, desarrollo y conclusión.'],
    ['Comprensión del resumen', 'Reconoce las ideas principales recuperadas sin confundirlas con el análisis.'],
    ['Interpretación del análisis', 'Explica las interpretaciones socioculturales presentadas.'],
    ['Evidencias del informe', 'Justifica sus respuestas con información concreta del informe.'],
  ] : readingReport && comparing ? [
    ['Propósito y textos', 'Compara el propósito y los textos abordados en ambos informes.'],
    ['Comparación de estructura', 'Contrasta título, introducción, desarrollo y conclusión.'],
    ['Comparación de interpretaciones', 'Establece semejanzas y diferencias entre los análisis.'],
    ['Uso de evidencias', 'Sustenta la comparación con ambos informes.'],
    ['Conclusión', 'Formula una conclusión coherente con la comparación.'],
  ] : readingReport && oral ? [
    ['Síntesis del texto', 'Presenta las ideas principales del texto de forma fiel.'],
    ['Análisis sociocultural', 'Explica su interpretación con ejemplos pertinentes.'],
    ['Organización oral', 'Ordena introducción, desarrollo y conclusión.'],
    ['Claridad de la exposición', 'Expone con dicción, volumen y ritmo comprensibles.'],
    ['Dominio individual', 'Responde preguntas sobre el texto y el análisis.'],
  ] : readingReport ? [
    ['Resumen del texto', 'Resume las ideas principales sin alterar su sentido.'],
    ['Análisis sociocultural', 'Analiza comportamientos, costumbres o valores con ejemplos.'],
    ['Estructura del informe', 'Organiza título, introducción, desarrollo y conclusión.'],
    ['Coherencia', 'Relaciona resumen y análisis con vocabulario y conectores adecuados.'],
    ['Revisión final', 'Revisa organización, puntuación, ortografía y claridad.'],
  ] : poster && analyzing ? [
    ['Propósito y destinatarios', `Interpreta la intención del afiche sobre ${posterTopic} e identifica a quién se dirige.`],
    ['Interpretación del mensaje', `Explica el mensaje principal sobre ${posterTopic}.`],
    ['Recursos para convencer', 'Explica cómo las palabras, argumentos y recursos persuasivos buscan convencer.'],
    ['Texto y elementos visuales', 'Analiza cómo los elementos visuales contribuyen al mensaje.'],
    ['Evidencias del afiche', 'Justifica su interpretación con elementos concretos del afiche.'],
  ] : poster && comparing ? [
    ['Propósito y destinatarios', `Compara el propósito y el público de los afiches sobre ${posterTopic}.`],
    ['Mensajes y argumentos', 'Establece semejanzas y diferencias entre mensajes y recursos persuasivos.'],
    ['Recursos visuales', 'Contrasta la relación entre texto y elementos visuales.'],
    ['Eficacia comunicativa', 'Valora cuál afiche comunica mejor su mensaje.'],
    ['Justificación', 'Sustenta su valoración con evidencias de ambos afiches.'],
  ] : poster && oral ? [
    [`Mensaje sobre ${posterTopic}`, `Explica el mensaje de su afiche sobre ${posterTopic}.`],
    ['Propósito y público', 'Explica a quién se dirige y cómo busca motivar o convencer.'],
    ['Decisiones comunicativas', 'Justifica la elección de palabras y elementos visuales.'],
    ['Presentación oral', 'Expone con orden, dicción, volumen y ritmo comprensibles.'],
    ['Dominio individual', 'Responde preguntas sobre su propio afiche.'],
  ] : poster ? [
    [`Mensaje sobre ${posterTopic}`, `Comunica acciones o ideas pertinentes sobre ${posterTopic} mediante un mensaje breve y persuasivo.`],
    ['Adecuación al público', 'Adapta el vocabulario, el tono y el llamado a la acción al público indicado.'],
    ['Recursos persuasivos', 'Usa recomendaciones o argumentos pertinentes sin inventar datos.'],
    ['Texto y elementos visuales', graphicsRequested ? 'Integra las imágenes solicitadas con el texto para reforzar el mensaje.' : 'Organiza el texto y los elementos visuales elegidos para reforzar el mensaje.'],
    ['Organización y legibilidad', 'Presenta información clara, jerarquizada y con ortografía cuidada.'],
  ] : touristGuide && analyzing ? [
    ['Propósito y destinatario', 'Explica cómo la guía orienta e informa a sus posibles visitantes.'],
    ['Identificación de la estructura', 'Identifica portada, información, imágenes y cierre, según estén presentes en la guía leída.'],
    ['Recursos para orientar', 'Analiza el vocabulario y los recursos paratextuales disponibles usados para orientar al visitante.'],
    ['Interpretación', 'Explica la información relevante sobre los lugares descritos.'],
  ] : touristGuide && oral ? [
    ['Información de los lugares', 'Presenta información pertinente y veraz sobre los lugares solicitados.'],
    ['Orientación al visitante', 'Describe atractivos y cualidades con vocabulario adecuado al público.'],
    ['Organización oral', 'Ordena la información de la guía en una secuencia clara.'],
    ['Comunicación oral', 'Expone con dicción, volumen, ritmo y entonación comprensibles.'],
    ['Dominio individual', 'Explica los lugares asignados desde su propio dominio del contenido.'],
  ] : touristGuide && comparing ? [
    ['Propósito y destinatario', 'Compara el propósito y el público de cada guía turística.'],
    ['Comparación del contenido', 'Establece semejanzas y diferencias entre la información y los atractivos.'],
    ['Comparación de la estructura', 'Contrasta la organización de las guías.'],
    ['Comparación de recursos', 'Analiza el vocabulario y los recursos usados para orientar al visitante.'],
    ['Conclusión sustentada', 'Formula una conclusión apoyada en evidencias de ambas guías.'],
  ] : touristGuide ? [
    ['Información de los lugares', 'Incluye información pertinente y veraz sobre los lugares solicitados.'],
    ['Estructura de la guía', `Organiza la guía con portada, información y cierre${graphicsRequested ? ', e integra las imágenes solicitadas' : ''}.`],
    ['Descripción y orientación', 'Describe los lugares con vocabulario atractivo y adecuado al público.'],
    ['Organización y claridad', 'Distribuye la información en una secuencia comprensible.'],
    ['Revisión final', 'Revisa claridad, puntuación, ortografía y presentación antes de publicar.'],
  ] : news && analyzing ? [
    ['Función de la noticia', 'Reconoce el propósito informativo y el hecho principal de la noticia.'],
    ['Partes de la noticia', 'Identifica titular, entrada o copete y cuerpo en el texto analizado.'],
    ['Interrogantes fundamentales', 'Localiza qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.'],
    ['Interpretación de la información', 'Explica la información principal con evidencias de la noticia.'],
  ] : news && oral ? [
    ['Información periodística', 'Presenta hechos relevantes y distingue la información principal de los detalles.'],
    ['Estructura de la noticia', 'Comunica un titular y desarrolla qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.'],
    ['Organización del noticiero', 'Ordena las noticias y las intervenciones en una secuencia clara.'],
    ['Comunicación oral', 'Presenta con dicción, ritmo, entonación y volumen comprensibles.'],
    ['Dominio individual', 'Explica su noticia con seguridad dentro de la presentación del equipo.'],
  ] : news ? [
    ['Información esencial', 'Redacta un hecho noticioso claro y responde qué ocurrió, a quién, dónde, cuándo y cómo ocurrió.'],
    ['Titular, entrada y cuerpo', 'Organiza la noticia con un titular pertinente, una entrada informativa y un cuerpo desarrollado.'],
    ['Secuencia y cohesión', 'Ordena la información y usa conectores de orden y temporales.'],
    ['Lenguaje periodístico', 'Emplea un registro formal y vocabulario preciso.'],
    ['Revisión escrita', 'Revisa puntuación, ortografía y claridad antes de presentar la versión final.'],
  ] : [
    ['Dominio del contenido', `Explica con precisión el contenido trabajado en ${input.activityTitle}.`],
    ['Desarrollo de la actividad', 'Realiza la tarea principal solicitada y presenta evidencia observable.'],
    ['Organización', 'Organiza la información o el producto en una secuencia comprensible.'],
    ['Comunicación', 'Comunica el resultado con claridad y vocabulario adecuado.'],
  ]
  const totalUnits = Math.round(input.maxScore * 100)
  const base = Math.floor(totalUnits / authored.length)
  const levels = input.instrumentType === 'rubrica' || input.instrumentType === 'escala'
    ? ['Destacado', 'Logrado', 'En proceso', 'Inicial'].map((label, index) => ({ id: `L${4 - index}`, label, proportion: (3 - index) / 3 })) : []
  const criteria = authored.map(([title, description], index) => {
    const maxScoreUnits = base + (index < totalUnits - base * authored.length ? 1 : 0)
    return { id: `fallback:${index}`, templateId: 'editable-fallback', title, description, maxScore: maxScoreUnits / 100, maxScoreUnits,
      sourceType: 'ACTIVITY_TEMPLATE' as const, sourceReferences: [], descriptors: levels.map(level => ({ levelId: level.id,
        text: level.id === 'L4' ? `${description} Lo evidencia de forma completa, precisa y autónoma.` : level.id === 'L3' ? `${description} Lo evidencia en los aspectos principales.` : level.id === 'L2' ? `${description} Lo evidencia parcialmente o con imprecisiones.` : `${description} Requiere apoyo para aportar evidencia suficiente.`,
        scoreUnits: Math.round(maxScoreUnits * level.proportion) })) }
  })
  return { kind: 'RECOMMENDATION', catalogVersion: 'editable-fallback-v1', instrumentType: input.instrumentType, confidence: 'LOW', activityType: 'OTHER', evidenceTypes: ['KNOWLEDGE', 'PERFORMANCE', 'PRODUCT'], participationMode: input.participationMode,
    curriculumVersionId: null, curriculumScopeId: null, selectedCurriculumElements: [], criteria, levels, totalScore: input.maxScore,
    totalScoreUnits: criteria.reduce((sum, item) => sum + item.maxScoreUnits, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus: 'FALLBACK', reasons: ['Plantilla editable local basada en la actividad; requiere revisión docente.'], ruleId: 'editable-fallback', activityTypeOrigin: 'DEFAULT', ranking: [], curriculumStatus: null, lowCurriculumConfidence: true, consideredTypes: [] } }
}

/** Adapter into the existing four builders; no second instrument editor is created. */
export function recommendationToFields(proposal: InstrumentRecommendation, activityName: string): Record<string, string> {
  const type = proposal.instrumentType
  const fields: Record<string, string> = {
    [`${type}:title`]: `${type === 'rubrica' ? 'Rúbrica' : type === 'escala' ? 'Escala estimativa' : type === 'lista-cotejo' ? 'Lista de cotejo' : 'Lista ponderada'} para ${activityName}`,
    [`${type}:meta:criteriaCount`]: String(proposal.criteria.length),
    [`${type}:meta:prepared`]: 'true',
  }
  if (type === 'rubrica' || type === 'escala') {
    fields[`${type}:meta:levelCount`] = String(proposal.levels.length)
    for (const [index, level] of proposal.levels.entries()) {
      const score = proposal.levels.length - index
      fields[`${type}:level-name:${score}`] = level.label
      fields[`${type}:level-points:${score}`] = String(type === 'rubrica' ? proposal.levels.length - index - 1 : score)
    }
  }
  if (type === 'lista-cotejo') fields['lista-cotejo:meta:pointsMode'] = 'individual'
  if (type === 'lista-ponderada') fields['lista-ponderada:meta:partial'] = 'true'
  for (const [index, criterion] of proposal.criteria.entries()) {
    fields[`${type}:criterion:${index}`] = criterion.title
    fields[`${type}:description:${index}`] = criterion.description
    fields[`${type}:points:${index}`] = String(criterion.maxScoreUnits / 100)
    if (type === 'lista-ponderada') {
      fields[`${type}:indicator:${index}`] = criterion.description
      fields[`${type}:weight:${index}`] = String(Math.round(criterion.maxScoreUnits / proposal.totalScoreUnits * 10000) / 100)
    }
    if (type === 'rubrica') for (const [levelIndex, descriptor] of criterion.descriptors.entries()) {
      fields[`rubrica:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
    }
  }
  if (type === 'lista-ponderada') {
    const weights = proposal.criteria.map(criterion => Math.floor(criterion.maxScoreUnits * 10000 / proposal.totalScoreUnits))
    let remainder = 10000 - weights.reduce((sum, weight) => sum + weight, 0)
    for (let index = 0; remainder > 0; index = (index + 1) % weights.length, remainder--) weights[index]++
    weights.forEach((weight, index) => { fields[`${type}:weight:${index}`] = String(weight / 100) })
  }
  return fields
}

export function alignRecommendationWithFields(proposal: InstrumentRecommendation, fields: Record<string, string>, maxScore: number): InstrumentRecommendation | null {
  const type = proposal.instrumentType
  const count = Number(fields[`${type}:meta:criteriaCount`])
  if (!Number.isInteger(count) || count < 1 || count > 20) return null
  const weightedUnits = type === 'lista-ponderada' ? (() => {
    const weights = Array.from({ length: count }, (_, index) => Number(fields[`${type}:weight:${index}`]))
    if (weights.some(weight => !Number.isFinite(weight) || weight <= 0) || Math.abs(weights.reduce((sum, weight) => sum + weight, 0) - 100) > 0.001) return null
    const raw = weights.map(weight => Math.round(maxScore * 100) * weight / 100)
    const units = raw.map(Math.floor)
    let remainder = Math.round(maxScore * 100) - units.reduce((sum, value) => sum + value, 0)
    const order = raw.map((value, index) => ({ index, fractional: value - units[index] })).sort((a, b) => b.fractional - a.fractional || a.index - b.index)
    for (const item of order) { if (!remainder) break; units[item.index]++; remainder-- }
    return units
  })() : null
  if (type === 'lista-ponderada' && !weightedUnits) return null
  const criteria = Array.from({ length: count }, (_, index) => {
    const prior = proposal.criteria[index]
    const title = fields[`${type}:criterion:${index}`]?.trim() ?? ''
    const scoreUnits = type === 'lista-ponderada'
      ? weightedUnits![index]
      : Math.round(Number(fields[`${type}:points:${index}`]) * 100)
    const description = (fields[`${type}:description:${index}`] ?? (type === 'lista-ponderada' ? fields[`${type}:indicator:${index}`] : prior?.description ?? title))?.trim() ?? ''
    const descriptors = type === 'rubrica'
      ? Array.from({ length: Number(fields['rubrica:meta:levelCount']) || 4 }, (_, levelIndex) => ({
          levelId: `L${Number(fields['rubrica:meta:levelCount']) - levelIndex}`,
          text: fields[`rubrica:descriptor:${index}:${Number(fields['rubrica:meta:levelCount']) - levelIndex}`]?.trim() ?? '',
          scoreUnits: Math.round(scoreUnits * (Number(fields['rubrica:meta:levelCount']) - levelIndex - 1) / (Number(fields['rubrica:meta:levelCount']) - 1)),
        })) : prior?.descriptors ?? []
    const edited = !prior || prior.title !== title || prior.description !== description
    return { id: prior?.id ?? `teacher:${index}`, templateId: prior?.templateId ?? 'teacher', title, description,
      maxScore: scoreUnits / 100, maxScoreUnits: scoreUnits,
      sourceType: edited ? 'ACTIVITY_TEMPLATE' as const : prior.sourceType,
      sourceReferences: edited ? [] : prior.sourceReferences, descriptors }
  })
  if (criteria.some(criterion => !criterion.title || !Number.isInteger(criterion.maxScoreUnits) || criterion.maxScoreUnits <= 0 || criterion.descriptors.some(descriptor => !descriptor.text))) return null
  const totalScoreUnits = criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)
  if (totalScoreUnits !== Math.round(maxScore * 100)) return null
  return { ...proposal, criteria, totalScore: maxScore, totalScoreUnits,
    selectedCurriculumElements: [...new Map(criteria.flatMap(criterion => criterion.sourceReferences).map(ref => [ref.elementId, ref])).values()] }
}
