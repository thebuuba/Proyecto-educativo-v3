# Francés común en Development — informe de cierre

Fecha local: 15/10/2026. Rama `amplia-instrumentos-secundaria`. Alcance exclusivo: recuperación del creador/Development y Francés común; sin optativas ni otras asignaturas.

## Resultado y cobertura real

Francés común está inventariado y conectado en 1.º–6.º según las seis mallas oficiales. Cada proveedor tiene patrones finitos de consignas españolas, francesas y mixtas, cuatro instrumentos completos revisados y pruebas propias. Esto no equivale a comprensión universal ni a un recorrido visual aprobado: **la comprobación de navegador QA permanece pendiente**.

| Grado | PDF oficial | Primera entrega / commit | Contenido principal | Evidencia y ejemplos completos |
|---|---|---|---|---|
| 1.º | 181–184 | `.70` / `3e5bbb84` | Saludos, aula, información personal, descripción, ubicación y rutina. | [Informe](../../curriculum/cobertura-secundaria/frances-1.md), [cuatro ejemplos](../../curriculum/cobertura-secundaria/frances-1-ejemplos.md). |
| 2.º | 185–188 | `.71` / `38935f91` | Información personal, vivienda, rutina, gustos/preferencias y coincidencias explícitas. | [Informe](../../curriculum/cobertura-secundaria/frances-2.md), [ejemplos](../../curriculum/cobertura-secundaria/frances-2-ejemplos.md), [pruebas](../../curriculum/cobertura-secundaria/frances-2-verificacion.json). |
| 3.º | 189–192 | `.72` / `39c55a1b` | Ubicación/recorridos, tiempo atmosférico, acciones en curso y planes futuros. | [Informe](../../curriculum/cobertura-secundaria/frances-3.md), [ejemplos](../../curriculum/cobertura-secundaria/frances-3-ejemplos.md), [pruebas](../../curriculum/cobertura-secundaria/frances-3-verificacion.json). |
| 4.º | 199–202 | `.73` / `30457a58` | Servicios urbanos, compra y detalles solicitados, sentimientos, necesidades y salud comunicada. | [Informe](../../curriculum/cobertura-secundaria/frances-4.md), [ejemplos](../../curriculum/cobertura-secundaria/frances-4-ejemplos.md), [pruebas](../../curriculum/cobertura-secundaria/frances-4-verificacion.json). |
| 5.º | 203–206 | `.74` / `ee59f8da` | Personas/lugares, actividades, instrucciones, prohibiciones e invitación/respuesta. | [Informe](../../curriculum/cobertura-secundaria/frances-5.md), [ejemplos](../../curriculum/cobertura-secundaria/frances-5-ejemplos.md), [pruebas](../../curriculum/cobertura-secundaria/frances-5-verificacion.json). |
| 6.º | 207–209 | `.75` / `50a871f1` | Viajes, transporte, opinión, reserva/pedido/pago y experiencias. | [Informe](../../curriculum/cobertura-secundaria/frances-6.md), [ejemplos](../../curriculum/cobertura-secundaria/frances-6-ejemplos.md), [pruebas](../../curriculum/cobertura-secundaria/frances-6-verificacion.json). |

