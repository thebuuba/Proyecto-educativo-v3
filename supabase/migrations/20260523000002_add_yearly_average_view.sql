-- Add yearly final average view for promotion decisions.
-- The DR system (MINERD) requires calculating the weighted average
-- across ALL academic periods to determine if a student passes.

-- student_final_grades currently groups by academic_period_id (per-period).
-- This new view rolls up the averages across all periods for the school year.

create or replace view public.student_yearly_averages
with (security_invoker = true)
as
select
  student_id,
  school_year_id,
  grade_id,
  section_id,
  subject_id,
  round(
    sum(effective_percent * weight) / nullif(sum(weight), 0),
    2
  ) as yearly_average_percent,
  count(distinct academic_period_id) as period_count,
  bool_and(
    (coalesce(recovery_score, score) / max_score) >= 0.65
  ) as all_periods_passing
from public.student_grade_details
group by
  student_id,
  school_year_id,
  grade_id,
  section_id,
  subject_id;

comment on view public.student_yearly_averages is
  'Yearly weighted average per student per subject across all periods. '
  'Includes period_count and all_periods_passing flag for promotion logic.';
