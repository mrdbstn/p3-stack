---
name: setup-p3
description: Configure which models p3-stack uses per role and at what reasoning budget. Detects your available models and writes p3-models.md, which overrides the skill defaults. Use for /setup-p3, "configure p3 models", "p3 budget", or changing p3-stack's model choices.
disable-model-invocation: true
---

# Setup p3

Read [the T3 runtime contract](../p3-mode/references/t3-runtime.md) before configuring models. `auto` and `inherit-parent` both inherit the parent target. Configured effort is passed through supported `target.options`, never by changing a model ID. Recommend `large` on a fresh setup unless the user chooses another budget.

Write `p3-models.md`, a file that sets p3-stack's model per role. Default location is the current project root. Offer `~/.agents/p3-models.md` as the global option, and ask which one. A project file wins over the global one.

## Steps

### 1. Detect available models

Call `orchestrator_capabilities`. It lists the providers and models you can pass to `delegate_task` in this session, custom models included, with each one's provider instance ID and any reasoning options. That is the only source. If it returns nothing, stop and tell the user. Never write a provider or model it did not return. `inherit-parent` is always valid even though it is not a detected model.

### 2. Load current state

The roles are the labels shown in step 5. If `p3-models.md` already exists at the chosen location, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from the defaults in step 3(b). A line whose role is not in step 5, including the retired How explorer/explainer and Why investigator/synthesizer roles, is from a retired role. Drop it and list what was dropped.

A file without `# defaults: 2` predates the current defaults. The older T3 setup selected models from a live catalog, so a matching model name alone cannot distinguish a generated default from a user choice. Preserve existing targets and aliases, show the new recommendations beside them, and let the existing step 3(c) review settle any migration. Never silently replace user choices. Tell the user which values changed.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Ask plainly in the thread. Offer these four options with these exact labels, and name the current budget when the file records one.

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) Apply it.** Build the working table from detected models. Prefer Opus 5.5 for code roles (`feature, refactoring`, `bug-fix`, `perf-issue`, `hillclimb`), judgment/prose, Reflect, and swarm workers; Fable 5.2 for hardest tasks; and one each of Fable 5.2, Opus 5.5, and Gemini 4 Carbon for the panel roles. Search the live catalog for preferences missing from its short initial list. These are model-name preferences, not target IDs. If unavailable, map regular code and swarm roles to a strong detected coding model and hardest work, prose, and judgment to the most capable detected model. Fill panels with distinct detected families, up to three. Use the runtime contract's longest-prefix family grouping and different-vendor judge rule. A shared provider can host different vendors, and multiple provider instances alone do not establish diversity. Report missing capabilities or diversity. On a re-run, preserve existing model choices and aliases unless the user changes them in step 3(c). Speed follows the runtime contract; verification keeps its configured worker speed, and unavailable speed options are omitted.

On a fresh setup, prefer a detected fast option for swarm workers, Reflect tooling, and the Opus panel entry when that model advertises one. Omit unavailable speed options. At invocation, the runtime contract uses standard speed unless urgent, with verification retaining the configured worker speed. Preserve existing speed choices on re-runs.

Each role has its own starting effort. Ordinary code, judgment/prose, and Reflect judgment/divergent/synthesizer start at `xhigh`; hardest tasks start at `max`; swarm workers, Reflect tooling, and all panel roles start at `high`. `large` keeps that starting effort, `unlimited` raises it one step, `medium` lowers it one step, and `small` lowers it two, on the ladder `max` > `xhigh` > `high` > `medium` > `low`, clamped at either end. Derive the target from the role's starting effort each time, not its already-adjusted stored value, so re-running the same budget is idempotent. Apply the role's target to every panel entry without changing its model family.

Pass effort only through advertised reasoning options. If a model does not expose the target, use its highest option at or below it, else mark the role as needing a choice. `auto` and `inherit-parent` do not change. When the catalog exposes no reasoning options, map roles only and omit effort tokens; the budget label is still recorded. Never construct an ID or assume source-harness option limits apply to T3's catalog.

**(c) Show the roles and confirm.** Show every role with its model, marking any entry not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit-parent` and `auto` (the role runs on the parent thread's model, so omit the target in `delegate_task`) as the options. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one `delegate_task` runs per entry, aliases included, so the list length sets the count. `arena cross-judge pool` is also a list, but Arena tries entries in order from a model vendor other than the parent's, even on the same provider. Fable and other Claude models are one vendor. `auto` and `inherit-parent` never judge. If no different-vendor judge runs, Arena reports that it skipped the judge. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every real entry written must be in the `orchestrator_capabilities` result, under the provider instance it came from. `auto` and `inherit-parent` always pass. If a chosen entry is not available, stop and ask again.

### 5. Write the file

Write `p3-models.md` with `# defaults: 2`, a `# budget` line with the chosen label and the effort that label names, and one line per role, using the same labels p3-mode uses. Write each entry as `<providerInstanceId>/<model>`, followed by its effort option in parentheses when step 3(b) set one. Keep the complete model ID, including its namespace, unchanged. Overwrite the whole file so re-runs stay idempotent. Shape:

```
# p3 model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent thread's model (omit the delegate_task target). Entries in a panel list still count toward its fan-out.
# defaults: 2
# budget: large (xhigh)
feature, refactoring: <providerInstanceId>/<model> (<effort>)
bug-fix: <providerInstanceId>/<model> (<effort>)
perf-issue: <providerInstanceId>/<model> (<effort>)
hillclimb: <providerInstanceId>/<model> (<effort>)
judgment and prose: <providerInstanceId>/<model> (<effort>)
hardest tasks: <providerInstanceId>/<model> (<effort>)
reflect tooling: <providerInstanceId>/<model> (<effort>)
reflect judgment, divergent, synthesizer: <providerInstanceId>/<model> (<effort>)
arena runners: <entry>, <entry>, <entry>
arena cross-judge pool: <entry>, <entry>, <entry>
swarm workers: <providerInstanceId>/<model> (<effort>)
architect runners: <entry>, <entry>, <entry>
interrogate reviewers: <entry>, <entry>, <entry>
```

### 6. Confirm

Tell the user which file was written. T3 skills read project-root `p3-models.md`, then `~/.agents/p3-models.md`, at task start. Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill`. On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill that runs a model checker, proof, or another verifier against the code. If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, invoke `/create-formal-verification-skill`. On no, move on without pushing.
