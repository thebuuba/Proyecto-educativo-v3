# Textos periodísticos y publicitarios de 6.º HLM

Bloque técnico verificado del encargo integral de secundaria. Base `d1f6d755d33c59828e045107a1eb769d4f2d34f1`, rama `ampliacion-de-instrumentos-2`, catálogo instalado `evaluation-2026.126`. Exclusivamente AulaBase Development `eolgunypmtgrsyrjzcld`. Push retenido por instrucción del usuario hasta revisar las integraciones de despliegue; sin producción, main, merges, despliegues, migraciones de esquema, nuevas cuentas ni subagentes.

## Fuente y alcance

MINERD 2023, PDF437–444 / impresas436–443, ocho páginas completas revisadas visualmente. Scope `6ebb8ac8-f9d0-5530-9c53-366f87055eee`, modalidad Académica, salida Humanidades y Lenguas Modernas, código `OPT-HLM-LEN-6`. Nombre oficial: Análisis y Producción de Textos Periodísticos y Publicitarios. No acredita la optativa científica y profesional de HCS.

162 registros:51conceptos,60procedimientos,16actitudes,21indicadores y14competencias. Clasificación individual de127C/P/A:93contenidos adaptables (44C/45P/4A),21encabezados,1nota de alcance,4contextos de interacción cuando se solicitan y8disposiciones privadas excluidas. Los93registros no son93temas independientes. Las cuatro actitudes adaptadas corresponden al análisis observable de posturas, manipulación, estereotipos o efectos; no se califica ideología, adhesión partidaria, personalidad ni creencias.

| Género | Evidencias y familias representativas |
|---|---|
| Editorial | Comprensión, anticipación, función, postura y argumentos, estructura y recursos, comparación, debate, planificación, escritura, presentación y revisión. |
| Columna periodística | Comprensión, tesis y argumentos, recursos y estilo, comparación, plan, producción oral/escrita y revisión; subrayar no exige explicar. |
| Anuncio publicitario | Comprensión y anticipación, tipo e intención, producto y valores, identificador/eslogan, canales de recursos, análisis crítico, planificación y prototipo escrito con presentación oral complementaria. |
| Propaganda política | Comprensión y anticipación, función, destinatario, eslogan, recursos y registro, análisis crítico de manipulación y efectos, plan y producción ficticia. |

Se conservan las continuaciones de columna al comienzo de PDF440. En441, lectura/escritura siguen perteneciendo al anuncio hasta la última comprensión oral de propaganda. La referencia literal al ensayo académico dentro de una lectura no crea un quinto género. La presentación oral de anuncios complementa el escrito; no exige una actuación profesional. No se exige publicar, pagar materiales, abrir cuentas, promover partidos reales ni compartir opiniones personales. El mínimo de tres argumentos se limita a la producción completa correspondiente y no invalida una consigna que pide dos.

## Implementación y regresiones

Metadata `packages/shared/src/secondary-optative-hlm-len-6.ts`:cuatro perfiles y59rasgos, conectados al proveedor compartido `secondary-optative-language.ts`. Se reutilizan composición, procedimientos y cuatro formateadores; no se crea otro motor ni se cambian componentes visuales.

105consignas de fixture más cuatro breves:109casos/436instrumentos completos. La lectura comprende115textos únicos con sus cinco niveles,27paquetes de formatos/unidades/pesos y109correspondencias de consignas. Las432huellas originales permanecieron idénticas al añadir la prueba final del plan breve. [Ejemplos completos](../../curriculum/cobertura-secundaria/optative-hlm-len-6-instrumentos.json) y [huellas de lectura](../../curriculum/cobertura-secundaria/optative-hlm-len-6-revision-instrumentos.json).

