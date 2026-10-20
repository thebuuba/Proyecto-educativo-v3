# Biología y Computación de 4.º: implementación verificada y HTTP parcial

La versión **evaluation-2026.139** conecta Biología y Computación de cuarto. Se leyeron los 1.264 instrumentos completos y pasaron las pruebas y builds finales. El catálogo y la fuente individual se instalaron idempotentemente en Development. El recorrido HTTP/DB quedó **parcial: 19 de 42 muestras verificadas**, con 19 actividades guardadas; dos tiempos de espera interrumpieron la ejecución. La sesión personal del navegador sigue bloqueada por autenticación. No se declara cierre completo de este ámbito.

Rama: `ampliacion-de-instrumentos-2`. Base: `6a5ea75cda009b96e4b616300780f97eb458c44f`. Los pushes permanecen suspendidos por instrucción del usuario sobre las integraciones de despliegue. No se modificaron producción, las integraciones ni sus permisos; no hubo merge, despliegue, reset, migración remota, nueva dependencia o copia de cuentas.

## Fuente y alcance

La asignación oficial es **Biología y Computación**, cuarto de secundaria, ciclo 2, modalidad Académica y salida Ciencias y Tecnología. La malla reúne Salud, Biología Computacional, Bioinformática Medioambiental y Biotecnología: PDF 499–505, páginas impresas 498–504 del currículo MINERD 2023.

Se conservan 352 registros literales, 258 contenidos adaptables —149 conceptuales, 106 procedimentales y tres actitudes condicionadas a acciones observables—, 44 indicadores y 37 exclusiones. De los indicadores, 43 admiten una adaptación observable; I322 conserva su literal y se excluye de evaluación por disposición privada. No se corrigieron ni reconstruyeron textos oficiales.

Las 97 agrupaciones del proveedor enlazan las 258 anclas de contenido y, adicionalmente, I313 como ancla de razonamiento biológico. Las filas mixtas conservan su procedencia, con evidencias distintas para aplicaciones médicas, vegetales y ambientales. Estos conteos no equivalen a ese número de temas independientes ni a cobertura universal de variantes.

La revisión visual existente se conserva. Se cotejó la imagen 502 para confirmar que **Exploración minera** y **Explotación minera** son términos distintos; se descarta una nota anterior que los trataba como duplicación. La P4 duplicada permanece literal; no se inventa una P6. Los indicadores casi duplicados 347/348 no producen criterios duplicados por su procedencia.

## Cambios y causas comprobadas

Se reutilizan el analizador científico, los criterios comunes y los cuatro formateadores. La entrada configurable es aditiva: el guard y los valores por defecto de Ciencias de la Naturaleza común se conservan. El registro optativo valida grado, ciclo, código, modalidad y salida; no habilita una asignatura por coincidencia de título.

Las regresiones detectaron y corrigieron:

- Alias terminados en una raíz incompleta que, por los límites de palabra, no reconocían el objeto completo.
- Sustantivos como «registro», «consulta», «interpretación» y «aplicaciones» confundidos con órdenes de observar, investigar, interpretar o aplicar.
- Alternativas con varias acciones que acababan exigiendo ambas ramas. Se separan antes de procesar sus acciones internas, también con mayúsculas.
- Explicaciones independientes del mismo tema que perdían el segundo objeto al deduplicar. Conservan evidencias e identificadores distintos.
- Problemas de neurobiología a los que se imponía un algoritmo computacional ausente de la consigna.
- Ensayos médicos que arrastraban implicaciones legales por un alias demasiado amplio, e informes de proyectos proporcionados que exigían otro proyecto.
- Agrupaciones amplias que ocultaban el objeto solicitado. Las facetas distinguen, entre otros, ozono e invernadero, exploración y explotación, tipos de residuos, ADN y proteínas, células animales y vegetales.
- La interpretación de frecuencias de registros ya proporcionados que sugería escala de observación. Se conserva la evaluación de calidad; observar y registrar repetidamente sigue admitiendo escala.

Las conexiones abarcan interpretación/recomendación del backend y preparación, sugerencias y tipo automático del frontend. No se añadió un control de estrategia, banner de preparación ni cambio de diseño. Se conservan las selecciones manuales, puntos pendientes, cuatro formatos y sumas exactas de 20 y 17.35.

## Instrumentos completos

