# Sesión persistente y verificación contextual — plan de implementación

> **Para agentes implementadores:** usar `executing-plans` para ejecutar estas tareas en orden. Marcar las casillas al verificar cada paso.

**Objetivo:** restaurar la sesión en visitas posteriores y exigir verificación contextual, decidida en el servidor, antes de emitir una sesión nueva en un dispositivo de riesgo.

**Arquitectura:** Supabase conserva y renueva la sesión larga; AulaBase mantiene su JWT de 8 horas y lo recrea desde un token Supabase válido. Un registro de dispositivos confiables y el método de autenticación del token Supabase determinan si `/auth/session` emite cookie o solicita paso adicional. La interfaz muestra cuenta recordada y conduce la verificación.

**Tecnologías:** React, NestJS, Prisma/Postgres, Supabase Auth, Vitest, pnpm.

**Especificación:** `docs/superpowers/specs/2026-10-01-sesion-persistente-verificacion-contextual-design.md`.

## Restricciones globales

- pnpm; sin dependencias nuevas ni cambios a migraciones antiguas.
- Migración nueva creada con `supabase migration new`; esquema Prisma, tipos frontend y SQL alineados; `app_backend` con privilegios y RLS explícita.
- La verificación se aplica antes de emitir la cookie HttpOnly. `localStorage` solo guarda datos visibles de la última cuenta, nunca una credencial de AulaBase.
- `auth-design.css` y la paleta semántica rigen la interfaz. Todos los commits en español.
- No prometer una sesión eterna: Supabase o el usuario pueden revocarla. Mantener JWT y cookie del backend en 8 horas.

## Archivos y contratos

- `apps/frontend/src/modules/auth/context/AuthProvider.tsx`, `services/authService.ts`, `pages/LoginPage.tsx`, `pages/AuthCallbackPage.tsx`, `types/auth.ts`, `context/AuthContext.ts`: restauración, cuenta recordada, reto y callback.
- `apps/backend/src/modules/auth/auth.controller.ts`, `auth.service.ts`, `supabase-user.ts`, `session-cookie.ts`, nuevo `device-trust.ts`: evaluación de riesgo y emisión de cookies.
- `supabase/migrations/<nuevo>_trusted_auth_devices.sql`, `packages/database/prisma/schema.prisma`, `apps/frontend/src/types/database.types.ts`: almacenamiento del dispositivo confiable.
- Contrato HTTP: `POST /auth/session` y el login alternativo devuelven `409` con `VERIFICATION_REQUIRED` y `method: 'email' | 'totp'` sin cookie de AulaBase. Un token Supabase validado con método `magiclink`/`otp` reciente o `aal2` tras TOTP permite completar la sesión. La respuesta normal conserva su forma actual.

## Focos de revisión

- El inicio alternativo `/auth/login` no puede evitar la evaluación de riesgo.
- El callback de OAuth o enlace de correo no puede emitir cookie antes de completar un reto pendiente.
- Una IP cambiante por sí sola no debe forzar un correo diario.
- Un error de red durante la restauración no debe borrar la cuenta recordada ni provocar un bucle de 401.
- La sesión de una cuenta no puede reutilizar la cookie de confianza de otra.

### Tarea 1: restauración y cuenta recordada

**Pruebas:** `LoginPage.spec.tsx`, pruebas de `AuthProvider` y `authService.spec.ts`.

- [ ] Escribir pruebas que fallen: cuenta con solo correo; enlace de acceso para cuenta recordada; cookie backend vencida + refresh Supabase válido; cierre explícito; error de red conservando la cuenta; varias respuestas 401 provocan una sola renovación.
- [ ] Ejecutar `pnpm --filter frontend exec vitest run src/modules/auth/pages/LoginPage.spec.tsx src/modules/auth/services/authService.spec.ts` y confirmar el fallo esperado.
- [ ] Cambiar `getRememberedAccount()` para aceptar correo sin nombre y mostrar correo como nombre alternativo. Recuperar la acción `requestMagicLink(email)` en la página.
- [ ] En `AuthProvider`, serializar `restoreFromSupabaseSession()` y distinguir 401 de fallo transitorio; evitar `createAulaSession()` concurrentes desde bootstrap, 401 y `TOKEN_REFRESHED`. Conservar `logout()` como revocación explícita.
- [ ] Repetir las pruebas anteriores y comprobar resultado verde. Commit en español.

