# QA visual dirigido — Fase A

Fecha: 27 de septiembre de 2026. Revisor: Codex (inspección visual asistida, no aprobación curricular humana).

Fuentes: Primaria SHA-256 `d4341fd5f387b16333cdeaaa5b8e34b3468722bf17ca6d1a589854b205a9e427`; Secundaria SHA-256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`.

Todos los números siguientes son posiciones PDF, no folios impresos. Los PNG se renderizaron con PDF.js y canvas local a partir de esos archivos, sin modificar los originales. `inspect-pages.mjs` permite repetir la revisión. Los PNG quedan en `tmp/pdfs/`, fuera de Git; los fixtures de texto/geometría sí se versionan. Revisar una página significa revisar su estructura y el punto señalado, no aprobar cada palabra de cada elemento.

## Páginas completas inspeccionadas

Primaria: 43, 58, 195, 206, 207, 208, 219, 220, 221, 222, 318, 319, 320, 321, 322, 347, 348, 349, 362, 363, 364, 403.

Secundaria: 48, 49, 50, 71, 72, 74, 97, 106, 107, 110, 114, 116, 119, 126, 156, 157, 180, 198, 199, 202, 222, 225, 226, 244, 293, 312, 326, 344, 345, 347, 398, 400, 401, 402, 403, 404, 405, 410, 427, 437, 438, 439, 442, 449, 461, 463, 467, 468, 469, 475, 476, 490 y todas las páginas 498–517, inclusive.

## Encabezados y transiciones de los 117 ámbitos

Inspección de la región superior de 500 puntos PDF, usando contactos etiquetados con número de página. Sirve para cotejar nivel, ciclo, grado, área, salida, asignatura y delimitación de filas de competencias; no sustituye una revisión completa del contenido inferior de esas páginas.

Primaria (45 aperturas): 64, 76, 91, 116, 118, 121, 136, 141, 146, 160, 164, 169, 183, 185, 187, 200, 203, 206, 217, 219, 221, 232, 241, 251, 268, 271, 274, 287, 291, 298, 314, 318, 322, 337, 342, 347, 356, 359, 362, 374, 378, 383, 393, 396, 399.

Secundaria (72 aperturas): 69, 76, 82, 96, 105, 113, 134, 140, 146, 158, 163, 169, 181, 185, 189, 199, 203, 207, 217, 220, 222, 229, 231, 233, 244, 249, 254, 264, 269, 276, 293, 296, 300, 312, 316, 319, 330, 332, 334, 341, 344, 347, 359, 362, 365, 374, 377, 380, 392, 397, 401, 413, 417, 421, 427, 432, 437, 445, 450, 456, 462, 467, 472, 482, 485, 488, 491, 494, 496, 499, 506, 511.

Portadas anteriormente confundidas con continuaciones, revisadas en contactos de la misma región: Primaria 108, 260, 278, 304, 326, 350, 388; Secundaria 89, 122, 152, 175, 193, 210, 224, 236, 258, 281, 305, 323, 336, 350, 368, 383, 405, 425. No son indicadores; se resetea el contexto.

## Resoluciones verificadas

| Caso | Evidencia y resolución |
|---|---|
| Primaria 207 | Encabezado repetido de segundo dentro de la secuencia de tercero abierta en 206 y cerrada con indicadores en 208. Metadatos: tercero; texto intacto. |
| Primaria 221–222 | Encabezado dice Educación Física, pero las competencias, lenguajes artísticos y secuencia 219–222 pertenecen a Artística. Metadatos: Artística tercero. |
| Primaria 319–320 | Dice cuarto dentro de quinto, abierto en 318; indicadores 321 y nueva apertura de sexto 322 confirman continuidad. |
| Primaria 348 | Dice quinto entre la apertura de Inglés sexto 347 y sus indicadores 349. |
| Primaria 363 | Dice quinto entre Educación Física sexto 362 y sus indicadores 364. |
| Secundaria 401 | Dice Segundo Ciclo y tercer grado simultáneamente. La secuencia FIHR 397–404 precede a la portada de Segundo Ciclo 405. Es tercero del Primer Ciclo. |
| Filas de competencias, especialmente Secundaria 244 | Los rótulos centrados verticalmente no delimitan celdas. Se usan bordes vectoriales. La competencia comunicativa ya no incluye «Relaciona…» de la fila siguiente. Primaria conserva las tres celdas agrupadas reales, no siete rótulos artificialmente separados. |
| Continuaciones 106–111, 116 y optativas | Se conservan columnas y contexto de tablas sin encabezados; los bordes horizontales separan filas incluso si la distancia entre textos es pequeña. |
| Secundaria 344–345 | «Procedimien- / tos» es un encabezado partido. Se recuperan las tres columnas de Artística quinto. |
| Criterios Primaria 58; Secundaria 156, 225–226, 326, 410 | Solo las celdas bajo el rótulo explícito son criterios. Las tres columnas con grado se atribuyen a su grado; celdas comunes de ciclo quedan sin grado. Se detiene antes de ejes transversales. |
| Secundaria 157, 180, 198 | Son continuaciones de ejes transversales, no mallas de conceptos/procedimientos ni indicadores: exclusión intencionada de esas categorías. |
| Primaria 43, 403; Secundaria 48–50, 126 | Distribución horaria, bibliografía o tabla de niveles lingüísticos: no son encabezados de una malla de grado. |
| Ciencias y Tecnología 498–517 | Tabla de asignación 498; Biología 499–505, Química 506–510 y Física 511–517. Se verificaron las tres columnas y los paneles de indicadores, incluidas sus continuaciones. |
| Subtítulos 504–505, 509–510, 516–517 | Salud, Biología computacional, Bioinformática Medioambiental, Biotecnología, las cuatro aplicaciones de Química y los cuatro apartados de Física son contexto de indicadores. Se guardan en `source.subsection`, sin contarlos como indicadores. |
| Secundaria 449 | El flujo de texto contiene una tabla de inglés anterior al panel de indicadores, invisible en la página renderizada porque queda cubierta. Se excluye esa capa oculta de los elementos. Fixture conserva el flujo original completo; se extraen los 21 indicadores visibles, sin mezclar frases inglesas ocultas. |
| Tablas optativas 427, 461, 490, 498 | La asignación por grado/salida/asignatura procede de esas tablas, no de similitud de nombres. «Tigonometría» en 490 se conserva; la malla 496 escribe «Trigonometría». No se corrige silenciosamente la fuente. |

## Alcance y pendientes de aprobación

Las 56 incidencias del informe anterior y los 15 casos `MALLA_PAGE_EMPTY` se contrastaron contra las regiones relevantes anteriores. Las erratas editoriales permanecen visibles en el registro de anomalías; no son contenido inventado. No quedan huecos estructurales conocidos del listado solicitado. Todos los elementos conservan `PENDING` y ambas versiones `DRAFT`: este QA no equivale a validación pedagógica individual ni autorización de publicación.
