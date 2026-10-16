# Selectores del creador y pertinencia matemática

## Alcance y diseño

Referencia inspeccionada en localhost:8787: `SubjectAssignmentForm.tsx`, abierto desde Cursos → 1.º de secundaria → Agregar asignatura. Reutilizar `Modal`, `Input`, `Button`, listado con selección azul y pie de acciones. Los cuatro controles serán filas compactas, con etiqueta, valor completo y Cambiar/Seleccionar; no se añaden tarjetas. Las listas largas tendrán búsqueda y desplazamiento interno. Una instancia de diálogo conserva su selección provisional hasta confirmar o cancelar, aunque cambien las recomendaciones externas. El modo automático sigue disponible dentro del diálogo.

No se cambia el modelo de persistencia ni las protecciones de cambios estructurales. Estrategia conserva su identificador y origen independientes. Los cuatro campos aparecen desde el formulario vacío. Se mantiene la puntuación sin valor inicial.

## Secuencia de ejecución

1. Inspeccionar referencia real, procesos, árbol y reglas; conservar borradores personales. **Hecho**: árbol limpio en `87c6224654cc56019f06821c9dc886ecadb5c1dd`; listener 8787 existente, sin arrancar otro.
2. Reproducir el caso mínimo matemático y guardar instrumentos completos anteriores. Rastrear proveedor, detección de tema y contextos. No atribuir reproducción exacta al caso original, cuya consigna no está disponible.
3. Añadir pruebas que fallen para las causas demostradas y para selección provisional, cancelación, teclado y actualizaciones externas. Implementar el cambio mínimo compartido y sustituir los cuatro controles existentes.
4. Comprobar variantes matemáticas, cuatro formatos, paridad local/servicio, totales 20/17.35 y regresiones. Si cambia catálogo: congelar 84, publicar versión nueva únicamente en Development y comprobar instalación idempotente sin esquema.
5. Ejecutar backend test/build, frontend test/build y cloudflare:build. Verificar runtime efectivo Development y reiniciar solo la cadena local conocida si hace falta.
6. Probar navegador real de escritorio y móvil: vacío, automático, búsqueda, provisional, confirmar/cancelar/Escape, foco, manual/auto, recomendación durante diálogo, protecciones, guardar/reabrir. Usar QA identificable y preservar la sesión/borradores personales.
7. Revisar instrumentos completos antes/después, documentar causas, pruebas, capturas y limitaciones. Revisar diff y exclusión de secretos, commit español y push normal en `amplia-instrumentos-secundaria`.

## Límites

Solo AulaBase Development (`eolgunypmtgrsyrjzcld`); sin producción, despliegues, merge/main, cambios de esquema remoto, reset, copias de usuarios/datos, dependencias, IA, subagentes ni ampliación curricular. No borrar almacenamiento ni reemplazar snapshots históricos.
