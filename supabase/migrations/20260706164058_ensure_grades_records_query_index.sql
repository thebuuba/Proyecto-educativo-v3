-- Reparacion no destructiva del indice de calificaciones.
-- La tabla real es grades_records segun Prisma; se deja como nueva migracion
-- para no editar migraciones historicas ya aplicadas.
CREATE INDEX IF NOT EXISTS idx_grades_record_school_subject_period
  ON grades_records (school_id, section_subject_id, academic_period_id);
