# Caligrama, Lengua Española 1.º

Proveedor compartido para creación, análisis, comparación, recitación y explicación. Catálogo `evaluation-2026.17`, archivo inmutable de .16. Cobertura parcial, no finalización de toda Lengua ni secundaria.

## Causa confirmada y cambio

Se reprodujeron 36 fallos en 42 casos iniciales. Los niveles inferiores eran generales, las comparaciones exigían conclusión aunque no estuviera solicitada y la recitación incluía un criterio individual redundante incluso en modalidad grupal. La explicación exigía responder preguntas sin pedirlas. El análisis imponía todas las dimensiones, aunque la consigna se centrara solo en texto y figura. La alternativa local tenía otra plantilla.

Servicio y alternativa comparten los mismos criterios y cinco posiciones de progresión autorada. Texto/figura, mensaje, vocabulario, disposición, interpretación y comunicación se redactan según la acción. Análisis focalizado conserva los objetivos pedidos. La comparación no añade una conclusión ausente. La recitación reúne claridad/continuidad y elimina el criterio individual repetido; evalúa expresión y sentido, con apoyos acordados. Preguntas y explicación de sentimientos se incorporan según la consigna; se refieren al contenido representado y pueden ser ficticios, sin exigir revelaciones personales. Verso libre conserva «sin exigir rima».

Ejemplo antes: cinco criterios para analizar solamente texto/figura, incluidos sentimientos y tipografía. Después: un indicador específico de relación entre palabras, figura y mensaje, con cuatro niveles iniciales y quinto autorado. No se añade contenido para completar una cantidad de filas.

## Fuente

PDF 74, impresa 73, revisada visualmente. Procedimientos asociados: `385e0137-005c-5738-a4fb-123f43df0f51`, `6c34dfd7-f46b-53bd-bcc5-fbb783867a0e`, `b09eae34-ec2a-579a-a86f-e0c2e7e020ea`, `6386112a-44b3-5b36-9416-1f31d2540550`. El bloque inferior de producción escrita de noticia es una anomalía editorial: se conserva en el inventario, no se atribuye al caligrama. El tercer procedimiento agrupa producción oral y comprensión escrita; se conserva su texto original sin inventar otra extracción.

Los instrumentos son adaptaciones de Aula Base, no instrumentos oficiales del MINERD. Pendiente: consignas muy focalizadas de figuras literarias, sustantivos/adjetivos, tipografía, borradores y publicación expresamente solicitada; mayor filtrado de comparación y recitación, candidatos adicionales y recorridos visuales de todas las familias. Agotar propuestas permite una fila manual y comunica el límite.

## Verificación y archivos

Pruebas nuevas: 43 backend, 61 frontend; cinco familias, cuatro formatos, totales 20/17,35 y puntaje pendiente en alternativa, análisis focalizado y elección incompatible. Backend completo 1.214; frontend 809 en 89 archivos; inventario siete. Builds backend/frontend y Cloudflare dry-run aprobados. La prueba principal conserva el servicio disponible.

Servicio normal con login real de cuenta ficticia: 80 propuestas (cinco familias, cuatro formatos, dos títulos y dos totales), nueve regresiones y un análisis focalizado con título incompatible. [Respuesta íntegra](evidencias/caligrama-servicio-normal.json), [cuatro instrumentos legibles de creación](caligrama-instrumentos-completos.md).

Navegador: creación en rúbrica 17,35, análisis en cotejo 20, recitación en escala 17,35 y comparación ponderada 20, todos guardados/reabiertos. Segunda fila manual preservada; Inicial completado sin cambiar puntuaciones en rúbrica/escala. La lectura HTTP real compara IDs temáticos, indicadores y máximos con el servicio, y los textos de desempeño de rúbrica/escala; confirma versión/ámbito y procedencia. Cotejo/ponderada almacenan sus opciones nativas como niveles de calificación internos, sin presentar descriptores de rúbrica en el editor. [Persistencia completa](evidencias/caligrama-guardados-reabiertos.json). Explicación pendiente de recorrido visual, modalidad grupal comprobada en pruebas pero no guardada desde navegador.

Reinstalación local doble de .17 sin cambios; huellas de releases anteriores intactas. Siete controles .14, cuatro .15 y cuatro .16 conservados. La escala de recitación muestra tres indicadores; comparación ponderada cuatro sin conclusión. Totales y pesos usan la regla de redondeo existente del motor, comprobada también después de convertir al editor.

Archivos principales: `secondary-calligram-grade-one.ts`, núcleo `secondary-topics/language/calligram-grade-1-core.ts`, exportación, wrapper backend, selector del motor, alternativa frontend, catálogo .17/archivo .16, fixtures, pruebas, verificadores y matriz.

La composición y las acciones por fila siguen documentadas en [composicion-y-filas.md](composicion-y-filas.md). Sin diseño nuevo, IA, dependencia, cambio de esquema, reset ni despliegue.

La matriz sustituye `IMPLEMENTED` de los seis núcleos previos de Lengua 2.º por estados parciales: conserva su conexión, pruebas y evidencia HTTP aislada, sin presentarlos como cobertura completa ni verificación en navegador normal. [Resumen por asignatura y grado](cobertura-por-asignatura-grado.md).
