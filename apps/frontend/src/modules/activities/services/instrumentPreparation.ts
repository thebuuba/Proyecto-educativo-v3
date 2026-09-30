import type { InstrumentRecommendation } from '@aula/shared'
import { api } from '@/services/apiClient'

export type ActivityInterpretation = {
  suggestedActivityType: string
  suggestedEvaluationTechnique: string | null
  activityType: string
  activityTypes: string[]
  curriculumVersionId: string | null
  curriculumScopeId: string | null
  curriculumCandidates: Array<{ elementId: string; type: string; text: string; sources: Array<{ documentId: string; pdfPage: number; printedPage: string | null }> }>
  curriculumMatch: 'SUGGESTED' | 'NONE'
  message: string
}

export function interpretActivity(input: { sectionSubjectId: string; activityTitle: string; description?: string; pedagogicalActivityType?: string; competencyBlock?: string; evaluationTechnique?: string; evidenceInstructions?: string; resources?: string[]; evaluationPriorities?: string[]; organizationMode?: 'INDIVIDUAL' | 'GROUP'; participationMode?: 'INDIVIDUAL' | 'GROUP'; planningMoment?: string }, signal?: AbortSignal) {
  return api.post<ActivityInterpretation>('/evaluation-instruments/interpret', input, { signal })
}

export function prepareInstrument(input: { sectionSubjectId: string; activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; curriculumVersionId?: string; preferredInstrumentType?: string; selectedCurriculumElementIds?: string[]; evaluationTechnique?: string; evidenceInstructions?: string; resources?: string[]; evaluationPriorities?: string[]; organizationMode?: 'INDIVIDUAL' | 'GROUP'; planningMoment?: string }) {
  return api.post<InstrumentRecommendation>('/evaluation-instruments/recommend', input)
}

type EditableTemplateInput = { activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; maxScore: number
  pedagogicalActivityType?: string; evaluationTechnique?: string; preferredInstrumentType?: string; evidenceInstructions?: string
  resources?: string[]; evaluationPriorities?: string[]; organizationMode?: 'INDIVIDUAL' | 'GROUP'; planningMoment?: string }

const rubricLevels = [
  { id: 'L4', label: 'Destacado', proportion: 1 },
  { id: 'L3', label: 'Logrado', proportion: 2 / 3 },
  { id: 'L2', label: 'En proceso', proportion: 1 / 3 },
  { id: 'L1', label: 'Inicial', proportion: 0 },
] as const

function distributeTemplateScore(maxScore: number, weights: number[]) {
  const totalUnits = Math.round(maxScore * 100)
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0)
  const units = weights.map((weight) => Math.floor(totalUnits * weight / weightTotal))
  let remainder = totalUnits - units.reduce((sum, value) => sum + value, 0)
  for (let index = 0; remainder > 0; index = (index + 1) % units.length) { units[index]++; remainder-- }
  return units
}

