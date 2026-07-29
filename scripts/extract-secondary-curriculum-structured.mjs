import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const [, , pdfPath, outputPath] = process.argv
if (!pdfPath || !outputPath) {
  throw new Error(
    'Uso: node scripts/extract-secondary-curriculum-structured.mjs <curriculo.pdf> <salida.ts>',
  )
}

const sources = [
  ['Lengua Española', [24, 28, 32, 42, 46, 50]],
  ['Lenguas Extranjeras: Inglés', [66, 71, 76, 88, 93, 98]],
  ['Lenguas Extranjeras: Francés', [110, 114, 118, 128, 132, 136]],
  ['Matemática', [146, 148, 150, 157, 159, 161]],
  ['Ciencias Sociales', [171, 176, 180, 190, 194, 199]],
  ['Ciencias de la Naturaleza', [213, 215, 218, 228, 232, 235]],
  ['Educación Artística', [245, 247, 249, 254, 256, 258]],
  ['Educación Física', [267, 270, 272, 278, 281, 283]],
  ['Formación Integral Humana y Religiosa', [294, 297, 300, 311, 315, 319]],
]

const optionalSources = [
  ['Humanidades y Lenguas Modernas', 4, 327, 'Lengua Española'],
  ['Humanidades y Lenguas Modernas', 5, 330, 'Lengua Española'],
  ['Humanidades y Lenguas Modernas', 6, 333, 'Lengua Española'],
  ['Humanidades y Lenguas Modernas', 4, 337, 'Lenguas Extranjeras: Inglés'],
  ['Humanidades y Lenguas Modernas', 5, 342, 'Lenguas Extranjeras: Inglés'],
  ['Humanidades y Lenguas Modernas', 6, 347, 'Lenguas Extranjeras: Inglés'],
  ['Humanidades y Ciencias Sociales', 4, 353, 'Lengua Española'],
  ['Humanidades y Ciencias Sociales', 5, 356, 'Lengua Española'],
  ['Humanidades y Ciencias Sociales', 6, 358, 'Lengua Española'],
  ['Humanidades y Ciencias Sociales', 4, 363, 'Ciencias Sociales'],
  ['Humanidades y Ciencias Sociales', 5, 365, 'Ciencias Sociales'],
  ['Humanidades y Ciencias Sociales', 6, 367, 'Ciencias Sociales'],
  ['Matemática y Tecnología', 4, 369, 'Matemática'],
  ['Matemática y Tecnología', 5, 371, 'Matemática'],
  ['Matemática y Tecnología', 6, 372, 'Matemática'],
  ['Ciencias y Tecnología', 4, 374, 'Ciencias de la Naturaleza'],
  ['Ciencias y Tecnología', 5, 378, 'Ciencias de la Naturaleza'],
  ['Ciencias y Tecnología', 6, 380, 'Ciencias de la Naturaleza'],
]

const normalized = (value) =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

function repairText(value) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/Adecuación Curricular.*$/i, '')
    .replace(/\bFísicas\b/g, 'físicas')
    .replace(/\bQuímicas\b/g, 'químicas')
    .replace(/\bReacciones Químicas\b/g, 'Reacciones químicas')
    .replace(/\bPropiedades de los\b/g, 'propiedades de los')
    .replace(/\bEducación Músical\b/g, 'Educación Musical')
    .replace(/\bFutbol\b/g, 'Fútbol')
    .replace(/\bpolicíaco\b/gi, 'policiaco')
    .replace(/^Algebra\b/, 'Álgebra')
    .replace(/^Estadísticas\b/, 'Estadística')
    .replace(/^Unidades de medidas\b/, 'Unidades de medida')
    .replace(/^Limites\b/, 'Límites')
    .replace(/\bBiomolecular y bioquímica\b/i, 'Biomoléculas y bioquímica')
    .replace(/^Naturaleza de la Ciencia$/, 'Naturaleza de la ciencia')
    .replace(/^Expresión Corporal,$/, 'Expresión corporal')
    .replace(/\s+\d+\s*$/, '')
    .trim()
}

function groupLines(items) {
  const lines = []
  for (const item of items) {
    if (!('str' in item) || !item.str.trim()) continue
    const [, , , height, x, y] = item.transform
    let line = lines.find((candidate) => Math.abs(candidate.y - y) < 0.35)
    if (!line) {
      line = { y, items: [] }
      lines.push(line)
    }
    line.items.push({
      text: item.str,
      x,
      width: item.width,
      height: Math.abs(height),
      font: item.fontName,
    })
  }
  return lines.sort((left, right) => right.y - left.y)
}

