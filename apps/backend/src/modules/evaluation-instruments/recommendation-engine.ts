import {resolveOptativeSocialTask,optativeSocialCriteria,optativeSocialSelections} from '@aula/shared'
import {resolveOptativeLanguageTask,optativeLanguageCriteria,optativeLanguageSelections,adaptOptativeLanguageScale} from '@aula/shared'
import {resolveCommonPhysicalTask,commonPhysicalCriteria,commonPhysicalSelections,adaptPhysicalScale} from '@aula/shared'
import {resolveCommonFhrTask,commonFhrCriteria,commonFhrSelections,adaptFhrScale} from '@aula/shared'
import { resolveCommonArtTask, commonArtCriteria, commonArtSelections, adaptArtScale } from '@aula/shared'
import {resolveCommonSocialTask,commonSocialCriteria,commonSocialSelections,adaptSocialScale} from '@aula/shared'
import {resolveOptativeScienceTask,optativeScienceCriteria,optativeScienceSelections,adaptOptativeScienceScale} from '@aula/shared'
import {resolveCommonScienceTask,commonScienceCriteria,commonScienceSelections,adaptScienceScale} from '@aula/shared'
import { resolveCommonFrenchTask, commonFrenchSelections, commonFrenchCriteria } from '@aula/shared'
import {resolveOptativeMathTask,optativeMathCriteria,optativeMathSelections} from '@aula/shared'
import { resolveCommonMathTask,commonMathCriteria,commonMathSelections,adaptMathScale } from '@aula/shared'
import { secondGradeNewsCriteria } from './authored/language/news-grade-2'
import {resolveEvaluationTask,secondaryNovelAnalysisCriteria,actionContentCriteria,languageInstrumentIntent,assertInstrumentCapacity,withDeliveryCriteria,deliveryConditions} from '@aula/shared'
import { newsCriteria } from './authored/language/news-grade-1'
import { adaptLanguageScale, formatAuthoredCriteria, isFirstGradeNewsActivity, isFirstGradeGuideActivity, isFirstGradePosterActivity, isFirstGradeDetectiveActivity, isFirstGradeCalligramActivity, firstSecondaryLanguageGenre } from '@aula/shared'
import { findSecondaryMathTopic, secondaryMathCriteria } from '@aula/shared'
import { touristGuideCriteria } from './authored/language/tourist-guide-grade-1'
import { posterCriteria } from './authored/language/poster-grade-1'
import { readingReportCriteria } from './authored/language/reading-report-grade-1'
import { detectiveStoryCriteria } from './authored/language/detective-story-grade-1'
import { calligramCriteria } from './authored/language/calligram-grade-1'
import type { AuthoredCriterion } from './authored/language/types'
import { distributeScoreUnits, findSecondaryLanguageTopic, secondaryTopicCriteria, withoutResources, scientificTaskType, findSecondaryScienceTopic, secondaryScienceCriteria, resolveCommonEnglishTask,commonEnglishCriteria,commonEnglishSelections,commonSecondaryEnglish,englishTaskGrade,resolveOptativeEnglishTask } from '@aula/shared'
import { detectSecondaryLanguageActivity, firstSecondaryLanguageTechnique, INSTRUMENT_MAX_CRITERIA, type CurriculumReference, type InstrumentRecommendation, type RecommendationCriterion } from '@aula/shared'
export { detectFirstSecondaryLanguageActivity, detectSecondaryLanguageActivity } from '@aula/shared'
import { type EvaluationCatalog, evaluationCatalogCurrent } from './catalog-current'
import { type AcademicContext, type ScopeCandidate, discipline, normalize } from './curriculum-context'

export interface RecommendationInput {
  activityTitle: string; description?: string; participationMode: 'INDIVIDUAL' | 'GROUP'
  evaluationTechnique?: string; evidenceInstructions?: string; resources?: string[]; evaluationPriorities?: string[]
  organizationMode?: 'INDIVIDUAL' | 'GROUP'; planningMoment?: 'inicio' | 'desarrollo' | 'cierre'
  pedagogicalActivityType?: string; maxScore: number; competencyBlock?: string; levelCount?: 4 | 5
  preferredInstrumentType?: 'rubrica' | 'lista-cotejo' | 'escala' | 'lista-ponderada'
  includeAdditionalCandidates?: boolean
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
  const fromDescription = tokens(withoutResources(description)).filter(t => !boilerplate.includes(t) && !/^\d+$/.test(t))
  return fromDescription.length >= 2 ? fromDescription.slice(0,8)
    : fromTitle.length >= 2 ? fromTitle : [...new Set([...fromTitle, ...fromDescription])].slice(0, 8)
}
const activityTypeTechniques: Record<string, string> = {
  DEBATE: 'debate', EXPOSITION: 'exposicion', ORAL_PRESENTATION: 'presentacion', CONCEPT_MAP: 'mapa-conceptual',
  ESSAY: 'ensayo', PROJECT: 'proyecto', PORTFOLIO: 'portafolio', QUIZ_TEST: 'prueba-escrita',
  PROBLEM_SOLVING: 'resolucion-problemas', WRITTEN_PRODUCTION: 'analisis-producciones', OBSERVATION: 'observacion-directa',
  REPORT: 'analisis-producciones', LAB_PRACTICE: 'observacion-sistematica', EXPERIMENT: 'observacion-sistematica',
}
export const suggestEvaluationTechnique = (activityType: string) => activityTypeTechniques[activityType] ?? null

