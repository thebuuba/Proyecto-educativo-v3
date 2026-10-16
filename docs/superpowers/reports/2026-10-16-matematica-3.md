# Matemática común — 3.º de secundaria

Catálogo evaluation-2026.81, rama amplia-instrumentos-secundaria. 16 temas y 53 consignas/variantes. Bloque automático y HTTP/DB verificado; prueba visual pendiente.

## Cobertura y pertinencia

Fuente MINERD 2023: PDF 222, 223 (impresa = PDF menos uno), SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Solo currículo común. Se inspeccionaron las tablas, indicadores y continuaciones. [Matriz por tema](../../curriculum/cobertura-secundaria/matematica-3-matriz.md) y [registros literales](../../curriculum/cobertura-secundaria/matematica-matriz.json).

Proveedores conectados: polinomios y operaciones; productos y cocientes notables; factorización; conectivos lógicos y Venn-Euler; raíces y factores; teorema de los ceros racionales; regla de los signos de Descartes; regla de Ruffini; ecuaciones de primer y segundo grado; ecuaciones e inecuaciones lineales; sistemas lineales de dos incógnitas; funciones algebraicas, exponenciales y logarítmicas; valor absoluto; datos agrupados y frecuencias; medidas de dispersión; diagramas de árbol y probabilidad. La fuente publicada por sí sola no acredita cobertura: se comprobaron acciones, criterios y formatos. Se revisaron las relaciones matemáticas y las evidencias de cada consigna, la progresión común de descriptores y su adaptación a los cuatro formatos. [212 instrumentos completos](../../curriculum/cobertura-secundaria/matematica-3-instrumentos.json). Son propuestas editables de AulaBase, no rúbricas oficiales del MINERD.

Se distingue comprensión del problema, procedimiento y resultado cuando se pide resolver; explicación, comprobación, representación, análisis de errores o investigación solo cuando corresponden. Los datos proceden de la consigna; no se inventa un problema, resultado, unidad, material ni producto. Se admiten métodos matemáticamente válidos. El cotejo separa las evidencias independientes previstas; rúbrica y escala tienen descriptores progresivos, y ponderada conserva los pesos de sus componentes. No se añaden estética, rapidez ni rasgos personales.

## Verificación

Los contratos ejercitan las consignas en cuatro formatos × 20/17.35, títulos neutrales/incompatibles, selección manual y paridad local/servicio. Los adaptadores verifican puntuación pendiente, exactitud en centésimas, completar solo huecos, añadir una evidencia ausente sin duplicados, agotamiento y rechazo explícito del criterio 21. Las regresiones compartidas mantienen conservar/adaptar/cancelar, textos/pesos manuales y descarte de respuestas obsoletas. Ver las cifras de suites y las precisiones propias del grado en la nota de revisión abajo.

Recorrido autenticado localhost:8787: cuatro formatos, edición, guardado, reapertura y cambio exclusivo de estrategia. Se compararon exactamente campos, pesos, snapshot, IDs y hash. La prueba usa datos ficticios identificables en el centro QA Development, no la sesión personal. Es HTTP/DB y ejecución de adaptadores reales, no clics de navegador. [Evidencia estructurada](../../curriculum/cobertura-secundaria/matematica-3-verificacion.json).

- pnpm --filter @aula/shared build: exit 0, 1.748 s.
- pnpm --filter backend build: exit 0, 4.859 s.
- pnpm --filter frontend build: exit 0, 13.456 s.
- pnpm cloudflare:build: exit 0, 41.327 s.

El build Cloudflare terminó en dry-run. No hubo despliegue. Continúan avisos conocidos de tamaño de chunks y de Node con comandos estáticos de Windows; jsdom avisa de scrollTo sin fallar.

Mediciones de esta pasada HTTP: interpretación 3125–4507 ms (4 peticiones); recomendación 2604–5603 ms (4 peticiones); escritura 2184–4083 ms (8 peticiones). Incluyen red, pool, base y servidor; no son tiempos SQL puros ni un cronómetro visual. No se promete latencia uniforme.

## Desarrollo e historia

PostgreSQL, Auth, Storage, variables públicas y assets servidos pertenecen exclusivamente a Development eolgunypmtgrsyrjzcld; SQL app_backend_local, sin BYPASSRLS. Las huellas de entry, chunks y sw.js coinciden con la compilación. No se modifica producción, su Hyperdrive, secretos o datos. No hay nuevas migraciones de esquema ni resets/merge/force push. Fuente MINERD_SECUNDARIA_2023_MAT_COMUN_V1 instalada previamente, no se reconstruyen cuentas ni se copian datos.

