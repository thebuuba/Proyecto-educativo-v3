import {normalizedTask} from './evaluation-task-text'
import type {InstrumentType} from './instrument-recommendation'

/** Explicit evaluation purpose overrides the genre default, never the teacher's selection. */
export function languageInstrumentIntent(description: string): InstrumentType | undefined {
  const task = normalizedTask(description)
  if (/\b(?:ponder\w*|distribu\w* pesos|asign\w* pesos|porcentajes? por componente)\b/.test(task)) return 'lista-ponderada'
  if (/\b(?:valor\w*|observ\w*|registr\w*|evalu\w*)\b.*\b(?:regularidad|frecuencia|grados de|niveles de logro)\b/.test(task)) return 'escala'
  if (/\b(?:verific\w*|comprob\w*|registr\w*|marc\w*)\b.*\b(?:presencia|ausencia|si o no|si no|cumple|incluye|contiene)\b/.test(task)) return 'lista-cotejo'
  if (/\b(?:valor\w*|evalu\w*|analiz\w*)\b.*\b(?:calidad|profundidad|coherencia y|varias dimensiones)\b/.test(task)) return 'rubrica'
  return undefined
}
