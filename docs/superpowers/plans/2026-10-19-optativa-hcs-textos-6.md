# Textos científicos y profesionales de 6.º HCS: plan de implementación

> Ejecución individual con `executing-plans`, TDD y revisión propia. El usuario prohíbe subagentes y pide continuar sin preguntas rutinarias.

**Objetivo:** conectar `OPT-HCS-LEN-6`, Análisis y Producción de Textos Científicos y Profesionales, con instrumentos completos pertinentes para sus cinco géneros y verificar el recorrido real en Development.

**Arquitectura:** metadata propia en `packages/shared/src/secondary-optative-hcs-len-6.ts`, registrada en `secondary-optative-language.ts`. Reutilizar composición por acción, recursos y procedimientos compartidos, formatos, puntuación, editor y persistencia. No heredar los requisitos personales o de envío de la carta común ni usar dimensiones narrativas como plantilla de CV, solicitudes, póster o ensayo.

**Tecnologías:** TypeScript, Vitest, pnpm, Vite/Cloudflare local y las herramientas existentes de catálogo/fuente/QA. Sin dependencias nuevas.

**Especificación:** `docs/superpowers/specs/2026-10-17-secundaria-pendiente-encargo.md`. Base `81c6d38cd8be81d1b185d237aefbc0e2ee4d036c`, HCS5 cerrado con árbol limpio y sin push. Rama `ampliacion-de-instrumentos-2`.

## Límites globales

- Solo AulaBase Development, `eolgunypmtgrsyrjzcld`. Producción, main, merges, despliegues, integraciones, permisos, cuentas nuevas, copias, borrados, reset, migraciones remotas y pushes quedan excluidos.
- Conservar fuentes literales, datos y cuentas. No modificar migraciones antiguas ni lanzar `db push`. No hace falta cambio de esquema.
- La puntuación sigue pendiente hasta elección del docente; mantener selección manual, diseño vertical y preparación interna sin banners.
- No tocar dist/Prisma mientras haya Worker propio, HTTP o instalador activo. Detener el árbol verificado antes de builds. Los bundles privados de análisis no modifican dist.
- Antes de cerrar: backend test/build, frontend build, cloudflare build en dry-run, frontend afectado, lints, fuente/inventario/historia y todos los assets precargados ≤2MiB.

## Fuente y decisiones

Fuente ya leída visualmente completa, PDF472–481 / impresas471–480. Scope `bd48332d-4af6-5d2d-a5cf-e3be5591436d`, 186registros:52C/72P/27A/21I/14competencias. Clasificación y relectura individual ya realizadas una vez:111anclas adaptables (44C/57P/10A),20encabezados,3notas de modalidad,15disposiciones privadas y2contextos condicionados. No repetir renders ni clasificadores. No equivalen a111temas.

Cinco géneros: currículum vitae, solicitud de beca, solicitud de empleo, póster científico y ensayo académico. C44+45 son una sola continuación de argumentos causales y de hechos: conservar ambas anclas. Las continuaciones de CV en473, beca en475, empleo en476 y póster en478 conservan su género. Los encabezados mixtos no cambian silenciosamente los procedimientos.

CV y solicitudes usan fichas ficticias, requisitos y referentes dados, sin certificados personales, contratación o elegibilidad reales. Orden cronológico, inverso o funcional según selección. El póster organiza y sintetiza información dada; su ensayo oral es práctica de presentación, no un ensayo académico. QR, vídeo, tablas, figuras, fuentes y soportes se incluyen solo cuando se piden. El ensayo vincula tesis, argumentos, evidencias y voces textuales sin una ideología correcta ni normas de cita inventadas. No exigir todos los tipos de argumento, citas o contraargumentos a la vez. La oralidad complementa lo escrito cuando corresponde y no fuerza entrevistas.

## Foco de revisión

- Leer/escuchar antes de analizar y acciones posteriores independientes: conservar género y propósito efectivo, sin tareas añadidas.
- Nominalizaciones, sustantivos, tiempos verbales y ensayo oral: evitar interpretar nombres como nuevas órdenes o géneros.
- Selección de información y registro: evaluar pertinencia y fidelidad de los datos ficticios, sin méritos o experiencias privadas.
- Alternativas entre órdenes, soportes, argumentos y recursos: no convertir OR en AND ni inventar una publicación externa.
- Revisión acotada y guardado: corregir lo pedido y conservar exactamente el instrumento al cambiar solo la estrategia.

## Tareas

