# Estadística, Probabilidad y Tecnología de 5.º

Estado: proveedor conectado, instrumentos revisados, comprobaciones globales correctas y catálogo **137 instalado en Development**; QA HTTP/DB completado. Recorrido personal bloqueado por autenticación. Rama `ampliacion-de-instrumentos-2`, base `f3b3069e890cb10083e07ba85d319dcaf5359c52`. Sin push, merge ni despliegue.

## Fuente y alcance

Nombre literal: **Estadística Probabilidad y Tecnología**, `OPT-MT-5`, salida Matemática y Tecnología, modalidad Académica, grado 5/ciclo 2. Scope `87268d19-5d32-5426-9396-21ae21fc5bbd`, PDF 494–495, impresas 493–494. Se reutilizó la lectura visual y clasificación anteriores sin repetirlas.

84 registros originales: 14 competencias, 49 C/P/A y 21 indicadores. Se adaptan 44 anclas (23 conceptos, 20 procedimientos y A60 sobre revisión de trabajo concreto). Cinco disposiciones privadas C/P/A e I84 sobre compromiso privado quedan excluidos: seis exclusiones. Se conservan los 21 indicadores literales; las muestras representan 20 indicadores observables.

I80 mantiene «datos que se asumen normalizados»: normalizar no demuestra normalidad; el modelo normal necesita un supuesto explícito. P53 mantiene «certeza supuesta», sin convertir probabilidades en certezas universales. No se fijan confianza, margen de error, denominadores, causalidad o extrapolación no dados. Se usan datos dados, ficticios o agregados, sin encuestas privadas obligatorias.

## Implementación y revisión

Se reutilizan el parser matemático, registro optativo, entradas de interpretación/recomendación, alternativa local y cuatro formateadores. Metadata de 5.º y adaptador estadístico propios; las reglas financieras de 4.º se conservan. El override opcional de objetivos de cálculo evita introducir otras medidas y mantiene los valores predeterminados de Matemática común.

Se revisaron 528 instrumentos completos: 84 contratos más 48 consignas breves, cuatro formatos; 160 textos distintos mediante 27 familias y variables reconstruidas exactamente, cinco progresiones, descriptores, correspondencias y 25 paquetes de puntuación. Las sumas de 20 y 17.35, puntuación pendiente, criterios manuales y paridad local/servidor están contratadas. No se infiere cobertura universal de estas muestras.

Fallos reproducidos con pruebas antes de corregir:

- «Modelo» como sustantivo convertía explicaciones en ejercicios.
- El proyecto perdía organización y análisis después de una coma.
- «Eventos simples y compuestos» omitía el segundo objeto.
- Frecuencias y distribuciones dadas se convertían en cálculos adicionales.
- «No asumas independencia» añadía el tema negado.
- Fortalezas y mejoras en plural caían al tema estadístico general.

Se conservan pequeños artículos o cláusulas repetidos sin efecto en requisitos ni puntuaciones. Revisión propia, con menor independencia al trabajar sin subagentes por instrucción del usuario.

Archivos principales: `packages/shared/src/secondary-optative-mt-5.ts` contiene la metadata; `secondary-optative-statistics-evidence.ts`, la selección y las evidencias; `secondary-optative-math.ts`, el registro compartido. `secondary-math-common.ts` y su tipo admiten objetivos de cálculo opcionales sin alterar los valores predeterminados comunes. En backend se añadió el catálogo 136 congelado, se avanzó el actual a 137 y se ampliaron las pruebas del servicio y de conservación. Los contratos backend/frontend y el fixture MT5 prueban el comportamiento. Las herramientas existentes de fuente, QA, HTTP, artefactos e inventario admiten explícitamente quinto. Las correspondencias, instrumentos, lectura por huella y verificaciones viven en `docs/curriculum/cobertura-secundaria/optative-mt-5-*`.

No hubo cambios de esquema, migraciones, dependencias, componentes de formulario ni configuración de producción. Las preparaciones posteriores de MT6, CT4 y CT6 permanecen privadas, sin proveedores conectados ni instalación remota; no se incluyen como cobertura de este bloque.

## Comprobaciones y pendientes efectivos

Contratos finales: backend 681/0, frontend 677/0. Suite final: **backend 83,781 pruebas/179 archivos/0 fallos; frontend actividades 82,711/112/0**. No equivale a ejecutar toda la suite del frontend. Fuente/inventario/historia: 41/0; precaché 1/0. Lints sin errores, nueve advertencias previas en actividades.

La primera suite global detectó cuatro expectativas que aún apuntaban al catálogo 136; se actualizó únicamente la versión actual y se añadió protección del 136 congelado. La segunda ejecución pasó completa.

Los cuatro builds finales terminaron con código 0: shared, backend, frontend y `pnpm cloudflare:build`. El último es **dry-run**, sin despliegue. Los 73 assets JS caben en la precaché y están incluidos; máximo 2,082,229 bytes, límite 2,097,152, margen 14,923.

Los 528 instrumentos coinciden entre fuente y backend compilado. Contra el motor 136 congelado se conservan exactamente 15,176 definiciones de Inglés común, 2,888 de Matemática común y 9,964 instrumentos completos de las 13 optativas anteriores, incluidos los 432 de MT4. Las 36 diferencias con artefactos históricos ya existían en 136; no se regeneraron esos artefactos. Sociales, Artística, Educación Física y Formación Humana anteriores también se conservan. Las doce baselines personales anteriores permanecen intactas, sin sobrescribirlas.

