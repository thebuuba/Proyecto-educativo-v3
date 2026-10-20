# Ofimática de cuarto — plan de implementación

> Ejecución individual mediante `executing-plans` y TDD, dentro del encargo integral aprobado. Sin subagentes ni preguntas para continuar entre bloques.

**Objetivo:** conectar Ofimática `MF_002_3` de cuarto técnico con evidencias propias y cuatro formatos, usando las fuentes revisadas de IFC006 e IFC007 y conservando los instrumentos anteriores.

**Arquitectura:** ampliar el proveedor técnico compartido y sus metadatos, sin duplicar el motor ni el creador. Usar IFC007 como fuente principal porque contiene también las tablas C/P/A; conservar IFC006 como corroboración explícita de asignación y RA/CE. Un módulo común no se duplica por aparecer en dos programas. La presencia en otros programas sigue pendiente de sus fuentes.

**Stack:** TypeScript, pnpm, Node, Vitest, Nest, React y PostgreSQL Development. Sin dependencias ni cambios de esquema.

**Especificación:** [encargo integral](../specs/2026-10-17-secundaria-pendiente-encargo.md). [Contraste documental](../reports/2026-10-20-tecnico-ofimatica-4-fuentes.md). Base de aplicación `08477b7c`, catálogo142; MF053 mantiene su verificación remota parcial porDNS.

## Límites globales

- Solo Development `eolgunypmtgrsyrjzcld`. Sin producción, main, merge, despliegues, cambios de red/integraciones, reset, borrados, cuentas o estudiantes nuevos.
- NO PUSH vigente. Commits locales en español por bloques comprobados.
- Conservar el borrador personal MF053 y sus cuatroIDs HTTP; no reiniciar pruebas en bucle ni reemplazar baselines.
- Fuente literal separada de adaptaciones. Nivel de cualificación3 no equivale a tercero; la asignación revisada es cuarto.
- Mantener controles compactos, diseño vertical, preparación silenciosa, puntos pendientes,20/17.35 exactos, manuales y cambio exclusivo de estrategia.
- No cambiar el esquema para atribuir programa a una matrícula: el contexto actual distingue código, grado y modalidad. Documentar esa limitación y no afirmar validación de matrícula por programa.

## Focos de revisión

Presentación como archivo frente a exposición oral; procesador de texto frente a análisis literario; tablas de documento frente a tablas dinámicas; formato visual solicitado frente a juicio estético; selección de fórmulas frente a pedirlas todas; correo simulado frente a envío real; proteger un documento frente a revelar credenciales; explicar macros frente a ejecutarlas. La descripción prevalece sobre un título antiguo. Alternativas, negaciones y recursos opcionales no introducen entregables obligatorios.

## Task1: transcripción y correspondencia documental

**Archivos:** `docs/curriculum/cobertura-secundaria/technical-mf002-4-matriz.json`, `scripts/evaluation-instruments/technical-mf002-source.test.mjs`, informe de fuentes y matriz especializada.

- [x] Leer visualmente IFC006 PDF49–55 eIFC007 PDF54–66 y contrastar67ocurrencias CE/65códigos. Conservar duplicadosCE3.4/CE3.5 y las cuatro continuaciones RA detectadas en la extracción.
- [x] RED de contexto, integridad y tipos:9RA,67CE, ocurrencias únicas, partes con documento/página, tabla C/P/A y9orientaciones IFC007; no importar el módulo anterior ni Emprendimiento.
- [x] Transcribir por columnas y continuaciones con partes literales verificables. No contar cada subencabezado como tema ni corregir errores de la fuente. Conservar ambas procedencias de RA/CE.
- [x] Registrar políticas: actitudes privadas excluidas; orientaciones docentes fuera de entregables; seguridad observable solo cuando proceda. Condición200p.p.m./una falta por minuto conservada, sin requisito automático.
- [x] GREEN y revisión documental:210registros/302partes;5pruebas aprobadas. Corregidos espacios de extracción por posición de fragmentos y separación de dos procedimientos enPDF63, sin corregir erratas impresas.
- [ ] Inventario, informe, auditoría y commit local del bloque documental.

