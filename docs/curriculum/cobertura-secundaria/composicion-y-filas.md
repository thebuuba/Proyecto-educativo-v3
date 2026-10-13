# Composición contextual y edición por fila · catálogo .14

Trabajo del 13/10/2026 en `amplia-instrumentos-secundaria`, a partir de `14a3e4eb58efe49a250c223969848b93ec03e9dc`. El último cambio funcional anterior era `55bb4b94917185c4ea335be738c8d2903692b57c`, con `evaluation-2026.13`. Los commits posteriores anteriores a este bloque solo registraban evidencia. Ejecución directa, sin subagentes, sin IA ni cambios de esquema, producción o diseño del creador.

## Causas comprobadas

1. `teacherTopic` tomaba el título y la composición genérica añadía «al abordar…» a los indicadores. Matrices devolvía HTTP 200 y cinco dimensiones generales con el título completo, sin contenido específico. [Respuesta previa real](evidencias/matrices-antes.json).
2. `includeAdditionalCandidates` mezclaba el proveedor contextual con criterios genéricos, incluso después de agotar las evidencias pertinentes. Ese comportamiento simulaba disponibilidad y podía puntuar dos veces evidencias similares.
3. La adición comparaba texto y plantilla simultáneamente: una edición completa podía ocultar una identidad ya utilizada. Los editores tenían adición y regeneración global, pero carecían de completar solo una fila.
4. Copiar cuatro descriptores a seis niveles mediante redondeo repetía textos. La configuración de escala tampoco remapeaba los descriptores por identidad del nivel al cambiar su estructura y podía redistribuir puntos válidos al cambiar únicamente niveles.
5. La detección concatenaba título y descripción en Ciencias/Lengua: un título antiguo de Ohm seguía activando Ohm frente a una consigna de densidad; en Lengua, una guía antigua podía imponerse a una descripción de informe. Pruebas rojas conservadas en `math-contextual-composition.spec.ts`.
6. En desarrollo, interpretar admitía DRAFT implícito y recomendar solo PUBLISHED sin ID. Dos guardados rápidos quedaron sin ámbito curricular aunque tenían criterios contextualizados. Se conserva la evidencia previa; ambas operaciones ahora resuelven igual en desarrollo. Producción mantiene PUBLISHED por defecto, demostrado por prueba específica.
7. Resolver el ámbito permitió descubrir referencias curriculares del título anterior en las consignas incompatibles. La búsqueda también prioriza la descripción; no basta con corregir el prefijo del proveedor. [Referentes erróneos previos](evidencias/titulos-incompatibles-referentes-antes.json).

## Correcciones compartidas

- Se elimina la concatenación automática del título como redacción. Las plantillas todavía no cubiertas pueden utilizar un contenido nominal acotado como contexto prudente; no se registran como cobertura temática completa.
- Ciencias y los géneros/temas de Lengua priorizan la descripción sobre un título incompatible. Se conserva el título del instrumento y se respetan las selecciones explícitas.
- Un proveedor contextual agotado no incorpora plantillas genéricas. Matemática ofrece una comprobación adicional únicamente si la descripción la pide; el candidato tiene identidad propia.
- La identidad de fila, la plantilla y la progresión se conservan en los campos persistidos. El remapeo por eliminación, reordenación o duplicación incluye esa procedencia.
- «Completar criterio» aparece en el menú de cada fila de los cuatro formatos. Recupera un objetivo no utilizado en una fila vacía, o busca una correspondencia específica con el nombre/indicador docente. Completa solo campos vacíos; conserva textos, pesos, puntos, identidad y las otras filas. Una intención ambigua o sin correspondencia queda manual con aviso.
- No hay una operación silenciosa de reemplazo por fila. Regenerar el instrumento completo mantiene su confirmación existente.
- Se bloquean solicitudes repetidas y se identifica la fila en trabajo. Se rechazan respuestas si cambian consigna, formato, campos, orden o contexto; la aplicación comprueba identidad y firma antes de aplicar. Un error de permisos no se transforma en alternativa local.
- Añadir pide confirmación antes de redistribuir puntos/pesos manuales, también en ponderada con puntaje pendiente. Confirmar una propuesta atrasada no la aplica. Completar textos no redistribuye.
- La adición conserva el peso relativo del candidato frente a una fila con peso de catálogo conocido; una comprobación de peso 2 no recibe por defecto el peso medio 4. Los instrumentos antiguos sin ese dato mantienen su base proporcional y requieren revisión docente.
- Los proveedores mantienen cinco desempeños específicos. Al añadir el quinto nivel contextual, se propone «Requiere apoyo» en la posición intermedia correcta; se conservan los textos existentes y solo se usa una evidencia no repetida cuando su orden está fundamentado. Configurar niveles/escala requiere confirmación. Seis niveles siguen permitidos por el contrato, pero requieren redacción manual si no existe una sexta progresión; no se duplica un descriptor.
- Las actividades calificadas conservan el editor estructural bloqueado y las restricciones de persistencia existentes. No se crearon calificaciones ficticias para comprobar ese bloqueo en navegador.

