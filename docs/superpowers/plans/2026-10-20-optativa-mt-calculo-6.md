# Trigonometría, Cálculo Diferencial y Tecnología de 6.º: Implementation Plan

> Ejecución individual con `executing-plans` y TDD. El usuario autoriza continuidad autónoma y prohíbe subagentes y preguntas rutinarias.

**Goal:** conectar y verificar `OPT-MT-6` con evidencias matemáticas propias, conservando datos, instrumentos y proveedores anteriores.

**Architecture:** reutilizar `resolveMathTaskForTopics`, el registro optativo matemático, las cinco entradas existentes y los cuatro formateadores. Añadir metadata de sexto y un selector/adaptador pequeño cuando los contratos RED lo exijan; mantener intactos MT4, MT5 y Matemática común. Congelar137 antes de registrar6 y avanzar el catálogo a138.

**Tech Stack:** TypeScript, Vitest, pnpm y herramientas locales existentes; sin dependencias, IA ni cambios de esquema.

**Spec:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`.

Base `6fb2ea0c59a6b36a6df5e05bbc97d807582e48e5`, MT5 comprometido localmente con35archivos yárbol limpio. Rama `ampliacion-de-instrumentos-2`,45delante/0detrás según referencia disponible, sinfetch/push.

## Global Constraints

- Solo Development `eolgunypmtgrsyrjzcld`. Sin producción,main,merge,despliegues ni cambios de permisos o integraciones.
- NO PUSH por instrucción vigente sobre integraciones403. Commits locales españoles por bloques comprobados.
- Sin subagentes,cuentas/estudiantes nuevos,copias de producción,borrados,reset,migraciones,db push,dependencias ni IA.
- Mantener formulario vertical,manuales,preparación interna,puntos pendientes y sumas exactas20/17.35.
- Conservar70releases/870snapshots y12baselines personales. MT5 personal está bloqueado por autenticación: no inventar actividad ni13.ªbaseline; no reenviar correos o cambiar contraseñas.
- Antes de dist/Prisma/build,verificar procesos y detener solo Worker137 propio. No builds mientras un instalador o HTTP esté activo. Sin limpiar SW,cachés,almacenamiento o borradores.
- Fuente visual yclasificación deMT6 YA hechas; no repetir renders/clasificadores. Los borradores privados51contratos/16topics yprobe son preparación,no cobertura.

## Review Focus

1. Convertir una ecuación no debe pedir convertir puntos; conservar equivalencia yrestricciones del dominio. Las representaciones polares equivalentes del mismo punto no se califican como error automáticamente.
2. Distinguir curva polar2D ysuperficie3D; no afirmar que toda cuádrica sea reglada. Cardioide,esferoide ysuperficie reglada tienen anclas de indicadores propias.
3. Solo derivar una función vectorial no obliga a evaluar,graficar ointegrar la función original. Convenciones,componentes,dominio,intervalos y unidades son los dados.
4. «Modelo»,«derivada» o«gráfica» como sustantivos no imponen nuevas acciones. Interpretar resultados de un proyecto dado no obliga a ejecutar otro; recursos ysoftware son alternativas cuando así se pide.
5. A31/A34 yI57 se adaptan a aportaciones matemáticas identificables solo si la consigna pide colaboración. No imponer grupo,roles,paciencia,solidaridad privada oejecución real de proyectos comunitarios/salud.

## Source

Scope `09e061a8-e3e7-55d8-a7ce-c24364f19401`, grado6/ciclo2/modalidadAcadémica/salidaMatemática y Tecnología,PDF496–497/impresas495–496. Nombre de asignación/importación literal **Tigonometría, Cálculo Diferencial y Tecnología**; encabezado de malla «Trigonometría…». Conservar ambos ysu procedencia,sin reconstruir la fuente. I46 dice «cardiode»: preservar literal yexplicar adaptación a cardioide.

57registros:14competencias,22C/P/A y21indicadores37–57.17anclas adaptables (6C+9P+A31/A34) y5disposiciones privadas. Coordenadas polares,gráficas/transformaciones,circunferencias/cónicas/espirales,cuádricas,funciones yderivadas vectoriales; indicadores añaden superficie reglada,esferoide ycardioide. No inventar un temario completo de trigonometría por el nombre.

### Task 1: congelar137 y delimitar reutilización

**Files:** crear `apps/backend/src/modules/evaluation-instruments/catalog-v137.ts`; privados `optative-mt-six-base-137.json`,`english-compiled-137-frozen.cjs`,`english-common-137-baseline-before-138.json`. Leer los borradores/probe privados existentes,sin reejecutar sus autores.

**Interfaces:** payload137 y motor compilado exactos al release instalado en Development; los14ámbitos previos incluyen528instrumentosMT5 y432MT4.

- [x] Congelar137UNAvez mediante consulta de solo lectura. Expected:solo `optativeMathModules`/`version` difieren de136;4/5 únicos módulos matemáticos optativos,15176definiciones inglesas congeladas.
- [x] Registrar las carencias del probe:transforma produceconcepto,derivada agrega función base,aportación grupal cae a concepto ycardioide agrega gráfica genérica. Expected:fuente/parser actuales delimitados,sin proveedor6 aún.

### Task 2: contratos y correspondencias RED

**Files:** `data/evaluation-instruments/optative-mt-six-contracts.json`,`docs/curriculum/cobertura-secundaria/optative-mt-6-correspondencias.json`; backend `optative-mt-six-contract.spec.ts`,frontend `optativeMtSixContract.spec.ts`.

**Interfaces:**17anclas y21indicadores,5exclusiones explícitas; sourceIDs literales yadaptación diferenciados. Casos positivos/negativos,tipos,evidencias requeridas/prohibidas,participación grupal condicionada y contexto real sin ciclo explícito.

- [x] Revisar ypublicar52contratos,incluir los cinco focos,negaciones,alternativas,objetos compartidos y propósitos de instrumento. Expected:sin referencias positivas a disposiciones privadas.
- [x] Ejecutar contratos antes de registrar6. Expected:RED por proveedor ausente,con importaciones yguards válidos; manual/pending/paridad/20/17.35 contratados.

### Task 3: metadata y adaptación matemática GREEN

**Files:** `packages/shared/src/secondary-optative-mt-6.ts`,adaptador `secondary-optative-calculus-evidence.ts` si hace falta,registro `secondary-optative-math.ts`,catálogo138 yfixture del servicio.

**Interfaces:** `OptativeMathModule`,parser matemático compartido ycriterios por acción con namespace`opt-mt-6`. No duplicar conexiones en servidor/frontend; las entradas ya consumen el registro.

- [x] Implementar el mínimo probado porRED. Selector propio conserva objeto,dimensión,dominio yacción; aportación matemática solo bajo petición grupal expresa. Expected:contratos/servicio/paridad/manual/pending/puntos verdes,sin alterar4/5/comunes.

### Task 4: herramientas e instrumentos completos

**Files:** artefactos `optative-mt-6-*`,allowlists explícitas6 fuente/QA/HTTP/inventario ypruebasNode existentes.

- [x] Añadir fuente57/5 únicamente a su ámbito y probar negativos de grado/salida. Expected:fuente literal intacta ysin conectar otros grados.
- [x] Generar yleer todos los instrumentos completos:criterios,cinco progresiones,descriptores,cuatroformatos,puntuación ycorrespondencias; corregir conRED/GREEN antes de registrar huellas. Expected:0lecturas pendientes,no cobertura declarada por inventario o tests solamente.

### Task 5: gates y regresiones

**Files:** pruebas/builds/lints/Node existentes; `apps/frontend/vite.config.ts` solo si precaché RED demuestra necesidad de separar metadata pura.

- [x] Verificar procesos ydetener Worker137 propio antes de compilar. Ejecutar backendtest/build,frontendactividades/build yCloudflarebuilddry-run,lints,Nodefuente/inventario/historia/precaché. Expected:0fallos,todosJS precargados≤2097152bytes. Margen137=14923bytes;si se supera,extender el patrón existente de chunks de metadata pura paraMT4/5/6,sin elevar límite ni retirarprecaché.
- [x] Fuente=compilado;137congelado=DB;14optativas previas/10492instrumentos completos,15176INGcomún,2888MATcomún ycomunes previos exactos. Expected:sin regenerar artefactos históricos ni sobrescribir12baselines personales.

### Task 6: Development y HTTP/DB

- [ ] RuntimefinalPGapp_backend_local/sinBYPASSRLS,Auth,Storage yfrontend exclusivamenteDevelopment,assets exactos. Instalar solo catálogo138 yfuente57/5 con idempotencia e historia previa conservada.
- [ ] QA6en curso ficticio,sin usuarios/estudiantes nuevos.32muestras representativas de21indicadores,cuatroformatos,20/17.35,manual/pending/paridad/fuente/excluido400/guardar-reabrir/estrategiasolaexacta. Expected:sin500,mediciones de preparación/guardado ysin cambios históricos.

### Task 7: navegador y revisión

- [ ] Si existe acceso personal,recorridoQA6separado con estrategia visible/AUTO/MANUAL,cuatroformatos,scorevacío/manuales/17.35→20→17.35/guardar-reabrir/estrategiasolaexacta;baselineUNAvez. Si sigue bloqueado,documentar ycontinuar independientes,sin usarQA como si fuera personal. Expected:límites explícitos ydatos conservados.
- [ ] Revisión propia separada por prohibición de subagentes;una pasada de correcciones importantes RED/GREEN,menores al informe. Conservar workspace/evidencias/continuación.

### Task 8: documentación y commit local

- [ ] Informe,master ycontinuación finales;auditoríaUTF8/secretos/QA/respaldos/diff/index. Expected:solo archivos públicos explícitos ypendientes personales separados.
- [ ] Commit español LOCAL,confirmar hash yárbol,sinpush. ContinuarCT4→CT5→CT6 ypendientes independientes autorizados.

## Checkpoint de cierre local con bloqueo externo

Tasks1–5verificadas. Task6instalación/fuente/QA idempotentes completas;HTTPparcial17/32,18creadas,2fallosDNS repetidos yproceso local terminado. No cumple todavía el recorridoHTTP completo. Task7revisión propia realizada;accesopersonalbloqueado ydocumentado. Task8documentación ya refleja bloqueo;commitlocal de código verificado sin declararplancompleto. Usuarioordena continuarindependientesCT4/5/6 sinpreguntas. No reanudar instaladores niHTTP desde cero;conservarprogreso139requests/18IDs.