export function buildEditableInstrumentTemplate(input: EditableTemplateInput, includeVisualResources = false): InstrumentRecommendation {
  const context = `${input.activityTitle} ${input.description ?? ''} ${input.evidenceInstructions ?? ''}`
  const normalized = context.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const techniqueTypes: Record<string, string> = { debate: 'DEBATE', exposicion: 'EXPOSITION', presentacion: 'ORAL_PRESENTATION', ensayo: 'ESSAY',
    'mapa-conceptual': 'CONCEPT_MAP', proyecto: 'PROJECT', portafolio: 'PORTFOLIO', 'prueba-escrita': 'QUIZ_TEST',
    'resolucion-problemas': 'PROBLEM_SOLVING', 'analisis-producciones': 'WRITTEN_PRODUCTION', 'observacion-directa': 'OBSERVATION', 'observacion-sistematica': 'OBSERVATION' }
  const detectedType = /debate/.test(normalized) ? 'DEBATE' : /mapa conceptual/.test(normalized) ? 'CONCEPT_MAP'
    : /informe|reporte/.test(normalized) ? 'REPORT' : /laboratorio|practica/.test(normalized) ? 'LAB_PRACTICE'
      : /ensayo/.test(normalized) ? 'ESSAY' : /trabajo escrito|produccion escrita|redact/.test(normalized) ? 'WRITTEN_PRODUCTION'
        : /proyecto/.test(normalized) ? 'PROJECT' : /exposicion|exponer/.test(normalized) ? 'EXPOSITION'
          : techniqueTypes[input.evaluationTechnique ?? ''] ?? 'OTHER'
  const activityType = input.pedagogicalActivityType || detectedType
  const cellActivity = /celulas?/i.test(normalized)
  const debate = activityType === 'DEBATE'
  const definitionsByType: Record<string, Array<{ id: string; title: string; description: string; descriptors: string[] }>> = {
    DEBATE: [
      { id: 'debate-content', title: cellActivity ? 'Comparación científica entre células eucariotas animales y vegetales' : 'Dominio del contenido del debate', description: cellActivity ? 'Compara semejanzas y diferencias entre las células eucariotas animales y vegetales con precisión científica.' : 'Utiliza el contenido de la actividad con precisión durante el debate.', descriptors: cellActivity ? ['Compara con precisión varias semejanzas y diferencias y explica su importancia.', 'Compara correctamente las semejanzas y diferencias principales.', 'Menciona algunas diferencias, con omisiones o imprecisiones.', 'No logra establecer una comparación científicamente válida.'] : ['Integra el contenido con precisión y profundidad en sus intervenciones.', 'Utiliza correctamente las ideas principales del contenido.', 'Utiliza parte del contenido con algunas imprecisiones.', 'Sus intervenciones no evidencian comprensión suficiente del contenido.'] },
      { id: 'debate-argument', title: 'Argumentación con razones y evidencias', description: 'Sustenta sus ideas con razones, ejemplos o evidencias pertinentes.', descriptors: ['Construye argumentos coherentes y los respalda con razones y evidencias pertinentes.', 'Presenta argumentos claros respaldados por al menos una razón o ejemplo pertinente.', 'Expresa una postura, pero ofrece apoyo limitado o poco relacionado.', 'Formula afirmaciones sin razones ni evidencias que las sustenten.'] },
      { id: 'debate-response', title: 'Respuesta a los argumentos del otro equipo', description: 'Escucha, contrasta y responde los argumentos presentados por el otro equipo.', descriptors: ['Responde directamente, contrasta ideas y justifica su respuesta con precisión.', 'Responde de manera pertinente a los argumentos principales del otro equipo.', 'Responde parcialmente o se desvía de la idea que debía contrastar.', 'No responde a los argumentos presentados por el otro equipo.'] },
      { id: 'debate-clarity', title: 'Claridad de las intervenciones', description: 'Comunica cada intervención de forma clara, audible y comprensible.', descriptors: ['Interviene con claridad, vocabulario preciso y una secuencia fácil de seguir.', 'Expresa sus ideas de manera clara y mayormente ordenada.', 'Algunas intervenciones resultan confusas o poco audibles.', 'Sus intervenciones no permiten comprender la idea que desea comunicar.'] },
      { id: 'debate-listening', title: 'Escucha y respeto de los turnos', description: 'Escucha activamente, respeta los turnos y se relaciona con las ideas de los demás.', descriptors: ['Escucha de forma constante, respeta todos los turnos y retoma ideas ajenas de manera constructiva.', 'Escucha y respeta los turnos durante la mayor parte del debate.', 'Interrumpe ocasionalmente o muestra atención irregular.', 'Interrumpe reiteradamente o no atiende las intervenciones de los demás.'] },
      { id: 'debate-individual', title: 'Aporte individual', description: `Realiza aportes propios y pertinentes${input.organizationMode === 'GROUP' ? ', aunque la actividad se organice en equipos' : ''}.`, descriptors: ['Realiza varios aportes propios, pertinentes y conectados con el desarrollo del debate.', 'Realiza al menos un aporte propio y pertinente.', 'Su aporte es breve, repetitivo o requiere apoyo para relacionarse con el debate.', 'No realiza un aporte individual observable.'] },
    ],
    CONCEPT_MAP: [
      { id: 'map-content', title: 'Selección de conceptos', description: 'Incluye los conceptos esenciales del tema.', descriptors: ['Incluye todos los conceptos esenciales con precisión.', 'Incluye los conceptos principales.', 'Omite varios conceptos importantes.', 'Incluye pocos conceptos o conceptos incorrectos.'] },
      { id: 'map-hierarchy', title: 'Jerarquía conceptual', description: 'Organiza los conceptos desde los generales hasta los específicos.', descriptors: ['La jerarquía es completa, lógica y consistente.', 'La jerarquía principal es correcta.', 'La jerarquía presenta algunos niveles confusos.', 'No se reconoce una jerarquía conceptual.'] },
      { id: 'map-relations', title: 'Relaciones y palabras enlace', description: 'Conecta conceptos mediante relaciones correctas y palabras enlace significativas.', descriptors: ['Todas las conexiones expresan relaciones precisas.', 'La mayoría de las conexiones son correctas.', 'Varias conexiones son vagas o incorrectas.', 'Las conexiones no explican relaciones entre conceptos.'] },
      { id: 'map-readability', title: 'Claridad visual', description: 'Presenta una estructura legible que permite seguir las relaciones.', descriptors: ['La estructura se lee con facilidad y guía claramente el recorrido.', 'La estructura es legible y comprensible.', 'La lectura presenta algunas dificultades.', 'La disposición impide comprender el mapa.'] },
    ],
    REPORT: [
      { id: 'report-purpose', title: 'Propósito y contenido', description: 'Desarrolla el propósito del informe con información pertinente.', descriptors: ['Desarrolla el propósito con información completa y precisa.', 'Desarrolla el propósito con la información principal.', 'Presenta información parcial o algunas imprecisiones.', 'No desarrolla el propósito del informe.'] },
      { id: 'report-method', title: 'Procedimiento', description: 'Describe el procedimiento realizado de forma ordenada y reproducible.', descriptors: ['Describe todos los pasos con orden y detalle suficiente para reproducirlos.', 'Describe los pasos principales en orden.', 'Omite pasos o presenta un orden confuso.', 'No permite reconocer el procedimiento realizado.'] },
      { id: 'report-data', title: 'Registro de resultados', description: 'Presenta observaciones o datos de manera clara y fiel.', descriptors: ['Registra datos completos, claros y sin alteraciones.', 'Registra correctamente los resultados principales.', 'El registro es incompleto o poco claro.', 'No presenta resultados utilizables.'] },
      { id: 'report-analysis', title: 'Análisis y conclusión', description: 'Interpreta los resultados y formula una conclusión coherente.', descriptors: ['Relaciona datos, explicación y conclusión con precisión.', 'Interpreta los resultados y presenta una conclusión coherente.', 'La interpretación o conclusión es parcial.', 'La conclusión no se apoya en los resultados.'] },
    ],
  }
  const exposition = cellActivity ? [
    { id: 'cell-concept', title: 'Comprensión del concepto de célula', description: 'Explica qué es una célula y la reconoce como unidad básica de los seres vivos.', descriptors: ['Define la célula con precisión y explica su relación con la organización de los seres vivos.', 'Define correctamente la célula y reconoce su papel básico en los seres vivos.', 'Explica parcialmente el concepto de célula o presenta alguna imprecisión.', 'Menciona la célula, pero no logra explicar el concepto ni su papel.'] },
    { id: 'cell-parts-functions', title: 'Partes principales y sus funciones', description: 'Identifica las partes principales de la célula y explica la función de cada una.', descriptors: ['Identifica las partes principales y relaciona cada una con su función de manera precisa.', 'Identifica las partes principales y explica correctamente la mayoría de sus funciones.', 'Identifica algunas partes, pero confunde u omite varias funciones.', 'Presenta dificultades para identificar las partes y explicar sus funciones.'] },
    { id: 'cell-importance', title: 'Importancia de las células', description: 'Explica por qué las células son importantes para la estructura y el funcionamiento de los seres vivos.', descriptors: ['Explica la importancia de las células y establece relaciones claras con la estructura y las funciones vitales.', 'Explica correctamente la importancia general de las células para los seres vivos.', 'Reconoce que las células son importantes, pero ofrece una explicación incompleta.', 'No logra explicar la importancia de las células para los seres vivos.'] },
    { id: 'scientific-mastery', title: 'Dominio del tema y precisión científica', description: 'Expone con dominio del tema y utiliza información y vocabulario científico precisos.', descriptors: ['Explica con autonomía, vocabulario científico preciso y sin errores conceptuales.', 'Demuestra dominio general y usa vocabulario científico adecuado, con errores menores.', 'Depende parcialmente de la lectura o presenta varias imprecisiones científicas.', 'Evidencia poco dominio del tema y presenta errores que dificultan la comprensión.'] },
    { id: 'oral-organization', title: 'Organización de la exposición', description: 'Presenta las ideas con una secuencia clara: introducción, desarrollo y cierre.', descriptors: ['Organiza la exposición con una secuencia completa y transiciones que conectan las ideas.', 'Mantiene una secuencia clara con introducción, desarrollo y cierre reconocibles.', 'La secuencia se comprende, aunque algunas ideas aparecen desordenadas o desconectadas.', 'Presenta ideas aisladas sin una secuencia que permita seguir la exposición.'] },
    { id: 'oral-clarity', title: 'Claridad de la comunicación oral', description: 'Comunica las ideas con voz audible, ritmo adecuado y explicaciones comprensibles.', descriptors: ['Se expresa con claridad, fluidez, volumen y ritmo adecuados durante toda la exposición.', 'Se comunica de forma comprensible y mantiene un volumen y ritmo mayormente adecuados.', 'Se comprende parte de la exposición, pero el volumen, ritmo o fluidez son irregulares.', 'La comunicación oral dificulta comprender las ideas principales.'] },
  ] : [
    { id: 'topic-understanding', title: 'Comprensión del tema', description: 'Explica las ideas principales del tema con sus propias palabras.', descriptors: ['Explica todas las ideas principales y establece relaciones pertinentes.', 'Explica correctamente las ideas principales.', 'Explica algunas ideas, con omisiones o imprecisiones.', 'No aporta evidencia suficiente de comprensión.'] },
    { id: 'topic-accuracy', title: 'Dominio y precisión', description: 'Utiliza información precisa y vocabulario adecuado al tema.', descriptors: ['Expone con autonomía y precisión consistente.', 'Expone con precisión general y errores menores.', 'Presenta varias imprecisiones o depende de la lectura.', 'Presenta errores que dificultan comprender el tema.'] },
    { id: 'oral-organization', title: 'Organización de la exposición', description: 'Organiza las ideas en una secuencia clara.', descriptors: ['Presenta una secuencia completa y conectada.', 'Presenta una secuencia clara.', 'La secuencia contiene algunos saltos.', 'Las ideas aparecen sin orden reconocible.'] },
    { id: 'oral-clarity', title: 'Claridad de la comunicación oral', description: 'Comunica las ideas de forma audible y comprensible.', descriptors: ['Se expresa con claridad y fluidez durante toda la exposición.', 'Se comunica de forma comprensible.', 'La claridad es irregular.', 'La comunicación dificulta comprender las ideas.'] },
  ]
  const written = [
    { id: 'written-content', title: 'Contenido y propósito', description: 'Desarrolla el tema y responde al propósito del trabajo escrito.', descriptors: ['Desarrolla el tema con profundidad, precisión y enfoque sostenido.', 'Desarrolla las ideas principales de acuerdo con el propósito.', 'Desarrolla el tema parcialmente o con algunas imprecisiones.', 'El texto no responde al propósito solicitado.'] },
    { id: 'written-structure', title: 'Organización del texto', description: 'Organiza el texto con una secuencia y partes reconocibles.', descriptors: ['Organiza las ideas con estructura completa y transiciones claras.', 'Presenta una estructura clara y ordenada.', 'La organización contiene saltos o partes poco desarrolladas.', 'Las ideas aparecen sin una estructura reconocible.'] },
    { id: 'written-evidence', title: 'Desarrollo y evidencias', description: 'Explica las ideas mediante razones, ejemplos o información pertinente.', descriptors: ['Desarrolla cada idea con razones y ejemplos pertinentes.', 'Apoya las ideas principales con información adecuada.', 'El apoyo es limitado o poco conectado con las ideas.', 'Presenta afirmaciones sin desarrollo.'] },
    { id: 'written-correctness', title: 'Claridad y corrección', description: 'Utiliza vocabulario adecuado y revisa la escritura.', descriptors: ['Redacta con claridad, vocabulario preciso y corrección consistente.', 'Redacta de forma comprensible con errores menores.', 'Los errores dificultan parcialmente la lectura.', 'Los errores impiden comprender el texto.'] },
  ]
  const base = definitionsByType[activityType] ?? (['WRITTEN_PRODUCTION', 'ESSAY'].includes(activityType) ? written : exposition)
  const definitions = includeVisualResources && !debate ? [...base, {
    id: 'optional-visual-resources', title: 'Uso de recursos visuales', description: 'Utiliza recursos visuales pertinentes para apoyar y aclarar la explicación.',
    descriptors: ['Integra recursos visuales claros y pertinentes que amplían la explicación.', 'Usa recursos visuales pertinentes que apoyan las ideas principales.', 'Presenta recursos visuales, pero los relaciona poco con la explicación.', 'Los recursos visuales no apoyan la explicación o no se utilizan durante la exposición.'],
  }] : base
  const weights = definitions.map((_, index) => index < 3 ? 5 : index === 3 ? 4 : 3)
  const scores = distributeTemplateScore(input.maxScore, weights)
  const criteria = definitions.map((criterion, index) => ({
    id: `editable-template:${criterion.id}`, templateId: criterion.id, title: criterion.title, description: criterion.description,
    maxScore: scores[index] / 100, maxScoreUnits: scores[index], sourceType: 'ACTIVITY_TEMPLATE' as const, sourceReferences: [],
    descriptors: rubricLevels.map((level, levelIndex) => ({ levelId: level.id, text: criterion.descriptors[levelIndex], scoreUnits: Math.round(scores[index] * level.proportion) })),
  }))
  const instrumentType = (input.preferredInstrumentType || (['OBSERVATION'].includes(activityType) ? 'lista-cotejo' : 'rubrica')) as InstrumentRecommendation['instrumentType']
  const descriptorLevels = instrumentType === 'rubrica' || instrumentType === 'escala' ? [...rubricLevels] : []
  const normalizedCriteria = criteria.map(criterion => ({ ...criterion, descriptors: descriptorLevels.length ? criterion.descriptors : [] }))
  return {
    kind: 'RECOMMENDATION', catalogVersion: 'evaluation-2026.2', instrumentType, confidence: 'LOW', activityType,
    evidenceTypes: ['KNOWLEDGE', 'PERFORMANCE'], participationMode: input.participationMode, curriculumVersionId: null, curriculumScopeId: null,
    selectedCurriculumElements: [], criteria: normalizedCriteria, levels: descriptorLevels, totalScore: input.maxScore,
    totalScoreUnits: normalizedCriteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus: 'EDITABLE_TEMPLATE', reasons: ['Plantilla local inicial para revisión docente; no constituye validación curricular.'],
      ruleId: `editable-${activityType.toLocaleLowerCase()}-template`, activityTypeOrigin: input.pedagogicalActivityType ? 'EXPLICIT' : 'DETECTED', ranking: [], curriculumStatus: null,
      lowCurriculumConfidence: true, consideredTypes: [] },
  }
}