Se registró la lectura de 1.264 instrumentos: 219 contratos y 97 consignas breves, cada uno en rúbrica, cotejo, escala y ponderada. La reconstrucción exacta enlaza 322 textos distintos, 25 familias de cinco progresiones, 310 referencias de objetos/relaciones y 13 paquetes de formatos y puntuaciones. El caso de dieta con condiciones de entrega se leyó aparte en los cuatro formatos. Las huellas permiten detectar cambios posteriores a la lectura.

Las consignas usan modelos, datos y fuentes proporcionados. No exigen diagnósticos, dosis, procedimientos clínicos sobre personas, datos sanitarios privados, cultivos peligrosos, liberación de organismos, publicaciones, empresas o ventas reales. Una salida computacional o similitud de secuencias no acredita eficacia clínica ni identidad funcional. El análisis de un extracto legal no afirma su vigencia consolidada.

Hay límites editoriales menores registrados: algunas combinaciones de artículos y cláusulas son poco naturales; la condición transversal de una entrega mantiene la redacción previa «las 1 condiciones». Las alternativas de varias acciones conservan una fila extensa que describe cada rama completa. No se alteró el motor de otras áreas para corregir esos detalles.

## Verificaciones ejecutadas y pendientes

Los contratos focalizados finales pasan: **1.760 backend, 1.753 frontend y siete pruebas de propósito**. Se verificaron paridad, guard de contexto, formatos manuales, puntos pendientes y totales. Nueve pruebas de catálogo/entrada configurable pasan; el catálogo 138 congelado conserva todos sus campos anteriores, y el 139 añade únicamente versión y registro científico.

La comparación contra el motor congelado 138 conserva **10.764 instrumentos completos de 15 optativas anteriores**, 15.176 definiciones de Inglés común y 2.888 de Matemática común. Hay 36 diferencias respecto de artefactos antiguos que ya estaban presentes en el motor 138; no se reescribieron esos artefactos. El linaje conserva también las definiciones previas de Sociales, Artística, Educación Física y FHR. Las 12 baselines personales existentes pasaron consultas de solo lectura, sin añadir ni reescribir ninguna.

Primera ejecución global: backend 86.013/182 archivos y actividades frontend 84.877/114 archivos, sin fallos. Tras las últimas correcciones, backend volvió a pasar con **86.028 pruebas/183 archivos**; la segunda ejecución del frontend pasó con **84.885 pruebas/114 archivos**. Los cuatro builds finales —shared, backend, frontend y `pnpm cloudflare:build`— terminaron con código 0; Cloudflare utilizó `wrangler deploy --dry-run`, sin despliegue.

El primer build frontend falló por tres importaciones sin uso; fueron retiradas. El siguiente detectó un asset de 2.112.217 bytes, 15.065 por encima del límite de precaché. La prueba de precaché reprodujo ese fallo. Se añadió un chunk de metadata científica siguiendo el patrón existente; el build final pasa. Los 75 assets JavaScript están precargados; el mayor ocupa **2.063.915 bytes**, con 33.237 bytes de margen. La prueba de precaché pasa. No se elevó el límite de 2 MiB.

Los tests Node de fuente, inventario e historial pasan: **45/45**. El lint del frontend termina sin errores y mantiene nueve advertencias previas. El lint del backend detectó una importación sin uso adicional: se retiró y la comprobación pasó sin errores.

## Entorno, datos y continuidad

El destino autorizado es exclusivamente **AulaBase Development `eolgunypmtgrsyrjzcld`**. El runtime final comprueba PostgreSQL con `app_backend_local` y sin `BYPASSRLS`, Auth 200, Storage 200 y assets iguales al build. Esta comprobación volvió a pasar después de la interrupción HTTP. La entrada es `/assets/index-BGRlQSSe.js`; el chunk científico ocupa 48.740 bytes y su SHA-256 es `e6ef335dfb5be1ee220dad70721b089eee5e9284dabedcd434069a7bbaf1064e`.

El catálogo 139 se instaló CREATED/UNCHANGED, conservando 71 releases y 888 snapshots previos. La fuente `MINERD_SECUNDARIA_2023_OPT_CT_4_V1`, versión `73286e0d-30f3-56e9-ac65-329876b5ae9c`, se instaló CREATED/UNCHANGED con 352 registros y 37 exclusiones. El contexto QA usa el curso existente de cuarto; la segunda ejecución confirma idempotencia, sin nuevas cuentas ni estudiantes. No se atribuye la verificación QA a la cuenta personal del usuario, cuya sesión de navegador vuelve a pedir contraseña. Se comprobó el asset final por DOM y se conservó una captura privada; no se envió correo, contraseña ni solicitud de acceso. No se borró caché, registro del service worker o almacenamiento.