## Task2: contexto y conservación de142

**Archivos:** `catalog-v142.ts`, `catalog-current.ts`, `curriculum-context.ts`, `evaluation-instruments.service.ts`, contratos de contexto técnico y comparación de definiciones.

- [ ] Congelar142 una sola vez desde fuente/compilado y lectura de DB verificable. Conservar75releases/985snapshots actuales y los baselines anteriores; no regenerarlos.
- [ ] RED: MF002/cuarto/ciclo2/técnico resuelve un ámbito documental único; académico, Artes, primaria, otros grados y salidas optativas se rechazan. MF053 conserva exactamente sus296definiciones y contexto.
- [ ] Sustituir la identidad técnica única por una lista explícita de módulos revisados; no habilitar cualquier códigoMF ni resolver nombres difusos. La metadata declara las procedencias revisadas sin fingir que el contexto incluye un programa.
- [ ] GREEN de contexto/servicio/catálogos. Si la lectura remota está bloqueada, continuar fuente y pruebas locales; no publicar un catálogo sin conservación verificable.

## Task3: proveedor y lectura de instrumentos

**Archivos:** `packages/shared/src/secondary-technical-mf002-4.ts`, `secondary-technical.ts`, contratos `data/evaluation-instruments/technical-mf002-four-contracts.json`, backend/frontend specs, artefactos completos y revisión.

- [ ] RED de familias: sistema operativo/periféricos; documentos, plantillas y formato; tablas/objetos/correspondencia; colaboración/revisión/referencias; hojas de cálculo, funciones y gráficos; filtros/listas/tablas dinámicas; presentaciones; búsqueda/archivos; correo/agenda/transferencia.
- [ ] Incluir cada procedimiento y condición observable pertinente, con anclas RA/CE/C/P y exclusiones. Contratos de consignas breves y desarrolladas, cuatro formatos, puntuación pendiente/20/17.35, acciones independientes, alternativas, negaciones, manuales y título incompatible.
- [ ] Reutilizar `resolveTechnicalTask`, `technicalCriteria`, `technicalSelections` y `adaptTechnicalScale`; hacer el prefijo del módulo explícito conservando todos los IDs deMF053. Ajustes al analizador compartido solo por regresiones demostradas.
- [ ] Leer los instrumentos completos de todas las consignas y formatos; corregir con RED→GREEN; registrar textos, ensamblajes y huellas. No cerrar por conteos.
- [ ] Comprobar paridad servidor/alternativa local y sugerencias por propósito. Las orientaciones docentes, software comercial y envío/publicación no se imponen por defecto.

## Task4: instalación individual y pruebas reales

- [ ] Manifest determinista, trazabilidad de ambas fuentes, correspondencia explícita de año normativo frente a edición desconocida. Preservar los RA y orientaciones en metadata cuando el esquema no admite esos tipos.
- [ ] Pasar suites/builds obligatorios, lints afectados, Node y precaché antes de instalar; comparar todos los ámbitos anteriores y recompilar el entorno habitual.
- [ ] Con servidor estable y cuatro servicios verificados, instalar solo la fuente y el catálogo revisados, con segunda ejecuciónUNCHANGED. ContextoQA separado, cuentas existentes, sin estudiantes.
- [ ] Elegir muestras por CE/familia; HTTP autenticado de cuatro formatos,20/17.35/pending/manuales/guardar/reabrir/estrategia-only exacta. Preservar progreso eIDs ante fallos.
- [ ] Navegador personal representativo; distinguir pruebas visuales, fallback local y persistencia. No heredar la prueba QA a la cuenta personal.

## Task5: cierre y continuidad

- [ ] Confirmar históricos y baselines tras escrituras; actualizar matriz, informe, inventario maestro y continuación con pendientes reales.
- [ ] Revisión propia separada, diff, UTF8 y exclusión de secretos/respaldos/credenciales; commit local en español, sin push.
- [ ] Continuar los demás módulos reales y pendientes independientes del encargo integral. Ofimática no cierra los75documentos técnicos ni las modalidades de Artes.
