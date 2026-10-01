import { readFileSync } from 'node:fs'
import { searchText } from './layout.mjs'

const [datasetPath, gradeArg, areaArg, exitArg = ''] = process.argv.slice(2)
if (!datasetPath || !gradeArg || !areaArg) {
  throw new Error(
    'Uso: node scripts/curriculum/query.mjs <dataset.jsonl> <grado> <área/asignatura> [salida optativa]',
  )
}
const records = readFileSync(datasetPath, 'utf8')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line))
const grade = Number(gradeArg)
const matches = records.filter(
  (record) =>
    record.kind === 'scope' &&
    record.grade === grade &&
    [record.areaName, record.subjectName].some(
      (value) => searchText(value || '') === searchText(areaArg),
    ) &&
    searchText(record.optativeExitName || '') === searchText(exitArg),
)
if (matches.length !== 1) {
  console.error(`Consulta no unívoca: ${matches.length} ámbitos encontrados`)
  process.exitCode = 1
} else {
  const scope = matches[0]
  const elements = records.filter(
    (record) => record.kind === 'element' && record.scopeKey === scope.stableKey,
  )
  console.log(
    JSON.stringify(
      {
        status: 'BORRADOR_PENDIENTE_DE_VALIDACION',
        scope,
        elementCounts: Object.fromEntries(
          [...new Set(elements.map((element) => element.type))].map((type) => [
            type,
            elements.filter((element) => element.type === type).length,
          ]),
        ),
        elements: elements.map(({ id, type, originalText, source }) => ({
          id,
          type,
          originalText,
          source,
        })),
      },
      null,
      2,
    ),
  )
}
