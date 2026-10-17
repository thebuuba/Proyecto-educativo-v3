# Prueba de un mes con tarjeta y renovación mensual

El propietario aprobó US$7.99 mensuales, un mes natural gratuito con tarjeta obligatoria y renovación automática. Se mantiene Paddle, cobro en USD y referencia DOP fechada. Esta autorización no habilita dinero real ni publica la rama en la web principal.

1. Una oferta compartida identifica importe, moneda, período y referencia DOP del BCRD (14/10/2026, 61.6788 DOP/USD). La referencia no se presenta como conversión bancaria garantizada ni cotización en tiempo real.
2. Se retira la emisión de pruebas locales sin tarjeta. El titular debe completar el checkout sandbox y aceptar de forma explícita renovación, importe y condiciones. Las pruebas históricas conservan sus fechas.
3. El precio de Paddle debe tener ciclo mensual y `trial_period` de un mes, gratuito, con método obligatorio. El servidor lo consulta y valida antes de crear la transacción. Paddle.js solo ofrece tarjeta; la app nunca recibe ni guarda sus datos.
4. La cobertura de prueba se registra tras confirmar con la API la suscripción del titular y su transacción reservada. Se guardan fechas oficiales y un vínculo con la suscripción, sin fabricar un pago de importe cero. Se conserva una única prueba por cuenta, la idempotencia, la cancelación y el rechazo de eventos ajenos o sin firma.
5. Una nueva migración agrega el vínculo opcional de prueba a suscripción sin alterar las migraciones aplicadas ni revocar pruebas antiguas. Se alinean Prisma y tipos. La aplicación se verifica primero en PostgreSQL desechable.
6. Registro y Ajustes explican mes gratuito, tarjeta, importe posterior y renovación. El CTA abre el checkout autorizado; si no está configurado muestra indisponibilidad honesta. Se reemplazan las afirmaciones antiguas de 14 días/sin tarjeta.
7. Pruebas de contrato, propiedad, firma, calendario, precio remoto, consentimiento, duplicados, renovación/cancelación y fallo cerrado; cuatro comprobaciones obligatorias de AGENTS. Se actualizan diagnóstico y documentación del sandbox.

Pendientes externos: cuenta y credenciales Paddle Sandbox, precio remoto autorizado, destino de webhook y pruebas reales del proveedor. No crear una clave ni un identificador remoto ficticio para ocultar esos pendientes. Checkout/eventos reales permanecen desactivados mientras falten.
