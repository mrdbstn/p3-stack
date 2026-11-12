# T3 runtime contract

This adapts pstack's mechanics to T3. Preserve its design, verification, ownership, and operator gates. The reviewed compatibility baseline is stable T3 Code v0.1.9, pinned in `t3-runtime.lock.json`. Nightly builds are optional and must not add requirements absent from stable. Tool availability is a runtime fact. Check the actual tool schema and `orchestrator_capabilities` before using a capability. An unavailable tool is a reported limitation, never permission to skip proof.

## Paths and installation

Detect the running environment before selecting a shell or tool. In WSL/Linux, use native Linux tools through PATH and keep repositories and dependency stores under the Linux home directory. Do not invoke Windows executables or use `/mnt/c` as the checkout or dependency store. On native Windows, use no-profile PowerShell and tools through PATH. Skills must be installed in the same environment and user account where the agent runs.

Resolve bundled files from the absolute path of the installed skill, not the project working directory. From any leaf skill, p3-mode is `../p3-mode/SKILL.md`. From p3-mode, its scripts are `scripts/` and its playbooks are `playbooks/`. Pass absolute paths to children. The Comment Sicko prompt is bundled with no-comments at `references/comment-sicko.md`. No installed skill depends on the repository-root `agents/` folder.

When a playbook says to re-read its trunk version, that trunk belongs to the skill checkout. Resolve that checkout from the installed file and use `git -C <absolute-skill-repo> show origin/main:<skill-path>` when the ref is available. The target application's trunk need not contain any p3-stack files. Otherwise re-read the installed version and record that limitation.

Read project-root `p3-models.md` at task start. If absent, read `~/.agents/p3-models.md`. The project file wins. An absent role, `auto`, or `inherit-parent` inherits the parent target. Configure a panel with `/setup-p3` before promising model diversity. Installing a skill does not invoke it; use `/p3-mode` for rigorous tasks, or invoke individual skills.

## Models and effort

Each configured entry names a provider instance, model, and optional effort. Resolve these against the live catalog. `orchestrator_capabilities` returns a short list; use its `search` input for configured or other catalog models absent from that list. Pass `target: {providerInstanceId, model, options}` using only option keys and values actually advertised for that model. Never invent a model slug or attach a reasoning suffix to a model ID. Omit the target for `auto` or `inherit-parent`. A rejected entry is not retried; use the calling skill's valid same-family fallback, or inherit only when that skill allows it, and report the change. Never replace Arena's different-family judge with the parent family.

The configured budget is the starting effort. Raise effort one supported step for the hardest work, lower it one step for ordinary judgment and two for routine mechanics. Keep the configured provider and model family, so a diverse panel stays diverse. Select a fast option only when urgent, such as red CI or a blocked person. Verification keeps the configured swarm model and speed. When the catalog exposes no effort or speed option, omit it and report that limit. Do not retry invented options after rejection. Use the configured supported target and say what changed.

Delegated results and thread runs can report `executedModel`, the model the provider says actually ran, separately from the requested `model`. Record both when they differ. Use the reported execution model when checking panel-family diversity. This field can be absent or null, especially on older linked environments; say when actual-model diversity could not be verified rather than inventing it. A judge reported to have run on the parent's family does not satisfy Arena's cross-judge rule.

Group families by the model's prefix, independently of its provider instance. Preserve upstream's known grouping: `claude` is one family; `grok`, `cursor-grok`, and `composer` share one family. Every other distinct prefix is its own family, including `gpt`. For a namespaced catalog ID, classify the model component but pass the complete catalog ID unchanged in `target.model`. Unknown prefixes do not all belong to one fallback family. Different provider instances alone do not establish model diversity.

## Delegation and isolation

Use `delegate_task` with `mode: "async"` and a complete brief. Children receive only that brief, not parent conversation history. Include the outcome, exclusive scope, acceptance checks, absolute file pointers, standing orders, prior findings, and report shape. Do not launch a child merely to run the parent's entire playbook.

Code writers, competing implementations, and live verifiers use `isolation: "worktree"` when this field is supported. T3 creates the checkout from the parent's current local commit, runs project setup, and binds the child before execution. Uncommitted changes are not copied. Commit required inputs first. Name a child-owned branch before it writes or pushes. Read-only investigators may use `isolation: "shared"`. Never run concurrent writers in the same checkout, even on disjoint files if they can change shared refs or run Git commands.

