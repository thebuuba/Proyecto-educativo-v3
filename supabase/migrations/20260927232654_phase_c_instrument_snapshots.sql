-- Fase C: evidencia versionada; todas las columnas nuevas son opcionales para actividades históricas.
CREATE TABLE public.evaluation_instrument_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id),
  instrument_id uuid NOT NULL UNIQUE REFERENCES public.evaluation_instruments(id),
  version_no integer NOT NULL DEFAULT 1 CHECK (version_no > 0),
  payload jsonb NOT NULL,
  curriculum_version_id uuid REFERENCES public.curriculum_versions(id),
  curriculum_scope_id uuid,
  catalog_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT snapshot_scope_version_fk FOREIGN KEY (curriculum_scope_id, curriculum_version_id)
    REFERENCES public.curriculum_scopes(id, version_id)
);
CREATE INDEX evaluation_instrument_snapshots_school_idx ON public.evaluation_instrument_snapshots(school_id, created_at);
CREATE INDEX evaluation_instrument_snapshots_curriculum_idx ON public.evaluation_instrument_snapshots(curriculum_scope_id, curriculum_version_id);

CREATE TABLE public.evaluation_snapshot_sources (
  snapshot_id uuid NOT NULL REFERENCES public.evaluation_instrument_snapshots(id),
  element_id uuid NOT NULL,
  version_id uuid NOT NULL,
  PRIMARY KEY (snapshot_id, element_id),
  CONSTRAINT snapshot_source_element_fk FOREIGN KEY (element_id, version_id)
    REFERENCES public.curriculum_elements(id, version_id)
);
CREATE INDEX evaluation_snapshot_sources_element_idx ON public.evaluation_snapshot_sources(element_id, version_id);

ALTER TABLE public.evaluation_activities
  ADD COLUMN pedagogical_activity_type text,
  ADD COLUMN instrument_snapshot_id uuid UNIQUE REFERENCES public.evaluation_instrument_snapshots(id);
ALTER TABLE public.grades_records
  ADD COLUMN instrument_snapshot_id uuid REFERENCES public.evaluation_instrument_snapshots(id);
CREATE INDEX grades_records_snapshot_idx ON public.grades_records(instrument_snapshot_id);

CREATE TABLE public.teacher_instrument_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id),
  teacher_id uuid NOT NULL REFERENCES public.app_users(id),
  curriculum_scope_id uuid REFERENCES public.curriculum_scopes(id),
  activity_type text NOT NULL,
  instrument_type text NOT NULL,
  criterion_template_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  use_count integer NOT NULL DEFAULT 1 CHECK (use_count > 0),
  accepted_instrument_id uuid NOT NULL REFERENCES public.evaluation_instruments(id),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, teacher_id, curriculum_scope_id, activity_type, instrument_type)
);
CREATE INDEX teacher_instrument_preferences_teacher_idx ON public.teacher_instrument_preferences(school_id, teacher_id, last_used_at DESC);
CREATE UNIQUE INDEX teacher_instrument_preferences_fallback_key ON public.teacher_instrument_preferences(school_id, teacher_id, activity_type, instrument_type)
  WHERE curriculum_scope_id IS NULL;

ALTER TABLE public.evaluation_instrument_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_snapshot_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_instrument_preferences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.evaluation_instrument_snapshots, public.evaluation_snapshot_sources, public.teacher_instrument_preferences FROM anon, authenticated;
CREATE POLICY instrument_snapshots_backend ON public.evaluation_instrument_snapshots FOR ALL TO app_backend USING (true) WITH CHECK (true);
CREATE POLICY snapshot_sources_backend ON public.evaluation_snapshot_sources FOR ALL TO app_backend USING (true) WITH CHECK (true);
CREATE POLICY teacher_preferences_backend ON public.teacher_instrument_preferences FOR ALL TO app_backend USING (true) WITH CHECK (true);
GRANT SELECT, INSERT ON public.evaluation_instrument_snapshots, public.evaluation_snapshot_sources TO app_backend;
GRANT SELECT, INSERT, UPDATE ON public.teacher_instrument_preferences TO app_backend;
