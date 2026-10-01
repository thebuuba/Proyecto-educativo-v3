# Sesión persistente y verificación contextual de AulaBase

## Objetivo

Una persona que vuelve al mismo navegador debe acceder sin repetir el inicio de sesión mientras su sesión de Supabase siga vigente. La cuenta recordada sirve para reconocerla visualmente, nunca como credencial. Los accesos desde un navegador nuevo o un contexto sospechoso requieren una comprobación adicional.

## Comportamiento acordado

| Situación | Resultado |
| --- | --- |
| Vuelve otro día al mismo navegador con sesión renovable válida | La aplicación restaura la sesión y entra sin pedir correo ni contraseña. |
| Cookie de AulaBase caducada tras 8 horas, sesión de Supabase válida | Se renueva la sesión de Supabase y se emite otra cookie de AulaBase. |
| Sesión caducada o revocada, pero hay cuenta recordada | Se muestra nombre y correo; elegirla abre contraseña o enlace de acceso por correo. No entra solo por elegirla. |
| Cierra sesión explícitamente | Se invalidan la sesión local de Supabase y la cookie del backend; la cuenta puede seguir visible para agilizar el siguiente inicio, pero requiere credencial. |
| Navegador o dispositivo nuevo, o cambio contextual relevante al iniciar/renovar sesión | El backend exige verificación antes de emitir una cookie autenticada. |
| Sin conexión o error temporal del servidor | Se conserva la cuenta recordada y se muestra un error recuperable; no se trata como cierre de sesión definitivo. |

La sesión no se promete «para siempre»: termina por cierre de sesión, revocación, pérdida de datos del navegador, límites configurados en Supabase o controles de seguridad. No se alarga el JWT de AulaBase de 8 horas para resolver la persistencia; su renovación parte de la sesión de Supabase.

## Diseño

### 1. Persistencia y experiencia de acceso

- Conservar `persistSession`, `autoRefreshToken` y almacenamiento local de Supabase existentes.
- Restaurar la sesión al abrir la aplicación y después de un 401 renovando el token de Supabase y recreando la cookie del backend. Evitar renovaciones concurrentes y bucles de 401.
- Guardar el correo de la última cuenta tras un acceso confirmado, incluso si su perfil no trae nombre; mostrar el correo como alternativa. No guardar contraseñas, JWT propios ni códigos en la cuenta recordada.
- Mantener la opción de cambiar de cuenta. Para una cuenta recordada sin sesión válida, ofrecer contraseña y el enlace de correo ya soportado por Supabase.
- La sesión válida permite entrada automática; la tarjeta de cuenta recordada se usa cuando falta una sesión válida.

### 2. Verificación contextual en el servidor

- Evaluar el riesgo al crear o renovar la sesión de AulaBase, antes de emitir su cookie. El frontend solo presenta el resultado; no decide si omite la verificación.
- Registrar dispositivos confiables por usuario usando un identificador aleatorio en cookie `HttpOnly`, `Secure` en producción y `SameSite=Lax`. Guardar en la base solo el hash del identificador, fecha de verificación, navegador resumido y contexto de IP limitado. No usar huella invasiva del navegador.
- Exigir verificación para un dispositivo sin confianza o ante una combinación de señales nuevas. Un cambio de IP aislado no basta, ya que redes móviles, VPN y proveedores la cambian con frecuencia. Un cambio importante de navegador junto con IP/contexto nuevo eleva el riesgo.
- Para cuentas con factor TOTP inscrito, usar la verificación MFA de Supabase y comprobar `aal2` en el backend. Para cuentas sin TOTP, ofrecer un enlace/código de correo como comprobación de acceso al buzón. El correo es una comprobación contextual, no se presentará como MFA fuerte.
- Limitar los intentos y la frecuencia de envío; los retos caducan y son de un solo uso. No emitir la cookie de AulaBase hasta verificar el reto. «Cerrar sesión» termina la sesión, pero puede conservar la confianza del dispositivo; una acción separada para olvidar el dispositivo o revocar sesiones elimina esa confianza.
- Mantener el flujo de Google/Facebook: después de OAuth se aplica la misma evaluación antes de emitir la cookie de AulaBase.

### 3. Cambios de datos y compatibilidad

- Una migración nueva para los dispositivos confiables y retos necesarios, con privilegios de `app_backend` y política RLS explícita. Mantener alineados la migración, Prisma y los tipos frontend.
- Mantener las rutas existentes de inicio, cierre y recuperación. Extender el resultado de creación de sesión con un estado de verificación requerida, sin exponer información de cuentas no autenticadas.
- No usar servicios externos de geolocalización ni añadir dependencias para la primera versión. La IP es solo señal auxiliar observada en el servidor, detrás de los encabezados de proxy confiables.

## Verificación

- Pruebas de sesión restaurada al día siguiente, cookie caducada con refresh válido, sesión revocada, cierre explícito, cuenta sin nombre, fallo de red y recuperación tras 401.
- Pruebas del backend: dispositivo conocido/desconocido, IP aislada, señales combinadas, reto correcto/incorrecto/caducado, límites de intentos y OAuth.
- Pruebas de interfaz para acceso recordado y reto. Revisar manualmente en dos navegadores y después de reiniciar el servidor.
- Ejecutar `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`.

## Límites

El backend actual emite un JWT de 8 horas; una revocación externa de Supabase puede tardar hasta esa caducidad en afectar a una cookie ya emitida. La primera versión mantiene ese límite y comprueba la sesión de Supabase al renovar. Si el producto necesita revocación inmediata, habrá que validar `session_id` en solicitudes sensibles.
