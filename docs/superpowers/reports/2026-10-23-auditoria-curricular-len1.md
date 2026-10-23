# Auditoría curricular de Lengua Española de primero

La asignatura y el encargo general siguen abiertos. Este corte acredita la revisión local de nueve actividades de noticia y sus36instrumentos, no la cobertura completa del grado.

Fuente: [MINERD, Adecuación Curricular Secundaria2023](https://ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/Ht7X-adecuacion-secundaria-2023pdf.pdf), SHA256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`. Leídas visualmente las páginas PDF68–75: malla69–75 y contexto68. La noticia continúa al inicio70 y reaparece al final74; el último bloque incorpora oraciones coordinadas y subordinadas y no corresponde al caligrama.

La matriz `data/evaluation-instruments/curricular-audit/len1-matrix-v1.json` conserva los seis encabezados y55renglones conceptuales literales, sus páginas, cajas e identificadores. Un renglón repite Estructura de la guía; otros contienen varios componentes. No se equiparan esos55renglones con55subtemas independientes. Los31procedimientos,34actitudes y21indicadores permanecen disponibles para un mapa por componentes; su presencia en el archivo no acredita revisión.

## Casos y lectura

Los seis originales de `len1-noticia-v1.json` y su huella se fijaron antes de generar. Los tres reservados de `len1-noticia-reservado-v1.json` se fijaron antes de sus llamadas: escucha, planificación/publicación y corrección exclusiva de puntuación. Son sintéticos, redactados y revisados por el mismo autor; no constituyen evaluación externa independiente. Se superan los4–6casos habituales para cubrir modalidades y procedimientos diferentes y verificar generalización.

Se leyeron criterios y todos los descriptores de las cuatro salidas de cada actividad: rúbrica, cotejo, escala y ponderada. El manifiesto `auditoria-curricular-len1-noticia-155-lectura.json` registra la decisión y sus límites por cada salida. Los JSON completos anteriores, intermedios y finales permanecen en `docs/curriculum/cobertura-secundaria/`; no se sustituyó la evidencia154 anterior por resultados nuevos. El archivo155-despues es una captura intermedia, no la aceptación final.

| Caso | Discrepancia reproducida | Corrección comprobada localmente |
|---|---|---|
| NOT01, breve | Revisión demostrada no pedida; registro y conectores impuestos | Convenciones del producto final, lenguaje comprensible y secuencia; sin proceso obligatorio |
| NOT02, ficha y borrador | Secuencia duplicada; ficha y destinatario insuficientes | Fidelidad a ficha, destinatario escolar, secuencia única, verbos y revisión |
| NOT03, lectura | La negación de redactar provocaba creación; fotografía/pie omitidos | Análisis, propósito/relevancia agrupados, estructura/datos y función de paratextos |
| NOT04, noticiero | Orden de turnos sin temporalidad interna; aporte exigía explicación adicional | Fichas, turnos/hechos, comunicación comprensible y aportación individual |
| NOT05, comparación | Correspondencia paratexto/hechos débil; partes no solicitadas | Contraste sustentado de ambas noticias y correspondencia explícita; sin comparar entrada/cuerpo obligatoriamente |
| NOT06, corrección | «Sin cambiar… y revisen…» eliminaba requisitos; se imponía creación | Revisión focal, tres formas abreviadas y explicación, sinónimos, puntuación y verbos |
| R01, escucha | Audio se interpretaba como noticia escrita | Reconstrucción propia, datos del audio e interés para el público |
| R02, mural | Destinatario y publicación implícita omitidos | Plan con destinatario y publicación verificable en el mural; imágenes opcionales |
| R03, puntuación | «No revisen abreviaturas» se volvía obligación | Solo puntuación, conservando datos/palabras y comparación con original |

Las agrupaciones del cotejo permiten valorar el cumplimiento conjunto; un Sí/No no identifica cuál dato o cuál forma abreviada incumple. La ponderada conserva un cumplimiento parcial observable del grupo. No se impone una fila por cada detalle ni un número fijo de criterios: el casoR03 tiene una dimensión pertinente.

## Cambios y conservación

Las causas se corrigieron en interpretación de acciones/negaciones (`index.ts`, `language-feature-criteria.ts`) y composición/requisitos de noticia (`secondary-language-grade-one-complete.ts`, `secondary-news-grade-one.ts`). No se añadieron reglas por títulos exactos ni campos de interfaz.

Catálogo155 preparado en código. Se conservó154 antes de editar y se registró `catalog-v154.ts`; la huella es `ded489bce0367360783d51cf1282f2b58d1c08b472a8b1ce2175e198b9c688a2`. Las pruebas detectaron que modificar las definiciones exportadas alteraba cuatro catálogos históricos; las adaptaciones nuevas se aislaron en la composición y las huellas históricas volvieron a aprobar sin cambiar sus referencias.

Después del commit local `a1e80c09d8bd2f572868003489b3a2ab81fbcc80`, se instaló155 individualmente en Development: CREATED/UNCHANGED. Se conservaron exactamente87releases y1213snapshots. Las cuatro actividades QA añadieron cuatro snapshots: estado final88releases/1217snapshots. Quince referencias personales se contrastaron nuevamente después, todas exactas y sin duplicados; no se recapturaron baselines.

El Worker155 recompilado quedó sirviendo8787 con PostgreSQL app_backend_local sin bypassRLS, Auth, Storage y frontend exclusivamente eolgunypmtgrsyrjzcld. Assets y sw.js coincidieron byte a byte con el build; el DOM personal cargó `/assets/index-CQwlFSLK.js`. La pestaña sigue en login, por lo que no se atribuye verificación visual del creador personal. No se borró caché/almacenamiento ni se inspeccionó la inscripción del service worker desde el navegador.

## Verificación

- Regresiones de noticia:67aprobadas. Se observaron fallos previos en cada grupo corregido, incluidos12fallos de los reservados.
- Backend completo:97.331pruebas en219archivos aprobadas. Primera pasada:97.330aprobadas y un contrato de título antiguo del noticiero falló; se actualizó al nombre que describe su aportación observable y se repitió la suite completa.
- Frontend focal:55pruebas en3archivos aprobadas, incluyendo preparación y estrategia. No equivale a una pasada frontend completa.
- Capturas locales:36salidas con paridad servicio/alternativa, selección de los cuatro formatos, puntuación inicialmente vacía y totales20/17.35exactos. Lectura pedagógica separada del resultado técnico.
- Builds backend/frontend/Cloudflare aprobados (11,77s/26,59s/73,53s); Cloudflare exclusivamente dry-run con variables Development validadas. Lints backend y compartido aprobados. Ningún despliegue.
- Muestras HTTP/DB155: NOT03/rúbrica20, NOT06/cotejo17.35, R01/escala20 y R02/ponderada17.35. Interpretación/recomendación, paridad local, puntos pendientes, edición manual, guardado/reapertura y cambio solo de estrategia con instrumento/snapshot exactos aprobados. Máximo HTTP observado13272ms; no se declara resuelto el rendimiento.
- Estrategia de los nueve casos: ambigüedad correcta, sin selección automática injustificada. Noticiero o trabajo grupal por sí solos no acreditan una metodología. Las selecciones manuales persistieron en las cuatro muestras HTTP; no equivalen a verificar su control visual personal.

## Pendientes reales

La noticia aún requiere actividades propias para anticipación/comprobación, inferencias, vocabulario contextual, documentación de fuentes y coordinadas/subordinadas de la continuación74; revisión de actitudes mediante evidencias observables, sin calificar estados internos. El banco `len1-noticia-procedimientos-v1.json` y su huella quedaron fijados antes de generar. Falta comprobación visual personal. La sesión permanecía en login; no se enviaron correos ni se alteraron credenciales. Rendimiento sigue abierto: el perfil154 recuperó59versiones/374.496bytes en5235ms; no prueba la causa única de las incidencias anteriores.

Después se recorren guía turística, informe, afiche, cuento policíaco y caligrama, se compara toda Lengua1 con la fuente y se continúa por las asignaturas oficiales y grados restantes. La extracción contiene89ámbitos:72con grado y17encabezados sin grado. La matriz maestra vigente separa54comunes,18optativas y10contextos de9módulos técnicos (MF002 participa en IFC006 e IFC007):82contextos, sin ampliar programas. Cero temas cerrados. Los totales de temas restantes aún requieren lectura completa de sus fuentes, no conteo de proveedores.

Rama `ampliacion-de-instrumentos-2`, commits locales. Sin push, main, despliegue, producción, cambio de entorno, borrados, migraciones remotas, IA ni subagentes.

## Continuación156: procedimientos y comprobación de límites

Los dos casosP01/P02, fijados antes de generar, detectaron pérdidas de anticipación, propósito e inferencias; fuentes, destinatario y coordinación/subordinación; y «borrador» singular no reconocido. Se completaron esos requisitos y su progresión. El ejemplo de cada clase de oración se evalúa dentro de la dimensión sintáctica, sin convertirlo en un ejemplo total ni duplicar la cantidad como criterio de formato. Otras condiciones de entrega siguen presentes.

El caso reservadoA01 de escucha reprodujo otra negación mal interpretada: «No inventen… ni escriban…». Se corrigió y se conservaron propósito, inferencias y vocabulario cuando se solicitan; la escucha breveR01 mantiene su alcance. La interrogante cómo aparece tanto en la evidencia como en el descriptor superior cuando la consigna la pide. No se asignó una actividad escrita a la escucha.

Las48salidas de esos doce casos se leyeron y volvieron a contrastar exactamente con el código actual, conservando las anteriores. El manifiesto `auditoria-curricular-len1-noticia-156-validacion48.json` acredita esa revisión local, no un cierre del tema. La matriz relaciona los7párrafos procedimentales con sus componentes y trata las5actitudes sin calificar curiosidad o emociones internas. Los21indicadores generales de la asignatura siguen abiertos al resto de géneros.

La comprobación adicionalA02 separa estructura oral y lectura: se fijó su expectativa y se leyeron sus cuatro instrumentos156. Se confirma un defecto aún abierto: el filtro de escucha omite titular/entrada/cuerpo y su función, y agrega una reconstrucción de interrogantes no solicitada. Sus salidas anteriores permanecen en `auditoria-curricular-len1-noticia-estructura-oral-156-antes.json`. Este hallazgo impide cerrar noticia; será el siguiente ajuste. No se ejecutará guía hasta resolverlo. Su banco de seis consignas y huella ya quedó preparado desde la fuente, sin generar instrumentos.

El backend completo aprobó97.349pruebas/220archivos y builds backend/frontend/Cloudflare dry-run y lints afectados. La pasada frontend completa dio95.195aprobadas y un fallo al esperar «Criterio1» en GradingBook; ese caso y después sus56pruebas de archivo aprobaron aislados. La preparación tiene900ms de espera y la prueba daba1000ms: se acotó esa espera de prueba a8000ms, como las vecinas, manteniendo sus aserciones. No se cambió la aplicación. La pasada completa corregida aprobó95.196pruebas/223archivos; frontend build, Cloudflare dry-run y lint del test aprobaron nuevamente (18,62s/27,83s/2,91s).

155 es la última versión instalada, con88releases/1217snapshots. El Worker fue detenido antes de156. No se instaló156 ni se ejecutó su muestra remota. Se conserva156 localmente y se contrastará en Development la versión que resuelvaA02, evitando instalar un candidato intermedio con el fallo conocido. No se sustituye ninguna referencia histórica ni se repiten creaciones QA anteriores.

## Ajuste157: estructura comprendida al escuchar

El bloque156 se guardó localmente en `83b0d874e57e55365208e6fcfcce709168c1be1b`. Su payload y API quedaron conservados como candidato local no instalado; huella `215b174d865beb44c80df9d40bfe99e58c81b694474c7b7bc5894e7d044354cc`.

Se reprodujoA02 con cuatro regresiones fallidas y se corrigió el filtro de escucha para conservar partes/función y sustento en audio cuando se solicitan. La reconstrucción adicional solo aparece si se pide o hace falta como desempeño general sin otro foco. Los cuatro instrumentos posteriores se leyeron: tres dimensiones distintas (estructura/función, sustento en audio y paratextos), sin las interrogantes añadidas. Sus progresiones distinguen reconocer y relacionar, nombrar sin localizar y ausencia de evidencia; la ponderada conserva cumplimiento parcial pertinente.

`auditoria-curricular-len1-noticia-157-validacion52.json` compara el código157 con52instrumentos: los48anteriores permanecen semánticamente exactos y los cuatroA02 tienen paridad servicio/alternativa. Las huellas de bancos originales se comprobaron sin alterarlos. Aprobaron417pruebas focales, backend completo97.354/221archivos, frontend focal123/5archivos y builds backend/frontend/Cloudflare dry-run y lints157. La pasada frontend completa95196 corresponde al bloque156; no se presenta como una pasada completa157. No hay instalación157 todavía ni cierre del tema por esos conteos.

## Verificación efectiva157 y comienzo de guía

El estado anterior queda superado por esta comprobación: código157 en commit local `c9a5e6e1df3e62420b707d9b67ae42d59ab0d2a5`, instalado individualmente solo en Development, CREATED/UNCHANGED. Se conservaron exactamente88releases y1217snapshots;156 nunca se instaló. El Worker157 sirve el entry `/assets/index-D8XIrYSQ.js`; todos los assets comprobados y sw.js coinciden byte a byte con el build. PostgreSQL usa app_backend_local sin bypassRLS; Auth, Storage y las variables públicas del frontend corresponden exclusivamente a eolgunypmtgrsyrjzcld. No hubo migraciones de esquema, cuentas nuevas, acceso a producción, push ni despliegue.

Las cuatro muestras nuevas son P01/rúbrica20, P02/ponderada17.35, A01/escala20 y A02/cotejo17.35. Todas verificaron interpretación, recomendación, paridad con alternativa local, puntos pendientes, edición manual, guardado/reapertura y cambio exclusivo de estrategia manteniendo exactamente instrumento y snapshot. Estado posterior:89releases/1221snapshots. Las quince referencias personales se contrastaron en solo lectura con sus baselines originales después de las muestras: exactas, sin duplicados ni recapturas. Evidencias públicas: `auditoria-curricular-http-157.json` y `auditoria-curricular-personales-157-conector.json`.

La pestaña personal se recargó con el build actual. Elegir su perfil recordado mostró el campo de contraseña vacío: no había sesión activa aprovechable. No se introdujeron credenciales, solicitaron correos, cambiaron contraseñas ni borró almacenamiento. Quedan pendientes la comprobación visual del creador con su contexto y la inscripción/caché del service worker en navegador; el contraste HTTP de sw.js no las sustituye. La noticia queda revisada localmente en13actividades/52instrumentos y contrastada por esas muestras HTTP; el cierre visual es condicional y los indicadores de toda Lengua1 siguen abiertos.

Se continuó con el banco de guía fijado previamente desde las páginas70–71: seis actividades/24instrumentos. La lectura completa reprodujo clasificación genérica de una consigna breve, negación confundida con creación, escucha reducida a un criterio gramatical, clasificación funcional y publicación omitidas, gramática oral convertida en análisis y corrección lingüística sin grados de adjetivos ni modificadores directo/indirecto. La evidencia anterior y la lectura por caso quedan en `auditoria-curricular-len1-guia-157-antes.json` y `auditoria-curricular-len1-guia-157-lectura-inicial.json`. Ninguna de esas24salidas se declara aceptada. Se corregirán las causas y se conservará157 antes de versionar nuevas reglas.

## Bloque158: guía turística, revisión local y límites restantes

El checkpoint HTTP157 y las salidas iniciales de guía se guardaron en `7dc7f48842900df6a2ce174677119d504c8e8237`. Después se conservó el payload157 instalado, huella `2a410278906074e05799027fe33395c740a7007debd746bf594e728ce7d96798`, y su API local previa. Se detuvo el árbol del Worker comprobando launcher15172/listener46504; una comprobación posterior confirmó que8787 ya no escuchaba.158 es candidato local: no se instaló en Development ni se ejecutaron creaciones QA nuevas de guía. La última base verificada sigue con157,89releases/1221snapshots.

Se revisaron14actividades de guía y56instrumentos: seis iniciales, seis reservadas y dos orales adicionales desde la fuente. Cada banco tiene expectativas y huella anteriores a sus salidas. Los reservados no son ciegos: el mismo autor conocía las reglas y los casos iniciales. Los casos extra son necesarios para distinguir corrección acotada, publicación digital, planificación de una futura presentación, organización comprendida en audio y grados sustentados en datos; no son pequeñas variaciones contadas como familias nuevas.

Las causas corregidas son reconocimiento de «hagan», «corrijan» y «clasifíquenlos»; negaciones con objeto («no la pondremos») y «no se necesitan»; filtros que eliminaban partes y propósito al añadir gramática/procedimientos; distinción de uso oral frente a identificación lingüística; selección de grados, datos, público y medio; y agrupación de dimensiones repetidas. Los cambios están en `index.ts`, `language-feature-criteria.ts`, `secondary-language-grade-one-complete.ts` y el refinamiento compartido `secondary-guide-grade-one-requirements.ts`. Los exports de definiciones históricas no se editaron. No hay cambio de interfaz, esquema ni dependencias.

La lectura posterior detectó defectos que el primer grupo de aserciones no veía: un descriptor superior aún duplicaba el recurso visual, la reconstrucción global se puntuaba dos veces y la revisión de un sintagma nominal provocaba revisión general de información. Se observaron16regresiones fallidas y se ajustaron esas rutas. Los ocho instrumentos orales adicionales reprodujeron pérdida de la organización comprendida al escuchar y ampliación indebida de grados; se corrigieron. El backend completo detectó después cuatro fallos del contrato antiguo de solo comparativo: el refinamiento había añadido otros grados. Se mantuvo el contrato original, se limitó a los grados pedidos y se repitió toda la suite.

La lectura vigente está en `auditoria-curricular-len1-guia-158-lectura56.json`. El manifiesto `auditoria-curricular-len1-158-comprobacion-final108.json` contrasta52salidas de noticia exactas y56de guía con paridad, puntos inicialmente vacíos,20/17.35exactos, edición manual conservada y validación. Sus ocho salidas actualizadasR04/A02 también se leyeron; el campo de captura «reviewPendingForChanges» expresa el estado al generarse y queda resuelto por el manifiesto de lectura separado. Los archivos con «final» de capturas previas son cortes intermedios conservados, no el cierre del tema.

Resultados del código final158:

- Backend completo:97.423pruebas/224archivos aprobados, después de97.419aprobadas y4fallidas en la primera pasada. No se alteró la referencia de comparativo para conseguirlo.
- Pruebas focales frontend:76/4archivos y GradingBook56/1archivo aprobadas. El primer comando omitió la ruta real de GradingBook y se ejecutó su archivo correcto por separado. Tras el último ajuste se repitieron17pruebas de guía. No se presenta una suite frontend completa158.
- Builds finales backend10,85s, frontend29,58s y Cloudflare38,41s: aprobados. Cloudflare fue exclusivamente dry-run, con entorno Development validado. Lints afectados4,27s/3,19s aprobados.
- Los12renglones conceptuales de guía y los8párrafos procedimentales70–71 tienen vínculos por componente en la matriz. «Estructura» repetido no se cuenta como otro subtema. El procedimiento de creación escrita conserva un pendiente específico: uso de comas/dos puntos/comillas, además de su corrección ya leída. Representación respetuosa de identidad y aspectos geográficos/culturales/gastronómicos requiere el caso propioV01; su banco está fijado y sin generar. Interés o entusiasmo no se infieren ni califican desde un producto.

Antes de aceptar guía se contrastarán también variantes de recursos y fases para evitar que la planificación imponga alternativas no pedidas. Se continuará con esos pendientes y la muestra HTTP/DB de la versión revisada; no se instalará un candidato intermedio por tener pruebas verdes. La verificación visual personal permanece bloqueada por contraseña. Informe, afiche, cuento y caligrama y el resto de ámbitos siguen pendientes de esta auditoría ampliada. Sin push, producción, despliegue, main, correos, borrados ni subagentes.

## Bloque159: cierre local de los pendientes de guía

Se conservaron158 y su API como candidato local no instalado, huella d930f78dcf94c17d98c8963a40ce6d027d67d11d20f4d6a204efd038b501c2f3. Los bancos V01 y E01/E02/E03 estaban fijados antes de generar sus16instrumentos158. La lectura reprodujo pérdida de respeto cultural/aspectos, preguntas ordinarias no reconocidas, ficha singular y «del museo» no contextualizados, negación «no preparen» ignorada, recursos adicionales en planificación y predicción desde dibujo omitida. Se observaron24regresiones fallidas antes del ajuste. Cuatro aserciones posteriores se corrigieron por flexión «enumeraciones», sin cambiar la expectativa ni los bancos. Otra lectura detectó revisión general añadida al pedir revisar solo signos; cuatro regresiones fallidas acreditaron su corrección.

159 limita la predicción a los indicios realmente disponibles, los apoyos del plan a los solicitados y la revisión de signos a su dimensión. V01 evalúa información sustentada de aspectos geográficos/culturales/gastronómicos y representación respetuosa de prácticas/significados. No puntúa sentimientos ni habilidad artística. E01 comprueba puntuación en creación; E02 un único mapa previsto; E03 anticipación desde dibujo y contraste con audio. No hay cambios de UI, esquema, dependencias, cuentas ni producción.

La lectura vigente es auditoria-curricular-len1-guia-159-lectura72.json:18actividades/72instrumentos. Se leyeron las16salidas nuevas y8dimensiones de anticipación modificadas; las48salidas anteriores restantes mantienen exactamente su contenido revisado. auditoria-curricular-len1-159-validacion124.json acredita52noticias exactas y72guías con paridad servicio/alternativa, puntuación pendiente,20/17.35exactos y selección manual. Su marca de lectura pendiente al capturar se resuelve por el manifiesto separado. La matriz relaciona los12renglones conceptuales,8párrafos procedimentales y5tratamientos actitudinales, incluyendo la continuación de identidad. No se declara cerrado el tema por estos conteos.

Verificaciones finales159: backend completo97.448/225archivos, focal425/9, frontend focal132/5, builds backend9,06s/frontend26,11s/Cloudflare75,99s dry-run y lints5,04s/2,39s, todos aprobados. No hay pasada frontend completa159. Queda la instalación individual y muestra HTTP/DB de159 en Development, seguida de informe71–72.158 no se instalará como candidato intermedio. La prueba visual personal sigue bloqueada por contraseña; no se han cambiado credenciales ni enviado correos. Sin push ni despliegue.

## Verificación efectiva159 y siguiente tema

Código159 guardado en a113d0597d04c40874f0911070daeedfe242035a. Instalación individual solo Development: CREATED/UNCHANGED, conservando89releases/1221snapshots.158 nunca se instaló. Runtime159 sirve /assets/index-DlUMG7-X.js y assets/sw.js byteexactos al build; PostgreSQL app_backend_local sin bypassRLS, Auth, Storage y variables públicas apuntan exclusivamente a eolgunypmtgrsyrjzcld. No hubo migración de esquema, cuentas copiadas ni producción.

Muestras HTTP autenticadas con QA: E01/rúbrica20, V01/ponderada17.35, R04/escala20, A02/cotejo17.35. Verificaron interpretación, paridad servicio/alternativa, puntos pendientes, edición manual, guardado/reapertura y cambio exclusivo de estrategia con instrumento y snapshot exactos. Las cuatro están registradas e idempotentes; no repetirlas. Estado final90releases/1225snapshots. Después de ellas se contrastaron las15referencias personales por conector en solo lectura, todas exactas y sin duplicados, usando sus baselines originales. Evidencias: auditoria-curricular-http-159.json y auditoria-curricular-personales-159-conector.json. Esto no sustituye el recorrido visual personal ni la inspección del registro/caché de SW en navegador.

Se releyeron visualmente71–72 y su continuación de informe. Su banco len1-informe-v1 quedó fijado antes de generar:8actividades, con consigna breve, escritura completa, escucha, lectura, presentación oral, revisión de resumen, corrección lingüística y comparación. Ninguna se acredita hasta leer los32instrumentos. Se mantiene abierta toda la auditoría curricular. Sin push, despliegue, main, producción ni subagentes.
