import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { recommend } = require('../../apps/backend/dist/modules/evaluation-instruments/recommendation-engine.js')
const grade = Number(process.argv[2] ?? 1)
const presentation = process.argv.includes('--presentation-regression')
if (presentation && grade !== 1) throw Error('Presentation regression belongs to first grade')
const context = { level: 'SECONDARY', grade, cycle: grade <= 3 ? 1 : 2, modalityCode: 'academic', subjectCode: 'FRA', subjectName: 'Francés', optativeExitName: null }
const description = presentation ? JSON.parse(readFileSync('data/evaluation-instruments/french-presentation-case.json', 'utf8')).description : JSON.parse(readFileSync('data/evaluation-instruments/french-persistence-cases.json', 'utf8'))[grade]
if (!description) throw Error('No reviewed persistence case for this grade')
const lines = [`# Francés ${grade}.º — cuatro instrumentos completos de ejemplo`, '', 'Adaptaciones evaluativas de AulaBase, no rúbricas oficiales de MINERD. Generadas con el motor compilado; la evidencia HTTP/DB y la visual se documentan por separado en el informe del grado.', '', '**Consigna:** ' + description, '', 'Puntaje de estos ejemplos: **17.35** (elección explícita para ilustrar el reparto; el creador comienza con puntuación pendiente). Las cantidades se reparten en centésimas. El título de la actividad no se inserta en los criterios.', '']
const cell = text => String(text).replaceAll('|', '\\|').replaceAll('\n', ' ')
for (const format of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) {
  const p = recommend({ activityTitle: 'Ejemplo QA Francés', description, maxScore: 17.35, participationMode: 'GROUP', preferredInstrumentType: format }, context, null, [], 'UNMAPPED', null)
  lines.push(`## ${format}`, '', `Catálogo: ${p.catalogVersion}. Tipo: ${p.activityType}. Total: ${p.totalScore}.`, '')
  if (p.levels.length) lines.push('Niveles: ' + p.levels.map(level => level.label).join(' · '), '')
  for (const c of p.criteria) {
    lines.push(`### ${c.title}`, '', `**Máximo:** ${c.maxScore} puntos. **Peso relativo:** ${c.relativeWeight}. **Identidad de plantilla:** \`${c.templateId}\`.`, '', c.description, '')
    if (c.descriptors.length) {
      lines.push('| Nivel | Evidencia o grado | Puntos |', '|---|---|---:|')
      c.descriptors.forEach((d, index) => lines.push(`| ${cell(p.levels[index].label)} | ${cell(d.text)} | ${d.scoreUnits / 100} |`))
      lines.push('')
    } else if (format === 'lista-cotejo') lines.push('Decisión: **Sí / No** para este indicador verificable.', '')
    else lines.push(`**Peso porcentual:** ${Math.round(c.maxScoreUnits / p.totalScoreUnits * 10000) / 100}%.`, '', '| Cumple | Parcial (50%) | No cumple |', '|---:|---:|---:|', `| ${c.maxScore} | ${Math.round(c.maxScoreUnits / 2) / 100} | 0 |`, '', 'El cumplimiento parcial corresponde a la evidencia descrita, no a un criterio adicional.', '')
  }
}
const file = presentation ? 'frances-presentacion-corregida-ejemplos.md' : `frances-${grade}-ejemplos.md`
writeFileSync(`docs/curriculum/cobertura-secundaria/${file}`, lines.join('\n').trimEnd() + '\n')
console.log(JSON.stringify({ grade, file }))
