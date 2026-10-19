# Geografía Humana y Demografía de 5.º HCS: plan de implementación

> Ejecutar con `executing-plans`, TDD y revisión propia. El usuario prohíbe subagentes y pide continuidad sin preguntas rutinarias.

**Objetivo:** conectar y verificar `OPT-HCS-SOC-5` con evidencias de geografía humana, demografía, economía y ambiente que correspondan a las acciones solicitadas.

**Arquitectura:** extender el proveedor social optativo existente mediante metadata propia de quinto y evidencia específica para cálculos, datos y representaciones. Reutilizar resolución por acciones, cuatro formatos, escala, selección y persistencia. El probe `demography-reuse-findings.json` demuestra que habilitar el guard solamente produce representación genérica para calcular; no basta. Mi elección es añadir decisiones de evidencia acotadas al proveedor existente, sin copiar el motor ni construir un calculador numérico.

**Tecnologías:** TypeScript/Vitest/pnpm y herramientas locales existentes, sin dependencias ni IA.

**Especificación:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`. Base `8821adcdbd115340e9e2687083745dc9cd02afce`, Filosofía4 verificada y árbol limpio; rama `ampliacion-de-instrumentos-2`.

## Límites globales

- Solo AulaBase Development `eolgunypmtgrsyrjzcld`. No producción, main, merge, despliegues, cambios de permisos/integraciones, cuentas nuevas, copias, borrados, resets, dependencias o migraciones remotas.
- NO PUSH hasta revisar las integraciones403, por instrucción posterior del usuario. Commits españoles locales por bloque verificado.
- Trabajar en la rama y checkout actuales, conforme a la instrucción del usuario; no crear otra rama/worktree ni interrumpir con preguntas rutinarias.
- Conservar snapshots, releases, cuentas, cursos originales y borradores. QA identificable autorizado por sección10; reutilizar cursos ficticios y preservar filas originales.
- Mantener formulario vertical, cuatro selectores visibles, puntos pendientes, selección manual, preparación interna sin anuncios y sumas exactas20/17.35.
- Antes de dist/Prisma/build: comprobar y detener solo el árbol Worker propio; no compilar mientras haya HTTP o instalador propio activo. Bundles privados de fuente permitidos.
- Fuente visual y clasificación YA hechas una vez; no repetir renders o clasificadores. No atribuir cobertura por inventario o suite verde.

## Fuente y revisión prioritaria

Scope `3cfc3564-ea06-53a7-9906-2e7287fdbb44`, Geografía Humana y Demografía, grado5/ciclo2/Académica/salidaHumanidades y Ciencias Sociales, PDF485–487/impresas484–486. Hay136registros;81anclas adaptables42C+36P+3A;20exclusiones:dos rótulos,un fragmento y17disposiciones privadas.21indicadores116–136 necesitan correspondencias explícitas.

1. Cálculos: fórmula,datos,unidades,período y sentido del resultado cuando se soliciten; nunca fórmula universal inventada deICV/IDH ni cifras actuales supuestas.
2. Mapas y organización territorial: ubicar,comparar,explicar o representar son evidencias distintas; macroregión/región/provincia y Yuma/Higuamo según selección, sin imponer todos los lugares.
3. Economía: conservarPIB yProducto Interno Neto (literal del indicador129),sectores,mercado,comercio,balanza,finanzas ytributos según textos/datos ficticios proporcionados; sin asesoría real ni vigencia legal supuesta. La preparación anterior decíaPNN:se corrige esa interpretación sin modificar el literal oficial.
4. Productos: informe/monografía/ensayo,mural O infografía y proyectos/campañas educativas según encargo; no imponer entrega,investigación,contacto o campaña real por un sustantivo.
5. Respeto,pertenencia yconvivencia se analizan como conceptos o intervenciones concretas solicitadas; no sentimientos,moralidad,datos familiares/migratorios reales. A59atribución,A103mapa/mural yA110aporteconcreto son observables condicionados. P91se conserva literal,adaptando protección/reducción de contaminación.

## Tareas

### Task 1: congelación133 y base verificable

**Archivos:** crear `apps/backend/src/modules/evaluation-instruments/catalog-v133.ts`; baselines privados `optative-hcs-social-five-base-133.json`, `english-compiled-133-frozen.cjs`, `english-common-133-baseline-before-134.json`.

**Interfaz:** produce payload133 exacto y motor compilado inmutable para todas las comparaciones posteriores. No modifica el release instalado.

- [x] Ejecutar una sola vez `.wrangler/secondary-completion/freeze-133.mjs`, ya preparado. Expected: fuente=compilado=Development;solo `optativeSocialModules/version` frente132;15176definiciones comunes capturadas.

### Task 2: contratos de propósito y correspondencias en RED

**Archivos:** crear `data/evaluation-instruments/optative-hcs-soc-five-contracts.json`, `docs/curriculum/cobertura-secundaria/optative-hcs-soc-5-correspondencias.json`, pruebas backend `optative-hcs-soc-five-contract.spec.ts`, frontend `optativeHcsSocFiveContract.spec.ts`; ampliar las pruebas existentes del servicio con el fixture.

**Interfaz:** produce descripciones,familias,evidencias exigidas/prohibidas y anclas que consumirá el proveedor. Releer las81anclas clasificadas y21indicadores, sin reclasificarlos.

- [x] Escribir casos de cálculo con fórmula/datos dados y explicación anafórica; selección/atribución;mapas;comparaciónPIB/Producto Interno Neto;investigación;informe con cálculos;alternativas de producto;legislación dada;simulación ypropuesta. Incluir negaciones,títulos incompatibles,acciones independientes yedición acotada.
- [x] Probar guardestricto grado/ciclo/código/modalidad/salida,manual/pending/20/17.35/paridad y servicio interpret/recommend. Expected: RED por proveedor5ausente;los guards ajenos pasan.

### Task 3: proveedor5 y evidencias propias en GREEN

**Archivos:** crear `packages/shared/src/secondary-optative-hcs-soc-5.ts` y,si las decisiones de evidencia lo justifican, `secondary-optative-demography-evidence.ts`; modificar `secondary-optative-social.ts`, `packages/shared/src/index.ts` y `catalog-current.ts`. Los consumidores backend/interpretación/frontend ya usan el proveedor social compartido: verificar cada uno.

**Interfaces:** `resolveOptativeSocialTask` mantiene contrato y guard; metadata5 implementa `OptativeSocialModule`; la función de evidencia,si se extrae,consume acción/tema ycallback existente para criterios autorados. Los campos de catálogo son serializables, sin tocar metadata4o releases antiguos. Catálogo134 añade solo el módulo5yversión.

- [x] Conectar metadata5y las familias necesarias. Evaluar el cálculo pedido, no organizar un producto inexistente; conservar fórmulas/datos/condiciones dados. Vincular explicación del resultado a su cálculo sin duplicarla, conservando acciones independientes.
- [x] Observar GREEN en contratos/backend/frontend/servicio. Expected:namespaceopt-hcs-soc-5,paridad yselecciones coherentes;480instrumentos deFilosofía y ámbitos anteriores exactos.

### Task 4: instrumentos completos y herramientas de fuente

**Archivos:** producir matriz,instrumentos yrevisión `optative-hcs-soc-5-*`; ampliar guardexplícito de fuente,QA,HTTP einventario solamente a5. PruebasNode existentes de fuente/inventario.

- [x] Generar y leer criterios,cinco progresiones,cuatro formatos,descriptores y puntuaciones de cada muestra;contrastarlas con anclas. Corregir fallos demostrados con RED/GREEN antes de registrar huellas. Expected:ningún instrumento generado pendiente de lectura;exclusiones20y21I explícitos.
- [x] Contrastar casos breves y variantes de mapas/cálculos/productos;no convertir81anclas en81temas independientes. Registrar límites de muestras.

### Task 5: gates y comparación histórica

- [x] Revisar diff/callers;detener árbol Worker verificado y comprobar procesos anteriores antes de compilar.
- [x] Ejecutar `pnpm --filter backend test`, backend build, frontend actividades/build y `pnpm cloudflare:build` dry-run; lints y controles de fuente/inventario/historia/precaché. Expected:0fallos;assetsJS completos ≤2MiB,todos precargados,sin elevar el límite. Repetir solo comprobaciones afectadas tras correcciones.
- [x] Comparar133congelado/DB,metadata4,480instrumentosFilosofía,15176Inglés común yotros ámbitos previos;fuente=compilado del bloque5. Expected:históricos exactos ycuatro formatos íntegros.

### Task 6: runtime Development y HTTP/DB

- [x] Arrancar el build final;verificar PG/Auth/Storage/frontend efectivos soloDevelopment ybytes deassets. Instalar exclusivamente catálogo134 yfuente individual136/20,con idempotencia yhuellas históricas. No reset/dbpush.
- [x] Reutilizar cursoQA ficticio5;ejecutar muestras representativas de cálculos,mapas,fuentes,productos y21I,cuatro formatos20/17.35,manual/pending,interpretación/recomendación,guardar/reabrir ysolo estrategia coninstrumento exacto. Expected:HTTP/DB coherentes yfilas anteriores intactas;medir tiempos.

### Task 7: sesión personal y persistencia

- [x] Reutilizar sesión deDevelopment ycursoQA5HCS separado,0cuentas/estudiantes nuevos,fingerprints originales. Verificar formulario vacío,estrategia automática/manual,cuatroformatos representativos,puntos/manual,guardar/reabrir ysolo estrategia exacta. Expected:UI yDB coinciden;no credenciales/correos/limpiezas o baselines anteriores sobrescritas. Si acceso externo bloquea,documentar yseguir trabajo independiente.

### Task 8: cierre y continuidad

- [ ] Cerrar informe,matriz/inventario ycontinuación con evidencia separada de fuente,tests,HTTP ybrowser. Revisión propia,UTF‑8/secretos/QA/respaldos/diff;commit español local yárbol/hash comprobados. NO PUSH. DespuésCiudadanía6→MT/CT yresto delencargo sinpreguntasrutinarias.

Verificación134:608instrumentos completos/608huellas/0pendientes;32HTTP/DB(incluidos21I),personal5 y9baselines anteriores exactos. Backend81518/176,frontendactividades80722/109 y5pruebas de conservaciónCacheStorage.4builds0 y2repetidos afectados0(CFdry-run),Node36/0másprecaché repetida1/0,lints0/16previas. Historia66/739exacta→67/772. Auditoría/commitlocales pendientes;NOPUSH. ContinuarCiudadanía6despuésdelcommit.
