# Caso real: «Así es la Tierra por dentro»

Estado: caso exacto corregido y comprobado en el creador real, con guardado y reapertura. Trabajo del coordinador solo, sin agentes ni revisión independiente. Sin ampliación curricular, IA nueva, dependencias, rediseño, push, merge, despliegues, resets, producción ni credenciales.

Encargo literal: `../specs/2026-10-24-informe-tierra-literal.txt`. Plan: `../plans/2026-10-24-informe-tierra.md`. Banco y primeras salidas inmutables: `data/evaluation-instruments/earth-report/`.

## Entorno y reproducción

Base `1a473dfab98ce7d3d2592a901ac2a4548717a291`, rama `ampliacion-de-instrumentos-2`, árbol inicialmente limpio y 47 commits adelantados respecto de la referencia remota local. Una instancia en 8787, lanzador 12784/listener 38792 antes de recompilar. Proyecto efectivo Development `eolgunypmtgrsyrjzcld`, rol PostgreSQL `app_backend_local`, sin bypassRLS. Contexto real consultado: primero de secundaria, `NAT-TU`, Ciencias de la Naturaleza: Ciencias de la Tierra y del Universo. Catálogo `evaluation-2026.173`.

El servidor entregaba `index-BtlTzshk.js`. La pestaña del usuario conservaba el documento frontend anterior `index-9_tdxOuL.js`; su HTML, campos y vista previa se capturaron sin recargarla ni modificarla. Esto acredita una diferencia de documento cargado; no se atribuye sin pruebas a CacheStorage ni se borra almacenamiento. El defecto también se reprodujo por HTTP contra el servidor actualizado y mediante el código base actual, por lo que actualizar la pestaña no bastaba para corregirlo.

Se conservaron las salidas completas anteriores de los cuatro formatos (`before.json` y `http-before.json`). El borrador real mostraba siete filas: propósito/procedimiento de investigación, análisis de resultados, sustento de conclusiones, claridad, formato incompleto, estructura y entrega con exclusión mal asociada. La consigna no se adaptó al motor. Se fijaron cinco casos y sus expectativas antes de modificar código: exacto, sin formato, otros valores, informe de atmósfera y práctica de densidad.

## Causas y punto de pérdida

| Requisito | Etapa anterior y causa | Corrección / destino evaluable |
|---|---|---|
| Corteza, manto y núcleo; diferencias | El resolutor científico no reconocía los tres nombres sin «terrestre» o «estructura interna». Devolvía null y entraba en la alternativa genérica REPORT de `action-content-criteria.ts`, redactada como investigación. | El mismo tema existente se reconoce por los tres componentes; el propósito descriptivo/explicativo selecciona criterios de descripción y diferencias. |
| Procedimiento y resultados no solicitados | La plantilla genérica de REPORT equiparaba el informe con la investigación. «Informe» seguía siendo el tipo de actividad correcto, pero no su evaluación. | Se conserva REPORT; solo la finalidad descriptiva reconocida activa la adaptación. Investigación, hipótesis y práctica justificadas quedan fuera de ella. |
| Calibri 13 y título 18 | El extractor sí reconocía ambos valores, pero «cuerpo utilizará» y «título irá» no retenían el ámbito. Quedaban ambos en documento y eran marcados como conflicto; la reconciliación los excluía antes del formateo y HTTP. | Enlaces gramaticales de ámbito conservados dinámicamente. Un único criterio de formato, con ambos tamaños y ámbitos. |
| Justificación del cuerpo y centrado del título | Ambas alineaciones se extraían como globales, se marcaban contradictorias y se descartaban. | Cuerpo justificado y título centrado, sin conflicto. |
| Negrita del título | Se reconocía negrita, con ámbito documento; el instrumento ya recibía el dato sin alcance. | Negrita explícitamente en título. |
| Dibujo y nombres, en desarrollo | El extractor no representaba dibujo/esquema como recurso solicitado; tampoco había un proveedor pertinente para las capas nombradas. | Representación científica y rótulos; ubicación en desarrollo, sin evaluar destreza artística. Una sola vinculación, sin puntuarlo de nuevo como entrega. |
| Introducción, desarrollo de tres párrafos, conclusión | Se conservaban, pero como fila genérica separada del informe equivocado. | Integrados en estructura y claridad del informe descriptivo. |
| Word O PDF; dos a tres páginas | La alternativa ya se reconocía. La exclusión se añadía a toda condición de la misma oración, también al formato de archivo. | La exclusión pertenece únicamente a la extensión en páginas; no al archivo. No se crea una obligación de portada. |
| Ortografía | La alternativa genérica no construía el criterio solicitado de revisión ortográfica. No era una pérdida de renderizado. | Criterio explícito de ortografía del informe, con escritura, acentuación y mayúsculas. |

