# Ciencias de la Naturaleza común: 6.º de secundaria

Estado final: **patrones definidos verificados**, con cuatro formatos personales guardados, reabiertos y contrastados con DB. No se incluyen optativas ni otra asignatura. El cierre siguiente sustituye los pendientes de las notas cronológicas inferiores; la cobertura no se acredita únicamente por inventario o contratos.

## Cierre personal de sexto

Se utilizó la asignatura Física de sexto de la cuenta personal en Development, diferente de la asignación QA HTTP. Los cuatro instrumentos se generaron, editaron y guardaron una sola vez. El cambio manual a Estudio de caso conservó todos sus campos; puntos inicialmente vacíos en cada creación.

| Formato | Actividad | Puntos | Reapertura comprobada |
| --- | --- | ---: | --- |
| Rúbrica | Leyes de Newton (`4f016a23-a615-40ad-98a1-c787a0eec1bc`) | 20 | 37 campos, 82 claves persistidas exactas |
| Cotejo | Átomo (`92d09771-eb45-48c3-b946-6063af2d864f`) | 17,35 | Cinco campos, 21 claves exactas; comparación añadida sin duplicar identificación |
| Escala | Movimiento circular (`c95a89ef-1124-4356-94ef-1c2f9c5a8c18`) | 20 | Seis campos y 27 claves exactas |
| Ponderada | Ley de Ohm (`379ed8c9-8ef8-486b-9be3-6dc9f407b66f`) | 17,35 | Diez campos y 35 claves exactas; pesos 41/19/40 |

La reapertura en la pestaña Instrumento muestra claves/valores, no la tabla editable: se comparó cada valor capturado del editor y la definición completa contra DB de solo lectura. La ponderada se reabrió además en el editor habitual para comprobar su tabla. Fuente y scope de sexto, catálogo 92, identidad instrumento/snapshot y estrategia manual correctos en los cuatro casos. [Evidencia detallada](2026-10-16-ciencias-naturaleza-6-verificacion.json).

Completar criterio rechazó con mensaje útil una fila manual que se había cambiado de hipótesis a pregunta, sin rellenar un descriptor incompatible. Al utilizar una fila de hipótesis compatible, repuso exclusivamente Destacado y conservó los otros 36 campos y puntos. El cotejo partió de una consigna breve de identificación: Conservar instrumento actual mantuvo la edición manual al ampliar la descripción; Agregar criterio añadió solo la comparación, con 8,68+8,67=17,35. La escala no exigió cálculos ausentes. La ponderada evaluó procedimiento, resultado y explicación de Ohm con crédito parcial, sin exigir construir el circuito negado; 7,11+3,30+6,94=17,35.

La formulación con «práctica» sin búsqueda/experimentación explícita quedó sin estrategia automática; no se le atribuye indagación forzada. La formulación experimental de quinto sí la recomendó. Se comprobó selección manual prioritaria en ambos grados y preparación sin anuncios.

Comprobaciones finales de código: backend 45.248/108, frontend 45.637/131, backend/frontend builds y pnpm cloudflare:build aprobados, este último salida 0 natural en 86.042 ms. Después solo se modificó documentación/evidencia. Historia final: 18 releases/73 snapshots iniciales y 24/106 de inicio de sexto con huellas intactas; total 25/121 tras versiones/QA de los distintos grados. Sin migraciones de esquema ni cambios en producción.

Tres caídas del runtime durante los recorridos de cuarto a sexto terminaron con ENOTFOUND del mismo pool de Development. Se preservaron logs, se comprobó ausencia de procesos anteriores y se reinició un único servidor cuando DNS volvió a resolver; se verificaron de nuevo SQL/Auth/Storage/frontend y SHA. Reintentar no recuperó una página cuyo módulo había fallado: la recarga normal sí. No se cambiaron proyecto, DNS del sistema, secretos ni datos. Estas incidencias y el timeout de la lista global de Actividades siguen como limitaciones, aunque los recorridos desde Cursos terminaron. No se inspeccionaron registros privados del service worker/caché ni se borró almacenamiento.

## Fuente y antecedentes de implementación

MINERD 2023, PDF 319–322 / impresas 318–321: cuatro páginas y continuaciones inspeccionadas visualmente, 165 registros literales. La [matriz](../../curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json) separa fuente y adaptaciones, conceptos/procedimientos e indicadores. Diecisiete encabezados o menús se excluyen como tareas adicionales; seis vínculos fuente se revisaron expresamente por diferencias entre encabezado oficial y formulación de aula. No se inventa el área faltante en la cita literal sobre presión/fuerza ni se corrigen silenciosamente sus erratas.

63 grupos conectados: movimiento 2D/circular, fuerzas/Newton/marcos, gravitación/Hooke/rotación, cantidades de movimiento, trabajo/energía/choques/eficiencia; gravedad terrestre, sistema solar/galaxia/universo, estrellas/planetas/agujeros negros; fluidos/Pascal/Arquímedes/continuidad/Bernoulli/tensión/contaminantes; calor/temperatura, leyes termodinámicas/dilatación/energía interna/entropía/máquinas/geotermia; oscilaciones, ondas/interacciones/Doppler/resonancia/espectro/óptica/sismos/Sol; electrostática/materiales/potencial/condensadores/Ohm/corriente/potencia/circuitos, campos/inducción/motores/magnetismo terrestre y astrofísico; relatividad/átomo/cuantización/incertidumbre/fotoeléctrico/radiaciones/isótopos/fisión/fusión/minerales e investigación escolar.

