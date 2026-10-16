# Cierre de Matemática común — secundaria 1.º–6.º

Fecha: 16 de octubre de 2026, America/Santo_Domingo. Rama: amplia-instrumentos-secundaria. Catálogo efectivo en Development: evaluation-2026.84. Implementación curricular terminada hasta sexto; verificaciones automáticas y HTTP/DB separadas del alcance visual descrito abajo. No se comienza otra asignatura.

## Cobertura conectada y evidencias

| Grado | PDF oficial | Temas | Consignas/variantes | Instrumentos completos | Commit del bloque |
|---|---|---:|---:|---:|---|
| [1.º](2026-10-16-matematica-1.md) | 217–219 | 22 | 73 | 292 | 9ff519f7 |
| [2.º](2026-10-16-matematica-2.md) | 220–221 | 18 | 56 | 224 | 836bdf08 |
| [3.º](2026-10-16-matematica-3.md) | 222–223 | 16 | 53 | 212 | 31ad6685 |
| [4.º](2026-10-16-matematica-4.md) | 229–230 | 14 | 48 | 192 | 03a2c920 |
| [5.º](2026-10-16-matematica-5.md) | 231–232 | 19 | 59 | 236 | 94003f4a |
| [6.º](2026-10-16-matematica-6.md) | 233–235 | 22 | 72 | 288 | 31726de3 |
| Total | 14 páginas revisadas | 111 | 361 | 1.444 | Push normal por grado |

La numeración impresa es PDF menos uno. Fuente MINERD 2023 local: SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Se inspeccionaron visualmente tablas, indicadores y continuaciones, además de los registros extraídos. [Matriz estructurada](../../curriculum/cobertura-secundaria/matematica-matriz.json) y matrices por grado enlazan registros literales, páginas, familias, proveedor, evidencias y exclusiones. Solo quedan nueve encabezados taxonómicos sin proveedor independiente; todos los proveedores tienen fuente vinculada. No se atribuye a actitudes un desempeño matemático ni se agregan optativas.

1.º conecta numeración, finanzas iniciales, geometría/medidas y estadística/probabilidad; 2.º, patrones, álgebra inicial, planificación financiera, cuerpos/medidas y estadística; 3.º, polinomios/factorización/raíces, ecuaciones/funciones y estadística; 4.º, geometría y transformaciones, proporcionalidad/concurrencia/colinealidad, cuerpos y medidas/modelización; 5.º, cónicas, vectores/matrices y trigonometría; 6.º, álgebra, sucesiones/finanzas, complejos, trigonometría y límites/derivadas/integrales sencillas del currículo común. Los casos previos parciales de matrices/trigonometría y releases históricos se conservaron.

Los JSON matematica-N-instrumentos contienen rúbricas con descriptores progresivos, cotejos con evidencias independientes, escalas por grado observable y listas ponderadas con componentes y pesos. Son propuestas editables de AulaBase, no rúbricas oficiales del MINERD. Se revisaron instrumentos completos: acción y contenido solicitados, relación matemática, claridad de evidencias y progresión. No se acredita calidad solo por HTTP 200, inventario, sumas o número de filas. No se inventan valores, resultados, materiales ni productos para rellenar la consigna.

## Correcciones y conservación del flujo

El compositor compartido prioriza descripción, usa título como apoyo y reconoce acciones independientes, alternativas, negaciones y condiciones. Las regresiones incorporaron verbos habituales, errores de escritura y singulares/plurales. Se corrigieron falsos verbos en «figura dibujada», «la gráfica» y «pares ordenados», separación de verbos con objeto compartido y contaminación por el título antiguo. Se distingue procedimiento, resultado y razonamiento; métodos como límite o identidad no se convierten automáticamente en otra tarea.

Se preservan dimensiones y orden de operaciones matriciales, condiciones y casos especiales de cada tema, candidatos de raíces frente a certezas, dominio/periodicidad, constante de integración y relaciones geométricas pertinentes. No se fuerza ABP por contener un problema, ni rúbrica para cualquier propósito. Cambiar solo estrategia conserva exactamente el instrumento. La preparación automática sigue interna y silenciosa, con errores y recuperación útiles.

Formulario vertical, selector único inicial, puntos pendientes, 20/17.35 exactos, selecciones manuales, textos y pesos, conservar/adaptar/cancelar, respuestas obsoletas, completar solo huecos, añadir sin duplicados, agotamiento con opción manual y límite explícito de veinte criterios se mantienen. No hay truncamiento silencioso. Los instrumentos existentes no se reescriben con la nueva versión.

## Verificación final por tipo

