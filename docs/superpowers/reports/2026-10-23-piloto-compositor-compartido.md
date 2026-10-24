# Piloto acotado del compositor compartido

Intervención cerrada desde `bc4a4153` en `ampliacion-de-instrumentos-2`. Trabajo del coordinador solo, sin revisión independiente. Piloto implementado y evaluado con dictamen parcial; no acredita asignaturas ni grados completos. La ampliación curricular permanece detenida.

## Alcance y arquitectura

Solo tres familias de primero de secundaria común: noticia escrita de Lengua Española; explicación oral de los planetas del sistema solar en Ciencias de la Naturaleza; estadística descriptiva solicitada o comparación de racionales con recta numérica O explicación escrita en Matemática. El título no activa la nueva ruta. Las demás asignaturas, grados, tareas y procedimientos especializados conservan el despacho anterior. En noticia se excluyen los contratos transversales, análisis, revisión de borrador, planificación, publicación y recursos lingüísticos especializados reconocidos por sus proveedores. No se reconstruyó el catálogo curricular.

Antes, backend y alternativa local despachaban por separado a proveedores y añadían entrega/formato, sin reconciliar todas las obligaciones. Ahora ambos llaman a `composePilotInstrument`, una función pura con versión de contenido `composition-pilot-v1`. El contrato normaliza nivel, grado y código de asignatura; identifica producto, acción principal, acciones adicionales, contenido, requisitos de contenido/ejecución/presentación, alternativas, exclusiones y dimensiones inherentes. Cada requisito guarda índices y texto literal de origen. Los candidatos tienen enlaces semánticos explícitos; se descartan los no justificados, excluidos o duplicados antes del formato. `covered`, `uncovered`, exclusiones y descartes quedan en la traza interna. No se calcula cobertura por coincidencia de palabras.

Se reutilizan los criterios de noticia existentes, la cobertura científica de planetas, el extractor de duración existente (ahora devuelve también el fragmento de origen), las condiciones de presentación y los formateadores/cálculos compartidos. Los criterios matemáticos y las dimensiones separadas de oralidad, duración y apoyo se añaden únicamente a esta ruta. No hay cuota fija de filas: los casos producen entre dos y siete dimensiones. No hay selector nuevo, banner, dependencia ni llamada IA en el piloto. `apps/frontend/vite.config.ts` separa los dos módulos del compositor en un chunk propio para respetar el límite existente de precaché del service worker.

El backend conserva autorización, ámbito, recuperación curricular, validación de referentes y metadatos de catálogo. La alternativa conserva su metadato de transporte `editable-fallback-v1`; ambas propuestas identifican la misma versión de contenido en la traza. La comparación excluye únicamente identidad y atribución de transporte; conserva textos, acciones, OR, orden, pesos, niveles, formato y unidades. Una excepción del compositor no cae por dentro en otro proveedor. La recuperación local llama al mismo compositor, sin ocultar una excepción mediante otro motor. Para comparación interna sigue disponible `compositionMode: LEGACY`; no se expone en la interfaz. El catálogo histórico172 conserva la ruta previa.

Archivos principales: `packages/shared/src/pilot-task-contract.ts`, `instrument-composition-pilot.ts`, `science-presentation-criteria.ts`, `secondary-topic-recommendation.ts`, `instrument-recommendation.ts` e `index.ts`; backend `recommendation-engine.ts`, `evaluation-instruments.service.ts`, `catalog-current.ts`, `catalog-v172.ts`; frontend `services/instrumentPreparation.ts`. Se añaden pruebas focalizadas backend/frontend, se verifica el fingerprint congelado172 y se actualizan cuatro pruebas de metadatos del catálogo vigente. `scripts/evaluation-instruments/evaluate-composition-pilot.ts` captura evidencia reproducible. No se editaron migraciones ni esquemas.

## Banco y revisión antes/después

El banco y sus expectativas se congelaron antes de ejecutar. Se mantienen literalmente LEN01/LEN02/MAT03/MAT04 del banco de evaluación y solar-exacta/solar-maxima del banco realista anterior. Se eligió este segundo banco para B porque NAT01/NAT02 del banco de24 no solicitan una exposición oral. No se reescribieron como casos orales. Los seis casos nuevos son sintéticos del coordinador, con consignas breves/detalladas, títulos neutros/incompatibles y OR/negaciones. No constituyen pruebas docentes reales ni reservas independientes.

