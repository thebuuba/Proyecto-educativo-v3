# Informe final técnico — Corrección y cierre de Fase A

Fecha de corte: 27 de septiembre de 2026. Regeneración canónica: **2026-09-27T22:03:53.781Z**.

**Resultado técnico:** 45/45 ámbitos de Primaria y 72/72 de Secundaria; 0 errores críticos, 0 ámbitos esperados ausentes y 0 incidencias de extracción pendientes en ambos niveles. Se corrigieron los huecos y las mezclas conocidas, se regeneraron los dos documentos completos y se probaron importación, idempotencia y consultas en PostgreSQL local.

**No es una publicación curricular:** las dos versiones siguen **DRAFT**, los **17.031 elementos siguen PENDING** para revisión/aprobación. No se inició Fase B, ni recomendador, IA, instrumentos, UI, cambios en Actividades o GradingBook. El catálogo nuevo no está conectado al runtime de esos módulos.

## A. Rama y estado de trabajo

Rama exacta: `instrumentos-evaluacion`. No se cambió a main ni se mezclaron ramas.

Estado previo al commit de cierre:

```text
 M .gitignore
 M apps/frontend/src/types/database.types.ts
 M packages/database/package.json
 M packages/database/prisma/schema.prisma
?? .gitattributes
?? data/
?? docs/curriculum/
?? packages/database/src/import-curriculum.ts
?? scripts/curriculum/
?? supabase/migrations/20260927202613_curricular_catalog.sql
```

Los renders reproducibles de QA se conservan localmente en `tmp/pdfs/` y están ignorados; no se borraron ni copiaron los PDF fuente al repositorio. El estado anterior agrupa directorios nuevos; el inventario exacto está al final de este informe.

## B. Commit y origin

Último commit existente al redactar el informe: `4f1adeb7925f4018f6224a7e013a577caaa7119d` — **Consolida pestañas de materias y horario en Cursos**. Es el commit anterior, no el cierre curricular.

Este informe se prepara antes del commit/push, conforme al orden solicitado. El commit de entrega tendrá el mensaje **Completa catálogo curricular de primaria y secundaria** e incluirá el informe, código, fixtures, migración y datasets. Su SHA no puede incluirse dentro de su propio contenido sin cambiarlo; se entrega en la respuesta de cierre y puede verificarse con:

```powershell
git log -1 --format="%H %s" -- docs/curriculum/informe-fase-a-final.md
git status
git rev-parse HEAD
git ls-remote --heads origin instrumentos-evaluacion
```

Al redactar este apartado la rama era local, sin upstream y aún no se había hecho push. La confirmación de subida se dará solamente después de ejecutar y comprobar el push. No se abrirá PR.

## C. Fuentes canónicas y hashes

Directorio fuente: `C:/Users/alexa/OneDrive/Documents/Documentos de escuela/Recursos de escuela/`.

| Nivel | Archivo | Páginas | SHA-256 |
|---|---|---|---|
| Primaria | lq58-adecuacion-curricular-primariapdf.pdf | 404 | d4341fd5f387b16333cdeaaa5b8e34b3468722bf17ca6d1a589854b205a9e427 |
| Secundaria | Ht7X-adecuacion-secundaria-2023pdf.pdf | 520 | 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58 |

Los documentos completos fueron procesados, no resúmenes ni catálogos anteriores. No se modificaron los PDF.

## D. Versión exacta del extractor y reproducibilidad

- SHA-256 agregado del conjunto ordenado de archivos `.mjs`: `cb8600d08ad07401abc2643a99f73fe2b0ee7121a4a129694ea2caa4aa7f5e6c`.
- Node: `v24.19.0`; PDF.js: `6.1.200`.
- SHA-256 del importador TypeScript: `1ce39178977694cbcc9acb63e7170be13750735bd4e9d8e37aed0972cef59f69`.
- Primera extracción final: `2026-09-27T22:03:53.781Z`.
- Repetición independiente desde ambos PDF, en otro directorio: `2026-09-27T22:04:00.019Z`.
- Los **12 artefactos de contenido** (6 por nivel: JSONL, cobertura, matriz, pendientes, muestras e inventario de páginas) fueron idénticos por SHA-256 entre ambas ejecuciones. El timestamp del archivo `.run.json` cambia deliberadamente.
- `verify-artifacts.mjs` reconstruye la cobertura desde JSONL, pendientes e inventario real de páginas, y compara el manifiesto completo. No sustituye `mallaPages` por una lista vacía.
- Las expectativas permanecen en **45 y 72**; no se redujeron para obtener cobertura.

Los `.run.json` contienen hash individual de cada archivo del extractor y de cada artefacto; son la identificación verificable del código sin depender de la fecha del commit.

| Dataset | SHA-256 JSONL |
|---|---|
| Primaria | 0ed2b74c5b679b8b908ec7e43adb4d42371b0ed63b95654b81d1ce6c6b5e2b24 |
| Secundaria | 9cdfc8d51bc44918d41c611ed650bff583f6139532b130e7b9a75855247b4da3 |

Pipeline y utilidades:

| Archivo | Función |
|---|---|
| extract.mjs | Orquesta ambas extracciones, hashes, manifiestos, muestras y matrices |
| pdf-page.mjs | Texto y bordes vectoriales reales de las tablas |
| layout.mjs | Líneas, bloques, delimitación de filas, normalización e IDs estables |
| malla.mjs | Competencias por celda, columnas, criterios explícitos, indicadores y continuidad |
| primary.mjs / secondary.mjs | Adaptadores independientes y estado por grado/área/salida |
| source-anomalies.mjs | Correcciones contextuales documentadas de encabezados editoriales |
| validate.mjs | Expectativas, tipos obligatorios, procedencia, celdas, relaciones y anomalías |
| verify-artifacts.mjs | Validación independiente de artefactos guardados y hashes de código |
| inspect-pages.mjs | Renders, contactos y fixtures reproducibles |
| query.mjs | Consulta de un ámbito único, sin fusionar salidas homónimas |
| survey.mjs | Inventario exploratorio de encabezados y páginas |
| curriculum.test.mjs / regression.test.mjs | 53 pruebas, incluyendo fixtures reales |
| check-local-db.mjs | Importación doble, hash distinto, consultas y comprobaciones SQL locales |
| packages/database/src/import-curriculum.ts | Importador transaccional Prisma, por lotes e idempotente |

Todos los scripts `.mjs` están en `scripts/curriculum/`. Fixtures: `scripts/curriculum/fixtures/primary/` y `secondary/`, con hash del PDF, posición, texto y geometría. No se añadieron dependencias. `.gitattributes` fija LF para código/datos curriculares y mantiene los hashes estables entre checkouts Windows/Unix.

Artefactos canónicos en `data/curriculum/`:

- `primary-2023.{jsonl,coverage.json,matrix.csv,pending.json,samples.json,pages.json,run.json}`
- `secondary-2023.{jsonl,coverage.json,matrix.csv,pending.json,samples.json,pages.json,run.json}`
- `local-db-check.json`: resultados reales de PostgreSQL; no contiene credenciales.
- Los `.samples.json` contienen **45 y 72 ámbitos** respectivamente, con un ejemplo disponible de cada tipo por ámbito, texto, coordenadas y relaciones.

## E–F. Resultados completos de Primaria y Secundaria

