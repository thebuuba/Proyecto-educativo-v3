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

No se ha instalado155 en Development en este corte. La última historia remota comprobada sigue siendo87releases/1213snapshots, con quince referencias personales exactas. El Worker154 fue detenido verificando su árbol de procesos antes de editar; no se sirve una combinación de código155 con catálogo154. No hubo escrituras remotas en este bloque.

## Verificación

- Regresiones de noticia:67aprobadas. Se observaron fallos previos en cada grupo corregido, incluidos12fallos de los reservados.
- Backend completo:97.331pruebas en219archivos aprobadas. Primera pasada:97.330aprobadas y un contrato de título antiguo del noticiero falló; se actualizó al nombre que describe su aportación observable y se repitió la suite completa.
- Frontend focal:55pruebas en3archivos aprobadas, incluyendo preparación y estrategia. No equivale a una pasada frontend completa.
- Capturas locales:36salidas con paridad servicio/alternativa, selección de los cuatro formatos, puntuación inicialmente vacía y totales20/17.35exactos. Lectura pedagógica separada del resultado técnico.
- Builds backend/frontend/Cloudflare aprobados (11,77s/26,59s/73,53s); Cloudflare exclusivamente dry-run con variables Development validadas. Lints backend y compartido aprobados. Ningún despliegue.

## Pendientes reales

La noticia aún requiere actividades propias para anticipación/comprobación, inferencias, vocabulario contextual, documentación de fuentes y coordinadas/subordinadas de la continuación74; revisión de actitudes mediante evidencias observables, sin calificar estados internos. También falta muestra HTTP/DB/visual de155 y estrategia por caso. La sesión personal permanecía en login; no se enviaron correos ni se alteraron credenciales. Rendimiento sigue abierto: el perfil154 recuperó59versiones/374.496bytes en5235ms; no prueba la causa única de las incidencias anteriores.

Después se recorren guía turística, informe, afiche, cuento policíaco y caligrama, se compara toda Lengua1 con la fuente y se continúa por las asignaturas oficiales y grados restantes. Los89ámbitos detectados en la extracción incluyen54comunes y optativas; aún requieren delimitación curricular completa, contraste con proveedores y separación de ámbitos fuera del alcance. No son89ámbitos auditados.

Rama `ampliacion-de-instrumentos-2`, commits locales. Sin push, main, despliegue, producción, cambio de entorno, borrados, migraciones remotas, IA ni subagentes.
