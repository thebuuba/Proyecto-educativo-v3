# Matemática común — 2.º de secundaria

Catálogo evaluation-2026.80, rama amplia-instrumentos-secundaria. 18 temas y 56 consignas/variantes. Bloque automático y HTTP/DB verificado; alcance visual documentado en la nota del grado.

## Cobertura y pertinencia

Fuente MINERD 2023: PDF 220, 221 (impresa = PDF menos uno), SHA-256 80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58. Solo currículo común. Se inspeccionaron las tablas, indicadores y continuaciones. [Matriz por tema](../../curriculum/cobertura-secundaria/matematica-2-matriz.md) y [registros literales](../../curriculum/cobertura-secundaria/matematica-matriz.json).

Proveedores conectados: números reales; patrones numéricos; expresiones algebraicas; ecuaciones de primer grado; inecuaciones de primer grado; ecuaciones de segundo grado; inecuaciones de segundo grado; planificación financiera; interés compuesto y monto; geometría plana y sus ramas; plano cartesiano; distancia entre puntos; fórmula de Herón; teorema fundamental del triángulo; cono, cilindro y esfera; medidas de posición; datos agrupados y gráficos; experimentos y eventos compuestos. La fuente publicada por sí sola no acredita cobertura: se comprobaron acciones, criterios y formatos. Se revisaron las relaciones matemáticas y las evidencias de cada consigna, la progresión común de descriptores y su adaptación a los cuatro formatos. [224 instrumentos completos](../../curriculum/cobertura-secundaria/matematica-2-instrumentos.json). Son propuestas editables de AulaBase, no rúbricas oficiales del MINERD.

Se distingue comprensión del problema, procedimiento y resultado cuando se pide resolver; explicación, comprobación, representación, análisis de errores o investigación solo cuando corresponden. Los datos proceden de la consigna; no se inventa un problema, resultado, unidad, material ni producto. Se admiten métodos matemáticamente válidos. El cotejo separa las evidencias independientes previstas; rúbrica y escala tienen descriptores progresivos, y ponderada conserva los pesos de sus componentes. No se añaden estética, rapidez ni rasgos personales.

## Verificación

Los contratos ejercitan las consignas en cuatro formatos × 20/17.35, títulos neutrales/incompatibles, selección manual y paridad local/servicio. Los adaptadores verifican puntuación pendiente, exactitud en centésimas, completar solo huecos, añadir una evidencia ausente sin duplicados, agotamiento y rechazo explícito del criterio 21. Las regresiones compartidas mantienen conservar/adaptar/cancelar, textos/pesos manuales y descarte de respuestas obsoletas. Ver las cifras de suites y las precisiones propias del grado en la nota de revisión abajo.

Recorrido autenticado localhost:8787: cuatro formatos, edición, guardado, reapertura y cambio exclusivo de estrategia. Se compararon exactamente campos, pesos, snapshot, IDs y hash. La prueba usa datos ficticios identificables en el centro QA Development, no la sesión personal. Es HTTP/DB y ejecución de adaptadores reales, no clics de navegador. [Evidencia estructurada](../../curriculum/cobertura-secundaria/matematica-2-verificacion.json).

- pnpm --filter @aula/shared build: exit 0, 1.658 s.
- pnpm --filter backend build: exit 0, 5.086 s.
- pnpm --filter frontend build: exit 0, 15.192 s.
- pnpm cloudflare:build: exit 0, 50.772 s.

El build Cloudflare terminó en dry-run. No hubo despliegue. Continúan avisos conocidos de tamaño de chunks y de Node con comandos estáticos de Windows; jsdom avisa de scrollTo sin fallar.

Mediciones de esta pasada HTTP: interpretación 4354–5761 ms (4 peticiones); recomendación 5098–5988 ms (4 peticiones); escritura 5217–7883 ms (8 peticiones). Incluyen red, pool, base y servidor; no son tiempos SQL puros ni un cronómetro visual. No se promete latencia uniforme.

## Desarrollo e historia

PostgreSQL, Auth, Storage, variables públicas y assets servidos pertenecen exclusivamente a Development eolgunypmtgrsyrjzcld; SQL app_backend_local, sin BYPASSRLS. Las huellas de entry, chunks y sw.js coinciden con la compilación. No se modifica producción, su Hyperdrive, secretos o datos. No hay nuevas migraciones de esquema ni resets/merge/force push. Fuente MINERD_SECUNDARIA_2023_MAT_COMUN_V1 instalada previamente, no se reconstruyen cuentas ni se copian datos.

