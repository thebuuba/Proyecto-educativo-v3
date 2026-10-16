# Continuación: Ciencias de la Naturaleza común

Encargo activo: adjunto `3a8f59da-f60e-4c77-89e3-8f76dce81769/Texto pegado.txt`. Continuar1.º→6.º sin preguntas entre bloques y detenerse al consolidar Ciencias. Sin subagentes. Plan `docs/superpowers/plans/2026-10-16-ciencias-naturaleza-comun.md`.

## Bloques cerrados y Git

Rama `amplia-instrumentos-secundaria`, base inicial `adb5a30728cbec08016a014bc8c4c8f3f6f53cdc`.

- 1.º: `38bc31d29f3085579e786851823bc3aea70bb57a`, publicado. Tierra/Universo, PDF293–295,112registros,29temas/68consignas/272instrumentos, catálogo86.
- 2.º: `bad192bae40e435158137d19e3b83b73166ca4f1`, publicado. Ciencias de la Vida, PDF296–299,145registros,30temas/68consignas/272instrumentos, catálogo87.
- 3.º: este archivo acompaña su cierre; consultar Git/remoto para confirmar hash/push, no duplicarlos. Ciencias Físicas, PDF300–304/impresas299–303,207registros/7relaciones,50grupos/103consignas/412instrumentos. Catálogo88 instaladoCREATED→UNCHANGED y87 congelado. Fuente3 `MINERD_SECUNDARIA_2023_NAT_COMUN_G3_V1`, versión `3c6e1038-a19e-5d75-ae8f-ff8191ff7afd`, scope `096a33fc-0b8a-5ffc-9365-61f5cecfec9a`, idempotente. Sin esquema.

Informes y pruebas por grado: `docs/superpowers/reports/2026-10-16-ciencias-naturaleza-N{.md,-verificacion.json}`. Matriz, revisión y ejemplos completos en `docs/curriculum/cobertura-secundaria/ciencias-naturaleza-*`.

## Evidencia3.º

- Backend final42.543/104archivos; frontend focalizado1.932/2(paridad/scoring de1.º–3.º y17pruebas de ciclo); buildsbackend/frontend/Cloudflare aprobados tras corregir radar. Cloudflare únicamente dry-run. Última suite frontend completa:42.139/130 al cerrar2.º, sin atribuirla al código3.º. Logs/checks ignorados `grade-3-checks.json`.
- Se revisaron las evidencias/progresiones y transformaciones de cuatro formatos. Correcciones con casos rojos: medición/diseño/construcción sin imponer experimentos, gráficos femeninos, mezcla de luces frente a sustancias, soluciones no duplicadas, señales no significa señalar, circuito de apoyo no añade otra explicación, conservación no impone eficiencia, comparaciones científicas concretas, ondas longitudinales/transversales y radar/sonar. Radar usa ondas electromagnéticas, sonar mecánicas. No cambió el payload instalado ni se reescribieron instrumentos.
- HTTP/DBQA cuatro formatos guardados/reabiertos; recheck final `2026-10-16T19:33:01.122Z`,4regeneraciones/5controlessemánticos/FRAINGMAT/Ciencias1y2 aprobados. CuentaQA y contextos ignorados. NO repetir creaciones: `grade-3-http-progress.json`, resultado `grade-3-http.json`. Nuevo script archiva el recheck anterior y elimina el estado final antiguo al iniciar otro; nunca inferir aprobación solo porque exista un JSON previo.
- Navegador personalDevelopment cuatro formatos generados/editados/guardados/reabiertos con todos los campos idénticos. Rúbrica `d2d42e85-0e69-451c-90d9-916a3c8928bc`(6filas), cotejo `753cbbff-2b04-408c-9f42-b70d610c98a8`(2), escala `04fc0acb-efbc-486c-b71f-13d73ebac70b`(3), ponderada `18721be9-b265-43b5-a06b-138f7781831c`(3). También rúbrica/cotejo se reabrieron de solo lectura en assets finales tras el ajuste de radar. DB confirmó catálogo88/fuente3/scope3 e identidades para los cuatro. `.wrangler/science-source/grade-3-visual{,-db}.json` y captura en informe3.
- Cuatro controles visibles desde vacío, puntaje vacío,20/17.35 exactos, preparación silenciosa; completar conservó título compatible/puntos, añadir repuso solo el candidato faltante con confirmación de redistribución y agotamiento útil. INQUIRY fundamentada, sin forzar estrategia por cálculo/grupo. ManualCASE_STUDY conservó exactamente tabla/pesos; ponderada41/19/40→7.11/3.30/6.94.
- Huellas:20releases/89snapshots anteriores a3.º intactos, ahora21/97,8QA nuevos. Línea inicial18/73 intacta. Baseline individual desde2.º en `grade-N-history-before.json`. No se tocaron cuentas/borradores previos.

## Entorno, procesos y limitación real

