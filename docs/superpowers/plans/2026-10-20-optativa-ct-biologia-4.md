# Biología y Computación de 4.º: Implementation Plan

> Ejecución individual con `executing-plans` y TDD. El usuario exige continuidad autónoma, rama actual y ausencia de subagentes.

**Goal:** conectar los cuatro componentes reales de Biología y Computación CT4 mediante instrumentos propios y verificables, conservando los anteriores.

**Architecture:** extraer una entrada configurable aditiva del resolver científico común y reutilizar criterios, selecciones y formateadores. Registro optativo científico con metadata CT4 y adaptador acotado para modelado, simulación, programación y condiciones propias demostradas por RED. Congelar138 antes de modificar catálogo; actual139 cuando exista proveedor probado.

**Tech Stack:** TypeScript, Vitest, pnpm, herramientas existentes de fuente/catálogos/QA. Sin IA, dependencias ni cambios de esquema.

**Spec:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`.

## Global Constraints

- Solo Development `eolgunypmtgrsyrjzcld`; no producción, main, merge, despliegue, reset, borrados, migraciones remotas ni copia de cuentas.
- NO PUSH por orden vigente sobre integraciones403. Commits locales españoles por bloques verificados; conservar evidencias y continuación.
- Sin subagentes ni nuevas cuentas/estudiantes. Datos QA identificables en contextos existentes, con guards antes de escribir.
- MT6 sigue HTTP parcial:17/32verificadas,18creadas/139requests/2HTTP500DNS,70/870previos conservados yfinal71/888. No sobreescribir18IDs ni12baselines personales. No afirmar cierre completo de ese bloque.
- Runtime8787 detenido por dos salidas ENOTFOUND. No reiniciar bucles ni modificar configuración/credenciales/DNS/timeouts para eludirlo. Continuar código y pruebas independientes; remoto solo si vuelve a ser verificable.
- Mantener creador vertical, preparación silenciosa, manuales, puntos pendientes,20/17.35 exactos y estrategia aislada sin cambiar instrumento.
- Fuente CT4 ya leída visualmente y clasificada: no repetir renders/clasificador.352registros,258anclas149C/106P/3A,29rótulos,1fragmento y7disposiciones privadas (inclI322)=37exclusiones.44I literales/43observables.
- No técnicas clínicas reales, dosis, diagnósticos de personas, genomas/historias privadas, cultivos peligrosos, publicación, ventas o empresas reales. Fuentes médicas/legales primarias específicas cuando se afirmen hechos actuales; datos/modelos/fichas proporcionados.

## Review Focus

1. «Resultados del proyecto de investigación ya realizado» es objeto dado, no una orden de investigar de nuevo; títulos antiguos no cambian la consigna.
2. Programar, depurar, simular, modelar y representar resultados son acciones distintas; no rellenar todas con una fila genérica ni exigir ejecutar cuando solo se analiza.
3. Secuencias, alineamiento, árbol filogenético, redes, sensores y SIG conservan objetos, escalas, parámetros y límites propios. Similitud no demuestra función idéntica.
4. Condiciones de ética, TIC, colaboración y plan profesional solo bajo consigna expresa; no moralidad, emociones, adhesión sobre aborto/transgénicos ni proyectos personales obligatorios.
5. Alternativas ensayo/debate, datos genómicos/proteómicos y software/recurso no imponen ambas ramas. Negaciones y productos independientes no se pierden.

## Source

Scope `5961a313-fc4c-5985-99bd-3e3bf539d5c1`, nombre de asignación **Biología y Computación**, salida Ciencias y Tecnología, Académica, cuarto/ciclo2. Malla «Salud, Biología Computacional, Bioinformática Medioambiental y Biotecnología», PDF499–505/impresas498–504. Exploración214/Explotación215 cotejadas en imagen502existente; la nota vieja que decía duplicación era errónea.347/348casi duplicados no se convierten en dos criterios equivalentes. Mantener P4duplicada40/41 y no inventarP6.

### Task 1: congelar138 y delimitar reutilización

**Files:** `apps/backend/src/modules/evaluation-instruments/catalog-v138.ts`; privados `optative-ct-four-base-138.json`, motor compilado138 y baseline común antes139. Consumir `ct-four-reuse-findings.json`,93agrupaciones/258anclas y42borradores/43I ya preparados, sin repetir sus autores.

**Interfaces:** payload138 exacto de fuente/compilado/DB,15optativas previas y12baselines; no nuevo registro aún.

- [x] Leer guards/procesos y congelar una sola vez en consulta readonly Development. Expected:solo campos matemática/version difieren de137,MT4/5/6 únicos módulos matemáticos;15176definiciones inglesas congeladas. Si conexión falla, preservar el bloqueo y seguir contratos independientes sin inventar verificaciónDB.
- [x] Registrar probe:guard común rechaza CT4 correctamente,pero modela/simula/programa/aportación caen acontent y proyecto dado añade investigación. Expected:necesidades acotadas,sin modificar motor aún.

### Task 2: correspondencias y contratos RED

**Files:** `data/evaluation-instruments/optative-ct-four-contracts.json`, `docs/curriculum/cobertura-secundaria/optative-ct-4-correspondencias.json`; backend `optative-ct-four-contract.spec.ts`, frontend `services/optativeCtFourContract.spec.ts`.

**Interfaces:**258anclas y43I con casos explícitos;37exclusiones,procedencia literal separada. Borradores no son expectativas inmutables:tipo según propósito real,medios/alternativas sin imponerse.

- [x] Publicar contratos positivos/negativos para componentes y objetos/facetas reales; lectura/explicación más acciones desarrolladas, negaciones, alternativas, manual/pending,propósitos yguard de contexto sin ciclo explícito. Expected:ninguna referencia positiva a privados/rótulos.
- [x] Ejecutar antes del registro. Expected:RED por proveedor ausente/importaciones válidas,cuatroformatos y20/17.35 contratados;failures archivados.

### Task 3: reutilización del resolver científico y proveedor GREEN

**Files:** `packages/shared/src/secondary-science-common.ts`, nuevo `secondary-optative-science.ts`, `secondary-optative-ct-4.ts`, adaptador `secondary-optative-science-evidence.ts` si RED lo exige; export shared, backend recomendación/interpretación/catalog139 y frontend preparación/defaults/tipo automático.

**Interfaces:** exportar `resolveScienceTaskForTopics(title,description,grade,topics,options?)` con selector/verbos opcionales y resultado `CommonScienceTask`; wrapper `resolveCommonScienceTask` conserva guard/selección original. Registro `OptativeScienceModule` y resolver con level/grade/cycle/code/modality/exit; criterios namespaceopt-ct-4. Reusar criterios/selecciones ycuatroformatos.

- [x] Escribir test científico común de preservación y observar GREEN original; pruebas de entrada configurable/optativaREDantesdeimplementarla. Expected:sin cambios en comportamiento común por defaults.
- [x] Implementar metadata con facetas de objetos solicitados,adaptermínimo para acciones demostradas yconexiones compartidas. Expected:contratosGREEN/paridad/manual/pending/score yguards;sinmotorparalelo ni clínica real.
- [x] Congelar/rutear138yavanzar139 solo con pruebas válidas. Expected:históricos inmutables.

### Task 4: fuente, herramientas e instrumentos completos

**Files:** artefactos `optative-ct-4-*`, allowlists fuente/QA/HTTP/inventario yNode tests.

- [x] Habilitar exclusivamente CT4,probar negativos de grado/salida y352/37. Expected:literal intacto;I322privado rechazado.
- [x] Generar y leer instrumentos completos por texto/objeto/progresión/paquetes cuatroformatos ycorrespondencias;erroresRED→GREENantesdehuellas. Expected:0lecturas pendientes,sin cerrar por conteos.

### Task 5: gates y conservación

- [x] Verificar procesos antes de backendtest/build,frontendactividades/build ycloudflarebuilddry-run,lints,Node/precache. Expected:0fallos,JS≤2097152todasprecargadas;separarmetadatapura solo trasRED,sinelevarlímite.
- [x] Comparar138congelado/15previasinclMT6/10764instrumentos completos,15176ING,2888MAT ycomunes;sourcecompiled y12baselinesplain. Expected:sin rebaseline ni artefactos históricos regenerados. SiDBbloqueada,documentar sin declarar esa parte pasada.

### Task 6: Development y HTTP/DB

- [x] Solo con conectividad verificable,confirmarPG/Auth/Storage/frontendDevelopment yassetsbuild. Instalarcatalog139/fuenteCT4individual con idempotencia yhuellas previas. Expected:sincrearusuarios/estudiantes ni perder71/888baseactual;releerhistoriareal antesdeescribir.
- [ ] ContextoQA4existente yselecciónrepresentativa cuatrocomponentes/43I,cuatroformatos,20/17.35/manual/pending/paridad/fuente/exclusiones/guardar-reabrir/estrategiasolaexacta. Expected:resultadosmedidos conerrores conservados yIDsidempotentes;bloqueoexternodocumentado sinbucles.

### Task 7: navegador y revisión

- [x] Si cuenta personal tiene sesión,recorridoQAseparadoestrategiaAUTO/MANUAL/instrumento/score/manualmenteeditado/guardar-reabrir/estrategiasolaexacta ybaselineUNAvez. Si pidepassword,documentarbloqueo,sincorreos/contraseñasnuevos. Expected:QAnoatribuidaapersonal.
- [x] Revisión propia separada por prohibición de subagentes;una pasada de importantesRED→GREEN,menores alledger. Expected:limitaciones explícitas ydatos intactos.

### Task 8: informe y commit local

- [ ] Informe/master/continuación reflejan cobertura ybloqueos exactos;auditoríasecretosUTF8/QA/respaldos/diff. Expected:soloarchivospúblicos explícitos.
- [ ] Commit español LOCAL de bloque verificado;si runtimebloqueado,conservarparcialsin declarar completado. NO PUSH. ContinuarCT5→CT6/especializadas/backfillspersonales autorizados.

Checkpoint efectivo:Tasks1–5 yrevisión completadas con evidencia;Task6HTTPparcial19/42por dos timeouts yconexión terminada,19guardadas/126respuestas/1HTTP500servidor;Task7personalbloqueado documentado. No marcar HTTP ni recorrido personal completos. Task8audit/commitLOCAL pendiente de verificación final. ContinuarCT5independiente,sinpush.
