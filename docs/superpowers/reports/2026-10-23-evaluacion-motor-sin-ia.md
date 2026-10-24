# Evaluación acotada del motor de instrumentos sin IA

## Dictamen

La evaluación muestra que el motor actual **no produce resultados consistentemente pertinentes en las seis asignaturas**. Las correcciones acotadas recuperan requisitos de la noticia y del formato y eliminan una entrega inventada, pero no resuelven las pérdidas de acciones, las alternativas y la composición transversal. Se recomienda **simplificar la composición compartida antes de retomar la ampliación curricular**. No se ha ejecutado esa reescritura ni se ha añadido un flujo visible.

## Estado inicial y conservación

Inicio: rama `ampliacion-de-instrumentos-2`, commit `b6b342d2ccd4dfd4f464b73eb720614651db8662`, árbol limpio. Localhost:8787 servía `evaluation-2026.171` en AulaBase Development (`eolgunypmtgrsyrjzcld`). Sus cuatro recorridos QA anteriores terminaron por HTTP; no acreditan pruebas visuales ni cierre de Inglés. La consulta de solo lectura al comenzar esta evaluación registró 102 releases y 1273 snapshots. Se conservan los checkpoints originales y los diarios de intentos anteriores.

La ampliación se detuvo en Inglés común de primero, tras gustos/preferencias171. La entrega de ocho actividades de indicaciones/instrucciones sigue en el historial de los agentes; no se comenzó su implementación. Los agentes estaban completados/interrumpidos y no participaron en este encargo. Trabajo y revisión realizados solo por el coordinador.

Chrome tenía una sesión personal activa; el navegador integrado de VS Code era otra sesión. Se pudo navegar por Cursos y abrir Lengua1. El borrador de la noticia ya existía y se conservó sin editar ni guardar. Al abrirlo, el creador mostró `Failed to fetch`. El proceso local había terminado; su registro contiene `ENOTFOUND` del host PostgreSQL. Una consulta DNS posterior volvió a resolverlo. No se aumentaron timeouts ni se hicieron reintentos masivos.

## Diseño de la evaluación

El banco y las expectativas se guardaron y bloquearon antes de ejecutar estas actividades: [bank-v1.json](../../../data/evaluation-instruments/engine-evaluation/bank-v1.json), SHA256 `dc1e9f6b5fcd1c4bbeb9c4f90d06b7809df359fdce467d658bcce2621111f632`. Cuatro actividades por asignatura: breve, detallada, varias acciones y alternativa/negación. Son 24 contextos de actividad ya admitidos por el producto, no 24 temas añadidos al currículo.

ING02 reproduce literalmente la entrevista de trabajo aportada por el usuario, en Inglés6. LEN02 es la regresión exigida por el usuario, cuyo texto había originado el asistente. Las otras22 son sintéticas; no se atribuyen a docentes reales. El coordinador conocía implementación y bancos anteriores: **no se afirma diseño ni revisión independientes**. Las nuevas consignas no se redactaron buscando expresiones reconocidas por el motor y no se modificaron después del lock.

Se reservaron LEN04, ING04, FRA04, MAT04, SOC04 y NAT04. No se ejecutaron antes de corregir. Sus primeras salidas fallidas se conservan y no se usaron para ajustar reglas. Después de leerlas dejan de ser casos desconocidos; la comprobación final no se presenta como una nueva reserva. Las expectativas distinguen producto, contenido, requisitos, dimensiones inherentes, exclusiones e instrumentos defendibles. Ninguna etiqueta metodológica concreta se exige por capricho del banco.

Antes:18 selecciones automáticas y los cuatro formatos de seis actividades representativas (42 propuestas, incluidas selecciones coincidentes). Después: mismas18 y24 selecciones manuales; finalmente6 automáticas reservadas. Las salidas completas incluyen criterios, descriptores, niveles, puntuaciones y trazas. La revisión es semántica; las aserciones de estructura y puntuación no la sustituyen.