- Automática: 361 consignas/variantes × cuatro formatos × dos totales, títulos neutrales/incompatibles, acciones requeridas y contenido propio de cada grado, paridad local/servicio y adaptadores de edición. Además hay regresiones específicas negativas/alternativas/manuales y de Lengua Española, Inglés y Francés. Backend final: 99 archivos/40.507 pruebas; frontend final: 127 archivos/40.990 pruebas, ambos exit 0.
- Builds finales: shared, backend, frontend y pnpm cloudflare:build, todos exit 0. Tiempos del bloque final: 2.147, 9.798, 12.844 y 18.504 s. Cloudflare terminó con --dry-run: exiting now, sin despliegue. Siguen avisos conocidos de chunks, scrollTo de jsdom y Node con argumentos estáticos en Windows.
- HTTP/DB: 24 actividades ficticias (cuatro formatos por grado), contexto autenticado y fuente correctos, edición, guardado, reapertura, igualdad exacta de campos/pesos y hash al cambiar solo estrategia. Los adaptadores reales cubren puntos pendientes, completar/añadir, agotamiento y límites. El --recheck final reabrió las cuatro de sexto y verificó Francés1/Inglés2 sin crear actividades nuevas.
- Navegador personal: cuatro borradores previos conservados; datos QA identificables y detalles concretos en cada informe. 2.º: rúbrica editada/guardada/reabierta. 3.º: cuatro editores, completar y ponderada editada/guardada/reabierta. 4.º: cuatro editores y cotejo con texto/puntos manuales guardado/reabierto. 5.º: cuatro editores, completar descriptor vacío conservando manual y escala guardada/reabierta. 6.º: cuatro editores; recuperar criterio con redistribución confirmada, agotamiento, completar conservador y ponderada manual guardada/reabierta; nueve campos exactos. Las cifras HTTP no se presentan como clics visuales.

Prueba visual básica posterior de 1.º completada con .84: cuatro editores, puntuación inicialmente vacía, 20/17.35, edición manual, estrategia sin alterar instrumento y ponderada guardada/reabierta con nueve campos exactos. Actividad90c3a716-8fa4-4dd3-ac10-42ad8c3e1aee. Añadir/completar de1.º está comprobado por adaptadores/HTTP, no clics de esta prueba. No se afirma persistencia visual personal de todos los formatos de cada grado ni de todas las 361 consignas. Las 24 persistencias de formatos son HTTP/DB. No se inspeccionaron registros/cachés privados del service worker ni se borró almacenamiento.

## Rendimiento y entorno efectivo

Los informes por grado conservan las mediciones de las pasadas HTTP. En sexto, interpretación 5.018–8.147 ms, recomendación 4.991–7.554 ms y escritura 5.216–7.108 ms antes de la relectura. Incluyen red, pool, servidor y base; no son cronómetro visual ni tiempo SQL puro. La detección local evita una interpretación remota redundante, pero no elimina esas latencias externas.

localhost:8787 usa exclusivamente AulaBase Development eolgunypmtgrsyrjzcld: SQL app_backend_local sin BYPASSRLS, Auth, Storage y variables públicas del frontend. Assets de entrada, chunks y sw.js servidos coinciden por hash con el build final. El launcher valida el destino antes de arrancar. No se reconectó a producción.

Se observaron cierres locales por ENOTFOUND/ECONNRESET y pérdida del observador de assets por EBUSY al recompilar, con 404 transitorio. Se comprobaron procesos/listener antes de cada recuperación y se reinició una sola instancia local. El último servidor comprobado es launcher24192/listener41552. No se cambió DNS, no se ocultó el problema con timeouts ni se multiplicaron procesos. El fallo HTTP inicial de sexto ocurrió antes de cualquier escritura. Los checkpoints permiten reconciliar un ID antes de repetir una escritura.

[Evidencia final estructurada](../../curriculum/cobertura-secundaria/matematica-cierre-verificacion.json).

## Datos, archivos y Git

Fuente instalada solo en Development: MINERD_SECUNDARIA_2023_MAT_COMUN_V1, versión5158ed7a-7297-5a1b-b624-6a2984e9f44c, 427 registros/42 relaciones/seis ámbitos. Catálogos .79–.84 instalados individualmente con resultado CREATED/UNCHANGED; releases anteriores congelados y comparados sin sobrescritura. No hubo migraciones remotas de esquema, resets, copias de usuarios, cambios de contraseña ni reconstrucción de proyectos.

Última comparación histórica: 42 snapshots y nueve releases iniciales íntegros; 30 snapshots QA nuevos (24 HTTP y seis visuales) y ocho releases nuevos acumulados. Los instaladores además verificaron todos los releases/snapshots existentes antes de cada bloque.

Archivos principales: seis proveedores secondary-math-grade-N.ts, compositor secondary-math-common.ts, conexión en motor/servicio y alternativa local/sugerencias, catálogos congelados, contratos y fixtures, scripts math-*, matrices, instrumentos completos, informes por grado y continuación. No se añadieron dependencias ni IA a la aplicación. Secretos, .dev.vars.local, credenciales/contextos QA, respaldos y checkpoints permanecen excluidos de Git; escaneo de valores sensibles y UTF-8 sin hallazgos antes de cada commit.

Todos los bloques de grado tienen commit en español y push normal a amplia-instrumentos-secundaria. El commit documental de cierre registra hashes y estado final sin autorreferencia. [Continuación](../../curriculum/cobertura-secundaria/matematica-continuacion.md). Sin merge con main, force push, producción, Hyperdrive/secrets remotos ni despliegue. Detenerse después de este cierre.