Evidencias en `data/evaluation-instruments/composition-pilot/`: `bank.json`, `bank.lock.json`, primeras salidas `before.json` y `after.json`, salida final `after-reviewed.json`. Los dos bancos anteriores permanecen inmutables y sus hashes se comprueban al ejecutar. Se hicieron12 selecciones automáticas y12 propuestas manuales: cuatro formatos de LEN02, solar-exacta y MAT04. No miles de combinaciones.

| Caso | Requisitos explícitos e inherentes contrastados | Antes | Después revisado |
|---|---|---|---|
| LEN01, conocido | Noticia escolar; datos disponibles, partes, secuencia, tono y convenciones | Adecuado | Conserva sus cinco dimensiones correctas; incorpora enlaces y trazabilidad. No exige entrevistas ni borrador. |
| LEN02, conocido obligatorio | Datos ficticios y qué/quién/cuándo/dónde; titular/entrada/cuerpo; organización, tono, ortografía y puntuación | Adecuado tras172 | Conserva las seis dimensiones y las exigencias previamente correctas. Revisar no obliga a entregar versiones ni modificar un texto correcto. |
| Solar exacta, conocido | Todos los planetas; explicar cada uno; comunicación oral; cinco minutos; apoyo | Contenido correcto; duración agrupada con oralidad | Cinco dimensiones distintas; cobertura reutilizada, explicación, comunicación, duración exacta y uso del apoyo. Sin bibliografía ni maqueta obligatorias. |
| Solar máxima, conocido | Cobertura y explicación; oralidad; máximo cinco minutos; apoyo | Duración incorporada a oralidad | Separa el límite; una duración menor cumple. Conserva cobertura, explicación y apoyo. |
| MAT03, conocido | Tabla de frecuencias, barras, media, mediana y conclusión sobre datos ficticios | Omite tabla/barras/conclusión concretas; añade notación genérica | Cinco criterios que evalúan esas cinco evidencias; sin encuesta, nuevas observaciones ni unidades físicas. |
| MAT04, conocido | Comparar −0.75 y −2/3; justificar cuál es menor mediante recta O explicación escrita con cálculos | Cuatro filas genéricas; pierde OR y evidencia matemática concreta | Dos dimensiones: orden y justificación por UNA opción. No cambia menor por mayor. Procedencia interna decimal incompleta; pendiente explícito de extracción. |
| NEW-A1, sintético breve | Noticia deportiva y ortografía; convenciones inherentes; no borrador | Adecuado | Se conserva; ninguna entrega extra ni cambios artificiales obligatorios. |
| NEW-A2, sintético detallado | Datos dados, cuatro interrogantes, partes, puntuación; Arial12,1.5,sangría,títulos azules; sin borrador | Adecuado con formato agrupado | Conserva todo el formato agrupado y los seis criterios de noticia. El título incompatible sobre planetas no impone exposición. |
| NEW-B1, sintético breve | Explicar oralmente qué son los planetas; sin apoyo ni duración | Contenido poco específico | Explicación científica y comunicación oral; no convierte el plural en obligación de enumerar ocho ni añade apoyo o tiempo. |
| NEW-B2, sintético detallado | Ocho planetas y explicación; aproximadamente cinco minutos; usar dibujo O lámina; sin maqueta | Omite apoyo obligatorio al coexistir OR y negación | Cinco dimensiones, OR conservado en una sola fila de apoyo; aproximación sin intervalo numérico inventado. |
| NEW-C1, sintético breve | Comparar −3/4 y −2/3; justificar cuál es mayor; recta O texto con cálculos | Filas genéricas, unidades físicas inventadas y falta de paridad | Comparación y justificación concreta; OR conservado, sin entrevista heredada del título ni unidades inventadas. |
| NEW-C2, sintético detallado | Tabla, barras, media/mediana, interpretar ambas y concluir; explicación audio O texto; sin encuesta | Omite representaciones, conclusión y entrega alternativa | Siete dimensiones; cálculo, representación e interpretación distinguibles; audio O texto, sin encuesta ni datos nuevos. |

