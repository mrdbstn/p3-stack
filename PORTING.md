# Fidelity policy

This fork preserves pstack's engineering behavior and adapts its harness mechanics to T3 Code. The source is the standalone backnotprop/pstack mirror of Lauren Tan's cursor/plugins/pstack. `upstream.lock.json` records the reviewed source commit, version, every imported skill/support file, and hashes before and after adaptation.

All 54 upstream skills and 23 playbooks are included. The 24 principle skills are byte-equivalent after newline normalization. The only entry-point renames are poteto-mode to p3-mode, poteto-help to p3-help, and setup-pstack to setup-p3. Do not shorten a source rule just to make the port smaller.

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
| Plan checker | Native schedule marker replaces the source `/loop` marker | The executable checker remains mandatory |
| Orchestration store | Original CLI and its atomic writes, locks, frontier, inbox, and SHA ledger | Structural bookkeeping instead of handwritten status |
| Fixtures | Native Bun executables and platform PATH separator | The original frontier and malformed-output assertions run on Windows too |
| Forge | GitHub `gh` is the supported default | Verified bottom-up landing and one topology writer |

The upstream watch-pr engine and worktree audit script remain bundled for provenance and their tests. T3 playbooks use the parent-owned native watch and T3 thread/worktree evidence. The shell worktree audit is not a Windows cleanup command. Cleanup always checks active ownership, dirty and unpushed state, and the resolved target before removal.

The root `agents/` files are retained from the original port for source compatibility, but installed skills use their own bundled references. The standalone mirror's guide, marketing assets, Cursor plugin registration, and Benny automation package are outside this skills port's scope.

## Compatibility evidence

The runtime contract was checked against T3's public orchestration, delegation target/isolation, and PR-tool definitions on October 16, 2026:

- https://github.com/pingdotgg/t3code/blob/main/apps/server/src/mcp/toolkits/orchestrator/tools.ts
- https://github.com/pingdotgg/t3code/blob/main/apps/server/src/mcp/toolkits/pullRequests/tools.ts
- https://github.com/pingdotgg/t3code/blob/main/packages/contracts/src/orchestratorMcp.ts

Automated checks verify source coverage, principle parity, recorded adaptations, installed references, plan rejection, and store behavior. These are not a live model-behavior evaluation. Before widening autonomous use, run a T3 smoke task that creates an isolated worker, returns evidence, links a disposable PR, has the parent watch it, and cancels every monitor on completion. Tool absence must be reported rather than silently replacing the verification bar.
