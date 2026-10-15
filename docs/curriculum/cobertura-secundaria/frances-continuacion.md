# Continuación — Francés común

Encargo vigente: 15/10/2026, adjunto `d2d4353c-ff04-4737-bb10-eb95459fd213`. Autonomía autorizada, **sin subagentes**. Solo Development y Francés común, en orden por grado. [Plan](../../superpowers/plans/2026-10-15-frances-comun.md) y [especificación](../../superpowers/specs/2026-10-15-frances-comun-design.md).

## Último bloque verificado

Recuperación de Development y creador publicada en `1db3e19fcaa308f19a50c24c4c7bf613e937bc5a`, rama `amplia-instrumentos-secundaria`, sincronizada y limpia al empezar este encargo. Catálogo vigente `evaluation-2026.69`. [Informe anterior](../../superpowers/reports/2026-10-15-creador-estrategia-instrumento.md).

Revalidación de apertura de este encargo: `pnpm cloudflare:build` termina con código 0 y `--dry-run: exiting now`; verificación de entorno aprobada. PostgreSQL (`app_backend_local`, sin BYPASSRLS), Auth, Storage y frontend servido apuntan a AulaBase Development `eolgunypmtgrsyrjzcld`. Entry `/assets/index-yWh82mQY.js`; localhost:8787 responde 200. No se duplicó el servidor ni se tocó producción.

## Estado de Francés

Inventario contrastado visualmente: Francés común de 1.º–6.º, PDF 181–192 y 199–209. Matriz de 813 registros oficiales y síntesis por grado en `frances-inventario.md`, publicados en `9bb94b9`. El cierre de apertura está publicado en `6f346a2`.

Último bloque implementado y verificado mediante automatización y HTTP/DB: 1.º, catálogo `evaluation-2026.70`, instalado idempotentemente en Development; `.69` congelado y comparado con DB sin diferencias. Contexto QA 1.º/FRA `947b09d3-b2d0-4817-ac1c-5b8e9a6f3577`, centro ficticio existente. Suites completas backend 36.968 y frontend 37.576; focalizadas finales 128/103; tres builds finales aprobados. Doce interpretaciones, 24 recomendaciones y cuatro formatos guardados/editados/reabiertos. Revalidación tras el último build: cuatro recomendaciones y cuatro instrumentos reabiertos idénticos. [Informe](frances-1.md), [ejemplos completos](frances-1-ejemplos.md). Recorrido visual QA pendiente, expresamente separado de lo comprobado.

## Último bloque verificado — 2.º

Último commit publicado antes de este bloque: `3e5bbb84` (1.º). Segundo grado implementado y verificado; el commit que contiene esta actualización es su cierre. Catálogo `.71` instalado (`CREATED`/`UNCHANGED`), `.70` congelado y tres releases previos preservados. Contexto QA FRA `2f89026e-d2ef-4878-b783-145748c95c06`. Pruebas finales: backend completo 37.085, focalizadas 245 backend/203 frontend; tres builds finales aprobados. Las 12 interpretaciones, 24 recomendaciones y cuatro formatos guardados/editados/reabiertos pasaron. Revalidación sobre build final: cuatro recomendaciones y cuatro instrumentos reabiertos idénticos. [Evidencia persistente](frances-2-verificacion.json), [informe](frances-2.md), [ejemplos](frances-2-ejemplos.md). **No repetir escrituras**.

Una revalidación de solo lectura falló al salir Wrangler por DNS `ENOTFOUND`; tras reiniciar, la revalidación final pasó. Servidor local launcher PID 46088, listener observado PID 11120; comprobar antes de iniciar otro. Log `dev-2-stdout.log`. No hay proceso HTTP pendiente. La pestaña personal mantiene el asset antiguo `/assets/index-yWh82mQY.js`; no se recargó ni se alteró su borrador. Recorrido visual QA pendiente por ausencia de navegador aislado.

## Siguiente acción concreta

Publicar este cierre de 2.º, después congelar `.71` e implementar 3.º con PDF 189–192: ubicación/direcciones, clima, acciones en curso y planes futuros, con sus contenidos específicos. No tocar snapshots ni releases anteriores. Continuar secuencialmente hasta 6.º, sin otras asignaturas ni subagentes.

## Decisiones y límites

- Reutilizar formato, puntuación y mecánicas de editor; desarrollar contenido y detección franceses propios.
- Usar PDF.js y `@napi-rs/canvas` ya presentes para renderizar; no instalar dependencias.
- Revisiones propias; la prohibición de subagentes del usuario prevalece sobre los pasos de delegación de las guías.
- Las instrucciones anteriores de detenerse antes de otra asignatura son históricas; el nuevo encargo autoriza únicamente Francés común.
