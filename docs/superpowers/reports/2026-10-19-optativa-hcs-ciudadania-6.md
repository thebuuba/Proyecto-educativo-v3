# Ciudadanía y Democracia Participativa — 6.º HCS

Estado: bloque verificado con instrumentos completos, HTTP/DB y recorrido personal en Development. Cobertura representativa; no se acredita toda variante curricular ni se da por completada secundaria.

## Fuente y alcance

`OPT-HCS-SOC-6`, segundo ciclo de la modalidad Académica, salida Humanidades y Ciencias Sociales. MINERD 2023, PDF 488–489, impresas 487–488; scope `ec62cee2-b76d-5582-8cf1-7762b9e5b4fd`. Se conservaron la lectura visual y clasificación originales, sin repetir renders o modificar literales.

97 registros; 47 contenidos adaptables (19 conceptuales, 24 procedimentales y cuatro actuaciones observables), 15 exclusiones (dos rótulos y 13 disposiciones privadas), 21 indicadores. P37/A60 conservan ambas anclas, con sus saltos de línea originales. Su adaptación permite argumentar sobre un caso, sin calificar adhesión o emociones.

23 agrupaciones temáticas, 80 consignas desarrolladas y 23 breves: **412 instrumentos completos**, 35 familias, 105 textos y 11 paquetes de puntuación. Se leyeron criterios, cinco progresiones, cuatro formatos, descriptores, alternativas, correspondencias y puntos mediante reconstrucción exacta. Las 400 huellas iniciales se conservaron; la revisión final añadió 12 instrumentos de tres consignas habituales. Cero lecturas pendientes. Evidencia en los archivos `optative-hcs-soc-6-*` de cobertura.

## Cambios y causas

Metadata propia de sexto y adaptador pequeño conectados al parser social y a los cuatro formateadores existentes. El contexto exige grado, ciclo, modalidad y salida propios. No se duplicó el motor ni se añadieron dependencias o migraciones.

Se distinguen fuentes, atribución, registros, planes de investigación, borradores, periódico, artículo, memoria, ensayo/informe, campaña, brochure, organizadores, deliberación y procedimientos simulados. La lectura reprodujo y corrigió selección de pasos que exigía proyectos completos, objetos perdidos, fuentes ambientales con etiquetas constitucionales, cultura de paz omitida, productos duplicados y concordancia de memoria. Tres variantes finales protegen «crea», «escribe» y «presenta»; 24 aserciones RED pasaron después de la corrección.

Una corrección compartida evita convertir referencias genéricas a secciones en listas de apartados inventadas: dos pruebas RED→GREEN, conservando las listas explícitas. La sesión personal detectó otro fallo real: «rol» y «decisión» en singular no sugerían Simulación. Tres casos RED pasaron al reconocer esas formas manteniendo representación y simulación como condiciones; las palabras aisladas o los recursos no bastan. Se corrigió también la explicación de esa sugerencia.

APA/MLA/LM permanecen literales; se utiliza únicamente la pauta dada o elegida, sin inventar LM ni exigir tres normas. Los casos usan textos o datos agregados ficticios; no requieren entrevistas reales, datos privados, activismo ni afiliaciones. El procedimiento de bandera e himno solo se evalúa cuando se pide explícitamente, sin imponer canto o sentimientos patrióticos.

## Pruebas y build final

- Backend completo: **82.269 pruebas / 177 archivos / cero fallos**. Cuatro expectativas nominales antiguas de versión se actualizaron tras observar su fallo; 134 conserva sus dos módulos originales. Tras los ajustes se repitió la suite completa y luego 707 controles focalizados en el build final.
- Frontend actividades: **81.349 pruebas / 110 archivos / cero fallos**; después, **662 pruebas afectadas / tres archivos / cero fallos** sobre el código final. Son ejecuciones distintas y parcialmente coincidentes; no se suman. No es la suite de todo el frontend.
- **39 controles Node / cero fallos**, repetidos tras cerrar evidencia. Fuente, inventario, historia y precaché. Lints sin errores; 16 advertencias anteriores en frontend.
- `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build` finales correctos, además del build shared. Cloudflare terminó con **--dry-run**; no hubo despliegue.

El primer build frontend superó la precaché: 2.131.576 > 2.097.152 bytes. Se separó únicamente la metadata pura HCS 4.º–6.º con el patrón existente de manualChunks, sin elevar el límite. Build final: 73 JS, todos precargados; máximo 2.028.667 bytes. Cada Worker propio se comprobó y detuvo antes de compilar; se esperó a terminar HTTP.

## Development e instalación

Runtime efectivo exclusivamente `eolgunypmtgrsyrjzcld`: PostgreSQL `app_backend_local` sin BYPASSRLS, Auth200, Storage200 y variables públicas/bytes de frontend comprobados. Entrada `/assets/index-Dzuj2BcB.js`; metadata `instrumentos-optativas-sociales-BEnCyOaH.js`, 103.312 bytes, SHA256 `b004ae1f9270cf0095a8971acb7e3c655356de3522a9e8d7bfb71ceb89270b0c`.

