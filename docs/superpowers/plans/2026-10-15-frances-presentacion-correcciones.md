# Correcciones de la presentación en Francés: plan

**Objetivo:** corregir el caso «Nos presentamos en francés» sin ampliar currículo ni reescribir historia.
**Especificación:** encargo adjunto del usuario de esta intervención: selector único siempre visible; simulación por acciones; preguntas, respuestas, residencia y ambos roles; medir demoras; preservar editor y snapshots.
**Arquitectura:** conservar los proveedores compartidos servicio/local, corregir extracción y composición, congelar `.75` antes de publicar `.76`. Sin dependencias, IA de aplicación, subagentes ni modificaciones a producción.
**Ejecución:** directa en la rama actual, autorización explícita para continuar y cerrar con commit/push.

- [x] Reproducir antes de corregir; registrar entorno, instrumentos y tiempos iniciales. Navegador bloqueado («User unavailable»), sin tocar sesión ni borradores personales.
- [x] Añadir regresiones del caso/variantes y visibilidad en la ruta real nueva/recuperada; comprobar fallos antes de corregir.
- [x] Corregir detección compartida de estrategia y evidencias francesas, con negativos y pertinencia por grado. Revisar cuatro instrumentos completos.
- [x] Corregir únicamente cuellos de botella demostrados, conservando autorizaciones y validación completa del catálogo. No se promete resolver la variabilidad remota; queda medida/documentada.
- [x] Congelar release previo, versionar, instalar idempotentemente solo en Development. 38 snapshots y ocho releases anteriores intactos; cuatro snapshots QA y un release nuevos.
- [x] Verificar editor, HTTP/DB, assets/entorno final; pruebas completas y builds exigidos; documentar pendientes visuales si hay bloqueo.
- [x] Revisar diff/secretos, actualizar informe y continuación y preparar el cierre Git autorizado. El resultado de commit/push y hash/árbol se confirma en la entrega.
