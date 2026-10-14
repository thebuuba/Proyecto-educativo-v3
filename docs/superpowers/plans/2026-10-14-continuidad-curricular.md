# Continuidad curricular por asignatura y grado

**Encargo:** instrucción del usuario de 14/10/2026: revisar primero Lengua común 1.º–6.º; después continuar en orden curricular con todas las asignaturas y optativas en los grados y ámbitos oficiales.

**Ejecución:** directa, con executing-plans y revisión propia; se conserva la prohibición de subagentes del usuario. Rama existente `amplia-instrumentos-secundaria`; commit inicial `6687c21d8712973e43d30e4d0d971750d8094ccf`. No main, producción, IA, dependencias nuevas ni cambios históricos. Se autorizaron commits y push por bloque.

**Arquitectura:** ampliar proveedores contextuales compartidos y sus adaptadores existentes. Fuente oficial, acción/producto/requisitos, cuatro formatos y elección manual; no una plantilla por título. Inventario y cobertura evaluativa se registran separadamente.

- [x] Revisión de cierre de Lengua: reproducir redundancia de ritmo en poesía social y de comunicación genérica en representación de entremés; corregir composición compartida y contracción gramatical «de el». Archivos: language-feature-criteria.ts, secondary-language-grade-three-complete.ts, perfiles de sexto y pruebas de backend/contrato.
- [x] Verificar los cuatro formatos, selección/técnica, puntos y servicio/alternativa; HTTP autenticado y guardados/reaperturas nuevos de las consignas corregidas. Conservar ejemplos históricos. Catalogar como release nuevo, ejecutar pruebas/builds exigidos, actualizar matriz/continuación y commit/push.
- [ ] Confirmar visualmente el orden del índice oficial y registrar ámbitos comunes/optativos sin inferirlos del número de temas extraídos.
- [ ] Siguiente asignatura: auditar 1.º, corregir límites de inventario y crear contratos semánticos rojos; conectar proveedor, cuatro formatos, selección manual y puntuación. Verificar UI y persistencia; cerrar grado con evidencia y commit/push antes de avanzar.
- [ ] Repetir 2.º–6.º donde corresponda; después siguiente asignatura en el orden verificado. Las optativas se abordan únicamente en su ámbito y grado oficial.

Cada bloque añade aquí o en su informe un punto de continuación: base Git, alcance real, archivos, fallo reproducido, verificaciones, catálogo y siguiente trabajo. Si hay un bloqueo se registra y se continúa una tarea independiente autorizada. Ninguna extracción, HTTP200 o cantidad de filas equivale por sí sola a cobertura completa.

## Registro vigente

Lengua en revisión final: dos redundancias pedagógicas confirmadas al leer los instrumentos persistidos. Los 40 temas conservan sus verificaciones anteriores; poesía social 6.º y entremés 5.º requieren este ajuste antes de iniciar otra asignatura. No hay bloqueo. El entorno local conserva .33 y 69 snapshots; los temporales .superpowers quedan fuera de Git.

Cierre del bloque .34: nueve fallos rojos reproducidos; trece regresiones verdes; suites completas, HTTP24 y UI5 aprobados; históricos74 intactos. Próximo: Inglés1.º, inventario temático/gramatical con fuente visual antes de implementar.
