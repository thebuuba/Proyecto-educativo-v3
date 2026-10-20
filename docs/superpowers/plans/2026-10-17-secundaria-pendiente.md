# Instrumentos pendientes de secundaria — plan de ejecución

> Ejecución individual mediante `executing-plans` y TDD. El usuario ha autorizado continuar entre bloques sin confirmaciones y exige trabajar en la rama actual; no crear otro worktree ni usar subagentes.

**Objetivo:** completar las áreas y optativas pendientes según sus fuentes oficiales, distinguiendo inventario, implementación y verificación real.

**Arquitectura:** proveedores deterministas compartidos en `packages/shared/src`, conectados al motor backend, sugerencias y alternativa local existentes. Versiones nuevas de catálogo; los releases instalados y snapshots históricos son inmutables. Reutilizar formateadores, pesos, puntuación y persistencia actuales.

**Stack:** TypeScript, Nest, React, Vitest, Prisma y PostgreSQL/Supabase Development; pnpm. Sin nuevas dependencias.

**Especificación:** [encargo íntegro](../specs/2026-10-17-secundaria-pendiente-encargo.md).

## Restricciones globales

- Development `eolgunypmtgrsyrjzcld` exclusivamente; guard de PostgreSQL, Auth, Storage y frontend antes de escribir.
- Sin producción, despliegue, merge a main, migraciones remotas de esquema, reset, force push, borrados o copia de usuarios.
- Mantener el creador vertical, cuatro controles, puntos pendientes, selección manual, preparación silenciosa y snapshots inmutables.
- Fuente literal separada de adaptaciones; no convertir encabezados ni personalidad, fe o apariencia en desempeños evaluados.
- Revisar instrumentos completos, no aprobar por conteos, HTTP 200 o sumas.
- Commits locales por bloques; el usuario ordenó dejar los pushes pendientes hasta revisar las integraciones automáticas. No cambiar triggers ni permisos. Continuar sin pedir permiso entre temas/grados; bloqueos externos no impiden el trabajo independiente.

## Foco de revisión

Consigna corta frente a título incompatible; acciones independientes y negadas; alternativas sin exigir ambos productos; identificación de fuentes frente a investigación inventada; contexto común frente a optativa/modalidad. Cada contrato debe ejercitar estos casos en cuatro formatos y 20/17.35/sin puntos, con paridad de motor y alternativa local.

## Bloques

### 1. Auditoría inicial e inventario maestro

- [x] Revisar Git, fuentes, evidencia de Naturales y guard del entorno.
- [x] Separar los 17 encabezados sin grado de los 72 ámbitos por grado (54 comunes y 18 optativos académicos).
- [x] Cotejar visualmente PDF48,49,55 y conservar la procedencia del inventario.
- [x] Confirmar catálogo servido, disponibilidad de localhost y preservación de históricos actuales.
- [x] Guardar auditoría y continuación mediante commit local `be93440c`; push pendiente por instrucción del usuario.

Archivos: `scripts/evaluation-instruments/secondary-master-inventory.mjs`, `docs/curriculum/cobertura-secundaria/secundaria-inventario-maestro.{json,md}`, informe y continuación de este encargo. La comprobación del script debe rechazar un PDF con hash distinto y scopes duplicados.

### 2. Ciencias Sociales común, grados 1–6

Para cada grado, en orden:

- [ ] Renderizar y revisar todas las páginas de la malla, incluidas continuaciones e indicadores; registrar conceptos/procedimientos y exclusiones.
- [ ] Escribir y ejecutar contratos que fallen por falta de proveedor contextual; consignas representativas y negativas de cada tema/familia, cuatro formatos y progresión.
- [ ] Implementar criterios disciplinares observables en proveedor compartido; conectar motor, sugerencias y alternativa local sin duplicar los formateadores.
- [ ] Revisar los instrumentos completos y medir preparación pura; corregir fallos con regresión.
- [ ] Congelar release anterior y crear el nuevo. Instalar fuente/catálogo únicamente en Development con idempotencia y huellas históricas.
- [ ] Probar cuatro formatos mediante HTTP/DB por contexto; medir recomendación/guardado. Recorridos representativos de navegador por grado; registrar bloqueos explícitamente.
- [ ] Ejecutar comprobaciones del repositorio al cerrar el bloque, revisar secretos/diff, actualizar matriz/informe/continuación, commit y push.

Interfaces: `InstrumentAcademicContext`, `ContextualTopicCriterion`, `InstrumentRecommendation` y adaptador existente de recomendaciones editables. Modificar las conexiones existentes en `recommendation-engine.ts`, `evaluation-instruments.service.ts`, `instrumentPreparation.ts`, `activityDefaultSuggestions.ts` y export público. Fuente: PDF244–280 según grado.

### 3. Otras áreas comunes

Repetir el contrato completo del bloque 2 para Artística (PDF330–349), Física (PDF359–382) y Formación Integral Humana y Religiosa (PDF392–424). Usar evidencia expresiva, motriz y reflexiva propia; no reutilizar criterios de Lengua como sustituto disciplinar. La presencia por grado viene del inventario maestro.

