# Perfil y preferencias reales — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la pantalla Perfil de Polymet en un formulario real de AulaBase, conservando su distribución, tarjetas y fondo aprobado.

**Architecture:** Extender el módulo de perfil con una relación de ajustes por usuario y endpoints autenticados. Conservar GET/PATCH `/profile` para sus consumidores actuales y añadir GET/PATCH `/profile/settings`. La pantalla recuperada consume un contrato compartido tipado; los componentes visuales se conservan.

**Tech Stack:** NestJS, Prisma/PostgreSQL, Supabase Storage, React, TypeScript, Vitest y pnpm; sin dependencias nuevas.

**Spec:** `docs/superpowers/specs/2026-10-15-ajustes-reales-design.md`, entrega 1 y requisitos transversales.

## Global Constraints

- Conservar las cinco pantallas aprobadas y el fondo de AulaBase.
- Los datos escolares incorporan además el límite de escuela y rol.
- El cliente no elige el propietario ni modifica roles, saldos o estados comerciales.
- Crear migraciones nuevas con `supabase migration new`, alineadas con Prisma y `database.types.ts`.
- Toda tabla de aplicación incorpora privilegios de `app_backend` y política RLS explícita.
- Si falla una petición se conserva el borrador.
- El selector de idioma solo ofrece traducciones disponibles.
- No sustituir datos desconocidos por cantidades inventadas.
- Esta entrega no elimina las demás del alcance: seguridad, pagos, notificaciones, privacidad y comunidad/certificados tendrán sus propios planes.

## Review Focus

1. Usuario sin ajustes ni vínculo docente/estudiante: campos vacíos y métricas no disponibles, sin identidad ficticia. Pruebas en tareas 1 y 3.
2. Fechas civiles cerca de medianoche y zonas con horario estacional: nacimiento sin desplazamiento; fechas de cuenta según zona IANA. Pruebas en tareas 1 y 3.
3. Respuestas fuera de orden al cambiar cuenta o salir: no sustituir datos de la cuenta actual. Prueba en tarea 3.
4. Error de almacenamiento o de BD al cambiar foto: conservar el avatar anterior y limpiar únicamente el archivo nuevo propio. Pruebas en tarea 2.
5. Dos guardados o dos cambios de foto simultáneos: impedir clics repetidos y proteger eliminación mediante propiedad y comparación del avatar anterior. Pruebas en tareas 2 y 3.

## Contrato y archivos

Crear `packages/shared/src/profile-settings.ts` y exportarlo desde `packages/shared/src/index.ts`.

`ProfileSettings` devuelve `id`, `fullName`, `email`, `phone`, `avatarUrl`, `createdAt`, `roles: string[]`, `institution: string`, `academicIdentifier: {label: string; value: string} | null`, `preferences`, `stats` y `completeness`.

`ProfilePreferences` contiene `publicName: string | null`, `bio: string | null`, `birthDate: string | null` (YYYY-MM-DD), `country: string | null` (ISO de dos letras), `city: string | null`, `educationLevel: string | null`, `language: 'es'`, `timezone: string` e `interests: string[]`.

`UpdateProfileSettingsInput` permite `fullName?`, `phone?` y `preferences?`. Identidad institucional, roles, email, avatar y contadores nunca entran en esta actualización. `ProfileMetric` es `{id: string; label: string; value: number | null}`; `null` significa dato aún no registrado, distinto de cero.

La persistencia `UserProfileSettings`/`user_profile_settings` tiene `userId` como PK/FK única con borrado en cascada, los campos de preferencias, `avatarPath: string | null`, `createdAt` y `updatedAt`. La zona por defecto es `UTC`; español es el único idioma actualmente traducido. Los campos personales opcionales inician en NULL e intereses en array vacío. No copiar identidad de la plantilla ni sobrescribir el expediente institucional.

### Tarea 1: perfil persistente, validación y contexto académico

**Files:**
- Modify: `packages/database/prisma/schema.prisma`, `apps/frontend/src/types/database.types.ts`, `packages/shared/src/index.ts`.
- Create: `packages/shared/src/profile-settings.ts`, `supabase/migrations/<timestamp>_user_profile_settings.sql` (nombre generado por CLI).
- Create: `apps/backend/src/modules/profile/dto/update-profile-settings.dto.ts`.
- Modify: `apps/backend/src/modules/profile/profile.controller.ts`, `profile.service.ts`, `profile.controller.spec.ts`, `profile.service.spec.ts`.

