create index if not exists idx_attendance_class_enrollment_period on public.attendance_class (enrollment_id, academic_period_id);
create index if not exists idx_enrollments_school_status on public.enrollments (school_id, status);
create index if not exists idx_enrollments_student_school_year on public.enrollments (student_id, school_year_id);
create index if not exists idx_planning_entries_school_period on public.planning_entries (school_id, academic_period_id);
create index if not exists idx_planning_entries_section_subject on public.planning_entries (section_subject_id);
create index if not exists idx_schedule_entries_school_year_section on public.schedule_entries (school_id, school_year_id, section_id);
create index if not exists idx_schedule_entries_section_subject_day on public.schedule_entries (section_subject_id, day_of_week);
create index if not exists idx_section_subjects_grade_section on public.section_subjects (grade_id, section_id);
create index if not exists idx_section_subjects_teacher on public.section_subjects (teacher_id);

do $$
begin
  if to_regclass('public.idx_schools_district_trgm') is not null
     and to_regclass('public.idx_schools_district_coalesced_trgm') is null
     and exists (select 1 from pg_index where indexrelid = 'public.idx_schools_district_trgm'::regclass and pg_get_indexdef(indexrelid) ilike '%coalesce%') then
    alter index public.idx_schools_district_trgm rename to idx_schools_district_coalesced_trgm;
  end if;
end
$$;

create index if not exists idx_schools_district_trgm on public.schools using gin (district extensions.gin_trgm_ops);
