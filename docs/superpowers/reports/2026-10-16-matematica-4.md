# Matemática común — 4.º de secundaria

Catálogo evaluation-2026.82, rama amplia-instrumentos-secundaria. 14 temas y 48 consignas/variantes. Bloque automático y HTTP/DB verificado; alcance visual documentado en la nota del grado.

## Cobertura y pertinencia

Fuente MINERD 2023: PDF 229, 230 (impresa = PDF menos uno), SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Solo currículo común. Se inspeccionaron las tablas, indicadores y continuaciones. [Matriz por tema](../../curriculum/cobertura-secundaria/matematica-4-matriz.md) y [registros literales](../../curriculum/cobertura-secundaria/matematica-matriz.json).

Proveedores conectados: ángulos y medición; rectas y postulados; polígonos y diagonales; triángulos y propiedades; congruencia y criterios LLL, LAL, ALA; teorema de Thales; teorema de Menelao; teorema de Ceva; circunferencia y elementos; poliedros y volumen; cuerpos truncados; transformaciones geométricas; sistemas de medida y conversiones; modelización de embalse. La fuente publicada por sí sola no acredita cobertura: se comprobaron acciones, criterios y formatos. Se revisaron las relaciones matemáticas y las evidencias de cada consigna, la progresión común de descriptores y su adaptación a los cuatro formatos. [192 instrumentos completos](../../curriculum/cobertura-secundaria/matematica-4-instrumentos.json). Son propuestas editables de AulaBase, no rúbricas oficiales del MINERD.

Se distingue comprensión del problema, procedimiento y resultado cuando se pide resolver; explicación, comprobación, representación, análisis de errores o investigación solo cuando corresponden. Los datos proceden de la consigna; no se inventa un problema, resultado, unidad, material ni producto. Se admiten métodos matemáticamente válidos. El cotejo separa las evidencias independientes previstas; rúbrica y escala tienen descriptores progresivos, y ponderada conserva los pesos de sus componentes. No se añaden estética, rapidez ni rasgos personales.

## Verificación

Los contratos ejercitan las consignas en cuatro formatos × 20/17.35, títulos neutrales/incompatibles, selección manual y paridad local/servicio. Los adaptadores verifican puntuación pendiente, exactitud en centésimas, completar solo huecos, añadir una evidencia ausente sin duplicados, agotamiento y rechazo explícito del criterio 21. Las regresiones compartidas mantienen conservar/adaptar/cancelar, textos/pesos manuales y descarte de respuestas obsoletas. Ver las cifras de suites y las precisiones propias del grado en la nota de revisión abajo.

Recorrido autenticado localhost:8787: cuatro formatos, edición, guardado, reapertura y cambio exclusivo de estrategia. Se compararon exactamente campos, pesos, snapshot, IDs y hash. La prueba usa datos ficticios identificables en el centro QA Development, no la sesión personal. Es HTTP/DB y ejecución de adaptadores reales, no clics de navegador. [Evidencia estructurada](../../curriculum/cobertura-secundaria/matematica-4-verificacion.json).

- pnpm --filter @aula/shared build: exit 0, 1.7 s.
- pnpm --filter backend build: exit 0, 4.972 s.
- pnpm --filter frontend build: exit 0, 12.919 s.
- pnpm cloudflare:build: exit 0, 22.365 s.

El build Cloudflare terminó en dry-run. No hubo despliegue. Continúan avisos conocidos de tamaño de chunks y de Node con comandos estáticos de Windows; jsdom avisa de scrollTo sin fallar.

Mediciones de esta pasada HTTP: interpretación 4380–6660 ms (4 peticiones); recomendación 4933–7871 ms (4 peticiones); escritura 4717–7175 ms (8 peticiones). Incluyen red, pool, base y servidor; no son tiempos SQL puros ni un cronómetro visual. No se promete latencia uniforme.

## Desarrollo e historia