1. [x] Congelar131 una vez contra el payload instalado antes de metadata132. `catalog-v131.ts`, baseline `optative-hcs-six-base-131.json`, bundle `english-compiled-131-frozen.cjs` y15.176definiciones inglesas antes132. Resultado real:idéntico a Development; solo `optativeLanguageModules/version` frente130. No repetir.
2. [x] Crear `data/evaluation-instruments/optative-hcs-len-six-contracts.json`, backend `optative-hcs-len-six-contract.spec.ts`, frontend `optativeHcsLenSixContract.spec.ts` y correspondencias. Cubrir111anclas y21indicadores con variantes por propósito, negaciones, alternativas, título incompatible, acciones independientes, guard,20/17.35/pending/manual y paridad. Ejecutar RED y leer las causas; no atribuir cobertura a los contratos.
3. [x] Crear metadata propia y registrar solamente HCS6. Catálogo132 y congelado131; actualizar aserciones de versión y herramientas explícitas de publicación/QA/HTTP/inventario. Reproducir antes de corregir las posibles pérdidas de «registra», «selecciona», «ensaya» y nombres de tiempos verbales. Extensiones pequeñas del compositor solo cuando el contrato o la lectura demuestren necesidad. Ejecutar GREEN.
4. [x] Generar instrumentos completos con la herramienta existente, leer criterios, cinco progresiones y todos los formatos/puntos. Revisar pertinencia real por género y cada correspondencia, corregir fallos con RED/GREEN y registrar huellas una vez. No convertir indicadores o disposiciones en tareas simultáneas.
5. [x] Comparar contra el motor131 y sus artefactos/snapshots. Detener Worker propio, ejecutar gates AGENTS y controles de assets/fuente/inventario/historia. Corregir cualquier exceso de precaché por empaquetado, sin elevar2MiB; 131 deja91.056bytes en el mayor asset y tiene metadata pura en chunk aparte.
6. [x] Arrancar y verificar localhost:8787 efectivo: PostgreSQL/Auth/Storage/frontend Development y assets del build. Instalar solo catálogo132 y fuente HCS6 individual revisada, idempotentes y con historia intacta. Preparar QA sin nuevas cuentas/estudiantes y ejecutar HTTP/DB representativo de cuatro formatos y20/17.35, fuente/exclusiones/paridad/manual/guardar/reabrir/estrategiaexacta, sin duplicar checkpoints.
7. [x] Recorrido personal con sesión existente y curso QA separado: título/descripción, estrategia visible/automática/manual, instrumento completo, puntos pendientes, cuatro formatos, manualidad, guardado/reapertura y cambio aislado de estrategia con hash exacto. No correos, credenciales, limpiezas o sobreescritura de baselines anteriores. Distinguir cualquier bloqueo real de lo comprobado.
8. [x] Actualizar informe/matriz/inventario/continuación, revisión propia, auditoría UTF-8/secretos/respaldos/QA y diff, commit español local. Mantener NO PUSH. Después continuar Filosofía HCS4→Demografía HCS5→Ciudadanía HCS6 y demás ámbitos autorizados sin detenerse por decisiones rutinarias.

Los archivos privados `prepare-hcs-six-next-plan.md` y `optative-hcs-scientific-six-preparation.md` contienen el mapa detallado de anclas. Las tres fuentes de Sociales HCS posteriores también quedaron clasificadas una vez durante HTTP131, sin implementación:59/81/47anclas adaptables respectivamente; no rehacerlas ni atribuirles cobertura.

Revisión intermedia:145contratos+5breves/600instrumentos. RED inicial1144backend y1144frontend;GREEN final1160backend/1171frontend y6904en8archivos funcionales. Lectura inicial195textos y148correspondencias;tras correcciones179textos finales,33nuevos o modificados releídos,150correspondencias finales y33paquetes de formatos/puntos revisados completos. Duplicados verbales, selección/registro, contexto comunicativo, anticipación, vocabulario, síntesis, citas/solicitado, contraargumentos, planes OR y revisión acotada corregidos con regresiones. Comparación132:15176definiciones de inglés común y ocho optativas previas idénticas. Aún no registrar cobertura runtime:localhost sigue131,fuente/QA/HTTP/personal6 pendientes.

Ruling: preparar y verificar el contexto personal separado mientras HTTP6 usa la escuela QA ficticia, después de instalación/guard132 terminados. Son escuelas, filas y actividades distintas;no hay builds ni instalador simultáneos. La historia final compara todas las huellas previas y distingue40muestrasQA de1personal. Así la latencia de HTTP no bloquea una prueba independiente autorizada.

Cierre132:600huellas/0pendientes,40HTTP/DB ypersonalQA6completo,64/669históricos exactos/final65/710. Backend79423/171archivos,frontendactividades78916/107,4builds0(CFdry-run),lints0/16previas,Node33/0,72JSprecargados/max2007650. final-checks-132.json y evidencias públicas. Auditoría/commitespañollocal pendientes inmediatos;NO PUSH. ContinuarFilosofía4 sinpreguntasrutinarias.
