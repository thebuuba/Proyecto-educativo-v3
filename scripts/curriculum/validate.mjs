import { searchText } from './layout.mjs'
import { optativeAssignment } from './secondary.mjs'

export const elementTypes = new Set([
  'FUNDAMENTAL_COMPETENCY',
  'SPECIFIC_COMPETENCY',
  'EVALUATION_CRITERION',
  'ACHIEVEMENT_INDICATOR',
  'CONCEPT',
  'PROCEDURE',
  'ATTITUDE_VALUE',
])

// Inventario de cobertura tomado de los índices de los PDF y de las cuatro
// tablas de asignaturas por grado; no alimenta el catálogo ni sustituye el PDF.
const primaryAreas = [
  'Lengua Española',
  'Matemática',
  'Ciencias Sociales',
  'Ciencias de la Naturaleza',
  'Educación Física',
  'Formación Integral Humana y Religiosa',
  'Educación Artística',
]
const secondarySubjects = [
  ['Lengua Española', 'Lengua Española'],
  ['Lenguas Extranjeras', 'Inglés'],
  ['Lenguas Extranjeras', 'Francés'],
  ['Matemática', 'Matemática'],
  ['Ciencias Sociales', 'Ciencias Sociales'],
  ['Ciencias de la Naturaleza', 'Ciencias de la Naturaleza'],
  ['Educación Artística', 'Educación Artística'],
  ['Educación Física', 'Educación Física'],
  ['Formación Integral Humana y Religiosa', 'Formación Integral Humana y Religiosa'],
]
const optionalAreas = [
  ['Humanidades y Lenguas Modernas', 'Lengua Española'],
  ['Humanidades y Lenguas Modernas', 'Lenguas Extranjeras'],
  ['Humanidades y Ciencias Sociales', 'Lengua Española'],
  ['Humanidades y Ciencias Sociales', 'Ciencias Sociales'],
  ['Matemática y Tecnología', 'Matemática'],
  ['Ciencias y Tecnología', 'Ciencias de la Naturaleza'],
]

export function expectedMatrix(level) {
  const expected = []
  if (level === 'PRIMARY') {
    for (let grade = 1; grade <= 6; grade++) {
      for (const area of [...primaryAreas, ...(grade >= 4 ? ['Lenguas Extranjeras-inglés'] : [])]) {
        expected.push({ grade, area, subject: area, exit: null })
      }
    }
  } else {
    for (let grade = 1; grade <= 6; grade++) {
      for (const [area, subject] of secondarySubjects)
        expected.push({ grade, area, subject, exit: null })
    }
    for (let grade = 4; grade <= 6; grade++) {
      for (const [exit, area] of optionalAreas) expected.push({ grade, area, subject: null, exit })
    }
  }
  return expected
}