Texto/HTML: la normalización existente conserva las palabras y valores y colapsa espacios. La prueba frontend recorre `descriptionToEditorHtml` → `activityDescriptionText` → generación → campos editables. Las pérdidas principales ocurrían en extracción/reconciliación y selección del proveedor, antes de HTTP. No se añadió un segundo campo ni se cambió el renderizado para ocultarlas.

## Archivos y alcance de la solución

- `secondary-science-common.ts`: reconoce el tema existente por sus componentes y registra la finalidad descriptiva cuando la consigna la justifica; no activa esa finalidad ante investigación, procedimiento, resultados o práctica. El backend activa la adaptación solo para el catálogo actual; una petición explícita con catálogo histórico conserva la selección anterior. Los consumidores científicos optativos no se incorporan automáticamente a esta adaptación.
- `science-descriptive-report.ts`: adaptación compartida del producto descriptivo para temas científicos ya reconocidos. Solo selecciona contenido, comparación, recurso, estructura y ortografía pedidos. No enumera todos los subtemas de un tema ni cambia las mallas.
- `task-presentation-requirements.ts`: ámbitos con verbos habituales, dibujo y ubicación, exclusión acotada a páginas. Conserva fragmento e índices originales. No convierte la entrega de un esquema HTML en un recurso gráfico adicional.
- `task-requirement-criteria.ts`: vincula dibujo al criterio científico existente; mejora la distinción observable de tipografía/disposición y archivo/extensión. No crea una fila por propiedad.
- `recommendation-engine.ts`, `instrumentPreparation.ts` y tipos/exports compartidos: ambos caminos usan el mismo proveedor y registran `science-descriptive-report-v1` en la traza de las nuevas propuestas.
- Pruebas backend `earth-report.spec.ts`, frontend `earthReport.spec.ts`, banco y script `verify-earth-report.ts`: contrato, contenido visible, cuatro formatos, variantes, puntaje pendiente, cálculos exactos, edición y paridad.

No se editaron catálogos congelados, migraciones ni snapshots. El catálogo sigue siendo 173: `science-descriptive-report-v1` distingue la versión del generador para las propuestas nuevas, sin reinterpretar o regenerar instrumentos históricos. La etiqueta se asigna por el proveedor que produjo los criterios. Una prueba adicional de catálogo86 reprodujo la activación indebida al principio y, tras la guarda de compatibilidad, comprueba que no recibe criterios descriptivos ni esa etiqueta. La plantilla genérica de REPORT fuera de los temas y propósitos reconocidos permanece como límite; no se sustituyen globalmente todos los informes de investigación.

## Tabla requisito → criterio visible

| Requisito | Criterio / descripción visible |
|---|---|
| Corteza, manto y núcleo | Descripción científica del contenido: los nombra y pide características que permiten reconocerlos. |
| Diferencias | Diferencias entre los elementos descritos: compara características equivalentes, coherentes con la descripción científica. |
| Dibujo, disposición, nombres y desarrollo | Representación científica y rótulos: incluye el recurso y su ubicación; no evalúa habilidad artística. |
| Introducción, desarrollo de tres párrafos y conclusión | Estructura y claridad: los explicita en la misma fila; no se puntúan por separado. |
| Ortografía | Ortografía del informe: escritura correcta, acentuación y mayúsculas, conservando el sentido. |
| Cuerpo Calibri 13, interlineado1,5, justificado | Formato del documento: conserva cada valor y el ámbito cuerpo. |
| Título 18, centrado, negrita | La misma fila de formato; las tres condiciones llevan ámbito título. |
| Word O PDF | Entrega y extensión: una alternativa de archivo, no dos entregas. |
| Entre dos y tres páginas, excluyendo portada | La misma fila de entrega; exclusión asociada solo al conteo, sin requerir portada. |