export function detectActivityType(title: string, description: string, catalog: EvaluationCatalog = evaluationCatalogCurrent, contextualTypes = true, evaluationTechnique?: string) {
  const contract=resolveEvaluationTask(title,description)
  if(contract.action) return catalog.activityTypes.find(entry=>entry.id===(contract.oral&&contract.product==='ANALYTICAL_TEXT'?'ORAL_PRESENTATION':contract.action))!
  const scientific = scientificTaskType(title, description)
  if (scientific) return catalog.activityTypes.find(entry => entry.id === scientific)!
  const task = normalize(withoutResources(description || title))
  if (/\b(?:realiz\w*|practic\w*|ejecut\w*)\s+(?:(?:una?|la|los|las)\s+)?(?:practica|actividad|rutina|ejercicios?)\s+(?:motriz|motrices|deportiv\w*)\b/.test(task)) return catalog.activityTypes.find(entry=>entry.id==='MOTOR_SPORTS_PRACTICE')!
  const find = (value: string, descriptionMode = false) => {
    const text = normalize(value)
    const words = tokens(text)
    const matched = (trigger: string) => {
      const normalizedTrigger = normalize(trigger)
      const infinitiveRoot = normalizedTrigger.match(/^([a-z]+)(?:ar|er|ir)$/)?.[1]
      return text.includes(normalizedTrigger) || tokens(trigger).every(part => words.some(word => similarToken(word, part)))
        || Boolean(descriptionMode && infinitiveRoot && new RegExp(`\\b${infinitiveRoot}[a-z]*\\b`).test(text))
    }
    return catalog.activityTypes.filter(a => (contextualTypes || !/^(?:NEWS|TOURIST_GUIDE|READING_REPORT|POSTER|DETECTIVE_STORY|CALLIGRAM)/.test(a.id))
      && (!a.id.startsWith('NEWS_') || /noticia|noticiero/.test(text))
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
          || new RegExp(`(?:realiz|prepar|hacer|present|elabor|dibuj|cre|produc)[a-z]*\\s+(?:una?\\s+)?${normalizedTrigger.replace(/\s+/g, '\\s+')}`).test(text)
      })))
      .sort((a, b) => Math.max(...b.triggers.filter(matched).map(t => t.length)) - Math.max(...a.triggers.filter(matched).map(t => t.length)))[0]
  }
  // The description normally expresses the task the student will perform. The title
  // is supporting context and may only name the topic (for example, "La noticia").
  const techniqueType = evaluationTechnique ? Object.entries(activityTypeTechniques).find(([, technique]) => normalize(technique) === normalize(evaluationTechnique))?.[0]
    ?? (/^observacion(?: directa| sistematica)?$/.test(normalize(evaluationTechnique)) ? 'OBSERVATION' : undefined) : undefined
  return find(withoutResources(description), true) ?? find(title) ?? catalog.activityTypes.find(a => a.id === techniqueType) ?? catalog.activityTypes.find(a => a.id === 'OTHER')!
}
export function rankCurriculum(title: string, description: string, activityType: string, competencyBlock: string | undefined,
  scope: ScopeCandidate | null, elements: RankedElement[], catalog: EvaluationCatalog = evaluationCatalogCurrent) {
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

function teacherTopic(title: string, description = '') {
  const described = description.match(/(?:problemas|ejercicios|situaciones)\s+(?:con|de|sobre)\s+([^,.;]+?)(?=\s+(?:y|e)\s|[,.;]|$)/iu)?.[1]
  if (described) return described.trim().toLocaleLowerCase('es-DO')
  const match = title.match(/(?:sobre|de|del|con)\s+(.+)$/i)
  return (match?.[1] ?? title).trim().replace(/[.!?]+$/, '').toLocaleLowerCase('es-DO')
}

function prudentObservable(templateId: string, observable: string, topic: string) {
  // Only bounded nominal content can refine an uncovered template, never a whole task title.
  if (!topic || topic.split(/\s+/).length > 5 || /\b(?:aplicamos|construimos|resolvemos|estudiantes|actividad)\b/i.test(topic)) return observable
  if (templateId === 'math-procedure') return `Aplica el procedimiento solicitado para resolver la situación con ${topic}.`
  if (templateId === 'math-comprehension') return `Identifica los datos y la pregunta de la situación con ${topic}.`
  return observable
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

export function firstSecondaryLanguageSelections(activityType: string, description = '') {
  const activity = evaluationCatalogCurrent.activityTypes.find(entry => entry.id === activityType)
  if (!activity) return null
  const rule = evaluationCatalogCurrent.recommendationRules.filter(entry => (!entry.families.length || entry.families.includes(activity.family))
    && (!entry.band || entry.band === 'SECONDARY') && (!entry.evidence || entry.evidence.every(evidence => activity.evidence.includes(evidence))))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0]
  const technique = firstSecondaryLanguageTechnique(activityType)
  return { suggestedEvaluationTechnique: technique, suggestedInstrumentType: languageInstrumentIntent(description) ?? rule.instrument }
}

export function suggestedSelections(activityType: string, context: AcademicContext | null, description = '') {
  const french=resolveCommonFrenchTask('',description,context)
  if(french)return commonFrenchSelections(french,description)
  const english=resolveCommonEnglishTask('',description,context)
  if(english)return commonEnglishSelections(english,description)
  const activity = evaluationCatalogCurrent.activityTypes.find(entry => entry.id === activityType)
  if (!activity) return null
  const band = context?.level === 'PRIMARY' ? context.cycle === 1 ? 'PRIMARY_FIRST' : 'PRIMARY_SECOND' : 'SECONDARY'
  const rule = evaluationCatalogCurrent.recommendationRules.filter(entry => (!entry.families.length || entry.families.includes(activity.family))
    && (!entry.band || entry.band === band) && !entry.maxScore
    && (!entry.evidence || entry.evidence.every(evidence => activity.evidence.includes(evidence))))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0]
  const techniques: Record<string, string> = {
    ORAL: 'exposicion', WRITTEN: 'analisis-producciones', OBSERVATIONAL: 'observacion-sistematica',
    SCIENTIFIC: 'observacion-sistematica', MATHEMATICAL: 'resolucion-problemas',
    MOTOR: 'observacion-directa', PROJECT_BASED: 'proyecto', ARTISTIC: 'analisis-producciones', PRACTICAL: 'observacion-directa',
  }
  return {
    suggestedEvaluationTechnique: suggestEvaluationTechnique(activityType) ?? techniques[activity.family] ?? 'observacion-directa',
    suggestedInstrumentType: (context?.level === 'SECONDARY' && context.subjectCode === 'LEN' ? languageInstrumentIntent(description) : undefined) ?? rule.instrument,
  }
}

