# AGENTS.md

## Project Rules

- Use pnpm; do not add npm/yarn lockfiles.
- Do not edit old Supabase migrations that may already be applied.
- For DB changes, create a new migration with `supabase migration new <name>`.
- Keep `supabase/migrations/`, `packages/database/prisma/schema.prisma`, and `apps/frontend/src/types/database.types.ts` aligned.
- Every migration that creates an application table must grant the required privileges to `app_backend` and add its explicit RLS policy.
- Never commit secrets. `.env.example` files must contain placeholders only.
- Run before finishing: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`, `pnpm cloudflare:build`.
- Write all commit messages in Spanish.
- Prefer small PRs: one feature/fix per branch.
- Do not add dependencies unless the standard library or existing packages cannot solve the task.
- Para ahorrar tokens, delega tareas acotadas de análisis, implementación o revisión al agente `deepseek-worker` de OpenCode cuando esté disponible; revisa siempre su resultado antes de confirmar cambios.

## Frontend Design System

- Before creating or redesigning frontend UI, read `apps/frontend/DESIGN_SYSTEM.md`.
- AulaBase uses only the official palette defined in `apps/frontend/src/semantic-palette.css`: blue, green, coral, yellow, gray, white, and dark text.
- Color is semantic, not decorative: blue=information/action, green=success/completed, yellow=warning/pending/preparation, coral=danger/incident, gray=neutral/inactive.
- Prefer shared components from `apps/frontend/src/components/ui/SemanticUI.tsx` (`PageHero`, `SemanticIcon`, `StatusBadge`, `MetricTile`, `FilterBar`, `SectionHeader`, `ProgressIndicator`, `FeedbackBanner`).
- Prefer existing shared `Button`, `Card`, `EmptyState`, `Input`, `Select`, `Textarea`, `Modal`, and `ConfirmDialog` components over page-local variants.
- Do not introduce new Tailwind identity colors such as violet, cyan, emerald, amber, rose, or arbitrary hex/RGB values in business modules. Use semantic tokens instead.
- Page titles must use the dark foreground color. Module identity should come from semantic icons, badges, progress, and small soft surfaces.
- Keep primary surfaces white. Do not paint large cards or page headers with saturated brand/status colors.
- Use at most one strong primary action per visual region. Put infrequent actions in `Acciones`/ellipsis menus.
- Subject colors may use stable variants derived only from the official AulaBase palette; subject color is identity, not status.
- `semantic-legacy-bridge.css` is restricted to legacy subcomponents in Cursos/Planificación plus Auth compatibility. Never expand it to a new authenticated module.
- Evaluación may use `modules/grading/grading-design.css` only inside `grading-workspace` while `GradingBook` is decomposed; do not reuse those legacy mappings elsewhere.
- New or migrated code must consume semantic tokens/components directly and should remove obsolete compatibility rules when safe.
