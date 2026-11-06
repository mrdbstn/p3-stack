# p3-stack

A maintained T3 Code adaptation of [Lauren Tan's pstack](https://github.com/backnotprop/pstack), forked from [uzairansaruzi/p3-stack](https://github.com/uzairansaruzi/p3-stack).

The reviewed baseline is pstack **0.15.36**, commit `e388616361ac78eeb2da66c148d882534aca4cb9`. All **58 skills**, **24 principles**, and **23 playbooks** are included. Principles stay exact. T3 adaptations and imported-file hashes are recorded in [PORTING.md](PORTING.md) and [upstream.lock.json](upstream.lock.json).

pstack helps agents write less, higher quality code through deliberate design, independent review, and proof on the real application. Use individual skills when you need them, or let `/p3-mode` route rigorous work.

Compatibility tracks **stable T3 Code v0.1.7**, pinned in [t3-runtime.lock.json](t3-runtime.lock.json). Nightly-only functionality stays optional. Runtime capabilities must still be checked for the installed app/provider combination.

## Install in WSL or Linux

Requires Node.js 22.18+ on the 22.x line, or Node.js 24+. The executable helper tooling also requires Bun 1.4.3 or newer and Git. GitHub workflows use `gh`.

```sh
mkdir -p ~/src
git clone https://github.com/mrdbstn/p3-stack.git ~/src/p3-stack
cd ~/src/p3-stack
node install.mjs
```

Use Linux-native Git, Node, and Bun from PATH. Keep this checkout, project checkouts, and dependency stores under your Linux home, not `/mnt/c`. Run the installer inside WSL using the same Linux user/environment as T3's agent. A Windows installation of the skills is not a WSL installation.

For one project, use `node install.mjs --project /home/you/src/project`. The installer links skills into `~/.agents/skills/` or the project's `.agents/skills/`, preserves existing real directories, and can be rerun. Keep this checkout while its skills are installed. `./install.sh` is an equivalent Unix convenience wrapper. Native Windows is also supported through `node install.mjs`, using directory junctions.

## Use

1. Run `/setup-p3` to choose your budget and available model roles.
2. Prefix a task needing rigor with `/p3-mode` and state how to tell it is done.
3. Ask `/p3-help` when unsure which skill fits.

Project-root `p3-models.md` overrides `~/.agents/p3-models.md`. Settings are read at task start. Unconfigured roles inherit the parent model; configure panels to obtain model diversity. Installation alone does not invoke the skills. Save the full mode for work that needs its extra review and verification.

T3 must expose the orchestration tools used by the chosen workflow. Models and options come from `orchestrator_capabilities`. Writers use isolated delegated worktrees. The parent owns PR watches. Ordinary top-level conversations are created only when explicitly requested. See the [runtime contract](skills/p3-mode/references/t3-runtime.md).

## Proof tooling

The executable plan checker remains bundled:

```sh
node skills/p3-mode/scripts/check-plan.mjs /path/to/plan.md
```

Installed skills resolve paths from their own location. Following upstream, Orchestrate now uses native delegation, PR watches, and project-local notes, and the orchestration CLI is removed. `/interrogate` keeps findings reproduced against the real code. New skills include `/statechart`, `/create-formal-verification-skill`, `/maintain-formal-verification-skill`, and `/ketchup-video`. Statechart bootstraps TLC and Java with mise on first use and needs network access.

## Verify and maintain

```sh
node scripts/check.mjs
node --test tests/*.test.mjs
bun install --cwd skills/p3-mode/scripts --frozen-lockfile
bun test --cwd skills/p3-mode/scripts
bun run --cwd skills/p3-mode/scripts typecheck
```

CI checks the port and helper tooling on Linux and Windows, and the statechart suite and typecheck on Linux. In `skills/statechart/scripts`, run `npm install --no-save --package-lock=false --ignore-scripts` and `npm test` for its recorded TLC corpus. Live TLC differential tests also need Java and `TLA2TOOLS`; otherwise they report skips.

[UPSTREAM.md](UPSTREAM.md) covers ongoing maintenance. A daily GitHub workflow detects pstack and stable T3 drift even when Codex is offline. A daily Codex maintenance task performs reviewed updates through branches, PRs, and passing CI. New source revisions never blindly overwrite T3 adaptations.

These checks establish source coverage and tool behavior. A live T3 model-behavior smoke run is still required to validate an installed app/provider combination.

## Credit

The skills, principles, and engineering approach are Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack). The original T3 adaptation is by [uzairansaruzi](https://github.com/uzairansaruzi/p3-stack). This fork maintains the source sync, native runtime mappings, packaging, and verification. MIT, see [LICENSE](LICENSE).
