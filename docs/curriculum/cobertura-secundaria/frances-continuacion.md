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

Actualización: el ajuste silencioso y su test de Calificaciones están publicados en `bb038abe` y `ae9aa76a`. Fuente instalada e inmutable; [resultado real](frances-fuente-development.md). 1.º terminó sus cuatro formatos vinculados. 2.º tiene rúbrica verificada y cotejo guardado con comprobación interrumpida (`ab21edfc-bcad-40c4-bf3f-277b5bd710d4`), no recrear. Los demás formatos vinculados de 2.º y 3.º siguen pendientes de infraestructura. Tres salidas locales por DNS/reset impiden dar por cerrado ese recorrido; continuar el trabajo independiente. El último servidor launcher 6896 dejó de escuchar tras `ECONNRESET`; comprobar antes de reiniciar. No hay HTTP activo.

4.º ya está conectado en código para `.73` (sin compilar/instalar aún): contratos focalizados 451 backend/403 frontend pasan. El bloque fuente se publica por separado, excluyendo esos cambios de 4.º. Siguiente: ampliar los casos específicos, revisar instrumentos completos, compilar/instalar `.73`, intentar QA autenticada y registrar cualquier limitación real antes de 5.º.

## Último bloque verificado — 4.º

Fuente y validación publicadas en `3e160bba`. 4.º terminado con patrones acotados, catálogo `.73` instalado `CREATED`/`UNCHANGED`, cinco releases preservados y `.72` congelado. Pruebas finales: 470 francesas backend, 403 frontend y backend completo 37.317; tres builds finales con salida 0. Se revisaron los cuatro instrumentos completos y se corrigió la escala para usar evidencia contextual y no confundir gramática de frecuencia con observación de frecuencia. Consignas breves «Achetez», «Exprimez», «Demandez» comprobadas.

HTTP/DB: cuatro formatos generados/editados/guardados/reabiertos, textos y pesos manuales conservados, estrategia-only exacta, referencias fuente no nulas. Sobre el build final: runtime válido exclusivamente Development, dos interpretaciones/cuatro recomendaciones y cuatro reaperturas sin cambios. QA visual pendiente. [Informe](frances-4.md), [ejemplos](frances-4-ejemplos.md), [evidencia](frances-4-verificacion.json). Las escrituras ya terminaron; no repetirlas.

Servidor local launcher 41900, listener observado 26956, log `dev-6-stdout.log`. Comprobar antes de iniciar otro. No hay HTTP pendiente. Continuar 5.º después de publicar este bloque: congelar `.73`, incorporar descripción de personas/lugares, actividades, instrucciones/prohibiciones e invitaciones según PDF 203–206, sin pagos ni viaje ajenos a ese grado. Después 6.º. Los pendientes de trazabilidad adicional de 2.º–3.º permanecen separados en el informe fuente.

## Último bloque verificado — 5.º

4.º publicado en `30457a58`. 5.º terminado con patrones acotados y `.74` instalado `CREATED`/`UNCHANGED`, seis releases preservados y `.73` congelado. Pruebas: 584 francesas backend, 503 frontend, backend completo 37.431 y tres builds finales con salida 0. Se revisaron los cuatro ejemplos completos; se eliminaron criterios duplicados entre recreación/invitación, se corrigió la exclusión `sans dialogue oral` y `mais` dejó de añadir gramática no solicitada.

HTTP/DB pasa: cuatro formatos generados/editados/guardados/reabiertos con 20/17.35, contexto y fuente correctos, estrategia-only exacta. Revisión sobre el build final: dos interpretaciones/cuatro recomendaciones y cuatro reaperturas sin cambios. Contexto QA `87d8198b-8fdc-484a-88a1-895737890bf1`. [Informe](frances-5.md), [ejemplos](frances-5-ejemplos.md), [evidencia](frances-5-verificacion.json). No repetir las escrituras.