En los doce casos revisados no se observan omisiones explícitas esenciales, nuevas entregas inventadas ni duplicación del mismo desempeño. Los requisitos detectados tienen cobertura o se aplican como exclusiones. Esta conclusión procede del contraste con las expectativas externas y de leer las salidas; `uncovered=[]` por sí solo no la acredita. Las noticias conocidas mejoran en trazabilidad, conservando contenido que ya era correcto; no se atribuye una mejora textual inexistente.

Los instrumentos completos de los tres representantes, con todos sus indicadores/descriptores, pesos, máximos y decisiones, están en `instrumentos-completos.md`. Se leyeron las progresiones completas; las escalas coinciden exactamente con las progresiones correspondientes, comprobado además por igualdad estructural. Se revisaron los indicadores de cotejo y los umbrales parciales de ponderadas. Todas las propuestas mantienen veinte puntos; las comprobaciones de adaptación cubren17.35 exactos.

## Limitaciones pedagógicas y del extractor

- Duración exacta y máxima son condiciones casi binarias. El descriptor intermedio actual expresa incertidumbre de comprobación; no demuestra una progresión pedagógica tan sólida como contenido, oralidad o justificación. La ponderada asigna su parcial existente al incumplimiento observable, sin inventar una tolerancia, pero requiere revisión antes de extender esta solución. No se presenta esta debilidad como resuelta porque los tests pasen.
- «Aproximadamente» no recibe un intervalo que el docente no dio. La precisión de ese juicio sigue siendo docente. Material de apoyo no especificado tampoco se transforma en un formato obligatorio.
- El extractor no comprende lenguaje arbitrario. Reconoce solo los requisitos acotados del piloto. Se prueba expresamente una traducción adicional no cubierta: queda en `uncovered`, sin una fila de relleno. Otras formulaciones o exigencias que el extractor no reconozca pueden quedar fuera de esa reconciliación; no se declara exhaustividad lingüística. Los procedimientos especializados reconocidos conservan su motor previo desde la frontera, no como recuperación oculta después de un fallo.
- Se detectó una limitación concreta de procedencia en MAT04: el origen de la comparación queda en «Compara −0», cortado por el punto decimal, en lugar de conservar «Compara −0.75 y −2/3». La consigna completa permanece en banco/actividad y el instrumento evalúa el orden de los racionales dados y su justificación, pero la extracción del contrato no queda íntegra. Se registra como pendiente real en `review.json`; `uncovered=[]` no lo descubre ni lo resuelve. No se amplía el piloto con otra ronda de excepciones para ocultar esta limitación.
- Los descriptores de media/mediana permiten reconocer trabajo parcial cuando hay evidencia de cálculo; un resultado correcto no necesita añadir pasos no solicitados para obtener la máxima valoración. El motor no corrige respuestas estudiantiles ni calcula calificaciones reales en esta intervención.

## Verificación automática y operativa

Pruebas focalizadas iniciales:34 backend; cuatro frontend con puntuación pendiente, textos/identidades y pesos manuales. Una primera suite completa detectó invasiones en revisión, divulgación y órdenes negadas; se detuvo tras identificar la causa, conservando el registro. Se corrigió la frontera, sin rebajar expectativas antiguas. Las focalizadas afectadas posteriores pasaron (336 y110 casos, con solapamiento). También se corrigieron apoyo opcional y tiempo de preparación reutilizando el extractor temporal previo.

La captura final tiene paridad exacta en 24 propuestas y diez regresiones representativas fuera del piloto sin cambios de contenido. La medición final (`timing-effective.json`) utiliza el código real NAT-TU y comprueba también igualdad con las doce salidas revisadas: 60 muestras del compositor puro, mínimo 0.023 ms, mediana 0.087 ms, percentil 95 de 0.886 ms y máximo 2.127 ms. No incluye red, contexto, autorización, DB ni guardado. No acredita una mejora de las consultas anteriores de 27–38 segundos.

La suite completa final del backend pasó 98 318 pruebas en 246 archivos. El editor pasó 176 pruebas en siete archivos antes de ajustar el alias real; después pasaron las cinco focalizadas del compositor, incluida NAT-TU, y se repitieron los builds afectados. El primer build frontend falló porque el chunk compartido alcanzó 2 102 881 bytes, 5 729 por encima de 2 MiB. Se corrigió el reparto del bundle mediante un chunk específico, sin elevar límites ni excluir el nuevo código de la precaché.

