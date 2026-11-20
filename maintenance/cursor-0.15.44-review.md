# pstack 0.15.44 source and T3 review

Reviewed November 19, 2026.

## Immutable inputs

- Author candidate: [cursor/plugins `e58dd043600587dbaf58ba315e7f2b38373eeb43`](https://github.com/cursor/plugins/commit/e58dd043600587dbaf58ba315e7f2b38373eeb43), version 0.15.44, compared with `2f87c854fe3e2fcda44ca86b46ede35aad3c46b7` (0.15.43).
- Recorded mirror baseline: backnotprop/pstack `83a729a182a29b59a2a42fc3d7736b0c376b55d4`, version 0.15.43. Observed mirror head `0d2dc00df47d7686c94324cfe9c3444710d9f16d` has the same skill tree and is not a new import.
- Stable T3 remains v0.1.10, `7d32075e3757ded707914e2450c3e392a9665765`. All six pinned sources were fetched again and match their recorded hashes. Catalog IDs, provider instances, and advertised options remain runtime data.

On November 19 the standalone mirror had not imported 0.15.44, so this PR prepared the author changes as a draft with the real 0.15.43 baseline. On November 20, mirror `4a4f41c46c67a006658ac17cef2d092593f6b26a` includes exactly the three reviewed skill changes, with harness-neutral wording. The import records that actual 0.15.44 snapshot after semantic review. The author's newer 0.15.45/46 changes are reviewed separately; this import does not claim they are already mirrored. Stable T3 advances separately within this PR to 0.1.11, with its own review evidence.

## Semantic review

| Author change | T3 port behavior |
|---|---|
| Arena runners/judge pool and mode defaults move Carbon to Gemini 4 Neon at high. | Use Neon as a discovery preference through the stable live catalog. Keep existing absent-role/alias inheritance, valid-family fallback, different-vendor judge requirements, and actual-model evidence. Do not fabricate Cursor slugs or claim Neon is available. |
| In every rules file, non-Neon Gemini 4 entries in arena runners, arena cross-judge pool, and interrogate reviewers are old defaults and migrate to Neon high. This is independent of defaults marker 3. | Identify the model component after namespace/leading Cursor normalization. Resolve a real Neon target and list every replacement in setup's existing confirmation. Mark unavailable or ambiguous targets as needing a choice. Preserve aliases and other models/roles. Explicit migration takes precedence over the generic preserve-existing-choice rule. |
| Neon has an xhigh slug, but Gemini remains high when its role targets xhigh. Mode also caps Gemini seats at high. | Enforce high as a policy cap in setup, mode, Arena, and the runtime contract even if the catalog exposes xhigh. Lower budget targets remain lower; do not misstate provider capability or invent an effort option. |
| README and the Claude Code harness doc follow the new preference; plugin versions and generated harness trees change. | Keep repository documentation consistent. Generated alternate harnesses, registration, and author guide remain outside the skills port. No principles, helper code, or statechart code change. |

## Verification boundaries

Required root/helper checks, Linux/WSL statechart suite/typecheck, and real Java/TLC checks are recorded in the PR after execution. The existing behavioral suites remain intact; prose checks cannot establish live model behavior. The maintenance client exposes no live T3 catalog, delegation, or PR-watch tools, so live Neon selection, migration, and provider execution remain unrun. The running T3 installation and user configuration are untouched.
