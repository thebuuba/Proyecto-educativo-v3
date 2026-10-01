import { blocksIn, cleanText, heading, linesIn, searchText, stableUuid } from './layout.mjs'

export function scopeKey(context) {
  return [
    context.level,
    context.cycle ?? 'ALL',
    context.grade ?? 'ALL',
    searchText(context.areaName || 'ALL'),
    searchText(context.subjectName || 'ALL'),
    searchText(context.modalityName || 'ALL'),
    searchText(context.optativeExitName || 'ALL'),
  ].join('/')
}

export function elementRecord(context, type, block, pdfPage, column, index) {
  const stableKey = `${scopeKey(context)}/${type}/${pdfPage}/${column}/${index}`
  return {
    id: stableUuid(context.versionCode, stableKey),
    stableKey,
    scopeKey: scopeKey(context),
    type,
    originalText: block.originalText,
    normalizedText: searchText(cleanText(block.originalText)),
    reviewStatus: 'PENDING',
    sourceOrder: pdfPage * 10000 + column * 1000 + index,
    source: {
      pdfPage,
      printedPage: context.printedPage ?? null,
      sectionName: [context.optativeExitName, context.areaName, context.subjectName]
        .filter(Boolean)
        .join(' / '),
      boundingBox: block.boundingBox,
    },
  }
}

export function printedPageFromItems(items) {
  return items.find((item) => item.y < 35 && /^\d+$/u.test(item.text.trim()))?.text.trim() || null
}