| Control final | Resultado |
|---|---|
| `pnpm --filter backend test --maxWorkers=6 --bail=1` | 0; 98 318/246; ejecución completa sin fallos |
| Focalizadas frontend del compositor | 0; 5/1; además, 176/7 del editor previamente aprobadas |
| `pnpm --filter backend build` | 0; 16.3 s |
| `pnpm --filter frontend build` | 0; 40.9 s |
| `pnpm cloudflare:build` | 0; 70.4 s; compilación y `wrangler deploy --dry-run`, sin despliegue |
| ESLint backend, shared, frontend y configuración Vite | 0 |

Los registros finales resumidos están en `gates.json`; los logs completos y los intentos fallidos permanecen privados e ignorados por Git. Las suites no se ejecutaron simultáneamente. Se repitió la suite backend después de corregir el código efectivo de asignatura; no se tomó un banco aislado como prueba del entorno real. El guard de hashes tolera LF/CRLF del checkout de Git sin alterar las consignas ni normalizar diferencias de contenido entre propuestas.

## Development y comprobaciones HTTP

El entorno inicial tenía 172. Se registró individualmente `evaluation-2026.173` en AulaBase Development (`eolgunypmtgrsyrjzcld`): primera operación `CREATED`, segunda `UNCHANGED`. No hubo migraciones SQL, reconstrucciones, cuentas nuevas ni cambios de contraseña. Fingerprint 173: `e430f8a66da5e3c55f893cee707f2f7b96dc813ce6de7ef05868cea05121ef4c`. Se verificó de nuevo, por lectura, que el payload compilado coincide con el instalado y que 172 sigue idéntico. La posterior corrección del alias no modificó ese payload ni las doce salidas revisadas.

La comprobación efectiva detectó que Ciencias de primero usa `NAT-TU`, mientras el banco abrevia `NAT`. Se normaliza únicamente ese alias en primero; no se acepta indiscriminadamente el resto de componentes científicos. Las pruebas y el HTTP final utilizan el código real. PostgreSQL utiliza `app_backend_local` sin bypass RLS; Auth y Storage responden 200 en Development; las variables públicas del frontend pertenecen al mismo proyecto y no contienen la clave de servicio. Se conserva una sola instancia en 8787.

El runtime final sirve `/assets/index-BBM_FG1U.js` y `instrumentos-composicion-piloto-BGTe1dAC.js`; sus bytes y los del editor coinciden con el build final. `sw.js` coincide y precarga el chunk nuevo. Chrome confirmó por el DOM que carga ese mismo entry. No se borraron cachés, registros de service worker ni almacenamiento. No se inspeccionó el contenido completo de la Cache Storage del navegador. Continúa la combinación contradictoria de cabeceras `no-cache/no-store` e `immutable` en assets; no se presenta como corregida.

Hubo una caída local por `ENOTFOUND` al resolver el pooler de Supabase. Se comprobó que no quedaba listener, que DNS volvía a resolver y se arrancó una única instancia nueva con el build estable. No se cambió DNS, red, secreto, proyecto ni timeout. Esta incidencia no se atribuye al compositor ni se declara solucionada de forma definitiva.

Los tres recorridos QA HTTP completaron interpretación, recomendación, edición de texto, guardado y reapertura con 17.35 puntos exactos, igualdad servidor/local y conservación de todos los campos manuales. Se crearon exactamente tres actividades ficticias identificables, con diario de creación anterior al POST y comprobación contra duplicados. No son recorridos de navegador ni pruebas de la cuenta personal. Lengua QA carece de ámbito publicado; Ciencias y Matemática tienen versión publicada y ámbito. Ninguno seleccionó referentes concretos por encima del umbral; no se confunde el resultado con aprobación curricular.

| Medición HTTP QA | Resultado observado |
|---|---|
| Login / contexto | 3.6 s / 4.9 s |
| Interpretar A/B/C | 23.2 / 26.0 / 24.7 s |
| Recomendar A/B/C | 24.9 / 25.9 / 29.4 s |
| Guardar A/B/C | 5.8 / 9.1 / 6.6 s |
| Reabrir A/B/C | 54.0 / 5.7 / 5.6 s |

Estos tiempos incluyen transporte, autorización y trabajo del servidor/DB. No se instrumentó cada consulta SQL internamente y no se atribuye todo ese tiempo a una causa única. La frontera demostrada es que el compositor puro es inferior a unos milisegundos, mientras los endpoints tardan segundos. La latencia operativa sigue pendiente por separado; no se elevaron timeouts ni se hicieron reintentos masivos. Evidencia completa: `http.json`.

