# Informe verificable de Fase A — AulaBase

Fecha de verificación: 27 de septiembre de 2026, America/Santo_Domingo.

## Dictamen

**Fase A parcialmente implementada; NO terminada ni aprobada.** Hay estructura de catálogo, extractor y borradores, pero la cobertura falla: 14 errores críticos en Primaria y 26 en Secundaria; 32 y 24 incidencias, respectivamente. Los 14.452 elementos están PENDING. Compilar y superar pruebas no valida la fidelidad curricular.

Este informe no implementa el recomendador, no modifica Actividades y no inicia Fase B. Durante esta auditoría solo se ejecutaron lecturas y verificaciones locales; el único archivo de entrega añadido es este informe. No se aplicaron migraciones, no se importaron catálogos, no se hicieron commits ni pushes.

Los JSONL/manifiestos guardados son de las 16:53:44/16:53:46. Hay cambios posteriores en el extractor (hasta las 16:56), sin reextracción: página impresa, sección de procedencia, estado de matriz y generación de muestras. Por ello no se afirma que el código actual reproduzca exactamente esos artefactos. No existen todavía los archivos .samples.json anunciados en README.

## 1. Rama exacta

`instrumentos-evaluacion`

## 2. Git status

Salida de `git status --porcelain=v1 -uall` antes de añadir este informe:

```text
 M apps/frontend/src/types/database.types.ts
 M packages/database/package.json
 M packages/database/prisma/schema.prisma
?? data/curriculum/primary-2023.coverage.json
?? data/curriculum/primary-2023.jsonl
?? data/curriculum/primary-2023.matrix.csv
?? data/curriculum/primary-2023.pending.json
?? data/curriculum/secondary-2023.coverage.json
?? data/curriculum/secondary-2023.jsonl
?? data/curriculum/secondary-2023.matrix.csv
?? data/curriculum/secondary-2023.pending.json
?? packages/database/src/import-curriculum.ts
?? scripts/curriculum/README.md
?? scripts/curriculum/curriculum.test.mjs
?? scripts/curriculum/extract.mjs
?? scripts/curriculum/layout.mjs
?? scripts/curriculum/malla.mjs
?? scripts/curriculum/primary.mjs
?? scripts/curriculum/query.mjs
?? scripts/curriculum/secondary.mjs
?? scripts/curriculum/survey.mjs
?? scripts/curriculum/validate.mjs
?? supabase/migrations/20260927202613_curricular_catalog.sql
```

Nada preparado en staging. Al entregar se añade además `?? docs/curriculum/informe-fase-a-2026-09-27.md`.

## 3. Último commit

SHA: `4f1adeb7925f4018f6224a7e013a577caaa7119d`.

Mensaje: `Consolida pestañas de materias y horario en Cursos`.

Es el commit anterior de Cursos/Horario, **no un commit de Fase A**. Los cambios curriculares no están commiteados.

## 4. Origin

La rama no tiene upstream configurado. `git ls-remote --heads origin instrumentos-evaluacion` terminó correctamente sin devolver referencias: **la rama no existe actualmente en origin**. No se ejecutó push.

## 5. Migraciones

Una nueva: `supabase/migrations/20260927202613_curricular_catalog.sql`.

Fue creada con el comando de generación de migraciones. No se ha aplicado en esta ejecución ni se ha probado contra PostgreSQL real. No se modificaron migraciones anteriores. No se consultó el historial remoto de migraciones durante esta auditoría; no se certifica el estado de una base externa.

## 6. Tablas/modelos curriculares

Son definiciones creadas en SQL/Prisma; no tablas cuya existencia en una base real haya sido verificada.

| Tabla SQL | Modelo Prisma | Propósito |
| --- | --- | --- |
| curriculum_versions | CurriculumVersion | Versión, nivel, estado y metadatos de importación |
| curriculum_documents | CurriculumDocument | Documento, SHA-256 y número de páginas |
| curriculum_scopes | CurriculumScope | Ciclo, grado, área, asignatura, modalidad y salida |
| curriculum_elements | CurriculumElement | Texto original, búsqueda, tipo y revisión |
| curriculum_element_relations | CurriculumElementRelation | Vínculos entre elementos |
| curriculum_source_spans | CurriculumSourceSpan | Página y coordenadas de procedencia |
| curriculum_subject_mappings | CurriculumSubjectMapping | Correspondencias con asignaturas operativas |

La migración declara RLS y permisos SELECT/INSERT/UPDATE/DELETE explícitos para app_backend en las siete tablas, claves foráneas, índices y protecciones para versiones publicadas. Son comprobaciones por lectura, no pruebas de seguridad en ejecución. No se implementó una API curricular ni se cargaron correspondencias por escuela. Los tipos frontend fueron ampliados manualmente; no son una introspección de una base migrada.

## 7. Pipeline/scripts

| Archivo | Función |
| --- | --- |
| scripts/curriculum/survey.mjs | Inspección de texto y posiciones por página |
| scripts/curriculum/layout.mjs | Reconstrucción geométrica, normalización e identificadores |
| scripts/curriculum/malla.mjs | Lectura de contenidos, competencias, criterios y encabezados |
| scripts/curriculum/primary.mjs | Adaptador de Primaria |
| scripts/curriculum/secondary.mjs | Adaptador de Secundaria y salidas optativas |
| scripts/curriculum/extract.mjs | Orquestación y escritura de JSONL/manifiestos/matriz/pendientes; muestras aún no generadas |
| scripts/curriculum/validate.mjs | Validación estructural y cobertura esperada |
| scripts/curriculum/query.mjs | Consulta local de un ámbito único; no recomendador |
| scripts/curriculum/curriculum.test.mjs | Cuatro pruebas unitarias |
| scripts/curriculum/README.md | Documentación de uso |
| packages/database/src/import-curriculum.ts | Importación transaccional por lotes, aún no ejecutada |

La idempotencia del importador existe como lógica (mismo digest: no-op; otro digest bajo mismo código: rechazo), pero no está probada por integración. Los IDs son deterministas para la misma segmentación; cambiar el orden de bloques del parser puede cambiarlos.