Catálogo135 CREATED/UNCHANGED. Fuente individual `MINERD_SECUNDARIA_2023_OPT_HCS_SOC_6_V1`, versión `dd87ac4c-be90-57bf-9e26-9e6003d9e302`, scope importado `0d4db567-e87f-53e3-9511-530bd7a923a8`, 97 registros/15 exclusiones, CREATED/UNCHANGED. Los ajustes posteriores no cambiaron el payload y no se repitieron las instalaciones.

## HTTP/DB y navegador, por separado

**32 muestras persistidas**, todos los 21 indicadores, ocho por formato y 16 por puntuación (20/17.35). 195 solicitudes, cero HTTP500; anclas/exclusiones, interpretación/recomendación, paridad, texto manual, puntos pendientes, guardar/reabrir y estrategia sola exacta. Medianas: interpretación 5.902 ms, recomendación 6.092 ms, escrituras 4.289 ms. Sin inferir mejoras causales ni modificar timeouts.

Esas 32 muestras precedieron al último ajuste de inferencia y verbos. En el runtime final se comprobaron además las tres variantes nuevas mediante 12 recomendaciones completas y tres interpretaciones, sin nuevas actividades o snapshots. Un primer probe adicional recibió400 por enviar al DTO de interpretación campos exclusivos de recomendación; se corrigió el probe, sin parche al servidor. Se conserva separado del resultado exitoso de16 solicitudes.

**Sesión personal real de Alexauris**, curso ficticio separado de6.º HCS en su misma escuela, sin cuentas o estudiantes nuevos y con filas originales preservadas. Cuatro formatos completos leídos, ponderada100%, puntos vacíos iniciales, 17.35→20→17.35 exactos, modalidad y formato manuales. En build final: SimulaciónAUTO para la consigna singular, criterio manual, una creación, listado→Editar y reapertura; solo Estudio de casoMANUAL, una actualización y recarga. Los trece campos visibles y la huella DB permanecen idénticos.

Actividad `d4894586-9899-4a94-a7d8-dfaab8d680f7`; instrumento `fca9bfee-ea69-4931-b384-7440e8c1857c`; snapshot `0cdf2057-f1e6-4b69-9ba3-e6d130634a25`; huella `62c5fe2645cbf1ba24a2d951c2ae45d6`; catálogo135/rúbrica17.35. Captura completa privada guardada y revisada, excluida de Git. La nueva baseline se capturó una vez; las diez anteriores siguen intactas.

Limitaciones de recorrido: los cuatro formatos se leyeron con el mismo payload135 antes del último ajuste; rúbrica, sugerencia, persistencia y comparación se repitieron en build final. La recarga inicial del código nuevo encontró vacío el formulario QA aún no autoguardado; se reintrodujo solo esa prueba, sin limpiar almacenamiento. La validación exigió confirmar modalidad; se regeneró el instrumento QA con confirmación y se reintrodujo su título manual antes de crear. No se borró ningún borrador anterior. Captura y prueba son representativas de este contexto, no de toda combinación curricular.

## Conservación, revisión y continuidad

67 catálogos y772 snapshots previos exactos; final68/805, con33 snapshots nuevos identificados (32QA+1personal), ninguno extra por estrategia. Las9.120 definiciones completas de once optativas coinciden con el motor congelado134, incluidas608Demografía/480Filosofía;15.176 definiciones de Inglés común comparadas sin cambios, además de Sociales/Artística/Física/FHR1.º–6.º.

Hay36 diferencias contra artefactos todavía más antiguos (HLM Lengua4.º:12, Lengua5.º:16, Inglés4.º:8), ya presentes en134. No las introdujo135 ni se regeneraron esos artefactos o instrumentos guardados.

Revisión propia, sin revisor independiente por el límite de no usar subagentes. Una pasada final corrigió los verbos de productos con RED→GREEN y suite verde. Menores diferidos: algunas etiquetas repiten artículos o conceptos relacionados; la etiqueta de rama «campana» carece de tilde, aunque sus descriptores sí la incluyen. No alteran tareas, puntos o datos.

Decisiones registradas: ejecutar en el checkout actual sin agentes (menor independencia de revisión); retener push por orden posterior (avance remoto pendiente); usar el nombre oficial de la fuente (corregir abreviaciones); conservar workspace/evidencias (espacio local adicional); dividir metadata pura sin ampliar precaché (otro asset, ya precargado); UI yHTTP con cuentas independientes y dependencias ya verificadas (medidas de tiempo no aisladas); esperar HTTP antes del rebuild final, sin reinstalar un payload idéntico (demora de cierre).

Rama `ampliacion-de-instrumentos-2`, base `f2b0961eefdfe2aadbe9b5132f1e5cb9a09067d7`. Commit local español de este bloque: consultar Git y el archivo privado de cierre; no duplicarlo. **NO PUSH** hasta revisar integraciones403. Ningún cambio de producción, Hyperdrive, secretos, permisos o integraciones; sin merge, despliegue, esquema remoto, reset o copias de producción.

Doce optativas académicas verificadas representativamente; faltan las seis de Matemática y Tecnología/Ciencias y Tecnología, las modalidades especializadas y verificaciones personales anteriores. Siguiente: Matemática Financiera y Tecnología4.º, después5.º→6.º y los demás ámbitos autorizados, sin preguntas rutinarias.
