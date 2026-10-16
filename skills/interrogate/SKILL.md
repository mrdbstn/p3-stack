---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this code\", \"find blind spots\", or \"tear this apart\". Multiple LLM reviewers challenge changes from independent angles."
disable-model-invocation: true
---

# Interrogate

Before using T3 tools, read [the runtime contract](../p3-mode/references/t3-runtime.md).

Spawn one reviewer per configured model to adversarially review code changes. The adversarial signal comes from model diversity, not assigned personas. The deliverable is a synthesized verdict. Do NOT auto-apply changes.

## Step 1, Scope

Identify what to review from context:

- If the user points at specific files or a diff, use that.
- If on a feature branch, run `git diff main...HEAD` (or the appropriate base branch) for the full changeset.
- If the user's message references recent work, gather the relevant files.

Package the diff or file contents with any surrounding context files the reviewers need to understand the code.

## Step 2, Intent

Before spawning reviewers, state the intent in one clear paragraph from the user's message, commit messages, the PR description if one exists, and the code. If you're unsure about the intent, ask the user before proceeding.

## Step 3, Spawn Reviewers

Launch all reviewers in a single turn, one `delegate_task` per reviewer with `mode: "async"`. Use the `interrogate reviewers` line in `p3-models.md`, one reviewer per entry, labeled Reviewer A, B, C, and so on for the configured entry count. Resolve each entry's provider and model through `orchestrator_capabilities`. If the line is missing, run `setup-p3` first.

For each reviewer:
- The brief is self-contained. A delegated reviewer gets only the brief, never your context.
- The brief says read-only: inspect only, no writes, no git commands that change state.
- For an `auto` or `inherit-parent` entry, omit the model so that reviewer runs on the parent model.

If a configured target is rejected, refresh `orchestrator_capabilities`. Use a supported model from the same provider and family when available, report the substitution, and preserve panel diversity. If none is available, report the missing seat instead of inventing a default.

Read `references/reviewer-prompt.md` and fill the same template for every reviewer with the stated intent, the diff or file contents, the rubric from `references/rubric.md`, and the code-quality lens from `references/code-quality-review.md`. Match effort and speed per the runtime contract. Async completion wakes the parent; use `task_status` when results are needed mid-turn.

## Step 4, Synthesize

As results come back, build a unified picture. Parse every reviewer's findings. Merge findings that describe the same issue differently, and note which models raised each one. Findings two or more models raised independently are the highest signal. Read a lone model's finding, but weight it accordingly. Note disagreements. If one model flags something and another explicitly says the opposite, that is context for the verdict.

## Step 5, Lead Judgment

You are the lead reviewer, a pragmatic senior engineer, not a neutral aggregator. Read `references/lead-judgment.md` for the full framework. Put every finding in one of four buckets, with the model(s) that raised it and a one-line rationale.

- **Act on**. Real issues affecting correctness, security, or maintainability given the actual goals. They would block a real PR.
- **Consider**. Legitimate, but you're not sure they outweigh the cost of addressing them now. Worth the user's attention.
- **Noted**. Technically valid but not actionable. Context-dependent, premature optimization, or low-impact at this stage.
- **Dismissed**. Wrong, nitpicky, or missing context, with a brief reason.

## Output Format

### Intent
> [The stated intent paragraph from Step 2]

### Reviewers
- Reviewer [label]: [model name], [N findings] (one bullet per reviewer)

### Act On
[Each: description, which models raised it, why it matters.]

### Consider
[Each: description, which models raised it, the tradeoff.]

### Noted
[Brief list.]

### Dismissed
[Each with a brief rationale.]

### Agreement Map
[Where models agreed and diverged, and what that pattern tells us.]
