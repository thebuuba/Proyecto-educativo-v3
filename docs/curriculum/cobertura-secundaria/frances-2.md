# Francés común — 2.º de secundaria

Actualización posterior: cuatro formatos nuevos con versión/ámbito de fuente correctos quedaron verificados. El cotejo interrumpido se recuperó sobre el mismo registro después de inspección SQL/HTTP; su instrumento permanece idéntico. Los snapshots sin referencias de la ejecución inicial se conservan como historia. [Cierre de fuente](frances-fuente-development.md), [evidencia y hashes](frances-fuente-verificacion.json).

## Alcance y conexión

Proveedor `frances-comunicacion-2`, catálogo `evaluation-2026.71`, exclusivamente en AulaBase Development `eolgunypmtgrsyrjzcld`. Fuente: MINERD 2023, PDF 185–188 / impresas 184–187, ámbito `d61f0959-332f-5a0e-8f5e-b1c05dcadae9`. [Matriz oficial y revisión visual](frances-matriz.json), [inventario](frances-inventario.md). Los criterios son adaptaciones de AulaBase, no instrumentos oficiales.

Cuatro funciones conectadas: información personal, descripción de vivienda, actividades cotidianas y gustos/preferencias. Se reutilizan las funciones francesas de identidad/rutina donde el currículo coincide, con identificadores propios de 2.º. Vivienda y preferencias tienen progresiones específicas. Las coincidencias/discrepancias se añaden únicamente cuando se piden expresamente. No se reutiliza contenido inglés.

Gramática condicionada a una petición explícita: concordancia, artículos definidos/indefinidos/contractos y partitivos, posesivos, pronombres, preposiciones, presentativos, negación ne…pas, preguntas, presente/pronominales, adverbios, respuesta si y posición del adjetivo. Léxico condicionado: identidad/estado civil, países/ciudades/direcciones, nacionalidades, números, profesiones, familia, rasgos/cualidades, mobiliario/espacios/electrodomésticos, colores, ocio, actividades culturales/artísticas, música, deportes, juegos, quehaceres, alimentos/bebidas, tiempo y comunicación. No se evalúan rasgos personales del estudiante: los referentes son los personajes o el contenido de la tarea.

Formularios, mensajes/correos, avisos/carteles y poema/rima/canción conservan evidencia propia cuando son solicitados. La revisión del borrador es condicional. La recepción de una descripción de vivienda no exige escribirla ni pronunciarla.

## Patrones y límites

Se aplica el analizador acotado documentado en [1.º](frances-1.md): descripción prioritaria, acciones independientes, modalidades oral/escrita, alternativas o/ou, negaciones reconocidas, ejemplos/recursos excluidos y requisitos de entrega. Familias específicas: vivienda/logement/habitation/description de maison, gustos/preferencias/goûts/préférences, información personal y rutinas. Gramática y léxico reconocen las denominaciones españolas/francesas enumeradas en `secondary-french-grade-2.ts`; no se presupone comprensión universal ni todos los sinónimos.

La selección del docente prevalece. Cotejo se recomienda para recepción discreta, rúbrica para desempeño; escala o ponderada cuando el propósito lo justifica. La estrategia requiere evidencia explícita. Se conservan el diseño vertical y las mecánicas de puntuación pendiente, centésimas exactas, ediciones manuales, cambio de formato/actividad, respuestas obsoletas, añadir/completar, agotamiento y límite de veinte criterios.

## Verificación

Automatización final: backend completo **37.085 / 96 archivos**; focalizadas francesas de 1.º–2.º **245 backend y 203 frontend**. Los casos de 2.º se comprobaron primero en rojo; también se detectó mediante una regresión la ausencia de una dimensión explícita de coincidencias/discrepancias y se corrigió. Backend, frontend y Cloudflare pasaron sobre los cambios finales; los resultados y assets efectivos se registran en [la evidencia](frances-2-verificacion.json). Después del build se repitieron cuatro recomendaciones y la reapertura de los cuatro instrumentos, sin cambios de hash ni guardados duplicados.