**Interfaces:** `ProfileService.getSettings(user: AuthenticatedUser): Promise<ProfileSettings>` y `updateSettings(user: AuthenticatedUser, dto: UpdateProfileSettingsDto): Promise<ProfileSettings>`; GET/PATCH `/profile/settings` bajo `JwtAuthGuard`.

- [ ] Escribir pruebas de lectura sin ajustes, aislamiento por `user.id` y `schoolId`, y actualización transaccional de nombre/teléfono/preferencias. Verificar que `email`, `roles`, `schoolId`, `userId` y campos desconocidos se rechazan en DTO y se excluyen en servicio.
- [ ] Añadir pruebas de límites: nombre 1–200 caracteres tras trim; teléfono nullable hasta 50; nombre público hasta 80; biografía hasta 240; ciudad hasta 120; máximo 5 intereses únicos del catálogo; país del catálogo; nivel del catálogo; idioma `es`; zona IANA validada con `Intl.DateTimeFormat`. Fecha real YYYY-MM-DD, no futura, sin conversión de zona; rechazar `2026-02-30` y conservar `1999-04-18` exactamente.
- [ ] Ejecutar `pnpm --filter backend test -- src/modules/profile/profile.service.spec.ts src/modules/profile/profile.controller.spec.ts`; confirmar que los casos nuevos fallan por endpoints y métodos ausentes.
- [ ] Ejecutar `supabase migration new user_profile_settings`; implementar tabla, restricciones y relación Prisma, tipos frontend, permisos SELECT/INSERT/UPDATE/DELETE de `app_backend` y política RLS explícita siguiendo el modelo de acceso de las migraciones actuales. Sin acceso público de `anon` ni lectura de perfiles ajenos desde `authenticated`.
- [ ] Implementar lectura con valores vacíos predeterminados sin crear registros al consultar; escritura transaccional con upsert de ajustes y actualización del usuario. Una propiedad omitida conserva el valor; NULL limpia solo los campos nullable. Devolver el perfil completo confirmado.
- [ ] Resolver institución y código desde escuela/docente/estudiante del usuario, nunca desde campos editables. Contar cursos asignados activos del docente en año activo; para estudiante, cursos de su sección/matrícula activa. Para otros roles sin asignación, la métrica es no disponible. Filtrar todas las consultas por escuela y evitar doble conteo en usuarios con varios roles. Certificados y horas permanecen `null` hasta sus entregas.
- [ ] Calcular completitud por presencia de los diez campos: nombre, teléfono, avatar, nombre público, biografía, nacimiento, país, ciudad, nivel e intereses (10 puntos cada uno). Describir como datos completados; no afirmar verificación telefónica.
- [ ] Generar Prisma con el comando del paquete y ejecutar las pruebas anteriores hasta PASS. Aplicar y comprobar la migración en base local aislada, incluyendo intento de acceso no autorizado; no modificar producción.
- [ ] Revisar el diff; guardar este bloque en un commit español con rutas explícitas después de sus comprobaciones. No incluir cambios anteriores ajenos al bloque.

### Tarea 2: subir y quitar avatar real

**Files:**
- Create: `apps/backend/src/modules/profile/profile-avatar.ts`, `profile-avatar.spec.ts`.
- Modify: `apps/backend/src/modules/profile/profile.controller.ts`, `profile.module.ts`, `profile.service.ts`, `profile.service.spec.ts`, `dto/update-profile.dto.ts`.
- Migration: crear bucket privado `profile-avatars` dentro de la migración nueva, con límite de 2 MiB y tipos JPEG/PNG/WebP; denegar listado y escritura directa de clientes.

**Interfaces:** `ProfileAvatar.upload(user: AuthenticatedUser, file: {buffer: Buffer; mimetype: string}): Promise<ProfileSettings>`, `remove(user): Promise<ProfileSettings>`, `read(user): Promise<{bytes: Uint8Array; contentType: string}>`. POST/DELETE/GET `/profile/avatar`; POST multipart `file` usando el mecanismo Nest ya usado para comprobantes. GET devuelve imagen autenticada con caché privada y no se envuelve como JSON.

