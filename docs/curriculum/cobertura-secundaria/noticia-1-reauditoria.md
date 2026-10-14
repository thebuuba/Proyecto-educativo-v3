# Reauditoría de La noticia, Lengua Española 1.º

Bloque parcial del encargo completo, en `amplia-instrumentos-secundaria`. Fuente revisada visualmente: PDF 69–70 / impresas 68–69. La columna de procedimientos de PDF 70 continúa La noticia antes de comenzar La guía turística; no se reasignan elementos por proximidad de columnas. Los seis procedimientos previamente revisados se conservan.

## Causas confirmadas y correcciones

1. Servicio y alternativa local duplicaban el contenido. El primero añadía sufijos al desempeño positivo; la segunda repetía la evidencia positiva antes de afirmar que era insuficiente. Las 41 regresiones iniciales del servicio y cuatro de la alternativa reprodujeron el problema.
2. El selector de actividad de 1.º interpretaba redactar un informe sobre una noticia como escribir una noticia. Regresión roja adicional y corrección de la regla compartida, conservando la elección explícita.
3. Un título de noticia podía imponer escritura periodística a ejercicios eléctricos. Regresión roja y restricción del módulo a familias de actividad compatibles.
4. Cotejo/escala utilizaban nombres de dimensiones. Ahora utilizan evidencias observables en los proveedores con progresión contextual.
5. Ponderada no definía qué justificaba Parcial. La adaptación compartida incluye `Parcial (50%):` y evidencia concreta por fila, sin agregar columnas ni imponer descriptores de rúbrica al formato.

Contenido único compartido: `secondary-news-grade-one.ts` y `secondary-topics/language/news-grade-1-core.ts`. Progresiones específicas para escritura, análisis, comparación, noticiero y debate; el informe usa dimensiones del informe sobre la noticia, no exige redactar otra noticia. El análisis focalizado selecciona partes, interrogantes, propósito o interpretación según la consigna; una presentación individual no exige participar en un equipo.

La política de formatos se aplica también a los proveedores compartidos existentes de Lengua 2.º y células/Ohm. No convierte los restantes criterios genéricos en módulos completos. Los demás cinco temas de Lengua 1.º todavía requieren esta reauditoría.

## Versiones e instalación

Catálogo `evaluation-2026.11`; `.10` archivado en `catalog-v10.ts`. Instalación local: CREATED → UNCHANGED; huellas de todos los releases anteriores intactas. No modificaciones remotas ni reset. El entorno normal usa login local, frontend 5173, API 3000 y Supabase 54321/54332. Health identifica commit de arranque y cambios sin commit, además del catálogo; el build usado durante esta verificación tiene base `1b9cf5c44595ac5ac36f31a76d38b6ab9d26d9ea` con cambios de este bloque. Consultar Git y health después de reiniciar para identificar la versión publicada.

## Pruebas y evidencia

- Backend: 999 pruebas aprobadas; 43 nuevas regresiones del módulo. Negativos de asignatura/grado y recursos permanecen en la auditoría existente.
- Frontend: 594 pruebas aprobadas; ocho pruebas del proveedor compartido y puntaje pendiente → 20/17,35, conservando edición manual. Selección automática/manual conserva las regresiones del bloque anterior.
- Inventario: seis pruebas; separa explícitamente inventario, extracción, implementación, motor, formatos, servicio e interfaz, sin deducir interfaz a partir de HTTP aislado.
- Builds backend/frontend y `pnpm cloudflare:build` aprobados; Cloudflare sólo dry-run.
- Servicio normal con login real: 96 propuestas (seis familias × cuatro formatos × dos totales × títulos original/neutral), HTTP 200, contexto LEN/1.º real y catálogo `.11`.
- Células/Ohm: 32 propuestas adicionales del servicio normal, cuatro formatos y ambos totales; en las ponderadas se verifica la evidencia de Parcial. Snapshots históricos `.10` conservados.
- Navegador: noticia con título neutral, rúbrica, 17,35 puntos, confirmación, guardado y reapertura. Lectura posterior por la API normal confirma snapshot `.11` y descriptor inicial específico. Células y Ohm históricos también recuperados.

Evidencias completas: [96 instrumentos](evidencias/noticia-1-servicio-normal.json), [controles científicos .11](evidencias/entorno-normal-local-current.json), [actividades persistidas desde navegador](evidencias/guardados-navegador-normal.json). [Cuatro instrumentos completos de noticia](noticia-1-instrumentos-completos.md). Captura: `evidencias/noticia-1-navegador-normal.png`.

## Alcance y pendientes

Implementadas seis familias de actividad del núcleo de La noticia; no se declara toda Lengua 1.º ni toda secundaria completa. Pendientes: otros subtemas oficiales (sinónimos, siglas, abreviaturas y exigencias gramaticales específicas), requisitos muy focalizados, recorridos completos en navegador de los otros tres formatos y ampliación de los demás temas/grados/asignaturas/optativas. Trigonometría 6.º permanece pendiente; la descripción original del usuario está recuperada.

Archivos funcionales: proveedor/ núcleo compartidos y exports, `authored-instrument-format.ts`, `secondary-topic-recommendation.ts`, wrapper del backend de noticia, `recommendation-engine.ts`, `catalog-current.ts` / `catalog-v10.ts`, adaptador frontend. Pruebas, fixtures, verificador del entorno normal, lectura de guardados y generador de inventario acompañan el cambio. No cambios de interfaz, dependencias ni esquema de base.
