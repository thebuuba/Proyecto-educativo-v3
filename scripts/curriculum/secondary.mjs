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

const layout = { conceptRight: 183, procedureRight: 467, competencySplit: 183 }
const optativeSections = [
  { from: 427, through: 460, name: 'Humanidades y Lenguas Modernas' },
  { from: 461, through: 489, name: 'Humanidades y Ciencias Sociales' },
  { from: 490, through: 497, name: 'Matemática y Tecnología' },
  { from: 498, through: 517, name: 'Ciencias y Tecnología' },
]

// Transcripción acotada de las cuatro tablas "Asignaturas por Grados" del PDF.
// No contiene elementos curriculares; se contrasta con los encabezados de cada malla.
const optativeAssignments = [
  [
    'Humanidades y Lenguas Modernas',
    'Lengua Española',
    4,
    'Apreciación y Producción Literarias',
    427,
  ],
  [
    'Humanidades y Lenguas Modernas',
    'Lengua Española',
    5,
    'Apreciación y Producción Literarias',
    427,
  ],
  [
    'Humanidades y Lenguas Modernas',
    'Lengua Española',
    6,
    'Análisis y Producción de Textos Periodísticos y Publicitarios',
    427,
  ],
  [
    'Humanidades y Lenguas Modernas',
    'Lenguas Extranjeras',
    4,
    'Manejo de la información en inglés',
    427,
  ],
  [
    'Humanidades y Lenguas Modernas',
    'Lenguas Extranjeras',
    5,
    'Apreciación de la Literatura Anglófona',
    427,
  ],
  [
    'Humanidades y Lenguas Modernas',
    'Lenguas Extranjeras',
    6,
    'Análisis Crítico y Evaluación de Textos en Inglés',
    427,
  ],
  [
    'Humanidades y Ciencias Sociales',
    'Lengua Española',
    4,
    'Apreciación y Producción Literarias',
    461,
  ],
  [
    'Humanidades y Ciencias Sociales',
    'Lengua Española',
    5,
    'Apreciación y Producción Literarias',
    461,
  ],
  [
    'Humanidades y Ciencias Sociales',
    'Lengua Española',
    6,
    'Análisis y Producción de Textos Científicos y Profesionales',
    461,
  ],
  [
    'Humanidades y Ciencias Sociales',
    'Ciencias Sociales',
    4,
    'Filosofía social y Pensamiento Dominicano',
    461,
  ],
  ['Humanidades y Ciencias Sociales', 'Ciencias Sociales', 5, 'Geografía Humana y Demografía', 461],
  [
    'Humanidades y Ciencias Sociales',
    'Ciencias Sociales',
    6,
    'Ciudadanía y Democracia Participativa',
    461,
  ],
  ['Matemática y Tecnología', 'Matemática', 4, 'Matemática Financiera y Tecnología', 490],
  ['Matemática y Tecnología', 'Matemática', 5, 'Estadística Probabilidad y Tecnología', 490],
  [
    'Matemática y Tecnología',
    'Matemática',
    6,
    'Tigonometría, Cálculo Diferencial y Tecnología',
    490,
  ],
  ['Ciencias y Tecnología', 'Ciencias de la Naturaleza', 4, 'Biología y Computación', 498],
  ['Ciencias y Tecnología', 'Ciencias de la Naturaleza', 5, 'Química y Computación', 498],
  ['Ciencias y Tecnología', 'Ciencias de la Naturaleza', 6, 'Física y Computación', 498],
]

export function optativeAssignment(exitName, areaName, grade) {
  return (
    optativeAssignments.find(
      ([candidateExit, candidateArea, candidateGrade]) =>
        searchText(candidateExit) === searchText(exitName || '') &&
        searchText(candidateArea) === searchText(areaName || '') &&
        candidateGrade === grade,
    ) || null
  )
}

