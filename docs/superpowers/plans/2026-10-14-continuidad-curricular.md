# Continuidad curricular por asignatura y grado

**Encargo:** instrucción del usuario de 14/10/2026: revisar primero Lengua común 1.º–6.º; después continuar en orden curricular con todas las asignaturas y optativas en los grados y ámbitos oficiales.

**Ejecución:** directa, con executing-plans y revisión propia; se conserva la prohibición de subagentes del usuario. Rama existente `amplia-instrumentos-secundaria`; commit inicial `6687c21d8712973e43d30e4d0d971750d8094ccf`. No main, producción, IA, dependencias nuevas ni cambios históricos. Se autorizaron commits y push por bloque.

**Arquitectura:** ampliar proveedores contextuales compartidos y sus adaptadores existentes. Fuente oficial, acción/producto/requisitos, cuatro formatos y elección manual; no una plantilla por título. Inventario y cobertura evaluativa se registran separadamente.

- [x] Revisión de cierre de Lengua: reproducir redundancia de ritmo en poesía social y de comunicación genérica en representación de entremés; corregir composición compartida y contracción gramatical «de el». Archivos: language-feature-criteria.ts, secondary-language-grade-three-complete.ts, perfiles de sexto y pruebas de backend/contrato.
- [x] Verificar los cuatro formatos, selección/técnica, puntos y servicio/alternativa; HTTP autenticado y guardados/reaperturas nuevos de las consignas corregidas. Conservar ejemplos históricos. Catalogar como release nuevo, ejecutar pruebas/builds exigidos, actualizar matriz/continuación y commit/push.
- [x] Confirmar la transición física Lengua–Lenguas extranjeras–Inglés y registrar ruta de ámbitos comunes/optativos. No hay índice en las primeras60 páginas; el resto de las secciones deberá cotejarse antes de implementar. Véase `orden-de-continuacion.md`.
- [ ] Siguiente asignatura: auditar 1.º, corregir límites de inventario y crear contratos semánticos rojos; conectar proveedor, cuatro formatos, selección manual y puntuación. Verificar UI y persistencia; cerrar grado con evidencia y commit/push antes de avanzar.
- [ ] Repetir 2.º–6.º donde corresponda; después siguiente asignatura en el orden verificado. Las optativas se abordan únicamente en su ámbito y grado oficial.

Cada bloque añade aquí o en su informe un punto de continuación: base Git, alcance real, archivos, fallo reproducido, verificaciones, catálogo y siguiente trabajo. Si hay un bloqueo se registra y se continúa una tarea independiente autorizada. Ninguna extracción, HTTP200 o cantidad de filas equivale por sí sola a cobertura completa.

## Registro vigente

Lengua en revisión final: dos redundancias pedagógicas confirmadas al leer los instrumentos persistidos. Los 40 temas conservan sus verificaciones anteriores; poesía social 6.º y entremés 5.º requieren este ajuste antes de iniciar otra asignatura. No hay bloqueo. El entorno local conserva .33 y 69 snapshots; los temporales .superpowers quedan fuera de Git.

Cierre del bloque .34: nueve fallos rojos reproducidos; trece regresiones verdes; suites completas, HTTP24 y UI5 aprobados; históricos74 intactos. Próximo: Inglés1.º, inventario temático/gramatical con fuente visual antes de implementar.

Bloque .35: conexión inicial de funciones comunicativas de Inglés1.º; fuente134–139 cotejada, reagrupación íntegra de96 conceptos,15 consignas en cuatro formatos, selector automático/manual, HTTP y cuatro guardados/reaperturas. Grado todavía parcial: continuar gramática, léxico, expresiones, estrategias, géneros/productos y acciones mixtas antes de segundo. Informe `ingles-1-funciones.md`.

Bloque .36:31 estructuras gramaticales conectadas, fuente136–138, cuatro formatos y persistencia. Próximo: vocabulario/expresiones de primero; después estrategias y composición. Ver `ingles-1-gramatica.md`. Primero sigue parcial.

Bloque .37/.38:39 familias léxicas y14 expresivas conectadas. Corregida actualización de puntos al editar porcentajes en InstrumentPreview; cuatro recorridos finales .38 y90 snapshots conservados. Siguiente: estrategias, productos y composición de primero; no avanzar de grado.

Bloque .39:22 estrategias observables conectadas,88 propuestas HTTP y cuatro formatos guardados/reabiertos.94 snapshots intactos. Primero sigue parcial: géneros/productos, modalidades mixtas y composición extensa son el siguiente paso.