HTTP/DB autenticados: **12 interpretaciones, 24 recomendaciones y cuatro guardados/editados/reabiertos**, con identidad/snapshot y hash del instrumento conservados al cambiar solo SIMULATION automática por CASE_STUDY manual. Actividades QA: rúbrica `ac5e4429-0297-4782-a2a0-491a27aaf643`, cotejo `dd21c901-3094-4558-91f1-1d702d559827`, escala `a9c322af-fe62-4009-b8cb-9bc594deb3c7`, ponderada `e0d1d9f4-d33f-4770-aaa4-5a8907700ecb`. Catálogo `CREATED` y después `UNCHANGED`; tres releases previos preservados y `.70` congelado sin diferencias. No se acredita el recorrido visual por estas pruebas.

Incidencia de infraestructura: una revalidación posterior al build terminó con HTTP 500/timeout porque Wrangler salió tras `ENOTFOUND` al resolver el pooler de Supabase. Se comprobó la ausencia de proceso/listener antes de reiniciar únicamente el servidor local. No se repitieron guardados. Las verificaciones remotas se mantienen secuenciales; no se modificó DNS, producción ni configuración remota. El resultado de las lecturas posteriores queda separado en `http.finalBuildRecheck` de la evidencia.

Los [cuatro instrumentos completos](frances-2-ejemplos.md) corresponden a un intercambio de preferencias musicales. Se revisaron las tres dimensiones: comunicar la preferencia, relacionar turnos y hacer comprensible el mensaje oral. No exigen instrumentos musicales, materiales, cantidades, fluidez nativa ni otra producción ausente. La ponderada describe cumplimiento parcial; la escala expresa grado de cumplimiento; el cotejo verifica indicadores y la rúbrica gradúa evidencia.

Navegador: Chrome conserva la sesión personal y su borrador; la superficie aislada para QA no está disponible. Queda pendiente el recorrido visual completo de los cuatro formatos. En una sesión separada, acceder a localhost:8787 con la cuenta QA Development existente, seleccionar `2.º secundaria QA Francés Development / QA Francés / Francés` y usar la consigna de los ejemplos. Comprobar estrategia automática y manual, puntaje inicialmente vacío, cambios a 20/17.35, texto/peso manual, guardado/reapertura, cambio exclusivo de estrategia y aviso persistente al agotar criterios. No borrar almacenamiento ni borradores.

Lectura del DOM de la pestaña personal, sin navegar ni editar: todavía carga `/assets/index-yWh82mQY.js`, anterior al build de Francés. Esto acredita una página abierta con código anterior, no demuestra que el service worker sirva contenido incorrecto. Guardar cualquier edición pendiente y recargar antes de la prueba manual. No se limpió caché, cookies, almacenamiento ni service worker.

## Archivos y conservación

Límite de procedencia curricular: una consulta posterior de solo lectura confirmó que `curriculum_versions` está vacío en Development. Los cuatro snapshots `.71` tienen `curriculum_version_id` y `curriculum_scope_id` nulos. El contexto académico QA y el catálogo evaluativo sí están comprobados; la fuente oficial y sus ámbitos pertenecen al inventario local revisado. Queda pendiente vincular un catálogo curricular DB, sin reescribir estos snapshots históricos. No confundir las dos capas de catálogo.

`secondary-french-grade-2.ts` contiene el contenido de este grado; `secondary-french-curriculum.ts` comparte únicamente construcción de criterios gramaticales/léxicos. `secondary-french.ts` selecciona las familias y asigna identidades por grado. Contratos y pruebas comunes backend/frontend amplían la matriz sin duplicar el editor. `catalog-v70.ts` congela el release previo; scripts de QA registran cada escritura para impedir repeticiones ciegas ante una interrupción. Sin cambios de esquema, producción, cuentas anteriores ni snapshots históricos.