export function optativeExitAt(pdfPage) {
  return (
    optativeSections.find((section) => pdfPage >= section.from && pdfPage <= section.through)
      ?.name || null
  )
}

export function createSecondaryAdapter(versionCode) {
  let current = null
  let previousTable = null
  let previousScopeKey = null
  let chapterArea = null
  let chapterCycle = null
  let languageSubject = null
  const lastGrade = new Map()
  const seenScopes = new Map()
  return {
    extract(pageNumber, items) {
      if (isSectionDivider(items)) {
        current = null
        previousTable = null
        previousScopeKey = null
      }
      const topLines = linesIn(items, { left: 40, right: 570, top: 750, bottom: 580 }).map(
        (line) => line.text,
      )
      const topText = topLines.join(' ')
      if (items.some((item) => item.text.trim() === 'INGLÉS')) languageSubject = 'Inglés'
      if (items.some((item) => item.text.trim() === 'FRANCÉS')) languageSubject = 'Francés'
      const chapterLine = topLines.find((line) => /Contextualización del Área/iu.test(line))
      const chapter = chapterLine?.match(
        /Contextualización del Área(?: de)? (.+?)(?: en el (?:Nivel Secundario|Primer Ciclo|Segundo Ciclo)|$)/iu,
      )
      if (chapter) {
        chapterArea = /^Lenguas Extrajeras/iu.test(chapter[1])
          ? 'Lenguas Extranjeras'
          : chapter[1].trim()
        current = null
      }
      if (/Primer Ciclo/iu.test(topText)) chapterCycle = 1
      if (/Segundo Ciclo/iu.test(topText)) chapterCycle = 2

      const optativeExitName = optativeExitAt(pageNumber)
      if (optativeExitName && current?.optativeExitName !== optativeExitName) chapterArea = null
      if (current && current.optativeExitName !== optativeExitName) current = null
      const header = correctedHeader(
        headerContext(items, 'SECONDARY', current || {}),
        'SECONDARY',
        pageNumber,
      )
      const pending = []
      for (const [, , , subject, gridPage] of optativeAssignments.filter(
        (assignment) => assignment[4] === pageNumber,
      )) {
        const sourceWords = new Set(searchText(items.map((item) => item.text).join(' ')).split(' '))
        if (
          searchText(subject)
            .split(' ')
            .some((word) => !sourceWords.has(word))
        ) {
          pending.push({ page: pageNumber, code: 'OPTATIVE_GRID_TEXT_NOT_FOUND', subject })
        }
      }
      if (!header && hasMallaStructure(items) && hasUnresolvedGradeHeader(items)) {
        pending.push({ page: pageNumber, code: 'UNRESOLVED_GRADE_HEADER' })
        current = null
      }
      if (header) {
        const actual = searchText(header.areaName || '')
        const expected = searchText(chapterArea || '')
        const compatible =
          expected.startsWith(actual) ||
          actual.startsWith(expected) ||
          (expected.startsWith('lenguas extranjer') && actual.startsWith('lengua extranjer')) ||
          (expected.startsWith('lenguas extraje') &&
            (actual.startsWith('lenguas extra') || actual.startsWith('lengua extra')))
        if (expected && actual && !compatible) {
          pending.push({
            page: pageNumber,
            code: 'HEADER_CHAPTER_AREA_CONFLICT',
            headerArea: header.areaName,
            chapterArea,
          })
          current = null
        } else {
          const areaName =
            expected && expected.startsWith(actual)
              ? chapterArea
              : /^Lengua?s? Extranj/iu.test(header.areaName)
                ? 'Lenguas Extranjeras'
                : header.areaName
          const assignment = optativeExitName
            ? optativeAssignment(optativeExitName, areaName, header.grade)
            : null
          if (optativeExitName && !assignment)
            pending.push({
              page: pageNumber,
              code: 'OPTATIVE_ASSIGNMENT_MISSING',
              optativeExitName,
              areaName,
              grade: header.grade,
            })
          const headerLines = linesIn(items, { left: 40, right: 570, top: 750, bottom: 470 })
          const subjectLine = headerLines.find((line) => /Asignatura\s*:/iu.test(line.text))
          const gradeItem =
            items.find(
              (item) =>
                item.y > 470 && /\b[1-6]\s*(?:er|do|to|mo|vo)\.?\s*Grado\b/iu.test(item.text),
            ) ||
            items.find(
              (item) =>
                item.y > 470 &&
                item.x > 450 &&
                /^[1-6]\s*(?:er|do|to|mo|vo)\.?$/iu.test(item.text.trim()),
            )
          const unlabelledSubject =
            optativeExitName && gradeItem
              ? items
                  .filter(
                    (item) =>
                      item.x >= 280 &&
                      item.x < 500 &&
                      Math.abs(item.y - gradeItem.y) < 25 &&
                      item.text.trim().length > 5 &&
                      !/(?:Nivel|Ciclo|Competencia|Grado|Área|Salida|Optativa|Asignatura)/iu.test(
                        item.text,
                      ),
                  )
                  .sort((a, b) => b.text.length - a.text.length)[0]
                  ?.text.trim()
              : null
          const headerSubject =
            subjectLine?.text
              .match(/Asignatura\s*:\s*(.+?)(?=\s+\d(?:er|do|to)\.?\s*Grado|$)/iu)?.[1]
              ?.trim() || unlabelledSubject
          const subjectName =
            assignment?.[3] ||
            headerSubject ||
            (areaName === 'Lenguas Extranjeras' && !optativeExitName ? languageSubject : null) ||
            (current?.optativeExitName === optativeExitName && current.areaName === areaName
              ? current.subjectName
              : null) ||
            areaName
          if (
            assignment &&
            headerSubject &&
            !searchText(assignment[3]).startsWith(searchText(headerSubject)) &&
            !searchText(headerSubject).startsWith(searchText(assignment[3]))
          ) {
            pending.push({
              page: pageNumber,
              code: 'OPTATIVE_SUBJECT_HEADER_CONFLICT',
              gridSubject: assignment[3],
              headerSubject,
            })
          }
          const gradeKey = `${header.cycle}/${searchText(areaName)}/${searchText(optativeExitName || '')}/${searchText(subjectName)}`
          const previousGrade = lastGrade.get(gradeKey)
          if (previousGrade && header.grade < previousGrade) {
            pending.push({
              page: pageNumber,
              code: 'GRADE_REGRESSION',
              headerGrade: header.grade,
              previousGrade,
              areaName,
              subjectName,
            })
            current = null
          } else {
            current = {
              ...header,
              areaName,
              versionCode,
              subjectName,
              modalityName: optativeExitName ? 'Académica' : null,
              optativeExitName,
              assignmentSourcePdfPage: assignment?.[4] || null,
            }
            chapterCycle = header.cycle
            lastGrade.set(gradeKey, header.grade)
            seenScopes.set(scopeKey(current), current)
          }
        }
      }
      if (!current || scopeKey(current) !== previousScopeKey) previousTable = null
      const hasMalla =
        pageNumber >= 59 && (hasMallaStructure(items) || continuationType(items, previousTable))
      const elements = []
      const relations = []
      if (hasMalla && !current) {
        pending.push({ page: pageNumber, code: 'SECONDARY_MALLA_WITHOUT_GRADE_CONTEXT' })
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

      if (
        !header &&
        !optativeExitName &&
        chapterArea &&
        chapterCycle &&
        heading(items, /^Criterios de Evaluación$/iu)
      ) {
        const cycleScope = {
          level: 'SECONDARY',
          cycle: chapterCycle,
          grade: null,
          areaName: chapterArea,
          subjectName: chapterArea === 'Lenguas Extranjeras' ? languageSubject : chapterArea,
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