## Contenido matemático

Matrices, 5.º: organización/significado de filas, columnas y entradas; operación y dimensiones; ejecución; justificación; interpretación de cantidades, precios o ventas. Pesos de base 4/4/5/3/4. «Suma, resta y multiplicación, según corresponda» no exige las tres operaciones en cada situación. Las acciones de comparación/análisis se seleccionan sin imponer resolver operaciones ausentes.

La ubicación de vectores y matrices se confirmó visualmente en PDF 231–232, impresas 230–231, encabezado 5.º. Este núcleo no implementa determinantes, inversa, tipos de matrices ni vectores completos.

Trigonometría, control original de 6.º: datos/incógnita, seno/coseno/tangente, despeje/cálculo/unidades, explicación e interpretación. No obliga a dibujar un triángulo ni a construir objetos. La fuente documenta resolución de triángulos y problemas con funciones trigonométricas en 5.º, PDF 231; 6.º, PDF 233–234, aborda fórmulas de suma/diferencia, ángulos múltiples y ecuaciones. Se registra como adaptación de la consigna de 6.º con fuente de 5.º, sin atribución oficial falsa ni referencias curriculares de otro ámbito.

Instrumentos completos: [matrices, cuatro formatos](matrices-instrumentos-completos.md) y [trigonometría, cuatro formatos](trigonometria-instrumentos-completos.md). La ponderada define Parcial (50%) para cada indicador. Cotejo usa evidencias verificables; rúbrica/escala tienen desempeños progresivos distintos.

## Pruebas y entorno