## Recorrido y causas confirmadas

1. **Interpretación y selección duplicadas.** `evaluation-instruments.service.ts:29` resuelve contexto y detecta actividad/técnica/instrumento. `recommendation-engine.ts:247` vuelve a resolver proveedores. El frontend conserva otra cadena de resolución y plantillas en `instrumentPreparation.ts:65`. La captura presenta diferencias de contenido o formato entre servidor y alternativa local en ING01, SOC02, SOC03 y NAT01; y en las reservas LEN04/ING04. No son únicamente IDs o referencias curriculares distintos: la comparación los excluye. Se conservan las alternativas completas cuando difieren. Ocho selecciones diagnósticas y dos reservadas difieren.

2. **Selección temática sustituye reconciliación de requisitos.** `recommendation-engine.ts:395` elige un proveedor prioritario y `:430` sustituye los genéricos por sus filas si existen. No hay una comprobación final que demuestre qué requisito explícito quedó cubierto. FRA02 pierde ciudad y gusto; FRA03 pierde ciudad y presentación posterior. El vocabulario de identificación está cerrado en `secondary-french-grade-1.ts`, por lo que mencionar nombre/edad basta para que una respuesta parcialmente pertinente parezca completa.

3. **Palabras de contenido se convierten en actuaciones o temas completos.** `secondary-social-grade-1.ts:14` vincula `antillas` a colonización del Caribe: SOC01 solicita ubicación y nombres, pero se contextualiza como colonización. `secondary-science-common.ts:119` conserva temas anteriores al separar acciones; `:132` asigna temas heredados a la cláusula siguiente. NAT02 convierte distinguir foco y punto superficial en comparar los temas completos de tectónica y sismos, y pierde el esquema. NAT03 no conserva la clasificación provisional y la información faltante. No hay evidencia que permita atribuir estos fallos solamente a falta de currículo.

4. **La composición lingüística elimina más de lo que un recurso específico reemplaza.** En `secondary-language-grade-one-complete.ts`, solicitar puntuación eliminaba toda la fila de lenguaje; solicitar revisión generaba un proceso y eliminaba las convenciones finales. LEN02 terminaba sin tono informativo ni ortografía explícita y con un borrador inventado. Además, cualquier proceso, incluida la publicación, eliminaba la fila de convenciones. Se reprodujo por separado y se corrigió.

5. **Revisión interpretada como otra entrega.** `explicitWritingProcess`, en `language-feature-criteria.ts:66`, activaba borrador/final ante «revisa». Se exige ahora evidencia explícita del proceso. Mantener un texto correcto es válido. La corrección no añade otra entrega al caso de la noticia.

6. **Clasificación del producto por una acción secundaria.** En `index.ts`, la comparación tenía prioridad global sobre la producción. LEN03 pedía crear una guía y comparar dos lugares dentro de ella; se producía un instrumento para comparar dos guías. Se conserva la acción principal de creación cuando precede a esa comparación. No se añadió una excepción por título ni ID.

7. **Extracción de presentación incompleta.** `deliveryConditions`, en `task-delivery-requirements.ts`, reconocía «fuente Arial» pero perdía «letra Arial12» y el color concreto del título. La corrección conserva fuente, tamaño, interlineado, sangría y color dentro del criterio de presentación existente. No crea cinco criterios ni inventa un nuevo producto.

8. **Plantillas genéricas y descriptores no verifican pertinencia.** El motor genérico fija cantidades por banda/familia (`recommendation-engine.ts:299`) y puntúa plantillas. SOC02/03 reciben fuentes/argumentación/contexto no pedidos. NAT01 recibe procedimiento científico para una explicación. Algunos descriptores concatenan autonomía o apoyo frecuente a la fila; otros conservan un texto anterior tras cambiar el observable. La reducción de cinco progresiones a cuatro usa `[0,1,2,4]` (`recommendation-engine.ts:424`, `secondary-topic-recommendation.ts:40`) y puede perder el caso de error conceptual si el proveedor no declara `fourLevelLowest`. Esta reserva no se disimula como una solución general.

