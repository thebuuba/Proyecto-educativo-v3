# Avance durable — cobertura secundaria

## Fuente y base

- Rama: `amplia-instrumentos-secundaria`, basada en `1d3a99b24d19b819f24a58d678592662c13edd1a` (flujo restaurado).
- PDF proporcionado por el usuario: `Ht7X-adecuacion-secundaria-2023pdf.pdf`, 520 páginas, SHA256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`.
- La copia del repositorio y el archivo reenviado son idénticos byte por byte.
- Fuente oficial: [MINERD, Adecuación Curricular del Nivel Secundario 2023](https://ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/Ht7X-adecuacion-secundaria-2023pdf.pdf).
- Ejecución directa, sin subagentes. Sin modificaciones remotas de DB ni despliegues.

## Estado inicial y próximo bloque

El inventario registra 72 ámbitos por grado (54 comunes y 18 optativos), 17 ámbitos por ciclo, 10.700 elementos oficiales y 504 relaciones explícitas de la extracción anterior. `inventario.json` conserva texto y páginas por elemento; `matriz.csv` presenta candidatos a tema y subtemas. La extracción no equivale a validación curricular: los límites entre columnas y la asociación de procedimientos se revisan por módulo.

La clasificación común/optativa se contrastó visualmente con PDF 48–49 (impresas 47–48) y las cuatro tablas PDF 427, 461, 490 y 498 (impresas 426, 460, 489 y 497). Educación Artística, Educación Física y Formación Integral Humana y Religiosa son comunes. Los títulos de notas y continuaciones de Lengua no se contabilizan como temas.

| Bloque | Estado | Próxima acción |
|---|---|---|
| Inventario y clasificación | Extraído; revisión de tablas de distribución y optativas realizada; asociación por tema pendiente | Mantener registro de revisión separado para no perder avances al regenerar |
| Lengua Española 1.º | Seis módulos existentes; pendiente de reauditar fuente, motor y pruebas | Revisar PDF 69–75 y contrastar los seis módulos |
| Lengua Española 2.º | Cinco temas incorporados, fuente y pruebas revisadas, 20 casos de persistencia HTTP local aprobados; noticia pendiente de reauditoría | Reauditar noticia y ampliar revisión manual; ver `lengua-2-primer-bloque.md` |
| Lengua Española 3.º–6.º | Pendiente | Fuente por grado: 82–88, 96–104, 105–112, 113–121 |
| Ciencias de la Naturaleza 1.º–6.º | Pendiente | Seguir después de Lengua, con denominaciones reales por grado |
| Otras asignaturas comunes | Pendiente | Seguir orden de alcance y matriz |
| Optativas | Ubicación revisada; instrumentos específicos pendientes | Implementar sólo 4.º–6.º y salida Académica correspondiente |

## Auditoría de arquitectura inicial

- Catálogo en `catalog-v1.ts`, versión `evaluation-2026.7`; seed idempotente rechaza contenido distinto bajo una versión existente. Conservarlo y crear un release nuevo al consolidar módulos.
- El motor contiene criterios específicos de seis temas de Lengua 1.º y La noticia de 2.º. Resto de áreas usa dimensiones generales; no representa cobertura temática completa.
- Detector compartido en `packages/shared/src/index.ts` sólo especializa Lengua 1.º/2.º. Frontend tiene contexto especial para esos grados; ampliarlo sin reintroducir campos o pasos.
- La aplicación representa las 18 optativas mediante códigos estructurados de salida/asignatura/grado; `curriculum-context.ts` los contrasta con el ámbito. Mantener los negativos para evitar cruzar grados/salidas.
- `resolveScope` rechaza modalidades distintas de academic/general. PDF 55 (impresa 54) distingue el componente académico de Técnico-Profesional y Artes de sus formaciones laborales específicas. Revisar la compatibilidad del componente común y registrar como no cubiertas las formaciones especializadas cuya malla no aparece aquí.

## Estados y recuperación

No se ha declarado ninguna asignatura completa. Cinco temas de Lengua 2.º tienen módulos y pruebas automatizadas; la décima tiene además un recorrido de navegador con guardado simulado. Una prueba posterior distinta valida persistencia HTTP local con sesión sintética, guards reales, 20 actividades, reintentos y linaje de una edición manual. No constituye prueba de login real. Los temas sin encabezado conceptual inequívoco, incluidos conceptos de Formación Humana con viñetas, mantienen pendiente la revisión de límites; todo el contenido original sigue conservado por ámbito.

Para continuar:

1. Leer este registro, `fuentes-optativas.md`, el plan y la matriz.
2. Ejecutar `node --test scripts/evaluation-instruments/secondary-inventory.test.mjs`.
3. Completar la revisión visual de Lengua 1.º/2.º y guardar asociaciones verificadas en `revision.json` ligado al SHA de fuente.
4. Separar los módulos contextuales del motor y ampliar acciones principales respetando elecciones manuales; comenzar por los temas pendientes de 2.º.
5. Ejecutar pruebas por tema y formatos, revisar ejemplos pedagógicos, correr comprobaciones de integración, crear commit en español, registrar hash y hacer push a esta rama.

Pruebas del inventario: 5/5 aprobadas. Release `evaluation-2026.8` instalado sólo en Supabase local confirmado, con reinstalación idempotente y releases anteriores intactos. Sin cambios remotos ni despliegue. Ver evidencias, cifras de pruebas y límites en el informe del primer bloque de Lengua 2.º. La asociación de procedimientos de 2.º está guardada en `revision.json`; su regeneración ya se comprobó.

## Commits

El hash de cada bloque se añadirá aquí después de crearlo, en la siguiente actualización del registro. Para recuperar el último bloque ya publicado, consultar también `git log` y `git ls-remote origin amplia-instrumentos-secundaria`.

- Inventario y clasificación: `c0c2c1087ec165e02f81e44f9292eab7b080c052`, publicado en `origin/amplia-instrumentos-secundaria`.
- Cinco módulos de Lengua 2.º: `757217a3b02dc1a28831ef3a2d8d134a26602dc1`, publicado en la misma rama y repositorio `thebuuba/Proyecto-educativo-v3`.
- Reintentos y persistencia local: `4b00bc171f70f16d5bbd3f618c04b91705e6682f`, publicado en la misma rama.
- Presentación de valores relativos: `cd112b235ddf8af2e73291161ddcd27370bb050f`, publicado en la misma rama.
- Prioridad de selección manual de noticia: `ec0447f75c7b4bdd3a3d301af9d72df411d0b4e9`, publicado en la misma rama.

La prueba local posterior requirió aplicar sólo la migración existente de linaje en el puerto 54332. Detectó y corrigió la comparación de fracciones JSON en reintentos; prueba de regresión y 20 casos HTTP aprobados. Evidencia en `evidencias/persistencia-lengua-2.json`. Próxima tarea: reauditar fuente y criterios/descriptores de los seis módulos de Lengua 1.º y La noticia de 2.º, conservando versiones previas.

Reauditoría de 1.º iniciada: corregida la selección de criterios de noticia, que volvía a inferir la acción desde la descripción después de una elección explícita. Tres casos de regresión cubren análisis, comparación y escritura frente a descripciones contradictorias. Backend completo: 35 archivos / 450 pruebas; build backend y Cloudflare dry-run aprobados. Los otros aspectos de 1.º siguen pendientes: descriptores por acción, recursos no obligatorios, equivalencia entre motor/alternativa local y asociaciones oficiales por tema. No marcar completo el bloque A.

Segunda revisión de 1.º: recursos listados ya no se convierten en género, imágenes obligatorias o tema de un afiche; el texto de recursos también se excluye del ranking de temas y del clasificador general. Se mantiene la evidencia individual del noticiero y se elimina la exigencia de «seguridad» personal. Pruebas de regresión: recurso caligrama que activaba un género, imágenes que imponían una consigna, noticiero que exigía confianza personal y una tarea de recurso que desplazaba la comparación principal. Se corrigió además la detección de formas verbales como «compara» frente al infinitivo del catálogo. Backend 454/454, frontend 503/503; compilaciones backend y frontend aprobadas. Catálogo y snapshots previos conservan su contenido; no hay modificación remota. Persisten los pendientes del bloque A indicados arriba.
