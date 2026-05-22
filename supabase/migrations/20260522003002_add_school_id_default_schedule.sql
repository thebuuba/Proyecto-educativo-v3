-- Add DEFAULT school_id to time_slots and schedule_entries so the client
-- doesn't need to send school_id explicitly — RLS resolves it via
-- app_private.current_school_id().
--
-- The original migration (20260522003001_add_schedule_tables) created both
-- columns as NOT NULL without a DEFAULT, which broke client inserts.

alter table public.time_slots
  alter column school_id set default app_private.current_school_id();

alter table public.schedule_entries
  alter column school_id set default app_private.current_school_id();
