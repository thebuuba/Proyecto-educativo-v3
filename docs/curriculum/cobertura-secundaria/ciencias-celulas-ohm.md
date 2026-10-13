# Investigación y corrección: células y Ley de Ohm

## Causa confirmada

El problema es compartido, no dos títulos defectuosos. Se comprobaron tres capas independientes:

1. **Entornos distintos.** El frontend abierto en `localhost:5173` utiliza el proxy `localhost:3000`. El proceso Nest PID 38112 se inició el 12/10 a las 19:04, antes de los commits de ampliación. Su configuración apunta a `vqrptqffeezqacwtmlqq.supabase.co`, donde solo está instalado `evaluation-2026.1` y no hay versiones curriculares. Las dos llamadas reales desde Chrome (`interpret` y `recommend`) devuelven **503: Falta instalar el catálogo evaluativo versionado**. La ampliación se instaló en Supabase **local**, puertos 54321/54332; no en esa base. Evidencias: `evidencias/science-runtime-audit.json`, `science-runtime-cells-browser.json`, `science-runtime-ohm-browser.json` y `science-original-browser-checks.json`.
2. **Contenido importado no equivale a motor conectado.** En local existen 258 elementos del ámbito de Ciencias 2.º y 316 de Ciencias 6.º. Hay partes/tipos/funciones celulares (PDF 296, impresa 295) y Ley de Ohm/circuitos (PDF 320–321, impresas 319–320). Antes del cambio, el catálogo `.9` solo conectaba módulos temáticos de Lengua. Se reprodujeron ambos casos por HTTP con asignaturas y ámbitos estructurados reales del catálogo académico, guards reales y una escuela ficticia local: células se detectaba como `COMPARISON`, Ohm como `ANALYSIS`; ambos conservaban dimensiones generales, aunque el ranking encontraba contenido curricular. Ver los JSON `science-cells-before` y `science-ohm-before`. Las 32 pruebas iniciales fallaron, incluidos títulos neutrales, cuatro formatos y dos totales.
3. **Alternativa local genérica y conversión incompleta.** La detección inmediata encontraba «dibujo» y proponía `ARTISTIC_PRODUCTION`; el servicio fallido no podía corregirla. La alternativa recibía contexto especial solo para Lengua y preparaba cuatro filas: Dominio del contenido, Desarrollo de la actividad, Organización y Comunicación. Insertaba el título y repetía la evidencia positiva también en Inicial. Además, cotejo mostraba nombres de dimensiones y la escala descartaba sus descriptores al convertir/alinear la recomendación.

No se atribuye el fallo a falta de datos: se reprodujo también con el currículo local instalado. El 503 explica por qué se usa la alternativa en el entorno abierto; la ausencia de módulos y el clasificador explican por qué el servicio local anterior tampoco solucionaba las consignas.

## Versiones comprobadas y límites

- Repositorio: `https://github.com/thebuuba/Proyecto-educativo-v3.git`.
- Rama: `amplia-instrumentos-secundaria`.
- Base al comenzar: `955a9787e57865a6552d021e08d3241fe10a247e`.
- Ampliación inventariada: `c0c2c1087ec165e02f81e44f9292eab7b080c052`; primeros módulos de Lengua 2.º: `757217a3b02dc1a28831ef3a2d8d134a26602dc1`; catálogo compartido `.9`: `e6c63190dca491f6347a6aa2be0fa7a62eea74e5`. No existe un commit que complete todas las asignaturas: el registro previo lo indica expresamente.
- Frontend original: Vite PID 12700, iniciado 12/10 a las 19:00, fuentes del workspace con HMR. Las capturas originales posteriores usan los cambios de esta solución.
- Backend original: PID 38112, `tsx dist/main.js`, iniciado 12/10 a las 19:04. **No tiene huella de build/commit ni un endpoint de versión; su hash exacto y el identificador esperado en memoria no pueden certificarse a partir del PID o del archivo dist reconstruido posteriormente.** Se informa esta limitación, en lugar de inventar un hash. Su rechazo por catálogo ausente sí fue observado directamente; el release instalado en su destino es `.1`.
- Servicio local de verificación: Node nativo, build de esta solución, DB local confirmada, release `evaluation-2026.10`. Ambos ámbitos resueltos: células `82830d4e-4eb9-5c2c-9120-3c3036c54ac8`; Física `01b2fa59-0542-551c-95df-8e3ffc4873ed`. La versión curricular `d98f8201-3cac-5da6-b855-38f7bb8c8011` permanece DRAFT.
- El catálogo `.9` se archivó sin modificar su payload. La instalación de `.10` fue idempotente y preservó los fingerprints de releases anteriores. No hubo migraciones, reset ni escrituras de catálogo/currículo remotas; no se desplegó producción.

