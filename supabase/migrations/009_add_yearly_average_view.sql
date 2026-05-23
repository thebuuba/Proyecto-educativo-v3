-- Add yearly final average view for promotion decisions.
-- The DR system (MINERD) requires calculating the weighted average
-- across ALL academic periods to determine if a student passes.

-- student_final_grades currently groups by academic_period_id (per-period).
-- This new view rolls up the averages across all periods for the school year.

create or replace view public.student_yearly_averages
with (security_invoker = true)
as
select
  d.student_id,
  d.school_year_id,
  d.grade_id,
  d.section_id,
  d.subject_id,
  round(
    sum(d.effective_percent * d.weight) / nullif(sum(d.weight), 0),
    2
  ) as yearly_average_percent,
  count(distinct d.academic_period_id) as period_count,
  bool_and(d.effective_percent >= 65) as all_periods_passing,
  65::numeric(5,2) as min_passing_percent
from public.student_grade_details d
group by
  d.student_id,
  d.school_year_id,
  d.grade_id,
  d.section_id,
  d.subject_id;

comment on view public.student_yearly_averages is
  'Yearly weighted average per student per subject across all periods. '
  'Includes period_count and all_periods_passing flag for promotion logic.';