## 8. Datos intermedios y procedencia

Directorio relativo: `data/curriculum/`.

Por cada prefijo `primary-2023` y `secondary-2023` existen: `.jsonl`, `.coverage.json`, `.matrix.csv` y `.pending.json`. Los JSONL contienen versión, documento, ámbitos, elementos y relaciones. No hay .samples.json guardados.

Fuentes identificadas por SHA-256:

| Nivel | Archivo PDF | Páginas | SHA-256 |
| --- | --- | --- | --- |
| Primaria | lq58-adecuacion-curricular-primariapdf.pdf | 404 | d4341fd5f387b16333cdeaaa5b8e34b3468722bf17ca6d1a589854b205a9e427 |
| Secundaria | Ht7X-adecuacion-secundaria-2023pdf.pdf | 520 | 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58 |

Huellas de los artefactos auditados:

| Archivo | SHA-256 |
| --- | --- |
| C:\Users\alexa\OneDrive\Documents\Proyecto-educativo-v3\data\curriculum\primary-2023.coverage.json | 6389750e615c91c94ffa104aa60aae79f326aae47040e3d408c7bbc0d531819c |
| C:\Users\alexa\OneDrive\Documents\Proyecto-educativo-v3\data\curriculum\primary-2023.jsonl | 69e2e46898064b6b436370b6b58aece94b3d83940ee4123b7c371a4b3a5b99fe |
| C:\Users\alexa\OneDrive\Documents\Proyecto-educativo-v3\data\curriculum\primary-2023.pending.json | e01777c26127a1e165db319e50cbfc15507e7925b8821cdb6dd0c68039df6ace |
| C:\Users\alexa\OneDrive\Documents\Proyecto-educativo-v3\data\curriculum\secondary-2023.coverage.json | c155cdf3ba8654a3267ff78cdb2b4f8e7801e73db6f0572024aa38e28b246d6d |
| C:\Users\alexa\OneDrive\Documents\Proyecto-educativo-v3\data\curriculum\secondary-2023.jsonl | dc88ef585a2d60fb8b62fc0761f0f20ed6017278e029d1e67153e2e8c7e60698 |
| C:\Users\alexa\OneDrive\Documents\Proyecto-educativo-v3\data\curriculum\secondary-2023.pending.json | a5a423b8fa7b61eca842ffddffbbecee741ed6c6a5eeed9cfd374567d8379f44 |

Las páginas citadas a continuación son posiciones PDF, comenzando en 1. En el snapshot guardado la página impresa se calculaba como PDF menos uno; no debe darse por verificada globalmente. Para los seis ejemplos sí coincide con el número leído en la página fuente. No hubo renderizado/QA visual del PDF; el cotejo fue contra su capa de texto.

## 9. Manifiesto completo de cobertura de PRIMARIA

Versión: `MINERD_PRIMARIA_2023`. Estado del manifiesto: `VALIDATION_FAILED`.

| Métrica | Resultado |
| --- | --- |
| Ciclos | 1, 2 |
| Grados | 1, 2, 3, 4, 5, 6 |
| Áreas distintas | 8 |
| Asignaturas distintas (nombres) | 8 |
| Ámbitos totales (incluidos los de ciclo sin grado) | 58 |
| Ámbitos con grado presentes / esperados | 44 / 45 |
| Competencias fundamentales (ocurrencias) | 315 |
| Competencias específicas | 183 |
| Criterios explícitos clasificados | 149 |
| Indicadores | 369 |
| Conceptos | 1492 |
| Procedimientos | 2411 |
| Actitudes/valores | 793 |
| Total de registros curriculares | 5712 |
| Relaciones | 315 |
| Páginas recorridas por la extracción | 404 |
| Páginas identificadas como malla | 204 |
| Páginas con al menos un elemento | 231 |
| Páginas sin elementos (no equivale a páginas erróneas) | 173 |
| Incidencias pendientes registradas | 32 |
| Elementos pendientes de revisión | 5712 |
| Errores críticos | 14 |

Áreas: Ciencias Sociales; Ciencias de la Naturaleza; Educación Artística; Educación Física; Formación Integral Humana y Religiosa; Lengua Española; Lenguas Extranjeras-inglés; Matemática.

Asignaturas: Lengua Española; Matemática; Ciencias Sociales; Ciencias de la Naturaleza; Educación Física; Formación Integral Humana y Religiosa; Educación Artística; Lenguas Extranjeras-inglés.

Los conteos son registros producidos por segmentación, no un conteo certificado de unidades curriculares únicas. Las competencias fundamentales se repiten por contexto; no significan 315 competencias fundamentales distintas. “Páginas recorridas” tampoco significa cobertura exhaustiva: el detector puede omitir páginas sin encabezados reconocidos. Los criterios fueron clasificados desde secciones explícitas, sin derivarlos de indicadores, pero siguen pendientes de revisión.

## 10. Manifiesto completo de cobertura de SECUNDARIA

Versión: `MINERD_SECUNDARIA_2023`. Estado del manifiesto: `VALIDATION_FAILED`.

| Métrica | Resultado |
| --- | --- |
| Ciclos | 1, 2 |
| Grados | 1, 2, 3, 4, 5, 6 |
| Áreas distintas | 8 |
| Asignaturas distintas (nombres) | 24 |
| Ámbitos totales (incluidos los de ciclo sin grado) | 88 |
| Ámbitos con grado presentes / esperados | 71 / 72 |
| Competencias fundamentales (ocurrencias) | 398 |
| Competencias específicas | 398 |
| Criterios explícitos clasificados | 391 |
| Indicadores | 1462 |
| Conceptos | 2646 |
| Procedimientos | 2552 |
| Actitudes/valores | 893 |
| Total de registros curriculares | 8740 |
| Relaciones | 398 |
| Páginas recorridas por la extracción | 520 |
| Páginas identificadas como malla | 284 |
| Páginas con al menos un elemento | 341 |
| Páginas sin elementos (no equivale a páginas erróneas) | 179 |
| Incidencias pendientes registradas | 24 |
| Elementos pendientes de revisión | 8740 |
| Errores críticos | 26 |

