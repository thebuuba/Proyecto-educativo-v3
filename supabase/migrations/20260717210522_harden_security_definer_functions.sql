-- Registration is handled by the NestJS API with the service role and a
-- database transaction. Keep privileged trigger helpers outside the exposed
-- public schema.
drop function if exists public.register_school(text, text, text, text);

alter function public.validate_academic_period_dates() set schema app_private;
alter function public.validate_attendance_date_in_period() set schema app_private;
alter function public.validate_recovery_score() set schema app_private;

revoke all on function app_private.validate_academic_period_dates()
  from public, anon, authenticated;
revoke all on function app_private.validate_attendance_date_in_period()
  from public, anon, authenticated;
revoke all on function app_private.validate_recovery_score()
  from public, anon, authenticated;
