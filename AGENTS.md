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
