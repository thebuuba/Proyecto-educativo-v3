# Acciones mixtas de Inglés primero

El motor aplica ahora la modalidad y los requisitos de cada acción independiente antes de componer el instrumento. **El grado sigue parcial**: queda la composición extensa/límite20 y la revisión final de cobertura y pertinencia.

## Fallo reproducido

En .40, leer un correo y redactar una carta convertía también la carta en comprensión escrita. Escuchar y después escribir mantenía la modalidad de escucha; reconocer y usar imperativos acababa en una sola fila de reconocimiento. Una comparación cultural podía suprimir el pronóstico pedido después. [Ocho respuestas HTTP anteriores](evidencias/ingles-1-composicion-antes.json) y71 regresiones inicialmente fallidas documentan la causa: una modalidad global se aplicaba a toda la consigna.

La corrección separa acciones explícitas, con sus conectores y límites de oración, antes de normalizar el texto. Cada acción resuelve sus funciones, formas, léxico, estrategias y géneros. El tipo principal corresponde al último producto explícito; si solo hay recepciones, a la última. La recomendación automática es cotejo para recepciones discretas y rúbrica para calidad de producción, salvo intención explícita de frecuencia/ponderación o selección manual. Un infinitivo de propósito no se convierte en otra actividad. La presentación posterior puede recuperar el género mencionado por un pronombre explícito sin heredar el verbo de escritura.

La composición conserva reconocimientos y usos diferentes, asigna identificadores distintos y elimina únicamente filas idénticas. Se acepta la denominación oficial «Lenguas extranjeras: Inglés» cuando no llega código; un código explícito de otra asignatura impide activar el proveedor.

La revisión en navegador encontró y corrigió dos excesos: pedir solo destinatario añadía propósito; pedir actividades del horario añadía momento. También se eliminó una fila general de comprensión que duplicaba la evidencia del criterio funcional. Los contratos anteriores de instrucciones/tiempo conservan sus comprobaciones de contenido y dejan de exigir esa fila redundante. No se modifican instrumentos históricos.

## Evidencia final

- 85 pruebas específicas: ocho consignas × cinco selecciones (automática y cuatro manuales) ×20/17.35, más cinco controles de alcance, duplicados, pronombre, propósito y alias.
- 64 contratos frontend: igualdad servicio/alternativa, título neutral o incompatible, puntaje pendiente/exacto y texto manual conservado.
- Suite backend6.290/62 archivos; frontend11.219/106; builds backend/frontend y Cloudflare dry-run aprobados; inventario9.
- [80 propuestas y ocho interpretaciones autenticadas](evidencias/ingles-1-composicion-servicio.json) con contexto ING1 real, repetidas después de la revisión.
- Cuatro recorridos locales: leer/escribir con rúbrica20; leer/escuchar con cotejo17.35; lectura/interacción con escala de frecuencia20; reconocer/usar con ponderada17.35. Generación, edición, guardado y reapertura. [Campos](evidencias/ingles-1-composicion-flujo-navegador.json), [persistencia](evidencias/ingles-1-composicion-persistencia.json), [instrumentos completos](ingles-1-composicion-ejemplos.md).
- 102 snapshots comprobados:28 de referencia y74 instrumentos completos. Los guardados anteriores conservan sus textos, campos y puntuación.

Catálogo `evaluation-2026.41`; .40 congelado. Base ejecutada `569b660` más cambios del bloque. Rama `amplia-instrumentos-secundaria`, repositorio `thebuuba/Proyecto-educativo-v3`; API3000/frontend5173/Supabase54321 locales. Sin producción, reset, IA ni rediseño. Durante los reinicios de desarrollo se volvió a completar el formulario aún no guardado; la evidencia de reapertura corresponde a actividades guardadas, no garantiza restauración tras reiniciar Vite.

El análisis determinista cubre los patrones explícitos ensayados; no interpreta cualquier elipsis del lenguaje. Próximo: reproducir el truncamiento de consignas con más de20 criterios y la diferencia con la alternativa local, resolverlo y cerrar la revisión del grado antes de segundo.
