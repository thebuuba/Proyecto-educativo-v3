# Lengua Española común: familias verificadas de 3.º

Siete temas, 61 registros de subtemas y 27 registros de procedimientos cotejados visualmente en PDF 82–88. Se conectan al recorrido normal del creador y a la alternativa local mediante proveedores compartidos. El alcance corresponde a las familias y consignas documentadas; no garantiza interpretar cualquier descripción. 4.º–6.º siguen pendientes.

## Causas y cambios

La reproducción inicial produjo **28 fallos**: los siete géneros, en cuatro formatos, carecían de criterios conectados. El registro del motor solo contenía temas de 2.º y el creador determinaba el contexto de Lengua mediante dos indicadores limitados a 1.º/2.º. El inventario de 3.º tampoco asociaba los procedimientos con sus temas.

Se añadieron perfiles de entrevista, crónica, catálogo, informe de experimento, artículo de opinión, cuento social/político/cultural y madrigal. La composición distingue acción, producto, género estudiado y requisitos explícitos. La descripción prevalece sobre títulos incompatibles; «presentar por escrito su análisis» sigue siendo análisis. Un mapa conceptual de comprensión no convierte la lectura en redacción del informe. Comparaciones, informes sobre textos y recitaciones tienen evidencias distintas de la creación del género.

Los recursos y soportes conservan sus alternativas o exigencias conjuntas. No se pide realizar un experimento si se proporcionan datos para redactar su informe, ni inventar desenlaces de fragmentos, ni publicar textos sin indicación. La escritura incorpora planificación, revisión, fuentes y conclusión cuando se solicitan. La gramática se evalúa con su función en el pasaje; los niveles distinguen identificación, relación, error de sentido y ausencia de evidencia.

El creador utiliza ahora el grado académico normalizado para Lengua común de 1.º–6.º; solo los grados con proveedores verificados reciben su contenido específico. Se normalizan secuencias locales/globales, espacios y mayúsculas del código; el nombre oficial sirve cuando falta el código. Los códigos explícitos de otras asignaturas/optativas y los ámbitos optativos no se convierten en Lengua común.

La investigación escrita recomienda **Análisis de producciones**, en vez de la técnica de exposición heredada del valor por defecto. Las elecciones explícitas del docente conservan prioridad. Calidad → rúbrica; presencia de evidencias → cotejo; regularidad → escala; pesos entre componentes → ponderada. Las reglas no buscan repartir recomendaciones por cuotas.

Durante la comprobación en navegador se detectó que los gestos de recitación se describían mediante pausas y énfasis. Se reprodujo en una prueba y se corrigió con evidencia gestual específica. El catálogo intermedio `.26` queda archivado; `.27` contiene esa revisión. Los dos instrumentos guardados con `.26` se conservan como evidencia histórica; los cuatro recorridos finales usan `.27`.

## Fuente y familias

| Tema | Familias definidas y comprobadas |
|---|---|
| Entrevista | Comprensión/análisis, preguntas y planificación escrita, realización oral, comparación, investigación del entrevistado |
| Crónica | Comprensión/análisis, escritura/planificación, narración oral, comparación, informe sobre el texto, investigación de hechos |
| Catálogo | Comprensión/análisis, elaboración, producción oral, comparación, investigación de especies |
| Informe de experimento | Comprensión y representación, escritura/planificación, comparación, presentación oral del análisis |
| Artículo de opinión | Comprensión/análisis, escritura/planificación, producción oral, comparación, debate, investigación de información |
| Cuento social, político y cultural | Comprensión/análisis de texto o fragmento, escritura/planificación, narración, comparación, comentario e informe |
| Madrigal | Comprensión/análisis, escritura, recitación, comparación e informe sobre el poema |

Todas estas familias utilizan rúbrica, cotejo, escala y ponderada. [Fuente, asociaciones y contratos](lengua-3-cotejo-fuente.json). La entrevista continúa en PDF83 antes de crónica; la escritura del cuento continúa en PDF87 antes de madrigal. El informe de experimento integra oralidad en sus dos bloques escritos según la nota oficial; no se inventaron bloques orales independientes. Los versos de siete y once sílabas del madrigal proceden de los procedimientos, además del concepto de endecasílabo. Las optativas permanecen separadas.

## Verificación

