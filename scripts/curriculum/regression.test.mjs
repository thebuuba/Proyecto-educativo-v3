import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { createPrimaryAdapter } from './primary.mjs'
import { createSecondaryAdapter } from './secondary.mjs'
import {
  contentElements,
  cycleCriteria,
  gradeCompetencies,
  printedPageFromItems,
} from './malla.mjs'
import { validateDataset } from './validate.mjs'
import { searchText } from './layout.mjs'

function fixture(level, page) {
  const data = JSON.parse(
    readFileSync(new URL(`./fixtures/${level}/${page}.json`, import.meta.url), 'utf8'),
  )
  assert.equal(
    data.sourceSha256,
    level === 'primary'
      ? 'd4341fd5f387b16333cdeaaa5b8e34b3468722bf17ca6d1a589854b205a9e427'
      : '80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58',
  )
  data.items.rules = data.rules
  return data.items
}
const context = {
  versionCode: 'test',
  level: 'SECONDARY',
  cycle: 1,
  grade: 1,
  areaName: 'Ciencias Sociales',
  subjectName: 'Ciencias Sociales',
}

for (const page of [
  69, 76, 82, 96, 105, 113, 169, 181, 185, 199, 203, 229, 244, 293, 312, 344, 347, 397, 401, 413,
  427, 437, 462, 467, 491, 499, 506, 511,
]) {
  test(`Secundaria PDF ${page}: siete celdas completas, sin filas concatenadas`, () => {
    const result = gradeCompetencies(fixture('secondary', page), context, page, {})
    assert.equal(result.elements.filter((e) => e.type === 'SPECIFIC_COMPETENCY').length, 7)
    assert.equal(result.relations.length, 7)
    assert.deepEqual(result.pending, [])
    for (const e of result.elements) assert(e.source.tableCell)
  })
}
test('Ciencias Sociales 244: comunicativa no absorbe la competencia siguiente', () => {
  const es = gradeCompetencies(fixture('secondary', 244), context, 244, {}).elements.filter(
    (e) => e.type === 'SPECIFIC_COMPETENCY',
  )
  assert.match(es[0].originalText, /informaciones confiables\.$/u)
  assert.doesNotMatch(es[0].originalText, /Relaciona/u)
  assert.match(es[1].originalText, /^Relaciona/u)
})
for (const [pages, grade, area] of [
  [[206, 207, 208], 3, 'Formación Integral Humana y Religiosa'],
  [[219, 220, 221, 222], 3, 'Educación Artística'],
  [[318, 319, 320, 321], 5, 'Ciencias de la Naturaleza'],
  [[347, 348, 349], 6, 'Lenguas Extranjeras-inglés'],
  [[362, 363, 364], 6, 'Educación Física'],
]) {
  test(`Primaria: continuidad y anomalía documentada ${pages.join('-')}`, () => {
    const adapter = createPrimaryAdapter('test')
    let last
    for (const p of pages) {
      last = adapter.extract(p, fixture('primary', p))
      assert.deepEqual(last.pending, [])
    }
    assert.equal(last.context.grade, grade)
    assert.equal(last.context.areaName, area)
    assert(last.elements.some((e) => e.type === 'ACHIEVEMENT_INDICATOR'))
  })
}
test('Cambio real de grado 318 a 322 no hereda grado 5', () => {
  const a = createPrimaryAdapter('test')
  a.extract(318, fixture('primary', 318))
  assert.equal(a.extract(322, fixture('primary', 322)).context.grade, 6)
})
test('Cambio de área no conserva el scope anterior', () => {
  const a = createPrimaryAdapter('test')
  a.extract(64, fixture('primary', 64))
  assert.equal(a.extract(136, fixture('primary', 136)).context.areaName, 'Ciencias Sociales')
})
test('Tablas sin encabezados 106–111 conservan grado 5; 113 cambia a 6', () => {
  const a = createSecondaryAdapter('test')
  for (const p of [105, 106, 107, 108, 109, 110, 111]) {
    const r = a.extract(p, fixture('secondary', p))
    assert.equal(r.context.grade, 5)
    assert(r.elements.some((e) => e.type === 'PROCEDURE'))
  }
  assert.equal(a.extract(113, fixture('secondary', 113)).context.grade, 6)
})
test('Continuidad de indicadores 509–510 y 516–517', () => {
  for (const pages of [
    [506, 507, 508, 509, 510],
    [511, 512, 513, 514, 515, 516, 517],
  ]) {
    const a = createSecondaryAdapter('test')
    let last
    for (const p of pages) last = a.extract(p, fixture('secondary', p))
    assert(last.elements.filter((e) => e.type === 'ACHIEVEMENT_INDICATOR').length >= 18)
    assert.equal(
      last.context.subjectName,
      pages[0] === 506 ? 'Química y Computación' : 'Física y Computación',
    )
  }
})
test('FIHR 401: errata de ciclo registrada; conserva tercero', () => {
  const r = createSecondaryAdapter('test').extract(401, fixture('secondary', 401))
  assert.equal(r.context.grade, 3)
  assert.equal(r.context.cycle, 1)
  assert.equal(r.elements.filter((e) => e.type === 'SPECIFIC_COMPETENCY').length, 7)
})
test('Columnas reales: Artística 344 con Procedimien-tos dividido', () => {
  const r = contentElements(fixture('secondary', 344), context, 344, {})
  for (const t of ['CONCEPT', 'PROCEDURE', 'ATTITUDE_VALUE'])
    assert(r.elements.some((e) => e.type === t))
  assert.deepEqual(r.pending, [])
  assert(
    r.elements
      .filter((e) => e.type === 'PROCEDURE')
      .every((e) => !e.originalText.includes('Principales obras de la historia')),
  )
})
test('Criterios Primaria 58: tres columnas atribuidas a grados, sin concatenación', () => {
  const r = cycleCriteria(
    fixture('primary', 58),
    {
      ...context,
      level: 'PRIMARY',
      grade: null,
      areaName: 'Lengua Española',
      subjectName: 'Lengua Española',
    },
    58,
  )
  assert.deepEqual(
    r.scopes.map((s) => s.grade),
    [1, 2, 3],
  )
  assert(r.length >= 9)
  assert(r.every((e) => e.source.explicitCriterionHeading))
})
for (const p of [156, 410])
  test(`Criterios ${p} terminan antes de ejes transversales`, () => {
    const r = cycleCriteria(fixture('secondary', p), { ...context, grade: null }, p)
    assert.equal(r.length, 3)
    assert(r.every((e) => !e.originalText.includes('Desarrollo Sostenible')))
  })
