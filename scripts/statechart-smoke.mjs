#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

assert.ok(process.env.TLA2TOOLS, 'Set TLA2TOOLS to the checksum-verified TLC jar');
const skill = fileURLToPath(new URL('../skills/statechart/scripts/', import.meta.url));
const scratch = mkdtempSync(join(tmpdir(), 'p3-statechart-smoke-'));
const read = file => readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
try {
  for (const [name, exit] of [['Counter', 0], ['CounterDeadlock', 1]]) {
    const fixture = join(skill, 'test/corpus', name);
    const out = join(scratch, name);
    const result = spawnSync(process.execPath, [join(skill, 'statechart.ts'), join(fixture, name + '.tla'), '--out', out], { encoding: 'utf8', timeout: 60_000, windowsHide: true });
    assert.ifError(result.error);
    assert.equal(result.status, exit, result.stderr + result.stdout);
    for (const artifact of ['report.md', 'chart.mmd']) assert.equal(read(join(out, artifact)), read(join(fixture, artifact)), `${name}/${artifact}`);
    console.log(`${name}: expected exit ${exit}, report and chart match upstream`);
  }
} finally {
  assert.equal(dirname(resolve(scratch)), resolve(tmpdir()));
  rmSync(scratch, { recursive: true, force: true });
}
