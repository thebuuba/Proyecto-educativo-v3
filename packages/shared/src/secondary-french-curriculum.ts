import type { ContextualTopicCriterion } from './secondary-topic-criteria'
import { frenchReceptive, frenchSource, type FrenchFeature } from './secondary-french-task'

export function frenchCurriculumRow(grade: number, id: string, title: string, levels: ContextualTopicCriterion['progressionLevels'], weight = 4): ContextualTopicCriterion {
  return { templateId: `fra-${grade}-${id}`, title, observable: levels[0], progressionLevels: levels, weight }
}
export type FrenchGrammarEntry = [id: string, words: string, title: string, evidence: string, partial: string]
export function frenchGrammar(grade: number, entries: FrenchGrammarEntry[]): FrenchFeature[] {
  return entries.map(([id, words, title, evidence, partial]) => ({ id: `grammar-${id}`, match: new RegExp(`\\b(?:${words})\\b`), criterion: a => frenchCurriculumRow(grade, `grammar-${id}`, title, [
    `${frenchReceptive(a.mode) ? `A partir del ${frenchSource(a.mode)} en francés,` : 'En su mensaje en francés,'} ${evidence}.`,
    'La relación lingüística solicitada es reconocible; una forma necesita ajuste sin cambiar el sentido.',
    partial,
    'Las formas elegidas cambian la relación solicitada y producen otro sentido.',
    'No aporta evidencia que permita reconocer la relación lingüística solicitada.',
  ], 3) }))
}
export function frenchLexicon(grade: number, entries: Array<[string, string, string]>): FrenchFeature[] {
  return entries.map(([id, words, label]) => ({ id: `lexicon-${id}`, match: new RegExp(`\\b(?:vocabulario|lexico|vocabulaire|lexique|terminos|mots)\\b[^.;]{0,55}\\b(?:${words})\\b`), criterion: a => frenchCurriculumRow(grade, `lexicon-${id}`, `Léxico de ${label}`, [
    frenchReceptive(a.mode) ? `Relaciona las palabras francesas de ${label} con sus referentes en el ${frenchSource(a.mode)}.` : `Emplea las palabras francesas de ${label} con un significado que permite reconocer los referentes solicitados.`,
    `Se reconocen los referentes de ${label}; una elección léxica necesita precisión.`,
    `Relaciona algunas palabras de ${label} con sus referentes, pero confunde otras.`,
    `Las palabras seleccionadas designan otros referentes y cambian la información solicitada sobre ${label}.`,
    `No aporta vocabulario reconocible sobre ${label}.`,
  ], 3) }))
}
