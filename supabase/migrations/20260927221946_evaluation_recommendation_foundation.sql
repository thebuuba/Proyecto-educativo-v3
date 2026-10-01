-- Global, versioned evaluative catalog. The typed payload groups the six catalogs
-- into one atomic release: no partially upgraded criteria/rules/descriptors.
CREATE TABLE public.evaluation_catalog_releases (
  version text PRIMARY KEY,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (payload->>'version' = version),
  CHECK (jsonb_typeof(payload->'activityTypes') = 'array'),
  CHECK (jsonb_typeof(payload->'criterionTemplates') = 'array'),
  CHECK (jsonb_typeof(payload->'recommendationRules') = 'array')
);
ALTER TABLE public.evaluation_catalog_releases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.evaluation_catalog_releases FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.evaluation_catalog_releases TO app_backend;
CREATE POLICY evaluation_catalog_backend_read ON public.evaluation_catalog_releases FOR SELECT TO app_backend USING (true);
CREATE POLICY evaluation_catalog_backend_seed ON public.evaluation_catalog_releases FOR INSERT TO app_backend WITH CHECK (true);

-- Optional reviewed exit for custom/legacy subject codes. Access only through
-- backend/administrative tooling, never accepted from a recommendation request.
CREATE TABLE public.section_curriculum_contexts (
  section_subject_id uuid PRIMARY KEY REFERENCES public.section_subjects(id) ON DELETE CASCADE,
  optative_exit_name text NOT NULL CHECK (optative_exit_name IN (
    'Humanidades y Lenguas Modernas', 'Humanidades y Ciencias Sociales', 'Matemática y Tecnología', 'Ciencias y Tecnología'
  )),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.section_curriculum_contexts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.section_curriculum_contexts FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.section_curriculum_contexts TO app_backend;
CREATE POLICY section_curriculum_backend ON public.section_curriculum_contexts FOR ALL TO app_backend USING (true) WITH CHECK (true);
-- PK supplies the FK lookup index. No recommendations, results or snapshots are persisted.
