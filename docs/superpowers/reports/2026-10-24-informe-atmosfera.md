# Informe descriptivo de atmósfera y operadores de extensión

Intervención acotada del 24 de octubre de 2026. Rama `ampliacion-de-instrumentos-2`, base `80460443138e8b89be9babd98acefa859c63810a`. Trabajo del coordinador solo, sin agentes. No se reanuda la ampliación curricular.

## Reproducción y causas

Se congelaron primero la consigna literal, los cinco casos y las siete variantes de extensión en `data/evaluation-instruments/atmosphere-report/cases.json`. `before.json` conserva las propuestas completas de servidor y alternativa local; `http-before.json`, las cuatro respuestas del Worker anterior. El formulario personal nuevo también reprodujo propósito/procedimiento de investigación, resultados y extensión exacta de dos páginas. Sus campos y código cargado se conservaron en evidencia local privada, sin tocar el borrador original.

La descripción exacta nombra troposfera, estratosfera y mesosfera, pero no contiene la palabra «atmósfera». El selector científico buscaba el tema en la descripción no vacía, con el patrón `atmosfera|atmosferic…`. Tierra tenía un reconocimiento adicional de sus componentes; atmósfera no. Por eso el selector devolvía `null`, aunque el título mencionase atmósfera; el motor entraba en la plantilla genérica REPORT de investigación. No se cambia la regla que evita heredar un tema de un título antiguo: ahora los componentes atmosféricos enlazan el tema existente dentro del contexto académico autorizado.

Había dos omisiones adicionales en la adaptación descriptiva compartida: el nombre genérico del tema no conservaba el subconjunto de capas solicitado ni las dimensiones de comparación, y la extracción de recursos reconocía dibujo pero no un esquema rotulado. Se adaptan esos puntos en el mismo proveedor. La temperatura se utiliza como dimensión de comparación, no como una instrucción de medir.

El operador de extensión se perdía **en el extractor compartido**, antes de componer el instrumento: el patrón no admitía «extensión máxima de…» y retrocedía al fragmento «dos páginas», etiquetándolo EXACT. Tampoco cubría correctamente «como máximo, …»; las condiciones aisladas con «hasta» o «exactamente» podían ser descartadas por la guarda de instrucciones. Se conserva ahora el operador, su fragmento original, la exclusión de portada y su expresión visible hasta los campos y el snapshot.

## Comparación con la prueba anterior

La variante anterior se titulaba «Así se organiza la atmósfera» y pedía: «Elaboren un informe descriptivo sobre la atmósfera que explique sus capas y sus diferencias. Incluyan una introducción, un desarrollo y una conclusión. Añadan un dibujo rotulado de las capas en el desarrollo. Revisen la ortografía.»

Sí contenía la palabra reconocida en la descripción. No nombraba las tres capas, no pedía ubicación/temperatura, usaba dibujo en lugar de esquema y no fijaba extensión. Sus aserciones comprobaban contenido genérico —atmósfera, diferencias, dibujo, nombres/rótulos, ortografía y ausencia de investigación— y paridad completa de la rúbrica. Las cuatro lecturas completas y los cuatro formatos de aquella evidencia correspondían a Tierra. Por tanto, no acreditaba la transferencia a capas nombradas ni a límites máximos. Esa carencia explica por qué pasó la prueba anterior.

Se conservan intactos todos los archivos de `earth-report/`; `previous-comparison.json` registra su consigna, salida, límites y huellas SHA-256. El informe anterior incorpora una precisión de alcance, sin sustituir sus resultados originales.

## Recorrido y archivos

