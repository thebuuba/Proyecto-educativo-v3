# Cobertura de instrumentos de secundaria — plan progresivo

**Goal:** Cubrir el currículo oficial por asignatura, grado, tema y salida verificados, con instrumentos deterministas pertinentes y trazabilidad.
**Spec:** ../specs/2026-10-12-cobertura-secundaria-design.md
**Base:** 1d3a99b24d19b819f24a58d678592662c13edd1a, creador restaurado y publicado.
**Architecture:** Conservar motor y contratos de puntuación; separar contenido contextual por módulos curriculares, interpretación de acciones y estructuras de cuatro formatos. Mantener releases anteriores inmutables y consolidar cada módulo antes de versionar el catálogo.
**Tech stack:** TypeScript/React/Nest, datos curriculares existentes, Vitest y scripts Node/PDF existentes. Sin dependencias nuevas ni IA en ejecución.

## Restricciones y decisiones

- Sin subagentes, por instrucción expresa del usuario; implementación y revisión directas.
- Rama dedicada `amplia-instrumentos-secundaria`, sin mezcla con main ni despliegue.
- PDF local de 520 páginas con SHA256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Coincide con la extracción conservada; fuente oficial MINERD identificada. El nuevo adjunto sólo trae texto, por lo que se utiliza la copia del repositorio y se registra esta decisión.
- Extracción no equivale a revisión visual, aprobación curricular, implementación o verificación en aplicación. Registrar estados por separado.
- No asignar procedimientos por cercanía entre columnas; conservar referencias explícitas y marcar asociaciones pendientes.
- DB únicamente local confirmada, sin resets, migraciones antiguas intactas y releases anteriores conservados.
- Conservar flujo vertical, puntaje pendiente, selección manual, borradores, resumen, permisos, atomicidad, idempotencia e historial.

## Bloques y puertas de verificación

- [ ] Inventario: auditar extracción, 72 ámbitos de grado (54 comunes, 18 optativos) y ámbitos por ciclo; matriz con temas, elementos originales, páginas, estados y vacíos. Confirmar visualmente tablas de optativas y límites de Lengua 1.º/2.º. Commit/push del inventario verificable.
- [ ] A: auditar seis módulos de Lengua 1.º y completar Lengua 2.º. Pruebas de acción principal, títulos neutrales, brevedad, negativos, manuales, cuatro formatos y puntos. Informe/commit/push por grado.
- [ ] B: Lengua 3.º–6.º, grado por grado con revisión visual de fuentes y adaptaciones evaluativas distintas del texto oficial.
- [ ] C: Ciencias de la Naturaleza 1.º–6.º, denominaciones y contenido específicos por grado.
- [ ] D: Matemática, Sociales, Inglés, Francés, Artística, Física y Formación Integral Humana y Religiosa; demás áreas que revele la fuente.
- [ ] E: optativas únicamente en grados y salidas confirmados; documentar modalidades remitidas a fuentes externas sin inventarlas.
- [ ] Revisión de catálogo: contexto real, interpretación acción/producto/preparación, selección pertinente de técnica/instrumento, releases e instalación idempotente local.
- [ ] Integración final: tests backend/frontend, builds backend/frontend/cloudflare, QA ficticio y revisión pedagógica representativa; persistencia real sólo en entorno local confirmado. Matriz final distingue implementado, probado y verificado manualmente.

Cada bloque: prueba roja significativa → cambio mínimo completo → prueba verde → revisión pedagógica y técnica → comprobaciones requeridas → informe → commit en español → registro del hash → push. Continuar módulos independientes si una fuente o contexto queda bloqueado.

## Riesgos que deben tener pruebas

Informe sobre cuento no implica escribir cuento; analizar afiche no implica crearlo; investigar para exponer no implica investigación como producto principal; entrevista simulada no es técnica docente de entrevista; recursos no son requisitos; ninguna regla cruza grado/asignatura/salida; evaluación de Formación Humana no califica creencias privadas.

## Recuperación

Leer `docs/curriculum/cobertura-secundaria/avance.md` y la matriz antes de continuar; elegir el siguiente bloque pendiente siguiendo A–E y respetar commits acumulados. No depender del chat.
