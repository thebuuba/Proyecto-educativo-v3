# Ciencias de la Naturaleza común: plan de implementación

> Ejecución directa con executing-plans. El encargo prohíbe subagentes y autoriza resolver decisiones rutinarias sin consultas.

**Objetivo:** conectar contenidos comunes de 1.º a 6.º con instrumentos deterministas pertinentes, comprobados por grado en Development.

**Arquitectura:** conservar el editor y sus contratos; añadir un proveedor compartido de Ciencias con catálogo de temas por grado y análisis de acciones. Reutilizar formateadores, distribución en centésimas, condiciones de entrega y mecanismos existentes de importación/versionado. No duplicar motores HTTP/local ni utilizar reglas por títulos exactos.

**Tecnología:** TypeScript, pnpm, Vitest, Prisma/PostgreSQL Development, PDF.js y herramientas existentes; sin dependencias nuevas.

**Especificación:** adjunto del usuario `3a8f59da-f60e-4c77-89e3-8f76dce81769/Texto pegado.txt`, leído íntegro. Fuente local MINERD 2023; Ciencias Sociales y optativas excluidas.

## Límites

- Solo proyecto `eolgunypmtgrsyrjzcld`; conservar datos, cuentas, borradores y snapshots.
- Sin producción, despliegues, merge, resets, force push ni migraciones remotas de esquema.
- Mantener controles compactos, preparación silenciosa, puntuación vacía y todas las decisiones manuales.
- No declarar cobertura por inventario, conteos de pruebas o HTTP200: revisar instrumentos completos.

## Riesgos que deben comprobarse

- Descripción nueva con título viejo; recursos/ejemplos/negaciones convertidos en requisitos.
- Explicar frente a ejecutar una práctica; datos proporcionados frente a recolección.
- Alternativas convertidas en dos obligaciones; trabajos grupales con roles inventados.
- Hipótesis no confirmadas y resultados inesperados penalizados indebidamente.
- Mismo proveedor/selecciones entre HTTP y alternativa local; históricos inmutables.

## Archivos e interfaces

- `packages/shared/src/secondary-science-common.ts`: `resolveCommonScienceTask`, `commonScienceCriteria`, `commonScienceSelections`, metadatos por grado.
- `packages/shared/src/secondary-science-grade-N.ts`: temas, patrones, relaciones científicas y páginas verificadas.
- `packages/shared/src/index.ts`: exportaciones; integrar en `recommendation-engine.ts`, `evaluation-instruments.service.ts`, `activityDefaultSuggestions.ts`, `instrumentPreparation.ts` y atajo local del creador.
- `apps/backend/src/modules/evaluation-instruments/catalog-current.ts` y nuevo congelado por bloque: contenido versionado sin reescribir releases anteriores.
- `scripts/evaluation-instruments/science-*.mjs`: fuente limitada, contextos QA, instalación idempotente, evidencia HTTP/DB y conservación histórica.
- `docs/curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json`: texto oficial separado de adaptaciones y estado de conexión real.
- `docs/superpowers/reports/2026-10-16-ciencias-naturaleza-*.md`: evidencia por grado, ejemplos completos, continuación y consolidación.

## Secuencia por grado (sin avanzar antes de verificar el bloque anterior)

### Preparación

- [x] Revisar Git/status/diff/log/procesos y fetch: limpio, sincronizado, `adb5a307`.
- [x] Consultar Development de solo lectura: catálogo85,18releases,73snapshots; conservar huellas iniciales.
- [x] Confirmar cierre anterior de selectores sin pendientes funcionales.
- [x] Confirmar runtime PostgreSQL/Auth/Storage/frontend y assets efectivamente servidos.
- [x] Inspeccionar visualmente PDF293–295, impresas292–294, para 1.º.
- [x] Registrar matriz oficial, distribución y exclusiones de1.º; verificar fuente antes de instalarla. Otros grados conservanPENDING hasta revisión real.

### 1.º

- [x] Escribir pruebas fallidas de temas, familias, negaciones, alternativas, formatos y paridad.
- [x] Implementar proveedor y contenidos de Tierra/Universo; revisar instrumentos completos.
- [x] Congelar85, crear86; instalar fuente y release únicamente tras comprobaciones.
- [x] HTTP/DB autenticado, cuatro formatos20/17.35, guardado/reapertura/históricos.
- [x] Navegador QA: cuatro formatos, edición, añadir/completar, estrategia, guardado/reapertura y tiempos.
- [x] Checks del repositorio, informe y revisión diff/secretos.
- [x] Commit español y push normal del bloque1.º: `38bc31d29f3085579e786851823bc3aea70bb57a`, sincronizado.

### 2.º → 6.º

Para cada grado, repetir lectura visual y matriz → prueba roja → proveedor → revisión científica completa → pruebas focalizadas/regresiones → congelar/versionar/instalar idempotente → HTTP/DB → navegador cuatro formatos y tiempos → checks afectados/informe/commit/push. No conectar el siguiente grado antes de cerrar el anterior.

- [x] 2.º: Ciencias de la Vida PDF296–299;30temas/68consignas/272instrumentos revisados, fuente/release87 idempotentes, HTTP/DB y navegador cuatro formatos, checks finales aprobados. Informe y evidencia por grado; consultar Git para el commit/push del cierre.
- [ ] 3.º: fuente y componente pendientes de revisión visual.
- [ ] 4.º: fuente y componente pendientes de revisión visual.
- [ ] 5.º: fuente y componente pendientes de revisión visual.
- [ ] 6.º: fuente y componente pendientes de revisión visual; preservar antecedente parcial de Ohm.
- [ ] Consolidación final con cobertura real, límites, hashes y árbol; detenerse.
