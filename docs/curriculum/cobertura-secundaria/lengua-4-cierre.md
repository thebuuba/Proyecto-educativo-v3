> Actualización del flujo de criterios (.46): el cierre previo conservó una regresión de añadir/completar no detectada en sus ejemplos. Se corrigieron agotamiento, recuperación, intención/identidades, respuestas obsoletas y procedencia; se verificaron los proveedores de las40 familias de Lengua y los cuatro formatos. [Informe y límites](criterios-adicionales-informe.md), [matriz](criterios-matriz-proveedores.md). Las evidencias anteriores permanecen intactas; no se amplía el ámbito curricular.

# Lengua Española común: familias verificadas de 4.º

Siete temas cotejados visualmente en PDF96–104: 68 registros de subtemas equivalentes a 67 conceptos lógicos, y 92 registros de procedimientos que componen 26 bloques de modalidad. El motor conecta las familias definidas y verificadas; no garantiza interpretar cualquier descripción. 5.º y 6.º continúan pendientes.

## Causa y corrección

La reproducción inicial produjo **28 fallos**, siete géneros en cuatro formatos: el inventario existía, pero no había proveedores de 4.º conectados. Se añadieron perfiles de crónica, instructivo, informe de investigación, artículo de opinión, discurso de agradecimiento, novela y soneto. Comparten la composición por acción y requisitos explícitos y los adaptadores existentes, sin rediseñar el creador.

El nombre «informe de investigación» ya no convierte una consigna de análisis en la acción investigar: se reconoce el verbo solicitado. Tampoco añade una fila de fuentes por la sola presencia del sustantivo cuando se trabaja con datos proporcionados; esa última corrección tiene cuatro regresiones, cuatro respuestas HTTP adicionales y una nueva ponderada guardada/reabierta. La ponderada intermedia se conserva, sin modificarla. Presentar oralmente un discurso o informe propio usa evidencia de producción; presentar su análisis conserva la evidencia analítica. La novela se evalúa a partir del pasaje disponible y no obliga a escribir una novela ni a conocer un desenlace ausente. «Únicamente el narrador» limita el contenido solicitado.

Las filas explícitas cubren gramática, argumentos/contraargumentos, citas, referencias, datos, apoyos gráficos, métrica y recursos literarios pertinentes a cada tabla. Los procedimientos agregan paráfrasis, predicción, vocabulario/diccionario, planificación, fuentes, revisión y publicación cuando se solicitan. El informe relaciona problema, método y resultados dados: no exige recolectar datos nuevos; marco teórico, conclusión y recomendaciones se activan por petición. Instructivo conserva ilustración/dibujo y soporte físico/digital como alternativas o exigencias conjuntas.

Durante el navegador se detectó que «pasos ordenados» añadía conectores de orden aunque solo se pedían de finalidad. Se reprodujo en cuatro pruebas y se delimitó la coincidencia. La revisión posterior añadió doce pruebas rojas sobre presentación de un producto propio y entonación sin gestos obligatorios. El catálogo intermedio .28 y la rúbrica guardada con él quedan preservados; la comprobación final utiliza .29.

## Fuente y alcance

| Tema | Familias definidas |
|---|---|
| Crónica | Comprensión/análisis, escritura/planificación, narración oral, comparación, informe, investigación |
| Instructivo | Comprensión/análisis, elaboración/planificación, producción oral, comparación, comentario, investigación |
| Informe de investigación | Comprensión/análisis y representación, escritura/planificación, producción oral, comparación, presentación del análisis, investigación |
| Artículo de opinión | Comprensión/análisis, escritura/planificación, comparación, debate, investigación |
| Discurso de agradecimiento | Comprensión/análisis, escritura/planificación, producción oral, comparación, comentario, investigación |
| Novela | Comprensión/análisis de pasajes, comparación, informe/comentario, presentación del análisis, debate |
| Soneto | Comprensión/análisis, escritura, recitación, comparación, informe |

Todas usan rúbrica, cotejo, escala y ponderada. [Cotejo de fuente, asociaciones y contratos](lengua-4-cotejo-fuente.json). La comprensión/producción oral del instructivo en PDF97 y la comprensión oral del agradecimiento en PDF100 empiezan antes del rótulo de la columna izquierda: no se asignan al género anterior. «Función y estructura argumentativa» es un concepto partido en dos registros de extracción, identificado expresamente. La novela prioriza comprensión oral/escrita; la nota del artículo de opinión usa oralidad para preparar la escritura. Las optativas permanecen separadas.

