### Opening a PR

Invoked at the end of every other playbook.

Work from a git worktree off trunk, and keep unrelated work out of it. Code-writing delegates use isolated T3 worktrees and exclusive branches. Never reset another active writer's checkout. Rebase into small, landable commits. Run an explicit code-slop review over the diff before commit.

Title: `type(scope): subject`, naming a real symbol when one carries the change. Body: a one-minute briefing under 40 lines with these `##` headings in order, dropping empty ones: `## Why`, `## What changed`, `## Scope`, `## Tradeoffs` (only rejected alternatives a reviewer would otherwise ask about), `## Blast Radius`, `## Verification`.

Stack follow-ups by base branch. Prefer `pull_request_create` with `draft: false` after the authorized commit/review; native creation pushes the thread's branch. Respect its push-hook approval outcome and report a returned `note` about skipped hooks; PR success does not establish that required hooks ran. Use `gh pr create` without `--draft` on the pushed branch when native creation is unavailable. Native creation links the caller's thread; the parent registers a child's returned PR with `link_pull_request`. The parent owns its native watch per [the T3 runtime contract](../references/t3-runtime.md); a child returns the URL, branch, head SHA, and evidence. Linking alone does not create a PR. Opening a PR does not start a babysit.
