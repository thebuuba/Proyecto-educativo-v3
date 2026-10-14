# Cierre de añadir y completar criterios (.46)

Alcance: Lengua Española común1.º–6.º e Inglés común1.º; rúbrica, cotejo, escala y ponderada. No se amplió a otra asignatura ni grado.

## Causas confirmadas y reproducción

Base ejecutada `ff13520f14c473561f42880af6323bce67734e65`, rama `amplia-instrumentos-secundaria`, catálogo instalado/cargado `evaluation-2026.45`; árbol inicialmente limpio. Se comprobó por `/health` y recomendaciones HTTP del entorno local autenticado, no mediante una versión supuesta del código.

1. **Agotamiento tratado como propuesta:** el editor solicitaba adicionales, descartaba los objetivos ya usados y, al no quedar candidato, llamaba a `appendInstrumentCriterion(null)`. Así producía una fila vacía y redistribuía puntos. Completar consultaba otra vez el mismo conjunto agotado. Sí existía selección para filas sin nombre; exigir un nombre no era la causa.
2. **Inglés exacto:** tanto generación como adicionales devolvían únicamente rutina, presente simple e inteligibilidad. No había un candidato para las expresiones temporales ni para responder al compañero. La petición contenía la descripción completa. El contexto era Inglés común1.º, la actividad detectada era presentación oral y el servicio cargaba .45. El fallo se reprodujo por HTTP y sobre el borrador local recuperado de cuatro filas, una vacía.
3. **Lengua autorizada:** se encontró el borrador «Descubrimos y promocionamos los atractivos de nuestra comunidad.», con seis criterios y una séptima fila vacía. Pedía crear una guía y presentarla ante los compañeros. El proveedor cubría la guía escrita/visual, pero omitía la comunicación oral posterior. **No se afirma que este borrador sea el caso B exacto**, cuya consigna no fue proporcionada.
4. **Hallazgos de revisión:** la coincidencia exacta por plantilla podía saltarse la exclusión de un objetivo utilizado en otra fila; una respuesta tardía podía pasar la comprobación si solo cambiaba el contexto académico, porque la función conservaba las props anteriores. Además, completar no informaba siempre del éxito y podía conservar el catálogo antiguo al incorporar un candidato nuevo. Se añadieron reproducciones fallidas específicas y se corrigieron esas vías.

No se detectaron criterios genéricos en los768 contratos de Lengua auditados. La ausencia de extras reservados no demuestra por sí sola cobertura semántica completa: se conserva la revisión curricular previa y se documenta el conjunto realmente disponible, sin fabricar filas para alcanzar una cantidad.

## Recorrido y correcciones

Acción del editor → `includeAdditionalCandidates:true`, descripción extraída del editor y contexto autorizado → proveedor compartido → deduplicación por objetivo estable/texto → candidato compatible → campos del formato → borrador actualizado → guardado y snapshot. La alternativa usa los mismos proveedores;403/otros4xx se muestran sin ocultarlos. Un503 permite la alternativa y comunica su procedencia.

- Añadir automático incorpora un candidato no utilizado; al agotarse muestra un aviso y conserva las filas. «Añadir criterio manual» es una opción explícita, con el mismo límite20 y confirmación previa de redistribución cuando hay puntos/pesos manuales.
- Completar una fila vacía utiliza un objetivo disponible. En una parcial, respeta su intención y rellena únicamente vacíos; conserva identidad, textos existentes, puntos y otras filas. En una completa informa sin consultar ni reescribir. La ambigüedad o falta de candidato conserva el contenido y explica la edición manual necesaria.
- Se excluyen objetivos utilizados aunque el docente los renombre. La comprobación de coincidencia exacta también pasa por esa exclusión.
- Firma de petición con campos, identidad del borrador, formato, puntuación y contexto **actual**; respuestas obsoletas y errores de una petición anterior no se aplican al borrador nuevo.
- Se registra el catálogo que aporta el candidato, manteniendo las identidades existentes. La alternativa queda identificada como `editable-fallback-v1`.

## Proveedores y evidencias nuevas

**Inglés1:** `ing-1-temporal-expressions` relaciona las acciones con las expresiones temporales pedidas; `ing-1-question-response` evalúa la comprensión y respuesta pertinente a la pregunta posterior a una presentación oral. Ambos tienen cinco desempeños autorados y peso relativo3. El criterio de rutina precisa las **cinco actividades** cuando ese número figura en la consigna. No se exige otra cantidad ni otra actuación. Se excluyen recursos y requisitos expresamente negados.

**Guía turística de Lengua1:** `guide-oral` reutiliza la progresión autorada del proveedor oral, contextualizada a la información de los lugares y con apoyos de acceso; peso relativo4. Aporta el desempeño oral solicitado, sin volver a puntuar el contenido escrito. Se activa por la acción de presentar/exponer ante los compañeros/oralmente, sin condiciones sobre el título exacto.

Las nuevas generaciones incluyen las evidencias pedidas: cinco filas para la rutina y siete para la guía con presentación. Un borrador anterior conserva sus tres/seis objetivos y puede incorporar los omitidos mediante añadir/completar. No se reserva artificialmente un requisito para obligar al docente a añadirlo.

**Lengua2–6:** se revisaron los proveedores existentes; la mayoría ofrece el conjunto pertinente desde la generación inicial. Se probó también el candidato reservado `novel-analysis-limits` de quinto para un análisis e interpretación de fragmento de novela. No se amplió una familia sin evidencia diferenciada que lo justificara.

