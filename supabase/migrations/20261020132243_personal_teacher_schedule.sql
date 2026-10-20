begin;

-- NULL retains historical data whose author cannot be established safely.
alter table public.schedule_journeys
  add column owner_user_id uuid references public.app_users(id) on delete restrict on update cascade;
alter table public.time_slots
  add column owner_user_id uuid references public.app_users(id) on delete restrict on update cascade;
create index schedule_journeys_school_id_owner_user_id_idx
  on public.schedule_journeys(school_id, owner_user_id);
create index time_slots_school_id_owner_user_id_idx
  on public.time_slots(school_id, owner_user_id);

-- A single staff account is unambiguous; in a shared centre use the teacher
-- attached to each subject assignment. Never give an arbitrary user shared data.
create temporary table schedule_single_owner on commit drop as
select u.school_id, (array_agg(distinct u.id))[1] as owner_user_id
from public.app_users u
join public.user_roles ur on ur.user_id = u.id and ur.school_id = u.school_id
join public.roles r on r.id = ur.role_id
where u.status = 'active' and ur.status = 'active' and r.status = 'active'
  and r.key in ('teacher', 'admin', 'director', 'coordinator')
group by u.school_id
having count(distinct u.id) = 1;

create temporary table schedule_entry_owners on commit drop as
select e.id, e.school_id, coalesce(u.id, sole.owner_user_id) as owner_user_id
from public.schedule_entries e
join public.section_subjects ss on ss.id = e.section_subject_id and ss.school_id = e.school_id
left join public.teachers t on t.id = ss.teacher_id and t.school_id = e.school_id
left join public.app_users u on u.id = t.user_id and u.school_id = e.school_id
left join schedule_single_owner sole on sole.school_id = e.school_id
where coalesce(u.id, sole.owner_user_id) is not null;

create temporary table schedule_owners on commit drop as
select school_id, owner_user_id from schedule_entry_owners
union select school_id, owner_user_id from schedule_single_owner;

create temporary table schedule_journey_copies on commit drop as
select j.id as original_id, gen_random_uuid() as id, o.owner_user_id, j.school_id
from public.schedule_journeys j
join schedule_owners o on o.school_id = j.school_id;

insert into public.schedule_journeys
  (id, school_id, owner_user_id, name, kind, start_time, end_time, sequence, status, created_at, updated_at)
select c.id, j.school_id, c.owner_user_id, j.name, j.kind, j.start_time, j.end_time,
  j.sequence, j.status, j.created_at, j.updated_at
from schedule_journey_copies c join public.schedule_journeys j on j.id = c.original_id;

create temporary table schedule_slot_copies on commit drop as
select s.id as original_id, gen_random_uuid() as id, o.owner_user_id, s.school_id
from public.time_slots s join schedule_owners o on o.school_id = s.school_id;

insert into public.time_slots
  (id, school_id, owner_user_id, name, start_time, end_time, sequence, day_of_week,
   block_type, block_source, source_key, journey_id, status, created_at, updated_at)
select c.id, s.school_id, c.owner_user_id, s.name, s.start_time, s.end_time, s.sequence,
  s.day_of_week, s.block_type, s.block_source,
  case when s.block_source = 'INTER_JOURNEY_GAP' and gap_start.id is not null and gap_end.id is not null
    then gap_start.id::text || ':' || gap_end.id::text else s.source_key end,
  j.id,
  s.status, s.created_at, s.updated_at
from schedule_slot_copies c
join public.time_slots s on s.id = c.original_id
left join schedule_journey_copies j
  on j.original_id = s.journey_id and j.owner_user_id = c.owner_user_id and j.school_id = c.school_id
left join schedule_journey_copies gap_start
  on gap_start.original_id::text = split_part(s.source_key, ':', 1)
  and gap_start.owner_user_id = c.owner_user_id and gap_start.school_id = c.school_id
left join schedule_journey_copies gap_end
  on gap_end.original_id::text = split_part(s.source_key, ':', 2)
  and gap_end.owner_user_id = c.owner_user_id and gap_end.school_id = c.school_id;

-- Keep entry IDs (and attendance references) stable; only replace their block.
update public.schedule_entries e set time_slot_id = c.id
from schedule_entry_owners o, schedule_slot_copies c
where e.id = o.id and c.original_id = e.time_slot_id
  and c.owner_user_id = o.owner_user_id and c.school_id = e.school_id;

-- API requests use app_backend and enforce ownership from the verified session.
-- Direct authenticated access must also respect personal ownership.
drop policy if exists time_slots_admin_coordinator_write on public.time_slots;
drop policy if exists time_slots_read_authenticated on public.time_slots;
drop policy if exists schedule_entries_admin_coordinator_write on public.schedule_entries;
drop policy if exists schedule_entries_read_authenticated on public.schedule_entries;

create policy schedule_journeys_owner_access on public.schedule_journeys
for all to authenticated
using (school_id = app_private.current_school_id() and owner_user_id = app_private.current_app_user_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher']))
with check (school_id = app_private.current_school_id() and owner_user_id = app_private.current_app_user_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher']));

create policy time_slots_owner_access on public.time_slots
for all to authenticated
using (school_id = app_private.current_school_id() and owner_user_id = app_private.current_app_user_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher']))
with check (
  school_id = app_private.current_school_id() and owner_user_id = app_private.current_app_user_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher'])
  and (journey_id is null or exists (
    select 1 from public.schedule_journeys j where j.id = time_slots.journey_id
      and j.school_id = time_slots.school_id and j.owner_user_id = time_slots.owner_user_id
  ))
);

create policy schedule_entries_owner_access on public.schedule_entries
for all to authenticated
using (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher']) and exists (
    select 1 from public.time_slots s where s.id = schedule_entries.time_slot_id
      and s.school_id = schedule_entries.school_id and s.owner_user_id = app_private.current_app_user_id()
  )
)
with check (
  school_id = app_private.current_school_id()
  and app_private.has_any_role(array['admin', 'director', 'coordinator', 'teacher']) and exists (
    select 1 from public.time_slots s where s.id = schedule_entries.time_slot_id
      and s.school_id = schedule_entries.school_id and s.owner_user_id = app_private.current_app_user_id()
  )
);

grant select, insert, update, delete on public.schedule_journeys, public.time_slots, public.schedule_entries to app_backend;

commit;