126 consignas y [504 instrumentos completos de ejemplo](../../curriculum/cobertura-secundaria/ciencias-naturaleza-6-instrumentos.json), con [revisión científica y pedagógica](../../curriculum/cobertura-secundaria/ciencias-naturaleza-6-revision.json). La revisión delimitó ley cero, fuerza electromotriz frente a potencia, continuidad frente a Bernoulli, sistema solar frente a galaxia, movimiento microscópico frente a transferencia térmica y explicación de Ohm frente a cálculo. Se preservan las cinco evidencias del antecedente Ohm cuando se piden sus acciones completas; no se exige construir un circuito por interpretar uno. La predicción explicita condiciones y límites sin exigir comprobación experimental. Son adaptaciones de AulaBase, no rúbricas oficiales MINERD.

La fuente `MINERD_SECUNDARIA_2023_NAT_COMUN_G6_V1`, versión `6eceb230-a652-54ca-b2cf-dd3708e2c05a`, scope `32bae97e-5fd2-5ae8-864e-c372574a32e3`, se instaló en Development: CREATED→UNCHANGED, 165 registros y 106 snapshots conservados durante la importación. Sin migración de esquema. El catálogo 92 estaba pendiente en esta primera etapa; su instalación posterior se confirmó idempotente. El catálogo 91 permanece congelado.

Pruebas iniciales: **1.024 contratos propios**, **4.574 de paridad/scoring de Ciencias 1–6**, y **20 del ciclo de solicitudes**, aprobados. Backend completo **45.248 / 108 archivos**, frontend completo **45.637 / 131 archivos**, aprobados. Las pruebas incluyen cuatro formatos, 20/17,35, puntaje pendiente, edición manual, añadir/completar, agotamiento, límite veinte, títulos incompatibles y descarte de la respuesta Ohm→incertidumbre en el mismo borrador. No se presentan como clics de navegador.

Generación pura: 200 muestras, p50 0,2639 ms / p95 0,4843 ms / máximo 2,6063 ms. Excluye Auth, DB, HTTP y render. No compara ese dato con la latencia remota como si midieran lo mismo.

Pendientes de aquella primera etapa: builds finales, runtime servido, catálogo 92 idempotente, contexto QA, cuatro guardados/reaperturas por HTTP/DB, cambio exclusivo de estrategia, regresiones y huellas históricas. La sesión personal estaba en login tras error de perfil; después se recuperó sin cambiar credenciales ni enviar correo. Esas comprobaciones ya se cerraron, como consta arriba. Se conserva el [guion manual](2026-10-16-ciencias-naturaleza-6-prueba-manual.md) para reproducción.

## Verificación operativa posterior

Catálogo 92 realmente instalado CREATED→UNCHANGED en Development: 24 releases y 106 snapshots previos intactos. La comprobación previa impidió instalar cuando el paquete compartido compilado todavía tenía solo cinco grados; tras `pnpm build` se verificaron explícitamente los seis grados. No hubo instalación incompleta.

Build backend 0 / 5.933 ms, frontend 0 / 16.443 ms, y **`pnpm cloudflare:build` 0 / 86.042 ms**, terminado naturalmente. Incluye todas las correcciones de cuarto/quinto; los intentos interrumpidos anteriores se conservan como incidencias históricas. No hubo despliegue.

Runtime final `http://localhost:8787`, entrada `/assets/index-BLaW9Yd6.js`: PostgreSQL, Auth, Storage y Vite exclusivamente Development, rol sin bypass RLS, assets/sw HTTP idénticos a dist por SHA. El DOM personal cargó esa misma entrada; no se borró caché ni almacenamiento.

HTTP/DB QA: cuatro formatos guardados/reabiertos y estrategia exclusiva conservando instrumento exacto. Ponderada con edición manual y pesos 41/19/40. Recheck final: cuatro reaperturas, cuatro recomendaciones92, cinco controles científicos, FRA/ING/MAT y Ciencias1–5 aprobados. Historia inicial 18/73 y baseline de sexto24/106 intactos; un release y cuatro snapshots nuevos. [Evidencia](2026-10-16-ciencias-naturaleza-6-verificacion.json).

La sesión personal se recuperó automáticamente tras recargar; sin nuevas credenciales ni correo. En aquel punto, el cotejo previo de cuarto se reabrió exacto tras guardar únicamente estrategia y todavía era local. Su revisión remota posterior y snapshot92 quedaron comprobados en el cierre de cuarto. Se retomaron las pruebas visuales desde curso/asignatura. La lista global de Actividades volvió a mostrar «La solicitud tardó demasiado», por lo que no se declara resuelta la latencia general. El cierre personal de sexto ya está documentado arriba, separado de QA HTTP.
