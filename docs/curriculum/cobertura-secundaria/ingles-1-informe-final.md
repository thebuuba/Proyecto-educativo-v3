> Actualización del flujo de criterios (.46): el cierre previo conservó una regresión de añadir/completar no detectada en sus ejemplos. Se corrigieron agotamiento, recuperación, intención/identidades, respuestas obsoletas y procedencia; se verificaron los proveedores de las40 familias de Lengua y los cuatro formatos. [Informe y límites](criterios-adicionales-informe.md), [matriz](criterios-matriz-proveedores.md). Las evidencias anteriores permanecen intactas; no se amplía el ámbito curricular.

Rectificación de calidad,15/10/2026: los cierres curriculares se conservan, pero el cotejo de datos independientes y el criterio de revisión recibieron un ajuste posterior en.64–.66. Los ejemplos previos siguen siendo evidencia histórica; los corregidos, la conciliación de cantidades y las verificaciones nuevas están en el [informe de calidad de Inglés1–6](ingles-calidad-informe.md).

# Cierre de Inglés común de1.º de secundaria

Inglés común de1.º queda verificado dentro de las familias, modalidades y requisitos documentados. Se cerraron el límite20, las operaciones por fila, el cotejo de fuente y la revisión de pertinencia, selección y persistencia. **La ejecución termina en este grado: no se inicia segundo ni otra asignatura.** Lengua Española común1.º–6.º conserva su cierre .34.

## Fallos confirmados y correcciones

1. **Conjunto de candidatos confundido con instrumento final.** La protección .42 rechazaba31 opciones incluso al pedir una sola fila. Ocho regresiones fallaron antes del cambio. Servicio y alternativa permiten el conjunto completo cuando `includeAdditionalCandidates` está activo; la generación normal y el instrumento ensamblado siguen limitados a20. No se recortan requisitos ni se amplía el límite.
2. **Objetivos diferentes descartados como duplicados.** Presente simple y presente continuo compartían suficientes palabras para la heurística. Cuatro regresiones reprodujeron el rechazo. Las identidades de objetivos autorales conocidos y no editados prevalecen sobre esa semejanza; las filas manuales/editadas conservan sus comprobaciones de texto y los objetivos usados no se repiten.
3. **Evidencias explícitas sin conectar.** Se añadieron siete familias condicionales de comunicación: opciones justas, acciones de cuidado, respeto/asertividad, descripción sin estereotipos, apoyo ante dificultades, seguridad y permiso/uso acordado.64 pruebas reprodujeron el vacío. Cada fila evalúa el mensaje pedido; no califica creencias, discapacidad, bienes, motivación, ansiedad ni personalidad. Una petición de permiso aislada no exige condiciones de uso ausentes; una regresión adicional reprodujo y corrigió ese exceso durante la revisión. Otro control falló porque una guía de salud citada solo como recurso activaba cuidado; el texto de contexto ahora aplica la misma exclusión de recursos que los demás proveedores.
4. **Interacción escrita genérica.** Un intercambio de mensajes escritos podía quedar sin proveedor pertinente. Se reprodujo y corrigió la modalidad escrita, conservando mensaje, opinión y respuesta al interlocutor; las acciones orales y escritas no se confunden. Se incorporó el caso a los contratos de composición.
5. **Intención automática perdida ante una respuesta obsoleta.** Al deshacer una selección manual y cambiar inmediatamente la descripción, la respuesta descartada podía conservar la elección manual anterior. La nueva prueba falló enviando `preferredInstrumentType: lista-cotejo` cuando debía ser automático. La intención automática se registra antes de la petición, sin sustituir campos anticipadamente. Pasan las58 pruebas del editor; el navegador muestra los cuatro formatos recomendados y respeta la elección manual.

No se añadieron condiciones por títulos exactos, IA, dependencias, rediseño, cambios de esquema ni migraciones. Los descriptores de rúbrica son específicos y progresivos; cotejo utiliza indicadores Sí/No; escala conserva categorías compactas de grado/frecuencia e indicadores específicos; ponderada incluye evidencia y cumplimiento parcial. Las categorías de escala no pretenden ser descriptores analíticos de rúbrica.

## Fuente y cobertura real