1. El editor conserva los dos párrafos HTML; `activityDescriptionText` produce el texto normalizado. Las pruebas comparan sus valores con la consigna congelada.
2. `secondary-science-common.ts` reconoce los componentes de atmósfera dentro de NAT-TU de primero y selecciona REPORT descriptivo. Se conserva la guarda de catálogos históricos y la prioridad de prácticas reales.
3. `science-descriptive-report.ts` reutiliza el tema y el proveedor existentes: solo las capas pedidas, dimensiones explícitas y representación rotulada/ordenada en desarrollo. Nueva traza `science-descriptive-report-v2` para nuevas propuestas.
4. `task-presentation-requirements.ts` conserva MAX/MIN/RANGE/EXACT y reconoce el esquema visual por sus calificadores. «Esquema HTML» sigue sin convertirse en dibujo.
5. `task-requirement-criteria.ts` conserva el máximo en la entrega y aclara que no hay que alcanzar el límite si se satisface el contenido. Las condiciones se vinculan una sola vez a sus criterios.
6. Backend y alternativa local componen los cuatro formatos; conversión a campos, puntuación y alineación del snapshot conservan el texto, las condiciones y las centésimas.

Pruebas nuevas: `atmosphere-report.spec.ts` (backend), `atmosphereReport.spec.ts` (frontend) y banco/script `verify-atmosphere-report.ts`. La prueba anterior de Tierra actualiza únicamente la versión esperada del generador; no cambia su consigna ni sus expectativas pedagógicas.

## Requisito → evidencia visible

| Requisito | Criterio y evidencia |
|---|---|
| Troposfera, estratosfera, mesosfera | Descripción científica: las tres nombradas, características que permiten distinguirlas sin mezclar sus rasgos. |
| Diferencias de ubicación y temperatura | Diferencias: explicita ambas dimensiones y distingue comparación completa, implícita, enumeración incompleta y ausencia. |
| Esquema rotulado, orden correcto y desarrollo | Representación: los tres nombres, disposición/orden científico y ubicación solicitada; sin valorar destreza artística. |
| Introducción, desarrollo de dos párrafos, conclusión | Estructura y claridad: las tres partes y el conteo en desarrollo; sin duplicar la valoración. |
| Ortografía | Escritura, acentuación y mayúsculas que preservan el sentido. |
| Arial 14, interlineado 1,5, cuerpo justificado | Formato: valores y ámbito cuerpo conservados. |
| Título centrado, tamaño 20 y negrita | Misma fila de formato, con ámbito título. |
| Word O PDF | Entrega: alternativa de archivo, no doble entrega. |
| Máximo dos páginas, sin contar portada | Entrega: límite superior; menos páginas no incumplen por extensión si satisfacen contenido. No exige portada. |

Los cuatro instrumentos completos están en [instrumentos-completos.md](../../../data/evaluation-instruments/atmosphere-report/instrumentos-completos.md). El coordinador leyó íntegramente los cuatro: descripción, comparación, esquema, estructura, ortografía, formato y entrega. No se afirma revisión independiente. No aparecen termosfera/exosfera obligatorias, composición química, altitudes numéricas, medición experimental, procedimiento o resultados inventados.

La rúbrica y la escala conservan las progresiones del contenido concreto. El cotejo usa cumplimiento observable. La ponderada conserva la regla de crédito parcial del 50% ya existente. No se inventan niveles para cada condición binaria ni una tolerancia numérica de páginas. La agrupación archivo/extensión mantiene sus limitaciones conocidas: su orden de niveles procede del compositor existente, no demuestra una jerarquía universal entre errores binarios.

## Pruebas y entorno

La fase roja tuvo 10 fallos pertinentes y 6 controles aprobados; tras corregir, las 16 pruebas backend nuevas pasan. Las 23 pruebas focalizadas de frontend/Tierra/atmósfera pasan, incluidas las siete extensiones a través de HTML, contrato, servidor/local, campos y snapshot. Los cinco casos dan paridad completa en ocho pares; además hay aserciones de contenido, no solo igualdad.

