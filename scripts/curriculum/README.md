# Catálogo curricular MINERD - Fase A

Fuentes canónicas: únicamente los PDF completos de Adecuación Curricular Primaria y Secundaria 2023 proporcionados para el proyecto. Los PDF no se copian al repositorio ni se consultan en runtime.

## Extracción reproducible

```powershell
node scripts/curriculum/extract.mjs --primary 'C:\ruta\primaria.pdf' --secondary 'C:\ruta\secundaria.pdf' --output data/curriculum
node --test scripts/curriculum/*.test.mjs
node scripts/curriculum/verify-artifacts.mjs
```

El extractor procesa todas las páginas, utiliza adaptadores independientes, geometría de columnas, encabezados de grado y asignaturas optativas comprobadas contra las tablas fuente. Genera por nivel:

- `.jsonl`: versión, documento, ámbitos, elementos y relaciones explícitas, con identificadores deterministas.
- `.coverage.json`: conteos, matriz, errores críticos y pendientes.
- `.matrix.csv`: inspección por grado, área, asignatura y salida.
- `.pending.json`: atribuciones no seguras y anomalías del PDF.
- `.samples.json`: ejemplos de ambos ciclos con texto, tipo, relación y localización.
- `.pages.json`: inventario de todas las páginas procesadas, incluyendo páginas sin malla.
- `.run.json`: timestamp, hashes del código, del PDF y de todos los artefactos derivados.

`originalText` conserva la transcripción y saltos de línea detectados; `normalizedText` solo sirve para búsqueda. La fuente se identifica por SHA-256 y cada elemento lleva página PDF, página impresa si se detecta y cuadro de coordenadas. Los criterios curriculares no se infieren de indicadores. Las relaciones entre competencias fundamentales y específicas solo se crean cuando ambas aparecen en una fila identificable de la malla. Los demás elementos quedan vinculados al ámbito sin inventar una correspondencia uno-a-uno.

La matriz de cobertura contrasta los ámbitos con el índice de Primaria, el de Secundaria y las cuatro tablas de asignaturas optativas del PDF. Un parser terminado no implica catálogo aprobado. `VALIDATION_FAILED` y `DRAFT` son estados no publicables para recomendaciones. Todo elemento automático empieza `PENDING` hasta revisión.

## Consulta de borrador

```powershell
node scripts/curriculum/query.mjs data/curriculum/primary-2023.jsonl 5 'Ciencias de la Naturaleza'
node scripts/curriculum/query.mjs data/curriculum/secondary-2023.jsonl 6 'Física y Computación' 'Ciencias y Tecnología'
```

La consulta exige un ámbito único; nunca combina grados o áreas por coincidencia de palabras.

## Importación a DB

Aplicar primero la migración nueva en un entorno de desarrollo. Luego, con `DATABASE_URL` del mismo entorno configurado explícitamente:

```powershell
pnpm --filter @aula/database curriculum:import (Resolve-Path data/curriculum/primary-2023.jsonl).Path (Resolve-Path data/curriculum/primary-2023.coverage.json).Path
pnpm --filter @aula/database curriculum:import (Resolve-Path data/curriculum/secondary-2023.jsonl).Path (Resolve-Path data/curriculum/secondary-2023.coverage.json).Path
```

La importación crea únicamente `DRAFT` o `VALIDATION_FAILED`, jamás `PUBLISHED`. Una segunda ejecución con el mismo hash es un no-op; si el PDF o JSONL cambian bajo el mismo código de versión, se rechaza para impedir sobrescritura silenciosa. Ejecutar `node scripts/curriculum/check-local-db.mjs` con `DATABASE_URL` explícita de loopback:54332 para probar importaciones, idempotencia, rechazo de hash diferente, consultas y seguridad. La evidencia se guarda en `data/curriculum/local-db-check.json`. No carga `.env` ni acepta hosts remotos. Sus pruebas de triggers crean una versión sintética dentro de una transacción revertida: ninguna versión canónica se publica.

## Revisión visual y literalidad

`inspect-pages.mjs PDF 64,76 salida render` renderiza páginas completas; `fixture` guarda texto y líneas vectoriales para regresiones. `sheets` genera contactos de los primeros 500 puntos de cada página, únicamente para revisar encabezados/transiciones. El registro de QA identifica qué región fue revisada: no implica revisión humana individual de todos los elementos.

Las líneas vectoriales del PDF delimitan filas y columnas. Los subtítulos de indicadores se guardan en `source.subsection`, no se cuentan como indicadores. Las erratas contextuales documentadas en `source-anomalies.mjs` modifican metadatos de ámbito, nunca el texto curricular. Secundaria 449 contiene una capa de contenidos oculta bajo el panel de indicadores: se extrae la capa visible, conservando el texto bruto completo en su fixture. Los saltos y espacios de `originalText` se reconstruyen del layout; no se corrige ortografía ni se promete identidad byte a byte con el flujo interno del PDF.

## Cierre de revisión

1. Resolver cada error y pendiente contra la página fuente, incluyendo errores de encabezado presentes en el PDF. Registrar toda decisión manual con página y responsable; no ajustar grados por intuición.
2. Revisar muestras de primer y segundo ciclo de ambos niveles, varias áreas y una salida optativa; cotejar también secciones de índice y tablas con geometrías diferentes.
3. Reextraer y exigir matriz sin ámbitos faltantes, sin elementos obligatorios vacíos y sin páginas de malla no procesadas. Solo entonces revisar todos los elementos `PENDING` y autorizar `VALIDATED`/`PUBLISHED` mediante un paso separado de publicación.

No utilizar los catálogos resumidos existentes como fuente canónica. El catálogo global se separa de las asignaturas operativas por `curriculum_subject_mappings`, que se llenará con correspondencias revisadas por escuela.
