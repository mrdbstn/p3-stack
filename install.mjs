#!/usr/bin/env node
import { lstat, mkdir, readdir, realpath, symlink, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--project')) {
  console.error('Usage: node install.mjs [--project /path/to/repo]');
  process.exit(2);
}
const target = args.length ? resolve(args[1], '.agents', 'skills') : join(homedir(), '.agents', 'skills');
await mkdir(target, { recursive: true });
let linked = 0;
let skipped = 0;
for (const entry of await readdir(join(root, 'skills'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const source = await realpath(join(root, 'skills', entry.name));
  const destination = join(target, entry.name);
  let existing;
  try { existing = await lstat(destination); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing && !existing.isSymbolicLink()) {
    console.log(`skip ${entry.name} (exists and is not a link)`);
    skipped++;
    continue;
  }
  if (existing) await unlink(destination);
  await symlink(source, destination, process.platform === 'win32' ? 'junction' : 'dir');
  linked++;
}
console.log(`linked ${linked} skills into ${target}; skipped ${skipped}`);
