# Preparación de Supabase real

Esta guía deja el proyecto listo para aplicar migraciones, generar tipos y crear
el primer administrador. No conecta todavía el frontend ni implementa login.

## 1. Crear proyecto en Supabase

1. Entra a `https://supabase.com/dashboard`.
2. Crea un nuevo proyecto.
3. Copia el `Project URL`.
4. Copia la llave pública `anon` / `publishable`.

En el dashboard normalmente se encuentran en:

```txt
Project Settings -> API
```

## 2. Variables de entorno

Copia el ejemplo:

```bash
cp .env.example .env.local
```

Completa:

```txt
VITE_SUPABASE_URL=https://PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

Estas variables son públicas para el cliente. Nunca agregues `service_role` en
variables `VITE_*` ni en código frontend.

## 3. Instalar y autenticar Supabase CLI

Puedes usar el CLI con `npx` o instalarlo globalmente. Con `npx`:

```bash
npx supabase --version
npx supabase login
```

## 4. Ejecutar Supabase local

Para probar migraciones localmente:

```bash
npx supabase start
npx supabase db reset
```

`db reset` recrea la base local y aplica las migraciones en
`supabase/migrations`.

## 5. Vincular proyecto remoto

Obtén el `PROJECT_ID` desde la URL del dashboard:

```txt
https://supabase.com/dashboard/project/PROJECT_ID
```

Luego ejecuta:

```bash
npx supabase link --project-ref PROJECT_ID
```

Si el proyecto remoto ya tiene cambios manuales, revisa antes:

```bash
npx supabase db pull
```

## 6. Aplicar migraciones en Supabase real

Después de vincular el proyecto:

```bash
npx supabase db push
```

Migración principal:

```txt
supabase/migrations/001_initial_student_system_schema.sql
```

## 7. Generar tipos TypeScript reales

Después de aplicar la migración:

```bash
npx supabase gen types typescript --project-id PROJECT_ID --schema public > src/services/supabase/database.types.ts
```

Alternativa contra la base local:

```bash
npx supabase gen types typescript --local --schema public > src/services/supabase/database.types.ts
```

Después de generar tipos, el cliente Supabase puede tiparse con el `Database`
generado.

## 8. Bootstrap del primer administrador

El primer usuario debe existir primero en `auth.users`. Puedes crearlo desde:

- Supabase Dashboard -> Authentication -> Users
- o un proceso backend seguro

Luego ejecuta el script:

```txt
supabase/bootstrap/create_first_admin.sql
```

Antes de ejecutarlo, reemplaza:

```sql
'admin@example.com'
'Administrador del sistema'
```

Este script:

1. busca el usuario en `auth.users` por email;
2. crea o actualiza su perfil en `public.app_users`;
3. asigna el rol `admin` en `public.user_roles`.

Debe ejecutarse desde SQL Editor, `psql` con credenciales administrativas, o un
backend seguro con `service_role`. Nunca desde el frontend público.

## 9. Supabase Advisors

Después de aplicar la migración en el proyecto real, ejecuta y revisa:

- Database Advisor
- Security Advisor
- Performance Advisor

Corrige cualquier advertencia antes de conectar módulos reales del frontend.

## 10. Verificación del frontend

```bash
npm run lint
npm run build
```

## Referencias

- Migraciones: `https://supabase.com/docs/guides/deployment/database-migrations`
- Tipos TypeScript: `https://supabase.com/docs/guides/api/rest/generating-types`
- Desarrollo local: `https://supabase.com/docs/guides/cli/local-development`
