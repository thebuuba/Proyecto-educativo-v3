# Aceptación con Paddle Sandbox · 15 de octubre de 2026

Rama: `feat/suscripciones-pagos-20261015`. Esta evidencia corresponde a llamadas reales a **Paddle Sandbox**, un navegador Chrome y PostgreSQL local desechable. No acredita cobros Live ni despliegue a producción.

## Configuración comprobada

- Producto SaaS `pro_01m50m6qjz9fk2rawexb13p7kv`, «AulaBase · Docente Completo».
- Precio activo `pri_01m50m95gsym6pt64xc2pe4e2b`: USD 799 centavos, ciclo de un mes, impuestos incluidos, cantidad exactamente uno y sin precios alternativos por país.
- Prueba gratuita de un mes natural, con `requires_payment_method=true`. La API real omite `trial_period.unit_price` cuando es gratis; el diagnóstico se corrigió para aceptar ese campo ausente o nulo, conservando el rechazo de pruebas cobradas y sin tarjeta.
- Cero conversiones automáticas de moneda. La referencia en DOP de la aplicación no cambia la moneda facturada.
- Clave de servidor limitada a clientes, precios, transacciones, suscripciones, portal y lectura de destinos. Vence el **14 de noviembre de 2026**. Token público de Paddle.js y secreto del webhook guardados exclusivamente en `.env.billing-sandbox.local`, ignorado por Git.
- Destino `ntfset_01m50mpkb8ac2tbsh1mkcbdf36`, doce eventos de plataforma. El diagnóstico `--online` verificó el precio y el destino mediante dos GET y comparó el secreto sin imprimirlo.

La aceptación usa un contenedor PostgreSQL en `127.0.0.1:55439`, con 81 migraciones y ejecución del backend mediante `app_backend`. Backend y frontend de pruebas: puertos **3007** y **5174**. Sus usuarios, centro, sesión y catálogo son sintéticos. Los auxiliares de sesión están solo en `.opencode/`, fuera del código de la aplicación, y no deben desplegarse.

Cloudflare Tunnel expone únicamente **POST `/api/v1/billing/webhooks/paddle`** hacia el backend aislado; otras rutas públicas devuelven 404. Dirección temporal de esta sesión: `https://kent-april-outstanding-around.trycloudflare.com`. No conecta con el backend habitual del puerto 3000 ni con Supabase de producción.

## Flujo comprobado con el proveedor

1. En Ajustes → Suscripción y pagos se presentaron importe, moneda, tarjeta obligatoria, mes gratuito y renovación, con dos confirmaciones explícitas antes de reservar el intento.
2. El checkout de Paddle se abrió con la transacción `txn_01m50n2ndpebgt0gfhxqchghgr`, mostró «Prueba gratis de 1 mes», USD 0.00 hoy y USD 7.99 desde el 15 de noviembre. Se completó con una tarjeta oficial de Sandbox y datos sintéticos.
3. La suscripción `sub_01m50n4pr8affhp8yyfty97tdy` quedó `trialing`. Se recibieron de Paddle `subscription.trialing`, `subscription.created` y `transaction.completed`, todos procesados con firma válida y sin error. Fechas confirmadas: **2026-10-15 20:47:58.722Z → 2026-11-15 20:47:58.722Z**.
4. Antes de convertir la prueba: **una prueba, cero pagos, cero recibos y cero períodos pagados**. La interfaz mostró prueba activa y fecha de vencimiento. El retorno del navegador no concedió por sí solo la cobertura.
5. «Cancelar renovación» obtuvo confirmación de Paddle: cambio `cancel` programado para el final del mes y cobertura conservada. Su `subscription.updated` fue procesado con firma válida. El dashboard registró dos intentos de entrega para este evento; no se afirma que todos los eventos se entregaran al primer intento.
6. La creación real de sesión del portal devolvió exclusivamente un destino `sandbox-customer-portal.paddle.com`. Su URL de sesión no se registra. Repetir el checkout del mismo titular devolvió HTTP 409 sin otra transacción remota.
7. Para comprobar el primer pago sin esperar un mes, se activó anticipadamente **solo esta suscripción sintética** mediante la API de Sandbox. Esto es una operación de aceptación, no un cambio en el flujo ofrecido al docente. Paddle confirmó `active` y conservó la cancelación programada.
8. Pago simulado `txn_01m50nc14xr02ptfj1cdeq3prr`: **799 USD centavos**, `succeeded`, exactamente un pago, un período **2026-10-15 20:51:58.648Z → 2026-11-15 20:51:58.648Z** y un recibo comercial local. La prueba pasó a `converted`, sin segunda prueba. El acceso efectivo pasó a `paid`. Los eventos `subscription.activated`, `subscription.updated` y `transaction.completed` se procesaron con firma válida.
9. Con otro docente sintético del mismo centro, la tarjeta de rechazo oficial produjo el mensaje de error de Paddle y `transaction.payment_failed`, procesado con firma válida. La transacción `txn_01m50ngchsfc5r2vfx90z71zf0` quedó `ready`, con intento `error/declined`, sin suscripción remota. La cuenta conserva **cero pruebas, cero pagos y cero períodos pagados**, sin afectar al titular que pagó. El enforcement académico continúa apagado para la aceptación.
10. Se reenvió desde Paddle la notificación del pago ya acreditado. La nueva notificación de entrega `ntf_01m50ny39nqybtveqqbg211nnk` quedó **Delivered**, y su log confirmó **HTTP 201, `accepted=true`, `status=duplicate`**. Después del reenvío siguen existiendo exactamente una prueba, un pago de 799 centavos, un período y un recibo. No se generó otro ingreso ni otra cobertura.

