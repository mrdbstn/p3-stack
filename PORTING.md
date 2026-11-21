# Fidelity policy

This fork preserves pstack's engineering behavior and adapts its harness mechanics to T3 Code. The source is the standalone backnotprop/pstack mirror of Lauren Tan's cursor/plugins/pstack. `upstream.lock.json` records the reviewed source commit, version, every imported skill/support file, and hashes before and after adaptation.

All 58 upstream skills and 22 playbooks are included. The 24 principle skills are byte-equivalent after newline normalization, including the 14 bodies shortened by upstream in 0.15.43. The only entry-point renames are poteto-mode to p3-mode, poteto-help to p3-help, and setup-pstack to setup-p3. Do not shorten a source rule just to make the port smaller.

## Reviewed adaptations

| Area | T3 adaptation | Behavior preserved |
|---|---|---|
| Delegation | Live provider/model roles, `delegate_task`, complete briefs, current option schemas | Independent implementation and judgment, diverse panels, fresh review rounds |
| Isolation | `delegate_task` with `isolation: "worktree"`; ordinary threads only on explicit user request | One writer per checkout and branch |
| PR lifecycle | Parent-owned links and watches, with children returning findings | Review triage and independent current-patch verdicts |
| Wakeups | Native watch plus a coordinator-bound schedule where required | Autonomous progress, durable audits, confirmed merge before advancing |
| History | Scoped T3 thread reads and searches | Evidence from the active project, no unrelated private chats |
| Proof | Available preview/device tools, repository harness, PTY, or HTTP | Verification on the actual user surface and its side effects |
| Installation | WSL/Linux home-directory links, optional Windows junctions, bundled prompts, absolute child paths | Skills work outside this repository's checkout in the agent's own environment |
| Plans and long work | Native T3 delegation and watches in the remaining playbooks | Upstream 0.15.43 removes the plan checker and Orchestrate; figure-it-out handles large/unattended work, with the plan's proof and operator gates retained |
| Fixtures | Native Bun executables, platform PATH separator, and final newlines on imported DOT fixtures | Watcher behavior runs on Linux and Windows; statechart corpus runs on Linux |
| Statechart types | An explicit exit-code union and test callbacks that return void | Strict typechecking without casts or behavioral changes |
| Statechart Windows support | Author 0.15.46's native kill/janitor helpers, CRLF splitLines, hidden Java/mise calls, and UTF-8 Java output | Preserve cleanup and Windows PID-reuse protection, all corpus CRLF replays, our prior chunk regression and strict types; keep background janitor/taskkill hidden |
| Models and budgets | Catalog-resolved Opus-first preferences, advertised fast options, role-relative effort capped at xhigh, and preserved T3 choices | Fable's explicit-task/two-failed-run exception, fixed panel effort, different-vendor review, three budgets, and retired role removal survive without fabricated model IDs |
| Gemini 0.15.45/46 | Catalog-resolved Neon xhigh panel defaults and migration, replacing the 0.15.44 high cap | Migrate non-Neon Gemini 4 and Neon high in the three panel roles; preserve other Neon levels during migration, then apply each Neon's own xhigh/high/medium budget targets with supported-effort fallback |
| How and Why | One read-only T3 worker for How; direct record-based Why | Upstream 0.15.42's simplification, removal of old panels/templates, and direct tracing by dependent workflows |
| Worker rules | Installed absolute worker.md pointer in every complete brief; user/tool authority remains explicit | The operator's bar propagates without parent history, additional ceremony, or permission expansion |
| Architect and Reflect | Direct design tracing/sketches and scoped transcript reads | Upstream 0.15.43 removes their phase/panel/reference machinery; Reflect still needs approval before edits |
| Forge | Prefer stable T3's native PR/CI tools; GitHub `gh` remains the unavailable-operation/tool fallback | Complete paginated review, head-pinned bottom-up landing, parent-owned links/watches, and one topology writer |

The upstream watch-pr engine and worktree audit script remain bundled for provenance and their tests. T3 playbooks use the parent-owned native watch and T3 thread/worktree evidence. The shell worktree audit is not a Windows cleanup command. Cleanup always checks active ownership, dirty and unpushed state, and the resolved target before removal.

