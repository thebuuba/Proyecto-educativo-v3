export const optativeExits = {
  HLM: 'Humanidades y Lenguas Modernas', HCS: 'Humanidades y Ciencias Sociales',
  MT: 'Matemática y Tecnología', CT: 'Ciencias y Tecnología',
} as const
export const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export interface AcademicContext {
  level: 'PRIMARY' | 'SECONDARY'; cycle: number; grade: number; subjectName: string
  subjectCode: string; modalityCode: string | null; optativeExitName: string | null
}
export interface ScopeCandidate {
  id: string; versionId: string; cycle: number | null; grade: number | null
  areaName: string | null; subjectName: string | null; modalityName: string | null; optativeExitName: string | null
}
export interface OperationalGrade {
  sequence: number | null
  academicLevel: { id: string; code: string } | null
  academicCycle: { levelId: string; code: string } | null
  defaultModality: { code: string } | null
}
export function academicContext(grade: OperationalGrade, subject: { code: string; name: string }, exit: string | null): AcademicContext | null {
  const level = grade.academicLevel?.code === 'primario' ? 'PRIMARY' : grade.academicLevel?.code === 'secundario' ? 'SECONDARY' : null
  if (!level || grade.sequence == null || !grade.academicCycle || grade.academicCycle.levelId !== grade.academicLevel?.id) return null
  // Both the legacy global sequence (7–12) and current UI local sequence (1–6) are explicit conventions.
  const number = level === 'SECONDARY' && grade.sequence >= 7 ? grade.sequence - 6 : grade.sequence
  if (!Number.isInteger(number) || number < 1 || number > 6) return null
  const cycle = number <= 3 ? 1 : 2
  const prefix = level === 'PRIMARY' ? 'primario' : 'secundario'
  if (grade.academicCycle.code !== `${prefix}_${cycle === 1 ? 'primer' : 'segundo'}_ciclo`) return null
  return { level, cycle, grade: number, subjectName: subject.name, subjectCode: subject.code,
    modalityCode: grade.defaultModality?.code ?? null, optativeExitName: exit }
}