Instalación del catálogo: CREATED, después UNCHANGED; no se sobrescribe un release existente. Comparación histórica: 42 snapshots y 9 releases iniciales intactos, 14 snapshots QA y 5 releases adicionales acumulados. Se congela el catálogo anterior antes de continuar.

## Limitaciones y prueba manual

Se accedió visualmente con la cuenta propia de Development: selector inicial y puntos pendientes; formatos, ediciones y guardados concretos registrados en la evidencia visual y la nota del grado. No se extiende esa comprobación a pasos visuales no ejecutados.  No se afirma inspección de cachés/registros personales del service worker. No se borra almacenamiento ni borradores. Tras guardar cualquier edición abierta, probar una pestaña nueva de localhost:8787 con cuenta propia de Development: selector de estrategia visible y puntos vacíos, consigna de la matriz, instrumento completo, selección manual, 20 y 17.35, edición, añadir/completar cuando falte evidencia, guardar y reabrir. Cambiar solo estrategia debe conservar exactamente el instrumento. No reconectar a producción.

## Archivos y continuidad

Proveedor packages/shared/src/secondary-math-grade-3.ts; compositor secondary-math-common.ts; fixtures math-grade-3-contracts.json, contratos de ambos lados, catálogo actual y release previo congelado; matriz/instrumentos/evidencia y este informe. Scripts de QA compartidos bajo scripts/evaluation-instruments/math-*. Secretos, credenciales QA, respaldos y checkpoints permanecen ignorados. Diff y UTF-8 revisados antes del commit.

Commit en español y push normal a la rama actual por bloque. Los hashes se registran en el archivo de continuación después del commit para evitar autorreferencias. [Continuación](../../curriculum/cobertura-secundaria/matematica-continuacion.md). Detenerse al terminar 6.º, sin otra asignatura.

## Nota de revisión del grado

Focalizadas matemáticas: 1.488 backend y 1.459 frontend (grados 1–3); completas finales: 39.062 backend y 39.555 frontend. La primera suite frontend tuvo un timeout de 5 segundos en un test de Cursos; pasó el archivo aislado (4/4) y la repetición completa (127 archivos), sin cambios en Cursos ni aumento de timeout. Todos los builds requeridos exit 0.

Se conservaron literalmente las erratas y la fórmula ausente del apartado e) de factorización; no se inventó ese trinomio. Se conectan factor común/agrupación, diferencia de cuadrados, trinomio cuadrado perfecto, suma/diferencia de cubos y el caso que indique el docente, sin exigir uno solo cuando hay otros válidos. Ruffini conserva posiciones y coeficientes nulos; candidatos de ceros racionales requieren verificación; Descartes expresa posibilidades, no un número exacto garantizado. Dominio y rango no se confunden con rango estadístico, y el cotejo separa esas dos evidencias. La varianza no impone un divisor de población o muestra que la consigna no indique. La revisión detectó Descartes activando innecesariamente factores y la suma de cubos perdiendo la diferencia de cubos; se reprodujeron con pruebas rojas y se corrigieron antes de instalar `.81`.

Navegador real, cuenta propia de Development: actividad ficticia `f2e8070c-5c1f-42c7-9fa8-150a60c76159`. Se observaron rúbrica, cotejo (cuatro evidencias con ambos resultados separados), escala por grado y ponderada sobre una consigna de factorización con explicación. Se editó la ponderada, pesos 36.38/36.35/27.27 (100 exactos), un texto manual y un indicador vacío. Completar rechazó primero el objetivo manual ambiguo con un aviso útil; al usar correspondencia clara completó solo el indicador vacío y conservó el texto de otra fila y los pesos. Cambio a Estudio de caso con igualdad de tabla/campos DOM. Se guardó y reabrió la ponderada, comparando todos sus campos exactamente, con 17.35. Los otros tres formatos se guardaron/reabrieron por HTTP/DB en el centro QA; visualmente se comprobaron sus editores, sin afirmar tres guardados personales adicionales. Captura local `.wrangler/math-source/grade-3-visual.png`, fuera de Git. Borradores anteriores intactos.

Historia acumulada: 42 snapshots y nueve releases originales intactos; doce snapshots HTTP QA, dos visuales y cinco releases adicionales desde el inicio matemático. La instalación `.81` dio CREATED/UNCHANGED y `.80` se congeló antes del cambio. Sin migraciones remotas ni despliegues.
