# Fuente curricular de Francés en Development

## Hallazgo y corrección acotada

La tabla `curriculum_versions` estaba vacía. Las pruebas iniciales de 1.º–3.º conservaron contexto académico, catálogo evaluativo, instrumento y snapshot, pero sus referencias a versión y ámbito curriculares eran nulas. Esas actividades históricas se conservan sin reescritura.

Se prepara una versión fuente exclusiva de Francés común, `MINERD_SECUNDARIA_2023_FRA_COMUN_V1`, con identificadores deterministas distintos de los del currículo completo. Contiene los seis ámbitos revisados visualmente, 813 registros oficiales y 42 relaciones cuyos extremos pertenecen al subconjunto. El texto oficial se compara literalmente con la matriz; las adaptaciones de los instrumentos permanecen separadas.

El servicio filtra la selección automática y explícita de versiones por la metadata `subjectCodes` y `commonOnly`. Las versiones históricas sin esta restricción mantienen su comportamiento. Una fuente francesa no puede asignarse a Inglés, Lengua Española ni una salida optativa; una versión global compatible anterior sigue disponible. Seis pruebas nuevas cubren estos casos.

## Importación reproducible

`node scripts/evaluation-instruments/french-source-catalog.mjs` valida la fuente sin conectarse a la base. `--install` añade una transacción acotada únicamente a AulaBase Development (`eolgunypmtgrsyrjzcld`), con el guard de PostgreSQL/Auth/Storage/frontend. No ejecuta migraciones ni modifica el esquema. Rechaza un catálogo existente distinto, verifica idempotencia, texto y páginas guardados, y compara las huellas de todos los snapshots antes y después.

Los IDs originales y nuevos de los ámbitos se conservan en la metadata. La versión fuente nueva es `de6de6bc-0d23-59da-917e-22cb92c0a3af`; instalar seis ámbitos fuente no declara conectados los seis proveedores.

## Resultado de la verificación

Importación `CREATED`, repetición `UNCHANGED`: seis ámbitos, 813 elementos, 42 relaciones y 14 snapshots anteriores intactos. El instalador verifica además el texto y las páginas leídos desde la base. [Evidencia](frances-fuente-verificacion.json).

1.º: cuatro nuevos formatos vinculados, guardados, editados y reabiertos; cambiar solo la estrategia conservó exactamente el instrumento. 2.º: rúbrica vinculada completamente verificada; la lista de cotejo `ab21edfc-bcad-40c4-bf3f-277b5bd710d4` quedó guardada, pero el siguiente paso devolvió 503 durante una caída local por `ECONNRESET`. No se repitió esa escritura. Pendientes los demás formatos vinculados de 2.º y los de 3.º; sus recorridos previos sin referencia fuente se mantienen documentados. Antes de reanudar el registro incierto debe leerse y compararse, no recrearse.

El servidor Wrangler salió repetidamente por DNS `ENOTFOUND` o `ECONNRESET`; estas incidencias no se presentan como fallos de pertinencia ni como recorridos aprobados. La última comprobación completa de PostgreSQL/Auth/Storage/frontend pasó contra Development antes de esa salida. Comprobar el listener antes de reiniciar.

La descarga por petición del catálogo evaluativo de 631 KB tardó 28.987 ms en la medición. La comparación exacta parametrizada JSONB dentro de PostgreSQL tardó 2.481 ms. El servicio usa esta comparación y devuelve solo el booleano; las filas curriculares seleccionan las columnas necesarias. La recomendación posterior observada respondió en 9.318 ms. No hay caché que permita eludir la validación de un catálogo cambiado.

Pruebas finales del bloque: 31 dirigidas del servicio y 37.201 de backend completo; backend build, frontend build y Cloudflare build con salida 0 (`--dry-run`). La suite frontend encontró un único test que esperaba el anuncio retirado; se corrigió y sus 54 pruebas pasaron, según el informe del creador. Sin esquema nuevo ni cambios de producción.

El navegador QA aislado continúa indisponible. HTTP/DB no equivale a un recorrido visual. La pestaña personal conserva un asset anterior; guardar las ediciones pendientes y recargar antes de probar el nuevo build, sin borrar almacenamiento.
