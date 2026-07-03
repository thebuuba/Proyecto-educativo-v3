-- Índices compuestos para queries frecuentes

CREATE INDEX IF NOT EXISTS idx_enrollments_school_status
  ON enrollments (school_id, status);

CREATE INDEX IF NOT EXISTS idx_enrollments_student_school_year
  ON enrollments (student_id, school_year_id);

CREATE INDEX IF NOT EXISTS idx_planning_entries_section_subject
  ON planning_entries (section_subject_id);

CREATE INDEX IF NOT EXISTS idx_planning_entries_school_period
  ON planning_entries (school_id, academic_period_id);

CREATE INDEX IF NOT EXISTS idx_schedule_entries_section_subject_day
  ON schedule_entries (section_subject_id, day_of_week);

CREATE INDEX IF NOT EXISTS idx_schedule_entries_school_year_section
  ON schedule_entries (school_id, school_year_id, section_id);

CREATE INDEX IF NOT EXISTS idx_attendance_class_enrollment_period
  ON attendance_class (enrollment_id, academic_period_id);

CREATE INDEX IF NOT EXISTS idx_attendance_daily_enrollment_date
  ON attendance_daily (enrollment_id, date);

CREATE INDEX IF NOT EXISTS idx_grades_record_enrollment_period
  ON grades_record (enrollment_id, academic_period_id);

CREATE INDEX IF NOT EXISTS idx_section_subjects_grade_section
  ON section_subjects (grade_id, section_id);

CREATE INDEX IF NOT EXISTS idx_section_subjects_teacher
  ON section_subjects (teacher_id);