El recibo local no se presenta como comprobante fiscal dominicano. No se ha movido dinero real.

## Incidencias resueltas durante la aceptación

- El diagnóstico confundía un campo ausente con una prueba cobrada. Se reprodujo con la respuesta real, se añadió una regresión que falló y luego pasó con la corrección.
- Paddle rechazó `checkout.url` con localhost, tanto HTTP como HTTPS con puerto, con `transaction_checkout_url_domain_is_not_approved`, aunque la configuración visual mostraba el enlace predeterminado como aprobado. El dominio temporal HTTPS se registró en Sandbox y apareció «Checkout approved»; ese origen permitió crear la transacción. No se desactivó la validación de destinos.
- Los dos intentos rechazados quedaron reservados. Antes de cerrarlos exclusivamente en la base desechable se consultó al proveedor y se comprobó que no existía ninguna transacción para el cliente. Se conservaron ambos registros y su diagnóstico; no se borraron reservas ni se habilitaron reintentos ambiguos en producción.
- La interfaz mostraba «Cancelar renovación» también sobre intentos vencidos. Se añadió una regresión y se limitó la acción a Paddle `active`, `trialing` o `past_due`, sin cancelación ya programada, de acuerdo con las reglas del servidor.
- El primer Replay de Paddle devolvió HTTP 400 `payload_mismatch`. La comparación entre el cuerpo original persistido y el reenvío demostró que **solo cambiaba `notification_id`**, un dato de entrega. Se corrigieron las tres rutas de deduplicación —lectura inicial, upsert concurrente y carrera de unicidad— para comparar el contenido del evento ignorando únicamente ese campo de primer nivel. Se siguen verificando los bytes originales antes de consultar el evento y se conserva el hash original para auditoría. Cambiar datos del pago sigue siendo rechazado, incluso con una firma válida. Las tres regresiones de Replay fallaron antes de la corrección; después pasaron en Node, workerd y en el reenvío real de Paddle. El fallo inicial queda conservado en el historial del proveedor, no borrado.
- La revisión con `deepseek-worker` de OpenCode falló por un error de su servidor (`err_d928e027`), sin producir revisión ni cambios. Se realizó una revisión independiente del diff y no encontró problemas concretos.

## Validación y límites

Se reprodujeron los fallos antes de corregirlos y se ejecutaron sus regresiones: **11 pruebas** del diagnóstico, **23 pruebas** de la página comercial y **46 pruebas** del servicio de eventos aprobadas. Backend completo: **85 archivos, 6.652 pruebas aprobadas**. La revisión independiente señaló una incompatibilidad entre los tipos JSON de entrada y salida de Prisma; se confirmó el error de TypeScript y se corrigió el parámetro a `unknown`, validado internamente con `asRecord`, antes del build final.

| Comando ejecutado sobre el resultado final | Resultado |
| --- | --- |
| `node --test scripts/billing-sandbox-check.test.mjs` | 11 aprobadas |
| `pnpm --filter frontend test -- src/modules/billing/pages/BillingPage.spec.tsx` | 23 aprobadas |
| `pnpm --filter backend test` | 6.652 aprobadas |
| `pnpm --filter backend build` | salida 0 |
| `pnpm --filter frontend build` | salida 0; aviso de chunks grandes |
| `pnpm cloudflare:build` | salida 0; empaquetado y `wrangler --dry-run`, sin despliegue |
| `node scripts/test-billing-database.mjs --workflows --worker` | salida 0; 81 migraciones, RLS, workflows, HTTP real y workerd |
| Diagnóstico `--online` con las credenciales locales ignoradas | salida 0; precio y destino reales confirmados |

Workerd comprobó entrega firmada, nuevo `notification_id` aceptado como duplicado, cambio de contenido rechazado y firma falsa o bytes alterados rechazados. Los workflows de reembolsos y conciliación utilizan HTTP del proveedor simulado; se distinguen de los escenarios reales anteriores y no los sustituyen. No se crearon migraciones nuevas ni se modificaron esquemas remotos en esta entrega.

La web principal, `main`, las credenciales Live y la configuración del backend habitual conectado a producción no se modificaron en esta aceptación. La configuración local de credenciales conserva los flags desactivados: solo el proceso aislado habilitó contratación y eventos durante la prueba. Al cerrarla se desactivan nuevas contrataciones en ese proceso y se mantiene el receptor de eventos. Un túnel temporal no equivale a una URL estable para operar el servicio; antes de trasladar Sandbox a un despliegue persistente hay que configurar su origen y receptor HTTPS, registrar el dominio en Paddle y repetir la aceptación allí.

Las renovaciones por calendario, recuperación de una renovación fallida y reembolsos del proveedor requieren escenarios adicionales de Sandbox; sus reglas locales ya tienen cobertura automatizada con proveedor simulado. No se presentan como verificados con dinero real ni como autorización para lanzar Live.

Capturas locales, sin secretos: `output/screenshots/paddle-sandbox-checkout.png`, `paddle-sandbox-alta-completada.png`, `aulabase-sandbox-prueba-activa.png` y `paddle-sandbox-reenvio-201.png`. Los logs y auxiliares de aceptación permanecen en `.opencode/` y no se incluyen en Git.
