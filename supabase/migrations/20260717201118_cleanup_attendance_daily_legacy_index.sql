drop index if exists public.idx_attendance_daily_enrollment_date;

alter table public.attendance_daily
  drop column if exists date;

drop table if exists public.grades_record;