Development exclusivo `eolgunypmtgrsyrjzcld`, PostgreSQL `app_backend_local` sin bypass, Auth/Storage200 y ViteDev. Entrada final `/assets/index-DlUYCCST.js` comprobada dist/HTTP/DOM, assets/`sw.js` porSHA256. No limpiar caché/almacenamiento. Variables/QA/respaldos y `.wrangler` ignorados; nunca imprimir secretos.

Servidor actual lanzador9536, listener3564 al comprobar; logs `grade-3-recovery-runtime-{out,err}.log`. Consultar cadena real antes de reiniciar, no dos servidores. Todos los tests/builds/HTTP del bloque terminaron. Detener solo cadena comprobada para recompilar: watchers pueden bloquear PDFs en Windows. `pnpm cloudflare:dev` validaDev y recompila.

Hubo timeout de contexto(center24.578ms), recomendaciones20–32s y un500 por timeout de conexiónPG. Recheck terminó aprobado con recuperación existente. Tras terminarlo se reinició solo Wrangler local y «Reintentar contexto» recuperó el creador. No aumentar timeouts ni declarar resuelta la causa: sigue latencia elevada. Node sololectura: primera conexión/consulta2612ms, siguiente151ms,1activa/6idle,sin bloqueos observados. Generación pura200muestras:p500.4882ms/p950.755ms, sinAuth/DB/HTTP/render. UI cotas30.032/29.209ms, no medidas exactas de render. Evitar superponer HTTP y navegador en próximos bloques para medir con menos concurrencia. No se auditó toda registración privadaSW.

Chrome1, pestaña1796703004, variablesCUA `scienceBrowser`/`scienceTab`. Última página:cotejo3 guardado/reabierto, sin cambios. `scienceThreeVisual` y archivos conservan evidencia. Leer documentaciónCUA al reanudar. No tocar borradores personales antiguos de Francés/Matemática.

## Siguiente acción concreta: 4.º

Confirmar Git/push del cierre3.º. Las fuentes4.º–6.º YA fueron inspeccionadas visualmente durante esperas, sin conectarlas ni instalarlas:

- 4.º Biología, PDF312–315/impresas311–314,192registros, scope original `2126f8f2-d70a-5c37-8542-f8d00957a51a`,NAT-BIO.
- 5.º Química, PDF316–318/impresas315–317,138registros, scope `259be83a-7b0a-5eb0-9d42-f4976fde6041`,NAT-QUI.
- 6.º Física, PDF319–322/impresas318–321,165registros, scope `01b2fa59-0542-551c-95df-8e3ffc4873ed`,NAT-FIS. Ohm está en321, conservar su antecedente parcial y sus snapshots.

P1–P6 son referencias a procesos de la primera página del grado, NOgrados. Se conservan erratas de indicadores literalmente; el encabezado/scope atribuye el componente. OptativasPDF499–517 excluidas. Inventario4.º–6.º NOes cobertura: la matriz los marcaNOT_IMPLEMENTED.

Empezar proveedor4.º/pruebas rojas desde los textos y páginas renderizadas; 4.º incluye célula/transporte/respiración/fotosíntesis/mitosis/meiosis, genética, evolución, sistemas humanos y ecología. No convertir actitudes, vida familiar o diagnósticos personales en evaluación. Reutilizar motor compartido; no imponer materiales, experimentos, fuentes o productos ausentes. Congelar88 con build vigente ANTES de avanzar89; nunca sobrescribir congelados/releases existentes.

Por grado: revisión científica de instrumentos completos→paridad/formato20/17.35/lifecycle/regresiones→fuente/release idempotentes→HTTP/DB y navegador cuatro formatos→informe/checks/diff/secretos/commit español/push normal. Continuar5.º/6.º sin preguntas, consolidar y detenerse. Si falla acceso, documentar y continuar tareas independientes sin fingir aprobación visual.

Scripts `run-science.mjs`: `review N`, `artifacts`, `source-catalog N --install`, `development install|context|history N`, `http N [--recheck]`. Helpers ignorados: `checks.mjs`(adaptar prefijo por grado), `verify-grade-visual.mjs N assignment catalog`, `publish-grade.mjs N`, `run-measure.mjs N`, `find-personal-science.mjs N`. Compilar shared/backend antes de helpersNode(NodeusaDIST, VitestSRC). Imports arriba. Artefactos ya reconocen todas las revisiones visuales, pero solo aprueban exclusiones generales porID explícito1.º–3.º; revisar los nuevos registros sin mapa, nunca convertirlos automáticamente en encabezados. EstadoVERIFIED requiere revisión de instrumentos, fuentes mapeadas y HTTP+4visuales.

Límites: soloDevelopment; sin producción/Hyperdrive/secretos, deploy, main, resets, force-push, borrado de datos previos, esquema remoto, copia de cuentas/datos, IA, dependencias, subagentes u otras asignaturas. Mantener editor vertical/selectores/modales, silencio, puntaje vacío, manuales/pesos, recuperación e identidad/snapshot. Son adaptacionesAulaBase, no rúbricasMINERD ni garantía de toda redacción.