Runtime final verificado: PostgreSQL usa `app_backend_local` sin BYPASSRLS; PostgreSQL, Auth, Storage y variables públicas del frontend apuntan exclusivamente a Development `eolgunypmtgrsyrjzcld`. Auth/Storage responden 200. Entry `/assets/index-GUsJIhIk.js`; los assets servidos coinciden por hash con el build. El Worker 136 propio se detuvo antes de compilar; el 137 se levantó con `--built`.

La sesión personal ya no está autenticada: una nueva pestaña de Chrome muestra «Inicia sesión» y, al continuar con la cuenta recordada, solicita contraseña. La compilación final está visible en esa pestaña. **No se verificó el recorrido autenticado MT5 con la cuenta personal**. No se cambiaron contraseñas ni se reenviaron correos; no se limpió SW, caché, almacenamiento o borradores. La evidencia de QA no sustituirá esta prueba.

Catálogo instalado: `CREATED` y luego `UNCHANGED`, conservando los 69 releases y 838 snapshots anteriores. Fuente individual `MINERD_SECUNDARIA_2023_OPT_MT_5_V1`, versión `7ee9b5de-67ee-5b58-8319-334da606520c`, 84 registros/seis exclusiones, también `CREATED`/`UNCHANGED`. Se prepararon dos veces los contextos QA y personal de quinto de forma idempotente, sin crear usuarios ni estudiantes. Las filas escolares existentes se comprobaron por huella y permanecen intactas.

Cierre de datos verificado; auditoría final y commit local registrados al terminar el bloque. No se alteraron cuentas o datos de producción.

## Prueba manual pendiente con la cuenta personal

1. Iniciar sesión en `http://localhost:8787/login` con la cuenta propia de Development. La pestaña conservada solicita contraseña; no se ha solicitado otro enlace.
2. Abrir el [creador de Estadística de quinto en el contexto QA separado](http://localhost:8787/actividades/crear?sectionSubjectId=ac914fbf-6fa4-4719-8a0b-eb2a0f152aee&academicPeriodId=fec939cd-a621-4a7e-af29-795e8d792c49), curso «5.º secundaria QA MT Development», sección «QA MT Development».
3. Usar un título QA identificable y esta descripción: «Resuelve el caso ficticio de probabilidad condicional usando el evento condicionante y los datos proporcionados. Justifica la respuesta con los supuestos dados». Confirmar estrategia visible y automática, instrumento completo y puntuación inicialmente vacía.
4. Revisar los cuatro formatos, seleccionar manualmente modalidad e instrumento, probar 17.35→20→17.35 y conservar un criterio manual. Guardar una sola actividad y reabrirla desde el listado.
5. Cambiar únicamente la estrategia, guardar y reabrir; comparar exactamente criterios, descriptores, puntos e instrumento. Registrar la actividad y su baseline una sola vez. No atribuir esta comprobación a la ejecución de QA por API.

No se creó actividad ni baseline personal MT5 durante este bloqueo; las doce anteriores siguen protegidas. No borrar borradores, cachés ni almacenamiento para hacer esta prueba.

Los pushes siguen retenidos por instrucción expresa mientras no se verifiquen las integraciones de despliegue que devolvieron 403. Una compilación automática o preview no acredita despliegue efectivo. No se cambiaron integraciones, permisos ni triggers.

## Resultado HTTP/DB y conservación final

Las **32 consignas únicas** cubren los **20 indicadores observables** mediante ocho muestras por formato y 16 muestras de 20 puntos/16 de 17.35. Las 196 solicitudes terminaron sin errores500; hubo dos400 esperados:una disposiciónC/P/A yel indicadorI84 excluidos. Se comprobaron interpretación,recomendación,paridad local/servidor,ancla de fuente,criterio manual,puntos pendientes,persistencia,reapertura y cambio aislado de estrategia conservando exactamente el instrumento ysu snapshot. No equivale al recorrido visual con la cuenta personal.

Medianas de esta ejecución:interpretación 6062ms,recomendación 6001ms,escritura deactividad 4347ms. Son mediciones deesta muestra,no prueba de mejora causal frente a otros bloques; no se elevaron timeouts para ocultar fallos.

Historial final:70releases/870snapshots. Los69releases/838snapshots anteriores permanecen exactos;32snapshots QA nuevos corresponden a32actividades identificables. No se creó actividad ni baseline personalMT5. Las12baselines personales anteriores se verificaron de nuevo en lectura después deQA,sin sobrescribirlas. Entorno final revalidado exclusivamenteDevelopment,sin producción,merge,despliegue ni push.

Pendiente real del bloque:recorrido visual autenticado con la cuenta personal,por acceso a la sesión. El contextoQA5 separado ylos pasos manuales anteriores permiten retomarlo. La revisión de instrumentos yHTTP/DB sí están ejecutadas;ninguna tabla de resultados presenta el acceso personal como completado. El resto del encargo continúa conMT6,CT4/5/6,modalidades especializadas ypruebas personales antiguas.