export function contentElements(items, context, pdfPage, layout) {
  const explicitContent = heading(items, /^(?:CONTENIDOS|Contenidos)$/u)
  const columnHeadings = [
    heading(items, /^Conceptos$/iu),
    heading(items, /^(?:Procedimientos:?|Procedimien-)$/iu),
    heading(items, /^Actitudes y(?: Valores)?$/iu),
  ]
  const implicitContent =
    columnHeadings.every(Boolean) &&
    Math.max(...columnHeadings.map((item) => item.y)) -
      Math.min(...columnHeadings.map((item) => item.y)) <
      5
      ? { y: Math.max(...columnHeadings.map((item) => item.y)) + 15 }
      : null
  const indicators = heading(items, /^Indicadores de Logro(?: en correspondencia.*)?$/iu)
  // Some PDF pages retain a covered content-header layer beneath the visible
  // indicator panel (e.g. secondary 449). It is not a second content table.
  const coveredHeaderLayer =
    indicators && columnHeadings.every(Boolean) && columnHeadings.every((h) => h.y < indicators.y)
  const content = coveredHeaderLayer ? null : explicitContent || implicitContent
  const continuation = continuationType(items, layout.previousTable)
  const result = {
    elements: [],
    hasContent: Boolean(content),
    hasIndicators: Boolean(indicators),
    pending: [],
    tableState: null,
  }
  if (content) {
    const headings = {
      concept: heading(items, /^Conceptos$/iu, { top: content.y, bottom: content.y - 40 }),
      procedure: heading(items, /^(?:Procedimientos:?|Procedimien-)$/iu, {
        top: content.y,
        bottom: content.y - 40,
      }),
      attitude: heading(items, /^Actitudes y(?: Valores)?$/iu, {
        top: content.y,
        bottom: content.y - 40,
      }),
    }
    if (!headings.concept || !headings.procedure || !headings.attitude) {
      result.pending.push({ page: pdfPage, code: 'CONTENT_HEADERS_INCOMPLETE' })
    } else {
      const headingY = Math.min(headings.concept.y, headings.procedure.y, headings.attitude.y)
      const grid = items.rules || []
      const headerBottom = Math.max(
        0,
        ...grid
          .filter(
            (r) => r.axis === 'h' && r.to - r.from > 80 && r.at < headingY && r.at > headingY - 30,
          )
          .map((r) => r.at),
      )
      const top = headerBottom || headingY - 0.5
      const bottom = indicators && indicators.y < top ? indicators.y + indicators.height : 30
      const body = items.filter((item) => item.y < top && item.y > bottom)
      const bullets = body.filter((item) => /^[•●▪–-]$/u.test(item.text.trim()))
      const middleBullet = bullets
        .filter((item) => item.x >= 150 && item.x < 360)
        .map((item) => item.x)
      const rightBullet = bullets
        .filter((item) => item.x >= 380 && item.x < 540)
        .map((item) => item.x)
      const modal = (values) => {
        const counts = new Map()
        for (const value of values) {
          const rounded = Math.round(value / 3) * 3
          counts.set(rounded, (counts.get(rounded) || 0) + 1)
        }
        return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0]
      }
      const firstBorder = grid
        .filter(
          (r) =>
            r.axis === 'v' &&
            r.at > headings.concept.x &&
            r.at < headings.procedure.x &&
            r.from < top &&
            r.to >= top - 1,
        )
        .sort((a, b) => b.at - a.at)[0]
      const secondBorder = grid
        .filter(
          (r) =>
            r.axis === 'v' &&
            r.at > headings.procedure.x &&
            r.at < headings.attitude.x &&
            r.from < top &&
            r.to >= top - 1,
        )
        .sort((a, b) => b.at - a.at)[0]
      const conceptRight =
        firstBorder?.at ??
        Math.max(
          130,
          Math.min(
            255,
            modal(middleBullet) ??
              modal(body.filter((item) => item.x >= 170 && item.x < 340).map((item) => item.x)) ??
              layout.conceptRight,
          ),
        ) - 2
      const procedureRight =
        secondBorder?.at ??
        Math.max(
          405,
          Math.min(
            480,
            modal(rightBullet) ??
              modal(body.filter((item) => item.x >= 405 && item.x < 535).map((item) => item.x)) ??
              layout.procedureRight,
          ),
        ) - 2
      const columns = [
        ['CONCEPT', 0, conceptRight, 1],
        ['PROCEDURE', conceptRight, procedureRight, 2],
        ['ATTITUDE_VALUE', procedureRight, 612, 3],
      ]
      result.tableState = { kind: 'CONTENT', columns }
      let populatedColumns = 0
      for (const [type, left, right, column] of columns) {
        const blocks = blocksIn(
          items,
          { left, right, top, bottom },
          { removeHeaders: ['Conceptos', 'Procedimientos', 'Actitudes y Valores'] },
        )
        if (blocks.length) populatedColumns++
        for (const [index, block] of blocks.entries()) {
          result.elements.push(elementRecord(context, type, block, pdfPage, column, index))
        }
      }
      if (!populatedColumns) result.pending.push({ page: pdfPage, code: 'EMPTY_CONTENT_TABLE' })
    }
  }
  if (!content && !indicators && continuation === 'CONTENT') {
    const borders = longVerticals(items)
    const top = Math.min(...borders.map((r) => r.to))
    const columns = [
      ['CONCEPT', borders[0].at, borders[1].at, 1],
      ['PROCEDURE', borders[1].at, borders[2].at, 2],
      ['ATTITUDE_VALUE', borders[2].at, borders[3].at, 3],
    ]
    for (const [type, left, right, column] of columns) {
      for (const [i, block] of blocksIn(items, {
        left: left - 0.1,
        right: right - 0.1,
        top,
        bottom: 30,
      }).entries()) {
        result.elements.push(elementRecord(context, type, block, pdfPage, column, i))
      }
    }
    result.hasContent = true
    result.tableState = { kind: 'CONTENT', columns }
  }
  if (indicators || (!content && continuation === 'INDICATOR')) {
    const top = indicators ? indicators.y - 0.5 : Math.min(...longVerticals(items).map((r) => r.to))
    const visibleItems = coveredHeaderLayer ? items.slice(items.indexOf(indicators)) : items
    visibleItems.rules = items.rules
    const blocks = blocksIn(
      visibleItems,
      { left: 45, right: 570, top, bottom: 30 },
      { removeHeaders: ['Conceptos Procedimientos Actitudes y Valores'] },
    )
    let subsection = !indicators ? layout.previousTable?.subsection : null
    for (const [index, block] of blocks.entries()) {
      if (!/^\s*[•●▪–-]/u.test(block.originalText)) {
        if (block.originalText.length < 100 && !/[.!?]$/u.test(block.originalText)) {
          subsection = { text: block.originalText, pdfPage, boundingBox: block.boundingBox }
          continue
        }
        result.pending.push({
          page: pdfPage,
          code: 'UNCLASSIFIED_INDICATOR_BLOCK',
          text: block.originalText,
        })
      }
      const element = elementRecord(context, 'ACHIEVEMENT_INDICATOR', block, pdfPage, 4, index)
      if (subsection) element.source.subsection = subsection
      result.elements.push(element)
    }
    if (!blocks.length) result.pending.push({ page: pdfPage, code: 'EMPTY_INDICATORS' })
    result.hasIndicators = true
    result.tableState = { kind: 'INDICATOR', subsection }
  }
  return result
}

