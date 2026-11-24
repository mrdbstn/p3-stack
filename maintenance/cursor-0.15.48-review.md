# pstack 0.15.48 source and T3 review

Reviewed November 24, 2026.

## Immutable inputs

- Previous mirror: backnotprop/pstack `c3464c11c60b1352d5e8f5f0428a3a6943837568`, version 0.15.46.
- Imported mirror: [backnotprop/pstack `9dd340887a043aa1da07a0d5c4e6918bbb3a02a0`](https://github.com/backnotprop/pstack/commit/9dd340887a043aa1da07a0d5c4e6918bbb3a02a0), version 0.15.48.
- Author: [cursor/plugins `9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc`](https://github.com/cursor/plugins/commit/9e278fe4d4ecd8bfe98b1b79bf4be662efb338cc), compared with 0.15.46 `0b46ec399d55f2829e88822998f53b84944837d3`. The author delta is Reframe plus its help row. The latest 0.15.48 version includes the ambiguity step added after Reframe's introduction.
- Mirror policy addition: `d164eec2abdeffe63b2f4cd9fa1426723910a3be` (PR #26), with the new Reframe policy added subsequently. The generator was read for intent, not executed or imported outside the skills scope.
- Stable T3 remains v0.1.11 `59651c1761f6c63e9b6056839067066968e6a406`. All six pinned runtime sources were fetched again and match their recorded hashes. No new stable or nightly API is required.

## Semantic review

| Source change | Port behavior |
|---|---|
| Reframe starts with the operator's own files/code/description. If ambiguous, name two or three possible problems, their distinguishing terms/signs, then choose the most likely and explain why. | Import the 16-line skill unchanged. Do not replace grounding with summaries or skip the new ambiguity step. |
| Give 8–12 terms ranked by their effect on what gets built, with a plain meaning, the part of the description named, a real cited use and what the term lets the user ask for. Borrow from 2–3 neighboring fields, show where analogies break, identify omissions and rewrite the description. | Preserve the full sequence and counts. Reframe teaches and rewrites the description; do not add implementation, delegation, model selection or planning ceremony. |
| Open every cited link, confirm the claimed use, and remove unconfirmed citations. | Keep the evidence bar. Actual source-opening tools are a runtime capability; unavailable verification remains a gap, not fabricated citations. This maintenance review does not invoke Reframe or claim a live research evaluation. |
| The help catalog adds a Reframe row. | Add the equivalent installed sibling link to the adapted p3-help catalog without replacing its T3 guidance. |
| The mirror adds 58 identical `agents/openai.yaml` files with allow_implicit_invocation false, generated from source explicit-only frontmatter. | Import all source metadata after entry-point path renames. All 24 principle leaves and their 24 metadata files remain exact. Keep the generator outside the skills port; do not run it as a second source-edit mechanism. |
| Source help is explicitly invoked, while the old port omitted that mark. Source setup lacks the mark, while setup-p3 already requires explicit invocation. | Align help frontmatter with the imported source policy, remove the checker's obsolete automatic-help exception, and preserve setup-p3's existing T3 choice with a local policy file. All 59 ported skills have matching frontmatter and metadata. This is a packaging policy, not a new T3 MCP field or a claim all providers consume it. |

The mirror delta changes 60 paths: 58 new policy files, the new Reframe leaf and the modified help leaf. The inventory grows from 516 to 575 imported files and 58 to 59 skills. Setup-p3's one extra local policy is a documented T3 adaptation outside the source inventory. No executable helper or statechart code changes. The source principles and source policy files remain exact after LF normalization.

## Verification boundaries

The root checker now requires explicit frontmatter and matching policy metadata. The existing installer test checks the new skill and reads policy files through installed paths outside the checkout, while preserving a pre-existing real skill directory and safe repeated installation. It does not write to the user's installation. Root/helper checks, Linux/WSL statechart/typecheck, real TLC and Windows/Linux CI are recorded in the PR after execution.

Live T3/provider skill discovery, policy enforcement and Reframe research/model behavior remain unavailable and unrun. Static metadata and installer checks are not live provider/model evaluation. The running T3 installation, provider settings and user model files are untouched.
