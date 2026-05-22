# Autenticación frontend

La base de autenticación usa Supabase Auth y el perfil interno `public.app_users`.

## Flujo actual

1. Supabase Auth valida email y contraseña.
2. El frontend obtiene la sesión actual.
3. Se busca el perfil activo en `public.app_users` por `auth_user_id`.
4. Se cargan roles desde `public.user_roles`.
5. Se cargan permisos desde `public.role_permissions`.
6. Las rutas se protegen con `allowedRoles` definido en `src/routes/appRoutes.ts`.

## Archivos principales

- `src/modules/auth/services/authService.ts`
- `src/modules/auth/context/AuthProvider.tsx`
- `src/modules/auth/hooks/useAuth.ts`
- `src/modules/auth/components/RequireAuth.tsx`
- `src/modules/auth/pages/LoginPage.tsx`
- `src/modules/auth/pages/UnauthorizedPage.tsx`

## Requisitos para probar con Supabase real

1. Aplicar la migración inicial.
2. Crear un usuario en Supabase Auth.
3. Ejecutar `supabase/bootstrap/create_first_admin.sql` para crear el perfil
   `app_users` y asignar el rol `admin`.
4. Configurar `.env.local`:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Seguridad

- No se usa `service_role` en frontend.
- El frontend solo usa la llave pública de Supabase.
- Los guards frontend no reemplazan RLS; las policies de Supabase siguen siendo
  la capa de seguridad real.
- Un usuario autenticado sin `app_users` activo o sin roles válidos no podrá
  entrar a rutas protegidas.