Se revisaron visualmente PDF134–139, páginas impresas133–138, de la adecuación MINERD2023 proporcionada por el usuario. El encabezado identifica Inglés, primer ciclo, primer grado. SHA256: `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`.

[Cotejo integral de201 registros](ingles-1-cotejo-integral.json):96 conceptos,53 procedimientos,17 actitudes/valores,21 indicadores, siete competencias específicas y siete fundamentales. Cada registro conserva identificador, texto, ubicación, decisión, evidencia, proveedor/contrato o exclusión. La matriz contiene16 agrupaciones:13 temas y vocabulario/expresiones/gramática; un encabezado no se convierte en criterio.

Se conservan los bloques ya verificados:12 funciones comunicativas,31 estructuras gramaticales,39 familias léxicas y14 expresivas,22 estrategias observables y29 familias de géneros con sus modalidades documentadas. Comprensión oral/escrita, producción oral/escrita/audiovisual, interacción y acciones mixtas usan criterios según la consigna. Las nueve consignas de composición incluyen leer/escribir, escuchar/redactar, reconocer/usar, comparar/producto posterior, revisar y responder por escrito. Se distinguen acciones independientes, apoyos e infinitivos de propósito.

Las actitudes se conectan condicionalmente al mensaje solicitado. Motivación y ansiedad son condiciones de apoyo. La valoración interna del trabajo, humildad, aceptación y compromiso general no se puntúan como rasgos; describir ocupaciones, expresar opiniones o cumplir una condición explícita del intercambio tiene su evidencia comunicativa propia. No se exigen hábitos reales, posesiones personales ni información privada. Los indicadores orientan tareas específicas, sin imponer los21 a todas las actividades. Las competencias fundamentales y específicas no añaden filas genéricas.

Los informes anteriores son evidencia histórica: [funciones](ingles-1-funciones.md), [gramática](ingles-1-gramatica.md), [léxico](ingles-1-lexico.md), [estrategias](ingles-1-estrategias.md), [géneros](ingles-1-generos.md), [composición](ingles-1-composicion.md). Sus pendientes ya resueltos se sustituyen por este cierre y la matriz vigente; no se reescriben sus snapshots.

## Pruebas automáticas

- Backend final: **6.380 pruebas/64 archivos**, incluida capacidad, fuentes, selección, modos, progresiones, aislamiento y otras asignaturas.
- Frontend completo reciente .44: **11.311/108**. Después de la corrección de intención automática se ejecutaron **58 pruebas del editor**; después de los ajustes de permiso y recursos, **122 pruebas de los cuatro servicios afectados**. No se declara que la suite completa incluya esos últimos cambios ni se repite sin necesidad.
- Inventario: **nueve pruebas**. El cotejo integral se valida con201 identidades únicas,17 actitudes,21 indicadores y la exclusión explícita de automotivación/ansiedad.
- Builds backend/frontend y Cloudflare dry-run finales: aprobados. No se desplegó.
- Se conservan las regresiones de títulos neutrales/incompatibles, descripciones breves/detalladas, requisitos presentes/ausentes, manual antes/después, puntaje pendiente20/17.35, distribución según orden de introducir puntos, diálogo y respuestas obsoletas. Las pruebas del componente son comprobaciones automáticas, no evidencia de persistencia.

## Servicio HTTP autenticado

[Batería .44](evidencias/ingles-1-final-servicio.json):136 propuestas de contexto/composición, ocho rechazos31, ocho propuestas válidas20, ocho conjuntos de31 candidatos y nueve interpretaciones:169 llamadas. Cuatro instrumentos y20/17.35. [Revisión .45](evidencias/ingles-1-revision45-servicio.json):24 propuestas sobre permiso con/sin condiciones e interacción escrita y una interpretación. [Selección .44](evidencias/ingles-1-seleccion-final-servicio.json):cuatro interpretaciones, cuatro recomendaciones automáticas y cuatro elecciones manuales contrarias. La batería exploratoria .43 se conserva aparte.

La rúbrica corresponde a calidad multidimensional; cotejo, presencia de evidencias; escala, grado o regularidad; ponderada, pesos por componente. Se mantienen rúbrica donde corresponde y toda selección explícita, sin cuotas. Los errores400 de capacidad no se ocultan con alternativas; las regresiones existentes de autorización/validación siguen pasando.