- Backend: 1.094 pruebas aprobadas; frontend: 638; inventario: siete; arranque local: dos del bloque anterior. La suite frontend utiliza dos workers. Logs de autorización/503 son controles negativos aislados; el servicio normal permanece conectado.
- Compilaciones backend/frontend aprobadas y `pnpm cloudflare:build` con `--dry-run`, sin despliegue. Se corrigió un import innecesario detectado por la compilación.
- Servicio normal 5173 → 3000 → Supabase 54321/54332, autenticado por contraseña con docente ficticio: 32 propuestas matemáticas, cuatro formatos, títulos original/neutral, 20/17,35 y candidato adicional solicitado. [Evidencia de respuestas completas](evidencias/matematica-servicio-normal.json).
- Se repiten los cuatro formatos de células, Ohm, noticia, guía e informe; además se verifican tres títulos incompatibles en Ciencias/Lengua. Una ejecución repetida alcanzó el límite HTTP 429; se respetó su intervalo y se repitió la comprobación, sin desactivar protecciones ni usar alternativa local.
- Navegador real: rúbrica de matrices original con título neutral, puntaje inicialmente pendiente, 17,35, edición manual, descriptor borrado/completado, agotamiento, eliminación y recuperación de objetivo en fila vacía, quinto nivel confirmado, guardado/reapertura.
- Cotejo 20, escala 17,35 y ponderada 20: variante explícita que pide comprobar resultados; candidato sexto completo, fila completada, nombre manual de otro criterio conservado, guardado/reapertura. Escala también probó quinto nivel con evidencia distinta.
- Trigonometría: consigna original, ponderada automática 20, guardada/reabierta. Demuestra que una rúbrica inicial no bloquea la selección automática. Elección explícita de rúbrica, cotejo o escala se conserva en los otros controles.
- Sexto control de navegador: ponderada de matrices de 17,35, con comprobación de peso 2 frente a organización de peso 4; porcentajes 9,09% y 18,18%, conservados al guardar/reabrir. Los primeros cinco controles preceden a este ajuste del peso adicional y se conservan como historial de la prueba.
- Séptimo control: ponderada automática de matrices de 20, guardada y reabierta tras corregir DRAFT y búsqueda; API verifica versión `d98f8201-3cac-5da6-b855-38f7bb8c8011`, ámbito `392f46f2-fbc7-5931-a290-c45a88a4f206` y RESOLVED. Dos de los seis controles anteriores conservaron la ausencia de ámbito del fallo original; no se reescriben sus snapshots. La comprobación HTTP final exige ámbito/version correctos en las 32 propuestas.
- [Datos recuperados por API real](evidencias/matematica-guardados-reabiertos.json) validan IDs únicos, plantilla, textos manuales, niveles, pesos y suma exacta. Los cinco instrumentos históricos .10–.13 permanecen intactos. La instalación local .14 se ejecutó dos veces: CREATED/UNCHANGED; hashes de todos los releases anteriores conservados.

## Cobertura y continuidad

Archivos funcionales: `packages/shared/src/secondary-math.ts`, `instrument-recommendation.ts`, `secondary-topic-recommendation.ts`, `secondary-science.ts`, `secondary-language-topics.ts` e `index.ts`; backend `catalog-current.ts`, archivo histórico `catalog-v13.ts`, `recommendation-engine.ts` y sus pruebas; frontend `instrumentPreparation.ts`, `instrumentCriterionAddition.ts`, `ActivityCreationView.tsx`, `InstrumentPreview.tsx`, los cuatro editores e `instrumentEditorShared.tsx`. Se añadieron pruebas de composición/completar y se ampliaron las de GradingBook. Verificadores nuevos `verify-math-normal-local.mjs` y `verify-math-browser-saves-local.mjs`; inventario/revisión/CSV, fixtures, informes y evidencias actualizados.

La matriz mantiene 72 ámbitos de grado: 54 comunes y 18 optativos; otros 17 son ámbitos de ciclo. No hay una asignatura completa. Lengua 1.º conserva tres núcleos parciales; Lengua 2.º requiere reauditoría; Ciencias conserva únicamente células 2.º y Ohm 6.º; Matemática incorpora matrices 5.º y la adaptación del control trigonométrico 6.º. Los demás temas y optativas siguen pendientes. Las 18 optativas aún no están asignadas al docente QA.

Limitaciones reales: la correspondencia por fila usa coincidencias conservadoras, no comprensión libre de cualquier paráfrasis; una intención ambigua queda manual. Progresiones arbitrarias o superiores a cinco desempeños requieren edición manual. No se verificó subida de archivos ni se cubrieron todos los temas de secundaria. Los casos negativos de concurrencia/permisos y los límites se probaron automáticamente; no se interrumpió el servicio para simularlos en la prueba principal de navegador.

Graphify disponible como grafo de `ffabbed9`, desactualizado y sin CLI operativa; el rastreo se contrastó con código actual. UI/UX y React se revisaron contra componentes y sistema visual existentes; no se instaló un intérprete o dependencia para búsquedas de estilos.

Siguiente bloque: afiche de Lengua 1.º, después cuento policíaco/caligrama y los pendientes de los tres núcleos. Mantener el orden de `avance.md` para los demás grados/asignaturas. Commit funcional y versión exacta ejecutada se registran al cerrar el bloque en `continuacion.md`; no se equipara este avance con la conclusión del encargo completo.
