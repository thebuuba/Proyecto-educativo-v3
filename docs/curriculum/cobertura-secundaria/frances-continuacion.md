# Continuación — Francés común

Encargo vigente: 15/10/2026, adjunto `d2d4353c-ff04-4737-bb10-eb95459fd213`. Autonomía autorizada, **sin subagentes**. Solo Development y Francés común, en orden por grado. [Plan](../../superpowers/plans/2026-10-15-frances-comun.md) y [especificación](../../superpowers/specs/2026-10-15-frances-comun-design.md).

## Último bloque verificado

Recuperación de Development y creador publicada en `1db3e19fcaa308f19a50c24c4c7bf613e937bc5a`, rama `amplia-instrumentos-secundaria`, sincronizada y limpia al empezar este encargo. Catálogo vigente `evaluation-2026.69`. [Informe anterior](../../superpowers/reports/2026-10-15-creador-estrategia-instrumento.md).

Revalidación de apertura de este encargo: `pnpm cloudflare:build` termina con código 0 y `--dry-run: exiting now`; verificación de entorno aprobada. PostgreSQL (`app_backend_local`, sin BYPASSRLS), Auth, Storage y frontend servido apuntan a AulaBase Development `eolgunypmtgrsyrjzcld`. Entry `/assets/index-yWh82mQY.js`; localhost:8787 responde 200. No se duplicó el servidor ni se tocó producción.

## Estado de Francés

Pendiente de implementar. El inventario existente identifica ámbitos comunes de 1.º–6.º; todavía se están contrastando visualmente sus páginas. No hay proveedor francés conectado ni prueba HTTP/DB/navegador atribuible a Francés.

## Siguiente acción concreta

Renderizar y revisar las tablas de Francés del PDF oficial, verificar límites de grados/columnas/continuaciones y producir la matriz. Después implementar y verificar primero el grado 1.º, sin saltar a los demás por estar inventariados.

## Decisiones y límites

- Reutilizar formato, puntuación y mecánicas de editor; desarrollar contenido y detección franceses propios.
- Usar PDF.js y `@napi-rs/canvas` ya presentes para renderizar; no instalar dependencias.
- Revisiones propias; la prohibición de subagentes del usuario prevalece sobre los pasos de delegación de las guías.
- Las instrucciones anteriores de detenerse antes de otra asignatura son históricas; el nuevo encargo autoriza únicamente Francés común.
