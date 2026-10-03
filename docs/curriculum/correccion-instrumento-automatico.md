# Corrección del instrumento automático

Base: rama `instrumentos`, commit `a8cc264`. Corrección en `fix/instrumento-automatico`.

## Problema confirmado

Las capturas muestran el editor vacío y «Falta instalar el catálogo evaluativo versionado». El backend emite ese error cuando su base conectada no contiene la versión de catálogo esperada. No se verificó la base utilizada por el usuario: instalar el catálogo en otro PostgreSQL local no demuestra que esté instalado allí.

El cliente requería pulsar «Usar plantilla editable» para recuperar el contenido. La descripción «leerán un cuento y redactarán un informe de lectura» además activaba análisis en la plantilla local. El guardado enviaba esa plantilla como snapshot de catálogo, aunque el backend solo admite snapshots de la versión oficial.

## Corrección

- Los errores de servicio o conexión abren automáticamente una plantilla contextual editable. Los errores HTTP 4xx conservan su tratamiento explícito.
- El selector adapta la plantilla al instrumento pedido aunque el servicio continúe indisponible.
- La consigna real genera resumen, análisis de personajes, estructura, conclusión personal, coherencia y revisión.
- La plantilla se guarda por la vía existente de instrumentos editables; no se envía como snapshot curricular. Su versión local queda en los metadatos de los campos.
- Reintentar o regenerar requiere confirmación si hay cambios manuales.
- La interfaz mantiene reintento y creación desde cero sin mostrar el error técnico del catálogo durante la recuperación.

## Verificación

- Pruebas del creador y preparación: 44 aprobadas, con regresiones observadas fallando antes de corregir.
- Backend completo: 30 archivos, 256 pruebas aprobadas.
- Compilaciones de backend y frontend y Cloudflare dry-run aprobadas.
- Se verificó el guardado y reapertura en componentes con 17.35 puntos y la consigna en los cuatro adaptadores.

## Límites

No se modificaron bases de datos ni se instaló el catálogo en el entorno del usuario. No se ejecutó un E2E autenticado contra ese entorno. No hubo despliegue. Queda comprobar la versión del backend y el catálogo instalado en la base que realmente usa la aplicación del usuario.
