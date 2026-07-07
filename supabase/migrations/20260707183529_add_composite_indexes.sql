-- Indices compuestos para queries de grading y planning
CREATE INDEX IF NOT EXISTS idx_grades_records_school_ss_period
  ON grades_records (school_id, section_subject_id, academic_period_id);

CREATE INDEX IF NOT EXISTS idx_planning_entries_school_ss_period
  ON planning_entries (school_id, section_subject_id, academic_period_id);