test('Procedimientos 116 no cruzan el borde hacia la fila siguiente', () => {
  const es = contentElements(fixture('secondary', 116), context, 116, {}).elements
  assert(
    !es.some(
      (e) =>
        e.originalText.includes('Producción escrita (escribir)') &&
        e.originalText.includes('Comprensión oral (escuchar)'),
    ),
  )
})
test('Folio se lee, no se deriva de posición PDF', () => {
  assert.equal(printedPageFromItems(fixture('primary', 64)), '63')
  assert.equal(printedPageFromItems([{ text: '700', y: 20 }]), '700')
  assert.equal(printedPageFromItems([{ text: '64', y: 600 }]), null)
})

test('Portada 405 no continúa los indicadores del grado anterior', () => {
  const r = contentElements(fixture('secondary', 405), context, 405, {
    previousTable: { kind: 'INDICATOR' },
  })
  assert.equal(r.elements.length, 0)
  assert.equal(r.tableState, null)
  const adapter = createSecondaryAdapter('test')
  adapter.extract(401, fixture('secondary', 401))
  const cover = adapter.extract(405, fixture('secondary', 405))
  assert.equal(cover.context, null)
  assert.equal(cover.elements.length, 0)
})
test('Subtítulos de indicadores se conservan como procedencia, no como indicadores', () => {
  const r = contentElements(fixture('secondary', 504), context, 504, {})
  assert.equal(r.elements.length, 18)
  assert(r.elements.every((e) => /^\s*[•●▪–-]/u.test(e.originalText)))
  assert.equal(r.elements[0].source.subsection.text, 'Salud')
  assert.equal(r.elements.at(-1).source.subsection.text, 'Biología computacional')
})
test('Capa oculta de encabezados 449 no genera contenidos ni indicadores falsos', () => {
  const r = contentElements(fixture('secondary', 449), context, 449, {})
  assert.equal(r.elements.length, 21)
  assert(
    r.elements.every(
      (e) => e.type === 'ACHIEVEMENT_INDICATOR' && /^\s*[•●▪–-]/u.test(e.originalText),
    ),
  )
})
test('Validador rechaza texto largo, encabezado incrustado y celda mezclada', () => {
  const e = gradeCompetencies(fixture('secondary', 244), context, 244, {}).elements[0]
  const bad = {
    ...e,
    originalText: 'Competencias Fundamentales\n' + 'x'.repeat(1200),
    source: { ...e.source, boundingBox: { ...e.source.boundingBox, y0: 0 } },
  }
  bad.normalizedText = searchText(bad.originalText)
  const r = validateDataset({
    version: { level: 'SECONDARY' },
    document: { id: 'test', pageCount: 520 },
    scopes: [],
    elements: [bad],
    relations: [],
    mallaPages: [],
    pending: [],
  })
  for (const prefix of ['EXCESSIVE_BLOCK_LENGTH', 'EMBEDDED_HEADER', 'CELL_TEXT_OVERFLOW'])
    assert(r.errors.some((e) => e.startsWith(prefix)))
})