El catálogo actual `.75` reúne esos seis proveedores. Las páginas impresas son una unidad menores. Se revisaron visualmente columnas y continuaciones, y el límite de Matemática en PDF 210. [Inventario](../../curriculum/cobertura-secundaria/frances-inventario.md) y [matriz oficial/adaptaciones](../../curriculum/cobertura-secundaria/frances-matriz.json). El PDF local conserva SHA-256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`.

## Entorno y procedencia

Localhost:8787 comprobado con el Worker real, no solo con un servidor backend aislado. PostgreSQL (`app_backend_local`, sin BYPASSRLS), Auth, Storage, variables públicas y assets servidos apuntan a **AulaBase Development `eolgunypmtgrsyrjzcld`**. El entry final es `/assets/index-WQvv6nFI.js`; entry, chunks relevantes y `sw.js` coinciden por SHA-256 con el build. El registro y la caché del service worker de la sesión personal no se inspeccionaron ni borraron.

Se encontró `curriculum_versions` vacío. Se añadió únicamente la fuente francesa común `MINERD_SECUNDARIA_2023_FRA_COMUN_V1`, ID `de6de6bc-0d23-59da-917e-22cb92c0a3af`: seis ámbitos, 813 registros oficiales, 42 relaciones. IDs propios distintos del currículo completo, texto/páginas contrastados, transición transaccional DRAFT→VALIDATED→PUBLISHED e instalación idempotente. La selección por metadata impide asignar la fuente francesa a Inglés, Lengua Española u optativas. No se importó el currículo completo ni se modificó esquema remoto.

Los snapshots iniciales sin referencias de fuente se conservan como historia; no se reescriben. Las nuevas actividades vinculadas y la lectura de preservación se registran en la [evidencia fuente](../../curriculum/cobertura-secundaria/frances-fuente-verificacion.json) y su [informe](../../curriculum/cobertura-secundaria/frances-fuente-development.md). Las interrupciones y su recuperación se documentan allí sin duplicar actividades.

La vinculación adicional de 1.º–3.º terminó sus doce formatos. La lectura final de 24 actividades confirmó doce instrumentos históricos intactos y doce vinculados intactos, con versión/ámbito correctos. El cotejo interrumpido de 2.º se recuperó sobre su registro existente; no quedan escrituras inciertas ni formatos pendientes de esa comprobación. Esta continuación no ejecutó migraciones SQL nuevas ni antiguas.

## Correcciones y archivos principales

- `ActivityCreationView.tsx`: retirada del banner y anuncios temporales de preparación, sin reservar espacios; acciones útiles, errores, reintentos, solicitudes obsoletas, elecciones manuales y puntaje pendiente conservados. Pruebas en `ActivityPreparationRace.spec.tsx` y `GradingBook.spec.tsx`. Publicado en `bb038abe` y `ae9aa76a`. [Informe del creador](2026-10-15-creador-estrategia-instrumento.md).
- `packages/shared/src/secondary-french*.ts`: contenido francés propio por grado, acciones/modalidades, negaciones/alternativas, requisitos de entrega y criterios; conexión compartida con backend y alternativa local. La descripción prevalece sobre el título. Los ejemplos citados y recursos no se convierten en tareas.
- La revisión completa corrigió duplicación entre recreación/invitación, `mais` como falso requisito gramatical, `sans dialogue oral` como falsa interacción, léxico confundido con producto y solicitud dependiente que sustituía un diálogo por OTHER. Reserva, pago, razones, recursos y entregas se exigen solo cuando se solicitan. La columna de 6.º no se amplía a un programa de pasado.
- `language-scale.ts`: grados contextualizados para los nuevos grados superiores; la frecuencia observada requiere evidencia explícita y no se deduce de un ejercicio sobre adverbios.
- `evaluation-instruments.service.ts`: aislamiento de versión por contexto y comparación exacta JSONB del catálogo en PostgreSQL. Evita descargar unos 631 KB por petición: medición de descarga 28.987 ms frente a comparación 2.481 ms; una recomendación posterior observada, 9.318 ms. Sin caché que omita validar el contenido.
- `catalog-v69.ts`–`catalog-v74.ts`: releases previos congelados; cada instalación de Development comprueba igualdad histórica e idempotencia. `.75` se instala CREATED/UNCHANGED preservando siete releases existentes. Fixtures por grado, scripts QA y documentación/evidencias actualizados.

## Verificación separada por tipo

| Tipo | Resultado final |
|---|---|
| Backend completo | `pnpm --filter backend test`: 96 archivos, **37.550/37.550**. |
| Frontend completo | `pnpm --filter frontend test`: 124 archivos, **38.084/38.084**, después de la corrección modal final. |
| Francés focalizado | **703 backend / 611 frontend**, acumulativos de 1.º–6.º; no se suman como grados independientes. |
| Builds requeridos | Backend, frontend y `pnpm cloudflare:build` finales con salida **0**; Cloudflare termina `--dry-run: exiting now`. |
| Contratos/editor | Cuatro formatos y totales exactos 20/17.35; puntuación inicialmente pendiente, ediciones manuales, conservar/adaptar/cancelar, obsolescencia, añadir/completar sin duplicados, agotamiento y límite veinte sin truncamiento/relleno; paridad servicio/local. |
| HTTP/DB por grado | Cuatro formatos generados, editados, guardados y reabiertos en localhost:8787 con cuenta ficticia QA. Cambio solo de estrategia conserva exactamente IDs, snapshot, criterios, pesos y puntaje. |
| HTTP final 4.º–6.º | Por grado: dos interpretaciones, cuatro recomendaciones y cuatro reaperturas sin cambios sobre su build final. La matriz completa de consignas es automática; no se presenta como todos los casos ejecutados por HTTP. |
| Navegador | **Pendiente**. Reintento: pipe nativo no disponible (os error 2), IAB no disponible y Chrome sin sesión QA aislada. No se sustituyó la sesión personal. |
| Auditoría | Diff revisado, secretos reales y credenciales QA contrastados sin mostrarlos; `.wrangler/`, credenciales, respaldos y temporales excluidos. Documentación francesa sin caracteres dañados. |

Los instrumentos completos se revisaron por contenido, independencia de evidencias, progresión y fidelidad; no se aprobó un grado únicamente por sumas o HTTP 200. Los valores/actitudes oficiales inventariados no se convierten en calificaciones de personalidad o motivación.

## Limitaciones y prueba manual pendiente

La infraestructura local tuvo salidas por DNS `ENOTFOUND`/`ECONNRESET`; después se completaron los bloques de 4.º–6.º. En una reanudación, `/activities/center` tardó 48–54 segundos; se conserva como limitación de rendimiento observada. La comprobación adicional de fuente usa el curso ya verificado y su API autenticada, sin atribuir ese camino al navegador.

Para la prueba visual: guardar antes cualquier edición personal pendiente y recargar localhost:8787; entrar con una cuenta propia de Development; seleccionar cada grado/Francés común y usar su consigna de ejemplo. Comprobar estrategia visible/automática y selección manual, instrumento completo en los cuatro formatos, puntaje pendiente y cambio a 17.35, texto/pesos manuales, guardado y reapertura. Cambiar únicamente estrategia y confirmar instrumento idéntico. No borrar almacenamiento ni importar cuentas de producción.

No se modificaron producción, su Hyperdrive, secretos ni datos; no hubo despliegue, merge, reset, force push, nuevas dependencias ni subagentes. Los commits y pushes se hicieron por bloques en la rama actual. El hash de cierre y sincronización final se confirman en la entrega. [Archivo de continuación](../../curriculum/cobertura-secundaria/frances-continuacion.md).
