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

1.º–3.º: **doce nuevos formatos vinculados**, guardados, editados y reabiertos; cambiar solo la estrategia conservó exactamente el instrumento. En 2.º, la lista de cotejo `ab21edfc-bcad-40c4-bf3f-277b5bd710d4` sufrió una interrupción después de guardarse. La lectura SQL y HTTP confirmó SIMULATION/AUTO, snapshot versión 1, contexto, texto y pesos originales. Se completó únicamente su edición de estrategia, con hash antes/después idéntico, sin recrearla. El script de recuperación devuelve UNCHANGED si ya está verificada. Los formatos que faltaban se añadieron después de comprobar los registros existentes.

La comprobación final de solo lectura revisa **24 actividades**: doce históricas y doce vinculadas. Los doce instrumentos históricos mantienen sus hashes, IDs y snapshots originales, incluidas sus referencias de fuente nulas; los doce vinculados conservan sus hashes y sus referencias correctas. Los catálogos de los snapshots históricos se registran tal como están, sin actualizarlos a `.75`. La evidencia ya no contiene formatos pendientes de vinculación.

El servidor Wrangler salió inicialmente por DNS `ENOTFOUND` o `ECONNRESET`; esas ejecuciones fallidas no se presentan como recorridos aprobados. Tras recuperarlo se completaron 4.º–6.º y la vinculación adicional. El último build/runtime corresponde a `.75`, exclusivamente Development. Comprobar el listener antes de reiniciar. En la reanudación `/activities/center` tardó 48–54 s; se conserva como limitación observada. La reconciliación comprueba el contexto con su actividad histórica a través de la API autenticada del curso, sin atribuir ese camino a una prueba visual. Las lecturas de listas QA tienen un plazo acotado de 60 s; las escrituras no se reintentan a ciegas y mantienen 35 s.

La descarga por petición del catálogo evaluativo de 631 KB tardó 28.987 ms en la medición. La comparación exacta parametrizada JSONB dentro de PostgreSQL tardó 2.481 ms. El servicio usa esta comparación y devuelve solo el booleano; las filas curriculares seleccionan las columnas necesarias. La recomendación posterior observada respondió en 9.318 ms. No hay caché que permita eludir la validación de un catálogo cambiado.

Pruebas finales del bloque: 31 dirigidas del servicio y 37.201 de backend completo; backend build, frontend build y Cloudflare build con salida 0 (`--dry-run`). La suite frontend encontró un único test que esperaba el anuncio retirado; se corrigió y sus 54 pruebas pasaron, según el informe del creador. Sin esquema nuevo ni cambios de producción.

Las suites generales del código final de 6.º pasan 37.550 pruebas backend y 38.084 frontend; focalizadas francesas 703/611. Los tres builds finales pasan. Este cierre adicional modifica únicamente scripts QA y documentación, con comprobaciones reales de sus resultados e idempotencia.

El navegador QA aislado continúa indisponible. HTTP/DB no equivale a un recorrido visual. Una observación anterior encontró un asset antiguo en la pestaña personal; no es una medición actual de esa pestaña. Guardar las ediciones pendientes y recargar antes de probar el nuevo build, sin borrar almacenamiento.
