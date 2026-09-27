import { readFileSync } from 'node:fs'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const source = process.argv[2]
if (!source) throw new Error('Uso: node scripts/curriculum/survey.mjs <pdf> [desde] [hasta]')
const document = await getDocument({
  data: new Uint8Array(readFileSync(source)),
  useSystemFonts: true,
}).promise
const start = Number(process.argv[3] || 1)
const end = Number(process.argv[4] || document.numPages)
for (let number = start; number <= end; number++) {
  const page = await document.getPage(number)
  const content = await page.getTextContent()
  const items = content.items
    .filter((item) => item.str?.trim())
    .map((item) => ({
      x: item.transform[4],
      y: item.transform[5],
      text: item.str.trim(),
    }))
  const candidates =
    process.argv[5] === 'all'
      ? items
      : items.filter(
          (item) =>
            (item.y > 610 &&
              /(?:Grado|Ciclo|Área|Salida|Modalidad|Optativa|CONTENIDOS|Contenidos|Conceptos|Procedimientos|Indicadores|Competencia Fundamental|Criterios de Evaluación)/i.test(
                item.text,
              )) ||
            /(?:Indicadores de Logro|Criterios de Evaluación|Ejes Transversales)/i.test(item.text),
        )
  console.log(
    `${number}\t${candidates.map((item) => `${Math.round(item.x)},${Math.round(item.y)}:${item.text}`).join(' | ')}`,
  )
}
