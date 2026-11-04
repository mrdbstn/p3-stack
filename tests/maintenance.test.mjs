import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareBaselines } from '../scripts/maintenance.mjs';

const baseline = { source: { commit: 'source-1', version: '1.0' }, latestSource: 'source-2', sourceTree: 'same-skills', latestSourceTree: 'same-skills', stable: { tag: 'v1', commit: 't3-1' }, latestStable: { tag: 'v1', commit: 't3-1' }, mirrorVersion: '1.0', cursorVersion: '1.0' };
test('ignores mirror bookkeeping commits with identical skills', () => assert.equal(compareBaselines(baseline).needsUpdate, false));
test('flags changed skills even when upstream forgot to bump its version', () => {
  const report = compareBaselines({ ...baseline, latestSourceTree: 'changed-skills' });
  assert.equal(report.needsUpdate, true);
  assert.equal(report.pstack.skillsChanged, true);
});
test('flags stable T3 updates and a lagging pstack mirror independently', () => {
  assert.equal(compareBaselines({ ...baseline, latestStable: { tag: 'v2', commit: 't3-2' } }).t3.changed, true);
  const report = compareBaselines({ ...baseline, cursorVersion: '1.1' });
  assert.equal(report.needsUpdate, true);
  assert.equal(report.mirror.behind, true);
});