Se mantienen siete dimensiones. El contenido científico —descripción, diferencias y representación— concentra 11 de 16 unidades de peso; estructura 2, ortografía 1 y presentación/entrega 1 cada una. Para 17.35, la propuesta distribuye434/434/325/217/109/108/108 centésimas, suma 1735. El puntaje inicial del editor continúa pendiente. El crédito parcial 50% de la ponderada es la regla ya existente del formateador; no es una tolerancia nueva sobre cantidad de páginas ni porcentaje inventado de cumplimiento de Word.

## Instrumentos y casos

Los cuatro instrumentos completos se entregan en `data/evaluation-instruments/earth-report/instrumentos-completos.md`, con indicadores, niveles y puntos. El coordinador leyó los cuatro formatos; no hubo revisión independiente. Cotejo expresa cumplimiento verificable; rúbrica y escala distinguen descripción, omisión, confusión y ausencia mediante evidencias; la escala usa grados de desempeño, no frecuencia. La ponderada conserva los componentes y su regla de crédito parcial vigente.

Los cinco casos dan paridad de contenido y condiciones entre servidor y alternativa local en ocho pares. Sin formato se conservan las cinco dimensiones de contenido/estructura/ortografía y no aparecen archivo, fuente ni tamaños. La variante conserva Aptos 11,5, título 21/cursiva, interlineado 2/izquierda, cuatro párrafos y PDF de tres a cinco páginas excluyendo portada. Atmósfera activa el mismo producto con otro tema existente. Densidad conserva LAB_PRACTICE, procedimiento, observaciones, mediciones, cálculo y resultados.

## Verificaciones y conservación

Prueba roja inicial: ocho fallos pertinentes y un control experimental aprobado. Tras corregir, 39 pruebas específicas de Tierra y requisitos, 102 focalizadas backend y 110 focalizadas frontend/editor aprobadas. El primer backend completo detectó dos regresiones por interpretar «esquema HTML» como recurso gráfico: se corrigió la causa sin cambiar las consignas y pasaron 55 focalizadas posteriores. Segundo backend completo: 98 371 pruebas/250 archivos aprobados. Frontend completo: 95 224 pruebas/227 archivos aprobados. Las dos suites completas se ejecutaron secuencialmente, sin duplicarlas en paralelo.

La guarda posterior de compatibilidad añadió un control de catálogo histórico. Se observaron su fallo previo y después 60 pruebas backend y 52 frontend focalizadas aprobadas. Backend completo final: **98 372 pruebas/250 archivos**, cero fallos. Se repitieron los builds obligatorios y lints sobre esa guarda. El frontend completo anterior a la guarda y las focalizadas posteriores se distinguen en `verification-final.json`; no se declara repetida una suite que no se volvió a ejecutar. La salida íntegra actual de los cinco casos se comparó con `after.json`: idéntica en los ocho pares, además de conservar la paridad servidor/local.

