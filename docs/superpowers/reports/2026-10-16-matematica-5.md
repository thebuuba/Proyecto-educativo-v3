# Matemática común — 5.º de secundaria

Catálogo evaluation-2026.83, rama amplia-instrumentos-secundaria. 19 temas y 59 consignas/variantes. Bloque automático y HTTP/DB verificado; alcance visual documentado en la nota del grado.

## Cobertura y pertinencia

Fuente MINERD 2023: PDF 231, 232 (impresa = PDF menos uno), SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Solo currículo común. Se inspeccionaron las tablas, indicadores y continuaciones. [Matriz por tema](../../curriculum/cobertura-secundaria/matematica-5-matriz.md) y [registros literales](../../curriculum/cobertura-secundaria/matematica-matriz.json).

Proveedores conectados: ecuación de la recta; circunferencia analítica; parábola y elementos; elipse y elementos; hipérbola y elementos; cónicas; vectores; matrices y operaciones; determinantes; matriz inversa; origen de la trigonometría; funciones trigonométricas; ley de los senos; ley de los cosenos; triángulos rectángulos; triángulos oblicuángulos; ángulos notables y especiales; gráficas trigonométricas; identidades trigonométricas pitagóricas. La fuente publicada por sí sola no acredita cobertura: se comprobaron acciones, criterios y formatos. Se revisaron las relaciones matemáticas y las evidencias de cada consigna, la progresión común de descriptores y su adaptación a los cuatro formatos. [236 instrumentos completos](../../curriculum/cobertura-secundaria/matematica-5-instrumentos.json). Son propuestas editables de AulaBase, no rúbricas oficiales del MINERD.

Se distingue comprensión del problema, procedimiento y resultado cuando se pide resolver; explicación, comprobación, representación, análisis de errores o investigación solo cuando corresponden. Los datos proceden de la consigna; no se inventa un problema, resultado, unidad, material ni producto. Se admiten métodos matemáticamente válidos. El cotejo separa las evidencias independientes previstas; rúbrica y escala tienen descriptores progresivos, y ponderada conserva los pesos de sus componentes. No se añaden estética, rapidez ni rasgos personales.

## Verificación

Los contratos ejercitan las consignas en cuatro formatos × 20/17.35, títulos neutrales/incompatibles, selección manual y paridad local/servicio. Los adaptadores verifican puntuación pendiente, exactitud en centésimas, completar solo huecos, añadir una evidencia ausente sin duplicados, agotamiento y rechazo explícito del criterio 21. Las regresiones compartidas mantienen conservar/adaptar/cancelar, textos/pesos manuales y descarte de respuestas obsoletas. Ver las cifras de suites y las precisiones propias del grado en la nota de revisión abajo.

Recorrido autenticado localhost:8787: cuatro formatos, edición, guardado, reapertura y cambio exclusivo de estrategia. Se compararon exactamente campos, pesos, snapshot, IDs y hash. La prueba usa datos ficticios identificables en el centro QA Development, no la sesión personal. Es HTTP/DB y ejecución de adaptadores reales, no clics de navegador. [Evidencia estructurada](../../curriculum/cobertura-secundaria/matematica-5-verificacion.json).

- pnpm --filter @aula/shared build: exit 0, 1.468 s.
- pnpm --filter backend build: exit 0, 5.123 s.
- pnpm --filter frontend build: exit 0, 12.427 s.
- pnpm cloudflare:build: exit 0, 16.884 s.

El build Cloudflare terminó en dry-run. No hubo despliegue. Continúan avisos conocidos de tamaño de chunks y de Node con comandos estáticos de Windows; jsdom avisa de scrollTo sin fallar.

Mediciones de esta pasada HTTP: interpretación 4405–6291 ms (4 peticiones); recomendación 4062–7613 ms (4 peticiones); escritura 5107–6958 ms (8 peticiones). Incluyen red, pool, base y servidor; no son tiempos SQL puros ni un cronómetro visual. No se promete latencia uniforme.

## Desarrollo e historia

PostgreSQL, Auth, Storage, variables públicas y assets servidos pertenecen exclusivamente a Development eolgunypmtgrsyrjzcld; SQL app_backend_local, sin BYPASSRLS. Las huellas de entry, chunks y sw.js coinciden con la compilación. No se modifica producción, su Hyperdrive, secretos o datos. No hay nuevas migraciones de esquema ni resets/merge/force push. Fuente MINERD_SECUNDARIA_2023_MAT_COMUN_V1 instalada previamente, no se reconstruyen cuentas ni se copian datos.