Se observaron fallos y su corrección mediante regresiones RED→GREEN: planes que arrastraban personajes/sucesos; verbos de subrayado, debate, evaluación y diseño; presentación de texto preparado confundida con lectura; dimensiones duplicadas; ausencia justificada de manipulación penalizada; prototipo confundido con tipo de anuncio; anticipación que añadía análisis de sus apoyos; cinco canales de recursos agrupados; revisión ortográfica que imponía cambios de contenido; registro expresamente solicitado omitido; y plan breve sin enumeración de componentes. El reconocimiento simple sugiere cotejo; los formatos manuales y puntos pendientes se conservan.

También se corrige en126 el alias singular «novela policial» de5.º, después de congelar125 contra su payload instalado. Regresiones backend/frontend y cuatro instrumentos completos idénticos al breve oficial ya leído. [Ejemplos del alias](../../curriculum/cobertura-secundaria/optative-hlm-len-5-alias-126-instrumentos.json). No se sobrescriben los272ejemplos ni las doce pruebas HTTP históricas de125.

El generador de inventario omitía volver a cargar la matriz de5.º al regenerar y no cargaba la de6.º. Una prueba nueva falló con estado PENDING para6.º; ahora se cargan explícitamente las matrices4/5/6 y el inventario conserva el estado efectivo de cada ámbito, separado de las otras salidas.

## Comprobaciones antes de instalar

Backend completo:63.633pruebas/164archivos,0fallos. Frontend de actividades:64.855pruebas/101archivos,0fallos; no es toda la suite del frontend. Shared, backend, frontend y `pnpm cloudflare:build` terminaron0; Cloudflare fue dry-run. Lints:0errores/16advertencias previas del frontend. Inventario, fuente y precaché:18pruebas,0fallos.

Fuente126 y compilado idénticos; congelado125 idéntico al instalado. Los campos anteriores del catálogo se conservan; dentro del módulo5 cambia únicamente el patrón del alias. Comparación completa:288instrumentos HLM4 y272HLM5 idénticos, además de las definiciones verificadas de Sociales, Artística, EFI y FHR1–6. No se modifican releases históricos.

Localhost sirve `/assets/index-CxQiaaZ_.js`, SHA256 `d9fa1e6a40158834497f13790d5326f387b625d212ba22a60c88109b559ce1af`. El guard confirmó PostgreSQL `app_backend_local` sin BYPASSRLS, Auth200, Storage200, variables públicas y assets del creador/shared/planificación/SW exactos a dist, exclusivamente Development. La recarga normal del navegador recibió ese entry y `registerSW.js`; no se borraron caché, service worker, almacenamiento ni borradores. Al arrancar se corrigió una invocación del Worker que omitía inyectar el entorno de Hyperdrive local: se utilizó el launcher existente con `developmentEnvironment`; no se cambió ninguna configuración remota.

## Instalación individual en Development

Catálogo126 instalado CREATED/UNCHANGED, fuente=compilado y58catálogos/501snapshots previos idénticos. La comprobación administrativa de32catálogos congelados tardó unos16minutos; se observó espera al cliente y no un bloqueoSQL. No mide la preparación del creador ni motivó cambios de timeout.

Fuente individual `MINERD_SECUNDARIA_2023_OPT_HLM_LEN_6_V1`, versión `08821d8f-d967-597b-9ac5-3524e46fd458`, scope importado `c394ccab-124f-5d07-a20e-3066af940931`, CREATED/UNCHANGED:162elementos y34exclusiones. Literales, spans, relaciones, modalidad y salida exactos;59releases/501snapshots preservados durante publicación. Se reutilizó el curso ficticio QA existente de6.º, sin modificarlo ni crear cuentas. No se ejecutaron migraciones de esquema.

Dieciséis muestras autenticadas HTTP/DB completadas, con los cuatro géneros en cada uno de los cuatro formatos y puntuaciones20/17.35. Interpretación y recomendación conservan ámbito/fuente exactos; exclusiones400, paridad local, elección manual de formato, edición de texto, guardado/reapertura y estrategia sola con instrumento exactamente conservado. El reconocimiento de tesis/argumentos en columna sugiere cotejo de dos evidencias sin explicación adicional y conserva la rúbrica manual. Los puntos pendientes se comprueban en la conversión local de campos usada en el recorrido, antes de asignar la puntuación; no se afirma haber guardado por HTTP una actividad sin puntos. La modalidad GROUP se verifica en backend/frontend; estas muestras HTTP son individuales.

