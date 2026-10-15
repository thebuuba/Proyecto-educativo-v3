# Flujo comercial: precios, registro y suscripción

Revisión del 15/10/2026 en `feat/suscripciones-pagos-20261015`. El propietario confirmó que el problema se observaba en **localhost**.

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
- Evidencia visual local: `output/screenshots/flujo-suscripcion-local.png`. No contiene datos de estudiantes ni credenciales.

## Límites y pendientes

Paddle Sandbox todavía necesita cuenta/credenciales, un precio mensual de 799 centavos USD con prueba gratuita de un mes y tarjeta obligatoria, vínculo al catálogo, webhook y prueba real del proveedor. No se habilitó enforcement ni cobros reales. No se crearon cuentas, pagos o pruebas en producción para verificar esta interfaz. Tampoco se ejecutaron migraciones ni se cambiaron datos o secretos remotos.

La inspección remota de Staging detectó una entrega antigua con «Importe y moneda pendientes». Este arreglo se verifica en localhost, conforme a la aclaración del propietario; no modifica la web principal ni publica Staging.

Se intentó una revisión acotada de solo lectura con `deepseek-worker` de OpenCode. El servicio devolvió `Unexpected server error` (`err_8f08a9a4`), sin resultado utilizable. La revisión del diff y las comprobaciones quedaron a cargo del agente principal.
