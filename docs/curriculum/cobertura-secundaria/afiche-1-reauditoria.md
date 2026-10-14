# Afiche de Lengua Española, 1.º de secundaria

El bloque conecta un proveedor compartido de creación, análisis, comparación y presentación. Catálogo `evaluation-2026.15`; rama `amplia-instrumentos-secundaria`. Es cobertura parcial del afiche, no de toda Lengua ni de secundaria.

## Causas y corrección

El proveedor anterior exigía responder preguntas en cualquier presentación y sus niveles inferiores utilizaban frases generales. El tema se calculaba con título más descripción: cualquier aparición de «agua» se convertía en «cuidado y ahorro», aunque se tratara del ciclo del agua. La alternativa local tenía otra plantilla. El análisis imponía recursos visuales y todos los criterios disponibles incluso cuando se solicitaban solo propósito y mensaje.

Se reprodujeron 26 fallos de los 34 casos iniciales. Ahora servicio y alternativa consumen `firstGradePosterCriteria`. El título no se inserta en criterios; la descripción aporta un tema breve cuando puede reconocerse. Una imagen o símbolo conserva su carácter alternativo. Los elementos visuales solo se evalúan cuando se solicitan; «solo texto» los excluye. Las preguntas solo aparecen si se piden. El análisis focalizado conserva los objetivos expresos. La presentación oral es una adaptación evaluativa a la consigna del docente.

Las cinco posiciones autoradas permiten el quinto nivel del contrato compartido; los cuatro niveles iniciales utilizan las posiciones primero, segundo, tercero y quinto. Las progresiones de analizar, comparar y presentar no evalúan producir otro afiche. Cotejo usa evidencia verificable; escala interpreta grados del indicador; lista ponderada incorpora el significado de Parcial (50%) en cada fila. Se conservan pesos relativos y reparto exacto.

## Fuente y límites

Revisión visual de PDF 72 y 73 de la adecuación proporcionada. El afiche está en PDF 72 (impresa 71). PDF 73 empieza cuento policíaco. Los borradores y publicación del informe de lectura que continúan en la columna central de PDF 72 pertenecen al informe, no al afiche.

Procedimientos asociados al afiche: `e391ba43-d01f-56b5-969c-625e7c715d49`, `156d82cc-d619-56fa-8bb9-3563fb155b3f`, `75ccb373-3eb0-5d30-af1f-714caffce54d`. Son lectura, producción y recursos gráficos; no se inventa un procedimiento oficial de presentación oral. Fechas y lugar solo corresponden a eventos que los requieren; no se imponen a campañas generales.

Pendiente: consignas gramaticales focalizadas (imperativo, obligación/posibilidad, connotación y recursos poéticos), datos de eventos expresamente solicitados, análisis comparativo más focalizado y ampliación de candidatos adicionales autorados. Al agotar el conjunto actual se permite una fila manual y se comunica la limitación; no se rellena para aparentar cobertura completa.

## Verificación

- Servicio normal mediante `localhost:5173/api/v1`, login real de cuenta ficticia y permisos académicos reales: 64 propuestas (cuatro familias, cuatro formatos, dos títulos, totales 20 y 17,35), siete regresiones de células, Ohm, matrices, trigonometría y tres módulos de Lengua; un análisis focalizado adicional.
- Alternativa local: 48 casos comparan íntegramente criterios con el proveedor compartido, incluidos los cuatro formatos y puntaje pendiente; un caso adicional impide reactivar la plantilla antigua ante una actividad manual incompatible. La prueba principal mantiene el servicio disponible.
- Backend: 1.129 pruebas aprobadas. Frontend: 686 en 87 archivos; inventario siete. Builds backend, frontend y Cloudflare dry-run aprobados; sin despliegue.
- Catálogo .15 instalado solo localmente, dos reinstalaciones `UNCHANGED`; huellas de releases anteriores intactas. .14 archivado con su payload original.

La evidencia completa del servicio está en [afiche-servicio-normal.json](evidencias/afiche-servicio-normal.json); contiene los cuatro instrumentos con todos sus indicadores, descriptores y puntos. Los ejemplos legibles están en [afiche-instrumentos-completos.md](afiche-instrumentos-completos.md).

Navegador normal: cuatro formatos guardados y reabiertos con login real de cuenta ficticia. Rúbrica y escala a 17,35; cotejo y ponderada a 20. Elección automática mantuvo rúbrica para la producción de afiche multidimensional; las otras tres fueron elecciones explícitas respetadas. Edición manual de la segunda fila preservada en los cuatro; una celda Inicial vaciada y completada en rúbrica y escala conservó el total y las demás filas. Identidades, plantilla, ámbito, versión y snapshots se comprueban por lectura HTTP normal en [afiche-guardados-reabiertos.json](evidencias/afiche-guardados-reabiertos.json). La creación es la familia recorrida en interfaz; las otras tres familias están verificadas en servicio y pruebas, pendientes de recorrido visual equivalente.

## Archivos principales

`packages/shared/src/secondary-poster-grade-one.ts`, `secondary-topics/language/poster-grade-1-core.ts`, exportación compartida, wrapper backend del afiche, selector del motor, alternativa frontend, `catalog-v14.ts`, `catalog-current.ts`, fixtures y verificadores del bloque, pruebas backend/frontend y registro curricular.

La corrección compartida de añadir/completar filas y el caso íntegro de matrices siguen documentados en [composicion-y-filas.md](composicion-y-filas.md). No se alteraron el diseño, el editor de descripción, esquema de DB, dependencias ni producción.