function longVerticals(items) {
  const borders = (items.rules || [])
    .filter((r) => r.axis === 'v' && r.to - r.from > 100 && r.at >= 40 && r.at <= 575)
    .sort((a, b) => a.at - b.at || b.to - b.from - (a.to - a.from))
  return borders.filter((r, i) => i === 0 || r.at - borders[i - 1].at > 1)
}

export function continuationType(items, previousTable) {
  if (!previousTable || hasMallaStructure(items)) return null
  const borders = longVerticals(items)
  if (borders.length === 4 && previousTable.kind === 'CONTENT') return 'CONTENT'
  if (
    borders.length === 2 &&
    borders[1].at - borders[0].at > 480 &&
    previousTable.kind === 'INDICATOR' &&
    items.some((item) => item.y > 35 && item.height < 15 && /^\s*[•●▪–-]/u.test(item.text))
  )
    return 'INDICATOR'
  return null
}

export function isSectionDivider(items) {
  const body = items.filter((item) => item.y > 35)
  return body.length < 12 && body.some((item) => item.height >= 20) && !hasMallaStructure(items)
}

export function gradeCompetencies(items, context, pdfPage, layout) {
  const elements = [],
    relations = [],
    pending = []
  const label = items
    .filter((item) => item.x < 250 && /^Comunicativa$/u.test(item.text.trim()))
    .sort((a, b) => b.y - a.y)[0]
  if (!label) return { elements, relations, pending }
  // A baseline is not a row boundary: multiline cells are vertically centred.
  // Read the actual vector borders instead of slicing at the next label's y.
  const vertical = (items.rules || [])
    .filter(
      (r) =>
        r.axis === 'v' &&
        r.at > label.x + label.width &&
        r.at < 350 &&
        r.from < label.y &&
        r.to > label.y,
    )
    .sort((a, b) => a.at - b.at)[0]
  if (!vertical)
    return { elements, relations, pending: [{ page: pdfPage, code: 'COMPETENCY_GRID_NOT_FOUND' }] }
  const split = vertical.at
  const rules = (items.rules || []).filter(
    (r) => r.axis === 'h' && r.from <= split + 1 && r.to > split + 80,
  )
  const top = Math.min(vertical.to, ...rules.filter((r) => r.at > label.y).map((r) => r.at))
  const content = heading(items, /^(?:CONTENIDOS|Contenidos)$/iu)
  const concept = heading(items, /^Conceptos$/iu)
  const lower =
    content && content.y < label.y
      ? content.y + 0.5
      : concept && concept.y < label.y
        ? concept.y + concept.height + 12
        : 43
  const boundaries = [
    ...new Set(
      [top, ...rules.filter((r) => r.at <= top + 0.2 && r.at > lower).map((r) => r.at)].map(
        (y) => Math.round(y * 10) / 10,
      ),
    ),
  ]
    .sort((a, b) => b - a)
    .filter((v, i, all) => i === 0 || all[i - 1] - v > 0.5)
  if (boundaries.length < 2)
    return { elements, relations, pending: [{ page: pdfPage, code: 'COMPETENCY_ROWS_NOT_FOUND' }] }
  for (let row = 0; row < boundaries.length - 1; row++) {
    const rowTop = boundaries[row],
      rowBottom = boundaries[row + 1]
    const merge = (blocks) =>
      blocks.length
        ? {
            originalText: blocks.map((b) => b.originalText).join('\n'),
            boundingBox: {
              x0: Math.min(...blocks.map((b) => b.boundingBox.x0)),
              y0: Math.min(...blocks.map((b) => b.boundingBox.y0)),
              x1: Math.max(...blocks.map((b) => b.boundingBox.x1)),
              y1: Math.max(...blocks.map((b) => b.boundingBox.y1)),
            },
          }
        : null
    const left = merge(
      blocksIn(items, { left: 40, right: split - 0.1, top: rowTop, bottom: rowBottom }),
    )
    const right = merge(
      blocksIn(items, { left: split - 0.1, right: 575, top: rowTop, bottom: rowBottom }),
    )
    if (
      !left ||
      !/^(Comunicativa|Pensamiento|(?:Competencia )?Resolución|Ética|Científica|Tecnológica|Ambiental|Desarrollo)/iu.test(
        left.originalText,
      )
    )
      continue
    if (!right) {
      pending.push({ page: pdfPage, code: 'COMPETENCY_ROW_WITHOUT_SPECIFIC', row })
      continue
    }
    const specific = elementRecord(context, 'SPECIFIC_COMPETENCY', right, pdfPage, 6, row)
    specific.source.tableCell = { left: split, right: 575, top: rowTop, bottom: rowBottom }
    elements.push(specific)
    // Keep the entire source cell literally, including grouped competencies.
    const fundamental = elementRecord(context, 'FUNDAMENTAL_COMPETENCY', left, pdfPage, 5, row)
    fundamental.source.tableCell = { left: 40, right: split, top: rowTop, bottom: rowBottom }
    elements.push(fundamental)
    relations.push({ fromId: fundamental.id, toId: specific.id, type: 'EXPLICITLY_LINKED' })
  }
  return { elements, relations, pending }
}

