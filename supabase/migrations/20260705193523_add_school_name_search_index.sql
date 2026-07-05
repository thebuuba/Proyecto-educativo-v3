-- Habilita pg_trgm para búsqueda parcial por nombre de escuela
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_schools_name_trgm
  ON schools USING gin (name gin_trgm_ops);
