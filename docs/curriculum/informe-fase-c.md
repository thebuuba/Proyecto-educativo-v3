# AulaBase — informe verificable de Fase C

Fecha de trabajo: 2026-09-27. Rama: `instrumentos-evaluacion`. Base: `70fe0e9f4341a832ca7e3d931d21ae1f7a8c91a8`. Este informe describe el estado local de la implementación; no implica publicación del currículo, despliegue ni aprobación pedagógica de los criterios.

## 1–2. Flujo anterior y cambios visibles

Se conservó el creador de tres pasos de `GradingBook`, tanto desde la vista de asignatura como desde Actividades. Antes se elegía el instrumento en el paso 1 y se construía completo en el paso 2. Ahora el paso 1 conserva nombre, descripción, fecha, valor, técnica, competencias, recursos, momento y participación Individual/Grupal, pero añade un tipo pedagógico sugerido y permite dejar la elección de instrumento a AulaBase. El paso 2 muestra por defecto un resumen de criterios y puntos preparados. El constructor previo de los cuatro instrumentos sigue disponible en «Configuración avanzada» y como salida manual si falla la preparación. No se creó otro formulario.

## 3–6. Interpretación, erratas, descripción y confianza

`POST /api/v1/evaluation-instruments/interpret` analiza título y texto descriptivo con una espera de 450 ms y cancela la petición anterior al cambiar el borrador. No crea ni guarda instrumentos. Se normalizan tildes y caso, se quita texto introductorio genérico y se aplica distancia Damerau–Levenshtein limitada a términos de al menos cinco caracteres con prefijo compatible. La descripción puede rescatar un título genérico; el ranking ocurre **después** de fijar versión, grado, ciclo, asignatura y salida. El título que escribió el docente nunca se corrige automáticamente. El motor calcula confianza HIGH/MEDIUM/LOW por cobertura temática; coincidencia léxica no equivale a validación curricular. En baja confianza se usan plantillas de actividad sin atribuirles texto MINERD.

## 7–9. Experiencia docente y elecciones

La interfaz muestra una frase comprensible y, cuando existen, hasta tres posibles contenidos para selección expresa, sin exponer puntuaciones internas ni biblioteca de reglas. El tipo pedagógico detectado se puede cambiar manualmente; también se puede forzar Rúbrica, Lista de cotejo, Escala estimativa o Lista ponderada. La recomendación completa se ejecuta al avanzar, no por cada pulsación. El servicio rechaza IDs de contenido ajenos al ámbito autorizado. En desarrollo local, `interpret` puede sugerir la versión DRAFT si no hay PUBLISHED; `recommend` sin versión explícita conserva su política PUBLISHED-only y la versión DRAFT se pasa expresamente desde la interpretación. Producción no hace esta selección DRAFT implícita.

## 10–14. Instrumento, criterios, puntos y cambios posteriores

Los criterios y descripciones aparecen ya rellenados y son editables; el editor avanzado existente permite añadir, quitar, ordenar y configurar criterios y niveles. El adaptador llena los campos planos de los cuatro constructores actuales. Para rúbrica se incluyen descriptores por nivel. Los puntos de la propuesta y los pesos de lista ponderada se distribuyen en centésimas; el guardado rechaza cualquier suma distinta de `maxScore`. El paso 2 no muestra toda la configuración avanzada abierta. Una huella del título, descripción, puntaje, tipo de actividad, modalidad, instrumento y contenidos elegidos detecta desactualización. Si hubo edición manual se exige confirmación explícita antes de regenerar; una regeneración no ocurre automáticamente. Una edición de criterio elimina la atribución curricular de ese criterio si cambió el texto.

## 15–20. Revisión, persistencia, snapshot, compatibilidad y preferencias

