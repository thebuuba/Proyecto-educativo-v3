alter table public.time_slots
  add column block_source text not null default 'MANUAL',
  add column source_key text,
  add constraint time_slots_block_source_check
    check (block_source in ('MANUAL', 'INTER_JOURNEY_GAP'));

alter table public.time_slots drop constraint if exists time_slots_block_type;
alter table public.time_slots
  add constraint time_slots_block_type
    check (block_type in ('CLASS', 'BREAK', 'LUNCH', 'PAUSE', 'FREE', 'GAP'));

create index time_slots_source_key_idx
  on public.time_slots (school_id, block_source, source_key, day_of_week);
