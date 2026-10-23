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

Se corrigieron referencias desactualizadas sobre valores del cuento, consideración de sugerencias, elección lectora no puntuable y publicación efectiva de noticia, cuento y caligrama. Queda acreditar específicamente la **construcción de conocimiento nuevo mediante producción oral**: C09 no fija modalidad, C10 es escrito y una explicación oral no demuestra automáticamente novedad. Dos actividades independientes están fijadas en `len1-conocimiento-oral-independiente-v1`; al cierre de168 sus instrumentos estaban pendientes; la continuación169 documenta su corrección y aceptación local.

Versión 168 instalada y verificada exclusivamente en Development `eolgunypmtgrsyrjzcld`, fuente `aebcbea9d98c921305407d4b0e28eb9f7a63205f`. Instalación CREATED y segunda comprobación UNCHANGED; conserva 98 releases y 1257 snapshots anteriores. Tras cuatro pruebas QA:99 releases y 1261 snapshots. PostgreSQL app_backend_local sin bypass RLS, Auth, Storage y frontend del mismo proyecto; assets ySW iguales porSHA al build. Las 15 referencias personales originales permanecen exactas, sin duplicados ni recaptura.

La sesión personal del navegador, su caché/registro de service worker y el recorrido visual siguen pendientes; las pruebas HTTP de QA no los sustituyen. No se enviaron correos, cambiaron contraseñas ni borró almacenamiento.

Solo commits locales en `ampliacion-de-instrumentos-2`. Sin push, merge, despliegues, producción, migraciones de esquema, recaptura de referencias ni cambios de cuentas. Los otros 81 contextos mantienen pendiente su auditoría curricular integral.

## Verificación HTTP final y recuperación

E01/rúbrica/20, E02/cotejo/17,35, V03/escala/20 y V05/ponderada/17,35: interpretación, recomendación, puntuación inicialmente vacía, edición manual, guardado y reapertura verificados. Cambiar solo la estrategia conserva exactamente el instrumento. Se preservaron todos los releases y snapshots previos.

Una recarga automática del Worker interrumpió una recomendación con HTTP503 en texto plano. Se comprobó la versión compilada 168, el fin del proceso y el puerto libre; se inició un único Worker y se reanudó el bundle QA168 original conciliando IDs, sin duplicados. No quedó identificado el archivo que disparó la recarga; ocurrió durante edición de fuente. Las peticiones restantes terminaron sin nuevas ediciones.

El navegador conectado mostró la pestaña de login en su inventario, pero su acceso devolvió `Debugger unattached`. No se comprobó el formulario ni el recorrido personal, ni se tocaron cuenta o almacenamiento. Evidencia completa: `auditoria-curricular-len1-168-http-runtime.json` y `auditoria-curricular-len1-personales-168.json`. API168 congelada antes del siguiente cambio: SHA256 `935a84916ab96748e5c39d106341bcc8d04da4f8a92751301be10ffd0f990258`.
