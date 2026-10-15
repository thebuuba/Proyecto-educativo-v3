import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import { evaluationCatalogForVersion } from './catalog-current'
import grade2 from '../../../../../data/evaluation-instruments/french-grade-2-contracts.json'
import grade3 from '../../../../../data/evaluation-instruments/french-grade-3-contracts.json'

const grades = [{ grade: 2, fixtures: grade2, prior: 'evaluation-2026.70' }, { grade: 3, fixtures: grade3, prior: 'evaluation-2026.71' }]
const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
for (const { grade, fixtures, prior } of grades) describe(`Francés común ${grade}.º: contenido y regresiones`, () => {
  const context = { level: 'SECONDARY' as const, grade, cycle: grade <= 3 ? 1 : 2, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
  for (const f of fixtures) for (const format of formats) for (const total of [20, 17.35]) it(`${f.id}: ${format}, ${total}`, () => {
    const input = { activityTitle: 'Actividad', description: f.description, preferredInstrumentType: format, maxScore: total, participationMode: 'INDIVIDUAL' as const }
    const p = recommend(input, context, null, [], 'UNMAPPED', null)
    expect(p.activityType).toBe(f.activity)
    const ids = p.criteria.map(c => c.templateId), prefix = `fra-${grade}-`
    for (const id of f.contains) expect(ids.some(value => value === prefix + id || value.startsWith(prefix + id + ':')), ids.join(',')).toBe(true)
    for (const id of f.excludes) expect(ids.some(value => value === prefix + id || value.startsWith(prefix + id + ':'))).toBe(false)
    expect(ids.every(id => id.startsWith(prefix))).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
    expect(p.totalScoreUnits).toBe(Math.round(total * 100))
    expect(p.criteria.reduce((sum, c) => sum + c.maxScoreUnits, 0)).toBe(p.totalScoreUnits)
    expect(p.criteria.every(c => c.progressionLevels?.length === 5)).toBe(true)
    expect(p.criteria).toEqual(recommend({ ...input, activityTitle: 'Entrevista de trabajo en inglés' }, context, null, [], 'UNMAPPED', null).criteria)
  })
  it('respeta la elección manual y no altera el release anterior', () => {
    const input = { activityTitle: 'Actividad', description: fixtures[0].description, maxScore: 20, participationMode: 'INDIVIDUAL' as const, preferredInstrumentType: 'lista-ponderada' as const, pedagogicalActivityType: 'PROJECT' }
    const p = recommend(input, context, null, [], 'UNMAPPED', null)
    expect(p.activityType).toBe('PROJECT'); expect(p.instrumentType).toBe('lista-ponderada')
    expect(recommend(input, context, null, [], 'UNMAPPED', null, evaluationCatalogForVersion(prior)!).criteria.some(c => c.templateId.startsWith(`fra-${grade}-`))).toBe(false)
    expect(recommend(input, { ...context, optativeExitName: 'Humanidades' }, null, [], 'UNMAPPED', null).criteria.some(c => c.templateId.startsWith(`fra-${grade}-`))).toBe(false)
  })
  if (grade === 2) for (const [description, id] of [
    ['Lisez les phrases françaises et identifiez les articles partitifs.', 'grammar-partitives'],
    ['Utiliza en francés la respuesta si para contradecir una pregunta negativa.', 'grammar-si'],
    ['Écrivez une routine avec les verbes pronominaux en français.', 'grammar-present'],
    ['Identifica en el texto francés los adverbios de frecuencia.', 'grammar-adverbs'],
    ['Identifiez les phrases interrogatives dans le texte français.', 'grammar-questions'],
    ['Escribe vocabulario de electrodomésticos en francés.', 'lexicon-home'],
    ['Escribe vocabulario de instrumentos musicales en francés.', 'lexicon-music'],
    ['Écrivez des mots de sports en français.', 'lexicon-sports'],
    ['Écrivez le vocabulaire des aliments en français.', 'lexicon-food'],
    ['Utiliza los artículos definidos en francés.', 'grammar-articles'],
    ["Identifiez la place de l'adjectif dans le texte français.", 'grammar-adjective-position'],
    ['Escribe vocabulario de estado civil en francés.', 'lexicon-civil-status'],
    ['Escribe vocabulario de direcciones en francés.', 'lexicon-addresses'],
    ['Escribe vocabulario de cualidades de personajes en francés.', 'lexicon-qualities'],
    ['Escribe vocabulario de actividades culturales en francés.', 'lexicon-arts'],
    ['Escribe vocabulario de juegos en francés.', 'lexicon-games'],
    ['Escribe vocabulario de quehaceres del hogar en francés.', 'lexicon-chores'],
    ['Escribe vocabulario de medios de comunicación en francés.', 'lexicon-communication'],
    ['Escribe vocabulario de nacionalidades en francés.', 'lexicon-nationalities'],
    ['Escribe en francés las coincidencias y discrepancias entre tus gustos y los de un compañero.', 'coincidence'],
  ]) it(`contenido específico: ${id}`, () => {
    const p = recommend({ activityTitle: 'Actividad', description, maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(p.criteria.some(c => c.templateId === `fra-${grade}-${id}`)).toBe(true)
  })
  if (grade === 3) for (const [description, id] of [
    ['Indiquez où se trouve la bibliothèque en français.', 'location'],
    ['Utiliza en francés las tres formas de interrogación.', 'grammar-questions'],
    ['Escribe oraciones exclamativas en francés.', 'grammar-exclamation'],
    ['Identifica en el texto francés los artículos contractos.', 'grammar-contracted'],
    ['Utiliza en francés los verbos impersonales solicitados.', 'grammar-impersonal'],
    ['Écrivez les actions en cours avec être en train de en français.', 'grammar-ongoing'],
    ['Escribe los planes futuros usando el futuro próximo en francés.', 'grammar-near-future'],
    ['Escribe vocabulario de puntos cardinales en francés.', 'lexicon-cardinal'],
    ['Escribe vocabulario de unidades métricas en francés.', 'lexicon-measures'],
    ['Écrivez le vocabulaire des saisons en français.', 'lexicon-seasons'],
    ['Escribe vocabulario de expresiones de tiempo en francés.', 'lexicon-time'],
  ]) it(`contenido específico: ${id}`, () => {
    const p = recommend({ activityTitle: 'Actividad', description, maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(p.criteria.some(c => c.templateId === `fra-${grade}-${id}`)).toBe(true)
  })
  if (grade === 3) it('un ejercicio de vocabulario no exige producir un informe del clima', () => {
    const p = recommend({ activityTitle: 'Actividad', description: 'Écrivez le vocabulaire des phénomènes atmosphériques en français.', maxScore: 20, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
    expect(p.criteria.map(c => c.templateId)).toEqual(['fra-3-lexicon-weather', 'fra-3-written'])
  })
})
