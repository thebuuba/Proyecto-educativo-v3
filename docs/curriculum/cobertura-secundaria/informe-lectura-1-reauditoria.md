# Informe de lectura de Lengua Española 1.º: núcleo reauditorado

Fuente revisada visualmente: PDF 71–72 / impresas 70–71. La columna de procedimientos continúa el informe antes de comenzar el afiche; los cinco procedimientos conservados pertenecen al ámbito de Lengua 1.º. Adaptaciones evaluativas de Aula Base, sin declarar instrumentos oficiales aprobados por MINERD.

## Causas reproducidas y correcciones

- 26 fallos iniciales: descriptores genéricos, Parcial sin evidencia específica, análisis sociocultural impuesto al pedir personajes y extracción del resto de la consigna como supuesto nombre del cuento.
- Proveedor compartido para escritura, análisis, comparación y presentación: `secondary-reading-report-grade-one.ts` / `secondary-topics/language/reading-report-grade-1-core.ts`. El servicio y la alternativa usan el mismo contenido.
- El análisis respeta personajes, patrones socioculturales explícitos o interpretación del texto. Los personajes reciben progresiones específicas sobre acciones, motivaciones y ejemplos; no se valoran creencias personales.
- Conclusión explícitamente pedida añade evidencia propia. «Sin análisis» no añade la fila de análisis; métodos concretos de resumen se exigen sólo cuando aparecen en la consigna.
- No se impone publicación ni responder preguntas no solicitadas en una exposición. Se distingue analizar un informe existente de producir uno nuevo.
- Cotejo/escala usan indicadores observables y niveles progresivos; ponderada incluye evidencia de Parcial. Puntaje pendiente y edición manual conservados en los cuatro formatos.
- Reapertura en navegador detectó título y descripción idénticos repetidos en la misma celda. El visor compartido omite sólo esa copia; conserva descripciones diferentes. Prueba roja/verde y comprobación posterior en navegador, sin rediseño.

## Versiones y verificación

`evaluation-2026.13`, `.12` archivado; instalación idempotente local y huellas de releases anteriores preservadas. Durante el QA el backend identificó base `f9d59c37a7c998b895b6a3d54277eb7b7c33abd4` más cambios de este bloque. Frontend 5173/API 3000/Auth/DB/Storage locales; no servidor de QA alternativo ni sesión sintética.

- Backend: 1.078 pruebas; 34 regresiones del informe. Frontend: 617 pruebas / 84 archivos. Una ejecución completa tuvo un timeout de regeneración bajo carga; el caso pasó aislado en 703 ms y la suite completa pasó con `--maxWorkers=2`, sin aumentar timeouts.
- 64 instrumentos del servicio normal: cuatro familias × cuatro formatos × 20/17,35 × título original/neutral, HTTP 200 y contexto LEN/1.º real.
- Navegador normal: escala elegida manualmente antes de la descripción, seis indicadores (personajes y conclusión), 17,35 puntos, resumen, confirmación, guardado y reapertura. API confirma snapshot .13, enfoque de personajes, ausencia del sociocultural impuesto y descriptor inicial específico.
- Actividades anteriores de células .10, Ohm .10, noticia .11 y guía .12 recuperadas sin cambiar snapshots. Cinco actividades guardadas desde navegador en total.
- Compilaciones backend/frontend y Cloudflare dry-run verificadas también tras el ajuste final del visor. Sin despliegue ni reset.

[64 propuestas íntegras](evidencias/informe-lectura-1-servicio-normal.json), [cuatro instrumentos completos](informe-lectura-1-instrumentos-completos.md), [guardados recuperados](evidencias/guardados-navegador-normal.json), captura `evidencias/informe-lectura-1-navegador-normal.png`.

Se corrigieron además acentos deteriorados en encabezados generados por un pipe de PowerShell. El nuevo renderizador Node lee/escribe UTF-8 directamente; no modifica texto curricular original. La consulta ejecutable de UI/UX Pro Max no estuvo disponible por ausencia de Python/py; la corrección del visor usa el sistema de diseño del repositorio y la evidencia observada, sin guardar resultados de búsqueda no verificados.

## Alcance pendiente

Núcleo de cuatro familias, no cobertura completa del tema ni de Lengua 1.º. Pendientes: análisis muy focalizados, gramática, revisión de borradores expresamente solicitada y los otros tres formatos en navegador. Noticia/guía mantienen sus propios pendientes. Próximo tema: afiche 1.º, seguido de cuento policíaco/caligrama y del resto del encargo. Trigonometría 6.º sigue pendiente con la descripción original conservada.
