# Continuación — Francés común

Encargo vigente: 15/10/2026, adjunto `d2d4353c-ff04-4737-bb10-eb95459fd213`. Autonomía autorizada, **sin subagentes**. Solo Development y Francés común, en orden por grado. [Plan](../../superpowers/plans/2026-10-15-frances-comun.md) y [especificación](../../superpowers/specs/2026-10-15-frances-comun-design.md).

## Último bloque verificado

Recuperación de Development y creador publicada en `1db3e19fcaa308f19a50c24c4c7bf613e937bc5a`, rama `amplia-instrumentos-secundaria`, sincronizada y limpia al empezar este encargo. Catálogo vigente `evaluation-2026.69`. [Informe anterior](../../superpowers/reports/2026-10-15-creador-estrategia-instrumento.md).

Revalidación de apertura de este encargo: `pnpm cloudflare:build` termina con código 0 y `--dry-run: exiting now`; verificación de entorno aprobada. PostgreSQL (`app_backend_local`, sin BYPASSRLS), Auth, Storage y frontend servido apuntan a AulaBase Development `eolgunypmtgrsyrjzcld`. Entry `/assets/index-yWh82mQY.js`; localhost:8787 responde 200. No se duplicó el servidor ni se tocó producción.

## Estado de Francés

Inventario contrastado visualmente: Francés común de 1.º–6.º, PDF 181–192 y 199–209. Matriz de 813 registros oficiales y síntesis por grado en `frances-inventario.md`. Proveedor pendiente: no hay prueba HTTP/DB/navegador atribuible todavía a Francés. El cierre de apertura está publicado en `6f346a2`.

## Siguiente acción concreta

Implementar y verificar primero el grado 1.º (seis funciones, PDF 181–184), empezando por contratos RED y detección propia de acciones y condiciones. Congelar evaluation-2026.69 antes de crear el siguiente release. No saltar a los demás grados por estar inventariados.

## Decisiones y límites

- Reutilizar formato, puntuación y mecánicas de editor; desarrollar contenido y detección franceses propios.
- Usar PDF.js y `@napi-rs/canvas` ya presentes para renderizar; no instalar dependencias.
- Revisiones propias; la prohibición de subagentes del usuario prevalece sobre los pasos de delegación de las guías.
- Las instrucciones anteriores de detenerse antes de otra asignatura son históricas; el nuevo encargo autoriza únicamente Francés común.
