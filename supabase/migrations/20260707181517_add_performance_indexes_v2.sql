-- Indices compuestos (school_id, status) para tablas base de cursos
CREATE INDEX IF NOT EXISTS idx_grades_school_status
  ON grades (school_id, status);

CREATE INDEX IF NOT EXISTS idx_sections_school_status
  ON sections (school_id, status);

CREATE INDEX IF NOT EXISTS idx_subjects_school_status
  ON subjects (school_id, status);

CREATE INDEX IF NOT EXISTS idx_teachers_school_status
  ON teachers (school_id, status);

CREATE INDEX IF NOT EXISTS idx_school_years_school_current
  ON school_years (school_id, is_current);