export function cycleCriteria(items, context, pdfPage) {
  const headings = items
    .filter((item) => /^Criterios de Evaluación$/iu.test(item.text.trim()))
    .sort((a, b) => b.y - a.y)
  const elements = []
  elements.scopes = []
  const grid = items.rules || []
  for (const [sectionIndex, section] of headings.entries()) {
    const top =
      Math.max(
        0,
        ...grid
          .filter(
            (r) =>
              r.axis === 'h' && r.to - r.from > 100 && r.at < section.y && r.at > section.y - 25,
          )
          .map((r) => r.at),
      ) || section.y - 0.5
    const borders = grid
      .filter(
        (r) => r.axis === 'v' && r.from < top - 5 && r.to > top - 5 && r.at >= 40 && r.at <= 575,
      )
      .sort((a, b) => a.at - b.at || b.to - b.from - (a.to - a.from))
      .filter((r, i, all) => i === 0 || r.at - all[i - 1].at > 1)
    if (borders.length < 2) throw Error('CRITERIA_COLUMNS_NOT_FOUND:' + pdfPage)
    const bottom = Math.max(20, ...borders.map((r) => r.from))
    for (let c = 0; c < borders.length - 1; c++) {
      const left = borders[c].at,
        right = borders[c + 1].at
      const gradeLabel = items
        .filter(
          (i) =>
            i.x >= left &&
            i.x < right &&
            i.y > section.y &&
            /^(Primero|Segundo|Tercero|Cuarto|Quinto|Sexto)$/u.test(i.text.trim()),
        )
        .sort((a, b) => a.y - b.y)[0]
      const grade =
        borders.length === 4 && gradeLabel
          ? ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'].indexOf(
              gradeLabel.text.trim(),
            ) + 1
          : null
      const scope = { ...context, grade, cycle: grade ? (grade <= 3 ? 1 : 2) : context.cycle }
      elements.scopes.push(scope)
      for (const [i, block] of blocksIn(items, {
        left: left - 0.1,
        right: right - 0.1,
        top,
        bottom,
      }).entries()) {
        const element = elementRecord(
          scope,
          'EVALUATION_CRITERION',
          block,
          pdfPage,
          7 + sectionIndex * 4 + c,
          i,
        )
        element.source.tableCell = { left, right, top, bottom }
        element.source.explicitCriterionHeading = { text: section.text, pdfPage, y: section.y }
        elements.push(element)
      }
    }
  }
  return elements
}