[Matriz de40 familias](criterios-matriz-proveedores.md), [registros por consigna/formato](evidencias/criterios-matriz-proveedores.json), [instrumentos completos antes/después](criterios-ejemplos-completos.md).

## Verificación

- TDD: fallaron inicialmente los cuatro formatos de rutina, el agotamiento del editor, los cuatro formatos de guía, la procedencia del catálogo, la exclusión de una fila parcialmente duplicada y el cambio de contexto durante una petición. Se conservaron los logs locales fuera de Git.
- Matriz automática:768 consignas de los contratos existentes,40 familias y cuatro formatos; tres estados de puntuación (pendiente/20/17.35), **9.216 combinaciones** dentro de12 pruebas de matriz. Compara contenido de servicio y alternativa, fila vacía, parcial, renombrado, agotamiento, puntos/identidades y otras filas. Incluye el proveedor adicional de novela5.
- Regresiones específicas: rutina exacta, título neutral, descripción de opinión escrita, requisitos negados; completar en los cuatro formatos;403,503; respuesta tardía tras editar, eliminar otra fila y cambiar contexto; fila completa sin petición; cancelación y confirmación de puntos manuales; límites y objetivos semejantes diferenciados.
- Backend:6.380 pruebas/64 archivos. Frontend del bloque:151 pruebas/7 archivos; un recorrido previo de novela/escala agotó su timeout durante una ejecución conjunta. La repetición del archivo del editor pasó sus58 pruebas en61,60s. Se conservan ambos resultados locales, sin presentar la ejecución fallida como aprobada.
- HTTP real local:336 solicitudes de generación/adicionales para40 temas de Lengua y las dos consignas;52 solicitudes finales con cuatro formatos,20/17.35, proveedor adicional de novela y exclusiones explícitas. [Primera ejecución](evidencias/criterios-pools-http.json), [verificación final](evidencias/criterios-verificacion-final-http.json). Catálogo cargado `evaluation-2026.46`, sobre baseff13520 más los cambios de este bloque.
- Builds backend/frontend y Cloudflare **dry-run**; `git diff --check`. Sin despliegue.

## Navegador, edición, guardado y reapertura

Sesión local autenticada ficticia, frontend5173 → API3000 → Supabase local54321. Se recuperaron los borradores reales, se usaron botones/menús de la interfaz y se guardó mediante «Confirmar y guardar».

| Actividad | Recorrido | Total | Actividad persistida | Snapshot |
|---|---|---:|---|---|
| Rutina exacta Inglés1 | Añadir expresiones temporales, completar fila recuperada con respuesta, completar un descriptor parcial, comprobar agotamiento; conservar ajuste manual en otra fila |20|`9c485107-5a8e-4c0c-ae40-d6256df4a39b`|`4ba0e7b7-d735-45b8-8530-77ebb0f4f2e6`|
| Guía Lengua1 autorizada | Añadir comunicación oral, liberar su objetivo y completar la fila recuperada; puntos de todas las filas idénticos antes/después de completar; conservar ajuste manual |17.35|`e8c703f1-5b2d-4255-a99d-57bb429732d2`|`9331143b-00b8-41c4-8020-d1e3645520a0`|

Se cerraron y reabrieron ambos detalles desde el listado. Se contrastaron textos visibles, IDs/objetivos, puntos de campos y snapshot por HTTP filtrado al contexto real. Ambos snapshots son .46. [Evidencia de navegador y persistencia](evidencias/criterios-flujo-navegador.json).

**Límite de esta comprobación:** los dos recorridos persistidos nuevos son rúbricas de primero; los otros formatos y grados se verificaron automáticamente y por HTTP, junto con la conservación de sus recorridos históricos. No se atribuyen ocho recorridos nuevos de navegador ni una reproducción exacta del caso B. La edición manual de los borradores anteriores se conserva: no se regenera su contenido para reemplazarlo por los ejemplos nuevos.

Históricos:28 snapshots de referencia y78 instrumentos completos previos intactos;108 snapshots actuales contando los dos nuevos. [Comprobación](evidencias/lengua-historicos-evaluation-2026.46.json).

## Archivos y estado curricular/Git

Implementación: `packages/shared/src/secondary-english-grade-one.ts`, `secondary-guide-grade-one.ts`; `ActivityCreationView.tsx`, `InstrumentPreview.tsx`, `instrumentCriterionAddition.ts`; `catalog-current.ts` y nuevo archivo inmutable `catalog-v45.ts`. Pruebas: `AdditionalCriterionFlow.spec.tsx`, `criterionPoolRegression.spec.ts`, `criterionProviderMatrix.spec.ts`, `instrumentCriterionCompletion.spec.ts`, `ActivityEditorWorkspace.spec.tsx`. Se añaden cuatro scripts de auditoría/verificación, matriz, ejemplos, evidencias e informe; se actualizan avance, continuación y cierres.

Se conservaron los cierres y evidencias anteriores de Lengua1–6 e Inglés1; se registra esta regresión y su corrección .46. No se cambió el estado de otras asignaturas/optativas ni se marcó cobertura genérica como completa. No hay ampliación curricular autorizada en este bloque. Queda como limitación la identificación exacta del caso B si posteriormente se facilita su consigna; el flujo compartido y el borrador autorizado sí están verificados.

Rama de entrega: `amplia-instrumentos-secundaria`; remoto `https://github.com/thebuuba/Proyecto-educativo-v3.git`. El hash de entrega, resultado del push normal y árbol final se confirman tras publicar. No main, force push, producción, reset, cambios de esquema, migraciones viejas, snapshots históricos ni secretos.