MT6 conserva su resultado HTTP parcial: 17 de 32 muestras verificadas y 18 actividades guardadas, con IDs e historial preservados. Dos fallos `ENOTFOUND` del pooler terminaron sendos Workers locales. No se borraron errores, actividades, cachés o almacenamiento, ni se cambiaron DNS, credenciales o timeouts para ocultar el bloqueo.

## Persistencia, incidencias y conservación

Se verificaron 19 actividades QA únicas mediante interpretación, recomendación, cuatro formatos, puntuaciones 20/17.35, texto manual, guardado/reapertura y cambio exclusivo a CASE_STUDY manual. La huella exacta del instrumento y su snapshot permaneció igual al cambiar solo la estrategia. Las muestras verificadas representan 19 de 43 indicadores observables; los contratos locales y la lectura abarcan el alcance mayor, pero no sustituyen los 23 casos HTTP pendientes. La participación persistida fue individual; los contratos incluyen consignas grupales, sin atribuirles una prueba HTTP grupal.

Primer intento: un timeout de cliente a 30 s interrumpió la siguiente interpretación después de una muestra verificada. El servidor registró 200 tras 35.458 ms. Se comprobó el runtime y las 12 baselines en solo lectura y se reanudó una sola vez con los mismos IDs. Segundo intento: timeout durante un guardado; el servidor terminó registrando 500 tras 239.263 ms y «Connection terminated unexpectedly». No se estableció una causa más profunda, ni se observó el ENOTFOUND de MT6 en esta incidencia. No se cambiaron DNS, credenciales, timeouts o configuración ni se inició otro intento en bucle.

El progreso conserva 126 respuestas HTTP recibidas, cero HTTP 500 recibidos por el cliente, **un HTTP 500 tardío observado en el servidor y dos timeouts de cliente**. Los cuatro 400 esperados corresponden al encabezado e I322 privado, comprobados en ambos intentos. Las medianas de solicitudes exitosas fueron 6.092 ms en interpretación, 5.868 ms en recomendación y 4.828 ms en escritura; no constituyen evidencia de mejora de rendimiento y no incluyen la espera que terminó sin respuesta al cliente.

Las consultas posteriores de solo lectura confirmaron 72 releases y 907 snapshots: los 71/888 previos son exactos y solo existen 19 actividades/snapshots QA nuevos, sin duplicados. De los 20 IDs preparados, el último no existe en la base; se conserva para una recuperación futura idempotente. Las 12 baselines personales volvieron a pasar después de las pruebas, sin crear ni reescribir baselines o actividades personales. La evidencia pública distingue lo recibido por el cliente de lo observado después en los logs del servidor.

## Archivos y pendientes reales

El proveedor, metadata, facetas y adaptador están en `packages/shared/src/secondary-optative-science*.ts` y `secondary-optative-ct-4*.ts`; la entrada común configurable, en `secondary-science-common.ts`. También cambiaron las conexiones de recomendación/interpretación y preparación/sugerencias/tipo automático, los catálogos 138/139, las pruebas backend/frontend/Node, el chunk de metadata y las herramientas acotadas de fuente/QA/HTTP. Los artefactos están en `docs/curriculum/cobertura-secundaria/optative-ct-4-*`. La revisión es propia por prohibición de subagentes y carece de la independencia de otro revisor.

Pendientes: 23 muestras HTTP de CT4, recorrido personal autenticado y recuperación futura sin recrear los IDs. Las herramientas privadas `close-ct-four-evidence` y `preserve-history-139`, preparadas para 42 muestras/930 snapshots, **no se ejecutaron**; la evidencia autorizada es `partial-checks-139`. MT6 mantiene su propio HTTP parcial, independiente de CT4. Se documentaron pasos manuales en `optative-ct-4-verificacion-navegador.json`. Los detalles editoriales menores constan arriba.

La auditoría y el commit local del bloque se ejecutan tras revisar el diff, UTF-8 y exclusión de secretos, credenciales QA y respaldos. Continúan Química y Computación de 5.º, Física y Computación de 6.º, modalidades especializadas y pendientes personales autorizados. La preparación privada CT5 —71 agrupaciones, 117 anclas, 37 indicadores y 152 contratos borrador— no se atribuye a implementación. Los pushes permanecen suspendidos por instrucción vigente.