## Navegador y persistencia real

Chrome, frontend5173, backend3000 y Supabase local54321, con cuenta ficticia autorizada:

- [Rechazo31 después de confirmar regeneración](evidencias/ingles-1-capacidad-navegador.json):24 campos visibles idénticos, rúbrica y20 puntos conservados, sin aviso de alternativa. La prueba del editor compara también todos los campos internos, incluidas identidades. [Captura](evidencias/ingles-1-capacidad-rechazo.png).
- [Añadir/completar](evidencias/ingles-1-filas-navegador.json):19→20 desde una consigna de31; completar el indicador vacío conserva todos los valores no vacíos y demás filas. Los helpers y contratos comprueban duplicados, identidades, pesos y rechazo de una fila21. La lista ponderada con pesos manuales6/4 y18×5 conserva esos pesos y los puntos exactos al guardar/reabrir.
- [Selección automática](evidencias/ingles-1-seleccion-final-navegador.json):tipo y técnica aparecen directamente; los cuatro propósitos actualizan el selector, con puntaje pendiente. Elección manual anterior verificada en rúbrica/escala/ponderada; posterior y tras cambio de descripción, en ponderada.
- [Cambio de tipo](evidencias/ingles-1-cambio-tipo-navegador.json):cancelar conserva tipo/campos; conservar mantiene campos exactos; adaptar obtiene la propuesta nueva, mantiene formato manual y17.35 puntos. Las respuestas obsoletas tienen además regresiones automáticas específicas.
- Cuatro recorridos **generar→editar→resumen→guardar→reabrir desde el listado**, todos con20 criterios. Rúbrica20 y cotejo17.35 se guardaron con .43; escala20 y ponderada17.35 con .44. Estas versiones se conservan; .45 cambia únicamente el requisito condicional de permiso, sin reescribirlos. [Campos del editor](evidencias/ingles-1-final-flujo-navegador.json) y [snapshots persistidos](evidencias/ingles-1-final-persistencia.json):textos, identidades, objetivos, puntos y pesos coinciden. No son callbacks simulados.
- [Históricos .45](evidencias/lengua-historicos-evaluation-2026.45.json):106 snapshots,28 de referencia y78 instrumentos completos preservados. Los102 anteriores permanecen intactos.

[Cuatro instrumentos completos obtenidos](ingles-1-ejemplos-finales.md), con20 filas por formato, descriptores, indicadores, pesos, puntos y ediciones guardadas. La consigna de20 estructuras es una prueba deliberada del límite; no una obligación de evaluar todas las estructuras en cualquier actividad.

## Estado final y límites

Matriz/revisión/inventario actualizados para Inglés común1.º, con estados de las otras asignaturas conservados. No quedan pendientes conocidos de las familias/requisitos definidos. El motor determinista puede necesitar elección o edición docente ante elipsis, sinónimos no ensayados y consignas ambiguas. La evidencia de navegador es representativa por formato y operaciones; no se recorrió manualmente cada una de las201 entradas. Los reinicios de Vite obligaron a completar nuevamente formularios de prueba sin guardar; se garantiza aquí la reapertura de actividades guardadas, no una prueba nueva de recuperación de todo borrador tras reiniciar desarrollo.

Rama `amplia-instrumentos-secundaria`, repositorio `https://github.com/thebuuba/Proyecto-educativo-v3.git`; base ejecutada `3515306dc344dc281506f23e19066401509cd08a` con cambios del encargo (`dirty: true`). Catálogo final local `evaluation-2026.45`; .42/.43/.44 congelados. Los hashes de commit/push se confirman en la entrega tras publicarlos, sin atribuirlos a ejecuciones anteriores. Credenciales, `.env`, cuentas, logs y temporales excluidos. Ejecución directa, sin subagentes, main, force push, producción, reset ni cambios históricos.

Archivos principales: motor backend y catálogos42–45; compositor English1 y proveedor de contexto; adaptador compartido de candidatos; selector del editor y deduplicación por fila; pruebas/fixtures; verificadores de fuente, HTTP y persistencia; matriz, continuación, avance e informe. El diff del commit identifica todos los archivos. **Detenerse aquí; no comenzar Inglés2.º.**