| Métrica | Primaria | Secundaria |
|---|---|---|
| Ciclos | 1 y 2 | 1 y 2 |
| Grados | 1–6 | 1–6 |
| Áreas | 8 | 8 |
| Ámbitos con grado | 45 | 72 |
| Ámbitos totales registrados | 59 | 89 |
| Competencias fundamentales (celdas contextuales) | 135 | 504 |
| Competencias específicas de grado | 135 | 504 |
| Criterios explícitos | 321 | 380 |
| Indicadores | 405 | 1586 |
| Conceptos | 1690 | 3287 |
| Procedimientos | 2647 | 3187 |
| Actitudes/valores | 998 | 1252 |
| Total de elementos | 6331 | 10700 |
| Relaciones explícitas | 135 | 504 |
| Páginas recorridas | 404 | 520 |
| Páginas detectadas como malla | 215 | 318 |
| Páginas con elementos (incluye criterios) | 252 | 380 |
| Ámbitos esperados ausentes | 0 | 0 |
| Errores críticos | 0 | 0 |
| Incidencias de extracción pendientes | 0 | 0 |
| Elementos pendientes de aprobación individual | 6331 | 10700 |
| Versiones | DRAFT | DRAFT |

Los ámbitos totales incluyen contenedores de ciclo sin grado, además de los 117 ámbitos exigidos con grado. No se suman como grados adicionales. Los conteos son registros segmentados del PDF, no unidades pedagógicas únicas certificadas. Las competencias fundamentales se repiten por contexto; Primaria conserva **3 celdas agrupadas por ámbito**, y Secundaria **7 filas por ámbito**, enlazadas literalmente con sus competencias específicas.

Áreas de Primaria: Ciencias Sociales; Ciencias de la Naturaleza; Educación Artística; Educación Física; Formación Integral Humana y Religiosa; Lengua Española; Lenguas Extranjeras-inglés; Matemática.

Áreas de Secundaria: Ciencias Sociales; Ciencias de la Naturaleza; Educación Artística; Educación Física; Formación Integral Humana y Religiosa; Lengua Española; Lenguas Extranjeras; Matemática. El tronco general contiene nueve asignaturas por grado, porque Lenguas Extranjeras se desglosa en Inglés y Francés. Se añaden 18 ámbitos de salida académica.

### Antes → después

| Métrica | Primaria antes | Primaria después | Secundaria antes | Secundaria después |
|---|---|---|---|---|
| Errores críticos | 14 | 0 | 26 | 0 |
| Incidencias registradas | 32 | 0 | 24 | 0 |
| Ámbitos con grado | 44/45 | 45/45 | 71/72 | 72/72 |
| Elementos | 5712 | 6331 | 8740 | 10700 |
| Relaciones | 315 | 135 | 398 | 504 |
| Muestras generadas | No | Sí, 45 ámbitos | No | Sí, 72 ámbitos |
| Código/dataset sincronizados | No | Sí, hashes verificados | No | Sí, hashes verificados |
| Importación real local | No | Sí | No | Sí |
| Idempotencia real | No | Sí | No | Sí |

La reducción de relaciones de Primaria es intencionada: se conserva la celda fundamental agrupada tal como está impresa, sin fabricar siete elementos separados por ámbito. No implica pérdida del texto de las competencias. Se eliminaron falsos elementos de portadas, subtítulos y capas ocultas; el aumento neto no es simplemente añadir registros.

## G. Matriz completa de cobertura

La matriz íntegra de los **117 ámbitos** figura en el anexo 1 y en los dos `.matrix.csv`. Incluye nivel, ciclo, grado, área, asignatura, modalidad, salida, competencias específicas, criterios, conceptos, procedimientos, indicadores, actitudes y estado.

**PENDIENTE** en esas tablas significa `EXTRACTED_PENDING_REVIEW`: extracción estructural satisfactoria, pendiente de aprobación curricular. No significa un hueco de extracción.

Los criterios con alcance de ciclo no se distribuyen artificialmente entre grados. Por eso la suma de criterios de las filas con grado puede ser inferior al total del manifiesto. Un cero en criterios de un ámbito no se rellena con indicadores.

## H. Cuatro salidas optativas académicas

| Salida | Ámbitos | CE | Criterios | Conceptos | Procedimientos | Indicadores | Actitudes |
|---|---|---|---|---|---|---|---|
| Ciencias y Tecnología | 3/3 | 21 | 0 | 361 | 295 | 117 | 32 |
| Humanidades y Ciencias Sociales | 6/6 | 42 | 0 | 197 | 214 | 126 | 110 |
| Humanidades y Lenguas Modernas | 6/6 | 42 | 0 | 406 | 262 | 126 | 87 |
| Matemática y Tecnología | 3/3 | 21 | 0 | 55 | 54 | 63 | 25 |

Cada uno de los 18 ámbitos tiene competencias, conceptos, procedimientos, indicadores y actitudes; la matriz detalla cada grado y asignatura. La asignación procede de las tablas de las páginas PDF **427, 461, 490 y 498**, cotejadas con los encabezados de las mallas.

Ciencias y Tecnología:

| Grado | Asignatura | Páginas | CE | Conceptos | Procedimientos | Indicadores | Actitudes |
|---|---|---|---|---|---|---|---|
| 4 | Biología y Computación | 499–505 | 7 | 161 | 124 | 44 | 9 |
| 5 | Química y Computación | 506–510 | 7 | 65 | 58 | 37 | 14 |
| 6 | Física y Computación | 511–517 | 7 | 135 | 113 | 36 | 9 |

Química quinto y Física sexto ya tienen indicadores, incluidas las continuaciones **510 y 517**. Los subtítulos de esos paneles se conservan como procedencia, no como indicadores adicionales.

## I. Anomalías, literalidad y pendientes exactos

### Erratas editoriales con resolución documentada

- Primaria **207**: dice segundo dentro de la secuencia de FIHR tercero.
- Primaria **221–222**: dice Educación Física dentro de la malla de Educación Artística tercero.
- Primaria **319–320**: dice cuarto dentro de Ciencias de la Naturaleza quinto.
- Primaria **348**: dice quinto dentro de Inglés sexto.
- Primaria **363**: dice quinto dentro de Educación Física sexto.
- Secundaria **401**: tercer grado con rótulo «Segundo Ciclo»; corresponde al Primer Ciclo, antes de la apertura de Segundo Ciclo en 405.
- Secundaria **490/496**: variantes literales «Tigonometría» / «Trigonometría»; no se corrige el texto oficial.
- Secundaria **449**: tabla oculta bajo el panel visible de indicadores; fixture conserva todo el texto bruto, pero el catálogo incluye solamente los 21 indicadores visibles.
- Secundaria **505**: la fuente repite literalmente una formulación de biotecnología; se conserva la repetición con posiciones distintas, no se deduplica semánticamente.

Las correcciones de encabezado solo afectan los **metadatos de contexto** y están justificadas por secuencia, títulos y geometría en [QA visual](qa-visual-fase-a.md) y `source-anomalies.mjs`. No se reescribieron los textos de competencias, criterios, contenidos o indicadores.

### Qué queda pendiente o fuera del catálogo

- Incidencias ambiguas de extracción sin resolución registradas: **0**.
- Ámbitos obligatorios no extraídos: **0**.
- Ámbitos obligatorios parcialmente cubiertos por falta de un tipo exigido: **0**.
- Casos conocidos de competencias concatenadas: **0** tras la corrección y las regresiones.
- Páginas `MALLA_PAGE_EMPTY` sin explicar: **0**.
- Revisión/aprobación pedagógica individual: **los 17.031 elementos PENDING**, identificables exactamente por `reviewStatus` en JSONL y DB.
- Correspondencias con asignaturas operativas/escuelas: **0 mappings importados**; su creación revisada no forma parte de este cierre.
- No se modelan como elementos de estos siete tipos: portadas, índices, bibliografía, distribución horaria, prosa introductoria y ejes transversales. Las páginas siguen incluidas en el inventario de procesamiento. No se afirma transcripción de cada palabra de los 924 folios.
- No se reconstruyen asociaciones uno-a-uno entre un concepto/indicador y una competencia cuando la fuente no las expresa.
- Persisten erratas y repeticiones propias de la fuente. Están conservadas o documentadas, no «arregladas» mediante generación.