Controles obligatorios sobre el código final: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`, todos con salida 0. También lints backend/frontend y lint final de los seis archivos compartidos modificados, aprobados. Cloudflare fue `--dry-run`, sin despliegue. Se conservan los logs fallidos y aprobados; `verification.json` y `verification-final.json` contienen resultados y tiempos antes/después de la guarda. No se volvió a ejecutar el lint compartido completo: sus ocho errores heredados en archivos ajenos ya estaban documentados y este cambio no los aborda.

### HTTP

Cuenta QA existente, diferenciada de la sesión personal del navegador. Interpretar y recomendar devolvieron 200 para el caso exacto; cuatro tipos explícitos respetados, siete criterios en cada uno, contenido completo igual al camino local y generador `science-descriptive-report-v1`. Se guardaron las respuestas completas en `http-after.json` y se repitieron sobre el build final en `http-final.json`; antes, `http-before.json`. El QA solo generó propuestas: no creó actividades, cuentas ni snapshots.

### Navegador personal

Pestaña nueva con sesión personal existente de Development, mismo contexto NAT-TU1/Bloque3 y entry actual. Formulario inicialmente vacío. La descripción exacta se verificó tras introducirla; solo el título de la muestra lleva el prefijo ficticio de identificación. El borrador original del usuario no se reutilizó ni se regeneró.

Se comprobó rúbrica automática y selección manual de cotejo, escala y ponderada, cada uno completo con las siete dimensiones y todos los valores/ámbitos. Puntaje de actividad y puntos iniciales de los siete criterios vacíos. Después se asignó 17.35. Se editó el título de la primera fila y los pesos a 30/20/18.75/12.5/6.25/6.25/6.25. La distribución guardada fue521/347/325/217/109/108/108 centésimas, suma 1735.

Se eligió manualmente «Expositivas de conocimientos elaborados o acumulados»: cambiar solo la estrategia conservó exactamente los 22 campos del instrumento. La regeneración pidió confirmación; «Conservar cambios» mantuvo los valores. Se confirmó el guardado una sola vez, con resultado «Actividad creada». Reapertura contextual de ese mismo registro: 22 campos y tabla exactos, título/pesos manuales y estrategia `EXPOSITORY/MANUAL` conservados. Consulta de solo lectura contrastó cada texto y peso visible con los campos persistidos y el snapshot. La reapertura respondió por HTTP en 8.631 s; no se cambió timeout ni infraestructura.

Muestra nueva: `FICTICIA PERSONAL TIERRA 2026-10-24 · Así es la Tierra por dentro.` No recrearla ni volver a guardarla para verificar. Se abrió su vista previa en modo lectura; evidencia de contenido científico y de formato/entrega en las capturas privadas `earth-personal-reopened-science.png` y `earth-personal-reopened.png`. Los cuatro formatos y el guardado se comprobaron con `index-CiH4--sG.js`; tras la guarda de compatibilidad se recargó únicamente la muestra guardada con `index-g4K3pwks.js`: los 22 campos volvieron a ser exactamente iguales, sin otro guardado. La captura final de formato corresponde a ese último build. `browser.json` resume ambas versiones sin IDs personales. No se enviaron correos ni se modificaron credenciales.

Antes de las escrituras: 104 releases y 1284 snapshots; se comprobó la preservación respecto del cierre anterior. Final: 104 releases con huellas idénticas y 1285 snapshots; todos los 1284 anteriores exactos, más el único de la muestra nueva. Las 83 actividades de control conservan campos, instrumentos, snapshots, puntajes, estrategia y fecha de modificación; no hubo escrituras en actividades anteriores. También se compararon HTML, 54 campos y vista previa del borrador original en su pestaña: idénticos. `preservation.json` y la lectura posterior a los controles finales en `preservation-final.json` contienen evidencia saneada. Capturas, IDs, credenciales QA y diarios completos quedan privados en `.wrangler/realistic-audit/`, fuera de Git.

Instancia final: lanzador 60356, listener 76140, uno solo en 8787. `runtime-final.json` acredita PostgreSQL/Auth/Storage/frontend Development, catálogo 173 y bytes servidos iguales al build: entry `index-g4K3pwks.js`, editor `ActivityEditorWorkspace-Che7qGpY.js`, piloto `instrumentos-composicion-piloto-CGCmUmgr.js` y service worker. La pestaña nueva cargó ese entry. `runtime.json` conserva la verificación previa a la guarda. No se borró almacenamiento ni se alteró la configuración de producción.

## Límites

La gramática es acotada; no se declara resuelta la interpretación general de informes ni la cobertura de asignaturas. No se armonizan todas las rutas genéricas. No se inspecciona Word/PDF ni se garantiza que una fuente esté instalada. La estabilidad DNS del pooler y las cabeceras de caché contradictorias anteriores no se modifican; una conexión puede bloquear temporalmente el recorrido y debe informarse como tal. El acceso mediante contraseña no forma parte de esta corrección.

Revisión del diff y seguridad: 31 archivos comprobados, UTF-8 válido y cero coincidencias con los nueve valores privados verificados. Secretos, credenciales QA, respaldos, capturas y diarios privados excluidos de Git. Sin cambios en dependencias, migraciones o configuración de producción. `git diff --check` sin errores.

Cambios revisados y cierre mediante commit local en español en `ampliacion-de-instrumentos-2`; hash y estado final se entregan tras confirmar Git. Sin push, merge ni despliegue. No se retoma ampliación curricular.
