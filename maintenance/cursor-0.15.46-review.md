# pstack 0.15.45/46 source and T3 review

Reviewed November 20, 2026, after merging the 0.15.44 / stable T3 0.1.11 import in PR #14.

## Immutable inputs and remaining blocker

- Imported mirror: backnotprop/pstack `4a4f41c46c67a006658ac17cef2d092593f6b26a`, version 0.15.44; author baseline `e58dd043600587dbaf58ba315e7f2b38373eeb43`.
- Author 0.15.45: `dd24b6707267cd89c6621c4efc6fa91a1d0666ec`, changing Gemini's panel effort and migration.
- Author 0.15.46: [cursor/plugins `0b46ec399d55f2829e88822998f53b84944837d3`](https://github.com/cursor/plugins/commit/0b46ec399d55f2829e88822998f53b84944837d3), adding native Windows statechart fixes.
- Stable T3 remains v0.1.11, `59651c1761f6c63e9b6056839067066968e6a406`, reviewed separately in `t3-0.1.11-review.md`. No nightly-only feature is required.

The mirror is still 0.15.44. This draft prepares the immutable author delta, preserving the actual mirror commit/version and upstream hashes. Only reviewed local adaptation hashes at that baseline change. Two new author support files, `statechart/scripts/kill.ts` and `janitor.ts`, are candidates outside that older inventory until the mirror import. Review the actual mirror delta, reconcile its harness adaptations, record the complete new inventory and rerun required checks before merging. Do not merge this draft merely because tests pass or label 0.15.46 imported before that review.

## Semantic review

| Author change | Required port behavior |
|---|---|
| Arena runners/judge pool and mode now prefer Neon xhigh, replacing the high cap introduced the day before. | Preserve this reversal. Use live catalog IDs/options, keep aliases/absent-role inheritance, vendor checks and configured panel effort; do not retain the obsolete high cap. |
| In all settings files, non-Neon Gemini 4 and Neon high in three panel roles migrate to Neon xhigh. Other Neon levels are user choices during migration. | Resolve the model component separately from provider/namespace and options. List replacements and unresolved targets in the existing setup review. Preserve other roles, models, lists and aliases. Never fabricate missing xhigh support. |
| A Neon panel entry gets its own starting target xhigh, then budget lowers it. | Large/medium/small maps Neon to xhigh/high/medium; Fable/Opus panels remain high/medium/low. Rebuild from starting targets on each run, including when stored medium-budget high re-enters migration. Configured panel seats keep their listed effort at invocation. |
| String/file/output line readers share splitLines, including trailing CR at chunk boundaries. | Adopt the author's equivalent shared helper and retain our existing chunk regression. Preserve exact LF reports/charts and broken-rule evidence for Windows CRLF output. |
| Native kill.ts replaces shell group kill. A shared TypeScript janitor replaces shell and inline Windows cleanup. The worker signals that it exited, and Windows avoids killing a reused PID. | Adopt the new cleanup protocol and remove the old inline helper. Keep the existing hidden-window behavior for background janitor/taskkill. On Unix the worker's process group can outlive it, so group cleanup still runs. Do not restore the old unconditional Windows kill. |
| Java and mise launches hide Windows windows and Java output explicitly uses UTF-8. | Import those options with identical TLC inputs and results. Keep the port's explicit CheckResult exit-code union and existing void test callbacks for strict typechecking. |
| Native Windows invocation is documented, every recorded CLI corpus case replays Windows line ends, and message parsing tests assert the broken rule. | Import the new source tests and guidance. The POSIX launcher remains available on WSL/Linux; no Windows toolchain is invoked from WSL. Keep real Java/TLC verification and Windows/Linux CI. |

Eleven author skill/support paths change, including the two additions. Principles, other workflows, generated alternate harnesses and registration are unchanged or outside this skills port. Existing native Windows support from the mirror overlaps the author fix, so conflicts were reviewed against the current port rather than overwriting its strict types or chunk regression.

## Verification boundary

The PR records required root/helper tests, Windows/Linux CI, the full Linux/WSL statechart corpus and typecheck, native Windows CRLF checks, and separate real TLC pass/deadlock/SANY cases after execution. The changed cleanup and parser run through those executable checks; Gemini prompt/budget semantics receive source review only. Live T3 catalog/provider execution is unavailable and unrun. No running T3 installation or user model file is changed.
