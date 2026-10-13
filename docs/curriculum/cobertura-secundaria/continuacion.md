# Continuación del encargo completo

## Bloque más reciente: cuento policíaco 1.º (.16)

Proveedor compartido para escritura, análisis, comparación, narración y presentación del análisis. Progresiones específicas; análisis focalizado por elementos, preguntas/voces condicionales, sin conclusión obligatoria ausente. Servicio normal: 80 propuestas, ocho regresiones, análisis focalizado y título incompatible. Cuatro formatos guardados/reabiertos desde navegador: análisis en rúbrica/cotejo, narración en escala, escritura ponderada; ediciones manuales y celdas completadas preservadas. Identidades, plantilla, ámbito, snapshots y puntos comprobados por HTTP normal. [Informe y pendientes](cuento-policiaco-1-reauditoria.md).

Backend 1.171; frontend 748; inventario siete. Builds backend/frontend y Cloudflare dry-run aprobados. Catálogo .16 local, .15 archivado y releases anteriores intactos. Quedan gramática focalizada, separación adicional de objetivos de comparación/presentación, candidatos adicionales y recorrido de las otras familias. Continuar con caligrama 1.º PDF 74. Ninguna asignatura completa.

Commit de afiche .15: `b90a492a1d661227924e80fd30123e92cad955e6`, publicado en `origin/amplia-instrumentos-secundaria` de `thebuuba/Proyecto-educativo-v3`.

## Bloque más reciente: afiche 1.º (.15)

Proveedor compartido para creación, análisis, comparación y presentación; progresiones por acción, imagen o símbolo como alternativas, sin preguntas ni gráficos obligatorios ausentes de la consigna. Servicio normal: 64 propuestas, siete regresiones, un análisis focalizado. Cuatro formatos de creación guardados y reabiertos en navegador; rúbrica/escala 17,35, cotejo/ponderada 20, textos manuales y completar celda preservados. Identidades, plantilla, ámbito y snapshots verificados por lectura HTTP real. Catálogo .15 solo local, .14 archivado y releases anteriores intactos. [Informe y límites](afiche-1-reauditoria.md).

Backend 1.129; frontend suite completa 686 y prueba final del proveedor 49; inventario siete. Builds backend/frontend y Cloudflare dry-run aprobados. Pendiente de este tema: gramática focalizada, eventos solicitados, más candidatos y recorridos visuales de las otras tres familias. No equivale a completar Lengua 1.º ni secundaria. Continuar con cuento policíaco en PDF 73, después caligrama PDF 74 y el orden de `avance.md`.

## Bloque más reciente: composición y filas (.14)

Commit funcional publicado: `2bcad9b4a42263a2fab1480f7a47abe48f89d0b0`, confirmado en `origin/amplia-instrumentos-secundaria` de `https://github.com/thebuuba/Proyecto-educativo-v3.git`. Backend y frontend locales reiniciados con ese código; health confirma dicho commit, `dirty=false` al arranque y catálogo .14. Evidencia `evidencias/entorno-catalogo14-ejecutado.json`. Siete controles de navegador persistidos; el último exige ámbito/versión resueltos. Los dos controles anteriores sin ámbito se conservan como prueba del fallo de resolución DRAFT corregido.

El encargo adicional del 13/10/2026 se trabaja en `docs/superpowers/plans/2026-10-13-composicion-y-criterios.md`. Se corrigieron título concatenado, candidatos genéricos adicionales, selección de tema frente a título incompatible, identidad/procedencia y completar solo campos vacíos de una fila. Los cuatro editores tienen la acción en el menú; quinto nivel con progresión y confirmación; sexto sin fundamento queda manual. La adición usa el peso relativo cuando está disponible y protege puntuaciones manuales.

Matrices 5.º y control original de trigonometría 6.º usan proveedor compartido en servicio y alternativa. La consigna trigonométrica retoma contenidos de 5.º: no se reasigna currículo ni se atribuyen referencias oficiales de 6.º. Catálogo `evaluation-2026.14`, .13 archivado sin modificar releases anteriores. [Informe completo, causas, límites y archivos](composicion-y-filas.md).

Verificación: backend 1.094 / frontend 638 / inventario siete; builds backend/frontend y Cloudflare dry-run aprobados. `node scripts/evaluation-instruments/verify-math-normal-local.mjs`: 32 instrumentos, candidato adicional y 23 controles cruzados. `verify-math-browser-saves-local.mjs`: seis actividades guardadas/reabiertas desde navegador, textos manuales, IDs, plantilla, peso relativo y totales exactos; cinco snapshots históricos intactos. No se eliminan las evidencias anteriores.

Continuar automáticamente después de publicar este bloque: afiche Lengua 1.º, cuento policíaco/caligrama, pendientes de los tres núcleos y luego el orden de `avance.md`. La cobertura completa sigue abierta. Los errores HTTP 429 durante repeticiones se resolvieron respetando el intervalo, sin desactivar límites.

Último bloque: entorno normal local y núcleos de noticia, guía turística e informe de lectura de Lengua Española 1.º (13/10/2026). No equivale a cobertura completa de secundaria.

Rama: `amplia-instrumentos-secundaria`; entorno publicado en `1b9cf5c44595ac5ac36f31a76d38b6ab9d26d9ea`; noticia/formato en `82488d15fb9da7a33809609f0635c06e937771ea`; guía en `f9d59c37a7c998b895b6a3d54277eb7b7c33abd4`. Catálogo instalado: `evaluation-2026.13`; releases anteriores conservados. Currículo secundario local: `d98f8201-3cac-5da6-b855-38f7bb8c8011`, DRAFT; no se publica ni modifica su texto oficial.