export function preparationFingerprint(input: { name: string; description: string; maxScore: string; pedagogicalActivityType?: string; activityType: string; instrumentType: string; selectedCurriculumElementIds?: string[]; evidenceInstructions?: string; resources?: string[]; competencyBlockWeights?: Record<string, number>; evaluationPriorities?: string[] }) {
  return JSON.stringify([input.name, input.description, input.maxScore, input.pedagogicalActivityType, input.activityType, input.instrumentType, input.evidenceInstructions ?? '', input.resources ?? [], input.competencyBlockWeights ?? {}, input.evaluationPriorities ?? [], input.selectedCurriculumElementIds ?? []])
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
    fields[`${type}:meta:levelValueMode`] = 'percentage'
    for (const [index, level] of proposal.levels.entries()) {
      const score = proposal.levels.length - index
      fields[`${type}:level-name:${score}`] = level.label
      fields[`${type}:level-points:${score}`] = String(Math.round(level.proportion * 10000) / 100)
    }
  }
  if (type === 'lista-cotejo') fields['lista-cotejo:meta:pointsMode'] = 'individual'
  if (type === 'lista-ponderada') fields['lista-ponderada:meta:partial'] = 'true'
  for (const [index, criterion] of proposal.criteria.entries()) {
    fields[`${type}:criterion-id:${index}`] = criterion.id
    fields[`${type}:criterion:${index}`] = type === 'rubrica' ? criterion.title : criterion.description
    fields[`${type}:description:${index}`] = criterion.description
    fields[`${type}:points:${index}`] = String(criterion.maxScoreUnits / 100)
    if (type === 'lista-ponderada') {
      fields[`${type}:indicator:${index}`] = criterion.description
      fields[`${type}:weight:${index}`] = String(Math.round(criterion.maxScoreUnits / proposal.totalScoreUnits * 10000) / 100)
    }
    if (type === 'rubrica' || type === 'escala') for (const [levelIndex, descriptor] of criterion.descriptors.entries()) {
      fields[`${type}:descriptor:${index}:${proposal.levels.length - levelIndex}`] = descriptor.text
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
    const storedId = fields[`${type}:criterion-id:${index}`]
    const prior = proposal.criteria.find((criterion) => criterion.id === storedId) ?? proposal.criteria[index]
    const visibleCriterion = fields[`${type}:criterion:${index}`]?.trim() ?? ''
    const title = type === 'rubrica' ? visibleCriterion : prior?.title ?? visibleCriterion
    const scoreUnits = type === 'lista-ponderada'
      ? weightedUnits![index]
      : Math.round(Number(fields[`${type}:points:${index}`]) * 100)
    const description = (type === 'rubrica' ? fields[`${type}:description:${index}`] : (visibleCriterion || fields[`${type}:description:${index}`]
      || (type === 'lista-ponderada' ? fields[`${type}:indicator:${index}`] : prior?.description ?? title)))?.trim() ?? ''
    const levelCount = Number(fields[`${type}:meta:levelCount`]) || proposal.levels.length
    const descriptors = type === 'rubrica' || type === 'escala'
      ? Array.from({ length: levelCount }, (_, levelIndex) => {
        const scoreKey = levelCount - levelIndex
        const configured = Number(fields[`${type}:level-points:${scoreKey}`])
        const highest = Number(fields[`${type}:level-points:${levelCount}`])
        const proportion = Number.isFinite(configured) && Number.isFinite(highest) && highest > 0 ? configured / highest : (levelCount - levelIndex - 1) / (levelCount - 1)
        return { levelId: proposal.levels[levelIndex]?.id ?? `L${scoreKey}`,
          text: fields[`${type}:descriptor:${index}:${scoreKey}`]?.trim() ?? prior?.descriptors[levelIndex]?.text ?? '',
          scoreUnits: Math.round(scoreUnits * proportion) }
      }) : prior?.descriptors ?? []
    const edited = !prior || prior.title !== title || prior.description !== description
    return { id: storedId || prior?.id || `teacher:${index}`, templateId: prior?.templateId ?? 'teacher', title, description,
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