function joinItems(items) {
  const ordered = [...items].sort((left, right) => left.x - right.x)
  let result = ''
  let previousEnd = null
  for (const item of ordered) {
    const gap = previousEnd === null ? 0 : item.x - previousEnd
    if (result && gap > 1.4 && !result.endsWith(' ')) result += ' '
    result += item.text
    previousEnd = item.x + item.width
  }
  return repairText(result)
}

function appendText(original, continuation) {
  if (!original) return continuation
  const separator = /[-/(]$/.test(original) ? '' : ' '
  return repairText(`${original}${separator}${continuation}`)
}

function uniqueUnits(units) {
  const seen = new Set()
  return units
    .map((unit) => ({
      title: repairText(unit.title.replace(/:$/, '')),
      topics: [...new Set(unit.topics.map(repairText).filter(Boolean))],
    }))
    .filter((unit) => {
      const key = normalized(unit.title)
      if (!unit.title || !unit.topics.length || seen.has(key)) return false
      seen.add(key)
      return true
    })
}

const pdf = await getDocument({
  data: new Uint8Array(readFileSync(resolve(pdfPath))),
}).promise

async function extractEntry(startPage, area) {
  const units = []
  let currentUnit = null
  let currentTopic = null
  let previousConceptY = null
  let conceptLeft = 58
  let procedureLeft = 180

  for (let pageNumber = startPage; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const allText = content.items
      .flatMap((item) => ('str' in item ? [item.str] : []))
      .join(' ')

    const hasNextConceptTable =
      pageNumber > startPage &&
      content.items.some((item) => 'str' in item && item.str.trim() === 'Conceptos')
    if (
      hasNextConceptTable ||
      (pageNumber > startPage &&
        /Ejes Transversales/i.test(allText) &&
        !/Indicadores de Logro/i.test(allText))
    ) {
      break
    }

    const lines = groupLines(content.items)
    let headerY = 740
    const indicatorItem = content.items.find(
      (item) => 'str' in item && /Indicadores de Logro/i.test(item.str.trim()),
    )
    const lowerY = indicatorItem ? indicatorItem.transform[5] : 45
    if (pageNumber === startPage) {
      const conceptItem = content.items.find(
        (item) => 'str' in item && item.str.trim() === 'Conceptos',
      )
      const procedureItem = content.items.find(
        (item) => 'str' in item && /^Procedimientos:?$/i.test(item.str.trim()),
      )
      if (!conceptItem || !procedureItem || !('transform' in conceptItem)) break
      conceptLeft = Math.min(
        ...content.items
          .filter((item) => 'str' in item && item.str.trim() && item.transform[4] < 180)
          .filter(
            (item) =>
              item.transform[5] < conceptItem.transform[5] && item.transform[5] > 45,
          )
          .map((item) => item.transform[4])
          .filter((x) => x > 50),
      )
      const conceptCenter = conceptItem.transform[4] + conceptItem.width / 2
      procedureLeft = 2 * conceptCenter - conceptLeft + 2
      headerY = conceptItem.transform[5]
    }

    for (const line of lines) {
      if (line.y >= headerY || line.y <= lowerY) continue
      const conceptualItems = line.items.filter(
        (item) => item.x >= conceptLeft - 1 && item.x < procedureLeft - 3,
      )
      if (!conceptualItems.length) continue

      const firstX = Math.min(...conceptualItems.map((item) => item.x))
      const verticalGap =
        previousConceptY === null || line.y > previousConceptY
          ? 0
          : previousConceptY - line.y
      previousConceptY = line.y
      const text = joinItems(conceptualItems)
      if (!text || /^\d+$/.test(text)) continue

      const isBullet = /^[-•–]\s*/.test(text)
      const value = repairText(text.replace(/^[-•–]\s*/, ''))
      if (!value) continue
      const orderedItems = [...conceptualItems].sort((left, right) => left.x - right.x)
      const titleItems = []
      if (orderedItems[0]?.font === 'g_d0_f2') {
        for (const item of orderedItems) {
          if (
            item.height < 7.8 ||
            (item.font !== 'g_d0_f2' && !/^(fi|fl)$/i.test(item.text.trim()))
          ) {
            break
          }
          titleItems.push(item)
        }
      }
      const boldTitleText = repairText(joinItems(titleItems).replace(/^[-•–]\s*/, ''))
      const detailText = repairText(joinItems(orderedItems.slice(titleItems.length)))
      const beginsAtMargin = firstX <= conceptLeft + 8
      const strictLargeTitles =
        area.startsWith('Lenguas Extranjeras') ||
        area === 'Educación Artística' ||
        area === 'Educación Física'
      const titleHeight = Math.max(...conceptualItems.map((item) => item.height))
      const isBoldTitle =
        (Boolean(boldTitleText) && (!strictLargeTitles || titleHeight >= 8.8)) ||
        (beginsAtMargin && titleHeight >= 8.8)

      if (isBullet) {
        if (area === 'Educación Física') {
          const [unitTitle, ...detailParts] = value.split(':')
          currentUnit = { title: repairText(unitTitle), topics: [] }
          units.push(currentUnit)
          currentTopic = null
          const detail = repairText(detailParts.join(':'))
          if (detail) {
            currentUnit.topics.push(detail)
            currentTopic = 0
          }
          continue
        }
        if (isBoldTitle) {
          currentUnit = { title: boldTitleText.replace(/:$/, ''), topics: [] }
          units.push(currentUnit)
          currentTopic = null
          if (detailText) {
            const detail = detailText.replace(/^:\s*/, '')
            if (detail) {
              currentUnit.topics.push(detail)
              currentTopic = 0
            }
          }
          continue
        }
        if (!currentUnit) continue
        currentUnit.topics.push(value)
        currentTopic = currentUnit.topics.length - 1
        continue
      }

      if (
        currentUnit &&
        (firstX > conceptLeft + 8 ||
          /^[a-záéíóúüñ]/.test(value) ||
          (isBoldTitle && currentUnit.topics.length === 0 && verticalGap <= 11))
      ) {
        if (currentTopic !== null && !isBoldTitle) {
          currentUnit.topics[currentTopic] = appendText(
            currentUnit.topics[currentTopic],
            value,
          )
        } else {
          currentUnit.title = appendText(currentUnit.title, value)
        }
        continue
      }

      if (isBoldTitle || (beginsAtMargin && !currentUnit)) {
        currentUnit = { title: boldTitleText || value, topics: [] }
        units.push(currentUnit)
        currentTopic = null
        if (detailText) {
          currentUnit.topics.push(detailText.replace(/^:\s*/, ''))
          currentTopic = 0
        }
        continue
      }

      if (currentUnit) {
        const previousTopic =
          currentTopic === null ? '' : currentUnit.topics[currentTopic] ?? ''
        const previousNeedsContinuation = /[,;:(/-]$/.test(previousTopic)
        if (currentTopic === null || (beginsAtMargin && !previousNeedsContinuation)) {
          currentUnit.topics.push(value)
          currentTopic = currentUnit.topics.length - 1
        } else {
          currentUnit.topics[currentTopic] = appendText(currentUnit.topics[currentTopic], value)
        }
      }
    }

    if (indicatorItem) break
  }

  return uniqueUnits(units)
}

const catalog = {}
for (const [area, starts] of sources) {
  for (let index = 0; index < starts.length; index += 1) {
    catalog[`${index + 1}:${area}`] = await extractEntry(starts[index], area)
  }
}

for (const [area, grade, startPage, parserArea] of optionalSources) {
  const key = `${grade}:${area}`
  catalog[key] = uniqueUnits([
    ...(catalog[key] ?? []),
    ...(await extractEntry(startPage, parserArea)),
  ])
}

const correctedSingleUnitTitles = {
  '1:Formación Integral Humana y Religiosa': 'Cultura de la vida en todas sus formas',
  '2:Formación Integral Humana y Religiosa': 'Familia',
  '3:Formación Integral Humana y Religiosa': 'Valores que predicó y vivió Jesús de Nazaret',
  '4:Formación Integral Humana y Religiosa': 'Valores éticos y culturales',
  '5:Formación Integral Humana y Religiosa': 'Principios éticos y morales',
  '6:Formación Integral Humana y Religiosa': 'Jerarquía de los valores',
}
for (const [key, title] of Object.entries(correctedSingleUnitTitles)) {
  if (catalog[key]?.[0]) catalog[key][0].title = title
}

function consolidateByHeadings(key, headings) {
  const originalUnits = catalog[key] ?? []
  const consolidated = []
  let current = null
  for (const unit of originalUnits) {
    const heading = headings.find((candidate) =>
      normalized(unit.title).startsWith(normalized(candidate)),
    )
    if (heading) {
      current = { title: heading, topics: [...unit.topics] }
      consolidated.push(current)
      continue
    }
    if (!current) continue
    current.topics.push(unit.title, ...unit.topics)
  }
  catalog[key] = consolidated.length ? uniqueUnits(consolidated) : originalUnits
}

for (let grade = 1; grade <= 6; grade += 1) {
  consolidateByHeadings(`${grade}:Lenguas Extranjeras: Inglés`, [
    'Temas',
    'Vocabulario',
    'Expresiones',
    'Gramática',
  ])
  consolidateByHeadings(`${grade}:Lenguas Extranjeras: Francés`, [
    'Temas',
    'Vocabulario y expresiones',
    'Gramática',
  ])
}

consolidateByHeadings('4:Humanidades y Lenguas Modernas', [
  'La poesía romántica',
  'La novela de viajes y aventuras',
  'Vocabulario',
  'Expresiones',
  'Gramática',
])
consolidateByHeadings('5:Humanidades y Lenguas Modernas', [
  'La epopeya',
  'La novela policiaca',
  'Vocabulario',
  'Expresiones',
  'Gramática',
])
consolidateByHeadings('6:Humanidades y Lenguas Modernas', [
  'El editorial',
  'La columna periodística',
  'El anuncio publicitario',
  'La propaganda política',
  'Vocabulario',
  'Expresiones',
  'Gramática',
])

if (catalog['4:Humanidades y Ciencias Sociales']?.[0]) {
  catalog['4:Humanidades y Ciencias Sociales'][0].title = 'La novela autobiográfica'
}
consolidateByHeadings('4:Humanidades y Ciencias Sociales', [
  'La novela autobiográfica',
  'Filosofía y conocimiento, posibilidad y límites',
  'Filosofía y ser humano',
  'Filosofía y otros saberes',
  'La filosofía y la religión',
])
for (const unit of catalog['6:Humanidades y Ciencias Sociales'] ?? []) {
  if (/^derechos humanos e inmigrantes/i.test(unit.title)) {
    unit.title = 'Derechos humanos e inmigrantes'
  }
}

const exactTitleCorrections = {
  '3:Ciencias Sociales': {
    'Estadounidense 1900-1930': 'Expansionismo y hegemonía estadounidense (1900-1930)',
    'Unidos de América':
      'Fin de la Segunda Guerra Mundial, hegemonía de Estados Unidos de América',
  },
  '5:Ciencias Sociales': {
    Dominicana:
      'Actividades económicas primarias y recursos agroforestales de la República Dominicana',
    Pertenencia: 'Siglo XVII: crisis y sentimiento de pertenencia',
    '1801-1822': 'Parte Este de la isla de Santo Domingo (1801-1822)',
  },
  '6:Ciencias Sociales': {
    Domingo: 'Geografía de la isla de Santo Domingo',
    'Economía, sociedad, política': 'Economía, sociedad, política y expansión agroindustrial',
    '2004)': 'Cambios políticos y económicos en la República Dominicana (1966-2004)',
    '1978)': 'Los Doce Años de Balaguer (1966-1978)',
  },
}
for (const [key, corrections] of Object.entries(exactTitleCorrections)) {
  for (const unit of catalog[key] ?? []) {
    const normalizedTitle = unit.title.replace(/[.,]$/, '')
    if (corrections[normalizedTitle]) unit.title = corrections[normalizedTitle]
  }
}

const directTitleCorrections = {
  '4:Matemática y Tecnología': 'Interés compuesto',
  '5:Matemática y Tecnología': 'Estadística y probabilidad',
  '6:Matemática y Tecnología': 'Funciones cuádricas',
}
for (const [key, title] of Object.entries(directTitleCorrections)) {
  if (catalog[key]?.[0]) catalog[key][0].title = title
}

for (const units of Object.values(catalog)) {
  for (let index = units.length - 1; index > 0; index -= 1) {
    if (!/^\(optativ[oa]s?\)$/i.test(units[index].title)) continue
    const previous = units[index - 1]
    previous.title = `${previous.title} ${units[index].title}`
    previous.topics.push(...units[index].topics)
    units.splice(index, 1)
  }
}

const serialized = JSON.stringify(catalog, null, 2)
writeFileSync(
  resolve(outputPath),
  `// Generado desde la Adecuación Curricular del Nivel Secundario (MINERD).\n` +
    `export const secondaryCurriculumCatalog = ${serialized} as const\n`,
  'utf8',
)

console.log(
  `Catálogo estructurado: ${Object.keys(catalog).length} combinaciones, ` +
    `${Object.values(catalog).reduce((sum, units) => sum + units.length, 0)} unidades.`,
)
