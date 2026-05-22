# Autenticación frontend

La base de autenticación usa Supabase Auth y el perfil interno `public.app_users`.

## Flujo actual

1. `LoginPage` llama a `login()` desde `useAuth()`.
2. `AuthProvider` ejecuta `signInWithPassword()` mediante `authService`.
3. Después del login carga sesión, `app_users`, roles y permisos.
4. Si la carga completa correctamente, el `<Navigate>` condicional de `LoginPage`
   redirige a la ruta solicitada.
5. Si falla la carga de perfil, roles o permisos, `login()` propaga un error
   claro para mostrarlo en `LoginPage`.
6. `RequireAuth` protege rutas con `allowedRoles` desde `src/routes/appRoutes.ts`.
7. `Sidebar` usa `hasRole()` del contexto para mostrar solo rutas permitidas.

## Login y logout

Supabase dispara `onAuthStateChange` después de `signInWithPassword()` y
`signOut()`. Como `AuthProvider` también necesita cargar explícitamente perfil,
roles y permisos para propagar errores al formulario, arma una espera del evento
antes de ejecutar login/logout.

Si el evento llega, el handler carga la sesión, `app_users`, roles y permisos, y
`login()` espera ese resultado. Si el evento no llega en una ventana corta,
`AuthProvider` hace una carga manual como fallback. El flag interno
`skipNextAuthEventRef` se restablece en `finally` y también al consumir el evento,
evitando que eventos futuros queden silenciados si `signInWithPassword()` o
`signOut()` fallan.

`refreshAuth()` ejecuta la misma carga de sesión con propagación de errores, por
lo que un caller puede capturar fallos de red, base de datos o autorización de
perfil.

## Manejo de errores

Se distinguen estos casos:

- sesión Supabase sin `app_users` activo;
- perfil inactivo;
- perfil sin roles activos;
- error de red o base de datos cargando perfil, roles o permisos.

En esos casos el estado auth se limpia y se conserva `authError` en el contexto.
Durante login, el error también se propaga a `LoginPage`. En una sesión inicial
existente que falle al cargar datos de la app, el usuario se redirige a login con
un mensaje visible en vez de volver silenciosamente.

## Archivos principales

- `src/modules/auth/services/authService.ts`
- `src/modules/auth/context/AuthContext.ts`
- `src/modules/auth/context/AuthProvider.tsx`
- `src/modules/auth/hooks/useAuth.ts`
- `src/modules/auth/components/RequireAuth.tsx`
- `src/modules/auth/pages/LoginPage.tsx`
- `src/modules/auth/pages/UnauthorizedPage.tsx`

## Variables de entorno

Copia `.env.example` como `.env.local`:

```bash
cp .env.example .env.local
```

Completa:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Permisos

`hasRole()` está tipado con `UserRole[]` porque los roles base sí tienen catálogo
cerrado en `src/types/domain.ts`.

`hasPermission()` acepta `string` porque los permisos se cargan desde base de
datos y todavía no hay tipos generados reales desde Supabase con un catálogo
cerrado. Cuando se generen tipos reales, se puede introducir `PermissionKey`.

## Decisión sobre authService

`login()` y `logout()` se mantienen como wrappers aunque deleguen en Supabase.
Esto preserva una capa de servicio donde luego se puede agregar auditoría,
telemetría o reglas de sesión sin tocar componentes.

## Seguridad

- No se usa `service_role` en frontend.
- El frontend solo usa la llave pública de Supabase.
- Los guards frontend no reemplazan RLS; las policies de Supabase siguen siendo
  la capa de seguridad real.
- Un usuario autenticado sin `app_users` activo o sin roles válidos no podrá
  entrar a rutas protegidas.
