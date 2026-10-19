# Apreciación y Producción Literarias de 4.º — Humanidades y Lenguas Modernas

Estado: cierre técnico en Development, con instrumentos completos, compilados y trece muestras HTTP/DB verificados. Recorrido visual personal pendiente de autenticación. No es el cierre integral de secundaria.

## Fuente y cobertura

MINERD, Adecuación curricular de secundaria de 2023, PDF427–431 / impresas426–430, SHA256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`. Las cinco páginas se leyeron visualmente completas, incluidas competencias e indicadores. Scope original `d619d96a-6e30-5201-8264-3bc09502e53e`, modalidad académica, salida Humanidades y Lenguas Modernas, código operativo `OPT-HLM-LEN-4`.

Hay dos géneros: poesía romántica y novela de viajes y aventuras. Se adaptaron 20 conceptos y 20 procedimientos. La clasificación individual conserva 12 encabezados estructurales, 15 autores/obras como referencias opcionales, 12 disposiciones privadas excluidas y un contexto actitudinal que solo se observa si la consigna lo pide. No son cuarenta temas independientes ni cobertura de la asignatura homónima de Humanidades y Ciencias Sociales.

Los 115 registros oficiales (39 conceptos,28 procedimientos,13 actitudes,21 indicadores y14 competencias) quedan separados de las adaptaciones de AulaBase en las [correspondencias](../../curriculum/cobertura-secundaria/optative-hlm-len-4-correspondencias.json) y la [matriz](../../curriculum/cobertura-secundaria/optative-hlm-len-4-matriz.json). Se conservan el fragmento «título y otras» de PDF430 y la extracción intercalada de poesía de PDF428; las adaptaciones proceden de la lectura visual, sin recomponer una cita oficial. Las grafías de autores y títulos sugeridos se preservan como aparecen en la fuente.

## Cambios y causas

El contexto del creador omitía modalidad y salida: `GradingService.loadSectionSubjects` no las seleccionaba y `instrumentAcademicContext` tampoco las propagaba. Las regresiones fallaron antes de conectar esos dos campos. Ahora llegan al proveedor sin inferirlos de la descripción ni editar cursos personales.

`secondary-optative-language.ts` compone metadata de `secondary-optative-hlm-len-4.ts` con los mecanismos existentes de Lengua: rasgos, lectura, escritura, criterios y cuatro formateadores. Se conectaron catálogo, motor, interpretación, sugerencias y alternativa local. El contexto exige secundaria, cuarto y modalidad académica/general; rechaza salida contradictoria, asignatura común, primeros grados y contexto incompleto. No se añadió motor de formatos, IA, dependencias ni cambios de esquema.

Las pruebas iniciales detectaron encabezados individuales/grupales, revisión imperativa, comprobación de predicciones y alias «novela breve de aventuras» sin resolver. Se corrigieron con regresiones. Las pruebas y la lectura de instrumentos completos también encontraron y corrigieron:

- Intención omitida al escuchar un poema con vocabulario pedido.
- Niveles de creación que pedían explicación adicional en vez de construir el texto.
- Gerundio dependiente de narrar convertido en análisis independiente.
- Rasgos de personajes exigidos al distinguir quién habla.
- Revisión de «solo ortografía» ampliada a contenido y organización.
- Explicación analítica añadida a recitación por la palabra «intención».
- Escala narrativa convertida en frecuencia de conducta por «frecuencia de aparición del narrador».
- Identificación de metáfora y comparación que añadía una explicación funcional y siempre sugería rúbrica: ahora separa dos reconocimientos y sugiere cotejo; conserva una rúbrica elegida manualmente.

Los cambios de helpers comunes usan flags optativos; los llamadores comunes conservan su comportamiento. La escala conserva los descriptores disciplinares y gradúa calidad. Permanecen la preparación silenciosa, formulario vertical, selecciones manuales y puntos pendientes. No se modificaron componentes visuales.

## Evidencia y límites

Hay 70 contratos y dos consignas breves: [288 instrumentos completos](../../curriculum/cobertura-secundaria/optative-hlm-len-4-instrumentos.json). Se leyeron sus 62 textos únicos con cinco niveles,31 paquetes de formatos/puntuación y72 correspondencias de consignas. La reconstrucción de todos los textos, descriptores y puntuaciones es exacta; las [288 huellas](../../curriculum/cobertura-secundaria/optative-hlm-len-4-revision-instrumentos.json) se registraron después de la lectura y las correcciones. La última corrección cambió cuatro definiciones, releídas;284 huellas permanecieron idénticas. Las muestras no acreditan todas las variantes posibles ni una clase real.

Pasaron `pnpm --filter backend test` (62 058 pruebas/162 archivos), frontend afectado (11 311/27 archivos), builds de shared/backend/frontend y `pnpm cloudflare:build` con `wrangler deploy --dry-run`. No es un despliegue. La compilación de la última corrección detectó inferencia de `string[]` para los cinco niveles; se tipó la composición como `ContextualTopicCriterion` y se repitieron exitosamente los builds afectados. Lints: cero errores;16 advertencias frontend anteriores. Inventario y manifiesto de fuente:12 pruebas; precaché:71 assets JavaScript, máximo1 989 017 bytes, todos incluidos y menores de2MiB.

El catálogo123 se congeló contra el payload instalado antes de preparar124. Todos sus campos anteriores permanecen iguales. Las definiciones completas de Sociales1–6,Artística1–6,EFI1–6,FHR1–6 permanecen idénticas. Se compararon además1 320 definiciones de Lengua1–6 con los tres helpers de `3bf5dbfc`: sin diferencias. Esta comparación no sustituye una nueva revisión curricular de todas esas áreas.

La comprobación efectiva de localhost:8787 confirmó PostgreSQL `app_backend_local` sin BYPASSRLS, Auth200,Storage200 y variables públicas/servidor exclusivamente `eolgunypmtgrsyrjzcld` (AulaBase Development). Entry final `/assets/index-CwIb-Xds.js`, SHA256 `63f6ba597bbcf7fc5d3aa3164c2a393e889ce711ac6887e6b0afd4701107f3d7`; assets del creador, módulo compartido y service worker coinciden con dist. Recarga normal de navegador recibió ese entry y `registerSW.js`.

Se instaló `evaluation-2026.124`: `CREATED` y segunda comprobación `UNCHANGED`. La validación de payloads históricos tardó unos12min; consultas de solo lectura descartaron bloqueo SQL durante la espera. No es el tiempo de preparación del instrumento. Se publicó individualmente `MINERD_SECUNDARIA_2023_OPT_HLM_LEN_4_V1`, versión `78377c1a-3d59-51dd-8003-68d06194285c`, con115 elementos y sus spans/relaciones exactos,40 exclusiones y modalidad/salida conservadas: `CREATED`, después `UNCHANGED`. No se ejecutaron migraciones ni `db push`.

Las [trece muestras autenticadas](../../curriculum/cobertura-secundaria/optative-hlm-len-4-verificacion-http.json) comprueban cuatro formatos,20/17.35,puntos pendientes, fuente y exclusión con400 esperado, paridad local, edición manual, guardado/reapertura y estrategia sola con instrumento exactamente conservado. El `/activities/center` efectivo devolvió código, modalidad académica y salidaHLM. Se reutilizó el curso QA académico existente, sin editarlo ni crear cuentas. Doce muestras iniciales permanecieron conservadas; la decimotercera comprobó cotejo automático y rúbrica manual para dos reconocimientos independientes, sin explicación añadida. La prueba de estrategia en HTTP es manual; no acredita visibilidad ni selección automática en la sesión personal.

Medianas: interpretación5 998ms,recomendación5 460ms y escrituras4 226ms. Son muestras representativas; no una comparación causal con otros grados. Las huellas de56catálogos y476snapshots previos permanecen exactas; estado final57catálogos/489snapshots, trece actividades QA nuevas y ningún snapshot adicional por cambiar solo estrategia. La muestra personal protegida deFHR1 se comprobó por lectura simple, sin reemplazar baseline: catálogo118/17.35/lista ponderada/MANUAL_PROJECT_BASED e instrumento/snapshot/hash idénticos.

La [comprobación personal](../../curriculum/cobertura-secundaria/optative-hlm-len-4-verificacion-navegador-evaluation-2026.124.json) continúa bloqueada: login ofrece la cuenta recordada y «Continuar como Alexauris» pide contraseña. No se abrió el creador ni se guardó/reabrió con esa sesión; QA no sustituye la prueba personal. No se enviaron nuevos enlaces, cambiaron contraseñas ni limpiaron caché, service worker, almacenamiento o borradores. Pasos para la prueba manual: iniciar sesión con la cuenta propia de Development; abrir cuarto con modalidad académica y esta salida/código; crear actividad, comprobar cuatro controles y puntos vacíos; usar «Recita el poema romántico proporcionado, conservando sus versos y comunicando su intención mediante la entonación»; verificar instrumento completo sin pedir análisis escrito; elegir formato manual, asignar17.35, editar una fila, guardar y reabrir; cambiar solo estrategia y comprobar instrumento, snapshot, filas, pesos y puntos idénticos. Probar también «Corrige únicamente la ortografía del borrador de poema romántico proporcionado y presenta los cambios» sin exigir contenido ni publicación.

## Git y continuación

Rama `ampliacion-de-instrumentos-2`; base `3bf5dbfc7b96df4c2fbea55fa055198205ffbfcb`. El bloque se guarda mediante commit local español; su hash exacto se consulta en Git, sin inferir un push por la existencia del commit. Antes de este bloque había31commits por delante según referencias locales, sin fetch. Push retenido por instrucción del usuario hasta revisar integraciones; no se cambiaron triggers ni permisos. El 403 anterior impide afirmar el estado de esas integraciones. Una compilación, una preview y un despliegue efectivo son hechos distintos; no se ejecutó ni verificó un despliegue nuevo en esta intervención.

Solo Development. Sin producción, main, merge, reset, borrados, migraciones remotas, cuentas nuevas o copia de usuarios. Revisión propia, sin subagentes. Se difiere la repetición menor de artículos y conectores en descripciones compuestas; no cambia las evidencias ni las alternativas. Durante las esperas se completó la lectura visual de las18mallas académicas: [evidencia de fuentes](../../curriculum/cobertura-secundaria/optativas-fuentes-revisadas.json). Esa lectura no acredita18proveedores ni18recorridos. Después de este ámbito continúa Apreciación y Producción Literarias de5.º HLM (epopeya y novela policíaca); siguen pendientes17ámbitos optativos y las modalidades especializadas.