### Tarea 2: dispositivo confiable y decisión de riesgo

**Pruebas:** nuevas `device-trust.spec.ts`, `auth.controller.spec.ts` y casos de `auth.service.spec.ts`.

- [ ] Escribir pruebas que fallen: dispositivo conocido pasa; nuevo requiere reto; IP sola cambia sin reto; cambio de navegador e IP requiere reto; hash de dispositivo ajeno no pasa; cookie faltante no pasa; método de correo reciente y `aal2` satisfacen el reto; método antiguo no lo satisface; login alternativo no omite el control.
- [ ] Ejecutar pruebas específicas de backend y confirmar el fallo esperado.
- [ ] Crear migración mediante `supabase migration new trusted_auth_devices`. Tabla `trusted_auth_devices`: UUID, `user_id` FK, `token_hash` único, `browser_signature`, `network_hash` opcional, `verified_at`, `last_seen_at`, `revoked_at`; índice por usuario. Habilitar RLS y otorgar acceso explícito a `app_backend`. Agregar modelo Prisma y tipo correspondiente.
- [ ] Implementar `device-trust.ts`: token aleatorio con `node:crypto`, SHA-256 antes de persistir, cookie `HttpOnly`/`Secure`/`SameSite=Lax`, firma básica del navegador, hash del contexto de IP obtenido solo de datos confiables del servidor; no confiar en `X-Forwarded-For` del cliente. El cambio de red aislado no obliga a verificar.
- [ ] Validar primero el token Supabase con Auth y después leer `aal`, `amr`, `session_id` y `sub` de sus claims. Exigir coincidencia de usuario y método reciente (máximo 10 minutos). Para cuentas con TOTP verificado, exigir `aal2` y un `totp` reciente; para las demás, `magiclink`/`otp` de correo reciente. Recalcular el riesgo en el servidor al reintentar; los enlaces y retos de un solo uso y sus límites de envío quedan a cargo de Supabase.
- [ ] Aplicar el mismo control a `/auth/session`, `/auth/login` y retorno OAuth antes de `respondWithSession`. Al terminar onboarding, registrar el dispositivo sin bloquear la creación de cuenta. El 409 no debe incluir cookie de sesión.
- [ ] Ejecutar pruebas específicas, `prisma validate` y compilación backend. Commit en español.

### Tarea 3: flujo de verificación en frontend

**Pruebas:** `LoginPage.spec.tsx`, `AuthCallbackPage.spec.tsx` y `authService.spec.ts`.

- [ ] Escribir pruebas que fallen: 409 de contraseña muestra envío de enlace; 409 de OAuth/callback conduce a verificación; enlace completado reintenta `/auth/session`; TOTP inscrito solicita código y verifica con Supabase MFA; error o caducidad conserva una salida hacia otro método.
- [ ] Ejecutar pruebas específicas y confirmar el fallo esperado.
- [ ] Tipar `VERIFICATION_REQUIRED`; mantener sesión Supabase provisional sin marcar `isAuthenticated` hasta recibir cookie de AulaBase. Usar `requestMagicLink()` existente para correo y `supabase.auth.mfa.challengeAndVerify()` para TOTP. El callback reintenta la creación de sesión con el token recién emitido.
- [ ] Añadir pantalla de reto con controles redondeados y estilos en `modules/auth/auth-design.css`; mantener el acceso con contraseña, Google y Facebook. No llamar «MFA» al enlace de correo.
- [ ] Repetir pruebas frontend y realizar prueba manual en dos navegadores, tras reiniciar el backend y con cookie de 8 horas simulada. Commit en español.

### Tarea 4: revisión y cierre

- [ ] Revisar migración, privilegios, RLS, atributos de cookies, rutas alternativas, códigos de error y protección contra bucles de renovación.
- [ ] Ejecutar `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`, `pnpm cloudflare:build` y registrar resultados.
- [ ] Comprobar `git diff --check` y estado limpio; corregir los fallos antes de declarar terminado.