Áreas: Ciencias Sociales; Ciencias de la Naturaleza; Educación Artística; Educación Física; Formación Integral Humana y Religiosa; Lengua Española; Lenguas Extranjeras; Matemática.

Asignaturas: Lengua Española; Inglés; Francés; Matemática; Ciencias Sociales; Ciencias de la Naturaleza; Educación Artística; Educación Física; Formación Integral Humana y Religiosa; Apreciación y Producción Literarias; Análisis y Producción de Textos Periodísticos y Publicitarios; Manejo de la información en inglés; Apreciación de la Literatura Anglófona; Análisis Crítico y Evaluación de Textos en Inglés; Análisis y Producción de Textos Científicos y Profesionales; Filosofía social y Pensamiento Dominicano; Geografía Humana y Demografía; Ciudadanía y Democracia Participativa; Matemática Financiera y Tecnología; Estadística Probabilidad y Tecnología; Tigonometría, Cálculo Diferencial y Tecnología; Biología y Computación; Química y Computación; Física y Computación.

Los conteos son registros producidos por segmentación, no un conteo certificado de unidades curriculares únicas. Las competencias fundamentales se repiten por contexto; no significan 398 competencias fundamentales distintas. “Páginas recorridas” tampoco significa cobertura exhaustiva: el detector puede omitir páginas sin encabezados reconocidos. Los criterios fueron clasificados desde secciones explícitas, sin derivarlos de indicadores, pero siguen pendientes de revisión.

## 11. Cuatro salidas optativas académicas

Todas están representadas en el segundo ciclo, grados 4, 5 y 6. Presencia no significa cobertura validada.

| Salida | Ámbitos | Fundamentales | Específicas | Criterios | Conceptos | Procedimientos | Indicadores | Actitudes | Páginas con elementos |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Humanidades y Lenguas Modernas | 6 | 42 | 42 | 0 | 432 | 295 | 136 | 45 | 34 |
| Humanidades y Ciencias Sociales | 6 | 42 | 42 | 0 | 197 | 243 | 126 | 70 | 28 |
| Matemática y Tecnología | 3 | 21 | 21 | 0 | 55 | 56 | 63 | 15 | 7 |
| Ciencias y Tecnología | 3 | 21 | 21 | 0 | 56 | 50 | 20 | 19 | 4 |

### Humanidades y Lenguas Modernas

| Grado | Asignatura | Página PDF de tabla de asignación |
| --- | --- | --- |
| 4 | Apreciación y Producción Literarias | 427 |
| 5 | Apreciación y Producción Literarias | 427 |
| 6 | Análisis y Producción de Textos Periodísticos y Publicitarios | 427 |
| 4 | Manejo de la información en inglés | 427 |
| 5 | Apreciación de la Literatura Anglófona | 427 |
| 6 | Análisis Crítico y Evaluación de Textos en Inglés | 427 |

Páginas con elementos: 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460.

### Humanidades y Ciencias Sociales

| Grado | Asignatura | Página PDF de tabla de asignación |
| --- | --- | --- |
| 4 | Apreciación y Producción Literarias | 461 |
| 5 | Apreciación y Producción Literarias | 461 |
| 6 | Análisis y Producción de Textos Científicos y Profesionales | 461 |
| 4 | Filosofía social y Pensamiento Dominicano | 461 |
| 5 | Geografía Humana y Demografía | 461 |
| 6 | Ciudadanía y Democracia Participativa | 461 |

Páginas con elementos: 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489.

### Matemática y Tecnología

| Grado | Asignatura | Página PDF de tabla de asignación |
| --- | --- | --- |
| 4 | Matemática Financiera y Tecnología | 490 |
| 5 | Estadística Probabilidad y Tecnología | 490 |
| 6 | Tigonometría, Cálculo Diferencial y Tecnología | 490 |

Páginas con elementos: 491, 492, 493, 494, 495, 496, 497.

### Ciencias y Tecnología

| Grado | Asignatura | Página PDF de tabla de asignación |
| --- | --- | --- |
| 4 | Biología y Computación | 498 |
| 5 | Química y Computación | 498 |
| 6 | Física y Computación | 498 |

Páginas con elementos: 499, 504, 506, 511.


Humanidades y Lenguas Modernas, Humanidades y Ciencias Sociales y Matemática y Tecnología tienen los tipos obligatorios detectados por el validador en sus ámbitos, pero no están revisadas. Ciencias y Tecnología tiene solo cuatro páginas con elementos: faltan indicadores de Química y Computación (5.º) y Física y Computación (6.º). No puede declararse completa ninguna salida. El cero de criterios significa cero registros extraídos como EVALUATION_CRITERION en estos ámbitos, no una afirmación de que el PDF carezca de criterios. Se conserva “Tigonometría” tal como aparece en el metadato transcrito; no se corrigió a “Trigonometría”.

## 12. Matriz completa de cobertura

Se muestran los 115 ámbitos con grado guardados y dos ámbitos esperados ausentes: 117 filas. Los ámbitos de ciclo sin grado no se convierten artificialmente en filas de un grado.

Estado: **PENDIENTE** = satisface presencia de tipos obligatorios según la revalidación local, sin aprobación humana; **BLOQUEADO** = falta tipo obligatorio o existe incidencia en una página de sus elementos; **NO EXTRAÍDO** = ámbito esperado ausente. Se añade el estado del manifiesto guardado, porque su regla antigua era menos estricta. El estado recalculado no sobrescribe los archivos.

