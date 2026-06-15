-- Add DEFAULT school_id to planning_entries so the client
-- doesn't need to send school_id explicitly — RLS resolves it via
-- app_private.current_school_id().

alter table public.planning_entries
  alter column school_id set default app_private.current_school_id();
