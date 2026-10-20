# Estadística, Probabilidad y Tecnología de 5.º: Implementation Plan

> Ejecución individual con `executing-plans` y TDD. Continuidad autónoma autorizada; sin subagentes ni preguntas rutinarias.

**Goal:** conectar y verificar `OPT-MT-5` con evidencias estadísticas y probabilísticas propias, conservando MT4 y todos los ámbitos y datos anteriores.

**Architecture:** reutilizar `resolveMathTaskForTopics`, el registro optativo matemático, las entradas ya conectadas y los cuatro formateadores. Añadir metadata de quinto y, si los contratos lo exigen, un adaptador pequeño de selección/evidencias estadísticas; las reglas financieras de cuarto deben permanecer idénticas. Catálogo137 añade quinto y136 se congela antes de modificar el proveedor.

**Tech Stack:** TypeScript, Vitest, pnpm y herramientas locales existentes. Sin dependencias, IA o cambios de esquema.

**Spec:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`.

Base `f3b3069e890cb10083e07ba85d319dcaf5359c52`, MT4 cerrado con41archivos yárbol limpio; rama `ampliacion-de-instrumentos-2`,44delante/0detrás según referencia disponible,sinfetch/push.

## Global Constraints

- Solo Development `eolgunypmtgrsyrjzcld`. Sin producción,main,merge,despliegues,cambios de permisos o integraciones.
- NO PUSH por instrucción vigente. Commits españoles locales por bloques verificados.
- Sin subagentes,cuentas nuevas,estudiantes nuevos,copias de producción,borrados,reset,migraciones,db push o dependencias.
- Conservar datos,borradores,releases,snapshots y12baselines personales. QA identificable autorizado por sección10,en contexto ficticio separado con huellas de los datos originales.
- Mantener formulario vertical,cuatro selectores,manuales,preparación interna,puntos pendientes y sumas exactas20/17.35.
- No limpiar SW,cachés ni almacenamiento. Antes de dist/Prisma/build,verificar ydetener solo Worker propio. No builds durante instalador/HTTP.
- Fuente visual yclasificación anteriores se conservan;no repetir renders oclasificadores. Inventario o pruebas verdes no sustituyen lectura de instrumentos completos.

## Review Focus

1. Descriptiva/inferencial,población/muestra,media/mediana/moda yparámetros/estadísticos no se confunden;solo se calculan las medidas pedidas ycon convenciones dadas.
2. Correlación no demuestra causalidad;regresión/proyección conserva supuestos ydominio dados,sin certeza oextrapolación inventadas.
3. Probabilidad teórica/experimental ysoftware son alternativas cuando lo dice la consigna;dependencia,condicionamiento,distribuciones ymodelos requieren datos ysupuestos pertinentes.
4. I80conserva «datos que se asumen normalizados»:normalizar no demuestra normalidad. La adaptación usa el supuesto de modelo normal explícito yno lo impone a cualquier gráfica. P53«certeza supuesta» se conserva literal,sin convertir probabilidad en certeza.
5. Datos dados/simulados/agregados,con personajes ficticios;sin encuestas privadas otrabajo de campo obligatorio. A60se adapta a fortalezas/mejoras de un trabajo concreto;I84de compromiso privado se excluye de evaluación.

## Source

Scope `87268d19-5d32-5426-9396-21ae21fc5bbd`, nombre literal **Estadística Probabilidad y Tecnología**, grado5/ciclo2/Académica/salidaMatemática y Tecnología,PDF494–495/impresas493–494.84registros:49C/P/A,44adaptables23C+20P+1A60 y5disposiciones privadas;21indicadores64–84 y14competencias. I84es disposición privada:se añadirá explícitamente su exclusión,conservando los21literales;20indicadores serán adaptables yel total de exclusiones será6. No reinterpretar las44anclas como44temas.

### Task 1: congelar136 y acotar reutilización

**Files:** crear `apps/backend/src/modules/evaluation-instruments/catalog-v136.ts`; baselines privados `optative-mt-five-base-136.json`,`english-compiled-136-frozen.cjs`,`english-common-136-baseline-before-137.json`.

**Interfaces:** payload136 y motor compilado exactos aDevelopment,antes de metadata137;preserva432instrumentos4y12optativas previas.

- [ ] Congelar136UNAvez contraDBenlectura,sin sobrescribir. Expected:solo optativeMathModules/version difieren de135;MT4único módulo matemático optativo y15176definiciones inglesas congeladas.
- [ ] Probe de acciones,medidas,alternativas yreflexión usando el parser existente. Expected:reutilización comprobada ycarencias explícitas;sin cambios de producto ni remoto.

### Task 2: contratos y correspondencias en RED

**Files:** `data/evaluation-instruments/optative-mt-five-contracts.json`,`docs/curriculum/cobertura-secundaria/optative-mt-5-correspondencias.json`,backend `optative-mt-five-contract.spec.ts`,frontend `optativeMtFiveContract.spec.ts`.

**Interfaces:** casos por44anclas y20indicadores observables;I84preservado/excluido,con casos negativos de personalidad. Tipos,evidencias requeridas/prohibidas,guard ycontexto real sin ciclo explícito.

- [ ] Escribir casos breves/desarrollados de descripción,inferencia,organización,gráficas,medidas,muestreo,probabilidad,distribuciones,normal,correlación,regresión,simulación yrevisión concreta. Incluir los cinco focos,negaciones,alternativas,objetos compartidos ytítulo incompatible.
- [ ] Ejecutar backend/frontend antes del proveedor. Expected:RED por módulo5ausente,sin errores de importación,guards ajenos protegidos;manual/pending y20/17.35contratados.

### Task 3: metadata5 y adaptación estadística en GREEN

**Files:** `packages/shared/src/secondary-optative-mt-5.ts`,`secondary-optative-statistics-evidence.ts` si es necesario,registro `secondary-optative-math.ts`,catálogo137,fixture del servicio. Las entradas backend/frontend existentes ya consumen el registro compartido;no duplicarlas.

**Interfaces:** `OptativeMathModule`,parser compartido ycriterios por acción con namespaceopt-mt-5. Selector yadaptador estadísticos solo para5,reglas de4idénticas.

- [ ] Implementar el mínimo demostrado porRED,conservar alternativas yrecursos como tales. Expected:contratos/servicio/paridad/manual/pending/puntuación verdes ysin contaminarMatemática común oMT4.

### Task 4: instrumentos completos y herramientas

**Files:** artefactos `optative-mt-5-*`;allowlists explícitas fuente/QA/HTTP/inventario ypruebasNode. Generalizar únicamente la identificación de proveedores matemáticos ya registrados en el generador de artefactos.

- [ ] Leer criterios,cinco progresiones,descriptores,formatos,puntuaciones ycorrespondencias de todas las muestras. Corregir fallos conRED/GREEN antes de registrar huellas. Expected:0instrumentos pendientes y6exclusiones explícitas.
- [ ] Fuente literal/adaptación distinguidas;I84excluido,sin atribuir cobertura por inventario. Expected:84registros intactos y20indicadores observables representados.

### Task 5: gates y regresiones

- [ ] Revisar diff/callers/procesos ydetener Worker136propio antes de dist/Prisma/build. Backendtest/build,frontendactividades/build yCloudflarebuild dry-run,lints yNodefuente/inventario/historia/precaché. Expected:0fallos ytodosJS precargados≤2MiB,sin elevar el límite.
- [ ] Fuente=compilado;136congelado=DB;13optativas previas con9964instrumentos,incluidos432MT4,15176INGcomún,2888MATcomún yotros ámbitos previos exactos. Expected:sin rebaselines ni cambios históricos.

### Task 6: Development y HTTP/DB

- [ ] RuntimefinalPGapp_backend_local/sinBYPASSRLS,Auth,Storage yfrontend exclusivamenteDevelopment,assets exactos. Instalar solo catálogo137 yfuente84/6con idempotencia e historia preservada.
- [ ] QAen curso ficticio5,sin usuarios/estudiantes nuevos. HTTPrepresentativo de20indicadores observables,cuatroformatos,20/17.35,manual/pending/paridad/fuente/excluido400/guardar-reabrir/estrategiasola. Expected:sin500 ysin tocarhistóricos.

### Task 7: sesión personal y revisión

- [ ] Recorrido personal enQA5separado:estrategia visible/AUTO/MANUAL,cuatroinstrumentos completos,puntosvacíos,manuales,17.35/20,guardar/reabrir ysolo estrategia exacta. Baseline nuevaUNAvez,nunca sobrescribir las12anteriores. Si acceso bloquea,documentar yseguir tareas independientes autorizadas.
- [ ] Revisión propia separada,una pasada de correcciones importantes conRED/GREEN;menores al informe. Conservar workspace,evidencia ycontinuación.

### Task 8: documentación y commit local

- [ ] Informe,master ycontinuación finales;auditar UTF8/secretos/QA/respaldos/diff/index. Expected:solo archivos públicos explícitos.
- [ ] Commit español LOCAL,confirmar hash yárbol,sinpush. ContinuarMT6yCT4/5/6sin preguntasrutinarias.