El paso 3 resume la actividad, instrumento, criterios y puntaje; cuando la confianza es baja declara que el instrumento se basa en la actividad sin atribución curricular. La creación preparada guarda instrumento exclusivo, snapshot, referencias literales verificadas, actividad, grupos y preferencia del docente dentro de una sola transacción Prisma. El snapshot guarda catálogo, versión/ámbito curricular cuando existen, criterios, descriptores, centésimas, fuentes y número de versión. Los resultados de calificación referencian el snapshot y guardan los títulos, descripciones, máximo y descriptor seleccionado por criterio. Las actividades legacy no requieren snapshot; las actividades versionadas no comparten instrumento mutable y no permiten modificación estructural. Cualquier actividad con notas registradas queda bloqueada para cambios estructurales. Las preferencias solo se registran al guardar y pertenecen a escuela/docente, con índice específico para fallback sin ámbito.

## 21. Seguridad y pruebas visuales/manuales

La asignación se comprueba por escuela y, en la creación preparada por un docente, por docente asignado. El ámbito se vuelve a resolver desde nivel/ciclo/grado/código/salida estructurados al guardar; cada texto, tipo, documento y página de fuente se contrasta con el elemento real. Las tablas nuevas tienen RLS explícito, permisos revocados para `anon`/`authenticated`, permisos limitados para `app_backend`, FKs e índices. La prueba local confirmó que `app_backend` no puede actualizar snapshots.

**Verificación visual local en Chrome:** con la sesión del usuario ya abierta se probó la entrada desde Actividades y desde Cursos → asignatura → Actividades. La base remota usada por `apps/backend/.env` carece todavía de las columnas de Fase C, por lo que el backend se reinició con `DATABASE_URL` apuntando únicamente a PostgreSQL local `127.0.0.1:54332`; no se migró ni modificó la base remota. Para recorrer el flujo se creó un centro, docente, curso y estudiante **sintéticos** con el script `seed-phase-c-visual-local.mjs`. En escritorio se escribió «Exposicion oral sobre el sitema respiratorio», se vio la sugerencia «Exposición» y el aviso de baja confianza sin atribución curricular; se preparó una rúbrica de cinco criterios y 20 puntos, se editó título/descripción de un criterio y un descriptor, se guardó la actividad, se calificó al estudiante sintético con 20/20 y se comprobó el bloqueo de edición estructural. En PostgreSQL, el snapshot y el resultado contienen las ediciones, referencia al snapshot y cero fuentes curriculares para ese caso LOW. También se prepararon y editaron en Chrome Lista de cotejo y Escala estimativa sin guardar borradores adicionales. La fecha del 27/09 aparecía como 26/09 en Cursos por zona horaria; se corrigió y se verificó de nuevo como 27/09. En viewport real de Chrome de **390 × 844 px** se revisaron el paso 1, el resumen apilado de una Lista ponderada y su configuración avanzada con desplazamiento horizontal; se restauró el tamaño de escritorio al terminar. El centro sintético local permanece disponible para revisión y no es dato de producción.

## 22–23. Resultados de pruebas, tipos y builds

Verificación realizada en esta rama:

| Comprobación | Resultado |
|---|---|
| `pnpm --filter backend test` | 182/182, 26 archivos |
| `pnpm --filter frontend test` | 285/285, 61 archivos |
| `node --test scripts/curriculum/curriculum.test.mjs scripts/curriculum/regression.test.mjs` | 53/53 |
| `node scripts/curriculum/verify-artifacts.mjs` | Primaria 45/45 ámbitos; Secundaria 72/72 |
| `pnpm --filter backend exec tsc --noEmit` | correcto |
| `pnpm --filter @aula/database exec tsc --noEmit` | correcto |
| `pnpm --filter @aula/shared exec tsc --noEmit` | correcto |
| `pnpm --filter backend build` | correcto |
| `pnpm --filter frontend build` | correcto, advertencia de chunks grandes ya existente |
| `pnpm cloudflare:build` | compilación y `wrangler deploy --dry-run` correctos; **sin deploy** |
| `verify-phase-c-local.mjs` | RLS, roles, FK, snapshot y rollback correctos; 0 fixtures restantes |
| `verify-phase-c-save-local.mjs` | cuatro tipos de instrumento, cinco instrumentos exclusivos, modalidad grupal, referencia literal, snapshots, preferencia y campos preservados; 0 fixtures restantes |
| `verify-local.mjs` (regresión Fase B) | 9 ámbitos; «Producción de poema romántico» en Humanidades y Lenguas Modernas: confianza HIGH, 2 elementos seleccionados y salida optativa aislada; cleanup correcto |

