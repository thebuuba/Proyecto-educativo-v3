# Corrección de fidelidad literal del horario

El usuario rechazó la aproximación visual del commit 98bfea32 y exige reproducir literalmente el horario de Polymet. El diseño aprobado es la referencia, sin reinterpretar sus tarjetas, proporciones, colores ni constructor.

Se recuperaron los archivos originales mediante el editor visible del Canvas autorizado por el usuario. Las copias de trabajo están en output/polymet-original (ignorado por Git).

1. Integrar los componentes visuales originales y sus estilos exactos dentro del módulo de horario.
2. Conectar su contrato de datos a los servicios reales existentes; conservar propiedad por docente, clases pendientes y errores recuperables.
3. Sustituir únicamente los controles de terceros no instalados por controles equivalentes con los mismos estilos y foco accesible. Sin dependencias nuevas.
4. Comparar las vistas semanales, diarias, paneles, constructor, vacío, error y exportación en navegador. Usar una misma configuración de períodos para distinguir diferencias de datos de diferencias de diseño.
5. Ejecutar pruebas de integración y los cuatro comandos de AGENTS.md. No declarar fidelidad por aprobar pruebas de lógica.

Regla de alcance: la petición explícita de fidelidad prevalece sobre las restricciones de paleta anteriores dentro de Horario; no cambiar la identidad de otros módulos.

OpenCode deepseek-worker volvió a fallar al iniciar con Unexpected server error. Se aplicará subagent-driven-development para repartir dos adaptaciones acotadas y revisar sus resultados.

Resultado implementado:

- Componentes originales del calendario, agenda, resumen, panel de asignación/detalle, constructor de cuatro pasos y exportación integrados en `modules/schedule/polymet`.
- Fuente real por docente y centro; asignaciones pendientes conservan su ID al reubicarse. El constructor conserva únicamente identidades explícitas de períodos, sin transferir clases por posición.
- Controles locales sin dependencias nuevas. Los diálogos declaran densidad propia para evitar la compactación transversal. Radios, foco, teclado, Escape y confirmaciones tienen pruebas.
- Eliminados los componentes, utilidades y estilos de la aproximación anterior que dejaron de utilizarse.
- Revisión independiente corrigió errores de lote, reintento de eliminación parcial y acciones ausentes para `NEEDS_PLACEMENT`.

Comparación visual realizada con la misma fuente de ejemplo de Polymet en una página local temporal, excluida de Git. Se revisaron semana, día, detalle móvil a 390 px, cuatro pasos del constructor, creación hasta guardar, exportación semanal/diaria, vacío, completo, solo lectura y recuperación de errores. No se guardaron cambios de prueba en el horario real.

Medición final a 1920 px: ambos calendarios tienen 1136 × 968 px en (320,5; 261), panel lateral de 340 px, resumen de 1496 × 97 px y bloques de 191 × 61,5 px; coinciden fuente, fondos, radios y sombras visibles. El diálogo de exportación coincide en 896 × 487 px. Capturas y mediciones locales en `output/horario-fidelity/`.

Verificación: 91 pruebas del módulo en 13 archivos; ESLint de la implementación nueva sin errores ni avisos; backend 45.616 pruebas en 134 archivos; compilaciones de backend/frontend y dry-run de Cloudflare satisfactorios. La compilación final y el dry-run se repitieron correctamente tras el último ajuste de interlineado. El dry-run final esperó al cierre de la compilación de Nest para evitar que `deleteOutDir` borrara archivos durante el empaquetado. También se comprobó en navegador la confirmación de descarga de PDF y PNG.

La recarga de la aplicación real solicitó iniciar sesión nuevamente. El backend local volvió a responder HTTP 200; la comparación final se completó con el entorno de ejemplo, sin acceder ni modificar credenciales.
