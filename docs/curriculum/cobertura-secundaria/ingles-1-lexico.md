# Léxico y expresiones de Inglés primero

Se conectan39 familias de vocabulario y14 funciones expresivas del currículo común de primero. **El grado continúa parcial**: faltan estrategias, productos/géneros, acciones mixtas y composición de consignas extensas.

## Causa y alcance

La versión .36 tenía funciones comunicativas y gramática, pero no convertía requisitos léxicos explícitos en criterios específicos. Cuatro propuestas autenticadas sobre alimentos y agradecimiento reprodujeron la falta antes de modificar el proveedor: [evidencia anterior](evidencias/ingles-1-lexico-antes.json).

El proveedor compartido incorpora las familias solicitadas de vocabulario y las expresiones comunicativas. Reconocerlas en lectura o escucha no exige producir un texto ni explicar su función salvo que se pida; usarlas evalúa su contribución al significado. Los descriptores distinguen uso pertinente, imprecisión aislada, evidencia parcial, cambio del significado y ausencia de evidencia. Los ejemplos de palabras del currículo no se vuelven una lista obligatoria. Tampoco se exige usar varias alternativas simultáneamente.

Las familias léxicas se activan mediante requisitos que nombran vocabulario, léxico, palabras o términos de la categoría; las expresiones admiten su función comunicativa nombrada. No se promete inferir cualquier palabra aislada. La descripción prevalece sobre títulos decorativos; los recursos incidentales y requisitos negados se excluyen. El proveedor se limita a Inglés común de primero.

[Cotejo de fuente](ingles-1-lexico-cotejo.json):54 registros originales, incluidos39 de vocabulario y15 de expresiones; la fuente repite «atraer la atención», que corresponde a una única familia evaluativa. Se preserva la clasificación literal de la fuente sin convertirla en una exigencia científica.

## Hallazgo en la lista ponderada

El recorrido real60/40 mostró que el editor conservaba los puntos anteriores8.68/8.67, aunque el snapshot calculaba10.41/6.94 sobre17.35. `InstrumentPreview.updateField` notificaba el porcentaje sin recalcular los campos de puntos. La corrección llama al cálculo compartido al editar pesos y conserva el puntaje pendiente y los textos manuales. Una prueba de componente reprodujo el fallo y ahora verifica ambos estados.

Se conserva el ejemplo previo `5db16629-0558-495a-b385-a411c69efbc1` como reproducción histórica expresamente marcada, no como cierre aprobado. El ejemplo corregido `80b19034-7238-448e-820f-9813fbd68b45` coincide entre pantalla, campos persistidos y snapshot. [Captura final](evidencias/ingles-1-lexico-lista-ponderada.png).

## Verificación

- Backend completo:5.635 pruebas,59 archivos;426 casos léxicos de los cuatro formatos y totales20/17.35, con reconocimiento y uso, negación y aislamiento de contexto.
- Frontend completo:10.603 pruebas,103 archivos;424 contratos servicio/alternativa/editor y dos pruebas del recálculo de pesos. También77 pruebas focalizadas del editor/cálculo tras reproducir el fallo.
- [424 propuestas HTTP .37](evidencias/ingles-1-lexico-servicio.json) y [24 propuestas revisadas .38](evidencias/ingles-1-lexico-revision.json), con contexto académico real.
- Cuatro recorridos finales .38: rúbrica de alimentos20; cotejo de escucha/transporte17.35; escala de frecuencia/agradecimiento20; ponderada de transporte/orientación17.35, editada60/40. Generación, edición, guardado y reapertura autenticados. [Campos capturados](evidencias/ingles-1-lexico-flujo-navegador.json), [instrumentos persistidos](evidencias/ingles-1-lexico-persistencia.json) y [ejemplos completos legibles](ingles-1-lexico-ejemplos.md).
- Rúbrica por calidad del uso; cotejo para identificación discreta; escala por registro explícito de frecuencia; ponderada por pesos de componentes. Se comprueba la recomendación automática, sin cuotas ni cambio de la elección manual.
- 90 snapshots preservados:28 de referencia y62 instrumentos completos. Incluye las cuatro pruebas iniciales .37 y las cuatro revisadas .38; el fallo histórico de pesos está señalado.

Catálogo actual `evaluation-2026.38`; `.36` y `.37` archivados sin modificar releases instalados. Rama `amplia-instrumentos-secundaria`, repositorio `thebuuba/Proyecto-educativo-v3`, base ejecutada `85f6149` más cambios registrados como `dirty`. Frontend5173, API3000 y Supabase local54321. Compilaciones backend/frontend y Cloudflare `--dry-run` verificadas antes del commit; ninguna publicación a producción.

## Matriz y continuación

Vocabulario y expresiones figuran como familias explícitas implementadas, con pruebas HTTP para todas las familias y recorridos UI representativos de los cuatro formatos. No se afirma haber recorrido individualmente las53 familias en el navegador. El ámbito conserva `PARTIAL_FUNCTIONS_GRAMMAR_LEXICON` y sus pendientes. Continuar procedimientos estratégicos, géneros/productos, modalidades mixtas y límite20; después revisar el cierre completo de primero antes de segundo.
