import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const run = (script, args = [], cwd = root) => spawnSync(process.execPath, [join(root, script), ...args], { cwd, encoding: 'utf8' });
const fixture = fn => {
  const dir = mkdtempSync(join(tmpdir(), 'p3-port-test-'));
  try { fn(dir); } finally {
    assert.equal(resolve(dirname(dir)), resolve(tmpdir()));
    rmSync(dir, { recursive: true, force: true });
  }
};

test('installs every skill outside the checkout, preserves real directories, and reruns safely', () => fixture(dir => {
  const target = join(dir, '.agents/skills');
  mkdirSync(join(target, 'bro'), { recursive: true });
  writeFileSync(join(target, 'bro/SKILL.md'), 'my existing skill');
  for (let round = 0; round < 2; round++) {
    const result = run('install.mjs', ['--project', dir], dir);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /linked 57 skills.*skipped 1/);
    assert.equal(readFileSync(join(target, 'bro/SKILL.md'), 'utf8'), 'my existing skill');
    assert.equal(realpathSync(join(target, 'p3-mode')), realpathSync(join(root, 'skills/p3-mode')));
    assert.match(readFileSync(join(target, 'no-comments/references/comment-sicko.md'), 'utf8'), /comment/i);
    for (const name of ['sharpen', 'in-your-own-words', 'ketchup', 'ketchup-video', 'statechart', 'create-formal-verification-skill', 'maintain-formal-verification-skill']) assert.match(readFileSync(join(target, name, 'SKILL.md'), 'utf8'), new RegExp(`name: ${name}`));
    assert.equal(realpathSync(join(target, 'p3-mode/worker.md')), realpathSync(join(root, 'skills/p3-mode/worker.md')));
  }
}));

test('does not install on malformed arguments', () => {
  const result = run('install.mjs', ['--project']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Usage:/);
});