9. **La estrategia también puede sobredetectarse.** LEN03 recibe inserción en el entorno: `teaching-strategies.ts:96` acepta `visit\w*`, que alcanza «visitante», junto con comunidad/propuesta. Una guía no demuestra contacto con el entorno. Se registra como fallo pendiente, sin añadir controles visibles ni ajustar casos reservados.

## Conexión curricular real, editor y guardado

El servicio verifica pertenencia al centro/asignatura, catálogo exacto y versión/ámbito autorizado (`evaluation-instruments.service.ts:141`). Recupera elementos del ámbito y los ordena por coincidencia. El motor solo selecciona referencias automáticamente con cobertura suficiente (`recommendation-engine.ts:289`); los proveedores escritos manualmente también funcionan con referencias vacías. La presencia de un proveedor contextualizado o de una referencia sugerida **no demuestra cobertura de todos los requisitos**. Esta evaluación local pasó ámbito y elementos vacíos de forma explícita: aísla el motor determinista, sin simular una recuperación curricular de PostgreSQL. Las comprobaciones HTTP finales se registran aparte.

`ActivityCreationView.tsx:470` envía título, descripción, contexto, preferencias y puntuación interna. Conserva el instrumento manual, comprueba la respuesta, compara secuencia/contexto/fingerprint/textos antes de aplicarla y deja los puntos pendientes si aún no fueron asignados. Ante fallo recuperable puede usar `editableFallbackRecommendation`; ahí se hacen visibles las divergencias anteriores. `recommendationToFields`/`alignRecommendationWithFields` convierten y conservan los textos editados. El guardado conserva snapshots en el backend; las pruebas de persistencia cubren cambios de estrategia, ediciones, notas y protección de actividades calificadas. No se modificaron esos flujos ni UI.

Existe una ruta previa opcional de IA (`evaluation-instruments.service.ts:86`), condicionada por `DEEPSEEK_API_KEY`. No se añadió ni utilizó. La variable no estaba presente en el archivo local ni en el entorno del coordinador; las capturas invocan directamente el motor puro. Su existencia es parte del diagnóstico y no una solución a este encargo.

## Resultado por actividad

La evidencia individual está en [review-v1.json](../../../data/evaluation-instruments/engine-evaluation/review-v1.json). «Adecuado en alcance» se refiere al encargo concreto, no a una asignatura cerrada ni a interpretación universal.

| Actividad | Resultado después | Problema conservado o corrección |
|---|---|---|
| LEN01 noticia breve | Adecuada en alcance | Información, estructura, cohesión, tono y convenciones |
| LEN02 noticia obligatoria | Requisitos corregidos | Sin borrador añadido; reserva común sobre reducción de niveles |
| LEN03 guía | Parcial | Producto/formato corregidos; comparación/ruta incompletas y estrategia excesiva |
| LEN04 reservada | Falla | Recomendación de lectura convertida en creación de cuento |
| ING01 presentación | Falla | Base genérica, sin paridad |
| ING02 entrevista real | Adecuada en alcance | Cuatro formatos conservan preguntas/respuestas y roles |
| ING03 lectura | Parcial | Falta justificar la preferencia desconocida |
| ING04 reservada | Falla | Mascota y modalidad alternativa perdidas |
| FRA01 presentación | Base prudente | Modalidad por precisar; no inventa datos concretos |
| FRA02 ficha | Falla | Omite ciudad y gusto |
| FRA03 conversación | Falla | Omite ciudad y presentación posterior |
| FRA04 reservada | Falla | Impone interacción/escrito y pierde rasgos/alternativa |
| MAT01 enteros | Adecuada en alcance | Procedimiento y resultado pertinentes |
| MAT02 saldo | Parcial | Razonamiento poco contextualizado y dimensiones redundantes |
| MAT03 estadística | Falla | Tabla/gráfico y conclusión no quedan cubiertos |
| MAT04 reservada | Parcial | Base de análisis sin comparación racional ni alternativa explícita |
| SOC01 mapa | Falla | Colonización añadida; rotulado omitido |
| SOC02 relieve | Falla | Fuentes/argumentación añadidas y comparación incompleta |
| SOC03 fuentes | Falla | No conserva límites del conocimiento ni atribución suficiente |
| SOC04 reservada | Parcial | No conserva cantidades comparativas ni medio alternativo |
| NAT01 interior terrestre | Falla | Tema truncado y procedimiento científico inventado |
| NAT02 sismos | Falla | Comparaciones no pedidas; foco/epicentro/esquema omitidos |
| NAT03 rocas | Falla | Registro parcial, clasificación y límites omitidos |
| NAT04 reservada | Falla de alternativa | Contenido pertinente, dibujo/texto aparecen acumulados |