| Caso | Resultado focalizado |
|---|---|
| A. Consigna exacta | Cuatro formatos, todos los requisitos y puntajes exactos. |
| B. Sin formato | Conserva contenido, comparación y esquema; no inventa tipografía/archivo. |
| C. Paráfrasis breve | Las tres capas y ubicación/temperatura sin depender del título. |
| D. Tierra exacta anterior | Criterios y descriptores completos idénticos a la salida anterior, incluida su puntuación. |
| E. Práctica de densidad anterior | LAB_PRACTICE y criterios completos idénticos: conserva procedimiento, registro y resultados. |

Las cuatro variantes MAX («extensión máxima de…», «máximo…», «hasta…», «como máximo, …»), MIN, RANGE y EXACT se comprueban en pruebas pequeñas. No se cruzan con asignaturas ni grados adicionales.

El primer Worker heredado falló en Auth por `ENOTFOUND` del pooler y terminó; se comprobó la ausencia del listener antes de iniciar una única instancia del mismo Development. No se cambió DNS, timeout, credencial ni proyecto. Antes de corregir, el formulario personal nuevo cargó `index-g4K3pwks.js` y reprodujo el fallo. Sus assets relevantes y `/sw.js` coincidían byte a byte con el build anterior: no hay evidencia para atribuir la causa a caché. El documento original del usuario se dejó abierto, sin recargarlo ni regenerarlo.

La consulta de la página interna de registros de service workers fue rechazada por la política de navegación del navegador. No se intentó eludirla; queda sin comprobar el registro instalado mediante esa interfaz. Sí se comprueban el archivo servido, su lista de assets, hashes, política NetworkOnly de navegación y la carga de un formulario nuevo. No se borra almacenamiento ni se desregistra ningún worker.

Development verificado: `eolgunypmtgrsyrjzcld`; PostgreSQL con `app_backend_local`, sin bypass RLS; Auth, Storage y variables públicas apuntan al mismo proyecto. Producción no se modifica.

### Comprobaciones automáticas finales

Backend completo: **98 388 pruebas / 251 archivos**, cero fallos. Backend build aprobado. Frontend completo: **95 239 pruebas / 228 archivos**, cero fallos. El build posterior detectó TS2532 en la prueba nueva (la propiedad `expected` del JSON se infiere opcional); se explicitó su presencia conocida en el caso congelado, sin modificar expectativas ni comportamiento. Las 15 pruebas focalizadas afectadas y los builds posteriores aprobaron. Se conserva el primer log fallido. No se repitieron las suites completas por una anotación de tipo sin efecto en ejecución.

`pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`: aprobados. El último terminó expresamente en `--dry-run`, sin despliegue. Lints backend/frontend y de los cuatro archivos compartidos modificados: aprobados. No se vuelve a ejecutar el lint compartido completo: sus ocho errores heredados en cinco archivos ajenos permanecen fuera de alcance. Resultados y tiempos en `verification.json`.

### HTTP final, separado del navegador

Cuenta QA existente de Development, sin crear actividades: cinco interpretaciones y quince propuestas (ocho propuestas de los cinco casos, siete de extensión), todas con HTTP 200; login 201. Cada propuesta de los casos coincide en criterios, descriptores, condiciones y centésimas con la alternativa local. Las siete extensiones conservan su operador en respuesta y texto visible. Respuestas completas en `http-final.json`; esto no sustituye la prueba personal del navegador.

### Build efectivamente servido

Runtime de la prueba final: lanzador 23612, listener 23924 en 8787. Al retomar el cierre esa instancia ya había terminado, sin causa registrada en su stderr. Se verificó la ausencia de procesos/listener y se abrió una única instancia del mismo build: lanzador 48780, listener 61240. La comprobación de entrega volvió a confirmar PostgreSQL/Auth/Storage de Development y los mismos ocho hashes de assets/SW, sin recompilar ni cambiar configuración. Entry `/assets/index-NhSZlGsY.js`; chunk con generador nuevo `instrumentos-tecnicos-DwSE6nB5.js`. Ocho assets relevantes, incluido `/sw.js`, coinciden byte a byte con el build. El formulario personal nuevo carga ese entry. La guarda efectiva confirma Development para PostgreSQL/Auth/Storage/frontend; rol `app_backend_local`, sin bypass. No se alteró la configuración permanente. Las cabeceras de assets conservan la contradicción heredada entre no-cache y max-age/immutable; no se modificó ese problema independiente.

