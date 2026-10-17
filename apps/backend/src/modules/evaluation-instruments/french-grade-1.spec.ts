import { describe, expect, it } from 'vitest'
import { recommend } from './recommendation-engine'
import { evaluationCatalogForVersion } from './catalog-current'
import fixtures from '../../../../../data/evaluation-instruments/french-grade-1-contracts.json'
import { resolveCommonFrenchTask } from '@aula/shared'

const context = { level: 'SECONDARY' as const, grade: 1, cycle: 1, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
const input = (description: string, format: typeof formats[number] = 'rubrica', maxScore = 20) => ({ activityTitle: 'Actividad', description, preferredInstrumentType: format, maxScore, participationMode: 'INDIVIDUAL' as const })
const propose = (description: string, format: typeof formats[number] = 'rubrica', maxScore = 20) => recommend(input(description, format, maxScore), context, null, [], 'UNMAPPED', null)
describe('Francés común 1.º: evidencia de las funciones y modalidades, PDF 181–184', () => {
  for (const f of fixtures) for (const format of formats) for (const total of [20, 17.35]) it(`${f.id}: ${format}, ${total}`, () => {
    const p = propose(f.description, format, total)
    expect(p.activityType).toBe(f.activity)
    const ids = p.criteria.map(c => c.templateId)
    for (const id of f.contains) expect(ids.some(value => value === `fra-1-${id}` || value.startsWith(`fra-1-${id}:`)), `${id}: ${ids.join(',')}`).toBe(true)
    for (const id of f.excludes) expect(ids.some(value => value === `fra-1-${id}` || value.startsWith(`fra-1-${id}:`))).toBe(false)
    expect(p.criteria.every(c => c.templateId.startsWith('fra-1-'))).toBe(true)
    expect(p.totalScoreUnits).toBe(Math.round(total * 100))
    expect(p.criteria.reduce((sum, c) => sum + c.maxScoreUnits, 0)).toBe(p.totalScoreUnits)
    expect(p.criteria).toEqual(recommend({ ...input(f.description, format, total), activityTitle: 'Entrevista de trabajo en inglés' }, context, null, [], 'UNMAPPED', null).criteria)
    expect(new Set(ids).size).toBe(ids.length)
    expect(p.criteria.every(c => c.progressionLevels?.length === 5)).toBe(true)
  })
  it('no usa Francés de 1.º fuera del ámbito o en un release histórico', () => {
    const i = input(fixtures[2].description)
    for (const change of [{ grade: 2 }, { level: 'PRIMARY' as const }, { subjectCode: 'ING' }, { optativeExitName: 'Humanidades' }]) expect(recommend(i, { ...context, ...change }, null, [], 'UNMAPPED', null).criteria.some(c => c.templateId.startsWith('fra-1-'))).toBe(false)
    expect(recommend(i, context, null, [], 'UNMAPPED', null, evaluationCatalogForVersion('evaluation-2026.69')!).criteria.some(c => c.templateId.startsWith('fra-1-'))).toBe(false)
  })
  it('respeta tipo e instrumento explícitos sin perder el contenido de la consigna', () => {
    const p = recommend({ ...input(fixtures[2].description, 'lista-ponderada'), pedagogicalActivityType: 'PROJECT' }, context, null, [], 'UNMAPPED', null)
    expect(p.activityType).toBe('PROJECT'); expect(p.instrumentType).toBe('lista-ponderada')
    expect(p.criteria.some(c => c.templateId === 'fra-1-personal')).toBe(true)
  })
  for (const [description, expected] of [
    ['Identifica en el texto francés la concordancia entre sustantivo y adjetivo.', 'grammar-agreement'],
    ['Lisez les phrases et identifiez les articles définis.', 'grammar-articles'],
    ["Identifiez les verbes au présent dans le texte français.", 'grammar-present'],
    ['Escribe consignas de aula en francés utilizando el imperativo.', 'grammar-imperative'],
    ['Utiliza adjetivos posesivos en una descripción escrita de objetos en francés.', 'grammar-possessives'],
    ['Lisez le texte et identifiez les pronoms personnels.', 'grammar-pronouns'],
    ['Escribe en francés la ubicación de objetos usando preposiciones.', 'grammar-prepositions'],
    ['Utiliza los presentativos solicitados en francés.', 'grammar-presentatives'],
    ['Lisez le texte et identifiez les connecteurs.', 'grammar-connectors'],
    ['Escribe un mensaje en francés utilizando vocabulario de colores.', 'lexicon-colors'],
    ['Identifica en el texto francés el vocabulario de miembros de la familia.', 'lexicon-family'],
    ['Escribe un mensaje con vocabulario de materiales escolares en francés.', 'lexicon-school'],
    ['Complétez le formulaire en français.', 'form'],
    ['Escribe una tarjeta de presentación en francés.', 'card'],
    ['Écrivez un courriel en français pour vous présenter.', 'message'],
    ['Lisez une affiche en français et relevez son indication principale.', 'sign'],
    ['Recita en francés la rima indicada.', 'verse'],
  ]) it(`contenido solicitado: ${expected}`, () => {
    const p = propose(description)
    expect(p.criteria.some(c => c.templateId === `fra-1-${expected}`)).toBe(true)
    expect(p.criteria.filter(c => c.templateId.startsWith('fra-1-grammar-')).every(c => c.templateId === `fra-1-${expected}`)).toBe(true)
  })
  it('conserva oral y escrito obligatorios sin convertirlos en alternativas', () => {
    const p = propose('Presenta la rutina diaria en francés de forma oral y por escrito.')
    expect(p.criteria.map(c => c.templateId)).toEqual(expect.arrayContaining(['fra-1-oral', 'fra-1-written']))
    expect(p.criteria.some(c => c.templateId.startsWith('fra-1-alternative'))).toBe(false)
  })
  it('no usa el proveedor para una consigna que solicita otro idioma', () => {
    expect(resolveCommonFrenchTask('Francés', 'Escribe en inglés una presentación personal.', context)).toBeNull()
  })
  it('no impone un diálogo excluido en francés', () => {
    const p = propose('Écrivez votre routine en français. Ne faites pas de dialogue oral.')
    expect(p.criteria.map(c => c.templateId)).toEqual(['fra-1-routine', 'fra-1-written'])
  })
  it('recomienda por evidencia y reconoce el propósito evaluativo en francés', () => {
    const descriptions = [
      [fixtures[6].description, 'lista-cotejo'],
      [fixtures[5].description, 'rubrica'],
      [fixtures[0].description + ' Observez la régularité des échanges.', 'escala'],
      [fixtures[2].description + ' Poids par composante.', 'lista-ponderada'],
    ]
    for (const [description, format] of descriptions) expect(recommend({ ...input(description), preferredInstrumentType: undefined }, context, null, [], 'UNMAPPED', null).instrumentType).toBe(format)
  })
  it('evalúa saludo y despedida como evidencias separadas en cotejo', () => {
    const p = propose(fixtures[0].description, 'lista-cotejo')
    expect(p.criteria.filter(c => c.templateId.startsWith('fra-1-greetings:'))).toHaveLength(2)
    expect(p.criteria.some(c => c.description.includes('despedida'))).toBe(true)
  })
  it('reconoce descripción breve enteramente francesa y no exige datos de identidad', () => {
    const p = propose('Décrivez par écrit une personne de votre famille en français.')
    expect(p.criteria.map(c => c.templateId)).toEqual(['fra-1-description', 'fra-1-written'])
  })
  it('separa una condición de entrega en francés del contenido evaluado', () => {
    const p = propose('Écrivez votre routine en français en trois phrases.')
    expect(p.criteria.find(c => c.templateId === 'delivery-format')?.description).toContain('3 oraciones')
    expect(p.criteria.find(c => c.templateId === 'fra-1-routine')?.description).not.toContain('oraciones')
  })
  it('detecta límites de páginas incompatibles en francés antes de generar', () => {
    expect(() => propose('Écrivez votre routine en français. Au moins trois pages et au plus une page.')).toThrow(/contradictorios/)
  })
  it('mantiene la identidad del dato al cambiar los campos personales solicitados', () => {
    const first = propose('Escribe en francés el nombre y la edad de un personaje.', 'lista-cotejo')
    const second = propose('Escribe en francés la edad y la nacionalidad de un personaje.', 'lista-cotejo')
    const single = propose('Escribe en francés la edad de un personaje.', 'lista-cotejo')
    const age = (p: typeof first) => p.criteria.find(c => c.description.startsWith('Comunica en francés la edad'))!
    expect(age(first).templateId).toBe(age(second).templateId)
    expect(age(first).templateId).toBe(age(single).templateId)
    expect(first.criteria.find(c => c.description.startsWith('Comunica en francés el nombre'))?.templateId).not.toBe(age(second).templateId)
  })
  it('identificar formas en un texto es recepción, no una producción inventada', () => {
    const p = propose('Identifica en el texto francés los artículos definidos.')
    expect(p.activityType).toBe('READING_COMPREHENSION')
    expect(p.criteria[0].description).toContain('texto leído')
    expect(p.criteria.some(c => /fra-1-(?:oral|written)$/.test(c.templateId))).toBe(false)
  })
  it('la etiqueta Consigna no agrega comunicación de aula y el plural conserva la descripción', () => {
    const p = propose('Consigna: describan por escrito a unas personas en francés.')
    expect(p.criteria.map(c => c.templateId)).toEqual(['fra-1-description', 'fra-1-written'])
  })
  it('reconoce una portada pedida en francés sin inventar otros requisitos', () => {
    const p = propose('Écrivez votre routine en français avec une couverture.')
    expect(p.criteria.find(c => c.templateId === 'delivery-format')?.description).toContain('incluye portada')
    expect(p.criteria.find(c => c.templateId === 'delivery-format')?.description).not.toContain('paginas')
  })
  it('el presente gramatical no se confunde con la instrucción presentar oralmente', () => {
    const p = propose('Utiliza el presente de indicativo en francés.')
    expect(p.criteria.map(c => c.templateId)).toEqual(['fra-1-grammar-present'])
  })
})
