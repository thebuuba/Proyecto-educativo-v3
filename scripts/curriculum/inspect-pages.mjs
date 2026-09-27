import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { readPage } from './pdf-page.mjs'
const require = createRequire(import.meta.url)
const { createCanvas } = createRequire(require.resolve('pdfjs-dist/package.json'))(
  '@napi-rs/canvas',
)
const [pdf, pageList, output = 'tmp/pdfs/curriculum', mode = 'render'] = process.argv.slice(2)
if (!pdf || !pageList)
  throw Error('Uso: inspect-pages.mjs PDF páginasSeparadasPorComa salida [render|fixture|text]')
const doc = await getDocument({ data: new Uint8Array(readFileSync(pdf)), useSystemFonts: true })
  .promise
const sourceSha256 = createHash('sha256').update(readFileSync(pdf)).digest('hex')
mkdirSync(output, { recursive: true })
let sheet = null,
  sheetIndex = 0,
  slot = 0
for (const number of pageList.split(',').map(Number)) {
  const page = await doc.getPage(number)
  if (mode === 'render' || mode === 'sheets') {
    const viewport = page.getViewport({ scale: mode === 'render' ? 1.5 : 1 }),
      canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    if (mode === 'render') writeFileSync(`${output}/${number}.png`, canvas.toBuffer('image/png'))
    else {
      if (!sheet) {
        sheet = createCanvas(1836, 1050)
        const c = sheet.getContext('2d')
        c.fillStyle = 'white'
        c.fillRect(0, 0, 1836, 1050)
      }
      const c = sheet.getContext('2d'),
        x = (slot % 3) * 612,
        y = Math.floor(slot / 3) * 525
      c.fillStyle = 'black'
      c.font = 'bold 16px sans-serif'
      c.fillText(`PDF ${number}`, x + 15, y + 20)
      c.drawImage(canvas, 0, 0, 612, 500, x, y + 25, 612, 500)
      slot++
      if (slot === 6) {
        writeFileSync(`${output}/sheet-${++sheetIndex}.png`, sheet.toBuffer('image/png'))
        sheet = null
        slot = 0
      }
    }
  } else {
    const items = await readPage(page)
    if (mode === 'fixture')
      writeFileSync(
        `${output}/${number}.json`,
        JSON.stringify({ sourceSha256, pdfPage: number, items: [...items], rules: items.rules }) +
          '\n',
      )
    else console.log(JSON.stringify({ page: number, items: [...items], rules: items.rules }))
  }
}
if (sheet) writeFileSync(`${output}/sheet-${++sheetIndex}.png`, sheet.toBuffer('image/png'))