Instalación del catálogo: CREATED, después UNCHANGED; no se sobrescribe un release existente. Comparación histórica: 42 snapshots y 9 releases iniciales intactos, 9 snapshots QA y 4 releases adicionales acumulados. Se congela el catálogo anterior antes de continuar.

## Limitaciones y prueba manual

Se accedió visualmente con la cuenta propia de Development: rúbrica, selector inicial, puntos pendientes, selección manual, instrumento idéntico al cambiar estrategia, 20/17.35, edición, guardado y reapertura. Los otros formatos tienen recorrido HTTP/DB; su prueba visual completa sigue pendiente.  No se afirma inspección de cachés/registros personales del service worker. No se borra almacenamiento ni borradores. Tras guardar cualquier edición abierta, probar una pestaña nueva de localhost:8787 con cuenta propia de Development: selector de estrategia visible y puntos vacíos, consigna de la matriz, instrumento completo, selección manual, 20 y 17.35, edición, añadir/completar cuando falte evidencia, guardar y reabrir. Cambiar solo estrategia debe conservar exactamente el instrumento. No reconectar a producción.

## Archivos y continuidad

Proveedor packages/shared/src/secondary-math-grade-2.ts; compositor secondary-math-common.ts; fixtures math-grade-2-contracts.json, contratos de ambos lados, catálogo actual y release previo congelado; matriz/instrumentos/evidencia y este informe. Scripts de QA compartidos bajo scripts/evaluation-instruments/math-*. Secretos, credenciales QA, respaldos y checkpoints permanecen ignorados. Diff y UTF-8 revisados antes del commit.

Commit en español y push normal a la rama actual por bloque. Los hashes se registran en el archivo de continuación después del commit para evitar autorreferencias. [Continuación](../../curriculum/cobertura-secundaria/matematica-continuacion.md). Detenerse al terminar 6.º, sin otra asignatura.

## Nota de revisión del grado

Las pruebas focalizadas de 2.º pasaron 451 backend y 449 frontend; las completas finales dieron 38.635 backend (99 archivos) y 39.130 frontend (127 archivos). Se corrigieron en rojo/verde verbos habituales evaluar/reducir/aplicar/traducir y las formas singulares de patrón, ecuación, desigualdad y lineal. Las negaciones y alternativas se verificaron sin exigir ambas ramas. Se precisó la curvatura y distorsión en la explicación del desarrollo plano de la esfera; no se exige una construcción imposible. Las continuaciones separadas de planificación/financiera permanecen literales y se vincularon al mismo proveedor; los tres encabezados sueltos no son desempeños independientes.

El servidor local anterior terminó durante recarga con ECONNRESET. Se verificó ausencia de listener/procesos y se reinició una sola instancia (launcher 31936) con el launcher protegido de Development. Se volvieron a comprobar SQL/Auth/Storage/variables y hashes servidos. No se alteró producción ni red. La primera prueba HTTP falló en health sin escrituras; la siguiente terminó los cuatro formatos.

Al recuperar acceso al navegador se añadió una prueba visual con la cuenta propia de Development y datos ficticios: actividad `0ce0df02-aa38-4f9a-af0d-f1639d665a0c`, expresiones algebraicas, rúbrica. Se observó formulario vertical y selector único inicial; puntuación inicialmente vacía; tres evidencias (procedimiento, resultado, razonamiento), selección automática correcta después de actualizar la consigna y modalidad, cambio manual a Estudio de caso con igualdad exacta de tabla/campos DOM, 20 y 17.35, edición del primer criterio, confirmación de guardado y detalle reabierto con los textos/17.35/estrategia. No se sobrescribieron ni eliminaron los cuatro borradores anteriores de la cuenta. Captura local ignorada `.wrangler/math-source/grade-2-visual.png`; evidencia sin datos personales en el JSON del bloque. Solo la rúbrica tiene este recorrido visual; no se extiende la afirmación a los otros formatos. La historia acumulada contiene ocho snapshots QA HTTP y uno visual, además de los 42 originales intactos.