Las muestras incluyen producción oral, análisis breve, prototipo de anuncio, crítica de propaganda, subrayado, registro, dos argumentos, recursos alternativos, planes, anticipación y revisión. Medianas de peticiones exitosas: interpretación 6575ms, recomendación 6453ms y escrituras 3815ms. Se conserva también el400 observado por el fixture erróneo y su corrección; no se oculta ni se atribuyen diferencias entre grados a una regresión sin comparación controlada. [Evidencia HTTP/DB](../../curriculum/cobertura-secundaria/optative-hlm-len-6-verificacion-http.json).

Una muestra adicional autenticada verifica el alias singular de5.º en126, con guardado/reapertura y estrategia sola exacta. No sustituye las doce muestras históricas de125. [Evidencia del alias](../../curriculum/cobertura-secundaria/optative-hlm-len-5-alias-126-verificacion-http.json).

Historia final59catálogos/518snapshots:58/501previos idénticos, más17actividades QA/snapshots nuevos; cambiar solo estrategia no añadió snapshots. La consulta protegida de la muestra personal FHR1 conserva identificadores,17.35,catálogo118,texto manual y hash, sin regenerar baseline. No se crearon actividades personales de esta optativa para forzar la prueba.

Precaché:71JS,todos incluidos,máximo2.043.126bytes<2MiB. Auditoría final de diff,UTF8 y valores privados antes del commit local; secretos,QA,respaldos y runtime permanecen excluidos. Ningún push ni despliegue.

## Navegador y prueba manual

La cuenta personal recordada sigue solicitando contraseña. No se introdujeron credenciales, enviaron enlaces, utilizaron tokens ni limpiaron datos. No se verificaron visualmente el creador personal, guardado o reapertura de esta optativa; QA no sustituye esa cuenta.

Prueba manual pendiente: iniciar sesión en `http://localhost:8787` con la cuenta propia de Development; abrir6.º académico, salida HLM y esta asignatura. Confirmar los cuatro controles desde el formulario vacío y puntos pendientes. Probar «Subraya la tesis y los argumentos en la columna periodística proporcionada»: cotejo automático con dos evidencias, sin explicación adicional. Cambiar manualmente a rúbrica. Probar «Planifica el editorial solicitado» y un prototipo ficticio de anuncio: instrumentos completos, sin componentes narrativos ajenos. Asignar17.35, editar, guardar y reabrir; cambiar solo la estrategia y comprobar instrumento, criterios, pesos y puntos exactamente iguales.

Revisión propia separada, sin subagentes. Menor editorial diferido: repetición de artículos, conectores o «función» en algunas filas compuestas y espacios mejorables en una enumeración del plan; no agrega requisitos ni cambia alternativas. No se presenta el encargo integral como terminado: quedan15optativas académicas después de este bloque y ámbitos especializados pendientes. No ejecutar push hasta revisar las integraciones.

Hallazgo HTTP y correcci?n de pruebas: la segunda muestra seleccionaba el encabezado excluido de columna y recibi?400. Se detectaron cuatro fixtures breves con ese problema; ahora apuntan a sus conceptos de funci?n/estructura. PruebaNode RED?GREEN, focales backend/frontend verdes tras el cambio. Se releen las cuatro anclas; las436definiciones completas siguen id?nticas y solo cambian16huellas por sus referencias de fuente. No cambia el payload126 ni la fuente publicada, por lo que no se reinstalan ni se reconstruyen dist. El progreso HTTP conserva la actividad inicial y el400 observado; la reanudaci?n no duplica datos.