export function validateDataset(dataset) {
  const errors = []
  const scopeMap = new Map(dataset.scopes.map((scope) => [scope.stableKey, scope]))
  const elementMap = new Map()
  const idSet = new Set()
  const keySet = new Set()
  for (const scope of dataset.scopes) {
    if (scope.level !== dataset.version.level)
      errors.push(`SCOPE_LEVEL_MISMATCH:${scope.stableKey}`)
    if (
      scope.grade !== null &&
      (!Number.isInteger(scope.grade) || scope.grade < 1 || scope.grade > 6)
    )
      errors.push(`INVALID_GRADE:${scope.stableKey}`)
    if (scope.grade !== null && scope.cycle !== (scope.grade <= 3 ? 1 : 2))
      errors.push(`INVALID_CYCLE:${scope.stableKey}`)
    if (!scope.areaName && scope.grade !== null) errors.push(`AREA_MISSING:${scope.stableKey}`)
    if (
      scope.optativeExitName &&
      (scope.level !== 'SECONDARY' || scope.modalityName !== 'Académica' || scope.grade < 4)
    )
      errors.push(`INVALID_OPTATIVE:${scope.stableKey}`)
    if (scope.grade !== null) {
      const expected = expectedMatrix(dataset.version.level).find(
        (e) =>
          e.grade === scope.grade &&
          searchText(e.area) === searchText(scope.areaName || '') &&
          searchText(e.exit || '') === searchText(scope.optativeExitName || ''),
      )
      if (!expected) errors.push(`UNEXPECTED_SCOPE:${scope.stableKey}`)
      if (
        scope.optativeExitName &&
        optativeAssignment(scope.optativeExitName, scope.areaName, scope.grade)?.[3] !==
          scope.subjectName
      )
        errors.push(`INCOMPATIBLE_SUBJECT:${scope.stableKey}`)
      if (
        !scope.optativeExitName &&
        !expectedMatrix(dataset.version.level).some(
          (e) =>
            e.grade === scope.grade &&
            searchText(e.area) === searchText(scope.areaName || '') &&
            searchText(e.subject || '') === searchText(scope.subjectName || ''),
        )
      )
        errors.push(`INCOMPATIBLE_SUBJECT:${scope.stableKey}`)
    }
  }
  for (const element of dataset.elements) {
    if (idSet.has(element.id)) errors.push(`DUPLICATE_ID:${element.id}`)
    if (keySet.has(element.stableKey)) errors.push(`DUPLICATE_KEY:${element.stableKey}`)
    idSet.add(element.id)
    keySet.add(element.stableKey)
    elementMap.set(element.id, element)
    if (!elementTypes.has(element.type)) errors.push(`INVALID_ELEMENT_TYPE:${element.stableKey}`)
    if (!scopeMap.has(element.scopeKey)) errors.push(`ORPHAN_ELEMENT:${element.stableKey}`)
    if (!element.originalText?.trim() || !element.normalizedText?.trim())
      errors.push(`EMPTY_TEXT:${element.stableKey}`)
    if (
      !element.source ||
      element.source.pdfPage < 1 ||
      element.source.pdfPage > dataset.document.pageCount
    )
      errors.push(`INVALID_SOURCE:${element.stableKey}`)
    if (element.normalizedText !== searchText(element.originalText.replace(/^\s*[•●▪–-]\s*/u, '')))
      errors.push(`NORMALIZATION_MISMATCH:${element.stableKey}`)
    const box = element.source?.boundingBox,
      cell = element.source?.tableCell
    if (!box || !Object.values(box).every(Number.isFinite) || box.x0 >= box.x1 || box.y0 >= box.y1)
      errors.push(`INVALID_BOUNDING_BOX:${element.stableKey}`)
    if (
      cell &&
      box &&
      (box.y0 < cell.bottom - 1 ||
        box.y1 > cell.top + 2 ||
        box.x0 < cell.left - 2 ||
        box.x1 > cell.right + 2)
    )
      errors.push(`CELL_TEXT_OVERFLOW:${element.stableKey}`)
    if (
      /^(?:Competencias Fundamentales|Competencias Específicas del Grado|Criterios de Evaluación|CONTENIDOS|Indicadores de Logro)$/imu.test(
        element.originalText,
      )
    )
      errors.push(`EMBEDDED_HEADER:${element.stableKey}`)
    const maxLength = element.type === 'SPECIFIC_COMPETENCY' ? 1000 : 3000
    if (element.originalText.length > maxLength)
      errors.push(`EXCESSIVE_BLOCK_LENGTH:${element.stableKey}`)
    if (element.type === 'SPECIFIC_COMPETENCY' && !cell)
      errors.push(`COMPETENCY_WITHOUT_CELL:${element.stableKey}`)
    if (element.type === 'ACHIEVEMENT_INDICATOR' && !/^\s*[•●▪–-]/u.test(element.originalText))
      errors.push(`INDICATOR_WITHOUT_SOURCE_BULLET:${element.stableKey}`)
    if (element.type === 'EVALUATION_CRITERION' && !element.source?.explicitCriterionHeading)
      errors.push(`CRITERION_WITHOUT_EXPLICIT_SOURCE:${element.stableKey}`)
    if (element.source?.documentId !== dataset.document.id)
      errors.push(`SOURCE_DOCUMENT_MISMATCH:${element.stableKey}`)
  }
  for (const relation of dataset.relations) {
    if (!elementMap.has(relation.fromId) || !elementMap.has(relation.toId))
      errors.push(`ORPHAN_RELATION:${relation.fromId}:${relation.toId}`)
    else if (elementMap.get(relation.fromId).scopeKey !== elementMap.get(relation.toId).scopeKey)
      errors.push(`CROSS_SCOPE_RELATION:${relation.fromId}:${relation.toId}`)
  }
  for (const grade of [1, 2, 3, 4, 5, 6]) {
    if (!dataset.scopes.some((scope) => scope.grade === grade))
      errors.push(`GRADE_NOT_COVERED:${grade}`)
  }
  for (const expected of expectedMatrix(dataset.version.level)) {
    const scope = dataset.scopes.find(
      (candidate) =>
        candidate.grade === expected.grade &&
        searchText(candidate.areaName || '') === searchText(expected.area) &&
        searchText(candidate.optativeExitName || '') === searchText(expected.exit || '') &&
        (!expected.subject ||
          searchText(candidate.subjectName || '') === searchText(expected.subject)),
    )
    if (!scope) {
      errors.push(
        `EXPECTED_SCOPE_MISSING:${expected.grade}:${expected.area}:${expected.subject || ''}:${expected.exit || ''}`,
      )
      continue
    }
    const types = new Set(
      dataset.elements
        .filter((element) => element.scopeKey === scope.stableKey)
        .map((element) => element.type),
    )
    for (const type of [
      'SPECIFIC_COMPETENCY',
      'ACHIEVEMENT_INDICATOR',
      'CONCEPT',
      'PROCEDURE',
      'ATTITUDE_VALUE',
    ]) {
      if (!types.has(type)) errors.push(`SCOPE_ELEMENT_MISSING:${scope.stableKey}:${type}`)
    }
    const specifics = dataset.elements.filter(
      (e) => e.scopeKey === scope.stableKey && e.type === 'SPECIFIC_COMPETENCY',
    )
    if (specifics.length !== (dataset.version.level === 'PRIMARY' ? 3 : 7))
      errors.push(`COMPETENCY_ROW_COUNT:${scope.stableKey}:${specifics.length}`)
    if (
      new Set(specifics.map((e) => JSON.stringify([e.source?.pdfPage, e.source?.tableCell])))
        .size !== specifics.length
    )
      errors.push(`CONCATENATED_OR_DUPLICATED_CELL:${scope.stableKey}`)
  }
  if (dataset.version.level === 'SECONDARY') {
    for (const exitName of [
      'Humanidades y Lenguas Modernas',
      'Humanidades y Ciencias Sociales',
      'Matemática y Tecnología',
      'Ciencias y Tecnología',
    ]) {
      if (!dataset.scopes.some((scope) => scope.optativeExitName === exitName))
        errors.push(`OPTATIVE_NOT_COVERED:${exitName}`)
    }
  }
  const pagesWithElements = new Set(dataset.elements.map((element) => element.source.pdfPage))
  for (const page of dataset.mallaPages) {
    if (!pagesWithElements.has(page)) errors.push(`MALLA_PAGE_EMPTY:${page}`)
  }
  return { errors: [...new Set(errors)], pending: dataset.pending }
}