### 4. Optativas y fuentes complementarias

Revisar las tablas PDF427,461,490,498 y sus 18 ámbitos por grado antes de implementar. Conservar las salidas distintas aunque compartan denominación; no habilitar optativas en primer ciclo. Buscar fuentes oficiales complementarias de otras modalidades; si no están accesibles, documentar el límite por mención y continuar las fuentes disponibles. No declarar cerrado ese ámbito sin fuente.

### 5. Cierre consolidado

Revisar la matriz de estado, instrumentos completos y evidencias de cada área. Ejecutar `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`, `pnpm cloudflare:build` y las regresiones frontend afectadas. Verificar integridad de releases/snapshots, configuración efectiva, último commit/upstream y árbol. Enumerar cualquier pendiente real sin presentar cierre parcial como finalización del encargo.

HLM5: epopeya y novela policíaca conectadas/verificadas mediante272instrumentos y12muestrasHTTP/DB enDevelopment125. Navegadorpersonalpendientedeautenticación. Dosoptativasacadémicasconectadas,demás16pendientes;no cerrar elpaso global. SiguienteHLM6periodismo/publicidadyregresióndelaliaspolicialsingularen126,pushretenido.

HLM6:periodismo/publicidad conectado/verificado en126 mediante436instrumentos completos y16muestrasHTTP/DB;alias5otra muestra separada.Navegadorpersonalpendientedeautenticación.Tresoptativasacadémicasconectadas/quincerestantespendientes,ademásespecialidades;lectura18fuentesnoequivaleacierre.SiguienteInglésHLM4;pushretenido.

Checkpoint vigente tras Inglés HLM5 (los párrafos anteriores son históricos): cinco optativas académicas conectadas con evidencia representativa; trece y las modalidades especializadas siguen pendientes. Inglés HLM4: catálogo127,1.532instrumentos,24muestras HTTP y recorrido personal completo en curso QA separado. Inglés HLM5: catálogo128,2.200instrumentos,28muestras HTTP y recorrido personal completo en curso QA separado; historia previa conservada. Informes2026-10-19-optativa-hlm-ingles-4 y-5. Siguiente: Inglés HLM6, después los ámbitos restantes. Los pushes continúan retenidos; cada bloque se conserva mediante commit local español. Los pendientes personales de ámbitos anteriores no heredan estas comprobaciones.

Checkpoint vigente tras Inglés HLM6: catálogo129,523consignas/2.092instrumentos completos revisados,32muestrasHTTP/DB únicas y recorrido personal completo en curso QA separado. Cuatro formatos, puntos pendientes, selección manual, guardado/reapertura y estrategia sola exacta;61releases/572snapshots previos conservados, final62/605. Seis optativas académicas conectadas; doce y modalidades especializadas pendientes. Siguiente HCS4→HCS5→HCS6, continuando autónomamente. Pushes retenidos; pendientes personales anteriores no heredan esta verificación.

Checkpoint vigente tras Literatura HCS4: catálogo130,312instrumentos completos revisados,28muestrasHTTP/DB únicas más2regresionesHLM4 y recorrido personal completo en curso QA separado. Historia62/605 preservada, final63/636. Siete optativas académicas conectadas; once y modalidades especializadas pendientes. Próximo HCS5→HCS6, autónomamente. NO PUSH. Precaché2.097.110bytes/42bytes de margen, no ampliar2MiB.

Checkpoint tras Literatura HCS5:catálogo131,300instrumentos completos/300huellas/0pendientes,32HTTP/DB y recorrido personal QA5 completo, estrategia aislada conserva instrumento/snapshot.63releases/636snapshots previos exactos,final64/669. Ochooptativasacadémicas conectadas;diez ymodalidadesespecializadas pendientes. Próximo HCS6textos científicos/profesionales,autónomo. NO PUSH. Precaché72JS/max2006096,metadata enchunk propio,2MiB intacto.

Checkpoint TextosHCS6:catálogo132,600instrumentos completos/600huellas/0pendientes,40HTTP/DB ypersonalQA6completo. Historia64/669intacta,final65/710;estrategiaaislada conservóinstrumentoysnapshot. Nueveoptativas verificadasrepresentativamente/nuevependientes,másmodalidadesespecializadas ypruebaspersonalesantiguas. PróximoFilosofíaHCS4→Demografía5→Ciudadanía6. PreparacionesMT4/5/6yQuímicaCT5 hechas duranteHTTP132,noimplementación;no repetirclasificadores. NOPUSH.

Checkpoint FilosofíaHCS4:catálogo133,480instrumentos completos/480huellas/0pendientes,28HTTP/DB ypersonalQA4completo. Historia65/710intacta,final66/739;estrategiaaislada conservóinstrumentoysnapshot. Backend80374/175,frontafectado803/0,4buildsfinales0(CFdry-run). Diezoptativas verificadasrepresentativamente/ochopendientes,másmodalidadesespecializadas yrecorridospersonalesanteriores. PróximoDemografíaHCS5→CiudadaníaHCS6→MT/CT. Freeze133preparado,noejecutado;análisisdedemografíademuestraquehacefaltaevaluarcálculospropios. NOPUSH.

