# Responsive Layout Design

## Goal

Make the application adapt cleanly to phone, tablet, laptop, and desktop widths without changing the product flow or adding dependencies.

## Scope

- Keep the existing sidebar/header layout and visual language.
- Improve shared layout containers so pages cannot force the viewport wider than the device.
- Make page headers and action areas wrap naturally on small screens.
- Give shared tables a safe horizontal scroll path for dense data.
- Apply targeted fixes to the schedule board, which intentionally needs a wide grid.

## Approach

Use CSS and existing Tailwind utilities first. The main application shell should hide accidental horizontal overflow while individual dense widgets, such as tables and schedules, own their own horizontal scrolling. This keeps mobile usable without degrading desktop density.

## Components

- `AppLayout`: constrain the root content area and prevent page-level horizontal overflow.
- `PageHeader`: let titles/actions shrink and wrap, with full-width actions on narrow screens.
- `Table`: add a lightweight wrapper component for shared table overflow without changing table semantics.
- `SchedulePage`: ensure the calendar grid scrolls inside its panel instead of widening the whole app.

## Testing

- Run the frontend build.
- Verify the dev UI manually at narrow and desktop widths.
- Check that no new dependencies or generated artifacts are required.
