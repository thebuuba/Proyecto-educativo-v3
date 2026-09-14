# Guided onboarding design

## Goal

Give every new Aula Base user a clear, interactive introduction that explains the system in context, adapts to their role, points to real controls, survives navigation, and can be resumed or replayed.

## Experience

The first authenticated visit starts a short general tour. It highlights the sidebar, dashboard, search, notifications, and the most important modules available to the current role. Each step uses a spotlight and a nearby popover with Spanish copy, progress, Back, Next, Skip, and Close controls.

After the general tour, contextual tours run only on the first visit to a module. They highlight the module's primary workflow rather than describing every control. Management users receive setup tours for courses, students, schedules, attendance, planning, and reports. Teachers receive classroom, attendance, activities, grading, planning, journal, and reports tours. Viewer roles receive read-only navigation and reporting tours.

Tours never block normal work after being dismissed. A Help entry in the application header opens a small tour center listing available, completed, and pending tours. Users can replay any tour.

## Progress and completion

Progress belongs to the authenticated user and is stored in Postgres, not only in browser storage. Each record stores the tour key, version, status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `SKIPPED`), last step, and timestamps. Browser storage is only a short-lived fallback while an update request is in flight.

Setup completion is driven by real application data. The dashboard's existing `setupProgress` determines the next incomplete operational action. Completing a database action advances the guide; merely clicking Next does not mark the operational step complete.

Tour definitions are versioned. A copy or selector change can increment that tour's version without replaying unrelated tours.

## Architecture

- `GuidedTourProvider` lives inside `AppLayout` so a tour survives route changes.
- A pure catalog returns tours for the current role and setup progress.
- Driver.js renders spotlight overlays and accessible popovers.
- Stable `data-tour` attributes identify targets. Tour code never depends on styling classes.
- A backend onboarding module exposes read and upsert endpoints scoped to the authenticated user and school.
- The tour controller waits for asynchronous targets and skips optional missing targets without leaving the screen blocked.

## Safety and accessibility

- Keyboard navigation and Escape are supported.
- Focus remains inside the active popover.
- Mobile tours open the sidebar before targeting navigation items.
- Missing elements time out and are skipped with a recoverable message.
- Tours do not submit forms or fabricate data.
- Reduced-motion preferences disable animated transitions.

## Verification

- Unit tests cover role filtering, next-step selection, versioning, and completion.
- Component tests cover starting, skipping, resuming, route navigation, and replay.
- Backend tests prove users cannot read or update another user's progress.
- A production build and local browser smoke test verify that the overlay, popover, and page remain usable.
