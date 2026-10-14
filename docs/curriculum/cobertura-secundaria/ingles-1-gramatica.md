# Gramática evaluativa de Inglés primero

Se conectan31 estructuras del bloque de gramática de PDF136–138: formas verbales, artículos, adjetivos, pronombres, preposiciones, adverbios y conectores. **El grado sigue parcial**; continúan pendientes vocabulario específico, expresiones, estrategias y actividades que combinan modalidades.

El servicio y la alternativa local usan el mismo proveedor. Identificar una estructura produce evidencia de identificación; explicarla añade su función; emplearla valora su uso para comunicar. Una forma gramatical no introduce por sí sola un género nuevo ni exige escribir un texto durante una actividad receptiva. Las formas alternativas se limitan a las nombradas: `will`, `like`, `can’t` o comparativos no incorporan automáticamente las demás formas de su grupo.

Las listas coordinadas conservan los requisitos explícitos: «adverbios de tiempo, frecuencia y modo», «preposiciones de tiempo y lugar» y «conectores de coordinación, tiempo y secuencia» producen sus componentes correspondientes. Se corrigió además la detección de «comparativos», que no debe convertir una tarea gramatical en una comparación de objetos.

## Evidencia

- [Cuatro respuestas previas en .35](evidencias/ingles-1-gramatica-antes.json): la exigencia gramatical no llegaba a los criterios.
- [Fuente y31 correspondencias](ingles-1-gramatica-cotejo.json), con los26 registros originales de gramática y sus continuaciones conservados.
- 750 pruebas específicas de backend: reconocimiento, explicación y producción, cuatro formatos y totales20/17.35; negación, recursos incidentales, listas coordinadas, selección de formas alternativas e imperativos de comparación.
- 496 contratos de servicio/alternativa/editor, con título neutral e incompatible, puntuación pendiente y cálculo exacto.
- [248 propuestas HTTP autenticadas](evidencias/ingles-1-gramatica-servicio.json) en el ámbito real de primero y [cuatro combinaciones posteriores](evidencias/ingles-1-gramatica-combinaciones.json).
- Cuatro recorridos normales de generación, edición manual, guardado y reapertura: pasado simple/rúbrica20; question tags/cotejo17.35; adverbios de frecuencia/escala20; pronombres objeto/lista ponderada17.35. [Captura de campos](evidencias/ingles-1-gramatica-flujo-navegador.json) y [contenido persistido completo](evidencias/ingles-1-gramatica-persistencia.json).
- 82 snapshots preservados:28 de referencia y54 instrumentos completos. Los instrumentos .35 y los de Lengua no se regeneraron.

El cotejo de question tags se recomendó automáticamente sin una frase que nombrara el instrumento. Su criterio exige identificar; no añade explicación ni producción. [Captura](evidencias/ingles-1-gramatica-lista-cotejo.png). También se verificaron [rúbrica](evidencias/ingles-1-gramatica-rubrica.png), [escala](evidencias/ingles-1-gramatica-escala.png) y [ponderada](evidencias/ingles-1-gramatica-lista-ponderada.png).

## Entorno y continuación

Catálogo `evaluation-2026.36`, con `.35` archivado. Base ejecutada `f14393b54ff7034c5a96f5c1e4fa899e3ede28d8` más los cambios del bloque, con estado `dirty` registrado en la evidencia. Rama `amplia-instrumentos-secundaria` del repositorio `thebuuba/Proyecto-educativo-v3`. Frontend5173, API3000 y Supabase54321, todos locales.

Los archivos centrales son `secondary-english-grade-one-grammar.ts`, el compositor `secondary-english-grade-one.ts`, catálogo/archivo de versión y contratos de ambos clientes. No cambia el diseño ni se añaden dependencias o migraciones.

Verificación final: backend 5.209 pruebas en58 archivos; frontend completo 10.177 en101 archivos y624 comprobaciones focalizadas tras el último ajuste. Compilaciones backend/frontend y Cloudflare en modo `--dry-run` aprobadas. La revisión del diff corrigió la confusión entre «comparativos» y acciones como «Comparen», conservando la comparación solicitada; también eliminó una línea vacía sobrante de la documentación anterior. El runtime se reinició con el código revisado y repitió las cuatro combinaciones HTTP y la preservación de los82 snapshots.

Siguiente: vocabulario y expresiones del mismo grado; después estrategias, productos y acciones mixtas. El límite existente de20 criterios requiere verificar la composición de consignas con más requisitos antes de cerrar el grado; este bloque verifica estructuras individuales y las combinaciones documentadas. No se declara cubierto cualquier texto libre ni se extiende este proveedor a otros grados u optativas.
