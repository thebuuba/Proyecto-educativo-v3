# Instrumentos pendientes de secundaria — plan de ejecución

> Ejecución individual mediante `executing-plans` y TDD. El usuario ha autorizado continuar entre bloques sin confirmaciones y exige trabajar en la rama actual; no crear otro worktree ni usar subagentes.

**Objetivo:** completar las áreas y optativas pendientes según sus fuentes oficiales, distinguiendo inventario, implementación y verificación real.

**Arquitectura:** proveedores deterministas compartidos en `packages/shared/src`, conectados al motor backend, sugerencias y alternativa local existentes. Versiones nuevas de catálogo; los releases instalados y snapshots históricos son inmutables. Reutilizar formateadores, pesos, puntuación y persistencia actuales.

**Stack:** TypeScript, Nest, React, Vitest, Prisma y PostgreSQL/Supabase Development; pnpm. Sin nuevas dependencias.

**Especificación:** [encargo íntegro](../specs/2026-10-17-secundaria-pendiente-encargo.md).

## Restricciones globales

- Development `eolgunypmtgrsyrjzcld` exclusivamente; guard de PostgreSQL, Auth, Storage y frontend antes de escribir.
- Sin producción, despliegue, merge a main, migraciones remotas de esquema, reset, force push, borrados o copia de usuarios.
- Mantener el creador vertical, cuatro controles, puntos pendientes, selección manual, preparación silenciosa y snapshots inmutables.
- Fuente literal separada de adaptaciones; no convertir encabezados ni personalidad, fe o apariencia en desempeños evaluados.
- Revisar instrumentos completos, no aprobar por conteos, HTTP 200 o sumas.
- Commits locales por bloques; el usuario ordenó dejar los pushes pendientes hasta revisar las integraciones automáticas. No cambiar triggers ni permisos. Continuar sin pedir permiso entre temas/grados; bloqueos externos no impiden el trabajo independiente.

## Foco de revisión

Consigna corta frente a título incompatible; acciones independientes y negadas; alternativas sin exigir ambos productos; identificación de fuentes frente a investigación inventada; contexto común frente a optativa/modalidad. Cada contrato debe ejercitar estos casos en cuatro formatos y 20/17.35/sin puntos, con paridad de motor y alternativa local.

## Bloques

### 1. Auditoría inicial e inventario maestro

- [x] Revisar Git, fuentes, evidencia de Naturales y guard del entorno.
- [x] Separar los 17 encabezados sin grado de los 72 ámbitos por grado (54 comunes y 18 optativos académicos).
- [x] Cotejar visualmente PDF48,49,55 y conservar la procedencia del inventario.
- [x] Confirmar catálogo servido, disponibilidad de localhost y preservación de históricos actuales.
- [x] Guardar auditoría y continuación mediante commit local `be93440c`; push pendiente por instrucción del usuario.

Archivos: `scripts/evaluation-instruments/secondary-master-inventory.mjs`, `docs/curriculum/cobertura-secundaria/secundaria-inventario-maestro.{json,md}`, informe y continuación de este encargo. La comprobación del script debe rechazar un PDF con hash distinto y scopes duplicados.

### 2. Ciencias Sociales común, grados 1–6

Para cada grado, en orden:

- [ ] Renderizar y revisar todas las páginas de la malla, incluidas continuaciones e indicadores; registrar conceptos/procedimientos y exclusiones.
- [ ] Escribir y ejecutar contratos que fallen por falta de proveedor contextual; consignas representativas y negativas de cada tema/familia, cuatro formatos y progresión.
- [ ] Implementar criterios disciplinares observables en proveedor compartido; conectar motor, sugerencias y alternativa local sin duplicar los formateadores.
- [ ] Revisar los instrumentos completos y medir preparación pura; corregir fallos con regresión.
- [ ] Congelar release anterior y crear el nuevo. Instalar fuente/catálogo únicamente en Development con idempotencia y huellas históricas.
- [ ] Probar cuatro formatos mediante HTTP/DB por contexto; medir recomendación/guardado. Recorridos representativos de navegador por grado; registrar bloqueos explícitamente.
- [ ] Ejecutar comprobaciones del repositorio al cerrar el bloque, revisar secretos/diff, actualizar matriz/informe/continuación, commit y push.

Interfaces: `InstrumentAcademicContext`, `ContextualTopicCriterion`, `InstrumentRecommendation` y adaptador existente de recomendaciones editables. Modificar las conexiones existentes en `recommendation-engine.ts`, `evaluation-instruments.service.ts`, `instrumentPreparation.ts`, `activityDefaultSuggestions.ts` y export público. Fuente: PDF244–280 según grado.

### 3. Otras áreas comunes

Repetir el contrato completo del bloque 2 para Artística (PDF330–349), Física (PDF359–382) y Formación Integral Humana y Religiosa (PDF392–424). Usar evidencia expresiva, motriz y reflexiva propia; no reutilizar criterios de Lengua como sustituto disciplinar. La presencia por grado viene del inventario maestro.

### 4. Optativas y fuentes complementarias

Revisar las tablas PDF427,461,490,498 y sus 18 ámbitos por grado antes de implementar. Conservar las salidas distintas aunque compartan denominación; no habilitar optativas en primer ciclo. Buscar fuentes oficiales complementarias de otras modalidades; si no están accesibles, documentar el límite por mención y continuar las fuentes disponibles. No declarar cerrado ese ámbito sin fuente.

### 5. Cierre consolidado

Revisar la matriz de estado, instrumentos completos y evidencias de cada área. Ejecutar `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`, `pnpm cloudflare:build` y las regresiones frontend afectadas. Verificar integridad de releases/snapshots, configuración efectiva, último commit/upstream y árbol. Enumerar cualquier pendiente real sin presentar cierre parcial como finalización del encargo.

HLM5: epopeya y novela policíaca conectadas/verificadas mediante272instrumentos y12muestrasHTTP/DB enDevelopment125. Navegadorpersonalpendientedeautenticación. Dosoptativasacadémicasconectadas,demás16pendientes;no cerrar elpaso global. SiguienteHLM6periodismo/publicidadyregresióndelaliaspolicialsingularen126,pushretenido.
