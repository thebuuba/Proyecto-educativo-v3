# Matemática Financiera y Tecnología de 4.º — bloque verificado

Se conectó `OPT-MT-4` para 4.º de secundaria, segundo ciclo, modalidad Académica y salida Matemática y Tecnología. La fuente MINERD 2023 corresponde a PDF 491–493, páginas impresas 490–492. Se conservaron sus 98 registros: 51 anclas adaptables, 21 indicadores, 14 competencias y 12 disposiciones privadas excluidas de evaluación. Las páginas completas ya estaban revisadas visualmente; no se repitieron renders ni clasificación.

## Implementación y causas corregidas

Se reutilizaron el parser matemático, la composición, la selección por propósito y los cuatro formateadores. El proveedor optativo tiene metadata propia y controles de grado, código, modalidad, ciclo cuando consta y salida. Matemática común conserva su guard y sus resultados. Las 26 agrupaciones financieras y contables no se presentan como 26 temas independientes.

Los contratos y la lectura completa reprodujeron y corrigieron:

- «Calculadora» y «cálculo» se interpretaban como acciones de calcular.
- El crédito de las tarjetas añadía cuentas de débito/crédito contables.
- El origen de las cuentas se interpretaba como historia; sustantivos como clasificación/comprobación añadían acciones.
- La prioridad temática omitía objetos de comparaciones y la elaboración combinada perdía la interpretación.
- Pedir solamente monto o renta de una anualidad exigía la otra magnitud. Un monto compuesto vecino también contaminaba el objeto de anualidades.
- El contexto real del creador omite `cycle`: un guard que exigía ese campo bloqueaba la alternativa local aunque pasaban los fixtures con ciclo explícito. Se reprodujo usando `instrumentAcademicContext`.
- El caso H antiguo, sin descripción, no reconocía el título nominal «Resolución de problemas de interés compuesto». Ahora produce tres criterios matemáticos propios y cotejo por propósito. Se actualizó su expectativa ponderada genérica anterior; la ponderada manual y el crédito parcial explícito se conservan.

Archivos principales: `secondary-math-common.ts` y sus tipos; `secondary-optative-math.ts` y `secondary-optative-mt-4.ts`; catálogo, recomendador y servicio del backend; preparación, sugerencias e instrumento automático del frontend. Se ampliaron únicamente las allowlists necesarias de fuente, QA, HTTP e inventario. No se añadieron campos de interfaz, dependencias ni cambios de esquema.

## Instrumentos y pertinencia

82 contratos y 26 consignas breves generan **432 instrumentos completos**. La revisión propia, sin subagentes, leyó familias y variables con reconstrucción exacta: 117 textos distintos con cinco progresiones, 25 paquetes de formatos/puntuación y las correspondencias de las 51 anclas y 21 indicadores. Las 432 huellas coinciden y no quedan instrumentos pendientes de lectura.

Las magnitudes y convenciones son las proporcionadas: no se inventan tasas nominales/efectivas ni tipos de descuento, anualidad o amortización. Los presupuestos, empresas y transacciones son ficticios o usan datos dados. No se solicitan finanzas privadas, cuentas bancarias ni contratación de productos. El literal I96 «balanza general» permanece intacto; la adaptación explica estado de situación/balance general mediante C39/P69.

Limitaciones: muestras representativas, sin acreditar todas las consignas posibles ni ejecución real de clase. Persisten algunos detalles editoriales, como artículos o cláusulas repetidos, sin requisitos o cifras adicionales. Las adaptaciones de AulaBase no son rúbricas oficiales. La revisión del autor ofrece menor independencia que una revisión externa.

## Verificaciones

- Backend completo: **83.016 pruebas en 178 archivos, 0 fallos**.
- Actividades del frontend: **82.034 pruebas en 111 archivos, 0 fallos**. No es toda la suite del frontend. La comprobación focal posterior al build final pasó 3.555 pruebas en 3 archivos, incluido el contexto real y el título nominal; se solapa con el total anterior.
- Builds finales de shared, backend, frontend y `pnpm cloudflare:build`: todos con salida 0. Cloudflare ejecutó `--dry-run`, sin despliegue.
- Lint: 0 errores; 9 advertencias previas de actividades. Controles Node: 39 de fuente/inventario/historia y 1 de precaché, sin fallos. La repetición tras cerrar los artefactos no se suma como pruebas nuevas.
- Los 73 JS están precargados. Máximo: 2.047.102 bytes; límite: 2.097.152; margen: 50.050, sin elevarlo.
- Fuente y compilado coinciden en los 432 instrumentos y en el caso nominal. El catálogo 135 congelado coincide con Development.
- Permanecen exactas 15.176 definiciones de Inglés común, 2.888 de Matemática común y 9.532 instrumentos completos de las 12 optativas previas. Sociales, Artística, Educación Física y FHR anteriores también se conservaron. Las 36 diferencias respecto de artefactos más antiguos ya existían antes de 136; no se regeneraron esos artefactos.

