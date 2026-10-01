import { OPS } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { pageItems } from './layout.mjs'

const multiply = (a, b) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
]

// PDF vector cell borders, in the same unrotated coordinate system as text.
// pdfjs 6 DrawOPS: move=0, line=1, cubic=2, quadratic=3, close=4.
export function tableRules(operators) {
  let transform = [1, 0, 0, 1, 0, 0]
  const stack = [],
    rules = []
  const point = (x, y) => [
    transform[0] * x + transform[2] * y + transform[4],
    transform[1] * x + transform[3] * y + transform[5],
  ]
  const line = (a, b) => {
    if (!a || !b) return
    if (Math.abs(a[0] - b[0]) < 0.2 && Math.abs(a[1] - b[1]) > 8)
      rules.push({ axis: 'v', at: a[0], from: Math.min(a[1], b[1]), to: Math.max(a[1], b[1]) })
    if (Math.abs(a[1] - b[1]) < 0.2 && Math.abs(a[0] - b[0]) > 8)
      rules.push({ axis: 'h', at: a[1], from: Math.min(a[0], b[0]), to: Math.max(a[0], b[0]) })
  }
  for (let i = 0; i < operators.fnArray.length; i++) {
    const op = operators.fnArray[i],
      args = operators.argsArray[i]
    if (op === OPS.save) stack.push([...transform])
    else if (op === OPS.restore) transform = stack.pop() || [1, 0, 0, 1, 0, 0]
    else if (op === OPS.transform) transform = multiply(transform, args)
    else if (op === OPS.constructPath) {
      for (const data of args[1] || []) {
        let last = null,
          first = null
        for (let j = 0; j < data.length; ) {
          const kind = data[j++]
          if (kind === 0 || kind === 1) {
            const next = point(data[j++], data[j++])
            if (kind === 1) line(last, next)
            else first = next
            last = next
          } else if (kind === 2) {
            j += 4
            last = point(data[j++], data[j++])
          } else if (kind === 3) {
            j += 2
            last = point(data[j++], data[j++])
          } else if (kind === 4) {
            line(last, first)
            last = first
          } else break
        }
      }
    }
  }
  return rules
}

export async function readPage(page) {
  const items = pageItems(await page.getTextContent())
  items.rules = tableRules(await page.getOperatorList())
  return items
}
