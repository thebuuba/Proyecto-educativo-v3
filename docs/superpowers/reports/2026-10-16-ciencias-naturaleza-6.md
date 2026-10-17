# Ciencias de la Naturaleza común: 6.º de secundaria

Física común conectada en código, con verificación operativa en curso. No se incluyen optativas ni otra asignatura. La cobertura no se declara terminada por tener inventario o contratos aprobados.

MINERD 2023, PDF 319–322 / impresas 318–321: cuatro páginas y continuaciones inspeccionadas visualmente, 165 registros literales. La [matriz](../../curriculum/cobertura-secundaria/ciencias-naturaleza-matriz.json) separa fuente y adaptaciones, conceptos/procedimientos e indicadores. Diecisiete encabezados o menús se excluyen como tareas adicionales; seis vínculos fuente se revisaron expresamente por diferencias entre encabezado oficial y formulación de aula. No se inventa el área faltante en la cita literal sobre presión/fuerza ni se corrigen silenciosamente sus erratas.

63 grupos conectados: movimiento 2D/circular, fuerzas/Newton/marcos, gravitación/Hooke/rotación, cantidades de movimiento, trabajo/energía/choques/eficiencia; gravedad terrestre, sistema solar/galaxia/universo, estrellas/planetas/agujeros negros; fluidos/Pascal/Arquímedes/continuidad/Bernoulli/tensión/contaminantes; calor/temperatura, leyes termodinámicas/dilatación/energía interna/entropía/máquinas/geotermia; oscilaciones, ondas/interacciones/Doppler/resonancia/espectro/óptica/sismos/Sol; electrostática/materiales/potencial/condensadores/Ohm/corriente/potencia/circuitos, campos/inducción/motores/magnetismo terrestre y astrofísico; relatividad/átomo/cuantización/incertidumbre/fotoeléctrico/radiaciones/isótopos/fisión/fusión/minerales e investigación escolar.

126 consignas y [504 instrumentos completos de ejemplo](../../curriculum/cobertura-secundaria/ciencias-naturaleza-6-instrumentos.json), con [revisión científica y pedagógica](../../curriculum/cobertura-secundaria/ciencias-naturaleza-6-revision.json). La revisión delimitó ley cero, fuerza electromotriz frente a potencia, continuidad frente a Bernoulli, sistema solar frente a galaxia, movimiento microscópico frente a transferencia térmica y explicación de Ohm frente a cálculo. Se preservan las cinco evidencias del antecedente Ohm cuando se piden sus acciones completas; no se exige construir un circuito por interpretar uno. La predicción explicita condiciones y límites sin exigir comprobación experimental. Son adaptaciones de AulaBase, no rúbricas oficiales MINERD.

La fuente `MINERD_SECUNDARIA_2023_NAT_COMUN_G6_V1`, versión `6eceb230-a652-54ca-b2cf-dd3708e2c05a`, scope `32bae97e-5fd2-5ae8-864e-c372574a32e3`, se instaló en Development: CREATED→UNCHANGED, 165 registros y 106 snapshots conservados durante la importación. Sin migración de esquema. Catálogo 92 preparado en código, pendiente de instalación; 91 permanece congelado.

Pruebas iniciales: **1.024 contratos propios**, **4.574 de paridad/scoring de Ciencias 1–6**, y **20 del ciclo de solicitudes**, aprobados. Backend completo **45.248 / 108 archivos**, frontend completo **45.637 / 131 archivos**, aprobados. Las pruebas incluyen cuatro formatos, 20/17,35, puntaje pendiente, edición manual, añadir/completar, agotamiento, límite veinte, títulos incompatibles y descarte de la respuesta Ohm→incertidumbre en el mismo borrador. No se presentan como clics de navegador.

Generación pura: 200 muestras, p50 0,2639 ms / p95 0,4843 ms / máximo 2,6063 ms. Excluye Auth, DB, HTTP y render. No compara ese dato con la latencia remota como si midieran lo mismo.

Pendientes al redactar: builds finales, runtime servido, catálogo 92 idempotente, contexto QA, cuatro guardados/reaperturas por HTTP/DB, cambio exclusivo de estrategia, regresiones y huellas históricas. Sesión personal sigue en login tras error de perfil; no se cambian credenciales ni se envía otro correo durante la ausencia. [Guion manual](2026-10-16-ciencias-naturaleza-6-prueba-manual.md).

## Verificación operativa posterior

Catálogo 92 realmente instalado CREATED→UNCHANGED en Development: 24 releases y 106 snapshots previos intactos. La comprobación previa impidió instalar cuando el paquete compartido compilado todavía tenía solo cinco grados; tras `pnpm build` se verificaron explícitamente los seis grados. No hubo instalación incompleta.

Build backend 0 / 5.933 ms, frontend 0 / 16.443 ms, y **`pnpm cloudflare:build` 0 / 86.042 ms**, terminado naturalmente. Incluye todas las correcciones de cuarto/quinto; los intentos interrumpidos anteriores se conservan como incidencias históricas. No hubo despliegue.

Runtime final `http://localhost:8787`, entrada `/assets/index-BLaW9Yd6.js`: PostgreSQL, Auth, Storage y Vite exclusivamente Development, rol sin bypass RLS, assets/sw HTTP idénticos a dist por SHA. El DOM personal cargó esa misma entrada; no se borró caché ni almacenamiento.

HTTP/DB QA: cuatro formatos guardados/reabiertos y estrategia exclusiva conservando instrumento exacto. Ponderada con edición manual y pesos 41/19/40. Recheck final: cuatro reaperturas, cuatro recomendaciones92, cinco controles científicos, FRA/ING/MAT y Ciencias1–5 aprobados. Historia inicial18/73 y baseline de sexto24/106 intactos; un release y cuatro snapshots nuevos. [Evidencia](2026-10-16-ciencias-naturaleza-6-verificacion.json).

La sesión personal se recuperó automáticamente tras recargar; sin nuevas credenciales ni correo. El cotejo previo de cuarto se reabrió exacto tras guardar únicamente estrategia; sigue siendo su instrumento local histórico, no se le atribuye un snapshot remoto. Se retomaron las pruebas visuales desde curso/asignatura. La lista global de Actividades volvió a mostrar «La solicitud tardó demasiado», por lo que no se declara resuelta la latencia general. La verificación visual de sexto sigue en curso y separada de QA HTTP.
