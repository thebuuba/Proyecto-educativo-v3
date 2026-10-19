# Portada de Polymet en AulaBase — plan de implementación

**Objetivo:** reproducir la portada aprobada de https://dev-untitled-pro-2ezddgkn.polymet.app/ en el servidor habitual del proyecto y sustituir su panel ficticio por una captura del Inicio real.

**Referencia:** código leído del editor visible de https://polymet.ai/canvas/c6115e55-24a7-4dbf-a08c-678d7830f7dc, guardado temporalmente en `.opencode/polymet-reference/`.

**Alcance autorizado:** mismos componentes, orden, tamaños, espacios, colores, fuente y recursos decorativos. El pedido explícito de fidelidad visual prevalece sobre las preferencias generales de diseño para esta portada; su tema queda limitado al módulo público. Se conservan los destinos reales de registro e inicio de sesión, la redirección de personas autenticadas y las condiciones comerciales configuradas. No se modifican cobros, base de datos ni dependencias.

## Trabajo

- [x] Recuperar y verificar los componentes y datos originales de Polymet.
- [x] Añadir una prueba de navegación por las pestañas y enlaces locales; conservar la prueba comercial existente.
- [x] Integrar los componentes en `modules/promo`, aislando tema y tipografía. Conservar la presentación de las páginas legales y de contacto.
- [x] Renderizar `AppLayout` y `DashboardPage` reales con datos de ejemplo en una vista local aislada, sin consultas ni modificaciones de datos externos; usar su captura como imagen pública de la portada y rotularla como ejemplo.
- [x] Comparar visualmente la portada con Polymet en escritorio y móvil, y comprobar pestañas, menú, preguntas y destinos de los botones.
- [x] Ejecutar pruebas del módulo y las cuatro comprobaciones requeridas por AGENTS.md. Revisar el diff completo. No publicar ni mezclar ramas.

## Revisión

Comprobar que el tema no altera la aplicación autenticada, que el menú móvil permite usar teclado y Escape, que no hay desplazamiento horizontal de página, que los enlaces comerciales permanecen internos y que la captura no muestra datos personales reales.

## Evidencia de verificación

- Referencia y resultado comparados en Chrome en escritorio y a 390 × 844. El ancho móvil útil y el ancho de desplazamiento de página son ambos 375 px.
- Menú móvil: foco inicial en Cerrar, cierre con Escape, restauración del foco y cierre al navegar. Pestañas: selección y flechas del teclado. FAQ: apertura y cierre de respuestas.
- Ajustados los radios del tema original y las diferencias de alturas/interlineado entre Tailwind 3 y 4. Tema claro limitado a `.promo-polymet`, incluso cuando la aplicación usa modo oscuro.
- Imagen pública: `public/images/aulabase-inicio.jpg`, 1905 × 889, 146 025 bytes; componentes reales con nombres y clases ficticios. No depende de credenciales ni sesiones para mostrarse.
- Pruebas de promoción: 4 archivos y 9 pruebas aprobadas. Suite backend: 134 archivos y 45 571 pruebas aprobadas. ESLint del código nuevo: salida 0.
- Corregido el regreso al principio al pulsar el logotipo desde una sección: prueba que falló antes de la corrección y pasó después, y comprobación en Chrome desde `/#precio` hasta `/` con desplazamiento final de 0 px.
- Captura del resultado guardada en `.opencode/portada-polymet-escritorio.jpg`. Las referencias, el render aislado y los registros de comprobación permanecen ignorados por Git.
- Revisión independiente con `deepseek-worker`: aprobada sin bloqueantes. Corregidos el nombre accesible del grupo de pestañas, las referencias ARIA a paneles inactivos y el tamaño/radio del botón de menú. El menú mantiene el patrón del `Modal` compartido del proyecto: `aria-modal`, foco atrapado y fondo superpuesto; no se amplía aquí ese componente transversal con un sistema de `inert`.
- Comprobaciones requeridas ejecutadas: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`. Compilaciones con salida 0; la última comprobación de Cloudflare también compiló el frontend definitivo y terminó en `--dry-run`, sin publicación.
- Los cambios quedan sin commit en el proyecto habitual, rama `seguimiento-de-trabajo-de-pagos`. No se modificaron dependencias, entornos, migraciones ni ramas de otras personas.

## Refinamientos aprobados después de la revisión visual

- La captura ofrece «Ampliar imagen». Abre el `Modal` compartido con la imagen a 1905 × 889, desplazamiento interno y región accesible por teclado. Escape, Cerrar y el clic exterior usan el comportamiento compartido; al cerrar se recuperan el foco y el desplazamiento de la página.
- Los textos sobre acceso, conservación del trabajo, instrumentos e incorporación se expresan con tareas del docente. Se conservan la oferta y las condiciones comerciales.
- Prueba añadida antes de implementar: apertura, foco inicial, imagen original, bloqueo del fondo, cierre con Escape y restauración del foco. Las 10 pruebas de promoción pasan; ESLint sin errores ni advertencias. La suite backend mantiene sus 45 571 pruebas aprobadas.
- Verificado en Chrome en escritorio y a 390 × 844: página sin desbordamiento horizontal, visor de 343 px con imagen desplazable de 1905 px, navegación con flechas y cierre con retorno de foco. Indicador de foco visible de 4 px sobre el botón de imagen. La ventana temporal de prueba vuelve a su tamaño original.
- Revisión acotada con `deepseek-worker`: sin errores críticos o importantes; comprobada en navegador su observación sobre el ancho del modal. Captura del resultado: `.opencode/portada-imagen-ampliada.jpg`.
- Tras estos ajustes se repitieron las cuatro comprobaciones de AGENTS.md y terminaron con salida 0. La compilación del frontend también se repitió después de ajustar el foco visible. Cloudflare se comprobó en modo `--dry-run`; no se publicó ni se creó un commit.