| Nivel | Ciclo | Grado | Área / Asignatura | Salida | Conceptos | Procedimientos | Indicadores | Estado auditado | Estado guardado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primaria | 1 | 1 | Ciencias de la Naturaleza | Común | 56 | 30 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 1 | Ciencias Sociales | Común | 24 | 73 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 1 | Educación Artística | Común | 14 | 16 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 1 | Educación Física | Común | 10 | 16 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 1 | Formación Integral Humana y Religiosa | Común | 15 | 31 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 1 | Lengua Española | Común | 60 | 233 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 1 | Matemática | Común | 23 | 22 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 2 | Ciencias de la Naturaleza | Común | 43 | 36 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 2 | Ciencias Sociales | Común | 19 | 52 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 2 | Educación Artística | Común | 24 | 20 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 2 | Educación Física | Común | 9 | 16 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 2 | Formación Integral Humana y Religiosa | Común | 22 | 35 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 2 | Lengua Española | Común | 88 | 258 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 2 | Matemática | Común | 21 | 37 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 3 | Ciencias de la Naturaleza | Común | 65 | 38 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 3 | Ciencias Sociales | Común | 19 | 55 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 3 | Educación Física | Común | 8 | 15 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 3 | Formación Integral Humana y Religiosa | Común | 13 | 16 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 3 | Lengua Española | Común | 141 | 226 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 1 | 3 | Matemática | Común | 52 | 55 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 2 | 4 | Ciencias de la Naturaleza | Común | 44 | 37 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Ciencias Sociales | Común | 37 | 75 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Educación Artística | Común | 29 | 31 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Educación Física | Común | 11 | 22 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Formación Integral Humana y Religiosa | Común | 13 | 41 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Lengua Española | Común | 52 | 118 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Lenguas Extranjeras-inglés | Común | 73 | 48 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 4 | Matemática | Común | 6 | 27 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Ciencias de la Naturaleza | Común | 13 | 12 | 0 | BLOQUEADO | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Ciencias Sociales | Común | 48 | 130 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Educación Artística | Común | 22 | 29 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 2 | 5 | Educación Física | Común | 11 | 20 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Formación Integral Humana y Religiosa | Común | 17 | 50 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Lengua Española | Común | 95 | 146 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Lenguas Extranjeras-inglés | Común | 73 | 56 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 5 | Matemática | Común | 38 | 25 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Ciencias de la Naturaleza | Común | 50 | 45 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Ciencias Sociales | Común | 48 | 109 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Educación Artística | Común | 21 | 16 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Educación Física | Común | 8 | 11 | 0 | BLOQUEADO | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Formación Integral Humana y Religiosa | Común | 22 | 41 | 9 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Lengua Española | Común | 9 | 12 | 9 | BLOQUEADO | PENDING_REVIEW |
| Primaria | 2 | 6 | Lenguas Extranjeras-inglés | Común | 9 | 12 | 0 | BLOQUEADO | EXTRACTED_PENDING_REVIEW |
| Primaria | 2 | 6 | Matemática | Común | 17 | 18 | 9 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 1 | Ciencias de la Naturaleza | Común | 26 | 15 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 1 | Ciencias Sociales | Común | 67 | 71 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 1 | Educación Artística | Común | 19 | 17 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 1 | Educación Física | Común | 26 | 42 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 1 | Formación Integral Humana y Religiosa | Común | 24 | 53 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 1 | Lengua Española | Común | 61 | 30 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 1 | Lenguas Extranjeras / Inglés | Común | 93 | 55 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 1 | Lenguas Extranjeras / Francés | Común | 14 | 43 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 1 | Matemática | Común | 26 | 26 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 2 | Ciencias de la Naturaleza | Común | 21 | 14 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 2 | Ciencias Sociales | Común | 64 | 65 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 2 | Educación Artística | Común | 25 | 18 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 2 | Educación Física | Común | 19 | 6 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 2 | Formación Integral Humana y Religiosa | Común | 22 | 45 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 2 | Lengua Española | Común | 67 | 5 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 2 | Lenguas Extranjeras / Inglés | Común | 84 | 59 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 2 | Lenguas Extranjeras / Francés | Común | 18 | 47 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 2 | Matemática | Común | 10 | 26 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Ciencias de la Naturaleza | Común | 22 | 16 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Ciencias Sociales | Común | 48 | 53 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Educación Artística | Común | 22 | 15 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Educación Física | Común | 20 | 30 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Lengua Española | Común | 81 | 3 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 1 | 3 | Lenguas Extranjeras / Inglés | Común | 58 | 47 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Lenguas Extranjeras / Francés | Común | 23 | 51 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 1 | 3 | Matemática | Común | 15 | 1 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Ciencias de la Naturaleza | Común | 24 | 22 | 26 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Ciencias de la Naturaleza / Biología y Computación | Ciencias y Tecnología | 22 | 20 | 20 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Ciencias Sociales | Común | 69 | 77 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Ciencias Sociales / Filosofía social y Pensamiento Dominicano | Humanidades y Ciencias Sociales | 31 | 25 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Educación Artística | Común | 25 | 12 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Educación Física | Común | 33 | 39 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Formación Integral Humana y Religiosa | Común | 27 | 64 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 4 | Lengua Española | Común | 77 | 91 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 4 | Lengua Española / Apreciación y Producción Literarias | Humanidades y Ciencias Sociales | 28 | 28 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Lengua Española / Apreciación y Producción Literarias | Humanidades y Lenguas Modernas | 46 | 29 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Lenguas Extranjeras / Inglés | Común | 37 | 47 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Lenguas Extranjeras / Francés | Común | 34 | 32 | 5 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Lenguas Extranjeras / Manejo de la información en inglés | Humanidades y Lenguas Modernas | 107 | 57 | 31 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 4 | Matemática | Común | 2 | 19 | 22 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 4 | Matemática / Matemática Financiera y Tecnología | Matemática y Tecnología | 26 | 27 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Ciencias de la Naturaleza | Común | 0 | 0 | 27 | BLOQUEADO | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Ciencias de la Naturaleza / Química y Computación | Ciencias y Tecnología | 18 | 15 | 0 | BLOQUEADO | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Ciencias Sociales | Común | 91 | 91 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Ciencias Sociales / Geografía Humana y Demografía | Humanidades y Ciencias Sociales | 44 | 36 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Educación Artística | Común | 0 | 0 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 5 | Educación Física | Común | 29 | 41 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Formación Integral Humana y Religiosa | Común | 24 | 52 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Lengua Española | Común | 11 | 1 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 5 | Lengua Española / Apreciación y Producción Literarias | Humanidades y Ciencias Sociales | 22 | 39 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Lengua Española / Apreciación y Producción Literarias | Humanidades y Lenguas Modernas | 27 | 45 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Lenguas Extranjeras / Inglés | Común | 50 | 51 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Lenguas Extranjeras / Francés | Común | 37 | 49 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 5 | Lenguas Extranjeras / Apreciación de la Literatura Anglófona | Humanidades y Lenguas Modernas | 111 | 46 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Matemática | Común | 7 | 19 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 5 | Matemática / Estadística Probabilidad y Tecnología | Matemática y Tecnología | 23 | 20 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Ciencias de la Naturaleza | Común | 21 | 20 | 28 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Ciencias de la Naturaleza / Física y Computación | Ciencias y Tecnología | 16 | 15 | 0 | BLOQUEADO | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Ciencias Sociales | Común | 86 | 79 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Ciencias Sociales / Ciudadanía y Democracia Participativa | Humanidades y Ciencias Sociales | 20 | 24 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Educación Artística | Común | 21 | 20 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Educación Física | Común | 28 | 54 | 22 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Formación Integral Humana y Religiosa | Común | 28 | 52 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Lengua Española | Común | 76 | 18 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 6 | Lengua Española / Análisis y Producción de Textos Científicos y Profesionales | Humanidades y Ciencias Sociales | 52 | 91 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Lengua Española / Análisis y Producción de Textos Periodísticos y Publicitarios | Humanidades y Lenguas Modernas | 51 | 67 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Lenguas Extranjeras / Inglés | Común | 52 | 52 | 21 | BLOQUEADO | PENDING_REVIEW |
| Secundaria | 2 | 6 | Lenguas Extranjeras / Francés | Común | 31 | 31 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Lenguas Extranjeras / Análisis Crítico y Evaluación de Textos en Inglés | Humanidades y Lenguas Modernas | 90 | 51 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Matemática | Común | 11 | 22 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Secundaria | 2 | 6 | Matemática / Tigonometría, Cálculo Diferencial y Tecnología | Matemática y Tecnología | 6 | 9 | 21 | PENDIENTE | EXTRACTED_PENDING_REVIEW |
| Primaria | 1 | 3 | Educación Artística | Común | 0 | 0 | 0 | NO EXTRAÍDO | Sin fila |
| Secundaria | 1 | 3 | Formación Integral Humana y Religiosa | Común | 0 | 0 | 0 | NO EXTRAÍDO | Sin fila |

