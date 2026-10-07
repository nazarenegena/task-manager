# Project TODO

Curated list of tasks for this project. Mark a checkbox when done, and keep each item
single-scope so it has a clear done-state.

## Code quality / cleanup
- [ ] Remove the dashboard workflow its now a calendar that one can edit and view tasks on
- [ ] Clean the calendar workflow the code is too long
- [ ] Split `calendar.svelte` — it now holds toolbar, legend, no-time strip, calendar wiring, and all overrides; extract the header/toolbar and the no-time strip into their own components
- [ ] Remove the empty-time fallback in `combineTime` (`calendar.svelte`) — calendar events are now filtered to tasks that always have start + end, so the `else` branch is dead
- [ ] Re-check for any leftover unused imports (e.g. `SvelteDate`, lucide icons) after any refactor


## UX improvements
- [ ] update: convert the navbar task action to a modal.
- [ ] Add a "today" pill/marker into the week-view header column (currently the header cell isn't targetable via `cellCss`)
- [ ] Style the month view "+N more" overflow so it fits the app design
- [ ] Decide whether partial-time tasks (only start OR only end) should also show a warning/hint in the no-time strip

## Backlog
- [ ] Add a reusable format for a day header pill (week view) that reuses the month-view `.wx-today .wx-day-number` style
- [ ] Consider a `--wx-*` theme block extracted to `layout.css` if the calendar override block keeps growing
- [ ] Evaluate if agenda/list view is wanted for untimed tasks with no fixed date
