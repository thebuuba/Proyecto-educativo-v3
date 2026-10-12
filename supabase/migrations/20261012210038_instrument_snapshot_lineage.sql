ALTER TABLE public.evaluation_instrument_snapshots
  ADD COLUMN previous_snapshot_id uuid REFERENCES public.evaluation_instrument_snapshots(id),
  ADD CONSTRAINT evaluation_instrument_snapshots_not_self CHECK (previous_snapshot_id IS DISTINCT FROM id);

CREATE INDEX evaluation_instrument_snapshots_previous_snapshot_id_idx
  ON public.evaluation_instrument_snapshots(previous_snapshot_id);

-- Revisions append to existing evidence; snapshots retain SELECT/INSERT-only backend privileges.
CREATE FUNCTION public.validate_instrument_snapshot_lineage() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE previous public.evaluation_instrument_snapshots;
BEGIN
  IF NEW.previous_snapshot_id IS NULL THEN
    IF NEW.version_no <> 1 THEN RAISE EXCEPTION 'Initial snapshot version must be 1'; END IF;
  ELSE
    SELECT * INTO previous FROM public.evaluation_instrument_snapshots WHERE id = NEW.previous_snapshot_id;
    IF NOT FOUND OR previous.school_id <> NEW.school_id OR NEW.version_no <> previous.version_no + 1 THEN
      RAISE EXCEPTION 'Invalid snapshot lineage';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER evaluation_instrument_snapshots_lineage_before_insert
  BEFORE INSERT ON public.evaluation_instrument_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.validate_instrument_snapshot_lineage();