## Cuenta personal, navegador y conservación

Chrome empezó con la sesión personal y un listado que agotaba el tiempo de espera. Una carga directa también terminó en login con «No se pudo cargar tu perfil». Tras recuperar el runtime se recuperó la sesión existente, sin introducir contraseña ni enviar correo. Se retomó la prueba real; no se dejó la conclusión basada únicamente en QA.

Se verificaron creadores nuevos vacíos, separados de los borradores previos. Los borradores anteriores siguieron visibles en el panel; no se abrieron para regenerarlos ni se eliminó almacenamiento. Los recorridos personales utilizan nombres `FICTICIA PERSONAL PILOTO A/B/C 2026-10-23` y se registran antes de confirmar cada guardado. La reapertura utiliza la ruta de edición ya existente, conservando contexto y período; el listado global lento no se usa como sustituto de esa comprobación.

- A: noticia, estrategia visible, rúbrica automática de seis criterios, puntuación inicialmente vacía, 17.35 exactos, texto de criterio editado, guardado y reapertura visual conservando la edición.
- B: contexto real NAT-TU, selección manual de cotejo, cinco criterios completos que distinguen contenido, oralidad, duración y apoyo; veinte puntos. Se modificaron texto y dos asignaciones a 4 y 6.77; tras guardar y reabrir visualmente permanecen idénticos, con total 20/20. Captura local privada: `.wrangler/realistic-audit/pilot-personal-B.png`.
- C: rúbrica automática con dos criterios distintos, comparación y justificación mediante recta O explicación escrita; puntuación inicialmente vacía y 17.35 exactos. Tras editar el título de un criterio, guardar y reabrir, la edición, las dos filas, los descriptores y el OR permanecen. Captura local privada: `.wrangler/realistic-audit/pilot-personal-C.png`.

Los tres recorridos personales completaron generación, edición, guardado y reapertura visual. Evidencia separada: `browser.json`. El formulario permanece vertical y la preparación no añadió anuncios. Las pruebas del editor cubren confirmación ante cambios manuales, respuestas obsoletas, añadir sin duplicados, completar vacíos y agotamiento con opción manual; no se reimplementaron estos mecanismos.

Conservación final comprobada por consultas de solo lectura: los 103 releases y 1 275 snapshots anteriores mantienen exactamente sus hashes. El estado final contiene 104 releases y 1 281 snapshots: solo el release 173 y seis snapshots de las tres muestras QA más las tres personales. Los seis snapshots nuevos corresponden exactamente a los diarios de creación. Las quince referencias personales originales conservan instrumentos, puntuación, referencias, estrategia, bloque y texto manual; no hay duplicados de esas actividades. Evidencia resumida en `preservation.json`; checkpoints y diarios completos permanecen privados e ignorados por Git. No se recapturó ni sustituyó la referencia inicial.

## Dictamen y continuación

Dictamen: **parcial**. Se demuestra una mejora acotada de cobertura y de relación entre requisitos y criterios, sin pérdidas observadas en las doce salidas, con OR, paridad y recorridos reales. Se conservan los casos de noticia que ya eran correctos. La procedencia decimal de MAT04 queda incompleta, sigue siendo débil la graduación de duración y no se acredita comprensión lingüística exhaustiva; los tests aprobados no eliminan esas limitaciones.

No recomiendo extender todavía esta solución a toda secundaria. Conviene resolver primero la procedencia de la comparación con decimales y la evaluación graduada de condiciones casi binarias; tratar por separado la latencia y las caídas DNS del runtime. La ampliación curricular permanece detenida. No se inicia otra asignatura después de este informe.

Rama: `ampliacion-de-instrumentos-2`. Commits locales de implementación: `33b11595137ae66735fb5659d0268c234907718b` y corrección de contexto `6ca0b9f561c80877cd2c59db2532aff157346612`. El cierre documental se registra en otro commit local cuyo hash se entrega en el mensaje final. No se envió correo, cambió contraseña, copió cuenta, alteró producción ni modificó integración de despliegue. No hay push, merge ni despliegue. La revisión final excluye credenciales, secretos, respaldos, diarios QA y capturas privadas; permanecen ignorados por Git.
