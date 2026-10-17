-- Optional principal teaching strategy. Historic activities retain absence/unknown origin.
ALTER TABLE public.evaluation_activities
  ADD COLUMN teaching_strategy_id text,
  ADD COLUMN teaching_strategy_origin text NOT NULL DEFAULT 'UNKNOWN',
  ADD CONSTRAINT evaluation_activities_teaching_strategy_id_check CHECK (
    teaching_strategy_id IS NULL OR teaching_strategy_id IN (
      'PRIOR_EXPERIENCES', 'EXPOSITORY', 'INQUIRY', 'ENVIRONMENT_IMMERSION',
      'GROUP_SOCIALIZATION', 'DIALOGIC_INQUIRY', 'PROBLEM_BASED', 'PROJECT_BASED',
      'CASE_STUDY', 'DRAMATIZATION', 'DEBATE', 'ROUND_TABLE', 'SYMPOSIUM', 'FORUM',
      'WORKSHOP', 'SIMULATION')),
  ADD CONSTRAINT evaluation_activities_teaching_strategy_origin_check CHECK (
    teaching_strategy_origin IN ('AUTO', 'MANUAL', 'UNKNOWN') AND
    (teaching_strategy_origin <> 'MANUAL' OR teaching_strategy_id IS NOT NULL));

COMMENT ON COLUMN public.evaluation_activities.teaching_strategy_id IS
  'Principal teaching strategy, separate from activity type and evaluation. Shared catalogue teaching-strategies-2026.1.';
COMMENT ON COLUMN public.evaluation_activities.teaching_strategy_origin IS
  'AUTO, MANUAL or UNKNOWN. Migration deliberately does not infer historic strategies.';
-- Existing table privileges and tenant RLS remain in effect; no new tables/functions.