Instalación del catálogo: CREATED, después UNCHANGED; no se sobrescribe un release existente. Comparación histórica: 42 snapshots y 9 releases iniciales intactos, 24 snapshots QA y 7 releases adicionales acumulados. Se congela el catálogo anterior antes de continuar.

## Limitaciones y prueba manual

Se accedió visualmente con la cuenta propia de Development: selector inicial y puntos pendientes; formatos, ediciones y guardados concretos registrados en la evidencia visual y la nota del grado. No se extiende esa comprobación a pasos visuales no ejecutados.  No se afirma inspección de cachés/registros personales del service worker. No se borra almacenamiento ni borradores. Tras guardar cualquier edición abierta, probar una pestaña nueva de localhost:8787 con cuenta propia de Development: selector de estrategia visible y puntos vacíos, consigna de la matriz, instrumento completo, selección manual, 20 y 17.35, edición, añadir/completar cuando falte evidencia, guardar y reabrir. Cambiar solo estrategia debe conservar exactamente el instrumento. No reconectar a producción.

## Archivos y continuidad

Proveedor packages/shared/src/secondary-math-grade-5.ts; compositor secondary-math-common.ts; fixtures math-grade-5-contracts.json, contratos de ambos lados, catálogo actual y release previo congelado; matriz/instrumentos/evidencia y este informe. Scripts de QA compartidos bajo scripts/evaluation-instruments/math-*. Secretos, credenciales QA, respaldos y checkpoints permanecen ignorados. Diff y UTF-8 revisados antes del commit.

Commit en español y push normal a la rama actual por bloque. Los hashes se registran en el archivo de continuación después del commit para evitar autorreferencias. [Continuación](../../curriculum/cobertura-secundaria/matematica-continuacion.md). Detenerse al terminar 6.º, sin otra asignatura.

## Nota de revisión del grado

19 temas y 59 consignas/variantes, 236 instrumentos completos. Se contrastaron foco/directriz y distancias de las cónicas, correspondencias de lados/ángulos, ambigüedad de la ley de senos, dominio de identidades, dimensiones y orden del producto de matrices. La comprobación de identidades exige equivalencia en el dominio común, no un ejemplo numérico aislado. El encabezado Trigonometría no es un desempeño independiente. La repetición literal «sinusoides, sinusoides» se conserva en la fuente; no se inventa una corrección oficial.

Los contratos nuevos fallaron primero por ausencia de los proveedores. La revisión detectó y corrigió: sustantivo «la gráfica» interpretado como orden de graficar; separación de verbos coordinados que perdía «analiza» en «analiza y corrige los errores»; operaciones negadas; y título antiguo que imponía matrices sobre otra descripción. Se conservaron las dimensiones como objetivo explícito de las operaciones matriciales. Completar distingue un único título exacto de coincidencias ambiguas, sin sobrescribir la intención manual. Se actualizaron las regresiones antiguas de matrices a los IDs nuevos, conservando sus comprobaciones de contenido, dimensiones, condiciones, acciones y puntuación; la comprobación pedida se ofrece desde la propuesta inicial.

Backend completo: 99 archivos, 39.925 pruebas aprobadas. Frontend completo: 127 archivos, 40.413 aprobadas. Una ejecución anterior de frontend tuvo cuatro expectativas de IDs antiguos y un timeout de 5 s en Cursos; los IDs se actualizaron, Cursos pasó aislado y la repetición completa final pasó sin cambiar sus tiempos ni código. Los cuatro builds finales terminaron con exit 0.

Con la cuenta propia de Development se inspeccionaron los cuatro editores. En escala se probaron 20 y 17.35; se editó «Suficiente» del indicador 1, vació «Parcial» y ejecutó Completar criterio. Solo se rellenó el hueco y se conservó la edición manual. Cambiar únicamente estrategia a Estudio de caso mantuvo exactamente el instrumento. Escala guardada y reabierta: d0a41ac6-7f66-435b-9af3-0f53892b46fa; sus veinte campos coincidieron exactamente. Los demás guardados/reaperturas son HTTP/DB QA, no clics de guardado personales. Añadir una evidencia ausente se verificó con adaptadores/HTTP; su recorrido visual específico queda pendiente. Los cuatro borradores anteriores se conservaron.

El proceso local anterior terminó con ECONNRESET. Se comprobó ausencia de listener y procesos antes de iniciar un único servidor local nuevo (launcher22784, listener39904 en la comprobación). No se cambió de base ni configuración de producción. Runtime final: SQL/Auth/Storage/frontend exclusivamente Development, assets y sw.js coincidentes. Sigue existiendo variabilidad de red, separada de la pertinencia del instrumento.
