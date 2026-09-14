# Guided Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build role-aware, persistent, replayable guided tours across Aula Base.

**Architecture:** A global React provider owns Driver.js and route transitions. A pure tour catalog supplies versioned definitions by role and setup progress, while a NestJS module persists per-user status in Postgres. Stable `data-tour` targets connect definitions to UI controls.

**Tech Stack:** React 19, React Router, Driver.js 1.8, Vitest, NestJS, Prisma, PostgreSQL.

**Spec:** `docs/superpowers/specs/2026-09-14-guided-onboarding-design.md`

## Global Constraints

- Spanish UI copy.
- Persist progress per authenticated user and school.
- Never mark an operational setup step complete solely from tour navigation.
- Support keyboard navigation, reduced motion, mobile sidebar behavior, skip, resume, and replay.
- Use stable `data-tour` attributes instead of CSS classes as selectors.

---

### Task 1: Persist tour progress

**Files:**
- Create: `supabase/migrations/20260914000000_add_onboarding_tour_progress.sql`
- Modify: `packages/database/prisma/schema.prisma`
- Create: `apps/backend/src/modules/onboarding/onboarding.module.ts`
- Create: `apps/backend/src/modules/onboarding/onboarding.controller.ts`
- Create: `apps/backend/src/modules/onboarding/onboarding.service.ts`
- Create: `apps/backend/src/modules/onboarding/onboarding.service.spec.ts`
- Modify: `apps/backend/src/app.module.ts`

**Interfaces:**
- Produces `GET /api/v1/onboarding/tours` and `PUT /api/v1/onboarding/tours/:tourKey`.
- Produces `TourProgressDto { tourKey, version, status, lastStep }`.

- [ ] Write a failing service test proving progress is scoped by `user.id` and `user.schoolId`.
- [ ] Run `pnpm --filter backend test -- onboarding.service.spec.ts`; expect failure because the module is missing.
- [ ] Add the SQL table with a unique `(user_id, school_id, tour_key)` constraint and RLS/backend grants.
- [ ] Add the Prisma model and generate the client with `pnpm db:generate`.
- [ ] Implement authenticated list/upsert endpoints with enum validation for status.
- [ ] Run the focused backend test and `pnpm --filter backend build`; expect both to pass.

### Task 2: Create the role-aware tour catalog

**Files:**
- Modify: `apps/frontend/src/modules/dashboard/setupTour.ts`
- Modify: `apps/frontend/src/modules/dashboard/setupTour.spec.ts`
- Create: `apps/frontend/src/modules/onboarding/tourCatalog.ts`
- Create: `apps/frontend/src/modules/onboarding/tourCatalog.spec.ts`

**Interfaces:**
- Produces `getToursForRoles(roles, setupProgress): TourDefinition[]`.
- Produces versioned `TourDefinition { key, version, title, scope, steps }`.

- [ ] Write failing tests for management, teacher, and viewer catalogs and for skipping completed setup actions.
- [ ] Run the focused Vitest files; expect missing catalog failures.
- [ ] Implement the smallest static catalog covering general navigation plus each role's available modules.
- [ ] Reuse `getNextSetupTourStep` for data-driven management setup.
- [ ] Run the focused tests; expect all to pass.

### Task 3: Build the global tour controller

**Files:**
- Replace: `apps/frontend/src/modules/dashboard/components/GuidedSetupTour.tsx`
- Create: `apps/frontend/src/modules/onboarding/GuidedTourProvider.tsx`
- Create: `apps/frontend/src/modules/onboarding/GuidedTourProvider.spec.tsx`
- Create: `apps/frontend/src/modules/onboarding/onboardingService.ts`
- Modify: `apps/frontend/src/layouts/AppLayout.tsx`

**Interfaces:**
- Produces `useGuidedTours()` with `startTour`, `resumeTour`, `skipTour`, `completeTour`, and `availableTours`.
- Consumes the backend progress endpoints from Task 1 and catalog from Task 2.

- [ ] Write a failing component test for starting a tour, navigating routes, persisting the last step, and resuming.
- [ ] Run the test; expect failure because the provider does not exist.
- [ ] Implement the provider and Driver.js adapter with target waiting and missing-target recovery.
- [ ] Ensure cleanup destroys Driver.js on logout and provider unmount.
- [ ] Run provider tests and frontend TypeScript build; expect success.

### Task 4: Add stable targets and contextual tours

**Files:**
- Modify: `apps/frontend/src/components/navigation/Sidebar.tsx`
- Modify: `apps/frontend/src/components/navigation/Header.tsx`
- Modify primary pages under `apps/frontend/src/modules/{dashboard,courses,students,schedule,attendance,activities,grading,planning,journal,reports}/`
- Create: `apps/frontend/src/modules/onboarding/tourTargets.spec.tsx`

**Interfaces:**
- Consumes selector names declared in `tourCatalog.ts`.
- Produces rendered elements carrying matching `data-tour` attributes.

- [ ] Write failing tests that render each module's primary state and assert its required tour targets exist.
- [ ] Run tests; expect missing-target assertions.
- [ ] Add targets to navigation, page summaries, primary actions, filters, and result areas.
- [ ] Add route-transition steps that spotlight one meaningful workflow per module.
- [ ] Run target and catalog tests; expect success.

### Task 5: Add the Help and Tours center

**Files:**
- Create: `apps/frontend/src/modules/onboarding/TourCenter.tsx`
- Create: `apps/frontend/src/modules/onboarding/TourCenter.spec.tsx`
- Modify: `apps/frontend/src/components/navigation/Header.tsx`

**Interfaces:**
- Consumes `useGuidedTours()`.
- Displays available, in-progress, completed, and replayable tours.

- [ ] Write a failing test proving completed tours can be replayed and pending tours can be resumed.
- [ ] Run the test; expect failure because the center is missing.
- [ ] Implement a compact Help button and accessible modal/list UI.
- [ ] Connect replay/resume actions to the global provider.
- [ ] Run the focused test; expect success.

### Task 6: Verify the complete onboarding experience

**Files:**
- Modify only files required by failures found during verification.

- [ ] Run `pnpm test`; expect all suites to pass.
- [ ] Run `pnpm build`; expect all packages to compile.
- [ ] Start the local Worker with Development credentials and verify `/api/v1/health` returns 200.
- [ ] Test a fresh management user: general tour, Courses navigation, target highlight, skip, resume, and completion.
- [ ] Test teacher and viewer accounts to verify unavailable modules never appear.
- [ ] Test keyboard, Escape, mobile sidebar, and reduced motion.
- [ ] Confirm no tour can leave a transparent overlay or blank application root.