La comprobación visual se reintentó: pipe nativo no disponible (os error 2), IAB no disponible; Chrome solo ofrece viewport y no sesión aislada QA. No se alteró la sesión personal. El servidor 26956 sigue atendiendo; no hay HTTP pendiente. Siguiente: publicar este bloque, congelar `.74` y cerrar 6.º según PDF 207–209, sin inventar un programa de passé composé ni condiciones de viaje/restaurante ausentes. Después consolidar el informe y detenerse; ninguna otra asignatura está autorizada.

## Último bloque verificado — 6.º

5.º publicado en `ee59f8da`. 6.º conectado como `.75`, instalado `CREATED`/`UNCHANGED`, siete releases preservados y `.74` congelado. Pruebas finales: 703 francesas backend, 611 frontend, backend completo 37.550 y frontend completo 38.084; tres builds finales con salida 0. Revisión de cuatro ejemplos completos detectó y corrigió una solicitud dependiente que sustituía ORAL_INTERACTION por OTHER, sin perder las acciones de pedir/pagar. No se añadió un programa de pasado ni reserva/pago no pedidos.

HTTP/DB de 6.º pasa: cuatro formatos generados/editados/guardados/reabiertos, estrategia-only exacta, fuente y contexto correctos. Runtime final en Development y cuatro recomendaciones/cuatro reaperturas de solo lectura sin cambios. Contexto QA `c2b16b9e-1a98-4d6d-9f93-a3b0123ed785`. [Informe](frances-6.md), [ejemplos](frances-6-ejemplos.md), [evidencia](frances-6-verificacion.json). QA visual permanece pendiente por el acceso descrito; no repetir escrituras completadas.

Siguiente: publicar 6.º y cerrar únicamente la trazabilidad QA adicional de 2.º–3.º. La lectura SQL del cotejo interrumpido de 2.º confirmó estrategia SIMULATION/AUTO e instrumento/snapshot originales, versión 1; no fue recreado. `reconcile-french-linked.mjs` está preparado para contrastar esa lectura con HTTP y completar solo su cambio de estrategia, con hash antes/después. Ejecutarlo sin otro HTTP activo; después `run-french-http.mjs 2 --source-linked --resume-verified`, 3.º `--source-linked` y registro de evidencia fuente. Si la infraestructura vuelve a impedirlo, conservar los registros y documentar lo pendiente. No comenzar otras asignaturas. Servidor observado 26956, launcher 41900; no hay HTTP activo al escribir esta nota.

## Estado final — cierre del encargo

Última implementación publicada: `50a871f1` (6.º); catálogo actual `.75`, rama `amplia-instrumentos-secundaria`. Los seis grados comunes están conectados con patrones acotados y ejemplos completos revisados. [Informe final consolidado](../../superpowers/reports/2026-10-15-frances-comun-development.md). El commit que contiene este cierre documental conserva el resultado; su hash y push se confirman en la entrega.

Trazabilidad adicional terminada: doce formatos vinculados de 1.º–3.º, con estrategia-only exacta. El cotejo de 2.º se recuperó sin recrearse y el script devuelve UNCHANGED al repetirse. Lectura final de 24 actividades: doce históricas y doce vinculadas, todos los hashes intactos; no quedan escrituras inciertas ni formatos pendientes de esa comprobación. Las referencias históricas nulas se conservan deliberadamente. [Evidencia fuente](frances-fuente-verificacion.json).

Validación final de aplicación: backend completo 37.550, frontend completo 38.084, francesas focalizadas 703/611, backend/frontend/Cloudflare build con salida 0. Runtime `.75` y assets actuales exclusivamente Development. No hay compilaciones ni comandos HTTP pendientes; el único servidor local conocido es launcher 41900/listener 26956, log `dev-6-stdout.log` (comprobar procesos antes de reiniciar).

Pendientes reales: prueba visual QA aislada (pipe nativo e IAB indisponibles) y latencia observada de 48–54 s en `/activities/center`, que se documenta sin atribuirle solución. Las lecturas QA de listas tienen límite 60 s y no prueban tiempos de la UI. No borrar borradores ni cambiar la sesión personal. **No hay siguiente asignatura autorizada: detener el trabajo al entregar este cierre.** Para continuar en otra ocasión, empezar por leer este estado y comprobar Git/procesos; no repetir QA completada ni reimportar catálogos históricos.
