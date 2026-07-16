# Cambio de cuentas

## Cloudflare

La sesión actual de Wrangler puede pertenecer a otra cuenta. Antes de crear Hyperdrive, subir secretos o desplegar:

```bash
pnpm exec wrangler whoami
pnpm exec wrangler logout
pnpm exec wrangler login
pnpm exec wrangler whoami
```

Confirma el nombre y Account ID correctos. No reutilices un Hyperdrive, Worker o secreto de otra cuenta.

En la cuenta correcta:

1. Crea Hyperdrive con `--caching-disabled` siguiendo `docs/05-despliegue.md`.
2. Añade el binding `HYPERDRIVE` a producción y staging.
3. Carga los secretos por entorno.
4. Despliega staging y valida.
5. Despliega producción solo después de aprobar staging.

## Supabase

Si Supabase no cambia de cuenta, no apliques migraciones nuevamente ni copies datos. Solo usa sus credenciales desde la nueva cuenta Cloudflare.

Si también cambia Supabase:

```bash
supabase link --project-ref PROJECT_REF_NUEVO
supabase db push
pnpm db:generate
pnpm db:seed
```

Después configura Site URL, redirect URLs, proveedores OAuth y verifica el bucket `activity-description-images`.

## Reglas

- Nunca confirmes `.env`, contraseñas, service role keys ni IDs de sesión.
- La service role existe solo en el Worker.
- El frontend recibe únicamente URL y anon key públicas.
- No elimines la infraestructura anterior hasta completar staging, producción y la ventana de observación.
