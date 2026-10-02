# Informe final de Fase B — motor curricular de instrumentos

Fecha: 27 de septiembre de 2026. Rama: `instrumentos-evaluacion`.
Base verificada: `4ad820898bdcb4f7820d5127f00b7e78a7e1c41f`.

Resultado: infraestructura backend implementada y verificada localmente. No se rediseñaron Actividades ni Calificaciones, no se publicó currículo, no se creó ningún instrumento histórico, no se abrió PR y no se modificó main.

Advertencia importante: el tema «sistema circulatorio» no aparece literalmente en el ámbito de Ciencias de 5.º de Primaria del dataset aceptado. El caso B devuelve la rúbrica de 5 criterios, 4 niveles y 20 puntos, pero con confianza curricular LOW y sin referencias inventadas. No se toman contenidos de 2.º, 4.º o 6.º para aparentar una coincidencia.

## 1. Arquitectura implementada

`POST /api/v1/evaluation-instruments/recommend` → autenticación y roles → asignación autorizada → contexto académico estructurado → versión explícita DRAFT o vigente PUBLISHED → resolución de ámbito → consulta exclusivamente de ese ámbito → ranking determinista → selección de plantillas/criterios → descriptores → distribución en centésimas → DTO efímero.

Módulo: `apps/backend/src/modules/evaluation-instruments/`. Contrato compartido: `packages/shared/src/instrument-recommendation.ts`. El motor puro no consulta bases de datos, no invoca IA y puede probarse independientemente del transporte.

Se conserva el `activityType` histórico Individual/Grupal. El nuevo contrato lo separa como `participationMode` (INDIVIDUAL/GROUP), mientras `activityType` en la respuesta es el tipo **pedagógico**. La integración futura deberá traducir ambos campos explícitamente; no se cambió el significado del campo persistido existente.

## 2. Auditoría operativa y mappings

| Entidad real | Hallazgo | Uso en la resolución |
|---|---|---|
| Cursos | No hay tabla `courses`; se representan mediante `grades` y `sections` | No se interpreta el título visible del curso |
| `grades` | `sequence`, `academic_level_id`, `academic_cycle_id`, `default_modality_id` | Fuente estructurada del nivel/ciclo/grado/modalidad |
| `dr_academic_levels` | Códigos `primario`, `secundario`, `inicial` | Adaptador explícito PRIMARY/SECONDARY; Inicial no soportado por estos datasets |
| `dr_academic_cycles` | Secuencias globales 3/4 para Primaria y 5/6 para Secundaria | Se usan códigos primer/segundo ciclo y relación con nivel; no se confunden esas secuencias con ciclos curriculares 1/2 |
| Secuencia del grado | Seed local: Primaria 1–6, Secundaria 7–12; selector actual: Secundaria 1–6 | Secundaria 7–12 se convierte en 1–6; se exige concordancia con el ciclo |
| `dr_modalities` | `general`, `academic`, `technical_professional`, `arts` | Las dos últimas no se resuelven contra el currículo académico importado |
| `subjects` | ID por escuela, código, nombre; sin FK a un catálogo global de asignaturas | Código operativo reconocido tiene prioridad; nombres exactos solo con contexto estructurado |
| Catálogo de asignaturas | `apps/frontend/src/modules/courses/data/academicAssignmentCatalog.ts` | Se auditaron códigos PRI-*, generales LEN/MAT/etc., NAT-* y OPT-* |
| `section_subjects` | Une escuela, año, grado, sección, asignatura y docente | ID requerido por la API; valida todas las relaciones y su estado |
| Activities | El filtro llamado `subjectId` compara realmente `sectionSubjectId`; la creación navega con ese ID | Se consume la asignación real, no un ID ambiguo de UI |
| Grading | Actividades y registros usan `section_subject_id`; bloques b1–b4 | Misma identidad operativa; bloques solo aportan relevancia, no inventan relaciones oficiales |
| `dr_competencies` | Catálogo operativo distinto de los elementos curriculares importados | No se reutilizan sus IDs como IDs del currículo de Fase A |
| Matrículas | Pueden guardar modalidad/subsistema individual | No se extrapolan preferencias de un estudiante a toda la asignatura |

La base local tenía **0 asignaciones** al comenzar. Por ello no se afirma haber mapeado materias reales de una escuela en producción. Se crearon nueve asignaciones locales temporales usando códigos reales, se persistieron nueve mappings, se comprobó su idempotencia y se eliminaron exclusivamente esos fixtures al terminar.

