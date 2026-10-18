# Flujo comercial: precios, registro y suscripción

Revisión del 15/10/2026 en `feat/suscripciones-pagos-20261015`. El propietario confirmó que el problema se observaba en **localhost**.

Actualización posterior: la [aceptación real de Paddle Sandbox](PADDLE_SANDBOX_ACEPTACION_2026-10-15.md) ya comprobó checkout, mes gratuito con tarjeta, primer pago simulado de US$7.99, portal, cancelación, rechazo de tarjeta y reenvío idempotente. Se ejecutó en PostgreSQL local aislado y en un frontend separado del localhost habitual conectado a producción. No se activaron cobros Live ni se publicó la web principal.

## Causa y corrección

La oferta ya estaba centralizada en US$7.99, pero la portada y el registro no la mostraban. Las preguntas frecuentes decían que el importe seguía por definir. El recorrido lateral del registro terminaba en «Entra a la aplicación» sin explicar la activación con tarjeta. Además, Ajustes mostraba «Sin precios publicados» cuando faltaban métodos autorizados, aunque sí mostraba la mensualidad aprobada en el bloque de prueba.

- Portada, precios, registro y confirmación de la configuración comparten `SubscriptionOfferSummary`, que lee la oferta central: **US$7.99 mensuales**, un mes natural gratuito con tarjeta y renovación automática.
- La referencia DOP conserva tasa, fuente y fecha; aproximadamente **RD$492.81**, sin prometer una conversión bancaria garantizada.
- La portada enlaza a precios; Precios ofrece crear cuenta y, para cuentas existentes, gestionar la suscripción. El encabezado de acceso permite consultar Precios desde login/registro.
- Crear una cuenta o guardar el centro no activa una prueba ni autoriza cargos. El registro muestra estas condiciones antes del formulario y conserva las comprobaciones de campos y consentimiento.
- Al terminar la configuración nueva, «Continuar a mi suscripción» lleva a `/configuracion?tab=suscripcion&bienvenida=1`. Reabrir la configuración con `reset` conserva su destino anterior a Inicio.
- Ajustes distingue el precio aprobado de las formas de pago todavía no habilitadas. No ofrece activar el mes gratuito sin precio autorizado, checkout, eventos y condiciones disponibles.
- Se alinearon las preguntas frecuentes, los pasos de inicio y la sección comercial del borrador de términos. El documento legal conserva su condición de borrador; no se inventaron datos del negocio ni una política final de reembolsos.

## Recorrido esperado

1. Consultar precio y condiciones en la portada o `/precios`.
2. Crear cuenta; confirmar el correo cuando corresponda.
3. Completar centro y contexto docente.
4. Revisar la oferta en Ajustes → Suscripción y pagos.
5. Cuando Paddle Sandbox esté configurado, abrir el checkout autorizado, revisar fecha del primer cargo y aceptar expresamente la renovación. Introducir la tarjeta en Paddle; AulaBase no recibe sus datos.
6. Activar cobertura solo tras la confirmación del proveedor validada por el servidor. Consultar fecha, cancelación, pagos y soporte en el mismo panel.

## Comprobaciones realizadas

- Las pruebas de portada, registro, CTA de precios, confirmación del onboarding y métodos no habilitados fallaron antes de las correcciones correspondientes y pasaron después.
- `pnpm --filter backend test`: **85 archivos y 6.648 pruebas**, código 0.
- `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend exec vitest run --maxWorkers=1 src/modules/billing src/modules/promo src/modules/auth src/modules/settings src/App.redirect.spec.tsx`: **23 archivos y 129 pruebas**, código 0 en la revisión final.
- `pnpm --filter frontend build`: código 0, con el aviso de tamaño de chunks existente.
- `pnpm cloudflare:build`: código 0, cuatro tareas correctas y `wrangler deploy --dry-run`; sin despliegue. Se detuvo únicamente el backend local verificado para liberar la DLL de Prisma y se restauró después; `/api/v1/health` devolvió 200.
- ESLint sobre los componentes y datos modificados: código 0.
- Chrome: portada anónima → precios → registro comprobado sin crear una cuenta; Precios → gestionar suscripción comprobado con la sesión local existente y llegada a la pestaña correcta de Ajustes. Precio y referencia visibles; contratación con tarjeta no disponible en esa cuenta.
- La evidencia visual local del flujo, sin datos de estudiantes ni credenciales, se archivó fuera del repositorio durante la limpieza del 18/10/2026.

## Límites y pendientes

Paddle Sandbox todavía necesita cuenta/credenciales, un precio mensual de 799 centavos USD con prueba gratuita de un mes y tarjeta obligatoria, vínculo al catálogo, webhook y prueba real del proveedor. No se habilitó enforcement ni cobros reales. No se crearon cuentas, pagos o pruebas en producción para verificar esta interfaz. Tampoco se ejecutaron migraciones ni se cambiaron datos o secretos remotos.

La inspección remota de Staging detectó una entrega antigua con «Importe y moneda pendientes». Este arreglo se verifica en localhost, conforme a la aclaración del propietario; no modifica la web principal ni publica Staging.

