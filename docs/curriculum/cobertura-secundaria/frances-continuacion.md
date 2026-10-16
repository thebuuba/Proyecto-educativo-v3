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

## Último bloque verificado — 3.º

Segundo publicado en `38935f91`. Tercero implementado y verificado; el commit que contiene esta actualización es su cierre. Catálogo `.72` instalado `CREATED`/`UNCHANGED`, cuatro releases previos preservados y `.71` congelado. Contexto QA `c782def1-cef7-4cce-b7df-670866f8c6e4`. Pruebas focalizadas 354 backend/303 frontend; backend completo 37.194. Ajuste léxico probado y recompilado; tres builds finales aprobados. [Informe](frances-3.md), [evidencia](frances-3-verificacion.json), [ejemplos](frances-3-ejemplos.md).

HTTP/DB terminado: 12 interpretaciones, 24 recomendaciones, cuatro formatos guardados/editados/reabiertos y estrategia-only exacta. Tras el último build, cuatro recomendaciones y cuatro reaperturas sin cambios de hash. No hay comando HTTP pendiente ni deben repetirse esas escrituras. Servidor único observado listener 11120, launcher 46088. Chrome personal conserva el asset anterior, QA visual pendiente.

Hallazgo de procedencia: `curriculum_versions` está vacío en Development. Los snapshots QA de 1.º–2.º tienen referencias curriculares DB nulas, aunque contexto académico/catálogo evaluativo/identidades sí se conservaron. La fuente oficial está revisada localmente. Antes del cierre global, resolver o delimitar expresamente esta vinculación. No publicar un subconjunto francés como versión global sin aislar la selección por asignatura: `EvaluationInstrumentsService.resolve` elige por nivel; eso daría una versión francesa a Inglés/Lengua aunque sin ámbito. Una solución acotada posible, tras los seis proveedores, es versión de fuente solo FRA común con IDs propios, metadata de asignaturas, selección compatible en el servicio y pruebas de no contaminación, importación idempotente solo Development, sin esquema nuevo ni otros contenidos; conservar snapshots viejos y verificar nuevos snapshots vinculados. `app_backend_local` tiene INSERT en tablas curriculares (comprobado solo lectura). Dataset original `data/curriculum/secondary-2023.jsonl`; no importar en bloque otras materias/optativas ni reutilizar IDs de la versión completa para un subconjunto.

## Siguiente acción concreta

Publicar el cierre de 3.º. Resolver la selección por asignatura antes de importar una fuente exclusivamente FRA común en Development (sin otros contenidos ni esquema nuevo). Conservar snapshots históricos sin referencias; verificar nuevos snapshots vinculados. Luego congelar `.72` y continuar 4.º: datos personales, servicios urbanos, compras, sentimientos/necesidades y salud, PDF 199–202. En los grados siguientes puede usarse `--representative`: una recomendación HTTP por caso, formatos/totales rotados y cuatro guardados; la matriz completa cuatro formatos × dos totales ya se ejecuta automáticamente. Continuar hasta 6.º sin otras asignaturas ni subagentes.

## Decisiones y límites

- Reutilizar formato, puntuación y mecánicas de editor; desarrollar contenido y detección franceses propios.
- Usar PDF.js y `@napi-rs/canvas` ya presentes para renderizar; no instalar dependencias.
- Revisiones propias; la prohibición de subagentes del usuario prevalece sobre los pasos de delegación de las guías.
- Las instrucciones anteriores de detenerse antes de otra asignatura son históricas; el nuevo encargo autoriza únicamente Francés común.

## Reanudación y prioridad complementaria

Se retira el anuncio de preparación automática antes de continuar 4.º. La prueba dirigida pasa 7/7 y backend completo 37.201/37.201; se conservan errores y recuperación. Commit propio de esta corrección antes del siguiente bloque curricular.

La fuente francesa acotada ya se instaló en Development: `MINERD_SECUNDARIA_2023_FRA_COMUN_V1`, ID `de6de6bc-0d23-59da-917e-22cb92c0a3af`, seis ámbitos, 813 elementos y 42 relaciones. Segunda instalación `UNCHANGED`, 14 snapshots previos intactos. Las referencias inicialmente nulas son históricas: no se reescriben. Está pendiente cerrar nuevas pruebas vinculadas de 1.º–3.º.

La ejecución vinculada de 1.º se interrumpió al preparar la cuarta recomendación por timeout. Sus tres escrituras (rúbrica/cotejo/escala) están verificadas en `grade-1-linked-http-progress.json`; no repetirlas. El runner admite `--source-linked --resume-verified`, exige escrituras verificadas y comprueba sus hashes antes de crear únicamente el formato que falta. El archivo ignorado `http.paused` impide arrancar nuevas pruebas hasta desplegar localmente el build revisado.

Causa de lentitud medida: descargar 631 KB de catálogo por petición tardó 28.987 ms; comparación completa parametrizada JSONB en PostgreSQL: 2.481 ms. El servicio ahora devuelve solo la igualdad y selecciona las columnas curriculares necesarias. Pruebas dirigidas del servicio 31/31. No se modifica esquema ni configuración remota. El antiguo servidor salió por DNS; comprobar el nuevo proceso y el listener antes de iniciar otro. Ningún comando HTTP sigue activo.

4.º está preparado en archivos nuevos (proveedor y contratos), todavía sin conexión ni instalación. Los contratos 4.º demostraron 96 fallos antes de conectar el proveedor; sus imports temporales se retiraron hasta cerrar la fuente y el ajuste silencioso. `.72` ya está congelado en archivo nuevo; conservarlo. Luego conectar 4.º como `.73` y continuar 5.º/6.º secuencialmente.