export function coverageManifest(dataset) {
  const validation = validateDataset(dataset)
  const types = Object.fromEntries(
    [...elementTypes].map((type) => [
      type,
      dataset.elements.filter((element) => element.type === type).length,
    ]),
  )
  const matrix = dataset.scopes
    .filter((scope) => scope.grade !== null)
    .map((scope) => {
      const elements = dataset.elements.filter((element) => element.scopeKey === scope.stableKey)
      return {
        level: scope.level,
        cycle: scope.cycle,
        grade: scope.grade,
        area: scope.areaName,
        subject: scope.subjectName,
        modality: scope.modalityName,
        optativeExit: scope.optativeExitName,
        concepts: elements.filter((element) => element.type === 'CONCEPT').length,
        procedures: elements.filter((element) => element.type === 'PROCEDURE').length,
        attitudes: elements.filter((element) => element.type === 'ATTITUDE_VALUE').length,
        indicators: elements.filter((element) => element.type === 'ACHIEVEMENT_INDICATOR').length,
        competencies: elements.filter((element) => element.type.endsWith('COMPETENCY')).length,
        specificCompetencies: elements.filter((element) => element.type === 'SPECIFIC_COMPETENCY')
          .length,
        criteria: elements.filter((element) => element.type === 'EVALUATION_CRITERION').length,
        status:
          elements.length &&
          ['SPECIFIC_COMPETENCY', 'ACHIEVEMENT_INDICATOR', 'CONCEPT', 'PROCEDURE'].every((type) =>
            elements.some((element) => element.type === type),
          ) &&
          !validation.pending.some((issue) =>
            elements.some((element) => element.source.pdfPage === issue.page),
          )
            ? 'EXTRACTED_PENDING_REVIEW'
            : 'BLOCKED',
      }
    })
    .sort(
      (a, b) =>
        a.cycle - b.cycle ||
        a.grade - b.grade ||
        a.area.localeCompare(b.area) ||
        (a.optativeExit || '').localeCompare(b.optativeExit || ''),
    )
  return {
    version: dataset.version.code,
    status: validation.errors.length || validation.pending.length ? 'VALIDATION_FAILED' : 'DRAFT',
    document: dataset.document,
    expectedScopes: expectedMatrix(dataset.version.level).length,
    expectedScopesMissing: validation.errors.filter((e) => e.startsWith('EXPECTED_SCOPE_MISSING'))
      .length,
    mallaPageNumbers: dataset.mallaPages,
    cycles: [...new Set(dataset.scopes.map((scope) => scope.cycle).filter(Boolean))].sort(),
    grades: [...new Set(dataset.scopes.map((scope) => scope.grade).filter(Boolean))].sort(),
    areas: [...new Set(dataset.scopes.map((scope) => scope.areaName).filter(Boolean))].sort(),
    scopes: dataset.scopes.length,
    elementCounts: types,
    relations: dataset.relations.length,
    scannedPdfPages: dataset.document.pageCount,
    mallaPages: dataset.mallaPages.length,
    pagesWithElements: new Set(dataset.elements.map((element) => element.source.pdfPage)).size,
    totalPdfPages: dataset.document.pageCount,
    criticalErrors: validation.errors,
    pendingReview: validation.pending,
    matrix,
  }
}