## 13. Seis ejemplos reales con trazabilidad

Estos ejemplos se leen del JSONL y se cotejaron con la capa de texto de las páginas fuente completas durante la auditoría. No constituyen validación del resto del catálogo. Se conserva el texto del registro con sus saltos de línea; no se corrigen erratas.

### Primaria Primer Ciclo

```text
Expresa y comprende, de forma oral y escrita en diferentes contextos, textos funcionales
y literarios muy sencillos y de estructura sintáctica simple, mediante el uso de medios y
recursos apropiados, demostrando avance progresivo en sus procesos lectura y escritura
```

- Tipo: `SPECIFIC_COMPETENCY`.
- Nivel: PRIMARY; ciclo: 1; grado: 1.
- Área: Lengua Española; asignatura: Lengua Española.
- Salida: No aplica.
- Página PDF: 64; impresa leída en la fuente: 63.
- ID: `71a00573-40b4-5ab7-933d-5d33d32fb3b0`.
- Ámbito: `PRIMARY/1/1/lengua espanola/lengua espanola/all/all`.
- Coordenadas: `{"x0":193.14,"y0":644.46,"x1":540.97965,"y1":680.46}`.
- Relaciones principales: `EXPLICITLY_LINKED`: “Comunicativa” (`252b9ee0-0995-5522-9f17-e3f8cdeaa6f9`) → este elemento.
- Revisión: PENDING.

### Primaria Segundo Ciclo

```text
Expresa ideas en lenguaje matemático con la finalidad de discutir situaciones de problemas
del contexto.
```

- Tipo: `SPECIFIC_COMPETENCY`.
- Nivel: PRIMARY; ciclo: 2; grado: 4.
- Área: Matemática; asignatura: Matemática.
- Salida: No aplica.
- Página PDF: 268; impresa leída en la fuente: 267.
- ID: `3ed4286b-5f7c-580e-9f81-62d8748c94d9`.
- Ámbito: `PRIMARY/2/4/matematica/matematica/all/all`.
- Coordenadas: `{"x0":214.6875,"y0":643.9035,"x1":555.6057000000003,"y1":667.9035}`.
- Relaciones principales: `EXPLICITLY_LINKED`: “Comunicativa” (`e547898e-1e5d-592b-93af-ca74b8b014ba`) → este elemento.
- Revisión: PENDING.

### Secundaria Primer Ciclo

```text
Se comunica con claridad en diferentes contextos, siguiendo los procesos de compresión y producción
oral y escrita, con creatividad, al emplear adecuadamente un tipo de texto (funcional o literario), las TIC, así
como otros recursos y medios.
```

- Tipo: `SPECIFIC_COMPETENCY`.
- Nivel: SECONDARY; ciclo: 1; grado: 1.
- Área: Lengua Española; asignatura: Lengua Española.
- Salida: No aplica.
- Página PDF: 69; impresa leída en la fuente: 68.
- ID: `7c05dbb1-1a83-5a8a-b145-8d5a9c46830f`.
- Ámbito: `SECONDARY/1/1/lengua espanola/lengua espanola/all/all`.
- Coordenadas: `{"x0":185.94340000000003,"y0":649.5479999999999,"x1":562.5421000000007,"y1":680.544}`.
- Relaciones principales: `EXPLICITLY_LINKED`: “Comunicativa” (`d9f38b5a-84fd-5086-8557-f7334a60a388`) → este elemento.
- Revisión: PENDING.

### Secundaria Segundo Ciclo

```text
Geometría:
```

