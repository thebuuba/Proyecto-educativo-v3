# Cuento policíaco, Lengua Española 1.º

Proveedor compartido de cinco familias: escritura, análisis, comparación, narración y presentación del análisis. Release `evaluation-2026.16`; .15 archivado sin cambiar su payload. La cobertura sigue parcial.

## Causa confirmada y cambio

La batería inicial reprodujo 36 fallos en 42 casos. Los niveles inferiores repetían redacción general y la narración exigía responder preguntas y dramatizar voces incluso sin pedirlo. El análisis agrupaba narrador, personajes y ambiente en un único criterio obligatorio. Servicio y alternativa local usaban proveedores diferentes.

El proveedor compartido conserva cinco posiciones de progresión autorada, adaptación a los cuatro instrumentos y pesos relativos. El análisis distingue estructura, narrador, personajes, ambiente, pistas, recursos y evidencia; conserva los aspectos solicitados cuando la consigna es focalizada. Las preguntas y la diferenciación de voces son condicionales. La comparación no exige conclusión si no está solicitada. La presentación evalúa los aspectos mencionados y permite apoyos acordados para comunicar el análisis. Una actividad manual incompatible no recupera la antigua plantilla local.

Ejemplo antes: «Identifica el narrador, caracteriza personajes y ambiente…» para identificar solo narrador y relacionar pistas. Después: dos criterios específicos, narrador/perspectiva y pistas/desenlace, con sus progresiones propias. Narración sin dramatización conserva secuencia, coherencia del misterio y comunicación de los hechos, sin voces ni preguntas obligatorias.

## Fuente

Revisión visual de PDF 73 (impresa 72), con conceptos y comprensión/producción oral y escrita del cuento policíaco. Procedimientos: `07dcf12a-5015-52c7-996d-61a5b9a6244b`, `caeca724-f16b-5730-be70-d3e671ae7840`, `caaa246b-f525-5292-8ed0-0fd2e8309566`, `28865ef6-91d3-5df9-b417-0a81f880732a`. La columna de actitudes contiene referencias al caligrama contiguo: no se incorporan como requisitos del cuento ni se evalúan sentimientos privados.

Los instrumentos son adaptaciones de Aula Base, no instrumentos oficiales del MINERD. Pendientes: requisitos gramaticales muy focalizados (pretéritos, actantes, adverbios, recursos literarios), mayor separación de aspectos de comparación y presentación, más candidatos adicionales autorados y recorridos visuales de todas las familias. Agotar candidatos permite edición manual sin inventar evidencia.

## Verificación y archivos

Pruebas nuevas: 42 backend y 61 frontend (cinco familias, cuatro formatos, totales 20/17,35 y puntaje pendiente en alternativa); dos negativos focalizados y elección manual incompatible. Backend completo 1.171; frontend 748 en 88 archivos. Builds backend/frontend y Cloudflare dry-run aprobados; inventario siete.

Servicio normal, login real y ámbito de Lengua 1.º resuelto: 80 propuestas (cinco familias, dos títulos, cuatro formatos y dos totales), ocho regresiones y un análisis focalizado con título incompatible. [Respuestas completas](evidencias/cuento-servicio-normal.json), [cuatro instrumentos legibles del análisis](cuento-instrumentos-completos.md).

Navegador normal: cuatro formatos guardados y reabiertos. Análisis en rúbrica 17,35 y cotejo 20; narración en escala 17,35; escritura en lista ponderada 20. Segunda fila manual preservada en todos; celda Inicial completada sin redistribuir en rúbrica y escala. Narración mostró tres indicadores, sin voces ni preguntas. La lectura HTTP real confirma IDs, plantilla, ámbito/versión, snapshots y puntos exactos; [persistencia](evidencias/cuento-guardados-reabiertos.json). Comparación y presentación están verificadas en servicio y pruebas, pendientes de recorrido visual.

Catálogo .16 instalado solo localmente, reinstalación doble sin cambios y releases anteriores preservados. Los siete controles .14 y los cuatro .15 permanecen intactos.

Archivos: proveedor compartido `secondary-detective-grade-one.ts`, núcleo `secondary-topics/language/detective-story-grade-1-core.ts`, wrapper backend, selector del motor, alternativa frontend, catálogo .16/archivo .15, fixtures, pruebas y verificación del módulo; informes y matriz.

Los cambios compartidos de composición y edición por fila siguen en [composicion-y-filas.md](composicion-y-filas.md). Se conserva diseño, Tiptap, selección manual, puntaje pendiente, restricciones sobre calificaciones y DB. Sin IA, dependencias nuevas, resets ni despliegue.