## Trazado completo

La descripción HTML de Tiptap se convierte a texto separado por bloques, evitando unir palabras entre párrafos; se probaron tildes, orgánulos y códigos con espacios/minúsculas. El backend obtiene grado/ciclo/asignatura de la asignación autorizada, admite secuencia secundaria local 1–6 y global 7–12, y normaliza el código antes de resolver el ámbito. Las denominaciones reales remotas son **Ciencias de la Naturaleza: Ciencias de la Vida** (`NAT-VIDA`, 2.º) y **Ciencias de la Naturaleza: Física** (`NAT-FIS`, 6.º).

El proveedor común detecta el tema por descripción y ámbito; el propósito científico prevalece sobre el medio artístico. `scientificTaskType` propone proyecto para un modelo científico y ejercicios para una resolución con magnitudes eléctricas. No compara títulos exactos. Las elecciones manuales conservan prioridad. `secondaryScienceCriteria` selecciona las acciones solicitadas, sin imponer funciones/comparación/oralidad a consignas que no las pidan.

El servicio utiliza cinco criterios específicos por caso. La alternativa local recibe ahora el contexto de la asignatura, incluido el creador desde Evaluación, y utiliza el mismo proveedor. Cotejo y escala expresan indicadores observables; la escala conserva y permite editar sus descriptores en las celdas existentes. El adaptador y la configuración canónica conservan estos textos hasta el snapshot guardado. Un descriptor manual vaciado sigue visible y bloquea el guardado incompleto, en lugar de desaparecer y convertirse en contenido genérico.

La alternativa se activa tras fallo de red/5xx o respuesta inválida; no tras un 4xx de autorización/validación. Las pruebas del componente muestran que una respuesta válida conserva su catálogo `.10`, y que un 503 utiliza `editable-fallback-v1`. Se mantienen los controles de petición obsoleta, campos modificados, puntaje pendiente y protección de ediciones manuales. No se observó sustitución de una respuesta contextual válida.

## Instrumentos obtenidos

Los **ocho instrumentos completos** (rúbrica, cotejo, escala y lista ponderada de cada caso), sus descriptores y puntajes están en [instrumentos-ciencias-completos.md](instrumentos-ciencias-completos.md). Los JSON `science-cells-after.json` y `science-ohm-after.json` incluyen 32 combinaciones del servicio: ambos títulos originales y neutrales, cuatro formatos y totales 20/17.35, junto con campos del editor.

Células: estructuras; representación de ambos tipos mediante maqueta **o** dibujo; funciones; comparación; explicación oral. Ohm: datos/incógnitas; aplicación/despeje; cálculo/unidades; interpretación; esquema y funcionamiento del circuito. No se pide construcción física del circuito. Cada criterio recibe 4 puntos para total 20 y 3.47 para total 17.35, con distribución en centésimas y niveles progresivos específicos.

## Verificación y alcance

