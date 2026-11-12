---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for /arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
disable-model-invocation: true
---

# Arena

Before using T3 tools, read [the runtime contract](../p3-mode/references/t3-runtime.md).

Open a todolist with one entry per phase (Frame, Fan out, Cross-judge, Pick, Graft, Verify) before launching anything.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric. State what success looks like for *this* task, then turn it into 3-6 concrete gradeable criteria. The rubric is the picker's tool in Phase D. Candidates only see the task.
3. Pick the runners from `arena runners` in `p3-models.md`, resolved against `orchestrator_capabilities`. Missing configuration inherits the parent target; use `/setup-p3` to configure diversity. `auto` and `inherit-parent` omit `target`. On a rejected entry, use an available model of the same family, or drop the seat and say so when none exists. Never retry a rejected target. Restore dropped seats until there are two runners, or one when the configured line has one entry, using a remaining runner's model or the inherited parent when none remain. Say which fallback ran. Spawn more runners for distinct design directions; repeat a model for generation-bound work. Adjust supported effort and speed per p3-mode.
4. Assign output paths. Each candidate writes to its own location (a git worktree where possible, otherwise `/tmp/arena-<slug>/candidate-<n>/`), per the **separate-before-serializing-shared-state** principle skill. A writing candidate gets `delegate_task` with `isolation: "worktree"`. Read-only candidates may share the checkout. One writer per worktree.

Use the model-family grouping in the runtime contract for runners and the cross-judge. Every other distinct model prefix is its own family, including GPT; do not collapse unfamiliar prefixes into one family. A provider instance is not a model family. Keep complete catalog IDs unchanged when passing targets.

## Phase B: Fan out

Spawn all N candidates in one turn with `delegate_task`, one per runner entry, each with `mode: "async"`. T3 child agents get only the brief, never the parent's context, so every brief stands alone: the task, the path to the shared grounding, its own output path, and instructions to produce both the artifact and a short rationale.

Each rationale names the alternatives the candidate considered and what it rejected.

Let completions wake the parent, then consume each result with `task_status`; do not poll running tasks. If a candidate fails to produce output, proceed with N-1 and note the dropout in the synthesis record.

## Phase C: Cross-judge

After all Phase B candidates complete, choose one model from `arena cross-judge pool` in `p3-models.md`, in pool order. The judge must be from a different model family than the parent, including when both use one provider. `auto` and `inherit-parent` never judge. Resolve entries through the live catalog; on rejection use a valid variant of the same model at the closest effort and speed, or continue to the next entry. If the pool has no usable different-family entry, try other detected different-family models. If none runs, skip the judge, pick the base alone in Phase D, and say so. If the parent model is unknown, try real entries in pool order and report that the family check did not run. Spawn one read-only `delegate_task` with `mode: "async"` and `isolation: "shared"`. It sees the rubric and candidates by path label, scores each criterion, and recommends a base with rationale. It runs alongside your reading in Phase D, after all candidates stop writing.

## Phase D: Pick a base

Before relying on the judge's verdict, check `executedModel` when T3 reports it. If it belongs to the parent's family, discard that cross-judge verdict and try a fresh different-family judge under Phase C's fallback rules, or report that the judge was skipped. If the execution model is absent or null, report that actual-family diversity could not be verified; do not present requested-model diversity as observed execution.

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge when Phase C produced a usable judge. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the Laziness Protocol.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per the **prove-it-works** principle skill. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict or that Phase C skipped the judge, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