## Arranque reproducible

1. `pnpm supabase:local` si Supabase no está iniciado.
2. `pnpm dev:local`: confirma localhost 54321/54332, reconstruye shared/backend, instala el catálogo idempotentemente, inicia API 3000 y Vite 5173 con las mismas variables locales. Los puertos deben estar libres. No termina procesos ajenos automáticamente.
3. `pnpm dev:local:seed`: crea/reutiliza centro y docente ficticios con rol docente real y 54 asignaciones comunes. No copia datos remotos. Las 18 optativas todavía no están incorporadas al centro QA.
4. Acceder a `http://localhost:5173/login` con correo/contraseña de `.dev-qa-account.local` (archivo ignorado por Git; no publicar). `.dev-qa-context.local` conserva IDs QA para las pruebas.
5. `node scripts/evaluation-instruments/verify-normal-local.mjs`: login por contraseña, proxy real y 32 instrumentos de células/Ohm. `--news`: 96 propuestas de noticia de 1.º; `--guide`: 80 de guía; `--reading-report`: 64 de informe de lectura. `verify-browser-saves-local.mjs`: lectura autenticada de las cinco actividades guardadas desde navegador.

Los `.env` remotos se conservan. Autenticación y almacenamiento consumen el mismo SUPABASE_URL local; subida de archivos no verificada en este bloque. El endpoint `/api/v1/health` identifica commit de arranque, cambios sin commit, fecha y catálogo exclusivamente en desarrollo. El frontend normal usa código fuente mediante Vite; cambios del backend requieren reiniciar `dev:local`.

## Evidencia y pendientes

- Dos pruebas del arranque local pasan; rechazan destinos remotos, puertos incorrectos y claves ausentes.
- Seed ejecutado dos veces sin duplicar asignaciones.
- Login real del docente ficticio en navegador. Células: rúbrica, 20 puntos, guardada y reabierta con cinco criterios contextualizados. Ohm: lista ponderada automática, 17,35 puntos, guardada y reabierta; no requiere construir circuito.
- Servicio normal: 32 propuestas, cuatro formatos, 20/17,35 y títulos originales/neutrales; HTTP 200, catálogo .10. Evidencia: `evidencias/entorno-normal-local.json` y capturas `entorno-normal-celulas.png` / `entorno-normal-ohm.png`.
- Backend: 999 pruebas; frontend: 594; inventario: seis. Builds backend/frontend y Cloudflare dry-run del bloque .11 aprobados. No despliegue ni reset.
- Hallazgo de ponderada corregido en .11: evidencia específica de Parcial (50%) en proveedores compartidos con progresión; no modifica los instrumentos históricos .10. Verificación HTTP realizada; navegador de la ponderada .11 todavía pendiente.
- Noticia de 1.º: núcleo de seis familias compartido entre servicio y alternativa, niveles específicos y selección compatible con la acción. 96 casos HTTP normales y rúbrica neutral guardada/reabierta; snapshot .11 confirmado por API. Informes y subtemas pendientes en [noticia-1-reauditoria.md](noticia-1-reauditoria.md).

Guía .12: proveedor compartido para cinco familias, resolución única de género, plurales y verbos/adjetivos; 80 propuestas HTTP normales y ponderada guardada/reabierta. Backend 1.044 / frontend 611, builds backend/frontend/Cloudflare aprobados; [informe y pendientes](guia-1-reauditoria.md). Parcial (50%) verificado también en navegador. Storage local y buckets confirmados; subida todavía no verificada.

Informe .13: proveedor compartido en cuatro familias y enfoque de personajes/sociocultural/texto según la consigna; conclusión solicitada, sin publicación ni preguntas impuestas. 64 propuestas HTTP y escala manual de 17,35 guardada/reabierta. Backend 1.078 / frontend 617, inventario seis y arranque dos; builds backend/frontend/Cloudflare aprobados. Visor sin repetición de título/descripción iguales. Ejecutar pruebas frontend con `pnpm --filter frontend test --maxWorkers=2` para limitar carga; no se ampliaron timeouts. [Informe y pendientes](informe-lectura-1-reauditoria.md).

Bloque .13 publicado: `55bb4b94917185c4ea335be738c8d2903692b57c`, confirmado en `origin/amplia-instrumentos-secundaria`. Tras reiniciar, health del proxy normal identifica ese commit, `dirty=false`, catálogo .13 y Supabase local. Las cinco actividades se recuperaron de nuevo con login real; esa evidencia se guarda aparte de los cambios funcionales. El avance de esta ejecución es parcial: entorno y tres núcleos de Lengua 1.º, no todas las asignaturas. El volumen restante requiere continuar en otra ejecución; no hay bloqueo externo ni autorización pendiente.

Siguiente módulo: afiche de Lengua Española 1.º (PDF 72–73). Continuar cuento policíaco y caligrama, más subtemas pendientes de noticia/guía/informe. Después completar la reauditoría de Lengua 2.º y continuar 3.º–6.º, Ciencias, Matemática, demás áreas y optativas. La cobertura pendiente sigue registrada en `avance.md` y `matriz.csv`; no se ha cambiado a completa.

Control de trigonometría: la descripción original sí está disponible en el chat anterior: resolver alturas/distancias utilizando seno, coseno y tangente; identificar datos, seleccionar razón, calcular y explicar procedimientos/resultados. Recuperarla fielmente al implementar Matemática 6.º, sin sustituirla por una descripción inventada.