## Destino e instalación

Único destino: **AulaBase Development `eolgunypmtgrsyrjzcld`**. PostgreSQL usa `app_backend_local` sin BYPASSRLS; Auth y Storage respondieron 200; frontend y bytes servidos coinciden con el build. Entry `/assets/index-D-tExqz_.js`; main `/assets/src-K_oTIaa3.js`, SHA256 `41432c1410f362de8f0d7f3172110d8c26a273bcb063c2a3ed359505165840e0`. Se volvió a verificar el entorno después de QA.

Catálogo **evaluation-2026.136**: `CREATED` y segunda ejecución `UNCHANGED`. Fuente individual **MINERD_SECUNDARIA_2023_OPT_MT_4_V1**: `CREATED/UNCHANGED`, 98 registros y 12 exclusiones. Versión `d1735c6e-0b1a-5840-aa0f-973e6a00499f`; ámbito importado `f47f60f9-7e4f-5f32-9f29-24de1e1dfa72`; ámbito original `834bd0b4-6611-5ff2-b31d-11d663152e0f`.

No hubo migraciones de esquema, reset, db push, copias de producción ni cambios de contraseñas o permisos. Se conservaron los 68 releases y 805 snapshots anteriores. Estado final: 69 releases y 838 snapshots; los 33 nuevos corresponden exactamente a 32 muestras QA y una personal. Las 11 baselines personales anteriores siguen idénticas, sin sobrescribirlas.

## HTTP y sesión personal

**32 muestras persistidas, 195 solicitudes, 0 errores 500**. Se representaron los 21 indicadores, con ocho muestras por formato y 16 por puntuación (20/17,35). Se comprobaron interpretación, recomendación, paridad local, puntos pendientes, texto manual, fuente/exclusión, guardado, reapertura y cambio aislado de estrategia. El 400 de una referencia curricular excluida es esperado. Medianas: interpretación 5.489 ms, recomendación 5.605 ms y escrituras 3.938 ms; no se atribuye una mejora causal frente a otros bloques.

Con la cuenta personal existente se usó el curso identificado **4.º secundaria QA MT Development**, en su misma escuela, con datos originales intactos y sin crear cuentas ni estudiantes. El creador mostró los cuatro selectores, estrategia visible y puntuación vacía. La actividad produjo Estudio de caso automático, Ejercicios y rúbrica de cinco criterios. Se leyeron los cuatro formatos completos, se conservaron modalidad/formato manuales y un criterio editado, y el ciclo 17,35 → 20 → 17,35 mantuvo las sumas exactas. La ponderada sumó 100 %.

Se creó una sola actividad, se reabrió desde el listado y se cambió únicamente la estrategia a Aprendizaje basado en problemas manual. Después de guardar y recargar, los **31 campos DOM**, instrumento, snapshot, puntuación y huella permanecieron idénticos:

- Actividad: `6fe63963-0f3b-46ca-92c9-5babbcc9f9ab`.
- Instrumento: `7848b87a-8ffe-4b19-ae69-3bbcd2707e9e`.
- Snapshot: `17e4ea36-8b70-43db-9854-9559d258692f`.
- Huella: `2c0113bcbc8fc664aef5438c910e463c`.

La captura de página completa agotó el tiempo del navegador; la captura del viewport del instrumento sí se revisó y muestra sus cinco filas y total. Los textos completos constan en la lectura DOM. Algunas esperas vencieron antes de completar la carga; se inspeccionó el estado y se continuó sin repetir guardados. El enlace de edición incluye el título en su nombre accesible y se abrió mediante búsqueda. No se borraron cachés, registros de service worker, almacenamiento ni borradores.

## Git y continuidad

Rama `ampliacion-de-instrumentos-2`; base del bloque `901d7942fe6c14e72b596a067489ec17a48b445f`. Cierre mediante commit local en español, sin push. La auditoría comprueba UTF-8, diff y ausencia de valores secretos; credenciales QA, respaldos, capturas y evidencia privada permanecen excluidos de Git.

Los pushes siguen retenidos por instrucción vigente hasta revisar las integraciones de despliegue. Sin producción, main, merge, despliegues o cambios de integraciones. MT4 queda verificada representativamente; siguen MT5, MT6, CT4–6, ámbitos especializados y recorridos personales antiguos indicados en el inventario. No se declara completa toda secundaria.
