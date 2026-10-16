# Matemática común — 6.º de secundaria

Catálogo evaluation-2026.84, rama amplia-instrumentos-secundaria. 22 temas y 72 consignas/variantes. Bloque automático y HTTP/DB verificado; alcance visual documentado en la nota del grado.

## Cobertura y pertinencia

Fuente MINERD 2023: PDF 233, 234, 235 (impresa = PDF menos uno), SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Solo currículo común. Se inspeccionaron las tablas, indicadores y continuaciones. [Matriz por tema](../../curriculum/cobertura-secundaria/matematica-6-matriz.md) y [registros literales](../../curriculum/cobertura-secundaria/matematica-matriz.json).

Proveedores conectados: teorema fundamental del álgebra; ecuaciones exponenciales; ecuaciones logarítmicas; inecuaciones cuadráticas; sistemas de ecuaciones cuadráticas; sistemas de inecuaciones cuadráticas; sucesiones y progresiones; sucesiones aritméticas; sucesiones geométricas; interés simple y compuesto; valor actual; tarjeta de crédito y saldos; números complejos; suma y diferencia de ángulos; ángulo doble; ángulo triple; ángulo mitad; ecuaciones trigonométricas; identidades trigonométricas; límites de funciones y sucesiones; derivadas sencillas; integrales sencillas. La fuente publicada por sí sola no acredita cobertura: se comprobaron acciones, criterios y formatos. Se revisaron las relaciones matemáticas y las evidencias de cada consigna, la progresión común de descriptores y su adaptación a los cuatro formatos. [288 instrumentos completos](../../curriculum/cobertura-secundaria/matematica-6-instrumentos.json). Son propuestas editables de AulaBase, no rúbricas oficiales del MINERD.

Se distingue comprensión del problema, procedimiento y resultado cuando se pide resolver; explicación, comprobación, representación, análisis de errores o investigación solo cuando corresponden. Los datos proceden de la consigna; no se inventa un problema, resultado, unidad, material ni producto. Se admiten métodos matemáticamente válidos. El cotejo separa las evidencias independientes previstas; rúbrica y escala tienen descriptores progresivos, y ponderada conserva los pesos de sus componentes. No se añaden estética, rapidez ni rasgos personales.

## Verificación

Los contratos ejercitan las consignas en cuatro formatos × 20/17.35, títulos neutrales/incompatibles, selección manual y paridad local/servicio. Los adaptadores verifican puntuación pendiente, exactitud en centésimas, completar solo huecos, añadir una evidencia ausente sin duplicados, agotamiento y rechazo explícito del criterio 21. Las regresiones compartidas mantienen conservar/adaptar/cancelar, textos/pesos manuales y descarte de respuestas obsoletas. Ver las cifras de suites y las precisiones propias del grado en la nota de revisión abajo.

Recorrido autenticado localhost:8787: cuatro formatos, edición, guardado, reapertura y cambio exclusivo de estrategia. Se compararon exactamente campos, pesos, snapshot, IDs y hash. La prueba usa datos ficticios identificables en el centro QA Development, no la sesión personal. Es HTTP/DB y ejecución de adaptadores reales, no clics de navegador. [Evidencia estructurada](../../curriculum/cobertura-secundaria/matematica-6-verificacion.json).

- pnpm --filter @aula/shared build: exit 0, 2.147 s.
- pnpm --filter backend build: exit 0, 9.798 s.
- pnpm --filter frontend build: exit 0, 12.844 s.
- pnpm cloudflare:build: exit 0, 18.504 s.

El build Cloudflare terminó en dry-run. No hubo despliegue. Continúan avisos conocidos de tamaño de chunks y de Node con comandos estáticos de Windows; jsdom avisa de scrollTo sin fallar.

Mediciones de esta pasada HTTP: interpretación 5018–8147 ms (4 peticiones); recomendación 4991–7554 ms (4 peticiones); escritura 5216–7108 ms (8 peticiones). Incluyen red, pool, base y servidor; no son tiempos SQL puros ni un cronómetro visual. No se promete latencia uniforme.

## Desarrollo e historia

PostgreSQL, Auth, Storage, variables públicas y assets servidos pertenecen exclusivamente a Development eolgunypmtgrsyrjzcld; SQL app_backend_local, sin BYPASSRLS. Las huellas de entry, chunks y sw.js coinciden con la compilación. No se modifica producción, su Hyperdrive, secretos o datos. No hay nuevas migraciones de esquema ni resets/merge/force push. Fuente MINERD_SECUNDARIA_2023_MAT_COMUN_V1 instalada previamente, no se reconstruyen cuentas ni se copian datos.

Instalación del catálogo: CREATED, después UNCHANGED; no se sobrescribe un release existente. Comparación histórica: 42 snapshots y 9 releases iniciales intactos, 29 snapshots QA y 8 releases adicionales acumulados. Se congela el catálogo anterior antes de continuar.

## Limitaciones y prueba manual

