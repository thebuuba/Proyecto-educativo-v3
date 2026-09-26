DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_backend_local') THEN
    CREATE ROLE app_backend_local NOLOGIN INHERIT;
  END IF;
END
$$;

GRANT app_backend TO app_backend_local;
