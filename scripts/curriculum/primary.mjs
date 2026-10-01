import {
  contentElements,
  cycleCriteria,
  gradeCompetencies,
  hasUnresolvedGradeHeader,
  headerContext,
  printedPageFromItems,
  scopeKey,
  hasMallaStructure,
  continuationType,
} from './malla.mjs'
import { correctedHeader } from './source-anomalies.mjs'
import { heading, linesIn, searchText } from './layout.mjs'
import { isSectionDivider } from './malla.mjs'

const layout = { conceptRight: 190, procedureRight: 475, competencySplit: 190 }

export function createPrimaryAdapter(versionCode) {
  let current = null
  let previousTable = null
  let previousScopeKey = null
  let chapterArea = null
  let chapterCycle = null
  const lastGrade = new Map()
  const seenScopes = new Map()
  return {
    extract(pageNumber, items) {
      if (isSectionDivider(items)) {
        current = null
        previousTable = null
        previousScopeKey = null
      }
      const topLines = linesIn(items, { left: 40, right: 570, top: 750, bottom: 600 }).map(
        (line) => line.text,
      )
      const pageText = topLines.join(' ')
      if (/Primer Ciclo/iu.test(pageText) && chapterCycle !== 1) {
        chapterCycle = 1
        chapterArea = null
        current = null
      }
      if (/Segundo Ciclo/iu.test(pageText) && chapterCycle !== 2) {
        chapterCycle = 2
        chapterArea = null
        current = null
      }
      const chapterLine = topLines.find((line) =>
        /Contextualización (?:del Área|del (?:Primer|Segundo) Ciclo en el Área)/iu.test(line),
      )
      const chapter = chapterLine?.match(
        /Contextualización (?:del Área(?: de)?|del (?:Primer|Segundo) Ciclo en el Área de) (.+?)(?: en el (?:Nivel Primario|Primer Ciclo|Segundo Ciclo)|$)/iu,
      )
      if (chapter) {
        chapterArea = chapter[1].replace(/\s+en el$/iu, '').trim()
        current = null
      }

      const header = correctedHeader(
        headerContext(items, 'PRIMARY', current || {}),
        'PRIMARY',
        pageNumber,
      )
      const pending = []
      if (!header && hasMallaStructure(items) && hasUnresolvedGradeHeader(items)) {
        pending.push({ page: pageNumber, code: 'UNRESOLVED_GRADE_HEADER' })
        current = null
      }
      if (header) {
        const actual = searchText(header.areaName || '')
        const expected = searchText(chapterArea || '')
        if (expected && actual && !expected.startsWith(actual) && !actual.startsWith(expected)) {
          pending.push({
            page: pageNumber,
            code: 'HEADER_CHAPTER_AREA_CONFLICT',
            headerArea: header.areaName,
            chapterArea,
          })
          current = null
        } else {
          const areaName = expected && expected.startsWith(actual) ? chapterArea : header.areaName
          const gradeKey = `${header.cycle}/${searchText(areaName)}`
          const previousGrade = lastGrade.get(gradeKey)
          if (previousGrade && header.grade < previousGrade) {
            pending.push({
              page: pageNumber,
              code: 'GRADE_REGRESSION',
              headerGrade: header.grade,
              previousGrade,
              areaName,
            })
            current = null
          } else {
            current = { ...header, areaName, versionCode, subjectName: areaName }
            chapterCycle = header.cycle
            lastGrade.set(gradeKey, header.grade)
            seenScopes.set(scopeKey(current), current)
          }
        }
      }
      if (!current || scopeKey(current) !== previousScopeKey) previousTable = null
      const hasMalla =
        pageNumber >= 50 && (hasMallaStructure(items) || continuationType(items, previousTable))
      const elements = []
      const relations = []
      if (hasMalla && !current) {
        pending.push({ page: pageNumber, code: 'PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT' })
      } else if (hasMalla) {
        const pageContext = { ...current, printedPage: printedPageFromItems(items) }
        const grade = gradeCompetencies(items, pageContext, pageNumber, layout)
        const content = contentElements(items, pageContext, pageNumber, {
          ...layout,
          previousTable,
        })
        previousTable = content.tableState
        elements.push(...grade.elements, ...content.elements)
        relations.push(...grade.relations)
        pending.push(...grade.pending, ...content.pending)
      }

      // La fuente agrupa estos criterios por ciclo/área; no se adjudican a un grado.
      if (!header && chapterArea && chapterCycle && heading(items, /^Criterios de Evaluación$/iu)) {
        const cycleScope = {
          level: 'PRIMARY',
          cycle: chapterCycle,
          grade: null,
          areaName: chapterArea,
          subjectName: chapterArea,
          versionCode,
          printedPage: printedPageFromItems(items),
        }
        seenScopes.set(scopeKey(cycleScope), cycleScope)
        const criteria = cycleCriteria(items, cycleScope, pageNumber)
        for (const scope of criteria.scopes) seenScopes.set(scopeKey(scope), scope)
        elements.push(...criteria)
      }
      if (!hasMalla) previousTable = null
      previousScopeKey = current ? scopeKey(current) : null
      return {
        elements,
        relations,
        pending,
        scopes: [...seenScopes.values()],
        context: current,
        mallaDetected: hasMalla,
      }
    },
  }
}
