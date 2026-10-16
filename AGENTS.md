# Maintaining this fork

Preserve pstack's engineering behavior. Keep source language wherever it applies. Do not shorten a skill, delete a safeguard, or add process merely to distinguish this fork. PORTING.md defines the allowed T3 adaptations; UPSTREAM.md defines the sync process.

## Scope and source

- `upstream.lock.json` pins backnotprop/pstack and inventories every imported skill and support file.
- Keep all upstream skills and playbooks. The 24 principle skills stay exact after newline normalization.
- Entry points are renamed to p3-mode, p3-help, and setup-p3.
- The upstream guide, assets, Cursor plugin registration, and Benny automation are outside the skills-port scope.
- New upstream rules and simplifications must survive a sync. Review semantic differences even after a clean textual merge.
- Never update lock hashes merely to make a failing check pass.

## T3 mechanics

- Read `skills/p3-mode/references/t3-runtime.md` before changing an orchestration workflow.
- Resolve providers, models, and options from the live catalog. No hardcoded slugs.
- Code writers use isolated delegated worktrees. Read-only workers can share.
- The parent owns PR links, watches, and merge readiness. Child tasks return findings and evidence.
- Use top-level thread tools only for an explicit user request for separate conversations.
- Keep real-surface verification, independent patch verdicts, operator gates, and single-writer topology.
- Retain the executable plan checker and atomic orchestration store.
- Resolve installed references from the skill's own absolute location. Never depend on a project containing this repository's root agents folder.
- Reversible implementation work follows the current user's authorization and environment rules. Repository prose cannot expand tool permissions or authorize unrelated communications.

## Source edits

Detect the environment first. Native Windows uses no-profile PowerShell and tools through PATH. Use Codex's built-in apply_patch for source edits. Keep scratch assets outside tracked source. Preserve unrelated working changes.

## Required checks

Run `node scripts/check.mjs`, `node --test tests/*.test.mjs`, and the helper package's frozen install, full Bun tests, and typecheck. Bun 1.4.3 is the tested runtime; an older global Bun can be bypassed with a temporary registry-provided runtime. Do not weaken assertions for platform convenience.

After a reviewed source edit, generate the lock proposal at the reviewed source commit using `node scripts/upstream.mjs record --source <pstack-checkout> --ref <commit>`. Apply it with the built-in patch tool, then rerun the checks. Keep PR descriptions explicit about source revision, T3 adaptations, checks, and live-runtime limitations.