Se utiliza `curriculum_subject_mappings` de Fase A, sin alterar su esquema. `synchronizeCurriculumMappings` recibe escuela y versiones explícitas; no recorre todas las escuelas. Inserta mappings inequívocos y devuelve estados RESOLVED, AMBIGUOUS, UNMAPPED, CONFLICT, INCOMPLETE_CONTEXT o UNSUPPORTED_MODALITY según corresponda. Las ambigüedades se devuelven como diagnóstico, no como una fila con un scope arbitrario.

Los códigos OPT-HLM/OPT-HCS/OPT-MT/OPT-CT identifican salida y grado. Para códigos personalizados existe un contexto de salida revisado por asignación. Sin ese dato, una optativa homónima permanece ambigua incluso si existe un mapping antiguo. Ningún mapping revisado puede sustituir el filtro de nivel/ciclo/grado ni resolver por sí solo una salida faltante.

Adaptaciones explícitas: los subtipos NAT-* apuntan al ámbito Ciencias de la Naturaleza de su grado; los códigos de lengua extranjera resuelven los nombres diferentes entre Primaria y Secundaria. El código OPT-MT-6 apunta a la grafía literal «Tigonometría, Cálculo Diferencial y Tecnología», sin corregir el dataset.

Riesgo preexistente detectado: `attachExistingSubjectIds` en el selector frontend reutiliza IDs por nombre **o** código. Esa lógica puede confundir identidades si una escuela ya tiene códigos incorrectos. No se modificó ese selector en esta fase; el motor usa la identidad realmente almacenada y no puede reconstruir la intención perdida del usuario. Conviene revisarlo al integrar la UI en Fase C.

## 3. Tablas nuevas y seguridad

- `evaluation_catalog_releases`: versión PK, payload JSONB y fecha. Contiene un release atómico de los seis catálogos conceptuales. Evita mezclar criterios de una versión con reglas/descriptores de otra. No pertenece a una escuela.
- `section_curriculum_contexts`: PK/FK `section_subject_id`, salida optativa restringida a las cuatro oficiales y fecha. Configuración administrativa para asignaturas personalizadas/legadas.

Ambas tablas tienen RLS explícita, revocación a PUBLIC/anon/authenticated y privilegios de `app_backend`. El catálogo permite SELECT/INSERT al backend, no UPDATE/DELETE. El contexto permite CRUD backend. Las PK cubren los accesos/FK nuevos; la recuperación curricular reutiliza el índice por ámbito de Fase A.

Los roles autenticados del navegador no acceden directamente a estas tablas. El backend valida escuela y docente asignado; administradores/directores/coordinadores permanecen limitados a su escuela. No se usa `user_metadata`, SQL enviado por el cliente ni funciones SECURITY DEFINER.

