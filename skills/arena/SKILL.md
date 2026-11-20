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
3. Pick runners from `arena runners` in `p3-models.md`, resolved through the live catalog. Missing configuration and aliases inherit the parent target. On rejection use the nearest available model of the same family, or drop the seat, keep at least two runners, and say so. Never retry a rejected target. Use more runners for multiple design directions and repeat a model for generation-bound work. Keep panel seats at their listed effort per p3-mode.
4. Assign output paths. Each candidate writes to its own location (a git worktree where possible, otherwise `/tmp/arena-<slug>/candidate-<n>/`), per the **separate-before-serializing-shared-state** principle skill. A writing candidate gets `delegate_task` with `isolation: "worktree"`. Read-only candidates may share the checkout. One writer per worktree.

Use the runtime contract's model-family grouping for runners and its vendor grouping for the cross-judge. Fable is a separate family from other Claude models, but both are one vendor. Every other distinct model prefix is its own family. A provider instance is neither a model family nor a vendor. Keep complete catalog IDs unchanged when passing targets.

Setup's default Gemini runner and judge preference is detected Gemini 4 Neon at xhigh, using only advertised options. A configured seat keeps its listed level. Missing roles still inherit as above; do not fabricate a target from the preference name.

## Phase B: Fan out

Spawn all N candidates in one turn with `delegate_task`, one per runner entry, each with `mode: "async"`. T3 child agents get only the brief, never the parent's context, so every brief stands alone: the task, the path to the shared grounding, its own output path, and instructions to produce both the artifact and a short rationale.

Each rationale names the alternatives the candidate considered and what it rejected.

Let completions wake the parent, then consume each result with `task_status`; do not poll running tasks. If a candidate fails to produce output, proceed with N-1 and note the dropout in the synthesis record.

## Phase C: Cross-judge

After all Phase B candidates complete, spawn one read-only `delegate_task` from `arena cross-judge pool`, using the first available entry from another model vendor. Fable counts as Claude; aliases never judge. Resolve the pool through the live catalog. On rejection use the nearest valid same-family target, then the next eligible pool entry, or skip the judge and say so. If the parent model is unknown, use the first real entry and report that the vendor check did not run. The judge sees candidates by path label and scores each rubric criterion while you read in Phase D. Use `mode: "async"` and `isolation: "shared"` with a complete brief, after candidates stop writing.

## Phase D: Pick a base

Before relying on the judge's verdict, check `executedModel` when T3 reports it. If it belongs to the parent's vendor, discard that cross-judge verdict and try a fresh different-vendor judge under Phase C's fallback rules, or report that the judge was skipped. If the execution model is absent or null, report that actual-vendor diversity could not be verified; do not present requested-model diversity as observed execution.

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge when Phase C produced a usable judge. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the Laziness Protocol.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per the **prove-it-works** principle skill. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict or that Phase C skipped the judge, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
