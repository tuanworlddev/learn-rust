# Bounded lint review — 2026-11-10

## Scope and baseline

Reviewed the changed files on the Mac checkout at `/Users/rupphi/AIWorkspaces/mcp-lab/learn-rust`. Compared tracked components against `git show HEAD:<path>` using ESLint's stdin mode with the original filename so the same configuration applied.

Before cleanup, lint across 49 changed source files reported **19 errors and 3 warnings**.

| Finding | Current work before cleanup | Existing at HEAD |
| --- | ---: | ---: |
| Intentional client storage / route synchronization (`set-state-in-effect`) | 9 errors | 9 errors |
| `Date.now()` evaluated during render | 1 error | 1 error |
| Raw backup ref read by JSX | 5 diagnostics for the same expression | 5 diagnostics |
| Unescaped JSX quote characters | 2 errors | New component |
| Local bindings named `module` | 2 errors | New files |
| Unused icon imports | 2 warnings | 2 warnings |
| Dynamic `lessons` dependency omitted from hash migration | 1 warning | New dependency |

The 15 React diagnostics were present in the tracked baseline. Four errors and one warning were introduced by the current feature work.

## Changes

- Escaped the visible quote characters around the Result example in `lesson-visual.tsx`; the rendered text is unchanged.
- Renamed the catalog loop binding to `courseModule` and the trusted source loader's local CommonJS holder to `dataModule`. The generated CommonJS wrapper still receives its standard `module` parameter. Content and export formats are unchanged.
- Removed the unused `ArrowRight` and `ChevronRight` imports from `learning-app.tsx`.
- Added `lessons` to the legacy hash migration effect's dependencies so a newly supplied catalog is included.
- Initialized the activity timestamp in the activity effect rather than during render. Existing activity listeners, inactivity limit and per-route timer behavior remain intact.
- Added `hasStoredProgress` state for deciding whether JSX can offer the raw backup download. The original snapshot remains in `storedProgressRaw` and is only read by the export event handler. A failed parse continues to preserve the exact original data; a failed storage read does not offer a fabricated backup.
- Extended the existing progress regression's state fixture and assertion for backup visibility. The parser was not changed.

## Narrow effect exceptions retained

Nine `react-hooks/set-state-in-effect` exceptions are documented immediately at the relevant statement or single-line effect. No file-wide or project-wide rule was disabled, and the ESLint configuration and verification gates are unchanged.

| Component | Reason for retaining the effect |
| --- | --- |
| `career-hub.tsx` | Restore client-owned evidence after server rendering; reflect the result of a localStorage write in its status indicator. |
| `code-lab.tsx` | Restore the selected exercise's browser draft and reset that exercise's transient editor state after a storage key change. |
| `learning-app.tsx` | Restore learner progress after server rendering, report persistence failures without replacing unreadable data, read browser theme preferences, reveal the route-selected sidebar chapter, and remember a directly opened lesson after progress has loaded. |
| `learning-dashboard.tsx` | Open a route-selected chapter even if the learner had previously collapsed it. |

These exceptions preserve the existing SSR hydration and client persistence design. Replacing the storage model with an external-store abstraction would be a separate change. No deferred microtask was introduced to evade a lint rule.

## Verification

All checks ran after the final source and regression-fixture changes:

| Check | Result |
| --- | --- |
| ESLint JSON across all 49 changed JS/TS source files | **PASS — 0 errors, 0 warnings** |
| `npx tsc --noEmit` | **PASS** |
| `node --test lib/content/content.test.mjs` | **PASS — 16/16** |
| `node --test scripts/test-progress-catalog.mjs` | **PASS — 4/4** |

The progress regression executes the current parser and actual load/save effects. It covers a full → foundation-only → full publication cycle, valid hidden lesson and retired project IDs, malformed values, oversized collections, preservation of the original raw backup, visible backup availability, and prevention of overwriting an unreadable snapshot.

No changes were made to course data, Supabase, deployment configuration, routing APIs, resume selection, tab scrolling, or disclosure animation. No Git mutation was performed. A final application rebuild and browser verification are handled by the main task after this cleanup.
