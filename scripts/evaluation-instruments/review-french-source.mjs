import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const require = createRequire(import.meta.url)
const canvasRequire = createRequire(require.resolve('pdfjs-dist/package.json'))
const { createCanvas } = canvasRequire('@napi-rs/canvas')
const root = 'docs/curriculum/cobertura-secundaria/'
const inventory = JSON.parse(readFileSync(root + 'inventario.json', 'utf8'))
const bytes = readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')
assert.equal(createHash('sha256').update(bytes).digest('hex'), inventory.source.sha256)
const scopes = inventory.scopes.filter(scope => scope.subject === 'Francés' && scope.character === 'COMMON' && scope.exit === null)
assert(scopes.length > 0)
assert.equal(new Set(scopes.map(scope => scope.grade)).size, scopes.length)
const output = '.wrangler/french-source'
mkdirSync(output, { recursive: true })
const selected = process.argv.slice(2).map(Number)
const pages = selected.length ? selected : [...new Set(scopes.flatMap(scope => scope.pdfPages))]
assert(pages.every(page => Number.isInteger(page) && page > 0 && page <= inventory.source.pageCount))
const loadingTask = getDocument({ data: new Uint8Array(bytes) })
const pdf = await loadingTask.promise
const texts = {}
for (const number of pages) {
  const page = await pdf.getPage(number)
  const viewport = page.getViewport({ scale: 1.7 })
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
  writeFileSync(`${output}/page-${number}.png`, canvas.toBuffer('image/png'))
  const content = await page.getTextContent()
  texts[number] = content.items.map(item => item.str).join('\n')
  page.cleanup()
}
writeFileSync(`${output}/pages-${pages[0]}-${pages.at(-1)}.json`, JSON.stringify(texts, null, 2) + '\n')
await loadingTask.destroy()

// Rendering is not a visual review. Keep review/implementation statuses explicit.
const file = root + 'frances-matriz.json'
const prior = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).grades : []
const grades = scopes.map(scope => {
  const previous = prior.find(item => item.scopeId === scope.id)
  return {
    grade: scope.grade, scopeId: scope.id, character: scope.character, optativeExit: scope.exit,
    pdfPages: scope.pdfPages, printedPages: [...new Set(Object.values(scope.elements).flat().map(element => element.printedPage))],
    officialRecords: Object.entries(scope.elements).flatMap(([type, elements]) => elements.map(element => ({ type, ...element }))),
    visualReview: previous?.visualReview ?? { status: 'PENDING', pages: [], observations: [] },
    ...(previous?.pedagogicalInventory ? { pedagogicalInventory: previous.pedagogicalInventory } : {}),
    coverage: previous?.coverage ?? { inventory: 'EXTRACTED', implementation: 'PENDING', providers: [], automated: 'NOT_RUN', httpDatabase: 'NOT_RUN', browser: 'NOT_RUN', evidence: [], pending: ['Contrastar tablas y continuaciones; definir familias evaluativas.'] },
  }
})
writeFileSync(file, JSON.stringify({ source: inventory.source, note: 'Texto oficial conservado; las adaptaciones y su cobertura se documentan aparte. Renderizar no marca la revisión visual.', grades }, null, 2) + '\n')
console.log(JSON.stringify({ rendered: pages, grades: grades.map(grade => ({ grade: grade.grade, pages: grade.pdfPages, records: grade.officialRecords.length })) }))
