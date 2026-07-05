-- Índices compuestos para queries de courses/students y grading

CREATE INDEX IF NOT EXISTS idx_section_subjects_school_status
  ON section_subjects (school_id, status);

CREATE INDEX IF NOT EXISTS idx_section_subjects_school_section
  ON section_subjects (school_id, section_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_school_section_year_status
  ON enrollments (school_id, section_id, school_year_id, status);

CREATE INDEX IF NOT EXISTS idx_grades_record_school_subject_period
  ON grades_record (school_id, section_subject_id, academic_period_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_school_year_grade_section_status
  ON enrollments (school_id, school_year_id, grade_id, section_id, status);
