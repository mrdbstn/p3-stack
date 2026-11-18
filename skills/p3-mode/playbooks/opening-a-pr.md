### Opening a PR

Invoked at the end of every other playbook.

Work from a git worktree off trunk, and keep unrelated work out of it. Code-writing delegates use isolated T3 worktrees and exclusive branches. Never reset another active writer's checkout. Rebase into small, landable commits. Run an explicit code-slop review over the diff before commit.

Title: `type(scope): subject`, naming a real symbol when one carries the change. Body: a one-minute briefing under 40 lines with these `##` headings in order, dropping empty ones: `## Why`, `## What changed`, `## Scope`, `## Tradeoffs` (only rejected alternatives a reviewer would otherwise ask about), `## Blast Radius`, `## Verification`.

Stack follow-ups by base branch. Open PRs ready with `gh pr create` without `--draft`. The parent registers each PR with `link_pull_request` and owns its native watch per [the T3 runtime contract](../references/t3-runtime.md); a child returns the URL, branch, head SHA, and evidence. Linking registers a PR, it does not create one. Opening a PR does not start a babysit.
