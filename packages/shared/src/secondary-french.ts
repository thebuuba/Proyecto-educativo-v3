import type { InstrumentAcademicContext } from './secondary-science'
import type { ContextualTopicCriterion } from './secondary-topic-criteria'
import type { InstrumentType } from './instrument-recommendation'
import { languageInstrumentIntent } from './language-instrument-intent'
import {languageRoleExchangeCriterion,requestedRoleExchange} from './language-role-exchange'
import { frenchGradeOneFeatures, frenchGradeOneGrammar, frenchGradeOneStrategies, frenchPersonalFields, frenchRow } from './secondary-french-grade-1'
import { frenchGradeOneGenres, frenchGradeOneLexicon } from './secondary-french-grade-1-details'
import { frenchDeliveryCriteria } from './secondary-french-delivery'
import { frenchGradeTwoFeatures } from './secondary-french-grade-2'
import { frenchGradeThreeFeatures } from './secondary-french-grade-3'
import { frenchGradeFourFeatures } from './secondary-french-grade-4'
import { frenchGradeFiveFeatures } from './secondary-french-grade-5'
import { frenchGradeSixFeatures } from './secondary-french-grade-6'
import { frenchOral, frenchWritten, frenchReceptive, frenchRequirementText, normalizeFrenchTask, parseFrenchTask, type FrenchAction, type FrenchTask, type FrenchFeature } from './secondary-french-task'
export { frenchGradeOneModule } from './secondary-french-grade-1'
export { frenchGradeTwoModule } from './secondary-french-grade-2'
export { frenchGradeThreeModule } from './secondary-french-grade-3'
export { frenchGradeFourModule } from './secondary-french-grade-4'
export { frenchGradeFiveModule } from './secondary-french-grade-5'
export { frenchGradeSixModule } from './secondary-french-grade-6'

export function commonSecondaryFrench(context?: InstrumentAcademicContext | null) {
  if (context?.level !== 'SECONDARY' || ![1, 2, 3, 4, 5, 6].includes(context.grade) || context.optativeExitName) return false
  const code = context.subjectCode.trim().toUpperCase()
  return code === 'FRA' || (!code && /^(?:(?:lenguas? extranjeras? )?frances|francais)$/.test(normalizeFrenchTask(context.subjectName ?? '')))
}
const features = [...frenchGradeOneFeatures, ...frenchGradeOneGrammar, ...frenchGradeOneStrategies, ...frenchGradeOneGenres, ...frenchGradeOneLexicon]
const gradeFeatures = (grade: number) => grade === 6 ? frenchGradeSixFeatures : grade === 5 ? frenchGradeFiveFeatures : grade === 4 ? frenchGradeFourFeatures : grade === 3 ? frenchGradeThreeFeatures : grade === 2 ? frenchGradeTwoFeatures : features
export function resolveCommonFrenchTask(title: string, description: string, context?: InstrumentAcademicContext | null): FrenchTask | null {
  return commonSecondaryFrench(context) ? parseFrenchTask(title, description, context!.grade, gradeFeatures(context!.grade)) : null
}

