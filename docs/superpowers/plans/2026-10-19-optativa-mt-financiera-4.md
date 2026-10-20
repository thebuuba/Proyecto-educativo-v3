# Matemática Financiera y Tecnología de 4.º: Implementation Plan

> Ejecución individual con `executing-plans` y TDD, sin subagentes ni preguntas rutinarias. La revisión final será propia y se identificará como tal.

**Goal:** conectar y verificar `OPT-MT-4` mediante las acciones realmente solicitadas, conservando todos los ámbitos, datos y cuentas anteriores.

**Architecture:** extraer una entrada parametrizada del parser matemático existente, manteniendo intacto el guard de Matemática común. Añadir metadata financiera/contable y un adaptador optativo con guard de grado/ciclo/modalidad/salida, reutilizando composición, selección y los cuatro formateadores. Conectar los mismos resultados a interpretación, servidor, alternativa local y sugerencias; catálogo136 individual,135 congelado.

**Tech Stack:** TypeScript, Vitest, pnpm y herramientas existentes, sin dependencias ni cambios de esquema.

**Spec:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`.

Base `901d7942fe6c14e72b596a067489ec17a48b445f`, rama `ampliacion-de-instrumentos-2`, árbol limpio,43commits locales delante de la referencia disponible. Ciudadanía6 cerrada; no repetir su instalación,HTTP,baselines o recorders.

## Global Constraints

- Solo Development `eolgunypmtgrsyrjzcld`. No producción,main,merge,despliegues,cambios de permisos o integraciones.
- NO PUSH por instrucción vigente. Commits locales españoles por bloques verificados.
- Sin subagentes,cuentas nuevas,estudiantes nuevos,copias de producción,reset,borrados,dependencias,migraciones o db push.
- Conservar cuentas,datos,borradores,releases,snapshots y11baselines personales. QA identificable en cursos ficticios existentes,con huellas de originales,autorizado por sección10.
- Formulario vertical,selecciones manuales,preparación interna,puntos pendientes,cuatro formatos y sumas exactas20/17.35.
- No limpiar SW,cachés ni almacenamiento. Verificar procesos antes de ejecutar; detener solo Worker propio antes de dist/Prisma/build. No builds durante instalación/HTTP.
- Las páginas491–493 ya están revisadas visualmente y clasificadas; no repetir renders ni clasificación. Inventario o tests verdes no sustituyen lectura completa.

## Review Focus

1. Monto,interés,capital,cuota ysaldo son magnitudes distintas; no inventar convención nominal/efectiva,tipo de descuento,anualidad oamortización.
2. Registrar en diario/mayor no exige el ciclo contable entero; resultados,situación ycomprobación son productos diferentes. Conservar literalI96«balanza general» yexplicar adaptación.
3. Descripción actual prevalece sobre título incompatible; alternativas,negaciones,recursos yobjetos compartidos no añaden tareas.
4. Presupuestos/proyectos siempre ficticios o datos dados; sin ingresos privados,cuentas bancarias,contrataciones ni valoración de disposiciones íntimas.
5. Herramientas tecnológicas son alternativas según consigna y acceso; cambiar solo estrategia conserva exactamente instrumento ysnapshot.

### Task 1: congelar135 y comprobar reutilización

**Files:** crear `apps/backend/src/modules/evaluation-instruments/catalog-v135.ts`; baselines privados `optative-mt-four-base-135.json`,`english-compiled-135-frozen.cjs`,`english-common-135-baseline-before-136.json`.

**Interfaces:** payload135 exacto a Development y motor compilado previo; parser común y puntos de integración confirmados en código actual. Grafo5269nodos desactualizado solo orientativo.

- [x] Comparar135con134 yDevelopment mediante lectura; congelar una sola vez,sin sobrescribir. Expected:solo version/optativeSocialModules difieren;15176definiciones inglesas preservadas.
- [x] Probe con tareas financieras/contables y contexto estricto. Expected:determinar reutilización y carencias sin modificar comunes.

### Task 2: contratos de propósito en RED

**Files:** `data/evaluation-instruments/optative-mt-four-contracts.json`,correspondencias en `docs/curriculum/cobertura-secundaria/optative-mt-4-correspondencias.json`,backend `optative-mt-four-contract.spec.ts`,frontend `optativeMtFourContract.spec.ts`.

**Interfaces:** casos por51anclas adaptables y21indicadores,con acciones,evidencias requeridas/prohibidas yguard;sin51temas artificiales.

- [x] Crear casos breves/desarrollados sobre progresiones,finanzas ycontabilidad,incluyendo los cinco focos. Expected:RED por proveedor ausente,sin imports rotos.
- [x] Contratos de paridad,manual,pending,20/17.35 ycontextos ajenos. Expected:comunes siguen protegidos.

### Task 3: proveedor matemático optativo en GREEN

**Files:** `packages/shared/src/secondary-optative-math.ts`,`secondary-optative-mt-4.ts`,entrada parametrizada en `secondary-math-common.ts`,índice compartido,backend recomendación/servicio/catálogo yfrontend preparación/sugerencias/instrumento automático.

**Interfaces:** `resolveOptativeMathTask`,criterios/selecciones compartidos con namespace propio;metadata serializable de catálogo136.

- [x] Implementar ajustes mínimos demostrados por RED;preservar guard común y resultados previos. Expected:contratos verdes,un solo parser/formateadores.

### Task 4: lectura completa y herramientas

**Files:** artefactos `optative-mt-4-*`,allowlists individuales de fuente/QA/HTTP/inventario ypruebasNode;reutilizar runner matemático cuando sea compatible.

- [x] Leer todos los criterios,cinco progresiones,cuatro formatos,pesos/descriptores ycorrespondencias;corregir fallos con RED/GREEN antes de registrar huellas. Expected:0pendientes,sin requisitos añadidos.
- [x] Diferenciar fuente literal/adaptación;12exclusiones y21indicadores explícitos. Expected:inventario honesto.

### Task 5: gates y conservación

- [x] Revisar diff/callers/procesos;detener Worker propio;backendtest/build,frontendactividades/build,Cloudflarebuild dry-run,lints yNodefuente/inventario/historia/precaché. Expected:0fallos,todosJS precargados≤2MiB.
- [x] Fuente=compilado;135congelado=DB;12optativas previas,Matemática común yámbitos previos exactos,incluidas15176definiciones inglesas. Expected:sin regresiones.

### Task 6: instalar y verificar Development

- [x] Runtime final:PG app_backend_local sinBYPASSRLS,Auth,Storage yfrontend exclusivamenteDevelopment,assets exactos. Instalar solo catálogo136 yfuente individual98registros/12exclusiones con idempotencia e historia preservada.
- [x] QA con curso ficticio4,HTTP representativo de21indicadores/cuatroformatos/20y17.35/manual/pending/fuentes/exclusiones/guardar-reabrir/estrategia sola. Expected:sin500 ysin cambios históricos.

### Task 7: recorrido personal y revisión final

- [x] Usar sesión personalDevelopment en contextoQA4 separado;estrategia visible/automática/manual,cuatroinstrumentos completos,puntosvacíos,17.35/20,manual,guardar,reabrir ysoloestrategia exacta. Si acceso bloquea,documentar ycontinuar tareas independientes.
- [x] Revisión propia separada;una pasada de correcciones importantes RED/GREEN. Menores al informe. Conservar evidencia yledger;no eliminar workspace.

### Task 8: documentación y commit local

- [x] Actualizar informe,master ycontinuación;auditar secretos/QA/backups/UTF8/diff/index. Expected:solo archivos explícitos públicos.
- [x] Commit español local del bloque verificado;confirmar hash yestado mediante el cierre registrado en el ledger. NO PUSH. Continuar automáticamente MT5,despuésMT6yCTsegún plan maestro.
