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
| Lengua Española 2.º | La noticia existente; cinco temas sin módulo específico comprobado | Revisar PDF 76–81 e implementar guía turística, artículo expositivo, informe de lectura, cuento de amor y amistad y décima espinela |
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

No se ha declarado ninguna asignatura completa ni ningún instrumento nuevo verificado en aplicación. Los temas sin encabezado conceptual inequívoco, incluidos conceptos de Formación Humana con viñetas, mantienen pendiente la revisión de límites; todo el contenido original sigue conservado por ámbito.

Para continuar:

1. Leer este registro, `fuentes-optativas.md`, el plan y la matriz.
2. Ejecutar `node --test scripts/evaluation-instruments/secondary-inventory.test.mjs`.
3. Completar la revisión visual de Lengua 1.º/2.º y guardar asociaciones verificadas en `revision.json` ligado al SHA de fuente.
4. Separar los módulos contextuales del motor y ampliar acciones principales respetando elecciones manuales; comenzar por los temas pendientes de 2.º.
5. Ejecutar pruebas por tema y formatos, revisar ejemplos pedagógicos, correr comprobaciones de integración, crear commit en español, registrar hash y hacer push a esta rama.

Pruebas iniciales del inventario: 5/5 aprobadas. No hay publicación de catálogo ni instalación nueva en DB en este punto.

## Commits

El hash de cada bloque se añadirá aquí después de crearlo, en la siguiente actualización del registro. Para recuperar el último bloque ya publicado, consultar también `git log` y `git ls-remote origin amplia-instrumentos-secundaria`.
