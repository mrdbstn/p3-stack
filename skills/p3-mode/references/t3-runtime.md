# T3 runtime contract

This adapts pstack's mechanics to T3. Preserve its design, verification, ownership, and operator gates. Tool availability is a runtime fact. Check the actual tool schema and `orchestrator_capabilities` before using a capability. An unavailable tool is a reported limitation, never permission to skip proof.

## Paths and installation

Detect the running environment before selecting a shell or tool. In WSL/Linux, use native Linux tools through PATH and keep repositories and dependency stores under the Linux home directory. Do not invoke Windows executables or use `/mnt/c` as the checkout or dependency store. On native Windows, use no-profile PowerShell and tools through PATH. Skills must be installed in the same environment and user account where the agent runs.

Resolve bundled files from the absolute path of the installed skill, not the project working directory. From any leaf skill, p3-mode is `../p3-mode/SKILL.md`. From p3-mode, its scripts are `scripts/` and its playbooks are `playbooks/`. Pass absolute paths to children. The Comment Sicko prompt is bundled with no-comments at `references/comment-sicko.md`. No installed skill depends on the repository-root `agents/` folder.

When a playbook says to re-read its trunk version, that trunk belongs to the skill checkout. Resolve that checkout from the installed file and use `git -C <absolute-skill-repo> show origin/main:<skill-path>` when the ref is available. The target application's trunk need not contain any p3-stack files. Otherwise re-read the installed version and record that limitation.

Read project-root `p3-models.md` at task start. If absent, read `~/.agents/p3-models.md`. The project file wins. An absent role, `auto`, or `inherit-parent` inherits the parent target. Configure a panel with `/setup-p3` before promising model diversity. Installing a skill does not invoke it; use `/p3-mode` for rigorous tasks, or invoke individual skills.

## Models and effort

Each configured entry names a provider instance, model, and optional effort. Resolve these against the live catalog. Pass `target: {providerInstanceId, model, options}` using only option keys and values actually advertised for that model. Never invent a model slug or attach a reasoning suffix to a model ID. Omit the target for `auto` or `inherit-parent`.

The configured budget is the starting effort. Raise effort one supported step for the hardest work, lower it one step for ordinary judgment and two for routine mechanics. Keep the configured provider and model family, so a diverse panel stays diverse. Select a fast option only when urgent, such as red CI or a blocked person. Verification keeps the configured swarm model and speed. When the catalog exposes no effort or speed option, omit it and report that limit. Do not retry invented options after rejection. Use the configured supported target and say what changed.

## Delegation and isolation

Use `delegate_task` with `mode: "async"` and a complete brief. Children receive only that brief, not parent conversation history. Include the outcome, exclusive scope, acceptance checks, absolute file pointers, standing orders, prior findings, and report shape. Do not launch a child merely to run the parent's entire playbook.

Code writers, competing implementations, and live verifiers use `isolation: "worktree"` when this field is supported. T3 creates the checkout from the parent's current local commit, runs project setup, and binds the child before execution. Uncommitted changes are not copied. Commit required inputs first. Name a child-owned branch before it writes or pushes. Read-only investigators may use `isolation: "shared"`. Never run concurrent writers in the same checkout, even on disjoint files if they can change shared refs or run Git commands.

If isolated delegation is unavailable, serialize writers in the owned checkout or report the limitation. Do not silently turn an internal subtask into a separate conversation. `t3_thread_launch` and `create_threads` require an explicit user request for ordinary top-level threads. When authorized, bind the requested workspace before starting and follow those tools' current schemas.

Async completion wakes the parent. End the turn when waiting; do not poll or spawn a watcher. Use `task_status` only to consume a result needed mid-turn or reconcile durable state after interruption. A timeout does not cancel work. Check pending questions with the pending-request tools. Fresh review rounds and fix rounds use fresh tasks with consolidated context and distinct retry keys. Never use a completed task's original result as evidence for a later round.

## Pull requests and wakeups

The parent owns PR links and watches. Link each PR with `link_pull_request` and inspect stack order with `list_thread_pull_requests`, cross-checking live `gh` state. A child returns its URL, branch, head SHA, evidence, and triage findings to the parent. A child cannot call `watch_pull_request`; neither fresh delegation nor worktree isolation changes that restriction.

The parent handles existing comments before arming `watch_pull_request`, then ends its turn. On a wake it re-reads the PR and checks readiness itself. Route code changes through the single owning writer. A wake does not authorize a merge. Use `unwatch_pull_request` before handing work back. Watches stop on merge, close, stop, or certain read failures; they are not a guaranteed merge-completion notification.

Use `schedule_task` with a structured schedule object for an authorized autonomous run's audit or a merge-completion heartbeat. Bind it to the coordinator thread and include the done predicate, durable store, recovery checks, and stop condition. Keep unchanged audits quiet. Record the returned schedule ID and next run time. Delete the schedule on completion or an explicit stop. A PR watch is not a generic watcher for arbitrary refs or external events; those need an appropriate supported integration or a scheduled check.

## Proof and history

Drive the actual surface with available `preview_*` browser tools, `device_*` simulator tools, a repository control skill, PTY tooling for CLIs, or HTTP for services. Capture actions, resulting state, and side effects. Do not substitute compilation for behavioral proof. Missing tooling stays a verification gap.

Read history with `t3_thread_read` and `t3_thread_search`, restricted to the current project and the explicitly requested threads. Use activity view when checking tool calls. Verify that the tool output actually exposes the evidence needed; a summary does not prove a file was read. Never mine unrelated projects' session folders.

## Durable orchestration

Use the bundled plan checker and `scripts/orch/orch.ts`, resolved from p3-mode's absolute directory. Keep the store outside disposable child worktrees. Use the CLI for ledger, frontier, inbox, gates, and derived status. Its atomic writes and locking enforce bookkeeping invariants. T3 schedules and PR links complement this store; they do not replace its verification ledger. Reconcile live tasks, pushed refs, and current PR head SHAs after a restart.
