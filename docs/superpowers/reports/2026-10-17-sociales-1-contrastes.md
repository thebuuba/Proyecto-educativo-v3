# Sociales 1.º: contraste de hipótesis y procedimientos específicos

Estado: avance parcial del encargo integral. Rama `ampliacion-de-instrumentos-2`; commits locales, sin push por instrucción del usuario. No se intervino producción, sus integraciones ni sus cuentas.

## Cambios y fuente

Se conservó el payload real del catálogo96 en `catalog-v96.ts`, cotejado mediante consulta de solo lectura. El nuevo `evaluation-2026.97` incorpora la política `REQUESTED_SOCIAL_EVIDENCE_V3`. Instalación exclusivamente en AulaBase Development (`eolgunypmtgrsyrjzcld`): `CREATED`, segunda ejecución `UNCHANGED`, fuente y compilado iguales. Se comprobaron intactos los29 releases y137 snapshots anteriores. No se aplicaron migraciones de esquema.

El proveedor compartido agrega ocho contratos con referencias a procedimientos literales de MINERD2023 PDF244–247, separados de las adaptaciones de AulaBase:

| Consigna | Evidencia evaluada | Límite |
|---|---|---|
| Hipótesis sobre el origen de la Tierra | Explicación provisional y contraste con evidencias | No exige experimentos ni declara certeza absoluta |
| Silogismo sobre calentamiento global | Premisas y validez de la conclusión | No impone exposición oral ni confunde validez con veracidad |
| Aplicación de escala cartográfica | Relación entre distancias y unidades | Adaptación del estudio de mapas; no es un ejercicio literal del currículo |
| Registro GPS proporcionado | Correspondencia de coordenadas y posición | No pide teléfono, ubicación privada ni aplicación nueva |
| Organizador sobre producción colonial y población | Relaciones explícitas entre hechos y conceptos | No valora decoración |
| Diálogo socrático histórico | Preguntas abiertas, respuestas fundamentadas y revisión de ideas | No exige personajes, acento ni adhesión política |
| Recursos naturales de los continentes colonizados | Contenido investigado y procedencia de las fuentes | No añade contaminación actual ni búsqueda de sitios no solicitados |
| Regularidad de reglas viales observadas | Mismo comportamiento en distintas frecuencias | La escala usa Siempre/Casi siempre/A veces/Nunca; no califica personalidad |

La descripción sigue prevaleciendo sobre títulos antiguos. Se coordinan verbos que comparten objeto; las simulaciones mencionadas como material de análisis no se convierten en una actuación obligatoria. El título aporta la acción cuando falta descripción. Las selecciones manuales, el puntaje pendiente y la presentación vertical se mantienen sin nuevos campos o banners.

La primera comprobación roja tuvo64 fallos en los ocho contratos/cuatro formatos/dos puntajes. La lectura de los32 instrumentos nuevos detectó además cuatro defectos que pasaban esos primeros contratos: escala evaluativa interpretada como cartografía; posición GPS duplicada; explicación anafórica que perdía el contenido investigado; objeto demasiado amplio para hipótesis y silogismo. Se añadieron regresiones y se corrigieron antes de instalar el release97.

## Revisión y verificaciones

- Se leyeron los196 ejemplos completos correspondientes a49 consignas: los71 previamente revisados, los32 nuevos y los93 formatos temáticos restantes. Sus huellas se registran en `sociales-1-revision-instrumentos.json`. Esta revisión no equivale a completar todos los procedimientos del grado.
- Backend focal:131 pruebas; backend completo:45.694 pruebas en136 archivos, aprobado.
- Frontend focal:393 pruebas, con paridad motor/alternativa local, puntos pendientes, totales20/17.35 y textos manuales. No se repitió el frontend completo en este bloque.
- `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`: aprobados. El último hace `wrangler deploy --dry-run`: no es un despliegue efectivo. Aviso de tamaño de chunks existente.
- Lints aprobados; frontend conserva16 advertencias anteriores, sin errores.
- Localhost recompilado con un solo launcher verificado. Guard PostgreSQL/Auth/Storage/frontend aprobado; asset servido idéntico al compilado, SHA256 `ac3e1c5ce48803b4173c5b57d256665876c6a24d8e626b847e1da7b0ecd7446f`, sin referencia del proyecto de producción.
- HTTP/DB de los ocho contratos con fuente publicada: **aprobado**. Cuatro formatos, puntajes20/17.35, preparación equivalente a la alternativa local, puntuación pendiente vacía, edición manual conservada, guardado y reapertura. Cambiar únicamente la estrategia a `CASE_STUDY` conservó exactamente IDs, snapshot, criterios, tipo, técnica y puntaje. La selección de un referente excluido devolvió400.
- Consulta final de solo lectura:30 releases/145 snapshots. Los29/137 anteriores al97 mantienen sus huellas. Se agregaron ocho actividades en el centro ficticio QA ya existente; ninguna actividad o cuenta personal se modificó.
- Medias observadas en esta muestra: interpretación5.822ms, recomendación5.512ms y escritura4.201ms. No se atribuye la variación frente a muestras anteriores a una mejora sostenida de red; no se modificó esa capa.

El enlace de acceso autorizado se solicitó desde localhost y la aplicación mostró «Enviamos un enlace de acceso a tu correo». La pestaña personal permanece en `/login`; no se cambió contraseña ni se copió una cuenta. Navegador disponible, recorrido visual personal pendiente de autenticación. No se capturó la contraseña visible ni se borraron almacenamiento, caché, service worker o borradores.

## Pendientes reales

Sociales1.º sigue parcial. Revisar, entre otros, paneles/infografías, lluvia de ideas, brochure, consultas comunitarias, pantomima/títeres/cómic, representación de personajes, indagaciones explícitas y productos con requisitos particulares. Comprobar aliases de plantaciones, libertos/campesinado y engagés sin introducir temas vecinos. Examinar por separado los indicadores de teoría de la dependencia y13 colonias, sin inventar equivalencia con contenidos conceptuales.

Persiste la latencia documentada en el informe anterior; no se conservó el prototipo de caché ni se aumentaron timeouts. La atribución literal de criterios continúa separada de las adaptaciones: al alinear cambios manuales, el sistema puede retirar elementos sin referencias finales; no afirmar conservación de selecciones individuales por el mero hecho de conservar versión/ámbito.

Los pushes siguen pendientes. La lectura de triggers Workers devolvió403 anteriormente; builds/checks de Workers o Vercel no prueban por sí solos previews ni despliegues efectivos. No se modificaron triggers, secretos, Hyperdrive o permisos. Evidencia QA, sesiones y credenciales permanecen en archivos privados ignorados.
