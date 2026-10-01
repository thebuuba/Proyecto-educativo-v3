import assert from 'node:assert/strict'
import { test } from 'node:test'
import { blocksIn, pageItems, searchText, stableUuid } from './layout.mjs'
import { elementRecord, scopeKey } from './malla.mjs'
import { optativeAssignment, optativeExitAt } from './secondary.mjs'
import { validateDataset } from './validate.mjs'

const baseContext = {
  versionCode: 'MINERD_PRIMARIA_2023',
  level: 'PRIMARY',
  cycle: 2,
  grade: 5,
  areaName: 'Ciencias de la Naturaleza',
  subjectName: 'Ciencias de la Naturaleza',
}

test('la identidad es estable y distingue grado, nivel y área', () => {
  const block = {
    originalText: 'Sistema circulatorio',
    boundingBox: { x0: 50, y0: 100, x1: 150, y1: 120 },
  }
  const first = elementRecord(baseContext, 'CONCEPT', block, 319, 1, 0)
  assert.equal(first.id, elementRecord(baseContext, 'CONCEPT', block, 319, 1, 0).id)
  assert.notEqual(
    first.id,
    elementRecord({ ...baseContext, grade: 6 }, 'CONCEPT', block, 319, 1, 0).id,
  )
  assert.notEqual(
    first.id,
    elementRecord({ ...baseContext, level: 'SECONDARY' }, 'CONCEPT', block, 319, 1, 0).id,
  )
  assert.notEqual(
    first.id,
    elementRecord({ ...baseContext, areaName: 'Matemática' }, 'CONCEPT', block, 319, 1, 0).id,
  )
  assert.equal(stableUuid('x', 'y'), stableUuid('x', 'y'))
  assert.equal(searchText('Ciencias de la Naturaleza'), 'ciencias de la naturaleza')
})

test('las columnas no se mezclan al reconstruir bloques', () => {
  const items = [
    { x: 49, y: 300, width: 50, height: 10, text: 'Materia' },
    { x: 209, y: 300, width: 100, height: 10, text: 'Observación' },
    { x: 416, y: 300, width: 80, height: 10, text: 'Respeto' },
    { x: 49, y: 260, width: 50, height: 10, text: 'Energía' },
  ]
  assert.deepEqual(
    blocksIn(items, { left: 0, right: 207, top: 320, bottom: 240 }).map((x) => x.originalText),
    ['Materia', 'Energía'],
  )
  assert.deepEqual(
    blocksIn(items, { left: 207, right: 414, top: 320, bottom: 240 }).map((x) => x.originalText),
    ['Observación'],
  )
  assert.deepEqual(
    blocksIn(items, { left: 414, right: 612, top: 320, bottom: 240 }).map((x) => x.originalText),
    ['Respeto'],
  )
  assert.equal(
    pageItems({ items: [{ str: 'Concepto', transform: [1, 0, 0, 10, 50, 100], width: 42 }] })
      .length,
    1,
  )
})

test('las cuatro salidas tienen asignaturas verificables por grado', () => {
  const counts = new Map()
  for (let page = 427; page <= 517; page++) {
    const exit = optativeExitAt(page)
    if (exit) counts.set(exit, true)
  }
  assert.equal(counts.size, 4)
  assert.deepEqual(
    optativeAssignment('Ciencias y Tecnología', 'Ciencias de la Naturaleza', 6)?.slice(3),
    ['Física y Computación', 498],
  )
  assert.equal(optativeAssignment('Ciencias y Tecnología', 'Lengua Española', 6), null)
})

test('el validador detecta duplicados, orfandad y procedencia inválida', () => {
  const scope = { ...baseContext, stableKey: scopeKey(baseContext), optativeExitName: null }
  const block = {
    originalText: 'Sistema circulatorio',
    boundingBox: { x0: 50, y0: 100, x1: 150, y1: 120 },
  }
  const element = elementRecord(baseContext, 'CONCEPT', block, 999, 1, 0)
  const report = validateDataset({
    version: { level: 'PRIMARY' },
    document: { pageCount: 404 },
    scopes: [scope],
    elements: [element, element],
    relations: [{ fromId: element.id, toId: 'missing' }],
    mallaPages: [1],
    pending: [],
  })
  assert(report.errors.some((error) => error.startsWith('DUPLICATE_ID')))
  assert(report.errors.some((error) => error.startsWith('INVALID_SOURCE')))
  assert(report.errors.some((error) => error.startsWith('ORPHAN_RELATION')))
  assert(report.errors.some((error) => error.startsWith('EXPECTED_SCOPE_MISSING')))
})