export function recommend(input: RecommendationInput, context: AcademicContext | null, scope: ScopeCandidate | null,
  elements: RankedElement[], mappingStatus: string, curriculumStatus: string | null, catalog: EvaluationCatalog = evaluationCatalogCurrent): InstrumentRecommendation {
  if (input.evidenceInstructions?.trim()) input = { ...input, description: [input.description, input.evidenceInstructions].filter(Boolean).join('\n'), evidenceInstructions: undefined }
  const genericDescription = [withoutResources(input.description ?? ''), input.evidenceInstructions ?? '', ...(input.evaluationPriorities ?? [])].join(' ')
  const text = normalize(`${input.activityTitle} ${genericDescription} ${(input.resources ?? []).join(' ')}`)
  const explicit = input.pedagogicalActivityType ? catalog.activityTypes.find(a => a.id === input.pedagogicalActivityType) : undefined
  if (input.pedagogicalActivityType && !explicit) throw new Error('Tipo pedagógico desconocido.')
  const englishModule=context?.grade===1?catalog.englishGradeOneModule:context?.grade===2?catalog.englishGradeTwoModule:context?.grade===3?catalog.englishGradeThreeModule:context?.grade===4?catalog.englishGradeFourModule:context?.grade===5?catalog.englishGradeFiveModule:context?.grade===6?catalog.englishGradeSixModule:null
  const optativeEnglishTask=catalog.optativeEnglishModules?.some(m=>m.subjectCode===context?.subjectCode.trim().toUpperCase())?resolveOptativeEnglishTask(input.activityTitle,input.description??'',context):null
  const englishTask=optativeEnglishTask??(englishModule?resolveCommonEnglishTask(input.activityTitle,input.description??'',context):null)
  const frenchTask=catalog.frenchModules?.some(module=>module.grade===context?.grade)?resolveCommonFrenchTask(input.activityTitle,input.description??'',context):null
  const optativeMath=resolveOptativeMathTask(input.activityTitle,input.description??'',context,catalog.optativeMathModules??[])
  const mathTask=catalog.mathCommonModules?.some(module=>module.grade===context?.grade)?resolveCommonMathTask(input.activityTitle,input.description??'',context):null
  const optativeScience=resolveOptativeScienceTask(input.activityTitle,input.description??'',context,catalog.optativeScienceModules??[])
  const commonScience=catalog.scienceCommonModules?.some(module=>module.grade===context?.grade)?resolveCommonScienceTask(input.activityTitle,input.description??'',context):null
  const socialModule=catalog.socialCommonModules?.find(m=>m.grade===context?.grade)
  const socialTask=socialModule?resolveCommonSocialTask(input.activityTitle,input.description??'',context,socialModule.topics):null
  const socialOptative=resolveOptativeSocialTask(input.activityTitle,input.description??'',context,catalog.optativeSocialModules??[])
  const optativeTask=resolveOptativeLanguageTask(input.activityTitle,input.description??'',context,catalog.optativeLanguageModules??[])
  const fhrModule=catalog.fhrCommonModules?.find(module=>module.grade===context?.grade)
  const fhrTask=fhrModule?resolveCommonFhrTask(input.activityTitle,input.description??'',context,fhrModule.topics):null
  const physicalModule=catalog.physicalCommonModules?.find(module=>module.grade===context?.grade)
  const physicalTask=physicalModule?resolveCommonPhysicalTask(input.activityTitle,input.description??'',context,physicalModule.topics):null
  const artModule = catalog.artCommonModules?.find(module => module.grade === context?.grade)
  const artTask = artModule ? resolveCommonArtTask(input.activityTitle, input.description ?? '', context, artModule.topics) : null
  const scopedType = optativeScience?.activityType ?? optativeMath?.activityType ?? socialOptative?.activityType ?? optativeTask?.activityType ?? fhrTask?.activityType ?? physicalTask?.activityType ?? artTask?.activityType ?? socialTask?.activityType??commonScience?.activityType??mathTask?.activityType??frenchTask?.activityType??englishTask?.activityType??detectSecondaryLanguageActivity(input.activityTitle, input.description ?? '', context)
  const detectedByCatalog = catalog.activityTypes.find(entry => entry.id === scopedType)
    ?? detectActivityType(input.activityTitle, input.description ?? '', catalog, false, input.evaluationTechnique)
  const detected = detectedByCatalog.id === 'OTHER' && /observ(?:ar|an|aran|arán).*(?:registr|tabla)/.test(text)
    ? catalog.activityTypes.find(entry => entry.id === 'OBSERVATION')! : detectedByCatalog
  const activity = explicit ?? detected
  const band = context?.level === 'PRIMARY' ? context.cycle === 1 ? 'PRIMARY_FIRST' : 'PRIMARY_SECOND' : 'SECONDARY'
  const area = discipline(scope, context)
  const matchedTopic = findSecondaryLanguageTopic(input.activityTitle, input.description ?? '', context)
  const contextualTopic = area === 'language' && catalog.contextualModules?.some(topic => topic.id === matchedTopic?.id && topic.grade === matchedTopic.grade) ? matchedTopic : null
  const matchedScience = findSecondaryScienceTopic(input.activityTitle, input.description ?? '', context)
  const scienceTopic = !commonScience && catalog.scienceModules?.some(module => module.id === matchedScience && module.grade === context?.grade) ? matchedScience : null
  const matchedMath = findSecondaryMathTopic(input.activityTitle, input.description ?? '', context)
  const mathTopic = !mathTask && catalog.mathModules?.some(module=>module.id === matchedMath && module.grade === context?.grade) ? matchedMath : null
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
  const topic = teacherTopic(input.activityTitle,input.description)
  const dimensions = area === 'science' ? learningDimensions(genericDescription, topic) : []
  const visualResources = /imagenes|recursos visuales|laminas|diapositivas/.test(text)
  const allCandidates = catalog.criterionTemplates.filter(t => (t.area === area || t.area === '*') && t.bands.includes(band)
    && (!t.families.length || t.families.includes(activity.family)) && t.evidence.some(e => activity.evidence.includes(e))
    && (!t.id.startsWith('concept-') || activity.id === 'CONCEPT_MAP')
    && (!t.id.startsWith('debate-') || activity.id === 'DEBATE')
    && (!t.attitude || attitudeRelevant) && (!t.requires || t.requires.some(word => text.includes(normalize(word)))))
    .map(t => ({ template: t, score: t.weight + (t.area === area && area !== '*' ? 10 : 0)
      + (activity.family === 'ORAL' && ['organization', 'communication'].includes(t.id) ? 17 : 0)
      + (activity.family === 'SCIENTIFIC' && ['science-procedure', 'science-data', 'science-interpretation', 'science-conclusion', 'science-safety'].includes(t.id) ? 12 : 0)
      + overlap(tokens(t.keywords.join(' ')), text)
      + Math.min(2, selected.reduce((sum, r) => sum + overlap(tokens(t.keywords.join(' ')), r.element.normalizedText), 0)) }))
    .sort((a, b) => b.score - a.score || a.template.id.localeCompare(b.template.id))
  const byId = (id: string) => allCandidates.find(candidate => candidate.template.id === id)
  const productPriorityIds: Record<string, string[]> = {
    EXPOSITION: ['science-content', 'oral-mastery', 'organization', 'communication', 'oral-resources', 'oral-responses'],
    ORAL_PRESENTATION: ['language-content', 'oral-mastery', 'organization', 'communication', 'oral-resources', 'oral-responses'],
    DEBATE: ['science-content', 'debate-evidence', 'debate-response', 'communication', 'debate-response', 'oral-mastery'],
    REPORT: ['science-procedure', 'science-data', 'science-interpretation', 'science-conclusion', 'organization', 'language-correctness'],
    CONCEPT_MAP: ['science-content', 'concept-hierarchy', 'concept-relations', 'organization'],
    PROJECT: ['project-product', 'project-process', 'organization', 'communication'],
  }
  const priorityIds = area === 'science' && activity.family === 'ORAL' && dimensions.length
    ? dimensions.length > 1 ? ['science-content', 'science-content', 'science-accuracy', 'organization', visualResources ? 'instructions' : 'communication']
      : ['science-content', 'science-accuracy', 'communication', 'organization', 'instructions']
    : area === 'science' && activity.family === 'OBSERVATIONAL' && dimensions.length > 1
      ? ['science-content', 'science-content', 'science-data', 'science-accuracy', 'science-interpretation'] : productPriorityIds[activity.id] ?? []
  const prioritized = priorityIds.map(byId).filter((candidate): candidate is (typeof allCandidates)[number] => Boolean(candidate))
  const requestedCount = dimensions.length ? count : Math.min(8, Math.max(count, prioritized.length))
  const candidates = [...prioritized, ...allCandidates.filter(candidate => !prioritized.includes(candidate))]
    .slice(0, input.includeAdditionalCandidates ? INSTRUMENT_MAX_CRITERIA : requestedCount)
  const candidateWeights = candidates.map((candidate, index) => priorityIds.length && dimensions.length > 1 && candidates.length === 5
    ? [5, 4, 4, 4, 3][index] : candidate.template.weight)
  const rule = catalog.recommendationRules.filter(r => (!r.families.length || r.families.includes(activity.family)) && (!r.band || r.band === band)
    && (!r.maxScore || input.maxScore <= r.maxScore) && (!r.evidence || r.evidence.every(e => activity.evidence.includes(e))))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0]
  const levelCount = input.levelCount ?? 4
  const instrumentIntent = context?.level === 'SECONDARY' && (context.subjectCode === 'LEN'||commonSecondaryEnglish(context)) ? languageInstrumentIntent(input.description ?? '') : undefined
  const chosenInstrument = input.preferredInstrumentType ?? (optativeScience?optativeScienceSelections(optativeScience,input.description??'').suggestedInstrumentType:undefined) ?? (optativeMath?optativeMathSelections(optativeMath,input.description??'').suggestedInstrumentType:undefined) ?? (socialOptative?optativeSocialSelections(socialOptative).suggestedInstrumentType:undefined) ?? (optativeTask?optativeLanguageSelections(optativeTask).suggestedInstrumentType:undefined) ?? (fhrTask?commonFhrSelections(fhrTask).suggestedInstrumentType:undefined) ?? (physicalTask?commonPhysicalSelections(physicalTask).suggestedInstrumentType:undefined) ?? (artTask ? commonArtSelections(artTask).suggestedInstrumentType : undefined) ?? (socialTask?commonSocialSelections(socialTask,input.description??'').suggestedInstrumentType:undefined) ?? (commonScience?commonScienceSelections(commonScience,input.description??'').suggestedInstrumentType:undefined) ?? (mathTask?commonMathSelections(mathTask,input.description??'').suggestedInstrumentType:undefined) ?? (frenchTask?commonFrenchSelections(frenchTask,input.description??'').suggestedInstrumentType:undefined) ?? instrumentIntent ?? (englishTask?commonEnglishSelections(englishTask,input.description??'').suggestedInstrumentType:rule.instrument)
  const scores = distributeScoreUnits(Math.round(input.maxScore * 100), chosenInstrument === 'lista-ponderada'
    ? distributeScoreUnits(10000, candidateWeights) : candidateWeights)
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
    const teamOrganization = (input.organizationMode ?? input.participationMode) === 'GROUP'
    const debateResponseIndex = criterion.id === 'debate-response' ? candidates.slice(0, index).filter(candidate => candidate.template.id === 'debate-response').length : -1
    const debateContext = activity.id !== 'DEBATE' ? null
      : criterion.id === 'debate-evidence' ? 'Sustenta su postura con razones, ejemplos o evidencias pertinentes al tema definido por el docente.'
        : criterion.id === 'debate-response' && debateResponseIndex === 0 ? `Escucha el argumento de ${teamOrganization ? 'otro equipo' : 'otra persona'}, lo contrasta y responde de manera pertinente.`
          : criterion.id === 'debate-response' ? 'Escucha con respeto, espera su turno y se relaciona con las ideas expresadas por los demás.'
            : criterion.id === 'communication' ? 'Expresa sus intervenciones con claridad, vocabulario adecuado y una idea comprensible.'
              : criterion.id === 'oral-mastery' ? `Realiza aportes ${input.participationMode === 'INDIVIDUAL' ? 'individuales' : 'del equipo'} pertinentes al debate sobre ${topic}${teamOrganization && input.participationMode === 'INDIVIDUAL' ? ', aunque el trabajo se organice en equipos' : ''}.` : null
    const contextual = debateContext ?? dimension?.observable ?? (criterion.id === 'instructions' && visualResources && activity.family === 'ORAL' ? `Utiliza imágenes o recursos visuales para apoyar la explicación de ${topic}.` : null) ?? (criterion.id === 'science-accuracy' && /vocabulario cientifico/.test(text) ? `Emplea vocabulario científico adecuado al explicar ${topic}.` : null) ?? (criterion.id === 'organization' && activity.family === 'ORAL' ? `Organiza y comunica las ideas sobre ${topic} en una secuencia comprensible.` : null) ?? (criterion.id === 'organization' && area === 'science' && ['PROJECT_BASED', 'WRITTEN'].includes(activity.family) && topic !== input.activityTitle ? `Organiza las ideas y evidencias sobre ${topic} en una secuencia comprensible.` : null) ?? (topic !== input.activityTitle && criterion.id === 'art-intention' ? `Expresa ${topic} mediante decisiones visuales reconocibles.` : null) ?? (topic !== input.activityTitle && criterion.id === 'art-composition' && /pintura/.test(text) ? `Organiza los elementos de la pintura para comunicar ${topic}.` : null) ?? (topic !== input.activityTitle && criterion.id === 'social-context' ? `Ubica ${topic} en tiempo, lugar y contexto.` : null) ?? (topic !== input.activityTitle && criterion.id === 'social-causes' && /causas|consecuencias/.test(text) ? `Explica causas y consecuencias de ${topic} con evidencia.` : null)
    const narrativeStructure=criterion.id==='language-structure'&&activity.id==='WRITTEN_PRODUCTION'&&/\bcuento\b/.test(normalize(input.description||input.activityTitle))
    const description = narrativeStructure ? 'Organiza los acontecimientos del cuento en una secuencia que permite seguir su conflicto y resolución.' : contextual ?? (literal ? literal.element.text : content ? `${observable} Relacionado con ${content.element.text}.` : prudentObservable(criterion.id,observable,topic))
    const sourceType = contextual || content ? 'CONTEXTUALIZED' : literal ? 'CURRICULUM_DERIVED' : 'ACTIVITY_TEMPLATE'
    const sourceReferences = !contextual && reference ? selectedRefs.filter(r => r.elementId === reference.elementId) : []
    const patterns = band === 'PRIMARY_FIRST' ? catalog.descriptorPatterns.simple : catalog.descriptorPatterns.regular
    const patternIndexes = levelCount === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4]
    const debateTitle = activity.id !== 'DEBATE' ? null
      : criterion.id === 'debate-evidence' ? 'Argumentación con razones y evidencias'
        : criterion.id === 'debate-response' && debateResponseIndex === 0 ? `Respuesta a los argumentos ${teamOrganization ? 'del otro equipo' : 'de otra persona'}`
          : criterion.id === 'debate-response' ? 'Escucha y respeto de los turnos'
            : criterion.id === 'communication' ? 'Claridad de las intervenciones'
              : criterion.id === 'oral-mastery' ? input.participationMode === 'INDIVIDUAL' ? 'Aporte individual' : 'Aporte del equipo' : null
    const title = debateTitle ?? dimension?.title ?? (criterion.id === 'instructions' && visualResources && activity.family === 'ORAL' ? 'Uso de recursos de apoyo' : topic && topic !== input.activityTitle && criterion.id === 'science-accuracy' ? `Precisión científica sobre ${topic}` : criterion.id === 'organization' && activity.family === 'ORAL' ? 'Organización y comunicación de la exposición' : criterion.id === 'organization' && area === 'science' && ['PROJECT_BASED', 'WRITTEN'].includes(activity.family) ? `Organización de la evidencia sobre ${topic}` : criterion.id === 'art-intention' && topic !== input.activityTitle ? `Intención expresiva sobre ${topic}` : criterion.id === 'art-composition' && /pintura/.test(text) ? 'Composición de la pintura' : criterion.id === 'social-context' && topic !== input.activityTitle ? `Contexto de ${topic}` : criterion.id === 'social-causes' && /causas|consecuencias/.test(text) ? `Causas y consecuencias de ${topic}` : area === 'language' && criterion.id === 'language-structure' && /cuento/.test(text) ? 'Estructura narrativa del cuento' : criterion.title)
    const texts = contextual ? contextualDescriptors(description, patternIndexes, title, criterion.id) : patternIndexes.map(i => `${observable} ${patterns[i]}`)
    return { id: `proposal:${catalog.version}:${scope?.id ?? 'fallback'}:${criterion.id}:${index}`, templateId: criterion.id,
      title, description, maxScore: scores[index] / 100, maxScoreUnits: scores[index], relativeWeight: candidateWeights[index], sourceType, sourceReferences,
      descriptors: levels.map((level, i) => ({ levelId: level.id, text: texts[i], scoreUnits: Math.round(scores[index] * level.proportion) })) }
  })
  const spanishLanguage = area === 'language' && context?.subjectCode.toUpperCase() === 'LEN'
  const firstGenre = context?.level === 'SECONDARY' && context.grade === 1 && spanishLanguage ? firstSecondaryLanguageGenre(input.activityTitle, input.description ?? '') : null
  const newsModule = !contextualTopic && context?.level === 'SECONDARY' && (context.grade === 1 && firstGenre === 'NEWS' && isFirstGradeNewsActivity(activity.id) || context.grade === 2
    && ['NEWSCAST', 'NEWS_ANALYSIS', 'NEWS_COMPARISON', 'NEWS_WRITING', 'REPORT', 'DEBATE', 'RESEARCH'].includes(activity.id))
    && spanishLanguage && /\bnotici(?:a|as|ero)\b/.test(normalize(`${input.activityTitle} ${withoutResources(input.description ?? '')}`))
  const touristGuideModule = firstGenre === 'TOURIST_GUIDE' && isFirstGradeGuideActivity(activity.id)
  const posterModule = firstGenre === 'POSTER' && isFirstGradePosterActivity(activity.id)
  const readingReportModule = firstGenre === 'READING_REPORT'
  const detectiveModule = firstGenre === 'DETECTIVE_STORY' && isFirstGradeDetectiveActivity(activity.id)
  const calligramModule = firstGenre === 'CALLIGRAM' && isFirstGradeCalligramActivity(activity.id)
  const novelCriteria=contextualTopic?[]:secondaryNovelAnalysisCriteria(input.activityTitle,input.description??'',context,activity.id,input.includeAdditionalCandidates)
  const selectedAuthored: AuthoredCriterion[] = optativeScience ? optativeScienceCriteria(optativeScience) : optativeMath ? optativeMathCriteria(optativeMath) : socialOptative ? optativeSocialCriteria(socialOptative) : optativeTask ? optativeLanguageCriteria(optativeTask) : fhrTask ? commonFhrCriteria(fhrTask) : physicalTask ? commonPhysicalCriteria(physicalTask) : artTask ? commonArtCriteria(artTask) : socialTask ? commonSocialCriteria(socialTask) : commonScience ? commonScienceCriteria(commonScience) : mathTask ? commonMathCriteria(mathTask) : frenchTask ? commonFrenchCriteria(frenchTask) : englishTask ? commonEnglishCriteria(englishTask) : novelCriteria.length ? novelCriteria : mathTopic ? secondaryMathCriteria(mathTopic, input.description ?? '')
    : scienceTopic ? secondaryScienceCriteria(scienceTopic, input.description ?? '', chosenInstrument)
    : contextualTopic ? secondaryTopicCriteria(contextualTopic, activity.id, input.description ?? '',input.includeAdditionalCandidates)
    : newsModule ? context?.grade === 2 ? secondGradeNewsCriteria(activity.id, input.description ?? '') : newsCriteria(activity.id, input.description ?? '')
    : touristGuideModule ? touristGuideCriteria(activity.id, input.description ?? '')
      : posterModule ? posterCriteria(activity.id, input.activityTitle, input.description ?? '')
        : readingReportModule ? readingReportCriteria(activity.id, input.description ?? '')
          : detectiveModule ? detectiveStoryCriteria(activity.id, input.description ?? '')
            : calligramModule ? calligramCriteria(activity.id, input.description ?? '') : band==='SECONDARY'&&(area==='language'||area==='math'&&activity.id==='EXERCISE_SET'||resolveEvaluationTask('',input.description??'').product) ? actionContentCriteria(activity.id,input.description??'') : []
  const baseAuthored:AuthoredCriterion[]=selectedAuthored.length?selectedAuthored:deliveryConditions(input.description??'').length?genericCriteria.map(c=>({templateId:c.templateId,title:c.title,observable:c.description,weight:c.relativeWeight??3,progressionLevels:(c.progressionLevels??catalog.descriptorPatterns.regular.map(pattern=>`${c.description} ${pattern}`)) as [string,string,string,string,string]})):[]
  const eligibleAuthored = withDeliveryCriteria(baseAuthored.filter(item=>!mathTopic || input.includeAdditionalCandidates || !item.templateId.endsWith('-verification')),input.description??'')
  const authored: AuthoredCriterion[] = eligibleAuthored.flatMap<AuthoredCriterion>(item => item.progressionLevels
    ? formatAuthoredCriteria([{ ...item, progressionLevels: item.progressionLevels }], chosenInstrument) : [item])
  if (!input.includeAdditionalCandidates) assertInstrumentCapacity(authored.length)
  const authoredWeights = authored.map(item => item.weight)
  const authoredScores = distributeScoreUnits(Math.round(input.maxScore * 100), chosenInstrument === 'lista-ponderada'
    ? distributeScoreUnits(10000, authoredWeights) : authoredWeights)
  const authoredPatternIndexes = levelCount === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4]
  const authoredCriteria: RecommendationCriterion[] = authored.map((item, index) => ({
    id: `proposal:${catalog.version}:${scope?.id ?? 'fallback'}:${item.templateId}:${index}`,
    templateId: item.templateId, title: item.title, description: item.observable,
    maxScore: authoredScores[index] / 100, maxScoreUnits: authoredScores[index],
    sourceType: 'CONTEXTUALIZED', sourceReferences: [],
    ...(item.progressionLevels ? {progressionLevels:[...item.progressionLevels]} : {}),
    relativeWeight: item.weight,
    descriptors: levels.map((level, levelIndex) => ({ levelId: level.id,
      text: item.progressionLevels ? item.progressionLevels[(levelCount === 4 ? [0, 1, 2, 4] : [0, 1, 2, 3, 4])[levelIndex]]
        : item.progression && levelCount === 4 ? levelIndex === 0 ? item.observable : item.progression[levelIndex - 1]
        : contextualDescriptors(item.observable, authoredPatternIndexes, item.title, item.templateId)[levelIndex],
      scoreUnits: Math.round(authoredScores[index] * level.proportion) })),
  }))
  // Contextual providers are never padded with unrelated generic criteria.
  const criteria = authoredCriteria.length ? authoredCriteria : genericCriteria
  const totalScoreUnits = criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)
  const result: InstrumentRecommendation = { kind: 'RECOMMENDATION', catalogVersion: catalog.version, instrumentType: chosenInstrument, confidence,
    activityType: activity.id, evidenceTypes: [...new Set([...activity.evidence, ...criteria.filter(c => catalog.criterionTemplates.find(t => t.id === c.templateId)?.attitude).map(() => 'ATTITUDE' as const)])],
    participationMode: input.participationMode, curriculumVersionId: scope?.versionId ?? null, curriculumScopeId: scope?.id ?? null,
    selectedCurriculumElements: selectedRefs, criteria, levels, totalScore: input.maxScore, totalScoreUnits, scoreUnit: 0.01,
    internalTrace: { mappingStatus, reasons: [...(contextualTopic ? [`module=lengua-secundaria-${contextualTopic.grade}-${contextualTopic.id}`] : []), `band=${band}`, `discipline=${area}`, ...(newsModule ? [`module=lengua-secundaria-${context?.grade}-la-noticia`] : []), ...(touristGuideModule ? ['module=lengua-secundaria-1-guia-turistica'] : []), ...(posterModule ? ['module=lengua-secundaria-1-el-afiche'] : []), ...(readingReportModule ? ['module=lengua-secundaria-1-informe-de-lectura'] : []), ...(detectiveModule ? ['module=lengua-secundaria-1-cuento-policiaco'] : []), ...(calligramModule ? ['module=lengua-secundaria-1-caligrama'] : []), 'No se consultan otros ámbitos; coincidencia temática no equivale a aprobación curricular.'],
      ruleId: input.preferredInstrumentType ? `${rule.id}:TEACHER_OVERRIDE` : mathTask ? `MATH_PURPOSE_${chosenInstrument}` : instrumentIntent ? `LANGUAGE_TASK_${instrumentIntent}` : englishTask?'ENGLISH_COMMUNICATIVE_PURPOSE':rule.id, activityTypeOrigin: explicit ? 'EXPLICIT' : detected.id !== 'OTHER' ? 'DETECTED' : 'DEFAULT',
      ranking: ranking.slice(0, 24).map(r => ({ elementId: r.element.elementId, score: r.score, topicCoverage: r.topicCoverage, reasons: r.reasons })),
      curriculumStatus, lowCurriculumConfidence: confidence === 'LOW', consideredTypes: Object.keys(typeWeights) } }
  if (scienceTopic) result.internalTrace.reasons.push(`module=science-${scienceTopic}-${context?.grade}`)
  if(optativeScience)result.internalTrace.reasons.push(`module=${optativeScience.module.id}`,'coverage=SOURCE_BACKED_OPTATIVE_SCIENCE')
  if(optativeMath)result.internalTrace.reasons.push(`module=${optativeMath.module.id}`,'coverage=SOURCE_BACKED_OPTATIVE_MATH')
  if(socialOptative)result.internalTrace.reasons.push(`module=${socialOptative.module.id}`,'coverage=SOURCE_BACKED_OPTATIVE_SOCIAL')
  if(optativeTask)result.internalTrace.reasons.push(`module=${optativeTask.module.id}`,'coverage=SOURCE_BACKED_OPTATIVE_LANGUAGE')
  if(fhrTask)result.internalTrace.reasons.push(`module=formacion-humana-religiosa-comun-${fhrTask.grade}`,'coverage=OBSERVABLE_INTERPRETATION_NOT_PRIVATE_FAITH')
  if(physicalTask)result.internalTrace.reasons.push(`module=educacion-fisica-comun-${physicalTask.grade}`,'coverage=DEFINED_ADAPTED_MOTOR_ACTIONS')
  if (artTask) result.internalTrace.reasons.push(`module=educacion-artistica-comun-${artTask.grade}`, 'coverage=DEFINED_ARTISTIC_ACTIONS')
  if(socialTask)result.internalTrace.reasons.push(`module=ciencias-sociales-comun-${socialTask.grade}`,'coverage=DEFINED_SOCIAL_ACTIONS')
  if(commonScience)result.internalTrace.reasons.push(`module=ciencias-naturaleza-comun-${commonScience.grade}`,`topics=${[...new Set(commonScience.actions.flatMap(a=>a.topics.map(t=>t.id)))].join(',')}`,'coverage=DEFINED_SCIENTIFIC_ACTIONS')
  if(frenchTask)result.internalTrace.reasons.push(`module=frances-comunicacion-${frenchTask.grade}`, 'coverage=DEFINED_FRENCH_COMMON_PATTERNS')
  if(mathTask)result.internalTrace.reasons.push(`module=matematica-comun-${mathTask.grade}`,`topics=${[...new Set(mathTask.actions.flatMap(action=>action.topics.map(topic=>topic.id)))].join(',')}`,mathTask.actions.every(action=>action.topics.every(topic=>topic.id==='arithmetic'))?'coverage=ACTION_ONLY':'coverage=REQUESTED_MATH_CONTENT')
  if(englishTask)result.internalTrace.reasons.push(optativeEnglishTask?`module=optativa-hlm-ingles-${englishTaskGrade(englishTask)}`:`module=ingles-comunicacion-${englishTaskGrade(englishTask)}`,`mode=${englishTask.mode}`,`functions=${englishTask.functions.join(',')}`,optativeEnglishTask?(englishTaskGrade(englishTask)===4?'coverage=DEFINED_OPTATIVE_HLM_INFORMATION_FAMILIES':englishTaskGrade(englishTask)===5?'coverage=DEFINED_OPTATIVE_HLM_BASIC_LITERATURE_FAMILIES':'coverage=DEFINED_OPTATIVE_HLM_CRITICAL_INFORMATION_FAMILIES'):englishTaskGrade(englishTask)===1?'coverage=DEFINED_COMMON_FIRST_GRADE_FAMILIES':englishTaskGrade(englishTask)===2?'coverage=DEFINED_COMMON_SECOND_GRADE_PROVIDERS':englishTaskGrade(englishTask)===3?'coverage=DEFINED_COMMON_THIRD_GRADE_PROVIDERS':englishTaskGrade(englishTask)===4?'coverage=DEFINED_COMMON_FOURTH_GRADE_PROVIDERS':englishTaskGrade(englishTask)===5?'coverage=DEFINED_COMMON_FIFTH_GRADE_PROVIDERS':'coverage=DEFINED_COMMON_SIXTH_GRADE_PROVIDERS')
  if(novelCriteria.length) result.internalTrace.reasons.push('module=novela-analisis-fragmento-5','coverage=TASK_DERIVED_PARTIAL',`task=${JSON.stringify(resolveEvaluationTask(input.activityTitle,input.description??''))}`)
  if(authored.some(row=>row.templateId.startsWith('task-'))) result.internalTrace.reasons.push('coverage=ACTION_ONLY')
  if (mathTopic) result.internalTrace.reasons.push(`module=math-${mathTopic}-${context?.grade}`,
    ...(mathTopic === 'trigonometry' ? ['La consigna de 6.º retoma razones trigonométricas documentadas en 5.º; no se atribuye respaldo específico de 6.º.'] : []))
  const formatted = optativeScience ? adaptOptativeScienceScale(result,input.description??'',optativeScience) : optativeMath ? adaptMathScale(result,input.description??'') : socialOptative ? adaptSocialScale(result) : optativeTask ? adaptOptativeLanguageScale(result) : fhrTask ? adaptFhrScale(result,fhrTask) : physicalTask ? adaptPhysicalScale(result,physicalTask) : artTask ? adaptArtScale(result, artTask) : socialTask ? adaptSocialScale(result) : commonScience ? adaptScienceScale(result,input.description??'') : mathTask ? adaptMathScale(result,input.description??'') : context?.level==='SECONDARY' && area==='language' && authoredCriteria.length && !authored.some(row=>row.templateId.startsWith('task-'))
    ? adaptLanguageScale(result,input.description??'',frenchTask?'fr':undefined) : result
  assertValidRecommendation(formatted, Boolean(input.includeAdditionalCandidates))
  return formatted
}