## Verificación

- **143 consignas**: siete básicas, 68 registros conceptuales y 68 de procedimientos/familias/requisitos. Tras la reproducción inicial, la batería ampliada tuvo 28 fallos; cuatro correspondían a una aserción léxica demasiado literal, corregida conservando la exigencia semántica. Se corrigieron los requisitos restantes, además de las cuatro pruebas de «ordenados» y doce de producción/entonación.
- Backend completo: **3.147 pruebas**. Frontend completo: **6.131**, seguido de **1.736** comprobaciones de los cambios finales: 1.716 cruces de 4.º (143 × cuatro formatos × 15/20/17,35) y 20 recorridos del creador de 2.º–4.º. Se compara contenido servicio/alternativa, títulos neutros/incompatibles y puntuación antes/después del total pendiente.
- **528 solicitudes autenticadas iniciales (.28)** y **272 con .29**, con respuestas completas, contexto académico real y comprobación de acción/contenido. Tras el último ajuste de fuentes se verifican **13 solicitudes adicionales**: ocho de interpretación/recomendación automática, una de técnica de investigación y cuatro de informe con datos proporcionados. La selección manual conserva prioridad; no se aplican cuotas entre formatos.
- Navegador local autenticado: rúbrica de novela (20), cotejo de instructivo (17,35), escala de soneto (15) e informe de investigación ponderado (17,35). Se comprueban sugerencia automática, puntaje inicialmente vacío, edición manual, resumen, guardado y reapertura desde el listado. Los textos capturados se cotejan con los campos y snapshot persistidos.
- **60 snapshots conservados**: 28 de referencia y 32 instrumentos completos capturados, seis de este grado. La prueba HTTP no se presenta como guardado ni los callbacks del editor como persistencia real.
- Builds de backend/frontend y Cloudflare dry-run, pruebas del inventario y diff aprobados. Sin producción, reinicio de base, IA, dependencias nuevas ni cambios de instrumentos históricos.

El diálogo de cambio de actividad y sus regresiones globales siguen vigentes: conservar mantiene identidades/textos/puntos y bloquea reemplazo automático; adaptar solo aplica una respuesta válida y vigente; cancelar/Escape/cierre no mutan; fallo conserva y permite reintentar. No se atribuye a cada género una repetición manual de todos los errores de red ya probados.

## Evidencia y archivos

- [Servicio inicial](evidencias/lengua-4-cierre-servicio.json) · [instrumentos completos .28](evidencias/lengua-4-cierre-instrumentos.json).
- [Servicio final](evidencias/lengua-4-final-servicio.json) · [instrumentos completos .29](evidencias/lengua-4-final-instrumentos.json).
- [Recomendación automática](evidencias/lengua-4-seleccion-servicio.json).
- [Cuatro recorridos finales](evidencias/lengua-4-final-flujo-navegador.json) · [persistencia real](evidencias/lengua-4-final-persistencia.json).
- [Rúbrica y ponderada intermedias preservadas](evidencias/lengua-4-cierre-persistencia.json) · [históricos conservados](evidencias/lengua-historicos-evaluation-2026.29.json).
- [Cotejo reabierto](evidencias/lengua-4-final-lista-cotejo.png) · [escala reabierta](evidencias/lengua-4-final-escala.png).

Archivos principales: `secondary-topics/language/grade-4.ts`, `secondary-language-grade-four-features.ts`, `secondary-language-grade-four-complete.ts`; composición compartida en `secondary-language-grade-three-complete.ts`; detección en `secondary-language-topics.ts`, conexión en `secondary-topic-criteria.ts` e `index.ts`; catálogo actual y archivos inmutables .27/.28; contratos, pruebas backend/frontend/editor, scripts, fuente, matriz y documentos de continuidad.

Rama `amplia-instrumentos-secundaria`, repositorio `thebuuba/Proyecto-educativo-v3`. Las evidencias de desarrollo ejecutan como base `4175eb99e17141dd69dfa5eb33be2990f409d457` más este bloque. Catálogo local `evaluation-2026.29`, frontend5173/API3000/Supabase54321. **Siguiente: 5.º (PDF105–112), después 6.º**, sin nueva autorización. Este cierre de grado no concluye el encargo completo.
