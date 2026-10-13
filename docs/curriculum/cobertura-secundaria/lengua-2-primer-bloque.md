# Lengua Española 2.º — primer bloque contextual

## Alcance y fuente

Se incorporan cinco módulos específicos: guía turística, artículo expositivo, informe de lectura, cuento de amor y amistad y décima espinela. La noticia conserva su módulo anterior; su reauditoría no se da por terminada.

Fuente: PDF aportado por el usuario, SHA256 registrado en `revision.json`. Se revisaron visualmente las tablas PDF 76–81 (impresas 75–80). Las asociaciones de los 23 procedimientos se registran mediante sus identificadores originales. No se enlazan competencias o indicadores por proximidad de columnas. La continuación de producción escrita de noticia que aparece en PDF 74 permanece como anomalía de extracción pendiente; no se reasigna silenciosamente a 2.º.

| Tema | PDF / impresa | Adaptación revisada |
|---|---|---|
| Guía turística | 77 / 76 | Propósito, lugares, organización y orientación espacial; información gráfica sólo cuando se pide. El análisis de estructura se limita a esa evidencia y su sustento. |
| Artículo expositivo | 77–78 / 76–77 | Problema-solución, ideas, explicación causal y evidencias. Comparar, analizar y escribir producen observaciones diferentes. |
| Informe de lectura | 78–79 / 77–78 | Resumen fiel, análisis sustentado, estructura y cohesión. No se exige crear un cuento por utilizarlo como texto leído. |
| Cuento de amor y amistad | 79–80 / 78–79 | Conflicto, personajes, ambiente y recursos expresivos. La narración oral valora secuencia, referencias narrativas y claridad expresiva; no impone un análisis literario escrito. |
| Décima espinela | 80–81 / 79–80 | Tema, diez versos octosílabos, rima y recursos expresivos cuando corresponden. Recitar valora secuencia del texto elegido, ritmo, pausas y expresión; no exige composición, análisis métrico ni memorización. No se añadió un esquema de rima ausente del texto de referencia. |

Los criterios y descriptores son adaptaciones evaluativas editables de Aula Base, no citas ni instrumentos aprobados por MINERD. Los apoyos de acceso acordados son válidos; no se califica personalidad, vivencias privadas, contacto visual ni dominio de equipamiento.

## Arquitectura y preservación

- Datos por tema en `packages/shared/src/secondary-topics/language/grade-2.ts`; compositor compartido por backend y alternativa local. Sin IA durante la ejecución ni dependencias nuevas.
- Los siete módulos anteriores de Lengua se separaron del motor sin cambiar sus criterios. La duplicación anterior con la alternativa frontend y la calidad de sus descriptores siguen pendientes de la reauditoría de 1.º/noticia de 2.º.
- Nuevo release `evaluation-2026.8`; el archivo del release `evaluation-2026.7` no se modificó. La validación acepta snapshots de ambas versiones.
- La asignación compartida distribuye centésimas exactas. Las selecciones explícitas del docente preceden a la inferencia. Los recursos no se convierten en productos o requisitos por coincidencia de palabras.
- El creador mantiene sus cinco tarjetas, instrumento editable, progreso y resumen. No se agregaron campos, pasos, estilos de identidad o avisos técnicos permanentes.
- Catálogo instalado únicamente en Supabase local confirmado, puerto 54332. Dos reinstalaciones devuelven `UNCHANGED`; los fingerprints de todos los releases anteriores permanecen iguales. No se aplicó migración ni se modificó la base remota.

## Verificación realizada

- Backend completo: 34 archivos, 446 pruebas aprobadas. Incluye 52 pruebas del bloque, 86 pruebas anteriores del motor y diez casos de validación de tipos en el contrato HTTP. La revisión detectó y corrigió el rechazo de «Análisis» y «Comparación» seleccionados explícitamente.
- Frontend completo: 78 archivos, 503 pruebas aprobadas. Incluye 20 casos de alternativa editable (cinco temas × cuatro formatos) y cinco casos del creador que cambian formatos, asignan 17.35 y confirman el resumen. La descripción está sustituida por un textarea en estas pruebas de componentes.
- Inventario: cinco pruebas aprobadas; regeneración conserva las asociaciones y rechaza referencias de otro ámbito o fuente.
- Compilaciones backend, frontend y `pnpm cloudflare:build` aprobadas. Cloudflare ejecuta `--dry-run`; no se publicó un Worker.
- Revisión directa de ejemplos: se corrigieron recitación que exigía análisis métrico, narración oral confundida con análisis, informe breve no detectado y recursos que imponían gráficos. Pruebas de regresión documentan las entradas concretas.
- Navegador: fixture temporal con el componente real y editor de descripción real, alternativa local tras fallo simulado del servicio, sin cuenta ni datos reales. Décima: puntos inicialmente vacíos, criterios orales, cuatro formatos, total 17.35, resumen y confirmación ficticia observados. La fixture se elimina del árbol antes del commit.

![Resumen observado de la actividad ficticia](evidencias/lengua-2-recitación-resumen.png)

## Pendientes y límites

Este bloque no certifica toda Lengua de 2.º ni toda secundaria. Falta persistencia autenticada real del nuevo catálogo y sus snapshots en el entorno local; el callback simulado del navegador no demuestra escritura en base de datos. Los cinco temas se probaron en componentes; sólo la décima se recorrió directamente en navegador en este bloque.

Reauditar Lengua 1.º y La noticia de 2.º; revisar preservación manual y ejemplos adicionales antes de cerrar el bloque A. Continuar luego con 3.º–6.º y el resto de la matriz. No activar optativas en ámbitos equivocados. Quedan sin cubrir los diseños específicos técnico-profesionales y de menciones artísticas que requieren fuentes adicionales.

Incidencia visual anterior observada en la escala: los valores relativos pueden mostrar decimales largos (por ejemplo 2.6666666666666665). No afecta la suma en centésimas; corregir su presentación sin alterar los valores guardados ni el diseño acordado.