Checkpoint DemografíaHCS5:catálogo134,608instrumentos completos/608huellas/0pendientes,32HTTP/DBcon21I ypersonalQA5completo. Historia66/739intacta,final67/772;9baselinespersonalesanteriores exactas. Backend81518/176,frontendactividades80722/109,5pruebasprotecciónCacheStorage.4builds0+2repetidosafectados0(CFdry-run),Node36/0,lints0/16previas. Onceoptativas verificadasrepresentativamente/sietependientes,másmodalidadesespecializadas yrecorridospersonalesanteriores. SiguienteCiudadaníaHCS6→MT/CT. Congelar134despuésdelcommit yantesdecódigo135. NOPUSH.

Checkpoint CiudadaníaHCS6: catálogo135,103consignas/412instrumentos completos revisados,32HTTP/DB de persistencia con21I,3variantes finales/12formatos adicionales sin nuevasactividades,y recorrido personalQA6 completo. Historia67/772intacta,final68/805;13camposDOM/IDs/snapshot/huella exactos al cambiar soloestrategia.10baselinespersonalespreviaspreservadas. Backend82269/177;frontactividades81349/110+662afectadosfinales(sin sumar),39Node/0,lints0/16previas,4buildsfinales0(CFdry-run),73JS/max2028667. Doceoptativas verificadasrepresentativamente/seispendientes,másmodalidadesespecializadas yrecorridospersonalesanteriores. SiguienteMT4→5→6/CT4→5→6. Congelar135solo después delcommit yantes de136. NOPUSH.

Checkpoint Matemática Financiera MT4: catálogo136,108consignas/432instrumentos completos revisados yhuellas exactas;32HTTP/DBcon21Irepresentados,195solicitudes/0HTTP500,yrecorrido personalQA4completo.31camposDOM/IDs/snapshot/huella exactos al cambiar CASE_STUDYAUTO→PROBLEM_BASEDMANUAL yrecargar. Historia68/805intacta,final69/838;11baselinespersonalesanteriores exactas,sin sobrescribir. Backend83016/178,frontendactividades82034/111+3555focalesposteriores(sin sumar),4buildsfinales0(CFdry-run),Node40/0,lints0/9previasdelámbitoactividades.73JSprecargados/max2047102/cap2097152/margen50050. Treceoptativasacadémicas verificadasrepresentativamente/cincopendientes,másmodalidadesespecializadas yrecorridospersonalesanteriores. PróximoMT5→MT6→CT4/5/6. Congelar136solo después delcommit yantes decódigo137. No repetirlecturas/renders/clasificadores yahechos deMT5/6. NO PUSH.

Checkpoint Estadística MT5:catálogo137,132consignas/528instrumentos completos revisados por huella y0pendientesdelectura,32HTTP/DB con20indicadores observables de21inventariados(I84privadoexcluido),196requests/0HTTP500/2rechazos400esperados. Cuatroformatos/20y17.35/manual/pending/paridad/guardar-reabrir/estrategiasolaexactos. Historia69/838previaintacta,final70/870;12baselinespersonalesanteriorespreservadas. NavegadorpersonalMT5BLOQUEADOporautenticación(creadorprotegido→login),noactividad/baselinepersonalnueva;contextoQA5separadolisto,pruebamanualdocumentada. Backend83781/179,frontendactividades82711/112,4builds0inclCFdry-run,Node42/0,lints0/9previas,73JSmax2082229/cap2097152/margen14923.14optativasacadémicasconectadasconverificaciónHTTPrepresentativa;4pendientes(MT6,CT4/5/6),ademásmodalidadesespecializadas yrecorridospersonalesanteriores. PróximoMT6automático;freeze137solo despuéscommitMT5. PreparacionesprivadasMT6(51contratos/16topics),CT4clasificación258adapt/44Iliterales43observables/37exclusiones yCT6clasificación223adapt/36I/34exclusionesYAhechasUNAvez,no repetir. NOPUSHporinstrucción403,sinproducción/main/merge/deploy/subagentes.

Checkpoint Cálculo MT6: catálogo138 instalado idempotente,57registros/17anclas/21I/5exclusiones,272instrumentos completos revisados por huella. Gates finales backend84259/180/0 yfrontendactividades83132/113/0,4builds0inclCFdry-run,Node44/0,lints0/9previas;precaché74JS/max2044953/margen52199 tras RED352bytes ychunkmetadata. HTTP PARCIAL17de32verificadas/18creadas/139requests/2HTTP500porENOTFOUND ysalida delruntime local dos veces;reanudaciónconmismosIDs,sinduplicados,timeouts oconfigcambiados. Historia70/870previaintacta,final71/888 y12baselinespersonalespreservadas.20de21IrepresentadosporHTTPverificado,personalauthbloqueado.15optativasacadémicasconectadas,MT6runtimeparcial;CT4/5/6todavíapendientes,másespecializadas/backfills. ContinuarCT4independiente conformeorden delusuario;noatribuircierreglobalni HTTPcompletoaMT6. NOPUSH.