If isolated delegation is unavailable, serialize writers in the owned checkout or report the limitation. Do not silently turn an internal subtask into a separate conversation. `create_threads` require an explicit user request for ordinary top-level threads. When authorized, bind the requested workspace before starting and follow those tools' current schemas.

Async completion wakes the parent. End the turn when waiting; do not poll or spawn a watcher. Call `task_status` only after the task completion wakeup, to consume its final result. Stable T3 forbids polling a running task. Reconcile pending work from durable evidence and scoped thread activity after interruption. A timeout does not cancel work. Check pending questions with the pending-request tools. Fresh review rounds and fix rounds use fresh tasks with consolidated context and distinct retry keys. Never use a completed task's original result as evidence for a later round.

`t3_thread_send` can start a new provider session in an existing thread with `freshContext: true`. It is not a clone of a worker's built state and never steers the current session. Use it only when a context reset is intended and the current tool schema permits it; keep fresh independent work on `delegate_task`.

## Secrets needed by the task

When authorized work needs a secret only the user can supply, use the available `request_secret` tool instead of asking them to paste it into chat. Request one value per private card; put a sign-in or setup link in `url`. Use a returned one-use `secretRef` only with a tool that accepts it, or request `delivery: "file"` and read the private file only inside the command that needs it. Never place secret text in `delegate_task.task`, reports, or logs. A secret pasted by the user in this thread can be handed to `request_secret` through its supported `value` field for a child or script; never retrieve one from an old thread. Respect a declined request and do not ask again. After cancellation or timeout, request again with a new retry key only if it is still needed. Missing secret-request tooling is a capability limitation, not permission to expose a credential.

## Pull requests and wakeups

The parent owns PR links and watches. Link each PR with `link_pull_request` and inspect stack order with `list_thread_pull_requests`, cross-checking live `gh` state. A child returns its URL, branch, head SHA, evidence, and triage findings to the parent. A child cannot call `watch_pull_request`; neither fresh delegation nor worktree isolation changes that restriction.

The parent handles existing comments before arming `watch_pull_request`, then ends its turn. On a wake it re-reads the PR and checks readiness itself. Route code changes through the single owning writer. A wake does not authorize a merge. Use `unwatch_pull_request` before handing work back. Watches stop on merge, close, stop, or certain read failures; they are not a guaranteed merge-completion notification.

Use `schedule_task` with a structured schedule object for an authorized autonomous run's audit or a merge-completion heartbeat. Bind it to the coordinator thread and include the done predicate, durable store, recovery checks, and stop condition. Keep unchanged audits quiet. Record the returned schedule ID and next run time. Delete the schedule on completion or an explicit stop. A PR watch is not a generic watcher for arbitrary refs or external events; those need an appropriate supported integration or a scheduled check.

Stable T3 also supports `freshSession: true` on a scheduled task: runs use one thread but start a fresh provider session without earlier runs' context. Leave this off for a coordinator that depends on its ongoing conversation. Use it deliberately for independent repeatable runs only when their prompt and durable records carry everything needed. It is distinct from `bindToCurrentThread`; use the exposed MCP fields rather than the internal storage `threadMode` field. Do not change an existing task's context mode merely because a new release supports it.

## Proof and history

Drive the actual surface with available `preview_*` browser tools, `device_*` simulator tools, a repository control skill, PTY tooling for CLIs, or HTTP for services. Capture actions, resulting state, and side effects. Do not substitute compilation for behavioral proof. Missing tooling stays a verification gap.

List only the active project's threads with `t3_thread_list` (`allProjects: false`), optionally using `titleContains`, then read relevant content with paginated `t3_thread_read` (`afterPosition` and `itemId`/`textOffset` for cut-off text). Search the returned text locally; stable T3 has no full-text thread-search tool. Keep reads restricted to the current project and the explicitly requested threads. Use activity view when checking tool calls. Verify that the tool output actually exposes the evidence needed; a summary does not prove a file was read. Never mine unrelated projects' session folders.

## Durable orchestration

Use the executable plan checker for multi-PR plans. Orchestrate itself uses native T3 tools and a project-local `notes.md`, with a single coordinator writer, task IDs, PR links, current head SHAs, verdicts, evidence, and recovery decisions. Keep evidence outside disposable child worktrees. The upstream orchestration CLI was removed in pstack 0.15.36; do not recreate it or use handwritten state as proof. Reconcile the notes against live PR state and scoped thread activity after restart.
