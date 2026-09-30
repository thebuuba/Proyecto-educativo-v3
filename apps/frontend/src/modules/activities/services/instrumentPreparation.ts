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

type EditableTemplateInput = { activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'; maxScore: number }

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
  const cellActivity = /c[eé]lulas?/i.test(`${input.activityTitle} ${input.description ?? ''}`)
  const base = cellActivity ? [
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
  const definitions = includeVisualResources ? [...base, {
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
  return {
    kind: 'RECOMMENDATION', catalogVersion: 'evaluation-2026.2', instrumentType: 'rubrica', confidence: 'LOW', activityType: 'EXPOSITION',
    evidenceTypes: ['KNOWLEDGE', 'PERFORMANCE'], participationMode: input.participationMode, curriculumVersionId: null, curriculumScopeId: null,
    selectedCurriculumElements: [], criteria, levels: [...rubricLevels], totalScore: input.maxScore,
    totalScoreUnits: criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0), scoreUnit: 0.01,
    internalTrace: { mappingStatus: 'EDITABLE_TEMPLATE', reasons: ['Plantilla local inicial para revisión docente; no constituye validación curricular.'],
      ruleId: 'editable-exposition-template', activityTypeOrigin: 'DETECTED', ranking: [], curriculumStatus: null,
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
    for (const [index, level] of proposal.levels.entries()) {
      const score = proposal.levels.length - index
      fields[`${type}:level-name:${score}`] = level.label
      fields[`${type}:level-points:${score}`] = String(level.proportion)
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