export function headerContext(items, level, previous = {}) {
  const lines = linesIn(items, { left: 40, right: 570, top: 750, bottom: 470 })
  const levelLine = lines.find((line) =>
    new RegExp(
      `Nivel:?\\s*(?:de\\s+)?${level === 'PRIMARY' ? 'Primario' : 'Secundario'}`,
      'iu',
    ).test(line.text),
  )
  const gradeItem =
    items.find(
      (item) => item.y > 470 && /\b[1-6]\s*(?:er|do|to|mo|vo)\.?\s*Grado\b/iu.test(item.text),
    ) ||
    items.find(
      (item) =>
        item.y > 470 &&
        item.x > 450 &&
        /^[1-6]\s*(?:er|do|to|mo|vo)\.?$/iu.test(item.text.trim()) &&
        items.some(
          (other) =>
            other.x > 450 && Math.abs(other.y - item.y) < 20 && /^Grado$/iu.test(other.text.trim()),
        ),
    )
  if (!levelLine || !gradeItem) return null
  const grade = Number(gradeItem.text.match(/[1-6]/u)?.[0])
  const cycle = /Primer Ciclo/iu.test(levelLine.text)
    ? 1
    : /Segundo Ciclo/iu.test(levelLine.text)
      ? 2
      : null
  if (!grade || !cycle) return null
  const areaLine = lines.find(
    (line) => Math.abs(line.y - gradeItem.y) < 40 && /Área\s+de\s+/iu.test(line.text),
  )
  let areaName =
    areaLine?.text.match(/Área\s+de\s+(.+?)(?=\s+Nivel\s+|$)/iu)?.[1]?.trim() || previous.areaName
  if (areaLine && /^(?:Formación Integral|Ciencias de la)$/u.test(areaName)) {
    const continuation = linesIn(items, {
      left: 40,
      right: 280,
      top: areaLine.y - 0.5,
      bottom: areaLine.y - 25,
    })
      .map((l) => l.text)
      .find((t) => /^(?:Humana y Religiosa|Naturaleza)$/u.test(t))
    if (continuation) areaName += ' ' + continuation
  }
  return { level, cycle, grade, areaName }
}

export function hasMallaStructure(items) {
  return Boolean(
    (heading(items, /^Conceptos$/iu) && heading(items, /^(?:Procedimientos:?|Procedimien-)$/iu)) ||
    heading(items, /^Indicadores de Logro(?: en correspondencia.*)?$/iu) ||
    (items.some((item) => item.x < 250 && /^Comunicativa$/u.test(item.text.trim())) &&
      items.some((item) => /^Competencias/u.test(item.text.trim()))),
  )
}

export function hasUnresolvedGradeHeader(items) {
  return items.some(
    (item) =>
      item.y > 470 &&
      (/\b[1-6]\s*(?:er|do|to|mo|vo)\.?\s*Grado\b/iu.test(item.text) ||
        (item.x > 420 && /^[1-6]\s*(?:er|do|to|mo|vo)\.?$/iu.test(item.text.trim()))),
  )
}
