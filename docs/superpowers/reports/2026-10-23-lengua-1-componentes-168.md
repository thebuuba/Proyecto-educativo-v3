# Lengua Española de 1.º: intercambio, publicación e instructivos ambientales

La versión 168 corrige diez actividades fijadas por el diseñador independiente antes de generar sus instrumentos. El coordinador y el revisor pedagógico leyeron los 40 instrumentos completos y sus diez selecciones. La aceptación independiente corresponde a E01–E04 v2 y contrastes V01–V06 v3; no cierra la asignatura.

## Causas y correcciones

- El intercambio ambiental dentro del aula terminaba en criterios genéricos. Ahora distingue recomendación sustentada, comprensión del receptor, pregunta **o** propuesta, respuesta razonada, mantener **o** ajustar y registro de lo realizado. La técnica es observación directa. Un guion para conversar mañana conserva su fase preparatoria.
- La publicación de una investigación simulada conservaba el texto genéricamente. Ahora identifica qué se investigó, procedimiento, resultados, conclusión limitada, registros y simulación. «Estudio simulado» recibe el mismo tratamiento. Una consigna ambigua para compartir una noticia revisada mantiene propuesta provisional y exige confirmar fase y medio, sin imponer publicación ni nueva autoría.
- Los instructivos de reutilización imponían clasificación de materiales. Se evalúan las acciones solicitadas, su orden y su relación con evitar desechar papel aprovechable.
- «Corrige» no activaba revisión. La corrección superficial de tildes y puntuación conserva acciones, orden, materiales y finalidad; no exige marcas de revisión. Revisar el paso de impresión evalúa las copias necesarias y el acceso a la lectura. Todas, algunas o ninguna son decisiones válidas según los datos del caso asignado; no se premia imprimir cero por sí mismo.
- En las nuevas rúbricas y escalas, la conversión de cinco progresiones a cuatro niveles descartaba errores sustantivos. Los niveles mínimos conservan esos errores **o** ausencia de evidencia, distinguiéndolos de detalles menores. La corrección está acotada a las nuevas variantes; no reescribe las salidas históricas.

Archivos principales: `secondary-language-grade-one-community.ts`, `secondary-language-grade-one-health-genres.ts`, `secondary-language-grade-one-focused.ts`, `recommendation-engine.ts`, `instrumentPreparation.ts`, `curricular-source-components.spec.ts`, catálogo actual 168 y copia histórica 167. No se cambian diseño, esquema remoto, cuentas ni asignaturas.

## Evidencia y comprobaciones

- Fallo inicial de 16 pruebas para E01–E04; después, 28 fallos observados al incorporar los contrastes y verificar los niveles mínimos. Suite focal final: 171 pruebas aprobadas.
- Backend completo: **98.117 pruebas en 240 archivos**, exit 0. Frontend focal: **123 pruebas en siete archivos**, exit 0.
- Builds de backend, frontend y `pnpm cloudflare:build`: exit 0; Cloudflare finaliza en dry-run, sin despliegue. Lints de backend, frontend y shared: exit 0. Ejecución secuencial, sin suites generales duplicadas.
- Los **712 instrumentos anteriores** siguen exactamente iguales. Los **40 nuevos** coinciden con el código y con la preparación local; puntuación inicial vacía, máximo 20 criterios, totales 20/17,35 y conservación de texto manual comprobados.
- El revisor rechazó las salidas iniciales y tres reservas posteriores; sus correcciones están recogidas sin sobrescribir capturas. El manifiesto `auditoria-curricular-len1-168-lectura40.json` enlaza requisitos, criterios, fuente y capturas completas.

## Cobertura real y límites

El auditor curricular reconcilió todas las páginas 69–75 y la metodología de la 68: 55 conceptos evaluables, seis encabezados, 31 filas procedimentales, 34 actitudinales, siete competencias específicas, siete fundamentales y 21 indicadores. No encontró filas oficiales ausentes. Esa integridad documental no certifica cobertura por sí sola.

Se corrigieron referencias desactualizadas sobre valores del cuento, consideración de sugerencias, elección lectora no puntuable y publicación efectiva de noticia, cuento y caligrama. Queda acreditar específicamente la **construcción de conocimiento nuevo mediante producción oral**: C09 no fija modalidad, C10 es escrito y una explicación oral no demuestra automáticamente novedad. Dos actividades independientes están fijadas en `len1-conocimiento-oral-independiente-v1`; aún no se han generado ni revisado sus instrumentos.

Último entorno verificado al cerrar este bloque local: versión 167, exclusivamente AulaBase Development `eolgunypmtgrsyrjzcld`, 98 releases y 1.257 snapshots. Sus cuatro pruebas HTTP y las 15 referencias personales originales están verificadas. El Worker 167 se detuvo antes del build 168 tras comprobar que era el propietario del puerto. La instalación individual y las pruebas HTTP 168 se registrarán después de ejecutarlas.

La sesión personal del navegador, su caché/registro de service worker y el recorrido visual siguen pendientes; las pruebas HTTP de QA no los sustituyen. No se enviaron correos, cambiaron contraseñas ni borró almacenamiento.

Solo commits locales en `ampliacion-de-instrumentos-2`. Sin push, merge, despliegues, producción, migraciones de esquema, recaptura de referencias ni cambios de cuentas. Los otros 81 contextos mantienen pendiente su auditoría curricular integral.