Catálogo congelado `evaluation-2026.173`, generador `science-descriptive-report-v2`. Sin migraciones ni instalaciones de catálogo.

### Navegador personal y persistencia final

Formulario nuevo en la sesión personal de Development y contexto real NAT-TU1; título y descripción exactos antes de identificar la muestra ficticia. Se comprobaron campos y vistas previas completos de rúbrica (43 campos), cotejo (15), escala (36) y ponderada (22). Los cuatro mostraron puntuación pendiente, sin valor por defecto. La rúbrica conserva sus descriptores; la escala utiliza Completo/Suficiente/Parcial/Aún no logrado. Todos conservan los nueve requisitos de la tabla y el máximo, sin capas o investigación adicionales.

Se asignó 17.35, se editó el título del primer criterio y se establecieron pesos 30/20/18.75/12.5/6.25/6.25/6.25. Al identificar la muestra mediante un nombre ficticio y confirmar modalidad, se activó la protección de instrumento desactualizado. Se regeneró únicamente ese formulario nuevo con sus datos definitivos antes de aplicar las ediciones finales; no se regeneró el borrador del usuario. La protección no se eludió ni se modificó.

Se guardó UNA actividad: **FICTICIA PERSONAL ATMÓSFERA 2026-10-24 · Conocemos las capas de la atmósfera**, id `24925148-155e-4616-9129-e0e9596e5eab`, un solo POST 201. Se reabrió mediante el enlace real de Actividades. Los **22 campos** y la tabla resultaron exactamente iguales antes/después; la base confirma creador personal, asignatura/grado, traza v2, MAX y condiciones sin duplicados. Las siete puntuaciones 521/347/325/217/109/108/108 suman 1735 centésimas. Descripción literal, indicadores, edición manual, pesos y condiciones conservados. `persisted-check.json` y `browser.json` distinguen esta prueba del QA HTTP.

Las capturas locales privadas `atmosphere-personal-reopened-science.png` y `atmosphere-personal-reopened-limit.png` muestran la actividad reabierta, su comparación, esquema, formato y máximo. No se añaden imágenes o datos de acceso a Git. El borrador original del usuario se comparó por DOM con la captura inicial: idéntico, sin recarga, regeneración ni guardado.

### Conservación y Git

Comparación por huellas: **104 catálogos anteriores y 1285 snapshots anteriores intactos**. Comparación completa de las 84 actividades anteriores del centro personal: idénticas, incluidos campos del instrumento, estrategias, puntuaciones y fechas. Ahora existen 85 actividades y 1286 snapshots: solo la muestra autorizada y su snapshot nuevos. Las huellas de todos los archivos previos `earth-report/` siguen iguales. `preservation.json` registra el resultado. Sin cambios remotos adicionales, migraciones o instalaciones de catálogos.

Rama `ampliacion-de-instrumentos-2`; avance conservado mediante commit local español al finalizar, cuyo hash se entrega y consta en Git. Sin push ni consulta remota; la divergencia indicada por Git se refiere al upstream ya conocido. Secretos reales de configuración y credenciales QA, respaldos, imágenes y archivos privados quedan excluidos y se comprueban antes del commit. No se modifican integraciones ni se ejecutan despliegues.

## Límites

Esta corrección acredita las cinco consignas y variantes registradas. No resuelve de forma general todo informe, no valida automáticamente documentos Word/PDF ni cierra asignaturas en la matriz. No se amplía currículo, no hay dependencias nuevas, IA nueva, rediseño, push, merge, despliegue o reset.
