# Apreciación y Producción Literarias de 5.º HLM

Bloque técnico verificado del encargo integral de secundaria, con recorrido personal pendiente de autenticación. Base `46153a345c83826eca5072744ddb4b0901c409e4`, rama `ampliacion-de-instrumentos-2`. Solo Development `eolgunypmtgrsyrjzcld`. Push retenido por decisión del usuario; sin producción, merge, despliegue, migraciones de esquema, cuentas nuevas ni subagentes.

## Fuente y cobertura implementada

MINERD 2023, PDF432–436 / impresas431–435, páginas completas revisadas visualmente. Scope `a4ba08bf-efdf-5ede-9710-5d1d7ea0c559`, modalidad Académica, salida Humanidades y Lenguas Modernas, código `OPT-HLM-LEN-5`. Sus géneros son epopeya y novela policíaca; la asignatura homónima de HCS tiene otro ámbito y otros contenidos.

102 registros: 27 conceptos, 27 procedimientos, 13 actitudes, 21 indicadores y 14 competencias. Clasificación individual de67C/P/A: 44 contenidos adaptables (24C/20P), 10 encabezados, 12 disposiciones privadas y un fragmento de continuación. «fantásticos.» conserva su ancla junto a la disposición anterior; no genera un criterio independiente. El encabezado de producción escrita intercalado al final de `aa9eec50` no se transforma en otra acción. No se declaran44temas independientes.

Epopeya: comprensión oral y escrita, vocabulario e inferencias, motivaciones y relaciones causales, paráfrasis/resumen, narración, planificación, escritura y revisión; los conceptos incluyen hazaña pública, protagonistas, fantasía, estructura, secuencias, conectores, marcadores, voces y figuras. Novela policíaca: comprensión y producción, desarrollo del misterio, personajes, voces, secuencias, conectores, hipótesis, pistas, suspense, planificación, escritura y revisión. Se evalúan únicamente las acciones y los rasgos pedidos, con casos ficticios. Verso **o** prosa conserva la alternativa. No se exige publicación, ilustración, trabajo colectivo, una novela completa ni todas las fases a cada consigna. No se califica disfrute, creencias ni adhesión personal a los valores del protagonista.

## Implementación y correcciones

Metadata nueva `packages/shared/src/secondary-optative-hlm-len-5.ts`, conectada al proveedor optativo existente. Se reutilizan composición lingüística, procedimientos y los cuatro formateadores. El módulo común `secondary-novel-analysis.ts` conserva su guard y su alcance parcial de análisis; no se usa como una optativa completa.

Contratos nuevos backend/frontend y66consignas de fixture, más2breves. Antes de conectar el módulo, backend falló517/517 y frontend513casos, pasando solo8contextos negativos. Tras la conexión se corrigieron mediante regresiones:

- Reconocimiento alternativo que imponía las dos secuencias.
- Narrador omnisciente duplicado con otro criterio genérico.
- Comparación de estructura que arrastraba forma y otras partes.
- Plan que omitía la elección entre verso y prosa.
- Estudio del protagonista que imponía valores no pedidos.
- Seres fantásticos que arrastraban hechos adicionales.
- Inferencia de motivaciones que añadía un estudio general de personajes.

El catálogo124 se congeló una sola vez contra su payload instalado, por consulta de solo lectura. El candidato125 añade únicamente el módulo de5.º y su versión. Los scripts existentes de instalación de fuente, QA y HTTP admiten explícitamente este ámbito revisado; no habilitan otras optativas por nombre parecido.

## Verificación ejecutada

272 instrumentos completos de68consignas leídos:75textos únicos con cinco niveles,26paquetes de formato/puntuación y sus correspondencias exactas. Se comprobaron los cuatro formatos, niveles, unidades y pesos; se releyeron los cambios tras las regresiones. Huellas en [revisión de instrumentos](../../curriculum/cobertura-secundaria/optative-hlm-len-5-revision-instrumentos.json); ejemplos completos en [instrumentos](../../curriculum/cobertura-secundaria/optative-hlm-len-5-instrumentos.json). Queda como detalle editorial menor la repetición de artículos o de la palabra «función» en algunas filas compuestas; no cambia la evidencia solicitada.

Backend completo:62.662pruebas/163archivos,0fallos. Frontend de actividades:63.998pruebas/100archivos,0fallos; no es la suite completa de todo el frontend. Shared, backend, frontend y `pnpm cloudflare:build` terminaron0; Cloudflare fue dry-run, sin desplegar. Lints sin errores;16advertencias previas del frontend. Inventario/fuentes:14pruebas/0fallos, incluida la correspondencia de estados HLM4 y HLM5 con el inventario maestro. Precaché:71archivosJS, todos incluidos; máximo2.008.014bytes, inferior al límite2MiB.

