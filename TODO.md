# Project TODO

Curated list of tasks for this project. Mark a checkbox when done, and keep each item
single-scope so it has a clear done-state.

## Code quality / cleanup
- [ ] Remove the dashboard workflow its now a calendar that one can edit and view tasks on
- [ ] Clean the calendar workflow the code is too long
- [ ] Split `calendar.svelte` — it now holds toolbar, legend, no-time strip, calendar wiring, and all overrides; extract the header/toolbar and the no-time strip into their own components
- [x] Keep the empty-time fallback in `combineTime` — it now backs all-day spans (00:00 → 23:59) for tasks without both times
- [ ] Re-check for any leftover unused imports (e.g. `SvelteDate`, lucide icons) after any refactor


## UX improvements
- [x] Date-only tasks render as all-day events on the calendar (Month/Week/Day) instead of being invisible
- [x] "No time" panel made prominent (accented card, count, guidance, "Set time" action)
- [x] Partial-time tasks (only start OR only end) render as all-day and are listed in the "No time" panel with guidance
- [ ] Filters should be collapsible

## Backlog
- [ ] Add a reusable format for a day header pill (week view) that reuses the month-view `.wx-today .wx-day-number` style
- [ ] Consider a `--wx-*` theme block extracted to `layout.css` if the calendar override block keeps growing
- [ ] Evaluate if agenda/list view is wanted for untimed tasks with no fixed date
