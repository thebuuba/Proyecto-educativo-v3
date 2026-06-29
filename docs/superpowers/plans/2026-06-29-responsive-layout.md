# Responsive Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing frontend adapt cleanly across device widths.

**Architecture:** Apply small responsive improvements at shared layout boundaries, then patch the one dense schedule grid so it scrolls locally. Use Tailwind/CSS already present in the app.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS v4, pnpm.

## Global Constraints

- Do not add dependencies.
- Keep existing routes, data flow, and visual language.
- Prefer shared components over page-by-page rewrites.
- Run `pnpm --filter frontend build` before completion.

---

### Task 1: Shared Layout Containers

**Files:**
- Modify: `apps/frontend/src/layouts/AppLayout.tsx`
- Modify: `apps/frontend/src/components/ui/PageHeader.tsx`
- Modify: `apps/frontend/src/components/ui/Table.tsx`

**Interfaces:**
- Produces: `TableContainer`, a small wrapper exported from `Table.tsx`.
- Consumes: existing `cn` helper from `@/utils/cn`.

- [ ] **Step 1: Build-check current frontend**

Run: `$env:Path='C:\Program Files\nodejs;' + $env:Path; corepack pnpm@11.1.2 --filter frontend build`

Expected: existing app build completes or reports pre-existing errors before responsive edits.

- [ ] **Step 2: Update app shell**

Set root and content wrappers to `overflow-x-hidden`; set main to `min-w-0`.

- [ ] **Step 3: Update page header**

Add `min-w-0` to title text container and let action containers wrap/full-width on small screens.

- [ ] **Step 4: Add table overflow wrapper**

Export `TableContainer` from `Table.tsx`:

```tsx
export function TableContainer({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn('w-full overflow-x-auto', className)} {...props}>
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Build-check**

Run: `$env:Path='C:\Program Files\nodejs;' + $env:Path; corepack pnpm@11.1.2 --filter frontend build`

Expected: PASS.

### Task 2: Dense Schedule Grid

**Files:**
- Modify: `apps/frontend/src/modules/schedule/pages/SchedulePage.tsx`

**Interfaces:**
- Consumes: existing schedule grid markup.
- Produces: local horizontal scroll on the schedule board at narrow widths.

- [ ] **Step 1: Inspect schedule grid wrappers**

Find the `grid-cols-[5.5rem_repeat(5,minmax(10rem,1fr))]` board wrapper and verify where overflow should live.

- [ ] **Step 2: Add local overflow**

Wrap or update the schedule board container with `overflow-x-auto`, and give the grid an internal minimum width such as `min-w-[56rem]` so columns stay legible.

- [ ] **Step 3: Build-check**

Run: `$env:Path='C:\Program Files\nodejs;' + $env:Path; corepack pnpm@11.1.2 --filter frontend build`

Expected: PASS.

### Task 3: Manual Verification

**Files:**
- No code changes.

**Interfaces:**
- Consumes: local frontend server at `http://localhost:5173/`.
- Produces: confidence that viewport adaptation works.

- [ ] **Step 1: Confirm frontend is listening**

Run: `Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue`

Expected: port `5173` is listening.

- [ ] **Step 2: Open browser**

Open `http://localhost:5173/`.

- [ ] **Step 3: Verify responsive behavior**

Use browser responsive mode around `375px`, `768px`, and desktop width. Confirm no whole-page horizontal scroll appears and dense tables/schedule scroll inside their panels.