- **127 consignas**: siete casos básicos, 61 subtemas y 59 casos de procedimientos/familias/requisitos. Pruebas rojas adicionales detectaron 4 fallos de focalización, 12 de producto/alternativas, 48 de requisitos finos, uno de gestos y uno de técnica de investigación. Son etapas sucesivas, no recuentos de defectos independientes.
- Backend completo: **2.566 pruebas**. Frontend completo: **4.443 pruebas**, seguido de **13 recorridos del creador** tras corregir la técnica de investigación. Los **1.524 cruces de 3.º** comparan servicio/alternativa, títulos neutros e incompatibles, cuatro formatos, totales 15/20/17,35 y reparto antes/después de puntaje pendiente.
- **480 solicitudes autenticadas con `.26`** y **236 finales con `.27`** comprueban contenido y acción, además de puntos. La comprobación adicional de selección automática contrasta interpretación y recomendación. Las respuestas completas se conservan; HTTP no se presenta como persistencia.
- Navegador local real, cuenta ficticia: rúbrica de entrevista (20), cotejo del informe (17,35), escala de madrigal (15) y catálogo ponderado (17,35). Formatos sugeridos a partir de la consigna, total introducido después de preparar, edición manual, resumen, confirmación y reapertura desde el listado. Todos los textos capturados se compararon con `instrumentCriteria` y snapshot persistidos.
- **54 snapshots preservados**: 28 de referencia y 26 instrumentos completos capturados; seis pertenecen a este bloque de 3.º. Las cuatro creaciones finales mantienen su edición manual y puntuación exacta.
- Builds backend y frontend, Cloudflare **dry-run**, siete pruebas de inventario y comprobación de diff aprobados. Sin despliegue, reinicio de base, dependencias nuevas, cambios históricos, IA ni rediseño.

La batería frontend quedó inicialmente ocupada recompilando dependencias del catálogo por cada ruta de importación en un cargador de pruebas sin caché. Se corrigió el cargador para reproducir la caché de CommonJS; conserva la comprobación con el DTO real. El archivo aislado pasó en 1,94 s y la batería completa terminó en 58,45 s. No se omitieron sus pruebas.

## Evidencia y límites

- [480 propuestas y comprobaciones iniciales](evidencias/lengua-3-cierre-servicio.json) · [instrumentos completos `.26`](evidencias/lengua-3-cierre-instrumentos.json).
- [236 propuestas finales](evidencias/lengua-3-final-servicio.json) · [instrumentos completos `.27`](evidencias/lengua-3-final-instrumentos.json).
- [Selección automática por finalidad y técnica de investigación](evidencias/lengua-3-seleccion-servicio.json).
- [Cuatro recorridos finales de navegador](evidencias/lengua-3-final-flujo-navegador.json) · [datos realmente persistidos](evidencias/lengua-3-final-persistencia.json).
- [Dos guardados intermedios `.26`](evidencias/lengua-3-cierre-persistencia.json) · [preservación histórica](evidencias/lengua-historicos-evaluation-2026.27.json).
- [Escala reabierta](evidencias/lengua-3-final-escala.png) · [ponderada reabierta](evidencias/lengua-3-final-lista-ponderada.png).

Las pruebas globales mantienen el diálogo de cambio de actividad de `.20`: conservar protege filas e identidades; adaptar espera respuesta válida con la consigna y selección actuales; cancelar/Escape/cierre no mutan; error conserva y permite reintentar; respuestas obsoletas se descartan. En este grado se verificaron integración, formatos y persistencia; no se atribuye a cada género una nueva ejecución manual de todos los fallos de red ya comprobados.

Archivos principales: `secondary-topics/language/grade-3.ts`, `secondary-language-grade-three-features.ts`, `secondary-language-grade-three-complete.ts`; resolución compartida en `secondary-language-topics.ts`, `secondary-topic-criteria.ts`, `evaluation-task-contract.ts` e `index.ts`; contexto/preparación en `ActivityCreationView.tsx`, `instrumentPreparation.ts` e `instrumentAcademicContext.ts`; catálogo actual y archivos inmutables `.25`/`.26`; fixtures, pruebas, scripts de verificación, cotejo, matriz y continuidad.

Repositorio `thebuuba/Proyecto-educativo-v3`, rama `amplia-instrumentos-secundaria`. Catálogo local `evaluation-2026.27`, Vite 5173, API 3000, Supabase local 54321. Las evidencias de desarrollo indican como base `0cb0a96cc2fb74a876ad137d01c6431de693b9c8` más los cambios de este bloque. Los commits del bloque registran el código revisado y su publicación en la misma rama. **Siguiente: cerrar 4.º, después 5.º y 6.º, sin nueva autorización.**