- 32 reproducciones fallidas antes del cambio; 32 combinaciones corregidas backend y 32 alternativa/editor. Negativos de arte real, asignatura/grado incompatible, otros temas, consignas parciales y códigos/sinónimos; se mantienen las pruebas de otras asignaturas y módulos de Lengua. Se encontró una detección adicional de arte con título neutral que devolvía OTHER; se corrigió la acción verbal compartida sin clasificar modelos científicos como arte.
- HTTP local: 16 actividades por caso, guardadas con guards y contexto estructurado reales; reintentos sin duplicados, conflicto 409 para un envío distinto, edición manual con snapshot versión 2 y linaje; ningún release o snapshot ajeno modificado. JWT sintético local: no constituye prueba del login real. La prueba de navegador usa ese mismo servicio local, no un mock de recomendaciones.
- Navegador: Ohm con servicio `.10`, los cuatro formatos y dos totales; células con el mismo servicio y cambio entre los cuatro formatos, escala con sus descriptores visibles. En el entorno original Chrome se verificaron **ambos casos × cuatro formatos × dos totales = 16 instrumentos** específicos mediante la alternativa contextual, conservando los errores 503 como evidencia. No se guardó ninguna actividad remota ni se alteró el borrador original del usuario. Los wrappers de diagnóstico se retiraron; no forman parte de la interfaz publicada.
- Suite backend: 567 pruebas aprobadas. Suite frontend: 573 pruebas aprobadas. Inventario: 5 pruebas aprobadas. Builds backend y frontend aprobados; Cloudflare dry-run aprobado, sin despliegue.
- La suma exacta fue una comprobación adicional: se verificaron también los textos, acciones, progresión, tipo científico, continuidad hasta campos/snapshot y contenido mostrado.

**Limitación operativa:** el backend original sigue apuntando a la base remota con catálogo `.1`, por lo que continúa devolviendo 503; el frontend corregido resuelve estas consignas mediante la alternativa. La ruta de servicio completo se comprobó con `.10` local. No se instala `.10` en producción por petición expresa del usuario. Los instrumentos históricos o borradores con ediciones no se reemplazan automáticamente; deben regenerarse/revisarse explícitamente.

## Matriz curricular

No se encontró secundaria completa marcada falsamente como completa: la matriz previa mantenía Ciencias pendiente. Se registran ahora `PARTIAL_CELL_MODEL` para Célula de 2.º y `PARTIAL_OHM_ONLY` en el grupo extraído Ondas de 6.º, que contiene Electricidad y circuitos. La fuente se conserva: Ohm se registra en el procedimiento de electricidad de PDF 321, sin inventar un encabezado conceptual literal. No se declaran completos el bloque de Ondas, genética, división celular, otros temas, grados ni asignaturas. La revisión visual cubre las páginas utilizadas y solo los procedimientos asociados explícitamente; los límites completos de los bloques siguen pendientes. `revision.json`, `inventario.json` y `matriz.csv` quedan alineados.

## Archivos modificados

- Común: `packages/shared/src/secondary-science.ts`, `index.ts`, `instrument-definition.ts`.
- Backend: `catalog-current.ts`, nuevo `catalog-v9.ts`, `curriculum-context.ts`, `recommendation-engine.ts`, `science-regressions.spec.ts`.
- Frontend Actividades: `ActivityCreator.tsx`, `ActivityEditorWorkspace.tsx` y su spec, `ActivityCreationView.tsx`, `ScaleInstrument.tsx`, `editorPresentation.tsx`, `instrumentPreparation.ts`, `instrumentCriterionAddition.ts`, `activityDefaultSuggestions.ts`, nuevo `instrumentAcademicContext.ts` y `scienceCoverage.spec.ts`.
- Entrada desde Evaluación: `GradingBook.tsx`, `GradingPage.tsx`.
- Verificación/datos: `verify-science-local.mjs`, `science-regressions.json`; registro, matriz, informe e instrumentos completos y evidencias en este directorio.

El commit y push final se entregan con hash y rama comprobados mediante Git; el informe está incluido en ese mismo commit.