PostgreSQL, Auth, Storage, variables públicas y assets servidos pertenecen exclusivamente a Development eolgunypmtgrsyrjzcld; SQL app_backend_local, sin BYPASSRLS. Las huellas de entry, chunks y sw.js coinciden con la compilación. No se modifica producción, su Hyperdrive, secretos o datos. No hay nuevas migraciones de esquema ni resets/merge/force push. Fuente MINERD_SECUNDARIA_2023_MAT_COMUN_V1 instalada previamente, no se reconstruyen cuentas ni se copian datos.

Instalación del catálogo: CREATED, después UNCHANGED; no se sobrescribe un release existente. Comparación histórica: 42 snapshots y 9 releases iniciales intactos, 19 snapshots QA y 6 releases adicionales acumulados. Se congela el catálogo anterior antes de continuar.

## Limitaciones y prueba manual

Se accedió visualmente con la cuenta propia de Development: selector inicial y puntos pendientes; formatos, ediciones y guardados concretos registrados en la evidencia visual y la nota del grado. No se extiende esa comprobación a pasos visuales no ejecutados.  No se afirma inspección de cachés/registros personales del service worker. No se borra almacenamiento ni borradores. Tras guardar cualquier edición abierta, probar una pestaña nueva de localhost:8787 con cuenta propia de Development: selector de estrategia visible y puntos vacíos, consigna de la matriz, instrumento completo, selección manual, 20 y 17.35, edición, añadir/completar cuando falte evidencia, guardar y reabrir. Cambiar solo estrategia debe conservar exactamente el instrumento. No reconectar a producción.

## Archivos y continuidad

Proveedor packages/shared/src/secondary-math-grade-4.ts; compositor secondary-math-common.ts; fixtures math-grade-4-contracts.json, contratos de ambos lados, catálogo actual y release previo congelado; matriz/instrumentos/evidencia y este informe. Scripts de QA compartidos bajo scripts/evaluation-instruments/math-*. Secretos, credenciales QA, respaldos y checkpoints permanecen ignorados. Diff y UTF-8 revisados antes del commit.

Commit en español y push normal a la rama actual por bloque. Los hashes se registran en el archivo de continuación después del commit para evitar autorreferencias. [Continuación](../../curriculum/cobertura-secundaria/matematica-continuacion.md). Detenerse al terminar 6.º, sin otra asignatura.

## Nota de revisión del grado

Se conectaron 14 temas y 48 consignas (192 instrumentos completos). Se revisaron Ceva frente a Menelao, hipótesis de Thales y congruencia, cuerpos truncados y transformaciones. El único registro conceptual/procedimental sin proveedor es el encabezado Geometría; los indicadores de conversiones y embalse sí tienen proveedor. No se imponen compás, transportador ni un método único.

Las pruebas detectaron tres problemas antes del cierre: «mide» no activaba cálculo; «figura dibujada» imponía una representación; explicar errores añadía otra explicación redundante. Se corrigieron con verbos de acción y criterios independientes. El cotejo ahora conserva ángulos y perímetro como resultados separados cuando ambos se piden.

Backend completo: 99 archivos y 39.449 pruebas aprobadas. Frontend completo: 127 archivos y 39.940 pruebas aprobadas. Contratos focalizados: 1.875 backend y 1.844 frontend. Los cuatro builds finales terminaron con exit 0 después del último ajuste.

Con la cuenta propia de Development se inspeccionaron los cuatro editores. Se guardó y reabrió visualmente la lista de cotejo de polígonos, actividad 9b221490-d38b-4a0e-a1cf-aa365e8c9b65: texto manual, puntos 6.30/3.17/3.15/4.73, total 17.35 y Estudio de caso. Cambiar solo estrategia dejó el instrumento exactamente igual; los ocho campos reabiertos coincidieron exactamente. Los otros tres formatos se guardaron/reabrieron por HTTP/DB QA, no visualmente con la cuenta propia. Los cuatro borradores anteriores permanecieron intactos. La cobertura visual de añadir/completar de este grado sigue pendiente; los adaptadores y HTTP sí la verifican.
