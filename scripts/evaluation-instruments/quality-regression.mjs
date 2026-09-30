import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const backendRequire = createRequire(resolve(root, 'apps/backend/package.json'))
const frontendRequire = createRequire(resolve(root, 'apps/frontend/package.json'))
const enginePath = resolve(root, 'apps/backend/dist/modules/evaluation-instruments/recommendation-engine.js')
if (!existsSync(enginePath)) throw new Error('Compila primero el backend: pnpm --filter backend build')
const { recommend, detectActivityType } = backendRequire(enginePath)
const { resolveScope, normalize } = backendRequire(resolve(root, 'apps/backend/dist/modules/evaluation-instruments/curriculum-context.js'))

// Load the actual frontend adapter without a network request or a new dependency.
const ts = frontendRequire('typescript')
const adapterSource = readFileSync(resolve(root, 'apps/frontend/src/modules/activities/services/instrumentPreparation.ts'), 'utf8')
const adapterModule = { exports: {} }
const adapterJs = ts.transpileModule(adapterSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
new Function('require', 'module', 'exports', adapterJs)((id) => id === '@/services/apiClient' ? { api: {} } : frontendRequire(id), adapterModule, adapterModule.exports)
const { recommendationToFields, alignRecommendationWithFields } = adapterModule.exports

const rows = ['primary', 'secondary'].flatMap(level => readFileSync(resolve(root, `data/curriculum/${level}-2023.jsonl`), 'utf8').trim().split('\n').map(JSON.parse))
const scopes = rows.filter(row => row.kind === 'scope')
const scopeByKey = new Map(scopes.map(scope => [scope.stableKey, scope]))
const elements = rows.filter(row => row.kind === 'element').map(row => ({ elementId: row.id,
  scopeId: scopeByKey.get(row.scopeKey).id, versionId: row.versionId, type: row.type,
  text: row.originalText, normalizedText: row.normalizedText,
  sources: [{ documentId: row.source.documentId, pdfPage: row.source.pdfPage, printedPage: row.source.printedPage }] }))
const elementById = new Map(elements.map(element => [element.elementId, element]))

const cases = [
  ['Materia: cambios de estado', 'PRIMARY', 5, 'PRI-NAT', 'Ciencias de la Naturaleza', 'Cambios de estado de la materia', 'Observar fusión, evaporación y condensación; registrar cambios en una tabla y explicar sus causas.', 20, 'OBSERVATION', 'lista-cotejo'],
  ['Sistema respiratorio', 'PRIMARY', 5, 'PRI-NAT', 'Ciencias de la Naturaleza', 'Exposición sobre el sistema respiratorio', 'Explicar sus órganos principales, el intercambio de gases y su cuidado mediante esquemas.', 20, 'EXPOSITION', 'rubrica'],
  ['Densidad', 'PRIMARY', 5, 'PRI-NAT', 'Ciencias de la Naturaleza', 'Experimento sobre densidad', 'Medir masa y volumen, registrar datos y comparar materiales.', 20, 'EXPERIMENT', 'rubrica'],
  ['Fracciones', 'PRIMARY', 5, 'PRI-MAT', 'Matemática', 'Resolución de problemas con fracciones', 'Resolver problemas con fracciones equivalentes; mostrar operaciones y justificar respuestas.', 20, 'PROBLEM_SOLVING', 'lista-ponderada'],
  ['Cuento', 'PRIMARY', 5, 'PRI-LEN', 'Lengua Española', 'Producción de un cuento corto', 'Escribir un cuento con personajes, conflicto y desenlace; revisar su coherencia.', 20, 'WRITTEN_PRODUCTION', 'rubrica'],
  ['Exposición de Lengua', 'PRIMARY', 5, 'PRI-LEN', 'Lengua Española', 'Exposición oral sobre un cuento', 'Explicar personajes y secuencia del cuento con voz clara y ejemplos.', 20, 'EXPOSITION', 'rubrica'],
  ['Pintura cultural', 'PRIMARY', 5, 'PRI-ART', 'Educación Artística', 'Pintura sobre identidad cultural', 'Crear una pintura con símbolos de identidad cultural y explicar la composición.', 20, 'ARTISTIC_PRODUCTION', 'rubrica'],
  ['Volcanes', 'SECONDARY', 1, 'NAT-TU', 'Ciencias de la Tierra y el Universo', 'Exposición sobre los volcanes', 'Los estudiantes realizarán una exposición individual en la que explicarán qué son los volcanes, cómo se forman, cuáles son sus principales partes, los diferentes tipos de erupciones y los riesgos que representan para las poblaciones cercanas. Podrán utilizar imágenes, esquemas o modelos como apoyo.', 20, 'EXPOSITION', 'rubrica'],
  ['Terremotos', 'SECONDARY', 1, 'NAT-TU', 'Ciencias de la Tierra y el Universo', 'Investigación sobre terremotos', 'Investigar las causas de los terremotos, sus efectos y medidas de prevención; presentar fuentes.', 20, 'RESEARCH', 'rubrica'],
  ['Capas de la Tierra', 'SECONDARY', 1, 'NAT-TU', 'Ciencias de la Tierra y el Universo', 'Modelo de las capas de la Tierra', 'Proyecto para construir un modelo de las capas de la Tierra y explicar sus características.', 20, 'PROJECT', 'rubrica'],
  ['Laboratorio', 'SECONDARY', 5, 'NAT-QUI', 'Ciencias de la Naturaleza', 'Práctica de laboratorio sobre reacciones químicas', 'Seguir normas de seguridad, registrar datos e interpretar resultados.', 30, 'LAB_PRACTICE', 'rubrica'],
  ['Informe científico', 'SECONDARY', 5, 'NAT-QUI', 'Ciencias de la Naturaleza', 'Informe científico sobre reacciones químicas', 'Redactar hipótesis, procedimiento, datos y conclusiones del experimento.', 20, 'REPORT', 'rubrica'],
  ['Ensayo', 'SECONDARY', 1, 'LEN', 'Lengua Española', 'Ensayo sobre la lectura', 'Sostener una tesis con argumentos y ejemplos; revisar coherencia y vocabulario.', 20, 'ESSAY', 'rubrica'],
  ['Poema', 'SECONDARY', 1, 'LEN', 'Lengua Española', 'Producción de un poema', 'Escribir un poema sobre la naturaleza usando imágenes y ritmo.', 20, 'WRITTEN_PRODUCTION', 'rubrica'],
  ['Exposición de Lengua secundaria', 'SECONDARY', 1, 'LEN', 'Lengua Española', 'Exposición oral sobre la literatura', 'Explicar características de un género literario y citar ejemplos.', 20, 'EXPOSITION', 'rubrica'],
  ['Problemas de Matemática', 'SECONDARY', 1, 'MAT', 'Matemática', 'Resolución de problemas con ecuaciones', 'Plantear ecuaciones y justificar el procedimiento.', 20, 'PROBLEM_SOLVING', 'lista-ponderada'],
  ['Ejercicios de Matemática', 'SECONDARY', 1, 'MAT', 'Matemática', 'Ejercicios de proporciones', 'Resolver ejercicios de proporciones mostrando operaciones y comprobación.', 20, 'EXERCISE_SET', 'lista-ponderada'],
  ['Proyecto de Matemática', 'SECONDARY', 1, 'MAT', 'Matemática', 'Proyecto sobre estadística escolar', 'Recoger datos, organizar tablas y explicar resultados.', 20, 'PROJECT', 'rubrica'],
  ['Debate de Sociales', 'SECONDARY', 1, 'SOC', 'Ciencias Sociales', 'Debate sobre participación ciudadana', 'Argumentar con fuentes sobre participación ciudadana y responder a otras posturas.', 20, 'DEBATE', 'rubrica'],
  ['Investigación de Sociales', 'SECONDARY', 1, 'SOC', 'Ciencias Sociales', 'Investigación sobre migraciones', 'Consultar fuentes, comparar causas y consecuencias de las migraciones.', 20, 'RESEARCH', 'rubrica'],
  ['Historia', 'SECONDARY', 1, 'SOC', 'Ciencias Sociales', 'Exposición histórica sobre la Independencia', 'Ubicar hechos en tiempo y lugar, explicar causas y consecuencias con fuentes.', 20, 'EXPOSITION', 'rubrica'],
  ['Observación de primaria', 'PRIMARY', 2, 'PRI-NAT', 'Ciencias de la Naturaleza', 'Observación y clasificación de animales', 'Observar características y registrar una clasificación sencilla.', 10, 'OBSERVATION', 'lista-cotejo'],
  ['Práctica motriz', 'PRIMARY', 5, 'PRI-EFI', 'Educación Física', 'Práctica motriz de coordinación', 'Observar equilibrio, coordinación y aplicación de reglas.', 20, 'MOTOR_SPORTS_PRACTICE', 'escala'],
]

const generic = new Set(['comunicacion', 'organizacion', 'dominio del contenido', 'seguimiento de instrucciones'])
const output = []
const failures = []
const details = []
for (const [name, level, grade, code, subject, activityTitle, description, maxScore, expectedType, expectedInstrument] of cases) {
  try {
    const context = { level, cycle: grade <= 3 ? 1 : 2, grade, subjectCode: code, subjectName: subject, modalityCode: 'academic', optativeExitName: null }
    const resolution = resolveScope(context, scopes.filter(scope => scope.level === level))
    assert.equal(resolution.status, 'RESOLVED', `Ámbito: ${resolution.status}`)
    const result = recommend({ activityTitle, description, participationMode: 'INDIVIDUAL', maxScore }, context, resolution.scope, elements, resolution.status, 'DRAFT')
    assert.equal(result.activityType, expectedType, `Tipo detectado (catálogo: ${detectActivityType(activityTitle, description).id})`)
    assert.equal(result.instrumentType, expectedInstrument, 'Instrumento')
    assert(result.criteria.length >= 3 && result.criteria.length <= 8, 'Cantidad de criterios')
    assert.equal(new Set(result.criteria.map(criterion => normalize(criterion.title))).size, result.criteria.length, 'Títulos duplicados')
    assert.equal(result.totalScoreUnits, maxScore * 100, 'Puntuación total')
    assert.equal(result.criteria.reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0), result.totalScoreUnits, 'Suma de criterios')
    if (Number.isInteger(maxScore) && maxScore >= result.criteria.length) {
      assert(result.criteria.every(criterion => criterion.maxScoreUnits % 50 === 0), 'Puntos poco prácticos: se esperaban enteros o medios')
    }
    for (const criterion of result.criteria) {
      assert(criterion.title.trim() && criterion.description.trim() && criterion.maxScoreUnits > 0, 'Criterio vacío o sin puntos')
      if (criterion.sourceType !== 'CURRICULUM_DERIVED') assert(/\b(explica|identifica|distingue|organiza|comunica|utiliza|usa|aplica|registra|interpreta|formula|selecciona|justifica|realiza|relaciona|desarrolla|sustenta|propone|sitúa|defiende|crea|presenta|muestra|revisa|ubica|coordina|adapta|reflexiona|expresa|reconoce|describe|anota|dice|señala|completa|ejecuta|comprueba|escribe|documenta|responde|escucha|conecta)\b/i.test(criterion.description), `Descripción no observable: ${criterion.title}`)
      if (result.levels.length) {
        assert.equal(criterion.descriptors.length, result.levels.length, 'Cantidad de descriptores')
        assert.equal(new Set(criterion.descriptors.map(item => normalize(item.text))).size, result.levels.length, 'Descriptores iguales')
        assert(criterion.descriptors.every(item => item.text.trim() && item.text.length <= 240), 'Descriptor vacío o demasiado largo')
      }
      for (const ref of criterion.sourceReferences) {
        assert.equal(ref.scopeId, resolution.scope.id, 'Scope ajeno')
        assert.equal(ref.versionId, resolution.scope.versionId, 'Versión ajena')
        assert.deepEqual(ref.text, elementById.get(ref.elementId)?.text, 'Referencia no literal')
      }
      if (criterion.sourceType === 'ACTIVITY_TEMPLATE') assert.equal(criterion.sourceReferences.length, 0, 'Fuente falsa de plantilla')
      if (criterion.sourceType === 'CURRICULUM_DERIVED') assert(criterion.sourceReferences.some(ref => ref.text === criterion.description), 'Criterio no literal')
    }
    assert(result.selectedCurriculumElements.every(ref => ref.scopeId === resolution.scope.id && ref.versionId === resolution.scope.versionId), 'Selección de otro scope')
    const fields = recommendationToFields(result, activityTitle)
    const snapshot = alignRecommendationWithFields(result, fields, maxScore)
    assert(snapshot, 'Snapshot no alineado')
    assert.deepEqual(snapshot.criteria.map(criterion => [criterion.title, criterion.description, criterion.maxScoreUnits, criterion.descriptors.map(item => item.text)]),
      result.criteria.map(criterion => [criterion.title, criterion.description, criterion.maxScoreUnits, criterion.descriptors.map(item => item.text)]), 'Snapshot difiere de lo mostrado')
    const contextualized = result.criteria.filter(criterion => criterion.sourceType === 'CONTEXTUALIZED').length
    const genericCount = result.criteria.filter(criterion => generic.has(normalize(criterion.title))).length
    if (description.length > 90) assert(genericCount < result.criteria.length / 2, `Dominan criterios genéricos con contexto rico: ${result.criteria.map(criterion => criterion.title).join(' | ')}`)
    if (name === 'Volcanes') {
      assert(result.criteria.filter(criterion => criterion.templateId === 'science-content').length >= 2, 'Falta contenido volcánico')
      const learningUnits = result.criteria.filter(criterion => ['science-content', 'science-accuracy'].includes(criterion.templateId)).reduce((sum, criterion) => sum + criterion.maxScoreUnits, 0)
      assert(learningUnits / result.totalScoreUnits >= 0.4 && learningUnits / result.totalScoreUnits <= 0.7, 'Mezcla de contenido y evidencia desbalanceada')
      assert(result.criteria.some(criterion => /forman/i.test(criterion.description)), 'Falta formación')
      assert(result.criteria.some(criterion => /partes/i.test(criterion.description)), 'Faltan partes')
      assert(result.criteria.some(criterion => /precisión científica/i.test(criterion.title)), 'Falta precisión científica')
      assert(result.criteria.some(criterion => /organización|comunicación|recursos/i.test(criterion.title)), 'Falta evidencia oral')
    }
    output.push({ caso: name, asignatura: subject, tipo: result.activityType, instrumento: result.instrumentType, criterios: result.criteria.length,
      puntos: result.totalScore, confianza: result.confidence, curriculo: result.selectedCurriculumElements.length,
      contextualizados: contextualized, genericos: genericCount, estado: 'PASS' })
    if (process.argv.includes('--details')) details.push({ caso: name, criterios: result.criteria.map(criterion => ({ titulo: criterion.title,
      descripcion: criterion.description, puntos: criterion.maxScore, fuente: criterion.sourceType,
      destacado: criterion.descriptors[0]?.text })) })
  } catch (error) {
    failures.push(`${name}: ${error.message}`)
    output.push({ caso: name, asignatura: subject, tipo: '-', instrumento: '-', criterios: 0, puntos: maxScore,
      confianza: '-', curriculo: 0, contextualizados: 0, genericos: 0, estado: 'FAIL' })
  }
}
console.table(output)
if (details.length) console.log(JSON.stringify(details, null, 2))
console.log(`Resultado: ${output.length - failures.length}/${output.length} PASS`)
if (failures.length) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exitCode = 1 }
