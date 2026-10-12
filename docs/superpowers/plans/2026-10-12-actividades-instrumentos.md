# Corrección de Actividades e Instrumentos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Cada tarea incorpora pruebas de regresión, evidencia de fallo previo, implementación, revisión y corrección de hallazgos.

**Goal:** Corregir todos los fallos de Actividades e Instrumentos y simplificar su creación sin perder evidencia ni calificaciones.

**Architecture:** Mantener los contratos existentes mientras se centralizan las reglas matemáticas y de validación en utilidades compartidas. Separar el creador y sus instrumentos del libro de calificaciones por responsabilidad; usar servicios de Actividades para persistencia y autorización.

**Tech Stack:** React, TypeScript, NestJS, Prisma, Supabase, Vitest, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-12-actividades-instrumentos-design.md`.

## Global Constraints

Respetar AGENTS.md y el sistema semántico. No agregar dependencias, no editar migraciones aplicadas, no publicar ni desplegar. No borrar ni reescribir trabajo ajeno. Subagentes sin subagentes y sin commits. Cada agente modifica exclusivamente sus archivos asignados. Revisiones usan el diff y el informe de la tarea, sin repetir suites ya verificadas sobre el mismo estado.

## Review Focus

- Docente que conoce identificadores de otra asignatura del colegio: rechazo sin escritura ni lectura de evidencia ajena (Task 1).
- Error entre instrumento y equipos / repetición por pérdida de respuesta: reversión o misma actividad, nunca duplicado (Tasks 1, 3).
- Etiquetas y puntuaciones personalizadas, escala de cinco niveles, indicador ponderado editado y peso fraccionario: misma definición y total exacto (Tasks 2, 4).
- Todos los criterios no aplicables y cambios de cuenta en el navegador: no nota ficticia ni borradores ajenos (Tasks 3, 5).
- Actividad pendiente versionada y actividad con notas: edición consistente, preservando la evidencia anterior (Tasks 4, 5).

### Task 1: Permisos y persistencia atómica

**Files:** `apps/backend/src/modules/activities/activities.controller.ts`, `activities.service.ts`, `dto/save-activity.dto.ts`; `apps/backend/src/modules/grading/grading.service.ts` y sus pruebas. Crear helpers del dominio si reducen duplicación real.

**Interfaces:** Propagar `userId` y `roles` en todas las operaciones HTTP de actividades, manteniendo llamadas internas existentes compatibles y explícitas. Agregar `creationId?: string` UUID al DTO para reintentos de creación, usando la PK de actividad y comprobando propietario/contexto; devolver la misma actividad en reintento autorizado. La Task 3 enviará este campo.

- [x] Reproducir denegación ausente de docentes en lectura/edición/eliminación/vínculo; usar mocks de Prisma únicamente en frontera de BD.
- [x] Comprobar asignación y rol de forma común, incluyendo lectura sin filtros y contexto académico activo.
- [x] Guardar instrumentos editables, actividad y sincronización de equipos dentro de la misma transacción. Clonar instrumentos reutilizados, conservando originales.
- [x] Añadir pruebas de rollback, creación repetida y autorización del reintento; comprobar calificaciones al eliminar y editar sin regresión.
- [x] Ejecutar suite backend, documentar resultado y revisar el diff. No modificar contratos de snapshot todavía; Task 4 los completa.

### Task 2: Definición y matemática compartidas

**Files:** `packages/shared/src/instrument-definition.ts` (nuevo) y export en `index.ts`; `apps/frontend/src/modules/activities/services/instrumentPreparation.ts`, `instrumentScoring.ts`, `instrumentCriterionAddition.ts` y pruebas.

**Interfaces:** Exportar límites/tipos y `distributeScoreUnits(totalUnits: number, weights: number[]): number[]`; `validateInstrumentDefinition(type: string, fields: Record<string,string>, maxScore: number): string[]`; `instrumentEvaluationConfiguration(type: string, fields: Record<string,string>, maxScore: number)` devuelve criterios `{title, description, maximum, descriptors?}` y niveles `{label, points}`, más configuración No aplica. Mantener adaptadores históricos mientras los consumidores migran. Task 4 consume validación y Task 5 consume evaluación.

- [x] Escribir reproducciones de etiquetas/puntos personalizados, cinco niveles y edición de indicador ponderado; observar fallo y corregir alineación de snapshot con todos los campos editables.
- [x] Compartir límites de 20 criterios y 2–6 niveles, validación de campos, distribución exacta en centésimas y valores pequeños sin NaN ni bucles indefinidos.
- [x] Corregir la atribución de fuentes cuando criterios/indicadores cambian; conservar IDs por identidad y no reasignar referencias por índice al mover filas.
- [x] Definir cálculo aplicable para No aplica, con selección persistible de `-1`; todos excluidos produce resultado nulo, no una nota.
- [x] Ejecutar pruebas focalizadas y builds shared, informar API exacta para los consumidores y revisar.

### Task 3: Recuperación del creador y borradores aislados

**Files:** `apps/frontend/src/modules/activities/components/ActivityCreator.tsx`, `ActivityDraftsPanel.tsx`, `hooks/useActivities.ts`, `utils/activityDraftStorage.ts`, `pages/ActivitiesPage.tsx`, tipos y pruebas asociadas. No modificar GradingBook; comunicar integración a Task 5.

**Interfaces:** Crear contexto de borrador con IDs `{schoolId,userId,schoolYearId,sectionSubjectId,academicPeriodId}` y funciones compartidas para clave, lectura, escritura y progreso. `useActivities` separa error de carga/error de mutación y conserva datos del editor; Task 5 recibe contexto y resultado real del autoguardado. `SaveActivityInput.creationId?: string` estable por intento/draft.

- [x] Reproducir error de guardar que desmonta el formulario, respuestas de carga obsoletas y contexto inválido que queda cargando.
- [x] Conservar editor y valores, mostrar errores con reintento y manejar errores de equipos explícitamente.
- [x] Aislar lectura/escritura de borradores por IDs y cuenta; mantener entradas antiguas sin exponerlas automáticamente; unificar progreso de panel y editor mediante validación común.
- [x] Preservar identificador de creación y enviarlo al guardar para evitar duplicación al reintentar.
- [x] Ejecutar pruebas focalizadas, indicar cambios necesarios en GradingBook y revisar.

### Task 4: Contratos del servidor y versiones inmutables

**Files:** backend grading/activities DTOs y servicios/pruebas; módulos evaluation-instruments para límites; Prisma/migraciones/tipos solamente si son necesarios. Depende de Tasks 1 y 2.

**Interfaces:** Consumir validación compartida de Task 2. Notas de 0–10000, máximo real de actividad, dos decimales. Actividad sin notas permite nueva versión guardada sin modificar payload anterior. Actividad con notas permite metadatos, pero no máximo, criterios, pesos, contexto, modalidad ni equipos.

- [x] Añadir pruebas de manual incompleto, enum inválido, niveles incoherentes, 20 criterios y notas de 150/200 puntos.
- [x] Validar ruta manual y versionada con invariantes comunes y robustez frente a JSON malformado; no confiar en el snapshot del cliente sin verificar sus campos.
- [x] Corregir edición de actividades versionadas y metadatos de calificadas; preservar evidencia anterior y calificaciones. Cada nueva revisión enlaza a su snapshot anterior mediante `previousSnapshotId`, de modo que la historia no quede como registros huérfanos. Si requiere columna, crear migration nueva, FK autorreferente y alineación Prisma/tipos; no mutar payload anterior.
- [x] Comprobar resultados de instrumento contra la definición real, incluyendo selección No aplica, puntaje exacto por criterio y máximo; no aceptar tipo ni desglose falso.
- [x] Revisar atomicidad y concurrencia con Task 1; añadir una migración nueva si hay una necesidad real de persistencia y alinear todos los esquemas.
- [x] Ejecutar backend test/build y revisar el diff.

### Task 5: Creador independiente y evaluación consistente

**Files:** `apps/frontend/src/modules/grading/components/GradingBook.tsx` y pruebas; nuevos componentes/hooks de Actividades por responsabilidad; ActivityCreator y consumidores de Cursos/Planificación; estilos del módulo Actividades. Depende de Tasks 2, 3 y 4.

**Interfaces:** Extraer el creador y editores al módulo Actividades; GradingBook consume los mismos componentes/configuración, sin duplicar implementación. Mantener navegación/orígenes y usar los contratos definidos en Tasks 2/3/4.

- [x] Integrar definición compartida, borradores aislados y estado de almacenamiento real. Usar versión final coherente tanto en preparación como evaluación y lectura.
- [x] Implementar No aplica en evaluación, reajustar centésimas conservando total y guardar selección/evidencia; todos excluidos bloquea nota con explicación.
- [x] Separar creador del libro; organizar Actividad, Instrumento y Revisar/guardar con errores accesibles y avance preservado.
- [x] Mostrar procedencia de catálogo/local/manual y explicar alternativa local tras fallo. Proteger ediciones manuales y solicitudes obsoletas.
- [x] Aplicar reglas de edición y duplicación coherentes; conservar navegación desde cuatro orígenes.
- [x] Migrar UI afectada a componentes/tokens semánticos y quitar compatibilidad obsoleta segura. Actualizar DESIGN_SYSTEM si contiene reglas contradictorias con AGENTS.md.
- [x] Pruebas funcionales de crear/editar/reintentar/borrador/evaluar, compilar frontend y revisar tamaño de chunks para demostrar reducción de carga del creador.

### Task 6: Revisión completa y verificación final

**Files:** pruebas y cualquier integración faltante dentro del alcance; documentación de cierre.

- [x] Revisor independiente verifica los 18 requisitos contra fuentes/diff y evidencia; señala faltantes reales, sin equiparar compilación verde a cobertura funcional.
- [x] Un subagente corrige hallazgos pendientes; revisión focalizada del arreglo y ninguna omisión silenciosa.
- [x] Ejecutar `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`, `pnpm cloudflare:build` y pruebas frontend relevantes.
- [x] Comprobar esquemas/migraciones si cambiaron, ausencia de secretos/dependencias nuevas, navegación y comportamiento accesible.
- [x] Actualizar el grafo local si es útil sin indexar secretos. Entregar cambios, pruebas, límites reales y estado completo por requisito.