- Tipo: `CONCEPT`.
- Nivel: SECONDARY; ciclo: 2; grado: 4.
- Área: Matemática; asignatura: Matemática.
- Salida: No aplica.
- Página PDF: 229; impresa leída en la fuente: 228.
- ID: `7987a1e8-a03f-57b0-bc2c-848e7bde1d9c`.
- Ámbito: `SECONDARY/2/4/matematica/matematica/all/all`.
- Coordenadas: `{"x0":49.13109999999995,"y0":474.99700000000007,"x1":92.53809999999994,"y1":483.99700000000007}`.
- Relaciones principales: No tiene relaciones explícitas entre elementos guardadas; está vinculado a su ámbito y documento. No se inventó una relación con una competencia.
- Revisión: PENDING.

### Optativa académica

```text
Comunica sus producciones literarias específicas, tales como poesías románticas, novelas de viajes y aventuras
en situaciones diversas, a través de recursos tecnológicos y de otros tipos, evidenciado dominio, apreciación y
creatividad en el empleo de esos textos.
```

- Tipo: `SPECIFIC_COMPETENCY`.
- Nivel: SECONDARY; ciclo: 2; grado: 4.
- Área: Lengua Española; asignatura: Apreciación y Producción Literarias.
- Salida: Humanidades y Lenguas Modernas.
- Página PDF: 427; impresa leída en la fuente: 426.
- ID: `81188c6f-8e77-5fbc-a33c-8a72c14086e2`.
- Ámbito: `SECONDARY/2/4/lengua espanola/apreciacion y produccion literarias/academica/humanidades y lenguas modernas`.
- Coordenadas: `{"x0":172.478,"y0":447.522,"x1":562.7531000000001,"y1":478.518}`.
- Relaciones principales: `EXPLICITLY_LINKED`: “Comunicativa” (`5eaf9f5f-b027-5e97-8641-dbfc991ddf72`) → este elemento.
- Revisión: PENDING.

### Otra área: Ciencias Sociales

```text
Identifica informaciones familiares, escolares y comunitarias; con la finalidad de conocer su
entorno y relacionar el presente con el pasado.
```

- Tipo: `SPECIFIC_COMPETENCY`.
- Nivel: PRIMARY; ciclo: 1; grado: 1.
- Área: Ciencias Sociales; asignatura: Ciencias Sociales.
- Salida: No aplica.
- Página PDF: 136; impresa leída en la fuente: 135.
- ID: `93f08ac7-f066-5d14-b035-b6e54a9d899a`.
- Ámbito: `PRIMARY/1/1/ciencias sociales/ciencias sociales/all/all`.
- Coordenadas: `{"x0":193.14,"y0":660.9451,"x1":549.9201,"y1":684.9451}`.
- Relaciones principales: `EXPLICITLY_LINKED`: “Comunicativa” (`e6664fd1-6586-55f8-9aed-75dcbbee1296`) → este elemento.
- Revisión: PENDING.

El concepto “Geometría:” sí está extraído en Matemática de 4.º de Secundaria. En esa misma página PDF 229 hay competencias específicas en la fuente que el parser no extrajo: evidencia concreta de una omisión, no ausencia en el currículo.

## 14. Pendientes, ambiguos, no extraídos y cobertura parcial

### Alcance exacto de esta lista

La lista siguiente reproduce **todas las incidencias y errores detectados** en los manifiestos guardados. No es un inventario exhaustivo de todo texto curricular omitido: ese inventario todavía no existe. Por tanto, no sería veraz afirmar que estos son los únicos huecos.

Todos los 5.712 elementos de Primaria y 8.740 de Secundaria están PENDING. La lista exacta por ID es el conjunto completo de registros `kind=element` en ambos JSONL; ninguno figura como REVIEWED.

### Primaria: 14 errores críticos

```text
EXPECTED_SCOPE_MISSING:3:Educación Artística:Educación Artística:
SCOPE_ELEMENT_MISSING:PRIMARY/2/5/ciencias de la naturaleza/ciencias de la naturaleza/all/all:ACHIEVEMENT_INDICATOR
SCOPE_ELEMENT_MISSING:PRIMARY/2/6/educacion fisica/educacion fisica/all/all:ACHIEVEMENT_INDICATOR
SCOPE_ELEMENT_MISSING:PRIMARY/2/6/lenguas extranjeras ingles/lenguas extranjeras ingles/all/all:ACHIEVEMENT_INDICATOR
MALLA_PAGE_EMPTY:207
MALLA_PAGE_EMPTY:221
MALLA_PAGE_EMPTY:222
MALLA_PAGE_EMPTY:319
MALLA_PAGE_EMPTY:320
MALLA_PAGE_EMPTY:321
MALLA_PAGE_EMPTY:348
MALLA_PAGE_EMPTY:349
MALLA_PAGE_EMPTY:363
MALLA_PAGE_EMPTY:364
```

### Primaria: 32 incidencias pendientes/ambiguas

| N.º | Página PDF | Código | Detalle exacto adicional |
| --- | --- | --- | --- |
| 1 | 43 | UNRESOLVED_GRADE_HEADER | {} |
| 2 | 64 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 3 | 91 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 4 | 116 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":4} |
| 5 | 118 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 6 | 118 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":4} |
| 7 | 121 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":4} |
| 8 | 185 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 9 | 200 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":4} |
| 10 | 207 | GRADE_REGRESSION | {"headerGrade":2,"previousGrade":3,"areaName":"Formación Integral Humana y Religiosa"} |
| 11 | 207 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 12 | 217 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 13 | 219 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":4} |
| 14 | 221 | HEADER_CHAPTER_AREA_CONFLICT | {"headerArea":"Educación Física","chapterArea":"Educación Artística"} |
| 15 | 221 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 16 | 222 | HEADER_CHAPTER_AREA_CONFLICT | {"headerArea":"Educación Física","chapterArea":"Educación Artística"} |
| 17 | 222 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 18 | 251 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 19 | 274 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 20 | 319 | GRADE_REGRESSION | {"headerGrade":4,"previousGrade":5,"areaName":"Ciencias de la Naturaleza"} |
| 21 | 319 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 22 | 320 | GRADE_REGRESSION | {"headerGrade":4,"previousGrade":5,"areaName":"Ciencias de la Naturaleza"} |
| 23 | 320 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 24 | 321 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 25 | 348 | GRADE_REGRESSION | {"headerGrade":5,"previousGrade":6,"areaName":"Lenguas Extranjeras-inglés"} |
| 26 | 348 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 27 | 349 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 28 | 363 | GRADE_REGRESSION | {"headerGrade":5,"previousGrade":6,"areaName":"Educación Física"} |
| 29 | 363 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 30 | 364 | PRIMARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 31 | 396 | COMPETENCY_ROW_WITHOUT_SPECIFIC | {"row":2} |
| 32 | 403 | UNRESOLVED_GRADE_HEADER | {} |

