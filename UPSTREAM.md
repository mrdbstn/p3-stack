# Updating pstack

The baseline is in `upstream.lock.json`. Keep a full local checkout of backnotprop/pstack so both the pinned commit and the candidate are available. The helper commands are read-only: they print status or a Codex apply_patch proposal, and never fetch, edit source, commit, push, or advance the lock themselves.

1. Fetch that checkout's upstream main with Git and inspect its new commits and MIRROR.md. Select an immutable candidate commit.
2. From this fork, run `node scripts/upstream.mjs status --source ../pstack --ref <candidate>`. Exit 1 means source content changed; exit 0 means no imported content changed.
3. Run `node scripts/upstream.mjs propose --source ../pstack --ref <candidate>`. It compares the pinned source, our current adaptation, and the candidate using a three-way merge. It prints a patch only when every merge is clean. Removed upstream files, collisions, and conflicting edits stop the proposal for manual review. Run it in a clean working tree.
4. Review the source delta and the proposed adaptation against PORTING.md and the T3 runtime contract. Apply the proposal with Codex's built-in apply_patch tool. Resolve conflicts using that same tool. Preserve the new source meaning, including changes that remove unnecessary ceremony. A clean textual merge does not establish semantic fidelity.
5. Re-read T3's current tool definitions when an orchestration adaptation changes. Run the installer tests, plan checker tests, full helper tests, typecheck, and a representative live T3 task where available. A failed or unavailable check stays explicit.
6. Only after that review, run `node scripts/upstream.mjs record --source ../pstack --ref <candidate>`. Apply its lock-file proposal. This records every reviewed local adaptation and will fail if an imported file is missing. Never record merely to silence a changed hash.
7. Run `node scripts/check.mjs`, review the final diff, and open a PR in this fork. The PR names the source commit/version, substantive source changes, T3 exceptions, and verification evidence.

Normal fork edits also update the recorded port hashes after review using `record` at the existing pinned commit. All 24 principles must remain exact. Their parity is enforced separately from the recorded local hash, so recording a changed principle does not bless it.

No recurring app automation is installed by this repository. CI checks each push and PR; future upstream syncs are explicit reviewed changes.