**Generación/inferencia:** no se generó ni completó texto curricular con IA, plantillas o conocimientos externos. Sí hay procesamiento automático: reconstrucción de espacios/saltos, segmentación geométrica, normalización de búsqueda, IDs y asignación contextual. Las seis correcciones contextuales anteriores son decisiones documentadas sobre metadatos, no extracción literal de un encabezado erróneo. `originalText` conserva las palabras/erratas extraídas; no promete identidad binaria con el flujo interno del PDF. `normalizedText` elimina marcas, diferencias de acento/puntuación y mayúsculas para búsqueda, sin corregir la ortografía.

## J. QA visual dirigido

Registro verificable: [qa-visual-fase-a.md](qa-visual-fase-a.md).

Se revisaron los puntos de las 56 incidencias previas, las 15 páginas de malla vacías, las aperturas de los **117 ámbitos**, las continuaciones problemáticas y **todas las páginas 498–517** de Ciencias y Tecnología. El registro distingue páginas completas de contactos de encabezados; no presenta un recorte como lectura completa de una página.

El QA adicional descubrió y corrigió portadas confundidas con indicadores, subtítulos contados como indicadores, criterios que cruzaban hacia ejes transversales y la capa oculta de la página 449. El validador no se limitó a desactivar avisos.

## K. Tests, typecheck, build y validadores