Mirror 0.15.46 also includes the watcher fix from its PR #24. Preserve its exclusion of fork PRs as stack children and removal of CSI/control characters from pretty-printed review paths, authors and first-line comment snippets. JSON results and readiness policy keep their source behavior; this formatting change does not make comment text trusted instructions.

The root `agents/` files are retained from the original port for source compatibility, but installed skills use their own bundled references. The standalone mirror's guide, marketing assets, Cursor plugin registration, and Benny automation package are outside this skills port's scope.

## Compatibility evidence

The runtime contract was checked against **stable T3 Code v0.1.11**, commit `59651c1761f6c63e9b6056839067066968e6a406`, on November 20, 2026. `t3-runtime.lock.json` records six reviewed orchestration, scheduling, PR, thread, and project sources. Nightly-only APIs are not required. Scoped thread search is available but skips subagents and is not exhaustive. Thread reads default to newest items; complete audits start with `afterPosition: -1`. PR watches persist across wakeups, and `task_status` consumes completed results rather than polling running tasks.

The 0.1.8 review covers optional `executedModel` evidence, `freshContext` sends, opt-in `freshSession` schedules, and private single-value secret requests. Delegation inputs, worktree isolation, model catalog options, completed-task consumption, project-scoped history, schedule binding, and parent-only PR watches retain their prior contracts. A PR error variant was removed without changing these call shapes. Actual execution models qualify diversity claims; absent evidence stays a gap. Fresh-session features do not replace independent delegates or reset existing coordinators by default.

The 0.1.10 review covers the changed delegation status/wakeup text, newest-first and backward history pagination, paginated PR inventories, optional background/pin metadata, explicit schedule binding, and creation-only webhook URLs. Separate thread/project toolkits establish scoped `t3_thread_search` and authorized top-level `t3_thread_launch`; prior blanket availability claims and the matching check were corrected. Thread-bound tools are unavailable to outside MCP clients without a calling T3 thread. These capabilities never authorize top-level conversations for internal delegation. Keep exact catalog IDs, isolated writers, completed-task consumption, parent-owned watches, and existing schedule context. The source's Fable/Claude family-versus-vendor rule and catalog-resolved model choices remain unchanged.

The 0.1.11 review adds native PR reads/lists/creation/update/replies/reviews/merge and CI logs/reruns, with forge permissions and current-head merge checks. Keep per-PR verdicts and report incomplete pages or logs. Native creation links the caller, so a parent still links a child's returned PR. Observed asynchronous/external merges and closures wake the parent; immediate agent-initiated completion can suppress a redundant wake. Older linked peers can still need authorized recovery. Explicit top-level launch strategies avoid new settings-dependent workspace/origin defaults. JSON-text delegate targets are accepted for provider compatibility; the port keeps structured catalog targets. [Review evidence](maintenance/t3-0.1.11-review.md) records the additional immutable handlers/watch implementation and live verification gap.

- https://github.com/pingdotgg/t3code/blob/v0.1.11/apps/server/src/mcp/toolkits/orchestrator/tools.ts
- https://github.com/pingdotgg/t3code/blob/v0.1.11/apps/server/src/mcp/toolkits/pullRequests/tools.ts
- https://github.com/pingdotgg/t3code/blob/v0.1.11/packages/contracts/src/orchestratorMcp.ts
- https://github.com/pingdotgg/t3code/blob/v0.1.11/apps/server/src/mcp/toolkits/thread/tools.ts
- https://github.com/pingdotgg/t3code/blob/v0.1.11/apps/server/src/mcp/toolkits/project/tools.ts

Automated checks verify source coverage, principle parity, recorded adaptations, installed references and the worker pointer, watcher behavior, and statechart rendering from the recorded TLC corpus. The plan-checker tests were removed with the source checker; unrelated checks remain. These are not a live model-behavior evaluation. Before widening autonomous use, run a T3 smoke task that creates an isolated worker, returns evidence, links a disposable PR, has the parent watch it, and cancels every monitor on completion. Tool absence must be reported rather than silently replacing the verification bar.
