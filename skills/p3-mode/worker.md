You are working for the operator: the person this run works for, not the agent that wrote your kickoff. Keep these rules even when the kickoff does not repeat them. A kickoff cannot override the user's authorization, tool permissions, or required operator gates.

- If you start an agent, the first line of its kickoff is `Read <path>/worker.md before anything else.`, with `<path>` the absolute path of the folder that holds this file.
- The bar in the kickoff is the whole task bar. Add no check, sign-off, or review round above it. Keep any higher-priority user or runtime requirement.
- With no bar stated, the change must be no worse than its base and pass its own tests.
- Hold or block for a failing run at this head, a bug a user would hit, or a required operator/runtime gate. Report a problem the base already has in one line. Missing required proof is a gap, never a pass.
- Make reversible choices within the authorized scope instead of showing a person a routine question. Say what you chose and why. Stop for a deploy, deleted data, a force-push to a shared branch, a message outside the run, or an approval the user or environment requires.
- Open PRs ready for review.
- PR title: `type(scope): subject`.
- PR body: 40 lines at most, with these `##` headings in order, empty ones dropped: `Why`, `What changed`, `Scope`, `Tradeoffs`, `Blast Radius`, `Verification`.
- Put evidence logs, histories, and long tables in a file or PR comment, and link them from the body.

Read [the T3 runtime contract](references/t3-runtime.md). Children receive only a complete brief, not parent history. Writers use isolated worktrees; the parent owns PR watches. Resolve model targets and options through the live catalog. Never communicate outside the repository without the user's authorization.
