---
name: setup-p3
description: Configure which models p3-stack uses per role and at what reasoning budget. Detects your available models and writes p3-models.md, which overrides the skill defaults. Use for /setup-p3, "configure p3 models", "p3 budget", or changing p3-stack's model choices.
disable-model-invocation: true
---

# Setup p3

Read [the T3 runtime contract](../p3-mode/references/t3-runtime.md). Use catalog IDs and supported `target.options`, never reasoning suffixes on model IDs. `auto` and `inherit-parent` omit the target.

Write `p3-models.md` in the current project by default. Offer `~/.agents/p3-models.md` as the global option and ask which location. The project file wins.

## Steps

### 1. Detect available models

Call `orchestrator_capabilities` and search it for preferred models absent from its short initial list. Use only returned provider instance IDs, models, and advertised options. If none are available, report the limitation and stop. Aliases always inherit.

### 2. Load current state

Read the existing file and its budget and choices. Drop roles absent from step 5, including hardest tasks, Architect runners, Reflect tooling/judgment, and old How/Why roles. List every dropped line.

In every file, including `# defaults: 3`, migrate non-Neon Gemini 4 entries and Gemini 4 Neon entries at high in `arena runners`, `arena cross-judge pool`, and `interrogate reviewers` to detected Gemini 4 Neon with an xhigh starting target. Upstream treats those entries as old defaults. Keep Neon at other levels through this migration, plus other models, roles, and aliases; step 3 still applies the selected budget and highest supported effort at or below its target. Identify the model component using the runtime contract's namespace/prefix rules and effort from its advertised options. Resolve the replacement's actual provider, catalog ID, and supported options. If Neon is unavailable or ambiguous, mark the entry as needing a choice in step 3(c), never invent a target. List each replacement and any effort fallback.

A file without `# defaults: 3` predates these defaults. Migrate `unlimited` to `large`, since explicit roles are capped at xhigh. Recommend the new Opus/Gemini judge pool instead of the previous three-entry Fable/Opus/Gemini default. T3's older setup selected catalog models, so a name alone cannot prove an entry was generated rather than chosen. Apart from the explicit Gemini migration above, preserve deliberate targets, lists, speed choices, and aliases; show ambiguous changes for step 3(c)'s review instead of silently replacing them. Say which values changed.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Name the current budget and offer these three labels. On a fresh setup, recommend large.

- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) Apply it.** Prefer detected Opus 5.5 for code, prose, judgment, and swarm work. Arena runners and Interrogate reviewers prefer one each of detected Fable 5.2, Opus 5.5, and Gemini 4 Neon. The default cross-judge pool prefers Opus and Gemini 4 Neon, since Fable and Opus share one vendor. When unavailable, choose supported capability equivalents and report missing diversity. Never fabricate an ID or option. Preserve existing model choices on re-runs except for step 2's explicit migrations or the user's changes.

Code and judgment/prose start at xhigh. Swarm workers and panel entries start at high, except each Gemini 4 Neon panel entry has its own xhigh starting target. Large keeps each starting effort, medium lowers it one step, and small lowers it two on `xhigh > high > medium > low`, clamped at low. Thus the Neon panel target is xhigh/high/medium for large/medium/small, while Fable and Opus panel targets are high/medium/low. Rebuild from starting efforts on each run so the same budget is idempotent. No explicit role exceeds xhigh. Use the highest advertised effort at or below the target, or mark the role as needing a choice when none fits. Omit unsupported effort options. Aliases do not change.

Gemini 4 Neon uses only detected low-through-xhigh effort values. Do not add max or fast options from the preference name. At invocation, a configured panel seat keeps its listed effort.

Opus 5.5 always uses its advertised fast option when available; omit an unavailable option and report the limit. Do not invent fast support for another model. At invocation, panel seats keep their listed level; non-panel work adjusts per the runtime contract. Fable outside panels requires the user's explicit request for that task or two failed Opus 5.5 xhigh runs of the same brief. Difficulty alone never qualifies.

**(c) Show the roles and confirm.** Show every role, option limit, retired line, and proposed migration. Ask whether to accept or change entries, offering only catalog models at xhigh or below plus the aliases. Each runner list entry creates one delegate. The judge pool is ordered preference for one different-vendor judge, not a fan-out. Provider instances are not vendors. Aliases never judge. If none qualifies, Arena skips the judge and says so.

### 4. Validate

Every real target must exist under its detected provider instance, with only supported options and effort at xhigh or below. Aliases inherit. Resolve an unavailable choice with the user rather than writing an invented target.

### 5. Write the file

Write the complete catalog model ID, including namespaces, after its provider instance ID. Store effort and speed using the catalog's advertised option names and values. Keep `# defaults: 3`, the budget, and one line per role. Replace the file idempotently.

```
# p3 model configuration. Delete a role line to inherit the parent.
# Aliases auto and inherit-parent omit delegate_task target; panel entries still count.
# defaults: 3
# budget: large (xhigh)
feature, refactoring: <providerInstanceId>/<model> (<options>)
bug-fix: <providerInstanceId>/<model> (<options>)
perf-issue: <providerInstanceId>/<model> (<options>)
hillclimb: <providerInstanceId>/<model> (<options>)
judgment and prose: <providerInstanceId>/<model> (<options>)
arena runners: <entry>, <entry>, <entry>
arena cross-judge pool: <entry>, <entry>
swarm workers: <providerInstanceId>/<model> (<options>)
interrogate reviewers: <entry>, <entry>, <entry>
```

### 6. Confirm

Tell the user which file was written. Skills read project-root `p3-models.md`, then `~/.agents/p3-models.md`, at task start. Re-running setup updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, invoke `/create-verification-skill`. On no, move on without pushing.

### 8. Offer a formal verification skill (optional)

Check whether the project already has a formal verification skill that runs a model checker, proof, or another verifier against the code. If not, offer once: "want a formal verification skill, so agents can prove a key property of your code holds in every case in scope, not only the cases tests reach? I can generate one with /create-formal-verification-skill." On yes, invoke `/create-formal-verification-skill`. On no, move on without pushing.