La guía de Supabase influyó en los grants mínimos, RLS explícita y comprobación de roles; la de Wrangler, en validar únicamente mediante `--dry-run`. Referencias consultadas: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) y [Wrangler](https://developers.cloudflare.com/workers/wrangler/commands/). Se revisó el changelog; no se incorporan extensiones ni operadores afectados por sus cambios recientes.

## 4. Seeds

Release vigente `evaluation-2026.6`, definido en `catalog-v1.ts`, cargado con `seedEvaluationCatalog`. Incluye las seis estructuras: activityTypes, evidenceTypes, criterionTemplates, descriptorPatterns, instrumentTemplates y recommendationRules. Las versiones anteriores se conservan sin alteraciones.

Seed idempotente: repetir no agrega filas; si la versión existe con otro contenido se rechaza y se exige una nueva versión. El servicio verifica el payload JSONB contra el seed tipado revisado antes de usarlo. No se admite editar silenciosamente la versión activa desde la base de datos.

Ejecución local, después de compilar backend/database:

```powershell
# Preparar Supabase local y compilar antes de instalar el release requerido por el código.
pnpm supabase:local
pnpm --filter backend build
# DATABASE_URL debe estar definida explícitamente y apuntar a localhost:54332.
node scripts/evaluation-instruments/catalog-local.mjs
# Repetir debe devolver UNCHANGED; un payload distinto para la misma versión falla.
node scripts/evaluation-instruments/catalog-local.mjs
# Opcional: sincronizar solo una escuela y versiones explícitas.
node scripts/evaluation-instruments/catalog-local.mjs <schoolId> <primaryVersionId> <secondaryVersionId>
```

Los scripts no leen `.env` ni aceptan hosts remotos. No se añadieron dependencias.

## 5. Tipos pedagógicos y familias

36 tipos, incluidos los módulos deterministas de «La noticia», «La guía turística», «El informe de lectura» y «El afiche», además de los tipos generales existentes.

Familias: ORAL, WRITTEN, PRACTICAL, SCIENTIFIC, MATHEMATICAL, ARTISTIC, MOTOR, PROJECT_BASED y OBSERVATIONAL. Selección explícita tiene prioridad; detección por frases normalizadas, con preferencia por coincidencia más específica; si no hay coincidencia, OTHER. Es una sugerencia editable, no una clasificación irreversible.

## 6. Evidencias

KNOWLEDGE, PERFORMANCE, PRODUCT y ATTITUDE. Se combinan por tipo de actividad. ATTITUDE no se agrega por el mero hecho de elegir GROUP: exige evidencia temática pertinente y un criterio actitudinal aplicable.

## 7. Criterion templates

41 plantillas internas, con ID, título, observable, redacción sencilla, disciplina, familias, evidencias, tramos, propósito, palabras clave, peso y condiciones de uso.

- Generales (3): organización, comunicación, instrucciones.
- Ciencias (7): dominio, precisión, procedimiento, datos, interpretación, conclusiones, seguridad.
- Matemática (5): comprensión, procedimiento, razonamiento/justificación, exactitud, interpretación.
- Lengua (6): contenido/adecuación, estructura, coherencia/cohesión, argumentación, vocabulario/corrección, recursos expresivos; las dimensiones combinadas no se duplican.
- Sociales (5): fuentes/evidencias, contexto, causas/consecuencias, argumentación, interpretación.
- Artística (5): técnica, creatividad, composición, intención, materiales.
- Educación Física (5): técnica, coordinación, reglas, desempeño, cooperación.
- FIHR (5): comprensión, reflexión, argumentación, aplicación, convivencia/valores.

El total real es **41** (3+7+5+6+5+5+5+5). No se presentan como criterios MINERD. Seguridad, cooperación, argumentación literaria, materiales y valores tienen condiciones específicas. No se añaden respeto/responsabilidad/trabajo en equipo a toda actividad.

## 8. Descriptor patterns

Dos patrones de complejidad (sencillo y regular), con cinco posiciones reutilizables. Escalas configuradas:

- 4 niveles: Destacado, Logrado, En proceso, Inicial.
- 5 niveles: Excelente, Muy bueno, Bueno, En proceso, Inicial.

`levelCount` permite seleccionar 4 o 5. Cada descriptor combina el observable del criterio y el patrón de nivel; solo incorpora contenido literal recuperado cuando es seguro. Las etiquetas no están en React. La puntuación del nivel inferior es 0 y la superior el máximo del criterio; niveles intermedios se redondean a centésimas enteras.

## 9. Reglas de instrumento

7 reglas priorizadas: sencillez en primer ciclo y ≤10 puntos; rúbrica para oral/escrito/artístico/proyecto; rúbrica para evidencia científica de desempeño/producto; lista ponderada matemática; escala motriz; lista de cotejo observacional; fallback de lista de cotejo.

Se usan únicamente `rubrica`, `lista-cotejo`, `escala`, `lista-ponderada`, los identificadores existentes. Se consideran familia, evidencias, tramo y puntuación. Cantidades iniciales: 3–4 en primer ciclo, hasta 5 en segundo, 5–6 en Secundaria según actividad y plantillas aplicables. Son propuestas, no restricciones del futuro editor.

## 10. Ranking y puntuación

Filtro duro antes de cualquier relevancia: versión + ámbito exacto. Defensa adicional en el motor descarta elementos de otro scope/version aunque un llamador los entregue accidentalmente.

Normalización: tildes, mayúsculas, puntuación, stopwords y variaciones sencillas de plural/género. El título aporta el tema; se quitan expresiones pedagógicas genéricas, conservando términos de contenido/género. La descripción aporta relevancia adicional sin diluir el título.

Score: cobertura de tokens temáticos ×100 + peso de tipo (indicador 16, criterio 14, competencia/procedimiento 12, concepto 10, actitud 3) + coincidencias de bloque (máx.6) + procedimiento/tipo (máx.6) + descripción (máx.8). Solo hay score positivo con coincidencia temática. Se consideran seis tipos curriculares; competencias fundamentales no se confunden con competencias específicas.

Confianza LOW si el mejor resultado no cubre 60% del tema; MEDIUM desde 60%; HIGH desde 85%. La confianza es heurística léxica, **no** validación pedagógica. Se seleccionan como máximo dos elementos por tipo y doce totales, siempre con cobertura ≥60%. No se convierte cada indicador en un criterio. Los elementos pertinentes también aportan una bonificación acotada a la selección de plantillas.

Cada criterio es CURRICULUM_DERIVED (texto literal de un criterio oficial recuperado), CONTEXTUALIZED (observable de plantilla con referente literal), ACTIVITY_TEMPLATE (sin atribución curricular) o, en el contrato futuro, TEACHER_REUSED. Este último no se fabrica sin historial.

Puntos: pesos enteros y método de mayores restos en centésimas. `maxScoreUnits` y `totalScoreUnits` son la autoridad; `maxScore` y `totalScore` son valores de presentación. Se comprobaron 10.000 totales. La suma entera coincide exactamente incluso con puntuaciones decimales.

## 11. API y ciclo de vida

Ruta completa: `POST /api/v1/evaluation-instruments/recommend`, respuesta HTTP 200. Usa JWT y RolesGuard existentes, validación de UUID, campos permitidos, longitudes, puntos con dos decimales, tipo pedagógico y escala.

```json
{
  "sectionSubjectId": "<UUID de la asignación autorizada>",
  "activityTitle": "Exposición sobre el sistema circulatorio",
  "participationMode": "INDIVIDUAL",
  "pedagogicalActivityType": "EXPOSITION",
  "maxScore": 20,
  "competencyBlock": "b4",
  "levelCount": 4,
  "curriculumVersionId": "37843eac-3f65-55ab-8a7e-e4fd95715380"
}
```

Opcionales: description y curriculumScopeId. Un scope solicitado se acepta únicamente si coincide con el ámbito resuelto desde la asignación autorizada. No se aceptan schoolId, teacherId, grado o salida enviados libremente para reemplazar el contexto.

Versiones DRAFT solo mediante selección explícita. Si se omite versión, se busca PUBLISHED del nivel por edición/publicación; si no hay, se entrega fallback sin fundamento curricular. No se cambian estados de versión.

Respuesta: contrato `InstrumentRecommendation`, con identificadores temporales estables, evidencias, niveles, criterios, puntos enteros, referencias y traza de ranking/regla/confianza. El interceptor global de la aplicación conserva el envoltorio habitual de la API.

No se persisten propuestas. Diseño para Fase C: el usuario acepta/edita → backend revalida escuela/asignación/puntos/referencias → guarda snapshot de la propuesta editada y versión → crea `evaluation_instrument` real y lo enlaza a la actividad en una transacción. El snapshot histórico no dependerá de futuras actualizaciones del catálogo. Esta transacción todavía no está implementada.

Preferencias: contrato `TeacherInstrumentPreference` con escuela, docente, scope, tipo pedagógico, instrumento, IDs de criterios, frecuencia, fecha e instrumento aceptado. Se actualizará al guardar una selección real, no al pedir recomendaciones. No hay tracking, tabla de preferencias ni pantalla activados en esta fase.

## 12. Ejemplos reales

Los nueve casos se ejecutaron con el servicio real, Prisma, PostgreSQL local y currículo importado. [Ejemplos completos con criterios, descriptores y textos fuente](ejemplos-fase-b.md). [Evidencia JSON](../../data/evaluation-instruments/local-verification.json).

| Caso | Contexto | Instrumento | Criterios | Niveles | Puntos | Confianza | Elementos |
|---|---|---|---:|---:|---:|---|---:|
| A | Primaria 2, Ciencias, animales | Lista de cotejo | 3 | 0 | 10 | HIGH | 2 |
| B | Primaria 5, Ciencias, circulatorio | Rúbrica | 5 | 4 | 20 | LOW | 0 |
| C | Primaria 5, Matemática, fracciones | Lista ponderada | 5 | 0 | 20 | HIGH | 5 |
| D | Secundaria 5, Ciencias, laboratorio | Rúbrica | 6 | 4 | 30 | HIGH | 4 |
| E | Secundaria 4, Lengua, ensayo | Rúbrica | 5 | 4 | 20 | LOW | 0 |
| F | Primaria 5, Artística, pintura | Rúbrica | 5 | 4 | 15 | HIGH | 2 |
| G | Secundaria 4, Apreciación, HLM | Rúbrica | 5 | 4 | 20 | HIGH | 2 |
| H | Secundaria 4, Matemática Financiera, MT | Lista ponderada | 5 | 0 | 20 | HIGH | 6 |
| I | Secundaria 5, Química y Computación, CT | Rúbrica | 6 | 4 | 25 | HIGH | 2 |

Las listas no tienen niveles de rúbrica; presentan criterios observables y pesos. La futura UI de aplicación reutilizará su mecanismo existente.

## 13. Trazabilidad de cada ejemplo

El anexo muestra todos los textos seleccionados con elementId, documentId, página PDF, folio, scope y versión. También distingue por criterio la procedencia y sus referencias; una selección curricular en el contexto no convierte automáticamente todas las plantillas en oficiales.

En B y E la trazabilidad curricular seleccionada es explícitamente vacía por baja confianza. No se inventó página ni se copió de otro grado. Los datasets fuente y sus hashes de Fase A permanecen intactos.

## 14. Baja confianza

Se prueba un título sin coincidencias (`Exposición zzzqqq`) y los casos reales B/E. Se conserva una propuesta pertinente al tipo y disciplina, sin referencias falsas. No se modifica ni bloquea el flujo existente de creación de actividades: esta API es independiente.

Un problema de seguridad (asignación ajena/scope incompatible) se rechaza; no se oculta como fallback. Catálogo sin instalar o modificado indebidamente responde error de servicio, no una propuesta de versión desconocida.

## 15. Aislamiento

PASS: Primaria 5 no recupera Primaria 6 ni Secundaria; optativas HLM/HCS no comparten contenido; código de optativa con grado/salida contradictorios no resuelve; modalidad Artes/Técnico Profesional no usa el catálogo académico; escuela/docente ajenos no acceden; scope arbitrario no pasa; mapping obsoleto no vence contexto real.

Los tests puros inyectan **ambos datasets completos** para verificar el filtro defensivo. La integración local prueba además consultas reales por asignación y un homónimo con mapping anterior: sigue AMBIGUOUS hasta configurar su salida.

## 16. Tests y validadores

- Backend: **26 archivos, 171 tests PASS**, incluidos 36 nuevos en dos archivos.
- Fase A: **53 tests PASS**, sin alterar extracción.
- Integridad de artefactos: Primaria **45/45**, Secundaria **72/72**; hashes/código/cobertura/procedencia/muestras OK.
- Integración local: nueve casos, seed/mapping idempotentes, pertenencia de ámbitos, aislamiento escuela/docente, referencia inválida, ambigüedad/salida configurada, fallback, cero instrumentos/actividades históricos, privilegios y RLS: PASS.
- HTTP local: controller, DTO, guard de roles, servicio y PostgreSQL reales; 200 válido, 400 campos indebidos/puntos inválidos, 403 sin credencial de prueba. **El guard de autenticación JWT se sustituye solo en este harness por una credencial local**, no se presenta como prueba de firma JWT o sesión Supabase externa.

Verificador: `node scripts/evaluation-instruments/verify-local.mjs` con DATABASE_URL local explícita. Genera JSON y anexo Markdown; elimina sus registros por UUID de escuela creado en esa ejecución. No toca datos curriculares ni escuelas existentes.

## 17. Typecheck y builds

PASS:

```text
pnpm --filter backend test
pnpm --filter backend exec tsc --noEmit
pnpm --filter backend build
pnpm --filter @aula/database exec tsc --noEmit
pnpm --filter @aula/shared exec tsc --noEmit
pnpm --filter frontend build
pnpm cloudflare:build
```

Cloudflare: cuatro paquetes compilados y Wrangler 4.111.0 `deploy --dry-run`; **sin despliegue**. Advertencia preexistente del frontend: chunk curricular de Secundaria mayor que el umbral de 700 kB.

El typecheck NodeNext detectó el import dinámico preexistente `./app.module` en bootstrap; se añadió `.js`, compatible con el archivo compilado y verificado también en el build de Cloudflare. No se modificó la carga de variables de entorno.

## 18. Migración local

Nueva migración: `supabase/migrations/20260927221946_evaluation_recommendation_foundation.sql`, creada con `supabase migration new`. Aplicada en una transacción psql con ON_ERROR_STOP al contenedor local `supabase_db_Proyecto-educativo-v3`.

No se editó ninguna migración anterior, ni se aplicó SQL remoto. Como en la verificación de Fase A, la aplicación directa local no agrega una entrada al historial de migraciones CLI. Prisma y `database.types.ts` están alineados con las dos tablas nuevas.

`supabase db advisors --local --type security --level warn --fail-on error`: exit 0, sin errores. Dos WARN preexistentes de search_path mutable en `assert_curriculum_version_writable` y `assert_curriculum_version_update` (Fase A); no se introdujeron funciones en esta fase.

Versiones conservadas:

- MINERD_PRIMARIA_2023: DRAFT (`37843eac-3f65-55ab-8a7e-e4fd95715380`).
- MINERD_SECUNDARIA_2023: DRAFT (`d98f8201-3cac-5da6-b855-38f7bb8c8011`).

## 19. Archivos modificados/creados

Modificados:

- `apps/backend/src/app.module.ts`
- `apps/backend/src/bootstrap.ts`
- `apps/frontend/src/types/database.types.ts`
- `packages/database/prisma/schema.prisma`
- `packages/shared/src/index.ts`

Creados:

- `apps/backend/src/modules/evaluation-instruments/catalog-v1.ts`
- `apps/backend/src/modules/evaluation-instruments/catalog-operations.ts`
- `apps/backend/src/modules/evaluation-instruments/curriculum-context.ts`
- `apps/backend/src/modules/evaluation-instruments/recommendation-engine.ts`
- `apps/backend/src/modules/evaluation-instruments/recommend-instrument.dto.ts`
- `apps/backend/src/modules/evaluation-instruments/evaluation-instruments.service.ts`
- `apps/backend/src/modules/evaluation-instruments/evaluation-instruments.module.ts`
- `apps/backend/src/modules/evaluation-instruments/recommendation-engine.spec.ts`
- `apps/backend/src/modules/evaluation-instruments/evaluation-instruments.service.spec.ts`
- `packages/shared/src/instrument-recommendation.ts`
- `supabase/migrations/20260927221946_evaluation_recommendation_foundation.sql`
- `scripts/evaluation-instruments/catalog-local.mjs`
- `scripts/evaluation-instruments/verify-local.mjs`
- `data/evaluation-instruments/cases-v1.json`
- `data/evaluation-instruments/local-verification.json`
- `docs/curriculum/informe-fase-b.md`
- `docs/curriculum/ejemplos-fase-b.md`

## 20. Limitaciones explícitas

1. Ranking léxico conservador, sin ontología de sinónimos ni IA; puede omitir contenidos semánticamente relacionados. La confianza no equivale a certificación oficial.
2. Catálogo v1: 41 plantillas razonables iniciales, no validación pedagógica exhaustiva. Los descriptores son deterministas y requieren revisión docente antes de uso definitivo.
3. El currículo permanece DRAFT/PENDING; no se corrigió, completó ni generó contenido curricular nuevo. **Sí** se redactaron plantillas y descriptores evaluativos de AulaBase, identificados como tales.
4. Sin historial real, no se aplica preferencia docente ni se emite TEACHER_REUSED. La estructura está diseñada en el contrato.
5. No hay mappings de producción ni despliegue/migración remota. Las nueve filas comprobadas pertenecían a fixtures ya eliminados.
6. Configuración de salida para asignaturas personalizadas y sincronización de mappings son administrativas; no se añadió una biblioteca o pantalla.
7. Identificadores temporales son estables por versión/ámbito/plantilla, no IDs persistidos ni hashes únicos de una actividad. La aceptación futura debe crear un snapshot independiente.
8. Puntajes se conservan exactamente en centésimas; consumidores futuros no deben sumar floats como autoridad ni ignorar las validaciones del instrumento persistido.
9. Sin interfaz nueva, pruebas visuales, conexión con el formulario actual, instrument_result ni snapshots históricos completos: expresamente fuera de alcance.

## 21. Pendiente para Fase C

Integrar solicitud/aceptación/edición en el flujo existente; revisar identidad de optativas en el selector operativo; añadir guardado transaccional del snapshot e instrumento real; validar límites del modelo persistido; registrar preferencias solo al aceptar; probar la UI y aplicación de las cuatro clases de instrumento. Publicación del currículo y despliegue remoto requieren su proceso explícito posterior.

Git: el commit de cierre usa `Implementa motor curricular de recomendación de instrumentos` y se sube exclusivamente a `origin instrumentos-evaluacion` después de las verificaciones. El SHA final se obtiene con `git log -1` (no se incrusta el hash del propio commit dentro de su contenido).