Se intentó una revisión acotada de solo lectura con `deepseek-worker` de OpenCode. El servicio devolvió `Unexpected server error` (`err_8f08a9a4`), sin resultado utilizable. La revisión del diff y las comprobaciones quedaron a cargo del agente principal.

## Ajuste visual posterior: solo el plan Docente

El propietario pidió recuperar el diseño anterior de las tarjetas de precios y ocultar los planes Centro e Institucional, aplazados. `/precios` presenta ahora una única tarjeta Docente centrada: descripción breve, precio destacado, periodicidad mensual, referencia DOP, mes gratis con tarjeta, botón redondeado y lista de funciones separada por una línea. Se retiró la tabla comparativa; no se ofrecen anualidades. Las condiciones detalladas se consultan en desplegables debajo de la tarjeta. Registro, gestión en Ajustes y oferta compartida mantienen sus destinos y condiciones.

- La prueba de precios falló antes del ajuste y pasó después. `pnpm --filter frontend exec vitest run src/modules/promo`: **3 archivos y 4 pruebas**, código 0.
- `pnpm --filter backend test`: **85 archivos y 6.648 pruebas**, código 0; `pnpm --filter backend build`: código 0.
- `pnpm --filter frontend build`: código 0. El primer intento detectó una opción `exact` no admitida por el tipo de Testing Library; se sustituyó por una expresión regular anclada y se repitieron prueba y compilación.
- ESLint de la página y su prueba: código 0.
- `pnpm cloudflare:build`: código 0, cuatro tareas correctas y dry-run sin despliegue. El backend local se detuvo para liberar Prisma y se restauró después.
- Chrome local: una tarjeta Docente con US$7.99, sin Centro/Institucional ni tabla; desplegable de moneda abierto y cerrado correctamente, mostrando tasa y fecha. La captura se archivó fuera del repositorio durante la limpieza del 18/10/2026.
- La revisión delegada a OpenCode volvió a fallar por error de servicio (`err_e410d38c`); no produjo cambios ni aprobación de revisión. El agente principal revisó el resultado.

Este ajuste se aplica a localhost y a la rama de trabajo. No publica la web principal ni activa cobros.

## Llamada a la acción de prueba gratuita

El propietario pidió una presentación comercial más atractiva. La tarjeta Docente destaca el mes gratuito antes del precio y usa un botón azul «Probar un mes gratis» que enlaza a `/registro`. El precio sigue siendo US$7.99 mensuales después del mes gratis; se explican tarjeta obligatoria, referencia DOP y renovación automática. «Primero crearás tu cuenta» aclara el siguiente paso sin atribuir activación al enlace.

La prueba del CTA falló antes del cambio y pasó después. Suite de promoción: 3 archivos y 4 pruebas, código 0; backend: 85 archivos y 6.648 pruebas, código 0. Compilaciones independientes de backend y frontend y lint de la página/prueba: código 0. Se conserva la configuración de pagos sin cambios. La evidencia visual local del CTA se archivó fuera del repositorio durante la limpieza del 18/10/2026.

OpenCode no pudo completar la revisión de solo lectura por un error de servicio (`err_3947cba4`); el principal revisó el diff. No se habilitaron cobros ni se publicaron cambios en la web principal.

`pnpm cloudflare:build` final: código 0, cuatro tareas correctas y dry-run sin despliegue. Se restauró el backend local tras liberar la DLL de Prisma para compilar.

## Preparación de conexión a la cuenta Paddle (15/10/2026)

La cuenta abierta por el propietario correspondía a Live (`vendors.paddle.com/onboarding/get-started`). Se siguió el enlace visible «Cambiar a Sandbox», que llevó al inicio de sesión independiente de pruebas. El propietario indicó que estaba creando la cuenta Sandbox; no se completaron contraseñas ni aceptación de términos en su nombre. Live y los cobros reales permanecen sin cambios.

Se creó `.env.billing-sandbox.local` desde el ejemplo, después de comprobar que está ignorado por Git y que no existía. No contiene credenciales, y sus controles de facturación siguen desactivados. No se cargó en el servidor local conectado a producción.

`node scripts/test-billing-database.mjs --workflows --worker` terminó con código 0 contra PostgreSQL 17 desechable, publicado únicamente en `127.0.0.1:55439`: **81 migraciones**, RLS/privilegios, cobertura, consentimiento, reserva de checkout, prueba confirmada por proveedor simulado, idempotencia, cancelación, ausencia de pagos cero y firmas sobre bytes originales en Node/workerd. El script eliminó la base temporal al terminar; no consultó ni modificó Supabase de producción. Estos resultados no equivalen a haber completado un checkout real en Paddle Sandbox.

Pendientes de la conexión externa: terminar el acceso a Sandbox, configurar producto/precio mensual USD7.99 con mes gratuito y tarjeta, credenciales locales, default payment link y webhook HTTPS de pruebas, verificar el catálogo remoto y completar el recorrido con tarjeta de prueba. No se ha declarado conectada la pasarela. La documentación oficial de Paddle revisada mantiene el período de prueba como atributo del precio y exige default payment link antes de crear transacciones.

La búsqueda de conectores no encontró un plugin Paddle disponible en esta sesión. El intento de revisión acotada con `deepseek-worker` falló por error del servicio (`err_d8b0fa5b`), sin resultado utilizable; la revisión se realizó directamente.
