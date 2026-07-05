CREATE INDEX IF NOT EXISTS idx_schools_district_trgm ON schools USING GIN (district gin_trgm_ops);