### Secundaria: 26 errores críticos

```text
SCOPE_ELEMENT_MISSING:SECONDARY/1/1/lenguas extranjeras/frances/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/1/1/ciencias de la naturaleza/ciencias de la naturaleza/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/1/2/lengua espanola/lengua espanola/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/1/2/lenguas extranjeras/frances/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/1/2/formacion integral humana y religiosa/formacion integral humana y religiosa/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/1/3/lengua espanola/lengua espanola/all/all:SPECIFIC_COMPETENCY
EXPECTED_SCOPE_MISSING:3:Formación Integral Humana y Religiosa:Formación Integral Humana y Religiosa:
SCOPE_ELEMENT_MISSING:SECONDARY/2/4/lengua espanola/lengua espanola/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/4/matematica/matematica/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/4/formacion integral humana y religiosa/formacion integral humana y religiosa/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/lengua espanola/lengua espanola/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/lenguas extranjeras/frances/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/ciencias de la naturaleza/ciencias de la naturaleza/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/ciencias de la naturaleza/ciencias de la naturaleza/all/all:CONCEPT
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/ciencias de la naturaleza/ciencias de la naturaleza/all/all:PROCEDURE
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/educacion artistica/educacion artistica/all/all:CONCEPT
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/educacion artistica/educacion artistica/all/all:PROCEDURE
SCOPE_ELEMENT_MISSING:SECONDARY/2/6/lengua espanola/lengua espanola/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/6/lenguas extranjeras/ingles/all/all:SPECIFIC_COMPETENCY
SCOPE_ELEMENT_MISSING:SECONDARY/2/5/ciencias de la naturaleza/quimica y computacion/academica/ciencias y tecnologia:ACHIEVEMENT_INDICATOR
SCOPE_ELEMENT_MISSING:SECONDARY/2/6/ciencias de la naturaleza/fisica y computacion/academica/ciencias y tecnologia:ACHIEVEMENT_INDICATOR
MALLA_PAGE_EMPTY:345
MALLA_PAGE_EMPTY:401
MALLA_PAGE_EMPTY:402
MALLA_PAGE_EMPTY:403
MALLA_PAGE_EMPTY:404
```

### Secundaria: 24 incidencias pendientes/ambiguas

| N.º | Página PDF | Código | Detalle exacto adicional |
| --- | --- | --- | --- |
| 1 | 48 | UNRESOLVED_GRADE_HEADER | {} |
| 2 | 49 | UNRESOLVED_GRADE_HEADER | {} |
| 3 | 50 | UNRESOLVED_GRADE_HEADER | {} |
| 4 | 76 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 5 | 82 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 6 | 96 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 7 | 105 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 8 | 113 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 9 | 126 | UNRESOLVED_GRADE_HEADER | {} |
| 10 | 169 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 11 | 181 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 12 | 185 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 13 | 203 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 14 | 229 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 15 | 293 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 16 | 344 | CONTENT_HEADERS_INCOMPLETE | {} |
| 17 | 345 | CONTENT_HEADERS_INCOMPLETE | {} |
| 18 | 397 | COMPETENCY_HEADERS_INCOMPLETE | {} |
| 19 | 401 | UNRESOLVED_GRADE_HEADER | {} |
| 20 | 401 | SECONDARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 21 | 402 | SECONDARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 22 | 403 | SECONDARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 23 | 404 | SECONDARY_MALLA_WITHOUT_GRADE_CONTEXT | {} |
| 24 | 413 | COMPETENCY_HEADERS_INCOMPLETE | {} |

### Limitaciones adicionales conocidas

- Los encabezados conflictivos de Primaria (área del capítulo frente a encabezado; regresiones de grado) quedaron sin resolver; no se reasignaron por intuición. Debe determinarse con revisión de la fuente si hay errata editorial o fallo de lectura.
- Secundaria: faltan competencias específicas en 14 ámbitos; Ciencias de la Naturaleza 5.º y Educación Artística 5.º no tienen conceptos/procedimientos extraídos; faltan los dos indicadores optativos antes detallados.
- Los ámbitos totalmente ausentes son Educación Artística 3.º de Primaria y Formación Integral Humana y Religiosa 3.º de Secundaria.
- Los criterios de ciclo no tienen todavía correspondencias completas con competencias específicas; conceptos, procedimientos e indicadores no forman un grafo curricular semántico completo.
- No hay inventario exhaustivo por página de todo lo no extraído, ni garantía de que todas las páginas de malla hayan sido detectadas.
- El muestreo adicional de Ciencias Sociales 1.º de Secundaria mostró un bloque que une la competencia comunicativa con el comienzo de la siguiente (“Relaciona a través de propuestas…”), ID `f3ba7ff1-fb7f-5453-aba5-5a12712a6358`, página PDF 244. Es una anomalía de segmentación detectada en esta auditoría, no incluida en las 24 incidencias guardadas.
- No se ha verificado equivalencia visual de columnas y celdas para todo el documento. Faltan pruebas de regresión del parser con páginas reales variadas.
- Cambios recientes de extracción y muestras aún no ejecutados; documentación y snapshot no están sincronizados.
- Migración, RLS, triggers, importación y repetición idempotente no probados en una base real. No hay integración de consulta curricular en backend ni mappings operativos cargados.
- No se implementó búsqueda morfológica singular/plural; solo normalización textual. La normalización de campos de búsqueda del importador no es exactamente la misma función que la consulta local.
- El importador comprueba código de versión y hash documental del manifiesto, pero no recalcula toda la validación; no constituye una barrera independiente de publicación. Las restricciones de DB no sustituyen revisión humana.