const generalSubjects: Record<string, string> = {
  LEN: 'Lengua Española', MAT: 'Matemática', SOC: 'Ciencias Sociales', NAT: 'Ciencias de la Naturaleza',
  ART: 'Educación Artística', EFI: 'Educación Física', FHR: 'Formación Integral Humana y Religiosa',
}
/** Audited code adapter. Source spelling is never modified in the curricular dataset. */
function identity(context: AcademicContext) {
  const code = context.subjectCode.toUpperCase()
  const opt = /^OPT-(HLM|HCS|MT|CT)(?:-(LEN|ING|SOC))?-([456])$/.exec(code)
  if (opt) {
    const exit = optativeExits[opt[1] as keyof typeof optativeExits]
    const grade = Number(opt[3])
    const names: Record<string, string[]> = {
      'HLM-LEN': ['Apreciación y Producción Literarias', 'Apreciación y Producción Literarias', 'Análisis y Producción de Textos Periodísticos y Publicitarios'],
      'HLM-ING': ['Manejo de la información en inglés', 'Apreciación de la Literatura Anglófona', 'Análisis Crítico y Evaluación de Textos en Inglés'],
      'HCS-LEN': ['Apreciación y Producción Literarias', 'Apreciación y Producción Literarias', 'Análisis y Producción de Textos Científicos y Profesionales'],
      'HCS-SOC': ['Filosofía social y Pensamiento Dominicano', 'Geografía Humana y Demografía', 'Ciudadanía y Democracia Participativa'],
      MT: ['Matemática Financiera y Tecnología', 'Estadística Probabilidad y Tecnología', 'Tigonometría, Cálculo Diferencial y Tecnología'],
      CT: ['Biología y Computación', 'Química y Computación', 'Física y Computación'],
    }
    const key = opt[2] ? `${opt[1]}-${opt[2]}` : opt[1]
    return { name: names[key]?.[grade - 4], exit, valid: context.level === 'SECONDARY' && context.grade === grade && (!context.optativeExitName || context.optativeExitName === exit), source: 'STRUCTURED_SUBJECT_CODE' }
  }
  const base = code.replace(/^PRI-/, '')
  const scienceGrades: Record<string, number> = { 'NAT-TU': 1, 'NAT-VIDA': 2, 'NAT-FISICAS': 3, 'NAT-BIO': 4, 'NAT-QUI': 5, 'NAT-FIS': 6 }
  const name = base === 'ING' ? (context.level === 'PRIMARY' ? 'Lenguas Extranjeras-inglés' : 'Inglés')
    : base === 'FRA' ? 'Francés' : scienceGrades[base] ? generalSubjects.NAT : generalSubjects[base]
  if (name) return { name, exit: null, valid: !(code.startsWith('PRI-') && context.level !== 'PRIMARY') && (!scienceGrades[base] || (context.level === 'SECONDARY' && context.grade === scienceGrades[base])), source: 'STRUCTURED_SUBJECT_CODE' }
  return { name: context.subjectName, exit: context.optativeExitName, valid: true, source: 'EXACT_NAME_WITH_STRUCTURED_GRADE' }
}
export function resolveScope(context: AcademicContext, scopes: ScopeCandidate[], reviewedScopeIds: string[] = []) {
  const key = identity(context)
  if (!key.valid || !key.name) return { status: 'CONFLICT', scope: null, candidates: [], reason: 'Código de asignatura incompatible con grado/nivel/salida.' }
  if (context.modalityCode && !['academic', 'general'].includes(context.modalityCode)) {
    return { status: 'UNSUPPORTED_MODALITY', scope: null, candidates: [], reason: 'No se ha importado el currículo de esa modalidad.' }
  }
  const candidates = scopes.filter(scope => scope.grade === context.grade && scope.cycle === context.cycle
    && normalize(scope.subjectName ?? '') === normalize(key.name!)
    && (!key.exit || scope.optativeExitName === key.exit))
  // A generic common subject stays common, even when an exit is configured on its section.
  const filtered = key.source === 'STRUCTURED_SUBJECT_CODE' && !key.exit ? candidates.filter(scope => !scope.optativeExitName) : candidates
  if (filtered.length !== 1) return { status: filtered.length > 1 ? 'AMBIGUOUS' : 'UNMAPPED', scope: null, candidates: filtered.map(s => s.id), reason: filtered.length > 1 ? 'Falta salida optativa inequívoca.' : 'No existe un ámbito compatible.' }
  const scope = filtered[0]
  if (scope.optativeExitName && !key.exit) return { status: 'AMBIGUOUS', scope: null, candidates: [scope.id], reason: 'La salida optativa debe constar en el código o contexto configurado.' }
  if (scope.optativeExitName && context.modalityCode !== 'academic' && context.modalityCode !== 'general') return { status: 'INCOMPLETE_CONTEXT', scope: null, candidates: [scope.id], reason: 'Falta modalidad académica configurada.' }
  // A stale/manual mapping cannot override hard academic constraints or disambiguate a missing exit.
  if (reviewedScopeIds.length && !reviewedScopeIds.includes(scope.id)) return { status: 'CONFLICT', scope: null, candidates: [], reason: 'Mapping revisado incompatible con el contexto operativo.' }
  return { status: 'RESOLVED', scope, candidates: [scope.id], reason: reviewedScopeIds.includes(scope.id) ? 'REVIEWED_MAPPING_AND_STRUCTURED_CONTEXT' : key.source }
}
export function discipline(scope: ScopeCandidate | null, context: AcademicContext | null) {
  const name = normalize(scope?.areaName ?? context?.subjectName ?? '')
  if (/naturaleza|quimica|biologia|fisica y computacion/.test(name)) return 'science'
  if (/matematica|estadistica|calculo/.test(name)) return 'math'
  if (/lengua|literaria|ingles|frances|textos/.test(name)) return 'language'
  if (/social|geografia|ciudadania|filosofia/.test(name)) return 'social'
  if (/artistica/.test(name)) return 'art'
  if (/educacion fisica/.test(name)) return 'motor'
  if (/humana|religiosa/.test(name)) return 'fihr'
  return '*'
}