Comparación de conservación: fuente125=compilado; congelado124=instalado. Los campos previos del catálogo y las288definiciones HLM4 conservan su contenido, al igual que las definiciones verificadas de Sociales, Artística, EFI y FHR1–6. Esto no sustituye la comprobación posterior de releases y snapshots tras las escrituras QA.

El Worker recompilado entrega `/assets/index-_ShUdYGi.js`, SHA256 `644b44a734cff0c3f31be14b4553706bbb8ab39a1ab2068db71ba3df74bedd62`. El guard confirmó PostgreSQL `app_backend_local` sin BYPASSRLS, Auth200, Storage200, variables públicas y assets del creador/shared/SW coincidentes con dist, exclusivamente Development. La recarga normal de la pestaña recibió ese entry y `registerSW.js`; no se borraron caché, service worker, almacenamiento ni borradores.

## Instalación y HTTP/DB en Development

Catálogo125 instalado CREATED/UNCHANGED;57releases y489snapshots anteriores idénticos. Fuente individual MINERD_SECUNDARIA_2023_OPT_HLM_LEN_5_V1, versión a728f522-32bc-5808-b5b7-dcf222abe077, scope importado e14d19a7-6496-5a01-9bf9-8107dc70fb47, CREATED/UNCHANGED:102elementos y23exclusiones, con literales, spans, relaciones, modalidad y salida comprobados. No se aplicaron migraciones de esquema. La validación individual de catálogos históricos tardó unos12minutos; la consulta de solo lectura no mostró bloqueoSQL. Ese tiempo administrativo no mide la preparación del creador.

Se reutilizó el curso ficticio QA de quinto sin modificarlo ni crear cuentas. Doce muestras autenticadas HTTP/DB cubren los cuatro formatos,20/17.35,puntos inicialmente pendientes, interpretación y recomendación, ámbito y fuente exactos, exclusiones400, paridad con alternativa local, texto manual, guardado/reapertura y cambio exclusivo de estrategia con instrumento exactamente conservado. Reconocimiento de prosopografía y exageración: cotejo automático con dos evidencias, sin explicación no solicitada, y rúbrica manual conservada. Las muestras incluyen escucha, narración, plan, revisión, voces, hipótesis, versoOprosa, reconocimiento alternativo y pistas. No representan todas las combinaciones posibles ni una clase real.

Medianas observadas: interpretación 6004ms, recomendación 6118ms y escrituras 3827ms. Se informa la muestra de este contexto; no se atribuyen diferencias frente a otros grados a una regresión sin una comparación controlada. [Evidencia HTTP/DB](../../curriculum/cobertura-secundaria/optative-hlm-len-5-verificacion-http.json).

Historia final58catálogos/501snapshots: los57/489previos conservan sus huellas, más12actividadesQA y sus12snapshots; cambiar solo estrategia no añadió otros snapshots. La lectura protegida de la muestra personal FHR1 conserva identificadores,17.35,catálogo118,texto manual y hash; no se regeneró baseline. No se crearon actividades personales de esta optativa para forzar la prueba.

## Limitaciones y continuación

El navegador personal muestra la cuenta recordada y, al continuar, solicita contraseña. No se introdujeron credenciales ni se enviaron enlaces. No se verificaron visualmente el creador, guardado o reapertura personales de esta optativa. QA no sustituye esta cuenta.

En la revisión posterior a instalar125 se detectó una variante de denominación pendiente: el patrón reconoce «novela policíaca» y «novelas policiales», pero no el singular «novela policial». La denominación oficial y las muestras de este bloque sí están conectadas. Conservar el payload125 instalado; incorporar y probar ese alias en el siguiente catálogo, sin reescribir releases históricos.

Prueba manual pendiente: iniciar sesión en `http://localhost:8787` con la cuenta propia de Development; abrir5.º de secundaria, modalidad Académica, salida HLM y esta asignatura; comprobar controles verticales y puntos vacíos. Probar «Identifica únicamente la prosopografía y la exageración en la epopeya proporcionada»: debe sugerir cotejo con dos evidencias y permitir rúbrica manual. Probar una narración policíaca ficticia: debe mostrar el instrumento completo. Asignar17.35, editar, guardar y reabrir; cambiar únicamente la estrategia y comprobar que instrumento, criterios, pesos y puntos permanecen exactamente iguales.

Faltan todavía otras16optativas académicas después de cerrar esta, además de los ámbitos especializados que el inventario mantiene pendientes. La lectura de las18fuentes no equivale a su implementación. Continuación autónoma según el archivo maestro; sin push hasta revisar las integraciones de despliegue.

Revisión propia separada, sin subagentes. Se conserva la rama actual; no se ejecutó push ni se cambiaron integraciones de despliegue. El hash del bloque se identifica en el commit español de cierre, sin inferir publicación remota.