- [ ] Escribir pruebas para contenido/firma discordante, SVG, archivo vacío, exceso de 2 MiB, error Storage, error de BD posterior a subir, reemplazos simultáneos y eliminación ajena. Afirmar que el avatar anterior sigue disponible tras fallo y que solo se elimina una ruta propiedad del usuario.
- [ ] Ejecutar `pnpm --filter backend test -- src/modules/profile/profile-avatar.spec.ts`; confirmar FAIL inicial.
- [ ] Implementar validación de firma binaria reutilizando el patrón de comprobantes, sin acoplar perfil al módulo de pagos. Usar fetch con credenciales de servidor, timeout de 10 segundos, redirect rechazado y rutas `${user.id}/${randomUUID()}`. Nunca recibir una ruta de almacenamiento del cliente.
- [ ] Subir primero; persistir `avatarPath` y `AppUser.avatarUrl` en transacción. El avatar administrado usa ruta estable del mismo origen `/api/v1/profile/avatar?v=<uuid>` para funcionar en cabeceras existentes sin URL firmada caducada. Leer exige cookie y siempre resuelve el archivo del usuario actual, sin tomar propietario desde parámetros.
- [ ] Permitir que el PATCH antiguo conserve su misma ruta de avatar administrado, comprobando igualdad con la guardada; rechazar otras rutas relativas. Mantener soporte de URLs http/https del formulario antiguo. Al sustituir/quitar avatar administrado desde ese flujo, limpiar también su referencia y archivo propio después del commit. No realizar fetch de URLs externas.
- [ ] Serializar mutaciones de avatar por usuario con bloqueo transaccional en BD, sin mutex de proceso. Quitar referencia antes de borrar objeto; si falla la limpieza, conservar acceso funcional al archivo nuevo y registrar la limpieza fallida sin exponer credenciales. Error de persistencia limpia el objeto recién subido.
- [ ] Ejecutar pruebas hasta PASS, incluyendo que otro usuario no obtiene los bytes del avatar mediante el parámetro `v`. Revisar y hacer commit español de este bloque.

### Tarea 3: conectar la pantalla aprobada

**Files:**
- Create: `apps/frontend/src/modules/settings-reference/services/profileSettingsService.ts`, `pages/profile-settings-page.spec.tsx`, `data/profile-catalogs.ts`.
- Replace: `pages/profile-settings-page.jsx` y su `.d.ts` por `pages/profile-settings-page.tsx`.
- Modify: `components/personal-info-form.jsx`, `academic-info-card.jsx`, `profile-identity-card.jsx`, `settings-save-bar.jsx`, `ReferenceSettingsPanel.tsx`, `ReferenceSettingsPanel.spec.tsx`, `data/settings-data.jsx`.
- Modify tests: `apps/frontend/src/modules/school-administration/pages/SchoolAdministrationPage.spec.tsx`, `apps/frontend/src/modules/profile/pages/ProfilePage.spec.tsx` si cambian las expectativas de integración.

**Interfaces:** `getOwnProfileSettings(): Promise<ProfileSettings>`, `updateOwnProfileSettings(input: UpdateProfileSettingsInput): Promise<ProfileSettings>`, `uploadOwnAvatar(file: File): Promise<ProfileSettings>`, `removeOwnAvatar(): Promise<ProfileSettings>`. Reutilizar `apiClient`; para multipart seguir el envío con cookie y errores de `uploadTransferReceipt` sin copiar funciones comerciales.

