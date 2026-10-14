# Inglés primero y funciones comunicativas

Este bloque conecta funciones comunicativas básicas del primer grado común. **Inglés de primero permanece parcial**: estos resultados no cierran el vocabulario, la gramática, los procedimientos estratégicos ni todas las combinaciones de acciones del currículo.

## Causa y reproducción

El servicio cargaba el catálogo `evaluation-2026.34`, pero carecía de un proveedor evaluativo de Inglés. La extracción curricular sí contenía el ámbito y sus elementos. Conversación y escucha se clasificaban como `OTHER`; una rutina escrita se detectaba como producción escrita, pero las tres recibían filas genéricas de contenido, cohesión, estructura y corrección. El propósito de evaluación solo se interpretaba para Lengua Española.

[Reproducción autenticada anterior](evidencias/ingles-1-antes.json): cuatro entradas, contexto real ING de primero y respuestas completas. Esto demuestra falta de conexión evaluativa, no ausencia de datos.

## Corrección y pertinencia

El proveedor compartido resuelve primero la modalidad y la función solicitada. Distingue comprensión oral, comprensión escrita, interacción oral, presentación oral y producción escrita. Las filas específicas contemplan información personal, invitación/respuesta, rutinas, comparación, instrucciones, gustos, aclaraciones, condiciones atmosféricas, direcciones, experiencias, opiniones y descripción.

La descripción prevalece sobre un título decorativo. Recursos incidentales, asignaturas distintas, otros grados y salidas optativas no activan este proveedor. Una receta escrita no exige cocinar; una comprensión oral no exige redacción ni pronunciación; la información personal puede corresponder a personajes ficticios. Las pausas, reformulaciones y apoyos se admiten conforme al desempeño básico de las mallas.

La revisión añadió regresiones para tres errores: «tiempo libre» no activa meteorología; formular una invitación no obliga a responderla; responderla no obliga a formular otra. La aceptación y el rechazo se conservan como alternativas.

La rúbrica valora la calidad de una producción o interacción. En comprensión receptiva de datos concretos se propone cotejo; una consigna de explicación o justificación conserva rúbrica. El propósito explícito de presencia/ausencia, regularidad o pesos selecciona cotejo, escala o lista ponderada. La elección manual del docente prevalece. La traza identifica la regla aplicada. No se reparten instrumentos por cuotas.

## Fuente e inventario

PDF134–139, páginas impresas133–138, cotejadas visualmente. El inventario confundía ejemplos gramaticales que continuaban en otra página con nuevos temas. La revisión conserva los96 registros conceptuales y los agrupa en13 temas, vocabulario, expresiones y gramática; el encabezado «Temas» se conserva por separado. No modifica la extracción original ni asocia procedimientos por proximidad de columnas.

[Cotejo y límites](ingles-1-cotejo-fuente.json). Las53 entradas de procedimientos contienen también encabezados; su inventario no se considera prueba de implementación. Se conservan la repetición original de «Atraer la atención» y el ejemplo de igualdad situado bajo comparativo/superlativo.

## Verificación

- 129 contratos y regresiones del proveedor, incluyendo cuatro formatos, totales20/17.35, título neutral/incompatible, límites de ámbito y selección.
- 120 contratos de equivalencia entre servicio y alternativa, conversión al editor y cálculo con puntuación pendiente.
- 8 pruebas del selector integrado, con servicio disponible e indisponible, rúbrica provisional automática y elección explícita conservada.
- [120 propuestas y15 interpretaciones HTTP](evidencias/ingles-1-servicio.json), con el ámbito real `7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f`.
- [Revisión posterior y selección automática](evidencias/ingles-1-revision-servicio.json).
- Cuatro recorridos autenticados de creación, generación sin puntos, asignación del total, edición manual, confirmación, guardado y reapertura desde el listado. [Campos capturados](evidencias/ingles-1-funciones-flujo-navegador.json) y [snapshots persistidos completos](evidencias/ingles-1-funciones-persistencia.json).
- Históricos preservados:28 snapshots iniciales y50 instrumentos completos,78 snapshots actuales. Ninguna actividad anterior se regeneró.

Las capturas muestran el formulario y detalle existentes, sin rediseño: [rúbrica](evidencias/ingles-1-funciones-rubrica.png), [cotejo](evidencias/ingles-1-funciones-lista-cotejo.png), [escala](evidencias/ingles-1-funciones-escala.png), [ponderada](evidencias/ingles-1-funciones-lista-ponderada.png).

Suites finales: backend4.459/57 archivos, frontend9.681/100 archivos, inventario9/9. Builds de backend y frontend y `pnpm cloudflare:build` aprobados; Cloudflare terminó en `--dry-run`. Advertencias conocidas: tamaño de algunos chunks y `scrollTo` no implementado en jsdom. `git diff --check` sin errores. [Ejemplos legibles completos](ingles-1-ejemplos-funciones.md).

Archivos principales: `secondary-english-grade-one.ts`, `catalog-current.ts`/`catalog-v34.ts`, motor y servicio de evaluación; adaptador local, reglas del selector y etiquetas de tipos; contratos de backend/frontend/editor; revisión del inventario y verificadores locales. No se añadieron dependencias.

## Entorno y siguiente trabajo

Rama `amplia-instrumentos-secundaria`, repositorio `thebuuba/Proyecto-educativo-v3`. Base ejecutada `1fd7fbda8d4bca269055ac36e8427033bf0e08d9` más los cambios de este bloque, registrada como `dirty` en las evidencias. Catálogo instalado `evaluation-2026.35`; `.34` queda archivado. Frontend5173, API3000 y Supabase local54321. No producción, reset ni cambios de migración.

Antes de pasar a segundo, faltan requisitos gramaticales y léxicos específicos, expresiones y estrategias, géneros/productos del grado y consignas mixtas. La selección actual de una modalidad prioriza escucha y lectura; todavía no constituye cobertura de actividades que combinan comprensión y producción. Es el siguiente trabajo del plan, no un bloqueo externo.