## Instrumentos representativos y justificación

Las seis actividades detalladas tienen rúbrica, cotejo, escala y ponderada completos en las capturas. Cada formato solicitado se conserva. Se comprobaron puntos inicialmente vacíos, totales20/17,35, validación y edición del instrumento; las comprobaciones de cálculo no certifican calidad semántica.

En LEN02 los criterios quedan justificados por: información/fidelidad, estructura, cohesión y tono (requisitos explícitos y dimensiones de la noticia), ortografía/legibilidad y puntuación (revisión solicitada). No se añadieron otras tareas ni una fila por cada dato ficticio. El defecto antes/después está visible en las capturas completas.

En ING02 las filas corresponden a responder, preguntar, alternar roles y sostener un intercambio comprensible: requisitos de la simulación y dimensiones esenciales de oralidad. FRA02 solo justifica parcialmente identificación y comprensibilidad escrita; falta cubrir dos datos. MAT02 justifica procedimiento/resultado, pero la relación entre concepto/explicación y la representación debe simplificarse y contextualizarse. SOC02 no justifica exigir selección de nuevas fuentes. NAT02 no justifica comparar temas completos. Esos instrumentos **no se aprueban por tener formato válido**.

## Límites y recomendación concreta

El determinismo puede conservar acciones y requisitos expresamente reconocidos, seleccionar familias, mantener referencias, respetar una alternativa ya detectada, agrupar presentación y producir progresiones preparadas. No permite prometer comprensión de cualquier redacción, reconocer toda equivalencia semántica ni demostrar que cada criterio cumple un requisito solo por coincidencia de palabras.

Se propone reutilizar familias, proveedores y formateadores en **una composición pura compartida** por servidor y alternativa local: contrato de producto/acción principal → contenido contextual estrictamente solicitado → requisitos explícitos con origen → reconciliación de cobertura y exclusiones → formato elegido. El validador debe poder indicar qué requisito no se pudo relacionar, en vez de rellenar con criterios. El currículo contextualiza y ofrece candidatos; no impone automáticamente todos sus subtemas. La propuesta sustituye la doble composición progresivamente, sin rehacer los catálogos ni cambiar snapshots históricos.

Propósito insuficiente o producto ambiguo: base prudente y confirmación docente del dato decisivo, por ejemplo si se evalúa una explicación o una ejecución. Una alternativa explícita no exige preguntarla de nuevo: debe conservarse como OR. No se implementaron formularios, banners, avisos ni controles nuevos. La simplificación que exceda estas correcciones requiere un encargo aprobado con sus límites antes de ejecutarse.

## Verificación y estado final

La comprobación final de builds, instalación/runtime, commits y limitaciones operativas se añade al cerrar este mismo informe. La auditoría curricular anterior permanece detenida. Sin push, merge, despliegue, producción, cambios de credenciales ni ampliación curricular.