Se accedió visualmente con la cuenta propia de Development: selector inicial y puntos pendientes; formatos, ediciones y guardados concretos registrados en la evidencia visual y la nota del grado. No se extiende esa comprobación a pasos visuales no ejecutados.  No se afirma inspección de cachés/registros personales del service worker. No se borra almacenamiento ni borradores. Tras guardar cualquier edición abierta, probar una pestaña nueva de localhost:8787 con cuenta propia de Development: selector de estrategia visible y puntos vacíos, consigna de la matriz, instrumento completo, selección manual, 20 y 17.35, edición, añadir/completar cuando falte evidencia, guardar y reabrir. Cambiar solo estrategia debe conservar exactamente el instrumento. No reconectar a producción.

## Archivos y continuidad

Proveedor packages/shared/src/secondary-math-grade-6.ts; compositor secondary-math-common.ts; fixtures math-grade-6-contracts.json, contratos de ambos lados, catálogo actual y release previo congelado; matriz/instrumentos/evidencia y este informe. Scripts de QA compartidos bajo scripts/evaluation-instruments/math-*. Secretos, credenciales QA, respaldos y checkpoints permanecen ignorados. Diff y UTF-8 revisados antes del commit.

Commit en español y push normal a la rama actual por bloque. Los hashes se registran en el archivo de continuación después del commit para evitar autorreferencias. [Continuación](../../curriculum/cobertura-secundaria/matematica-continuacion.md). Detenerse al terminar 6.º, sin otra asignatura.

## Nota de revisión del grado

22 temas y 72 consignas/variantes, 288 instrumentos completos. Se revisaron los contenidos comunes de PDF233–235 y su continuación: raíces complejas con multiplicidad; dominios exponencial/logarítmico; intervalos y fronteras de inecuaciones; simultaneidad en sistemas; diferencias/razones de sucesiones; régimen y base temporal de intereses; valor actual y saldos; formas complejas; signos/dominio/periodicidad trigonométricos; límites, derivadas e integrales sencillas. No se añadieron optativas ni cálculo avanzado. No quedan conceptos o procedimientos sin correspondencia en este grado. La continuación «ecuaciones exponenciales y logarítmicas» se enlaza literalmente con ambos proveedores.

Las pruebas fallaron primero por ausencia de los proveedores. Las regresiones corrigieron el reconocimiento singular/plural de exponencial/integral y los verbos deriva/integra; las acciones cognitivas no imponen calcular por mencionar «cálculo». «Pares ordenados» no exige ordenar números. Se distinguen métodos y productos: derivada mediante límite y ecuación mediante identidad no añaden otra tarea independiente. Las sucesiones aritméticas y geométricas sobreviven en ambos órdenes de redacción. El cotejo separa resultados simple/compuesto, definida/indefinida, formas complejas y tipos de ecuaciones cuando se piden conjuntamente. Las alternativas y negaciones no obligan a resolver ambas ramas ni a efectuar operaciones negadas.

Backend final completo: 99 archivos y 40.507 pruebas aprobadas; frontend final completo: 127 archivos y 40.990 aprobadas. Los cuatro builds finales terminaron con exit 0 después del último ajuste de formas complejas. Se revisaron criterios y descriptores completos, no solo sumas: dominio común en identidades, argumentos logarítmicos positivos, argumento no definido del complejo cero, constante de integración, acumulación con signo y casos sin límite/solución única.

Cuatro formatos HTTP/DB QA: guardado, reapertura, campos/pesos exactos y cambio exclusivo de estrategia con hash idéntico. La relectura final --recheck abrió las cuatro actividades existentes sin escrituras nuevas, generó propuestas con .84 y verificó regresiones HTTP de Francés1 e Inglés2; Lengua Española y demás regresiones están incluidas en las suites completas.

Visual con la cuenta propia de Development: estrategia visible inicialmente y puntos vacíos; rúbrica, cotejo (dos resultados separados), escala y ponderada inspeccionados. En ponderada se retiró una fila del borrador ficticio nuevo y se recuperó con Agregar criterio, previa confirmación explícita de redistribución. Otra solicitud mostró el aviso de agotamiento y la opción manual, sin añadir duplicados. Completar rellenó únicamente el indicador vacío y conservó el texto del criterio 3 y pesos 36.38/36.35/27.27. Se probaron 20 y 17.35. Cambiar solo estrategia a Estudio de caso dejó la tabla exactamente igual. Actividad e975422b-c3ec-4f25-b118-923f06612e5f guardada/reabierta: nueve campos exactos. Los otros tres formatos tienen persistencia HTTP/DB, no guardado visual personal. Los cuatro borradores anteriores permanecen intactos.

La recarga en caliente perdió el observador de assets con EBUSY y devolvió 404 para /actividades; se comprobó la cadena local antes de reiniciarla. Otra ejecución terminó por ENOTFOUND del pooler antes de escribir actividades (checkpoint sin escrituras). Tras comprobar DNS disponible y ausencia de listener/procesos, se inició una única instancia local (launcher24192, listener41552). Se reanudó el guion sin duplicar datos. Runtime final: SQL/Auth/Storage/frontend Development y hashes de assets/sw.js coincidentes. Estas incidencias de red/observación no se presentan como resueltas definitivamente ni se ocultaron modificando timeouts, DNS o producción.