| Comprobación ejecutada | Resultado |
|---|---|
| node --test scripts/curriculum/*.test.mjs | 53/53 PASS |
| node scripts/curriculum/verify-artifacts.mjs | PASS en ambos niveles; manifiestos reconstruidos e iguales, hashes actuales |
| Extracción completa repetida desde PDF | PASS; 12/12 artefactos de contenido idénticos por hash |
| pnpm --filter backend test | PASS; 24 archivos, 135 tests |
| pnpm --filter backend build | PASS; tsc -p tsconfig.build.fix.json |
| pnpm --filter frontend build | PASS; tsc -b y Vite/PWA |
| pnpm --filter @aula/database exec tsc --noEmit | PASS |
| pnpm cloudflare:build | PASS; 4 builds de Turbo y Wrangler 4.111.0 --dry-run; sin despliegue |
| node scripts/curriculum/check-local-db.mjs | PASS; PostgreSQL real local, detalle en local-db-check.json |

Advertencia no bloqueante existente: Vite informa de chunks grandes, incluido el catálogo resumido legado que este trabajo no modificó. No se ajustaron límites ni se ocultó la advertencia.

Las regresiones cubren ambos niveles/ciclos, columnas reales, continuidad sin encabezados, cambio de grado/área y reset de portada, cuatro salidas, indicadores continuados, encabezado partido, competencias por celda, criterios explícitos, IDs, folios, procedencia, scope, encabezados incrustados, texto excesivo y desbordamiento de celdas.

La validación estructural no constituye una demostración matemática de equivalencia semántica de todos los elementos; la aprobación humana sigue separada.

## L. Migración y catálogo PostgreSQL local

Migración creada: `supabase/migrations/20260927202613_curricular_catalog.sql`.

SHA-256: `d4f9f31bdd7ba8726cc0ef8e71ded39e678684fcacc055f17bc791ab754d96bb`.

Aplicada mediante `psql --single-transaction -v ON_ERROR_STOP=1` en el contenedor local `supabase_db_Proyecto-educativo-v3`, base `postgres`, loopback **127.0.0.1:54332**. No se aplicó en producción ni se alteraron migraciones antiguas. La aplicación fue SQL directa local; no se presenta como una migración remota ni como registro automático de historial del CLI.

Servidor: PostgreSQL 17.6 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 15.2.0, 64-bit.

| Tabla / modelo Prisma | RLS | Políticas | FK | Índices | Triggers | app_backend CRUD |
|---|---|---|---|---|---|---|
| curriculum_documents / CurriculumDocument | Sí | 1 | 1 | 3 | 1 | Sí |
| curriculum_element_relations / CurriculumElementRelation | Sí | 1 | 3 | 2 | 1 | Sí |
| curriculum_elements / CurriculumElement | Sí | 1 | 2 | 5 | 1 | Sí |
| curriculum_scopes / CurriculumScope | Sí | 1 | 1 | 5 | 1 | Sí |
| curriculum_source_spans / CurriculumSourceSpan | Sí | 1 | 3 | 3 | 1 | Sí |
| curriculum_subject_mappings / CurriculumSubjectMapping | Sí | 1 | 2 | 3 | 0 | Sí |
| curriculum_versions / CurriculumVersion | Sí | 1 | 0 | 2 | 1 | Sí |

Las siete tablas tienen política explícita para `app_backend` y permisos CRUD. Se comprobaron lectura bajo ese rol, FK de ámbito inexistente, prohibición de salto DRAFT→PUBLISHED e inmutabilidad. Para probar la inmutabilidad se usó **una versión sintética dentro de una transacción revertida**, no se publicó ninguna versión canónica. `anon` y `authenticated` no pudieron leer las siete tablas; INSERT en versiones fue denegado y UPDATE/DELETE no afectaron filas.

El primer intento de las pruebas de roles con el usuario local `postgres` falló porque no podía hacer SET ROLE app_backend; las importaciones ya habían terminado. Se repitieron las comprobaciones con el administrador de **la misma base local**, sin cambiar membresías ni permisos para hacer pasar la prueba. El resultado final es PASS. No se modificó RLS para permitir acceso público.

Schema Prisma y tipos de DB del frontend incluyen las mismas siete tablas. No se añadieron rutas ni componentes.

## M. Importación real local

Evidencia completa: [local-db-check.json](../../data/curriculum/local-db-check.json), ejecución `2026-09-27T21:58:28.148Z`.

| Versión | Estado | Documentos | Ámbitos totales | Elementos | Relaciones | Source spans |
|---|---|---|---|---|---|---|
| MINERD_PRIMARIA_2023 | DRAFT | 1 | 59 | 6331 | 135 | 6331 |
| MINERD_SECUNDARIA_2023 | DRAFT | 1 | 89 | 10700 | 504 | 10700 |

Cada elemento tiene un source span con documento, posición PDF, folio leído cuando existe, sección y coordenadas. Los detalles adicionales de celda/subapartado y correcciones contextuales se conservan en JSONL/fixtures/registro de QA; no se inventan columnas nuevas en la arquitectura aceptada.

Los conteos importados coinciden exactamente con los registros de los JSONL. No hay mappings operativos importados. El importador crea borradores y rechaza sobrescrituras de una versión existente.

## N. Idempotencia y rechazo seguro

Por cada dataset se ejecutó el importador repetidamente. En las ejecuciones verificadas de repetición devolvió **«ya importado, sin cambios»**; los conteos de las siete tablas antes/después permanecieron iguales. La evidencia JSON conserva las instantáneas. La primera importación insertó los datos antes del fallo de SET ROLE descrito en L; las comprobaciones finales no fingieron volver a partir de cero.

También se construyó una copia temporal con **el mismo código de versión y SHA de documento diferente**, junto con manifiesto correspondiente. El importador la rechazó por **«otro PDF o dataset»** y los conteos quedaron intactos. No se cambió el catálogo canónico ni se borraron registros para forzar el resultado.

## O. Consultas reales con aislamiento de contexto

Todas fueron SQL sobre el catálogo importado, filtrando nivel + grado + asignatura + salida exacta, sin búsqueda difusa:

| Nivel | Grado | Asignatura | Salida | Tipos devueltos | Elementos |
|---|---|---|---|---|---|
| PRIMARY | 5 | Ciencias de la Naturaleza | General | 7 | 146 |
| PRIMARY | 1 | Lengua Española | General | 7 | 362 |
| SECONDARY | 2 | Matemática | General | 6 | 80 |
| SECONDARY | 4 | Apreciación y Producción Literarias | Humanidades y Lenguas Modernas | 6 | 115 |
| SECONDARY | 4 | Apreciación y Producción Literarias | Humanidades y Ciencias Sociales | 6 | 101 |
| SECONDARY | 5 | Química y Computación | Ciencias y Tecnología | 6 | 188 |
| SECONDARY | 6 | Física y Computación | Ciencias y Tecnología | 6 | 307 |

Apreciación y Producción Literarias de cuarto existe en **dos salidas distintas**. Se probaron ambas por separado: no se mezclaron. Una consulta sin salida no debe elegir automáticamente entre ellas; `query.mjs` exige ámbito único.

Ejemplo de consulta parametrizada utilizada:

```sql
SELECT v.level, s.cycle, s.grade, s.area_name, s.subject_name,
       s.optative_exit_name, e.element_type, count(*)
FROM curriculum_elements e
JOIN curriculum_scopes s ON s.id = e.scope_id
JOIN curriculum_versions v ON v.id = s.version_id
WHERE v.level = $1 AND s.grade = $2 AND s.subject_name = $3
  AND s.optative_exit_name IS NOT DISTINCT FROM $4
GROUP BY 1,2,3,4,5,6,7;
```

## P. Estado final y límites de aprobación

**Cierre técnico de la corrección de Fase A:** los huecos estructurales conocidos han sido resueltos y las condiciones automáticas solicitadas se cumplen. No quedan errores críticos, ámbitos obligatorios ausentes ni mezclas conocidas de celdas pendientes de corregir.

**Estado curricular: DRAFT / PENDING, no VALIDATED ni PUBLISHED.** Falta la revisión/aprobación del nuevo informe y del contenido por parte del responsable curricular. No se autoriza ni se inicia Fase B con este cierre.

El catálogo representa los ámbitos exigidos de Primaria y Secundaria 2023 con grado, asignatura, competencias de malla, contenidos, procedimientos, indicadores y procedencia, sin los huecos estructurales conocidos. Esta afirmación se limita al alcance y al QA documentados; no certifica revisión humana de cada palabra.

## Anexo 1. Matriz íntegra

CE = competencias específicas. Estado PENDIENTE = EXTRACTED_PENDING_REVIEW. Modalidad General significa sin salida optativa; no es una etiqueta añadida al PDF.

### Primaria

| Nivel | Ciclo | Grado | Área | Asignatura | Modalidad | Salida | CE | Criterios | Conceptos | Procedimientos | Indicadores | Actitudes | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Primaria | 1 | 1 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 3 | 7 | 52 | 30 | 9 | 15 | PENDIENTE |
| Primaria | 1 | 1 | Ciencias Sociales | Ciencias Sociales | General | — | 3 | 9 | 24 | 73 | 9 | 43 | PENDIENTE |
| Primaria | 1 | 1 | Educación Artística | Educación Artística | General | — | 3 | 7 | 14 | 16 | 9 | 8 | PENDIENTE |
| Primaria | 1 | 1 | Educación Física | Educación Física | General | — | 3 | 7 | 10 | 16 | 9 | 8 | PENDIENTE |
| Primaria | 1 | 1 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 3 | 7 | 15 | 31 | 9 | 20 | PENDIENTE |
| Primaria | 1 | 1 | Lengua Española | Lengua Española | General | — | 3 | 10 | 60 | 235 | 9 | 42 | PENDIENTE |
| Primaria | 1 | 1 | Matemática | Matemática | General | — | 3 | 7 | 23 | 22 | 9 | 7 | PENDIENTE |
| Primaria | 1 | 2 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 3 | 7 | 43 | 36 | 9 | 12 | PENDIENTE |
| Primaria | 1 | 2 | Ciencias Sociales | Ciencias Sociales | General | — | 3 | 9 | 19 | 52 | 9 | 27 | PENDIENTE |
| Primaria | 1 | 2 | Educación Artística | Educación Artística | General | — | 3 | 7 | 24 | 20 | 9 | 16 | PENDIENTE |
| Primaria | 1 | 2 | Educación Física | Educación Física | General | — | 3 | 7 | 9 | 16 | 9 | 5 | PENDIENTE |
| Primaria | 1 | 2 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 3 | 7 | 22 | 35 | 9 | 22 | PENDIENTE |
| Primaria | 1 | 2 | Lengua Española | Lengua Española | General | — | 3 | 9 | 88 | 260 | 9 | 68 | PENDIENTE |
| Primaria | 1 | 2 | Matemática | Matemática | General | — | 3 | 7 | 21 | 37 | 9 | 6 | PENDIENTE |
| Primaria | 1 | 3 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 3 | 8 | 55 | 41 | 9 | 18 | PENDIENTE |
| Primaria | 1 | 3 | Ciencias Sociales | Ciencias Sociales | General | — | 3 | 9 | 19 | 55 | 9 | 32 | PENDIENTE |
| Primaria | 1 | 3 | Educación Artística | Educación Artística | General | — | 3 | 7 | 15 | 16 | 9 | 7 | PENDIENTE |
| Primaria | 1 | 3 | Educación Física | Educación Física | General | — | 3 | 7 | 8 | 15 | 9 | 11 | PENDIENTE |
| Primaria | 1 | 3 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 3 | 7 | 20 | 28 | 9 | 19 | PENDIENTE |
| Primaria | 1 | 3 | Lengua Española | Lengua Española | General | — | 3 | 9 | 141 | 228 | 9 | 109 | PENDIENTE |
| Primaria | 1 | 3 | Matemática | Matemática | General | — | 3 | 7 | 52 | 55 | 9 | 14 | PENDIENTE |
| Primaria | 2 | 4 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 3 | 7 | 44 | 37 | 9 | 16 | PENDIENTE |
| Primaria | 2 | 4 | Ciencias Sociales | Ciencias Sociales | General | — | 3 | 9 | 37 | 67 | 9 | 31 | PENDIENTE |
| Primaria | 2 | 4 | Educación Artística | Educación Artística | General | — | 3 | 8 | 29 | 31 | 9 | 12 | PENDIENTE |
| Primaria | 2 | 4 | Educación Física | Educación Física | General | — | 3 | 7 | 11 | 17 | 9 | 11 | PENDIENTE |
| Primaria | 2 | 4 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 3 | 6 | 13 | 35 | 9 | 14 | PENDIENTE |
| Primaria | 2 | 4 | Lengua Española | Lengua Española | General | — | 3 | 7 | 52 | 104 | 9 | 29 | PENDIENTE |
| Primaria | 2 | 4 | Lenguas Extranjeras-inglés | Lenguas Extranjeras-inglés | General | — | 3 | 0 | 75 | 43 | 9 | 14 | PENDIENTE |
| Primaria | 2 | 4 | Matemática | Matemática | General | — | 3 | 7 | 12 | 37 | 9 | 11 | PENDIENTE |
| Primaria | 2 | 5 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 3 | 8 | 45 | 45 | 9 | 33 | PENDIENTE |
| Primaria | 2 | 5 | Ciencias Sociales | Ciencias Sociales | General | — | 3 | 9 | 48 | 123 | 9 | 43 | PENDIENTE |
| Primaria | 2 | 5 | Educación Artística | Educación Artística | General | — | 3 | 8 | 22 | 29 | 9 | 12 | PENDIENTE |
| Primaria | 2 | 5 | Educación Física | Educación Física | General | — | 3 | 7 | 11 | 15 | 9 | 12 | PENDIENTE |
| Primaria | 2 | 5 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 3 | 6 | 17 | 41 | 9 | 21 | PENDIENTE |
| Primaria | 2 | 5 | Lengua Española | Lengua Española | General | — | 3 | 7 | 95 | 147 | 9 | 40 | PENDIENTE |
| Primaria | 2 | 5 | Lenguas Extranjeras-inglés | Lenguas Extranjeras-inglés | General | — | 3 | 0 | 73 | 48 | 9 | 22 | PENDIENTE |
| Primaria | 2 | 5 | Matemática | Matemática | General | — | 3 | 7 | 65 | 47 | 9 | 7 | PENDIENTE |
| Primaria | 2 | 6 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 3 | 8 | 50 | 50 | 9 | 28 | PENDIENTE |
| Primaria | 2 | 6 | Ciencias Sociales | Ciencias Sociales | General | — | 3 | 9 | 48 | 100 | 9 | 37 | PENDIENTE |
| Primaria | 2 | 6 | Educación Artística | Educación Artística | General | — | 3 | 9 | 21 | 16 | 9 | 10 | PENDIENTE |
| Primaria | 2 | 6 | Educación Física | Educación Física | General | — | 3 | 7 | 8 | 23 | 9 | 7 | PENDIENTE |
| Primaria | 2 | 6 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 3 | 6 | 22 | 41 | 9 | 25 | PENDIENTE |
| Primaria | 2 | 6 | Lengua Española | Lengua Española | General | — | 3 | 7 | 69 | 158 | 9 | 33 | PENDIENTE |
| Primaria | 2 | 6 | Lenguas Extranjeras-inglés | Lenguas Extranjeras-inglés | General | — | 3 | 0 | 34 | 22 | 9 | 10 | PENDIENTE |
| Primaria | 2 | 6 | Matemática | Matemática | General | — | 3 | 7 | 55 | 54 | 9 | 11 | PENDIENTE |

### Secundaria

| Nivel | Ciclo | Grado | Área | Asignatura | Modalidad | Salida | CE | Criterios | Conceptos | Procedimientos | Indicadores | Actitudes | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Secundaria | 1 | 1 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 7 | 0 | 35 | 30 | 21 | 12 | PENDIENTE |
| Secundaria | 1 | 1 | Ciencias Sociales | Ciencias Sociales | General | — | 7 | 0 | 52 | 69 | 21 | 25 | PENDIENTE |
| Secundaria | 1 | 1 | Educación Artística | Educación Artística | General | — | 7 | 0 | 19 | 17 | 21 | 8 | PENDIENTE |
| Secundaria | 1 | 1 | Educación Física | Educación Física | General | — | 7 | 0 | 26 | 42 | 21 | 10 | PENDIENTE |
| Secundaria | 1 | 1 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 7 | 0 | 24 | 53 | 21 | 34 | PENDIENTE |
| Secundaria | 1 | 1 | Lengua Española | Lengua Española | General | — | 7 | 0 | 61 | 31 | 21 | 34 | PENDIENTE |
| Secundaria | 1 | 1 | Lenguas Extranjeras | Inglés | General | — | 7 | 0 | 96 | 53 | 21 | 17 | PENDIENTE |
| Secundaria | 1 | 1 | Lenguas Extranjeras | Francés | General | — | 7 | 0 | 78 | 48 | 21 | 15 | PENDIENTE |
| Secundaria | 1 | 1 | Matemática | Matemática | General | — | 7 | 0 | 26 | 23 | 21 | 6 | PENDIENTE |
| Secundaria | 1 | 2 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 7 | 0 | 35 | 57 | 21 | 18 | PENDIENTE |
| Secundaria | 1 | 2 | Ciencias Sociales | Ciencias Sociales | General | — | 7 | 0 | 64 | 65 | 21 | 32 | PENDIENTE |
| Secundaria | 1 | 2 | Educación Artística | Educación Artística | General | — | 7 | 0 | 25 | 18 | 21 | 17 | PENDIENTE |
| Secundaria | 1 | 2 | Educación Física | Educación Física | General | — | 7 | 0 | 19 | 6 | 21 | 10 | PENDIENTE |
| Secundaria | 1 | 2 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 7 | 0 | 22 | 45 | 21 | 26 | PENDIENTE |
| Secundaria | 1 | 2 | Lengua Española | Lengua Española | General | — | 7 | 0 | 57 | 24 | 21 | 28 | PENDIENTE |
| Secundaria | 1 | 2 | Lenguas Extranjeras | Inglés | General | — | 7 | 0 | 92 | 51 | 21 | 18 | PENDIENTE |
| Secundaria | 1 | 2 | Lenguas Extranjeras | Francés | General | — | 7 | 0 | 60 | 43 | 21 | 11 | PENDIENTE |
| Secundaria | 1 | 2 | Matemática | Matemática | General | — | 7 | 0 | 10 | 26 | 21 | 9 | PENDIENTE |
| Secundaria | 1 | 3 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 7 | 0 | 60 | 101 | 21 | 11 | PENDIENTE |
| Secundaria | 1 | 3 | Ciencias Sociales | Ciencias Sociales | General | — | 7 | 0 | 48 | 53 | 21 | 17 | PENDIENTE |
| Secundaria | 1 | 3 | Educación Artística | Educación Artística | General | — | 7 | 0 | 22 | 15 | 21 | 7 | PENDIENTE |
| Secundaria | 1 | 3 | Educación Física | Educación Física | General | — | 7 | 0 | 20 | 30 | 21 | 10 | PENDIENTE |
| Secundaria | 1 | 3 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 7 | 0 | 21 | 53 | 21 | 27 | PENDIENTE |
| Secundaria | 1 | 3 | Lengua Española | Lengua Española | General | — | 7 | 0 | 69 | 27 | 21 | 35 | PENDIENTE |
| Secundaria | 1 | 3 | Lenguas Extranjeras | Inglés | General | — | 7 | 0 | 61 | 48 | 21 | 14 | PENDIENTE |
| Secundaria | 1 | 3 | Lenguas Extranjeras | Francés | General | — | 7 | 0 | 37 | 45 | 21 | 9 | PENDIENTE |
| Secundaria | 1 | 3 | Matemática | Matemática | General | — | 7 | 0 | 15 | 3 | 21 | 4 | PENDIENTE |
| Secundaria | 2 | 4 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 7 | 0 | 40 | 93 | 26 | 19 | PENDIENTE |
| Secundaria | 2 | 4 | Ciencias de la Naturaleza | Biología y Computación | Académica | Ciencias y Tecnología | 7 | 0 | 161 | 124 | 44 | 9 | PENDIENTE |
| Secundaria | 2 | 4 | Ciencias Sociales | Ciencias Sociales | General | — | 7 | 0 | 69 | 77 | 21 | 60 | PENDIENTE |
| Secundaria | 2 | 4 | Ciencias Sociales | Filosofía social y Pensamiento Dominicano | Académica | Humanidades y Ciencias Sociales | 7 | 0 | 31 | 25 | 21 | 22 | PENDIENTE |
| Secundaria | 2 | 4 | Educación Artística | Educación Artística | General | — | 7 | 0 | 25 | 12 | 21 | 7 | PENDIENTE |
| Secundaria | 2 | 4 | Educación Física | Educación Física | General | — | 7 | 0 | 33 | 39 | 21 | 8 | PENDIENTE |
| Secundaria | 2 | 4 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 7 | 0 | 27 | 64 | 21 | 24 | PENDIENTE |
| Secundaria | 2 | 4 | Lengua Española | Lengua Española | General | — | 7 | 0 | 77 | 92 | 21 | 33 | PENDIENTE |
| Secundaria | 2 | 4 | Lengua Española | Apreciación y Producción Literarias | Académica | Humanidades y Ciencias Sociales | 7 | 0 | 28 | 28 | 21 | 10 | PENDIENTE |
| Secundaria | 2 | 4 | Lengua Española | Apreciación y Producción Literarias | Académica | Humanidades y Lenguas Modernas | 7 | 0 | 39 | 28 | 21 | 13 | PENDIENTE |
| Secundaria | 2 | 4 | Lenguas Extranjeras | Inglés | General | — | 7 | 0 | 55 | 56 | 21 | 16 | PENDIENTE |
| Secundaria | 2 | 4 | Lenguas Extranjeras | Francés | General | — | 7 | 0 | 34 | 44 | 21 | 11 | PENDIENTE |
| Secundaria | 2 | 4 | Lenguas Extranjeras | Manejo de la información en inglés | Académica | Humanidades y Lenguas Modernas | 7 | 0 | 80 | 56 | 21 | 17 | PENDIENTE |
| Secundaria | 2 | 4 | Matemática | Matemática | General | — | 7 | 0 | 2 | 14 | 22 | 7 | PENDIENTE |
| Secundaria | 2 | 4 | Matemática | Matemática Financiera y Tecnología | Académica | Matemática y Tecnología | 7 | 0 | 26 | 25 | 21 | 12 | PENDIENTE |
| Secundaria | 2 | 5 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 7 | 0 | 30 | 52 | 27 | 15 | PENDIENTE |
| Secundaria | 2 | 5 | Ciencias de la Naturaleza | Química y Computación | Académica | Ciencias y Tecnología | 7 | 0 | 65 | 58 | 37 | 14 | PENDIENTE |
| Secundaria | 2 | 5 | Ciencias Sociales | Ciencias Sociales | General | — | 7 | 0 | 91 | 91 | 21 | 59 | PENDIENTE |
| Secundaria | 2 | 5 | Ciencias Sociales | Geografía Humana y Demografía | Académica | Humanidades y Ciencias Sociales | 7 | 0 | 44 | 36 | 21 | 21 | PENDIENTE |
| Secundaria | 2 | 5 | Educación Artística | Educación Artística | General | — | 7 | 0 | 23 | 16 | 21 | 15 | PENDIENTE |
| Secundaria | 2 | 5 | Educación Física | Educación Física | General | — | 7 | 0 | 29 | 41 | 21 | 13 | PENDIENTE |
| Secundaria | 2 | 5 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 7 | 0 | 24 | 52 | 21 | 25 | PENDIENTE |
| Secundaria | 2 | 5 | Lengua Española | Lengua Española | General | — | 7 | 0 | 70 | 23 | 21 | 28 | PENDIENTE |
| Secundaria | 2 | 5 | Lengua Española | Apreciación y Producción Literarias | Académica | Humanidades y Ciencias Sociales | 7 | 0 | 22 | 28 | 21 | 13 | PENDIENTE |
| Secundaria | 2 | 5 | Lengua Española | Apreciación y Producción Literarias | Académica | Humanidades y Lenguas Modernas | 7 | 0 | 27 | 27 | 21 | 13 | PENDIENTE |
| Secundaria | 2 | 5 | Lenguas Extranjeras | Inglés | General | — | 7 | 0 | 54 | 52 | 21 | 15 | PENDIENTE |
| Secundaria | 2 | 5 | Lenguas Extranjeras | Francés | General | — | 7 | 0 | 38 | 46 | 21 | 14 | PENDIENTE |
| Secundaria | 2 | 5 | Lenguas Extranjeras | Apreciación de la Literatura Anglófona | Académica | Humanidades y Lenguas Modernas | 7 | 0 | 113 | 42 | 21 | 15 | PENDIENTE |
| Secundaria | 2 | 5 | Matemática | Matemática | General | — | 7 | 0 | 7 | 14 | 21 | 6 | PENDIENTE |
| Secundaria | 2 | 5 | Matemática | Estadística Probabilidad y Tecnología | Académica | Matemática y Tecnología | 7 | 0 | 23 | 20 | 21 | 6 | PENDIENTE |
| Secundaria | 2 | 6 | Ciencias de la Naturaleza | Ciencias de la Naturaleza | General | — | 7 | 0 | 50 | 60 | 28 | 13 | PENDIENTE |
| Secundaria | 2 | 6 | Ciencias de la Naturaleza | Física y Computación | Académica | Ciencias y Tecnología | 7 | 0 | 135 | 113 | 36 | 9 | PENDIENTE |
| Secundaria | 2 | 6 | Ciencias Sociales | Ciencias Sociales | General | — | 7 | 0 | 86 | 80 | 21 | 33 | PENDIENTE |
| Secundaria | 2 | 6 | Ciencias Sociales | Ciudadanía y Democracia Participativa | Académica | Humanidades y Ciencias Sociales | 7 | 0 | 20 | 25 | 21 | 17 | PENDIENTE |
| Secundaria | 2 | 6 | Educación Artística | Educación Artística | General | — | 7 | 0 | 21 | 20 | 21 | 16 | PENDIENTE |
| Secundaria | 2 | 6 | Educación Física | Educación Física | General | — | 7 | 0 | 28 | 54 | 22 | 9 | PENDIENTE |
| Secundaria | 2 | 6 | Formación Integral Humana y Religiosa | Formación Integral Humana y Religiosa | General | — | 7 | 0 | 28 | 52 | 21 | 23 | PENDIENTE |
| Secundaria | 2 | 6 | Lengua Española | Lengua Española | General | — | 7 | 0 | 69 | 40 | 21 | 33 | PENDIENTE |
| Secundaria | 2 | 6 | Lengua Española | Análisis y Producción de Textos Científicos y Profesionales | Académica | Humanidades y Ciencias Sociales | 7 | 0 | 52 | 72 | 21 | 27 | PENDIENTE |
| Secundaria | 2 | 6 | Lengua Española | Análisis y Producción de Textos Periodísticos y Publicitarios | Académica | Humanidades y Lenguas Modernas | 7 | 0 | 51 | 60 | 21 | 16 | PENDIENTE |
| Secundaria | 2 | 6 | Lenguas Extranjeras | Inglés | General | — | 7 | 0 | 62 | 49 | 21 | 13 | PENDIENTE |
| Secundaria | 2 | 6 | Lenguas Extranjeras | Francés | General | — | 7 | 0 | 31 | 31 | 21 | 8 | PENDIENTE |
| Secundaria | 2 | 6 | Lenguas Extranjeras | Análisis Crítico y Evaluación de Textos en Inglés | Académica | Humanidades y Lenguas Modernas | 7 | 0 | 96 | 49 | 21 | 13 | PENDIENTE |
| Secundaria | 2 | 6 | Matemática | Matemática | General | — | 7 | 0 | 11 | 22 | 21 | 11 | PENDIENTE |
| Secundaria | 2 | 6 | Matemática | Tigonometría, Cálculo Diferencial y Tecnología | Académica | Matemática y Tecnología | 7 | 0 | 6 | 9 | 21 | 7 | PENDIENTE |

## Anexo 2. Seis ejemplos reales con trazabilidad

Textos tomados de los JSONL finales, sin paráfrasis ni corrección editorial.

### Ejemplo 1: Primaria, ciclo 1, 1.º — Lengua Española

- Tipo: `SPECIFIC_COMPETENCY`; estado `PENDING`.
- ID: `71a00573-40b4-5ab7-933d-5d33d32fb3b0`.
- Scope: `PRIMARY/1/1/lengua espanola/lengua espanola/all/all`; ID `291dcc6c-c689-5297-a4ea-5a5203a040b9`.
- Documento: `7b786384-8042-5d3d-aa18-0e6751c3d376`; página PDF **64**, folio leído **63**.
- Coordenadas PDF (puntos, origen inferior izquierdo): `{"x0":193.14,"y0":644.46,"x1":540.97965,"y1":680.46}`.
- Modalidad/salida: general / ninguna.

```text
Expresa y comprende, de forma oral y escrita en diferentes contextos, textos funcionales
y literarios muy sencillos y de estructura sintáctica simple, mediante el uso de medios y
recursos apropiados, demostrando avance progresivo en sus procesos lectura y escritura
```

Relaciones principales: pertenece al ámbito y a la versión `37843eac-3f65-55ab-8a7e-e4fd95715380`; referencia al documento mediante source span. `252b9ee0-0995-5522-9f17-e3f8cdeaa6f9` → `71a00573-40b4-5ab7-933d-5d33d32fb3b0`, `EXPLICITLY_LINKED` (misma fila de la fuente).

### Ejemplo 2: Primaria, ciclo 2, 5.º — Ciencias de la Naturaleza

- Tipo: `ACHIEVEMENT_INDICATOR`; estado `PENDING`.
- ID: `42393447-5cbe-55bc-9e75-e396e40df3b2`.
- Scope: `PRIMARY/2/5/ciencias de la naturaleza/ciencias de la naturaleza/all/all`; ID `f514ddf8-5fc0-5e85-a3d9-7ab344fea577`.
- Documento: `7b786384-8042-5d3d-aa18-0e6751c3d376`; página PDF **321**, folio leído **320**.
- Coordenadas PDF (puntos, origen inferior izquierdo): `{"x0":55.125,"y0":636.875,"x1":556.9270500000002,"y1":696.875}`.
- Modalidad/salida: general / ninguna.

```text
• Comunica sus ideas e inferencias de las observaciones, exploraciones y experimentos, usando y cuidando los sentidos e
instrumentos para percibir, recolectar, obtener y organizar datos e información en tablas y graficas elementales; mostrando
y argumentado los resultados de su trabajo de forma objetiva, sistemática y creativa en proyecto individual y colectivo
de problemáticas de investigación o innovación escolar y comunitaria en salud, fenómenos naturales, medioambiente y
sostenibilidad.
```

Relaciones principales: pertenece al ámbito y a la versión `37843eac-3f65-55ab-8a7e-e4fd95715380`; referencia al documento mediante source span. No se inventó una relación individual con competencias/criterios; esa vinculación no está expresada en una fila de la fuente.

### Ejemplo 3: Secundaria, ciclo 1, 1.º — Ciencias Sociales

- Tipo: `SPECIFIC_COMPETENCY`; estado `PENDING`.
- ID: `f3ba7ff1-fb7f-5453-aba5-5a12712a6358`.
- Scope: `SECONDARY/1/1/ciencias sociales/ciencias sociales/all/all`; ID `be0adcd8-e2a0-5f4a-b169-b33213257c85`.
- Documento: `4569a9c9-077b-5146-91a4-fa9ac267f633`; página PDF **244**, folio leído **243**.
- Coordenadas PDF (puntos, origen inferior izquierdo): `{"x0":219.40799999999996,"y0":671.502,"x1":562.7589,"y1":702.498}`.
- Modalidad/salida: general / ninguna.

```text
Identifica en medios impresos y digitales fuentes primarias y secundarias sobre procesos
sociales, políticos, económicos, culturales, históricos y geográficos; con la finalidad de obtener
informaciones confiables.
```

Relaciones principales: pertenece al ámbito y a la versión `d98f8201-3cac-5da6-b855-38f7bb8c8011`; referencia al documento mediante source span. `435dc864-bdb7-560a-9dfa-3dad5763ebe3` → `f3ba7ff1-fb7f-5453-aba5-5a12712a6358`, `EXPLICITLY_LINKED` (misma fila de la fuente).

### Ejemplo 4: Secundaria, ciclo 2, 5.º — Educación Artística

- Tipo: `PROCEDURE`; estado `PENDING`.
- ID: `967121f5-efa5-592a-b04b-941756fbaa14`.
- Scope: `SECONDARY/2/5/educacion artistica/educacion artistica/all/all`; ID `73dc04d6-0e4f-58a4-bfd3-1fd75c8b98f3`.
- Documento: `4569a9c9-077b-5146-91a4-fa9ac267f633`; página PDF **344**, folio leído **343**.
- Coordenadas PDF (puntos, origen inferior izquierdo): `{"x0":234.282,"y0":425.07200000000006,"x1":412.0563000000002,"y1":489.062}`.
- Modalidad/salida: general / ninguna.

```text
• Investigación de propuestas artísticas
(exposiciones, montajes, portafolios, estudio o
talleres, proyectos de arte público, entre otros) a
través de recursos bibliográficos, visitas físicas y
virtuales de museos, teatros, salas de concierto,
galerías y centros culturales.
```

Relaciones principales: pertenece al ámbito y a la versión `d98f8201-3cac-5da6-b855-38f7bb8c8011`; referencia al documento mediante source span. No se inventó una relación individual con competencias/criterios; esa vinculación no está expresada en una fila de la fuente.

### Ejemplo 5: Secundaria, ciclo 2, 5.º — Química y Computación

- Tipo: `ACHIEVEMENT_INDICATOR`; estado `PENDING`.
- ID: `8085a1bd-3908-52ae-b772-1a7916c372b4`.
- Scope: `SECONDARY/2/5/ciencias de la naturaleza/quimica y computacion/academica/ciencias y tecnologia`; ID `f39c0cd4-85d9-5aeb-a1d2-74763bf455a9`.
- Documento: `4569a9c9-077b-5146-91a4-fa9ac267f633`; página PDF **509**, folio leído **508**.
- Coordenadas PDF (puntos, origen inferior izquierdo): `{"x0":58.25,"y0":651.1999999999999,"x1":562.6979999999985,"y1":674.2}`.
- Modalidad/salida: Académica / Ciencias y Tecnología.
- Subapartado literal: «Aplicaciones Químicas para Alimentos», página 509.

```text
• Diseño y elaboración de alimentos con la utilización de aditivos y conservantes, con cumplimiento de las normas de
seguridad alimentaria.
```

Relaciones principales: pertenece al ámbito y a la versión `d98f8201-3cac-5da6-b855-38f7bb8c8011`; referencia al documento mediante source span. No se inventó una relación individual con competencias/criterios; esa vinculación no está expresada en una fila de la fuente.

### Ejemplo 6: Primaria, ciclo 1, 3.º — Educación Artística

- Tipo: `CONCEPT`; estado `PENDING`.
- ID: `40e9c151-5827-5d84-b571-e13413d39981`.
- Scope: `PRIMARY/1/3/educacion artistica/educacion artistica/all/all`; ID `fe988717-7b06-5d9b-9f54-5fe11f9ab914`.
- Documento: `7b786384-8042-5d3d-aa18-0e6751c3d376`; página PDF **221**, folio leído **220**.
- Coordenadas PDF (puntos, origen inferior izquierdo): `{"x0":49.2532,"y0":504.7969,"x1":128.2903,"y1":514.7969}`.
- Modalidad/salida: general / ninguna.

```text
- El cuerpo expresivo.
```

Relaciones principales: pertenece al ámbito y a la versión `37843eac-3f65-55ab-8a7e-e4fd95715380`; referencia al documento mediante source span. No se inventó una relación individual con competencias/criterios; esa vinculación no está expresada en una fila de la fuente.

## Anexo 3. Inventario de archivos de la entrega

La lista siguiente incluye archivos nuevos y modificados de esta fase, incluido el informe histórico previo conservado como evidencia; no se incluyen PNG locales ni archivos de build. Los fixtures son páginas de texto/geometría, no copias de los PDF completos.

```text
.gitattributes
.gitignore
apps/frontend/src/types/database.types.ts
data/curriculum/local-db-check.json
data/curriculum/primary-2023.coverage.json
data/curriculum/primary-2023.jsonl
data/curriculum/primary-2023.matrix.csv
data/curriculum/primary-2023.pages.json
data/curriculum/primary-2023.pending.json
data/curriculum/primary-2023.run.json
data/curriculum/primary-2023.samples.json
data/curriculum/secondary-2023.coverage.json
data/curriculum/secondary-2023.jsonl
data/curriculum/secondary-2023.matrix.csv
data/curriculum/secondary-2023.pages.json
data/curriculum/secondary-2023.pending.json
data/curriculum/secondary-2023.run.json
data/curriculum/secondary-2023.samples.json
docs/curriculum/informe-fase-a-2026-09-27.md
docs/curriculum/informe-fase-a-final.md
docs/curriculum/qa-visual-fase-a.md
packages/database/package.json
packages/database/prisma/schema.prisma
packages/database/src/import-curriculum.ts
scripts/curriculum/README.md
scripts/curriculum/check-local-db.mjs
scripts/curriculum/curriculum.test.mjs
scripts/curriculum/extract.mjs
scripts/curriculum/fixtures/primary/136.json
scripts/curriculum/fixtures/primary/206.json
scripts/curriculum/fixtures/primary/207.json
scripts/curriculum/fixtures/primary/208.json
scripts/curriculum/fixtures/primary/219.json
scripts/curriculum/fixtures/primary/220.json
scripts/curriculum/fixtures/primary/221.json
scripts/curriculum/fixtures/primary/222.json
scripts/curriculum/fixtures/primary/268.json
scripts/curriculum/fixtures/primary/318.json
scripts/curriculum/fixtures/primary/319.json
scripts/curriculum/fixtures/primary/320.json
scripts/curriculum/fixtures/primary/321.json
scripts/curriculum/fixtures/primary/322.json
scripts/curriculum/fixtures/primary/347.json
scripts/curriculum/fixtures/primary/348.json
scripts/curriculum/fixtures/primary/349.json
scripts/curriculum/fixtures/primary/362.json
scripts/curriculum/fixtures/primary/363.json
scripts/curriculum/fixtures/primary/364.json
scripts/curriculum/fixtures/primary/58.json
scripts/curriculum/fixtures/primary/64.json
scripts/curriculum/fixtures/secondary/105.json
scripts/curriculum/fixtures/secondary/106.json
scripts/curriculum/fixtures/secondary/107.json
scripts/curriculum/fixtures/secondary/108.json
scripts/curriculum/fixtures/secondary/109.json
scripts/curriculum/fixtures/secondary/110.json
scripts/curriculum/fixtures/secondary/111.json
scripts/curriculum/fixtures/secondary/112.json
scripts/curriculum/fixtures/secondary/113.json
scripts/curriculum/fixtures/secondary/116.json
scripts/curriculum/fixtures/secondary/126.json
scripts/curriculum/fixtures/secondary/156.json
scripts/curriculum/fixtures/secondary/169.json
scripts/curriculum/fixtures/secondary/181.json
scripts/curriculum/fixtures/secondary/185.json
scripts/curriculum/fixtures/secondary/199.json
scripts/curriculum/fixtures/secondary/202.json
scripts/curriculum/fixtures/secondary/203.json
scripts/curriculum/fixtures/secondary/229.json
scripts/curriculum/fixtures/secondary/244.json
scripts/curriculum/fixtures/secondary/293.json
scripts/curriculum/fixtures/secondary/312.json
scripts/curriculum/fixtures/secondary/344.json
scripts/curriculum/fixtures/secondary/345.json
scripts/curriculum/fixtures/secondary/347.json
scripts/curriculum/fixtures/secondary/397.json
scripts/curriculum/fixtures/secondary/401.json
scripts/curriculum/fixtures/secondary/402.json
scripts/curriculum/fixtures/secondary/403.json
scripts/curriculum/fixtures/secondary/404.json
scripts/curriculum/fixtures/secondary/405.json
scripts/curriculum/fixtures/secondary/410.json
scripts/curriculum/fixtures/secondary/413.json
scripts/curriculum/fixtures/secondary/427.json
scripts/curriculum/fixtures/secondary/437.json
scripts/curriculum/fixtures/secondary/449.json
scripts/curriculum/fixtures/secondary/461.json
scripts/curriculum/fixtures/secondary/462.json
scripts/curriculum/fixtures/secondary/467.json
scripts/curriculum/fixtures/secondary/490.json
scripts/curriculum/fixtures/secondary/491.json
scripts/curriculum/fixtures/secondary/498.json
scripts/curriculum/fixtures/secondary/499.json
scripts/curriculum/fixtures/secondary/500.json
scripts/curriculum/fixtures/secondary/501.json
scripts/curriculum/fixtures/secondary/502.json
scripts/curriculum/fixtures/secondary/503.json
scripts/curriculum/fixtures/secondary/504.json
scripts/curriculum/fixtures/secondary/505.json
scripts/curriculum/fixtures/secondary/506.json
scripts/curriculum/fixtures/secondary/507.json
scripts/curriculum/fixtures/secondary/508.json
scripts/curriculum/fixtures/secondary/509.json
scripts/curriculum/fixtures/secondary/510.json
scripts/curriculum/fixtures/secondary/511.json
scripts/curriculum/fixtures/secondary/512.json
scripts/curriculum/fixtures/secondary/513.json
scripts/curriculum/fixtures/secondary/514.json
scripts/curriculum/fixtures/secondary/515.json
scripts/curriculum/fixtures/secondary/516.json
scripts/curriculum/fixtures/secondary/517.json
scripts/curriculum/fixtures/secondary/69.json
scripts/curriculum/fixtures/secondary/76.json
scripts/curriculum/fixtures/secondary/82.json
scripts/curriculum/fixtures/secondary/96.json
scripts/curriculum/inspect-pages.mjs
scripts/curriculum/layout.mjs
scripts/curriculum/malla.mjs
scripts/curriculum/pdf-page.mjs
scripts/curriculum/primary.mjs
scripts/curriculum/query.mjs
scripts/curriculum/regression.test.mjs
scripts/curriculum/secondary.mjs
scripts/curriculum/source-anomalies.mjs
scripts/curriculum/survey.mjs
scripts/curriculum/validate.mjs
scripts/curriculum/verify-artifacts.mjs
supabase/migrations/20260927202613_curricular_catalog.sql
```

No hay cambios de esta fase en Actividades, GradingBook, componentes visuales ni lógica del recomendador.

## Reproducción mínima

```powershell
node scripts/curriculum/extract.mjs --primary 'C:/ruta/primaria.pdf' --secondary 'C:/ruta/secundaria.pdf' --output data/curriculum
node --test scripts/curriculum/*.test.mjs
node scripts/curriculum/verify-artifacts.mjs
# DATABASE_URL debe apuntar explícitamente a la base LOCAL; nunca cargar .env de producción.
node scripts/curriculum/check-local-db.mjs
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
pnpm cloudflare:build
```

Los pasos de extracción regeneran únicamente derivados; no borran ni alteran los documentos fuente. El comprobador de DB rechaza hosts no locales y puertos distintos de 54332.
