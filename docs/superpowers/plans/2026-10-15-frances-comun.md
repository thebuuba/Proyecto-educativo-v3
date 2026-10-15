# Francés común — Implementation Plan

> Ejecución mediante `executing-plans`, por el agente principal. El usuario prohíbe subagentes y autoriza decisiones rutinarias, commits y pushes sin nuevas confirmaciones.

**Goal:** conectar y verificar Francés común por grado, conservando los instrumentos históricos y el editor.

**Architecture:** proveedores compartidos de contenido francés con detección propia y adaptadores existentes de cuatro formatos. Servicio y alternativa local consumen el mismo contenido; releases nuevos e instalación restringida a Development.

**Tech Stack:** TypeScript, React, NestJS, Prisma/Supabase, Vitest, pnpm, Wrangler local, PDF.js y canvas ya instalados.

**Spec:** [alcance y diseño](../specs/2026-10-15-frances-comun-design.md).

## Restricciones globales

- Rama actual; sin subagentes, dependencias nuevas, producción, despliegues, main, reset ni esquemas remotos nuevos.
- Development `eolgunypmtgrsyrjzcld`; cuentas y datos QA; conservar datos y snapshots anteriores.
- Secuencia por grado; no declarar cerrada cobertura únicamente inventariada.

## Foco de revisión

- Ejemplos franceses y nombres propios no activan instrucciones ni temas por sí solos.
- Descripción incompatible con el título domina; fuera de grado, optativa o idioma incompatible no usa el proveedor común.
- Comprensión seguida de producción conserva ambas evidencias, y una alternativa no exige todos sus productos.
- Negaciones de acciones y referencias a recursos de entrega no generan criterios ajenos.
- Formatos, pesos, identidad de criterios y estrategia no se contaminan entre regeneraciones ni versiones históricas.

## Bloque 0 — cerrar Development

- [x] Revisar Git, procesos y sincronización; conservar el commit `1db3e19` existente.
- [x] Ejecutar `pnpm cloudflare:build` y verificar PostgreSQL/Auth/Storage/frontend de localhost.
- [ ] Documentar el nuevo resultado, revisar diff/secretos y publicar el punto de continuación.

## Bloque 1 — inventario contrastado

**Fuentes:** `apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf`, `docs/curriculum/cobertura-secundaria/inventario.json`.
**Crear:** `frances-matriz.json`, `frances-inventario.md` y script reproducible `scripts/evaluation-instruments/review-french-source.mjs`.

- [ ] Verificar hash y ámbitos comunes; renderizar tablas y continuaciones con PDF.js/canvas existentes.
- [ ] Revisar páginas aplicables y registrar por grado funciones, conceptos, géneros, estrategias, fuentes y exclusiones. Mantener las citas oficiales sin normalizarlas silenciosamente.
- [ ] Separar estados de inventario, conexión, automatización, HTTP/DB y navegador; todavía no marcar cobertura implementada.
- [ ] Verificar artefactos y publicar inventario/plan.

## Bloques 2–7 — un grado aplicable por bloque, en orden

**Crear:** `packages/shared/src/secondary-french.ts`, `secondary-french-task.ts`, `secondary-french-grade-<n>.ts`; contratos `data/evaluation-instruments/french-grade-<n>-contracts.json`; pruebas backend y frontend `french-grade-<n>.spec.ts`; informe y ejemplos por grado.
**Modificar conexiones:** `packages/shared/src/index.ts`, servicio/motor de recomendación, sugerencias y preparación local del frontend; estrategia compartida solo donde sea necesario.
**Interfaces:** `resolveCommonFrenchTask(title, description, context)`, `commonFrenchCriteria(task)`, `commonFrenchSelections(task, description)`. Entrada `InstrumentAcademicContext`; salida de criterios `ContextualTopicCriterion[]`, consumida por `editableAuthoredRecommendation`.

Para cada grado, antes de habilitar el siguiente:

- [ ] Leer y cotejar visualmente todos sus registros oficiales; definir familias y límites de reconocimiento documentados.
- [ ] Escribir contratos RED con las clases de entrada de la especificación, cuatro formatos y 20/17.35. Confirmar que el proveedor aún no los satisface.
- [ ] Implementar contenido propio de Francés y detección acotada; conectar los mismos criterios al servicio y alternativa local. No interpolar el título en criterios ni exigir rasgos ausentes.
- [ ] Verificar igualdad de contenido, selección explícita, progresiones, adición/completado, agotamiento, límites y conservación de manuales/estrategia. Revisar instrumentos completos, no solo contadores.
- [ ] Congelar release vigente y crear el siguiente sin editar los anteriores. Instalar exclusivamente en Development dos veces y comprobar idempotencia/históricos.
- [ ] Preparar contexto QA del grado; probar HTTP/DB autenticados en localhost y generación/edición/guardado/reapertura de los cuatro formatos en navegador. Registrar cualquier bloqueo real.
- [ ] Ejecutar suites focalizadas durante el desarrollo; al cerrar el bloque, backend test/build, frontend build y cloudflare:build. Repetir suite frontend cuando cambios compartidos lo justifiquen.
- [ ] Actualizar matriz, ejemplos completos, informe y continuación; revisar secretos/diff; commit español y push normal. Avanzar al grado siguiente únicamente después de verificar el bloque.

## Cierre

- [ ] Revisar la especificación contra evidencia y distinguir cobertura conectada de inventario.
- [ ] Verificar los cuatro destinos de Development y el código realmente servido.
- [ ] Informe consolidado, ejemplos completos, estado Git y pendientes concretos. No cambiar a otra asignatura.