export function assertValidRecommendation(result: InstrumentRecommendation, candidatePool = false) {
  // A pool supplies one row; the assembled instrument retains its own capacity validation.
  if (!result.criteria.length || (!candidatePool && result.criteria.length > INSTRUMENT_MAX_CRITERIA)) throw new Error('Recomendación inválida: se requieren entre 1 y 20 criterios.')
  if (!Number.isInteger(result.totalScoreUnits) || result.totalScoreUnits <= 0 || !Number.isFinite(result.totalScore)) throw new Error('Recomendación inválida: puntuación total no válida.')
  const scoreTotal = result.criteria.reduce((total, criterion) => total + criterion.maxScoreUnits, 0)
  if (scoreTotal !== result.totalScoreUnits) throw new Error('Recomendación inválida: los criterios no suman la puntuación total.')
  for (const criterion of result.criteria) {
    if (criterion.relativeWeight !== undefined && (!Number.isFinite(criterion.relativeWeight) || criterion.relativeWeight <= 0)) throw new Error('Peso relativo inválido.')
    if (criterion.progressionLevels && (criterion.progressionLevels.length !== 5 || criterion.progressionLevels.some(value=>typeof value !== 'string' || !value.trim()))) throw new Error('Progresión evaluativa incompleta.')
    if (!criterion.title.trim() || !criterion.description.trim()) throw new Error('Recomendación inválida: criterio vacío.')
    if (!Number.isInteger(criterion.maxScoreUnits) || criterion.maxScoreUnits < 0 || !Number.isFinite(criterion.maxScore)) throw new Error('Recomendación inválida: puntuación de criterio no válida.')
    if ((result.instrumentType === 'rubrica' || result.instrumentType === 'escala') && (criterion.descriptors.length !== result.levels.length || criterion.descriptors.some(item => !item.text.trim()))) throw new Error('Recomendación inválida: descriptor de desempeño vacío o incompleto.')
  }
}
