import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const [input, fixture, title, output] = process.argv.slice(2)
assert(input && fixture && title && output, 'Uso: input.json fixture título output.md')
const data = JSON.parse(readFileSync(input, 'utf8'))
const examples = data.results.filter(row => row.fixture === fixture && !row.neutral && row.maxScore === 20)
assert.equal(examples.length, 4, 'Se requieren los cuatro instrumentos verificados.')
let text = `# ${title}\n\nAdaptaciones evaluativas de Aula Base, no instrumentos oficiales del MINERD. La evidencia JSON conserva todos los instrumentos y variantes del servicio normal.\n`
for (const { proposal } of examples) {
  text += `\n## ${proposal.instrumentType} · 20 puntos\n\n`
  for (const row of proposal.criteria) {
    text += `- **${row.title} (${row.maxScore} pts)**: ${row.description}\n`
    for (const descriptor of row.descriptors) text += `  - ${proposal.levels.find(level => level.id === descriptor.levelId).label}: ${descriptor.text}\n`
  }
  if (!proposal.levels.length) text += proposal.instrumentType === 'lista-ponderada'
    ? '\nCumple: 100%; Parcial: 50% según la evidencia indicada en cada fila; No cumple: 0%.\n'
    : '\nSí: evidencia presente; No: evidencia ausente.\n'
}
writeFileSync(output, text)
