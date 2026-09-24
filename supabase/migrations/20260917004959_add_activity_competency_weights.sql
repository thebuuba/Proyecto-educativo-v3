alter table public.evaluation_activities
  add column competency_block_weights jsonb not null default '{}'::jsonb;

update public.evaluation_activities
set competency_block_weights = jsonb_build_object(competency_block_id, 1)
where competency_block_weights = '{}'::jsonb;

alter table public.evaluation_activities
  add constraint evaluation_activities_competency_block_weights_object
  check (jsonb_typeof(competency_block_weights) = 'object');
