#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...args] = process.argv.slice(2);
const option = name => {
  const at = args.indexOf(name);
  return at < 0 ? undefined : args[at + 1];
};
const source = option('--source');
const revision = option('--ref') ?? 'HEAD';
const root = resolve(option('--port') ?? defaultRoot);
if (!['record', 'status', 'propose'].includes(command) || !source) {
  console.error('Usage: node scripts/upstream.mjs <status|propose|record> --source <pstack-checkout> [--ref <commit>]');
  process.exit(2);
}
const git = (...params) => execFileSync('git', ['-c', 'core.fsmonitor=false', '-C', resolve(source), ...params], { encoding: 'utf8', maxBuffer: 20_000_000, stdio: ['ignore', 'pipe', 'pipe'] });
const commit = git('rev-parse', '--verify', `${revision}^{commit}`).trim();
const lockPath = join(root, 'upstream.lock.json');
const lock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, 'utf8')) : undefined;
const normalize = text => text.replaceAll('\r\n', '\n').replaceAll('poteto-mode', 'p3-mode').replaceAll('poteto-help', 'p3-help').replaceAll('setup-pstack', 'setup-p3');
const target = path => path === 'agents/comment-sicko.md' ? 'skills/no-comments/references/comment-sicko.md' : normalize(path);
const digest = text => createHash('sha256').update(text).digest('hex');
const snapshot = ref => {
  const paths = git('ls-tree', '-r', '--name-only', ref, 'skills').trim().split('\n').filter(Boolean);
  // The source already bundles Comment Sicko beside its skill. Do not import a second prompt.
  const batch = spawnSync('git', ['-C', resolve(source), 'cat-file', '--batch'], { input: paths.map(path => `${ref}:${path}`).join('\n') + '\n', maxBuffer: 20_000_000 });
  if (batch.status !== 0) throw new Error(batch.stderr.toString());
  let offset = 0;
  return new Map(paths.map(path => {
    const end = batch.stdout.indexOf(10, offset);
    const header = batch.stdout.subarray(offset, end).toString();
    const size = Number(header.split(' ')[2]);
    if (!Number.isSafeInteger(size) || !header.includes(' blob ')) throw new Error(`Cannot read ${ref}:${path}`);
    const content = batch.stdout.subarray(end + 1, end + 1 + size).toString('utf8');
    offset = end + size + 2;
    return [path, normalize(content)];
  }));
};
const latest = snapshot(commit);
const patchFor = (path, before, after) => {
  const safe = resolve(root, path);
  if (relative(root, safe).startsWith('..')) throw new Error(`Path escapes repository: ${path}`);
  if (before === after) return '';
  const body = after.replace(/\n$/, '').split('\n').map(line => `+${line}`).join('\n') + '\n';
  return before === undefined ? `*** Add File: ${path}\n${body}` : `*** Update File: ${path}\n@@\n${before.replace(/\n$/, '').split('\n').map(line => `-${line}`).join('\n')}\n${body}`;
};
if (command === 'record') {
  const files = [...latest].map(([path, content]) => {
    const destination = target(path);
    if (!existsSync(join(root, destination))) throw new Error(`Missing port file: ${destination}`);
    const port = readFileSync(join(root, destination), 'utf8').replaceAll('\r\n', '\n');
    return { source: path, target: destination, upstreamSha256: digest(content), portSha256: digest(port), kind: content === port ? 'exact' : 'adapted' };
  });
  const version = JSON.parse(git('show', `${commit}:plugin.json`)).version;
  const next = JSON.stringify({ schemaVersion: 1, repository: 'https://github.com/backnotprop/pstack', commit, version, scope: 'All skills and bundled support files. Harness-neutral principles stay exact. See PORTING.md for reviewed T3 adaptations.', files }, null, 2) + '\n';
  process.stdout.write('*** Begin Patch\n' + patchFor('upstream.lock.json', lock ? readFileSync(lockPath, 'utf8').replaceAll('\r\n', '\n') : undefined, next) + '*** End Patch\n');
} else if (command === 'status') {
  if (!lock) throw new Error('No recorded upstream baseline. Review the initial port and record it first.');
  const old = new Map(lock.files.map(file => [file.source, file.upstreamSha256]));
  const changed = [...latest].filter(([path, content]) => old.get(path) !== digest(content)).map(([path]) => path);
  const removed = [...old.keys()].filter(path => !latest.has(path));
  console.log(JSON.stringify({ baseline: lock.commit, candidate: commit, changed, removed }, null, 2));
  process.exitCode = changed.length || removed.length ? 1 : 0;
} else {
  if (!lock) throw new Error('No recorded upstream baseline.');
  const baseline = snapshot(lock.commit);
  const conflicts = [];
  const scratch = mkdtempSync(join(tmpdir(), 'p3-upstream-'));
  let patch = '*** Begin Patch\n';
  try {
    for (const [path, content] of latest) {
      const destination = target(path);
      const full = join(root, destination);
      const current = existsSync(full) ? readFileSync(full, 'utf8').replaceAll('\r\n', '\n') : undefined;
      const base = baseline.get(path);
      if (base === content) continue;
      let merged = content;
      if (current !== undefined && base !== undefined && current !== base) {
        writeFileSync(join(scratch, 'current'), current);
        writeFileSync(join(scratch, 'base'), base);
        writeFileSync(join(scratch, 'candidate'), content);
        const result = spawnSync('git', ['merge-file', '-p', '--diff3', join(scratch, 'current'), join(scratch, 'base'), join(scratch, 'candidate')], { encoding: 'utf8', maxBuffer: 20_000_000 });
        if (result.status !== 0) { conflicts.push(path); continue; }
        merged = result.stdout;
      } else if (base !== undefined && current === undefined) { conflicts.push(`${path} (port file missing)`); continue; }
      else if (base === undefined && current !== undefined && current !== content) { conflicts.push(`${path} (new upstream path collides)`); continue; }
      patch += patchFor(destination, current, merged);
    }
    for (const path of baseline.keys()) if (!latest.has(path)) conflicts.push(`${path} (upstream removed; review deletion)`);
  } finally {
    if (resolve(dirname(scratch)) !== resolve(tmpdir())) throw new Error('Unexpected temporary directory');
    rmSync(scratch, { recursive: true, force: true });
  }
  if (conflicts.length) {
    console.error('Review these upstream changes before generating a patch:\n' + conflicts.join('\n'));
    process.exitCode = 1;
  } else process.stdout.write(patch + '*** End Patch\n');
}
