# Reviewed upstream syncs

| Date | pstack | Stable T3 | Result |
|---|---|---|---|
| 2026-11-05 | 0.15.36, `4ae1636abe217c7215774bf6b2265916a5c5f648` | v0.1.7, unchanged | Import upstream Windows statechart support: native process-tree cleanup, Windows temp variables, and CRLF parsing. Correct the trailing CR at a chunk boundary, reproduced by the new regression test. Preserve the T3 adaptations and prior strict type fixes. Add native Windows TLC pass/fail smoke coverage to CI alongside the Linux suite. |
| 2026-11-04 | 0.15.36, `ecec42adbe4f240e4ae19d296768445f0dfbd38e` | v0.1.7, `322f6544dfad0a3c8a0c8cbecf2c7f7874b14268` | 58 skills and 536 files; 24 exact principles. Adopt agentic Orchestrate, reproduced Interrogate findings, new statechart/formal-verification/video skills, and current stable T3 mechanics. Windows and WSL installer/helper checks pass. Recorded statechart suite passes; live TLC passing and failing models reproduce expected reports. Strict statechart types repaired without behavior changes. |
| 2026-10-16 | 0.15.25, `6f131f137de64fdaf928278c0fd9ecec520ccbee` | Public source schemas reviewed | Initial faithful fork sync and Linux/Windows verification. |

The lock files name the exact reviewed inputs. Record a row when importing source changes or reviewing a new stable T3 release. Quiet no-change checks do not need commits. CI does not establish live T3/provider model behavior; run that smoke task in the installed T3 environment.