- [ ] Escribir pruebas de carga con usuario real de prueba sin textos Ilham/Valencia ni porcentaje fijo; edición/guardado/recarga; descartar; error mantiene borrador; cambios de cuenta y respuestas tardías; doble clic produce una mutación. Probar ausencia de vínculo académico sin inventar matrícula ni cero horas.
- [ ] Añadir pruebas de foto: selector accesible, archivo validado, servidor confirma antes de mostrar éxito, fallo conserva imagen, quitar confirmado refresca identidad global. Probar fecha de alta en `America/La_Paz` y `Europe/Madrid` sin etiquetas GMT fijas.
- [ ] Ejecutar `pnpm --filter frontend test -- src/modules/settings-reference/pages/profile-settings-page.spec.tsx --maxWorkers=1`; confirmar FAIL inicial.
- [ ] Implementar formulario con estado guardado y borrador, abortar/ignorar lecturas obsoletas por identidad, bloquear envío duplicado, deshabilitar edición durante guardado y mostrar errores con `FeedbackBanner`. Refrescar `refreshAuth()` tras mutación de identidad; distinguir fallo al refrescar autenticación de fallo al guardar. La foto se guarda como acción independiente explícita y no descarta otros campos pendientes.
- [ ] Mantener rejilla/tarjetas/espaciados. Presentar nombre completo en una entrada y nombre público en la segunda posición, sin inferir apellidos. Email e institución de solo lectura; código académico según rol. No mostrar «Verificado» sin dato real. Conservar botón «Ver perfil público» con indicación visible de que depende de privacidad, sin abrir un perfil ficticio.
- [ ] Mover catálogos de perfil al archivo propio; incluir República Dominicana y Bolivia, zonas `America/Santo_Domingo`, `America/La_Paz` y `UTC`, además de zonas válidas existentes. Solo español disponible. Formatear fecha de alta mediante `Intl` con zona guardada; nacimiento conserva fecha civil. Eliminar `userProfile` y `profileStats` de datos mock y sus exportaciones una vez sin consumidores.
- [ ] Permitir `pending` y errores reales en barra de guardado; éxito solo tras respuesta persistida. Ajustar tests de componentes compartidos para que seguridad/privacidad todavía simuladas no aparenten estar implementadas. Mostrar aviso de demostración únicamente en las cuatro secciones pendientes.
- [ ] Ejecutar pruebas de esta página, `ReferenceSettingsPanel`, `SchoolAdministrationPage` y `/perfil` hasta PASS. Revisar y hacer commit español del bloque.

### Tarea 4: aceptación de la entrega

**Files:** actualizar `apps/frontend/DESIGN_SYSTEM.md` y `docs/03-backend/03.13-profile.md` con comportamiento entregado, endpoints y límites reales.

**Interfaces:** sin contratos nuevos; validar tareas 1–3 integradas.

- [ ] Probar localmente con datos propios de prueba: guardar preferencias, recargar, comprobar cabecera, subir/quitar imagen, fallar una solicitud y conservar borrador. Verificar aislamiento con una segunda cuenta en base local.
- [ ] Comparar perfil en escritorio y móvil de 320 px con referencia: sin desbordamiento, misma estructura aprobada, fondo del sistema y controles accesibles.
- [ ] Ejecutar `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`; todos deben terminar con código 0. Si Prisma encuentra DLL bloqueada, identificar y detener únicamente el proceso local de este proyecto que la usa, y restaurarlo después.
- [ ] Ejecutar `git diff --check`, revisar archivos añadidos y confirmar que no hay secretos, mocks personales en perfil ni cambios en migraciones antiguas. Solicitar revisión de código del diff funcional mediante la habilidad de revisión disponible; corregir hallazgos y repetir solo las comprobaciones afectadas.
- [ ] Documentar resultado real y controles ejecutados. Conservar las demás entregas en el alcance; no declarar completo el panel entero al completar solo Perfil.

## Ejecución recomendada

Ejecución nativa en esta sesión: un implementador para los cuatro bloques, con revisión al terminar. Los cambios dependen del mismo contrato de perfil y no necesitan agentes de implementación independientes. `deepseek-worker` de OpenCode no estuvo disponible en los intentos previos; no es requisito bloquear el trabajo por ese servicio.

Plan pendiente de revisión del usuario y selección de método de ejecución. No se ha escrito código de producto de esta entrega.

## Decisiones durante la ejecuci?n

- Se trabaj? en el checkout existente para conservar el dise?o aprobado sin guardar; los commits se separaron entre API y pantalla integrada.
- La revisi?n detect? p?rdida de borrador al refrescar autenticaci?n. Se a?adi? actualizaci?n de identidad en segundo plano, con regresi?n RED ? GREEN.
- La prueba HTTP completa encontr? que un trigger anterior consultaba `auth.uid()` al escribir mediante `app_backend`, rol sin acceso al esquema Auth. Una segunda migraci?n nueva evita esa consulta para el backend; se comprob? que el cliente `authenticated` contin?a sin poder modificar campos protegidos.
- No se modific? el esquema del entorno remoto ni se despleg?. Las cinco pantallas siguen conservadas; solo Perfil deja de consumir datos de muestra en esta entrega.