## 15. Tests, typecheck, build y validadores

Verificaciones ejecutadas nuevamente el 27/09/2026 sobre este árbol de trabajo:

| Comando / comprobación | Resultado |
| --- | --- |
| pnpm --filter backend test | PASS: 24 archivos, 135 tests |
| pnpm --filter frontend test | PASS: 59 archivos, 273 tests |
| node --test scripts/curriculum/curriculum.test.mjs | PASS: 4 tests |
| pnpm --filter @aula/database exec tsc --noEmit | PASS: código de salida 0 |
| pnpm --filter backend build | PASS: tsc -p tsconfig.build.fix.json; incluye chequeo de tipos |
| pnpm --filter frontend build | PASS: tsc -b y vite build; incluye chequeo de tipos |
| pnpm cloudflare:build | PASS: 4 paquetes compilados; wrangler deploy --dry-run terminó con código 0; sin despliegue |
| pnpm --filter @aula/database exec prisma validate | PASS: esquema válido; URL ficticia local, sin conexión a DB |
| Manifiesto Primaria guardado | FAIL: 14 errores críticos, 32 incidencias |
| Manifiesto Secundaria guardado | FAIL: 26 errores críticos, 24 incidencias |
| Revalidación estructural actual de JSONL, sin reescaneo de PDF | FAIL: Primaria 4 errores de ámbito/tipo; Secundaria 21. Las 10/5 páginas MALLA_PAGE_EMPTY se conservan como evidencia del manifiesto, no se revalidaron en este comando |
| Migración/importación/RLS/idempotencia en DB | NO EJECUTADO |
| Reextracción completa con el último código | NO EJECUTADA |

Advertencia no bloqueante de frontend: un chunk supera 700 kB tras minificación (catálogo secundario existente, aproximadamente 1.184 kB). Los tests unitarios del extractor cubren identidad, columnas con fixture, asignación de optativas y validación de duplicados/orfandad/procedencia; no certifican fidelidad de 924 páginas.

El revalidador se ejecutó sobre versión/documento/ámbitos/elementos/relaciones leídos del JSONL, pendientes tomados del manifiesto y `mallaPages=[]`. Por eso sus 4/21 errores no reemplazan ni “resuelven” los 14/26 del manifiesto. No se regeneraron los datasets para ocultar diferencias.

## 16. Archivos modificados/creados

El listado exacto de Fase A es el de git status en la sección 2: **3 archivos versionados modificados y 20 archivos nuevos sin seguimiento**.

- Modificados: `apps/frontend/src/types/database.types.ts`, `packages/database/package.json`, `packages/database/prisma/schema.prisma`.
- Nuevos: 8 artefactos en data/curriculum; 10 archivos en scripts/curriculum; import-curriculum.ts; migración SQL.
- Añadido exclusivamente para esta entrega: `docs/curriculum/informe-fase-a-2026-09-27.md` (21.º archivo nuevo).
- Los builds generaron salidas locales ignoradas por Git. No hubo cambios en código de Actividades, recomendador ni UI durante esta auditoría.

## 17. Extracción literal frente a generación/inferencia/corrección

**No puedo confirmar una extracción 100 % literal y libre de inferencias.** No se generó prosa curricular mediante un modelo ni se completaron competencias/criterios ausentes con contenido inventado; sí hay transformaciones y atribuciones automáticas:

1. originalText se reconstruye a partir de fragmentos geométricos: se insertan espacios/saltos, se segmentan bloques y se eliminan encabezados; puede haber mezcla o truncamiento.
2. Las competencias fundamentales agrupadas se separan y limpian; el resultado no es una copia byte a byte de la celda.
3. normalizedText quita tildes, puntuación y diferencias de mayúsculas para búsqueda.
4. Área/grado/ciclo se atribuyen por encabezados, rangos y contexto que continúa entre páginas. Los vínculos EXPLICITLY_LINKED dependen de heurísticas de alineación de filas, no de una revisión humana.
5. Las 18 asignaciones de optativas y sus rangos se transcribieron/configuraron manualmente a partir de las tablas fuente; son metadatos, no elementos inventados.
6. Hay normalización de nombres de áreas y variantes/erratas de encabezados (por ejemplo, “Lenguas Extrajeras” hacia “Lenguas Extranjeras”). No debe confundirse con transcripción literal.
7. En los datos guardados la página impresa se infirió restando uno a la posición PDF. La lectura del folio se añadió después al código, pero aún no se reextrajo.
8. No se corrigieron automáticamente todas las erratas de contenido (“compresión”, “evidenciado”, “Tigonometría” aparecen preservadas en ejemplos/metadatos).

Por estas razones los borradores no pueden presentarse como catálogo oficial validado.

## 18. Estados de las versiones y conclusión

| Lugar | Primaria | Secundaria | Motivo |
| --- | --- | --- | --- |
| Registro version del JSONL | DRAFT | DRAFT | Valor emitido por extractor; no implica validación |
| Manifiesto coverage.json | VALIDATION_FAILED | VALIDATION_FAILED | Errores críticos y pendientes |
| Elementos JSONL | 5.712 PENDING | 8.740 PENDING | Sin revisión humana registrada |
| Base de datos | No importada por esta ejecución | No importada por esta ejecución | Migración/importación no ejecutadas; estado remoto no auditado |
| VALIDATED / PUBLISHED | No establecido | No establecido | No cumple condiciones de aceptación |

El importador, si se ejecutara con estos manifiestos, seleccionaría VALIDATION_FAILED, no PUBLISHED. Esto describe el código; no es una importación realizada.

**Conclusión final: informe terminado; Fase A incompleta. No autorizable para recomendaciones ni publicación. Fase B no iniciada.** Las guías de PDF/Supabase/Wrangler se usaron para separar revisión de texto de QA visual, definición de esquema de prueba real y dry-run de despliegue efectivo; no motivaron cambios de implementación.
