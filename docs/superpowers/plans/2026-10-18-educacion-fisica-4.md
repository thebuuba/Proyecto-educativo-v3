# Educación Física de 4.º: plan de implementación

Ejecución individual mediante executing-plans y TDD, conforme al [encargo integral](../specs/2026-10-17-secundaria-pendiente-encargo.md) y al plan maestro. Base `471d03f25c5371b5bf54899dd43a4c3293d68ddb`. Frozen114 creado una sola vez y cotejado READ ONLY contra Development antes de ampliar código; no regenerarlo ni modificar releases históricos.

Objetivo: conectar los desempeños propios de Educación Física común de 4.º al proveedor determinista compartido, con instrumentos completos pertinentes, puntuaciones exactas y persistencia comprobada. Se mantienen TypeScript, Vitest, React/Nest y los formateadores existentes; sin otro motor ni dependencias.

Fuente MINERD2023, PDF374–376/impresas373–375, SHA256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`. Las tres páginas ya se leyeron visualmente completas. Ámbito `9a5674ad-6a36-5273-bbd6-01b461f1e651`:115 registros,33 conceptos/39 procedimientos/8 actitudes/21 indicadores/14 competencias. No repetir la lectura sin cambio de fuente. Deportes optativos dentro de EFI no equivalen a salidas académicas.

Restricciones: misma rama, sin push, subagentes, main, producción, despliegue, resets, borrados, esquema o cuentas nuevas. Solo Development `eolgunypmtgrsyrjzcld`; comprobar PostgreSQL/Auth/Storage/frontend efectivos antes de escrituras. Mantener el creador vertical, preparación silenciosa, puntos pendientes y selección manual. Detener únicamente el Worker propio verificado antes de escribir dist; no Prisma generate con helpers Prisma activos.

## 1. Contratos y fuente

- [x] Crear `data/evaluation-instruments/physical-grade-four-contracts.json`, `physical-grade-four-contract.spec.ts` backend y `physicalGradeFourContract.spec.ts` frontend. Consignas breves y desarrolladas, título incompatible, negaciones, alternativas, modalidad y recursos expresos; cuatro formatos y20/17.35/sin puntos. Ejecutar primero para observar fallo por proveedor ausente.
- [x] Mapear todas las filas útiles y justificar encabezados, rasgos privados y continuaciones. Registrar ventajas de ajedrez impresas bajo GimnasiaGeneral, continuación de investigación de aparatos, fragmento de defensa zonal y palabra huérfana «gimnásticos», sin reescribir el literal ni generar criterios duplicados.

## 2. Proveedor contextual

- [x] Añadir metadata `packages/shared/src/secondary-physical-grade-4.ts` y registro4 en `secondary-physical.ts`, conservando módulos1–3. Reutilizar evidencia válida únicamente cuando la nueva fuente la sustente. Ajustar solo carencias demostradas por regresiones.
- [x] Cubrir capacidades/coordinación, circuitos/flexibilidad/continuidad/variaciones/equilibrio/orientación; posturas/ritmo/composición/planificación/terminología/aparatos/modalidades de gimnasia; bienestar/calentamiento por referentes; referentes locales/reglas/técnica/posesión/contraataque/bloqueos/defensas/táctica/adaptaciones de baloncesto; balonmano; variantes y ventajas de ajedrez. Diferenciar explicación, investigación, práctica, plan, análisis, verificación y frecuencia.
- [x] No trasladar automáticamente fútbol/voleibol/raqueta de3.º, nutrición o silla de ruedas de balonmano sin referente de4.º. Conservar variantes elegidas, recursos y acciones independientes sin imponer otras. No dosis7–11min, acrobacias/aparatos o maniobras operativas nuevas. Sin evaluación de apariencia, capacidad natural, fe, intimidad, emociones o personalidad.

## 3. Revisión y comprobaciones

- [x] Generar matriz, correspondencias y ejemplos con los runners existentes ampliados explícitamente a4.º. Leer completos todos los instrumentos representativos: progresión de la misma evidencia, pesos, cumplimiento, escala, total y parcial ponderado. Registrar SHA después de leer y repetir solo huellas alteradas.
- [x] Comparar por lectura todos los campos de catálogo previos e instrumentos completos EFI1–3,Sociales1–6,Artística1–6. Nuevo catálogo115, sin sobrescribir114. Mantener fuentes y manifiesto iguales al compilado e instalado.
- [x] Tras detener el Worker propio, ejecutar backend test/build, frontend build, cloudflare:build dry-run, frontend afectado y lints. Corregir fallos demostrados y repetir checks afectados. Guardar evidencia y límites; no confundir suite afectada con todo frontend.

## 4. Ejecución Development y cierre

- [x] Publicar fuente e instalar115 individualmente con idempotencia e historia conservada, después del guard efectivo. Reutilizar contexto QA ficticio4 sin cuentas nuevas. Doce muestras HTTP autenticadas en cuatro formatos y20/17.35; guardado/reapertura, manuales, puntos pendientes, paridad y estrategia sola exactos.
- [x] Recorrido visual con cuenta personal4.ºA/EFI: vacío, título/descripcion, estrategia automática, formato manual, instrumento completo, puntos explícitos, texto manual, guardado/reapertura y cambio solo de estrategia. Baseline nuevo creado una sola vez antes del cambio; baselines anteriores intocables. Documentar límites si hay bloqueo externo.
- [x] Actualizar fuente/matriz/inventario/informe/continuación. Revisar diff, exclusión de secretos, UTF-8 e historia; commit español local. Continuar con5.º sin preguntas rutinarias ni push.