function actionCriteria(action: FrenchAction, features: FrenchFeature[]): ContextualTopicCriterion[] {
  if (action.alternatives) {
    const branches = action.alternatives.map(a => actionCriteria(a, features))
    // One chosen route is sufficient; never require the union of the alternative products.
    return [frenchRow('alternative', 'Cumplimiento de una alternativa autorizada', [0, 1, 2, 3, 4].map(level =>
      `En la alternativa elegida: ${branches.map(rows => rows.map(row => row.progressionLevels[level]).join(' ')).join(' O BIEN: ')}`,
    ) as ContextualTopicCriterion['progressionLevels'])]
  }
  const rows = action.features.map(id => features.find(feature => feature.id === id)!.criterion(action))
  if (frenchReceptive(action.mode)) return rows
  if (action.mode.includes('interaction') && action.features.includes('personal') && /\b(?:pregunt\w*|demande\w*|pose\w* (?:des|les) questions)\b/.test(action.text)) {
    const fields = frenchPersonalFields(action.text)
    const questionLevels = (target: string): ContextualTopicCriterion['progressionLevels'] => [
      `Formula en francés preguntas comprensibles para obtener ${target} del interlocutor.`,
      `Las preguntas permiten obtener ${target}; una formulación necesita aclaración.`,
      `Solo parte de las preguntas permite obtener ${target}; las demás quedan incompletas o ambiguas.`,
      `Las preguntas solicitan otros datos, en lugar de obtener ${target}.`,
      `No formula preguntas reconocibles para obtener ${target}.`,
    ]
    const labels=fields.map(([,label])=>label)
    const target = labels.length > 1 ? `${labels.slice(0,-1).join(', ')} y ${labels.at(-1)}` : labels[0] ?? 'los datos solicitados'
    const question = frenchRow('questions', 'Formulación de preguntas', questionLevels(target), 3)
    if (fields.length > 1 && !/\b(?:o|ou)\b/.test(action.text)) question.checklistParts = fields.map(([key, label]) => ({ key, observable: questionLevels(label)[0], progressionLevels: questionLevels(label) }))
    rows.push(question)
  }
  if (action.mode.includes('interaction') && requestedRoleExchange(action.text)) rows.push(languageRoleExchangeCriterion('fra-1'))
  if (action.mode.includes('interaction')) rows.push(frenchRow('interaction', 'Vinculación de los turnos', [
    'Relaciona en francés su intervención con la petición o respuesta del interlocutor y permite que el intercambio continúe.',
    'Los turnos mantienen el sentido del intercambio; una respuesta necesita aclaración.',
    'Aporta intervenciones pertinentes aisladas, pero varias no responden al turno recibido.',
    'Repite su intervención sin relacionarla con lo que comunica el interlocutor.',
    'No se reconoce una respuesta que permita sostener el intercambio solicitado.',
  ], 3))
  if (frenchOral(action.mode)) rows.push(frenchRow('oral', 'Comprensibilidad del mensaje oral', [
    'Pronuncia y agrupa las expresiones francesas de modo que el mensaje solicitado resulta comprensible, admitiendo pausas y reformulaciones.',
    'Se comprende el mensaje principal; una expresión necesita repetición o aclaración.',
    'Se comprenden palabras o frases aisladas, pero su enlace dificulta seguir el mensaje.',
    'La pronunciación y las pausas impiden reconocer la mayor parte de las expresiones del mensaje.',
    'No aporta un mensaje oral reconocible en francés.',
  ], 3))
  if (frenchWritten(action.mode)) rows.push(frenchRow('written', 'Comprensibilidad del mensaje escrito', [
    'Organiza las palabras y frases francesas de modo que se reconoce el mensaje solicitado; la escritura permite distinguir las expresiones empleadas.',
    'Se reconoce el sentido principal del escrito; una expresión necesita revisión.',
    'Se reconocen palabras o frases aisladas, pero no se relacionan con claridad para formar el mensaje.',
    'La organización o la escritura de las expresiones altera el sentido del mensaje.',
    'No aporta un mensaje escrito reconocible en francés.',
  ], 3))
  return rows
}

export function commonFrenchCriteria(task: FrenchTask): ContextualTopicCriterion[] {
  const rows: ContextualTopicCriterion[] = []
  for (const [index, action] of task.actions.entries()) for (const raw of actionCriteria(action, gradeFeatures(task.grade))) {
    const criterion = { ...raw, templateId: raw.templateId.replace(/^fra-\d+-/, `fra-${task.grade}-`) }
    if (rows.some(row => row.templateId === criterion.templateId && row.observable === criterion.observable)) continue
    rows.push(rows.some(row => row.templateId === criterion.templateId) ? { ...criterion, templateId: `${criterion.templateId}:${action.mode}:${index}` } : criterion)
  }
  return [...rows, ...frenchDeliveryCriteria(task.actions.map(action => action.text).join('. '))]
}

export function frenchInstrumentIntent(description: string): InstrumentType | undefined {
  const text = frenchRequirementText(description)
  const spanish = languageInstrumentIntent(text)
  if (spanish) return spanish
  if (/\b(?:ponderation|ponderer|poids par composante)\b/.test(text)) return 'lista-ponderada'
  if (/\b(?:evaluer|observer|noter|evaluez|observez)\b.*\b(?:frequence|regularite|degre)\b/.test(text)) return 'escala'
  if (/\b(?:verifier|verifiez|cocher|cochez)\b.*\b(?:presence|oui ou non)\b/.test(text)) return 'lista-cotejo'
  if (/\b(?:evaluer|evaluez)\b.*\b(?:qualite|plusieurs dimensions)\b/.test(text)) return 'rubrica'
  return undefined
}
export function commonFrenchSelections(task: FrenchTask, description: string) {
  const discreteReception = task.actions.every(action => frenchReceptive(action.mode) && !/\b(?:justifi\w*|expli\w*|infer\w*)\b/.test(action.text))
  return { suggestedEvaluationTechnique: task.technique, suggestedInstrumentType: frenchInstrumentIntent(description) ?? (discreteReception ? 'lista-cotejo' : 'rubrica') as InstrumentType }
}
