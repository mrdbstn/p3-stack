# Cursor pstack 0.15.42: pending mirror sync

Reviewed November 15, 2026. This is a source review, not a completed import.

## Immutable inputs and blocker

- Current port: pstack 0.15.36 at `97de40dcca2fa396124c3e70a1d8cc28005f60a3` in [backnotprop/pstack](https://github.com/backnotprop/pstack/commit/97de40dcca2fa396124c3e70a1d8cc28005f60a3).
- Candidate author source: pstack 0.15.42 at [cursor/plugins `bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7`](https://github.com/cursor/plugins/commit/bf0c7cd80abdbf7fe47b634978a7d1b4071f71a7), compared with its previous pstack revision `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.
- Latest mirror at review: `f905b88ebdd877e6b36fcc791970d47f44d15a15`, still 0.15.36. Its imported skill tree matches our baseline. The new commits change MIRROR.md and SYNC-LOG.md only.
- Stable T3 remains v0.1.9, `24e77473ecf41bc1f7142529c7911c1c1aae1d76`; the previously reviewed runtime sources have not changed.

The configured source mirror has not incorporated the author changes. UPSTREAM.md imports and records that mirror's immutable snapshots; it cannot truthfully record 0.15.42 against the current mirror commit. Keep this PR in draft until a mirror revision containing the changes is available, then finish the import here. Do not advance either lock, claim current source fidelity, or merge this review as a completed sync. No user decision is needed. The daily maintenance check should resume this PR rather than create a duplicate.

## Semantic review

| Change in the author source | Required port behavior |
|---|---|
| Why becomes a single short file. Its investigators, synthesis, model routing, format, and reference files are removed. | Preserve the simplification. Answer from commits and PR discussions; search further when needed, cite authors, label inferences, and report gaps. Delete the retired references rather than retaining the old workflow under T3. |
| How becomes one read-only worker with an inline architectural brief. Its complexity gate, explorer panel, synthesis, formats, and templates are removed. | Use one complete T3 delegation brief and present its result. Remove the old explorer/explainer roles and templates. Do not recreate the discarded panel. |
| pstack no longer automatically routes nontrivial work through How. Architect and six code/investigation playbooks trace the code directly. Related no-comments, teach, blast-radius, help, and bundled Comment Sicko references change. | Remove the trigger and dependent references throughout the port. Keep direct architectural grounding; preserve the explicit How entry point. Check installed references after deleting the old files. Refresh the bundled prompt from its reviewed source. |
| Recall starts its own per-source investigators instead of borrowing Why's deleted playbooks. | Keep project-scoped T3 history and per-source shared-record investigation. Do not restore the removed Why machinery or read unrelated sessions. |
| Sharpen asks for experiments to settle observable choices and leaves product/preferences to the user. Reflect replaces a model-name example with a function rename. | Import both changes without adding a question gate or expanding scope. |
| Defaults move toward Fable for hardest work, Opus for regular code/judgment and workers, and a three-entry Fable/Opus/Gemini panel. | Map the intended capability roles through the live T3 catalog and its option schemas. No Cursor slugs, guessed IDs, or unsupported effort/speed options. Preserve explicit user targets. Report missing capability or diversity instead of inventing it. |
| Budget labels now move each role's own starting effort by steps: large keeps it, unlimited raises one, medium lowers one, small lowers two. | Replace the port's uniform absolute target with supported per-role relative adjustments. Clamp using advertised options. Preserve aliases and the configured family. Source-specific absence of fast/xhigh slugs is not evidence about T3's live catalog. |
| Fable is a separate family from other Claude models, but both count as the same vendor for cross-judging. Other families use their own prefixes after stripping a leading cursor-. | Preserve family versus vendor semantics independently of provider instances. Classify the model component of a namespaced ID while passing its full ID unchanged. Change Arena and setup from a different-family judge gate to a different-vendor gate; qualify the gate with executedModel evidence when available. Same-vendor Fable/Opus does not qualify. If no eligible judge runs, skip it and say so. |
| Setup retires How/Why roles and writes a defaults-generation marker. Legacy default values migrate while user choices remain. | Drop retired roles. Preserve the marker/migration purpose, but do not treat an unmarked T3 file as a generated Cursor config or rewrite an intentional model selection. T3's old setup selected live catalog models, so its values cannot be identified as old Cursor defaults just by matching a slug pattern. Explain any proposed migration in setup's existing review step. |
| Statechart reruns SANY in plain mode after an XML parse failure to report the source line/column, with a 40-line cap. | Import the fallback and three malformed-spec tests; retain native Windows process cleanup, streaming CRLF handling, strict type fixes, and temp ownership checks. A spawn error still falls back to the existing diagnostic. |
| Mermaid parent-entry arrows stop at a parent's border when there is only one incoming source, then use internal start arrows. Multiple incoming sources retain direct arrows. | Import drawing logic, shared arrow reader, changed fixtures, chart tests, and the Pele title-bar regression. Preserve labels and semantic transition evidence. Exercise nested parents and both supported renderers through the recorded corpus/render suite. |

No principle skill changes appear in the candidate diff. Guides, Cursor registration, assets, and Benny automation remain outside this skills port.

## Completion and verification

Once the mirror catches up, compare its immutable delta with this review; it may include additional fixes. Use the normal three-way proposal, manually review removals/conflicts, apply source edits with built-in apply_patch, and only then generate the reviewed source lock. Update source counts, setup roles, runtime family/vendor guidance, fidelity documentation, and SYNC-LOG.md as appropriate.

Run source coverage and exact principle checks, root tests, the helper's frozen install/full Bun tests/typecheck, Linux/WSL statechart tests/typecheck, and real Windows/Linux TLC smoke. The new SANY diagnostics require Java/TLC and must actually execute before claiming them verified. Review all current-head CI and unresolved PR feedback before marking ready and merging.

Baseline verification on November 15: source checks passed for 58 skills and 536 files, including all exact principles; 7 root tests and 61 Bun helper tests passed; frozen helper install and typecheck passed. WSL Node 22.22.1 statechart typecheck passed and its suite reported 268 passed, 67 optional live tests skipped, 0 failed (335 total). Separate real TLC 1.7.4 Counter/CounterDeadlock smoke passed on native Windows and WSL with expected exit codes and matching reports/charts.

Checks of the unchanged 0.15.36 baseline or this review document do not verify the unimported 0.15.42 behavior. Live T3/provider delegation and PR-watch smoke remains unavailable in this maintenance environment; source review and CI are not a live model evaluation.