Cobertura de los 27 casos solicitados: 1–10 mediante tests del motor/servicio y la prueba local; 11–12 por huella y pruebas del adaptador; 13 por prueba de edición manual; 14 por tests de baja confianza; 15 por test de fallo de recomendación con acceso al constructor manual; 16–20 por test de transacción/rollback y cinco guardados locales; 21–22 por tests legacy y bloqueo; 23–25 por lectura de la actividad persistida en PostgreSQL; 26 por test de equipos existente y guardado local preparado en modalidad Grupal; 27 por tests del adaptador y guardados locales de los cuatro tipos. Por tanto, no se presenta como 27/27 escenarios de extremo a extremo.

## 24. Migración

`supabase/migrations/20260927232654_phase_c_instrument_snapshots.sql` es aditiva: crea `evaluation_instrument_snapshots`, `evaluation_snapshot_sources` y `teacher_instrument_preferences`; añade `pedagogical_activity_type` e `instrument_snapshot_id` a actividades y `instrument_snapshot_id` a notas. Se aplicó **solo** a PostgreSQL local `127.0.0.1:54332`. Prisma, tipos compartidos y `database.types.ts` se alinearon. No se editó ninguna migración anterior ni se tocó una base de producción.

## 25. Archivos de implementación

- Backend: `apps/backend/src/modules/evaluation-instruments/{recommendation-engine.ts,recommend-instrument.dto.ts,evaluation-instruments.service.ts,evaluation-instruments.module.ts}` y sus tests; `apps/backend/src/modules/grading/{grading.service.ts,grading.controller.ts,dto/save-evaluation-activity.dto.ts}` y tests.
- Frontend: `apps/frontend/src/modules/grading/{components/GradingBook.tsx,components/GradingBook.spec.tsx,pages/GradingPage.tsx,services/instrumentPreparation.ts,services/instrumentPreparation.spec.ts,types/index.ts}`; `apps/frontend/src/modules/courses/data/{academicAssignmentCatalog.ts,academicAssignmentCatalog.spec.ts,calendarDate.ts,calendarDate.spec.ts}` y las vistas de Cursos que usan la fecha académica; `apps/frontend/src/types/database.types.ts`.
- Base: `packages/database/prisma/schema.prisma`, `packages/shared/src/index.ts` (exportación de tipos compatible con el arranque de Node), la migración anterior y `scripts/evaluation-instruments/{verify-phase-c-local.mjs,verify-phase-c-save-local.mjs,seed-phase-c-visual-local.mjs}`.
- Documento: este informe.

## 26–27. Limitaciones y pendientes

No se usó IA generativa ni se añadieron secuencias didácticas. Las versiones curriculares de Fase A siguen DRAFT: el sistema no afirma que estén publicadas o aprobadas. En particular, el ámbito de 5.º Primaria/Ciencias de la Naturaleza no contiene literalmente «sistema respiratorio» ni «sistema circulatorio» en el dataset cargado; esos ejemplos deben usar fallback salvo selección verificada de otro contenido del mismo ámbito. Se verificó en Chrome la preparación visual de los cuatro tipos, una rúbrica completa hasta calificación histórica y ambos puntos de entrada. Los tres tipos restantes se guardaron mediante pruebas directas contra PostgreSQL, no mediante el navegador. No se abrió PR ni se desplegó.
