#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
const hash = text => createHash('sha256').update(text).digest('hex');
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? e.name === 'node_modules' ? [] : walk(join(dir, e.name)) : [join(dir, e.name)]);
const errors = [];
const lock = JSON.parse(read(join(root, 'upstream.lock.json')));
const sourceSkills = lock.files.filter(f => /^skills\/[^/]+\/SKILL.md$/.test(f.source));
const installedSkills = readdirSync(join(root, 'skills')).filter(name => existsSync(join(root, 'skills', name, 'SKILL.md')));
if (installedSkills.length !== sourceSkills.length) errors.push(`Expected ${sourceSkills.length} skills, found ${installedSkills.length}`);
for (const file of lock.files) {
  const path = join(root, file.target);
  if (!existsSync(path)) { errors.push(`Missing ${file.target}`); continue; }
  const actual = hash(read(path));
  if (actual !== file.portSha256) errors.push(`Unrecorded port change: ${file.target}`);
  if (/^skills\/principle-/.test(file.target) && (file.kind !== 'exact' || actual !== file.upstreamSha256)) errors.push(`Principle diverges from upstream: ${file.target}`);
}
for (const path of walk(join(root, 'skills')).filter(p => p.endsWith('.md') && !p.includes(`${join('scripts', '')}`))) {
  const text = read(path);
  if (path.endsWith('SKILL.md')) {
    const name = text.match(/^name: (.+)$/m)?.[1];
    if (name !== dirname(path).split(/[\\/]/).at(-1)) errors.push(`Skill name/path mismatch: ${path}`);
    if (!/^description: .+$/m.test(text)) errors.push(`Missing description: ${path}`);
    if (!/^disable-model-invocation: true$/m.test(text) && name !== 'p3-help') errors.push(`Unexpected automatic skill: ${name}`);
  }
  if (/Cursor|cursor-team-kit|control-ui|control-cli|subagent_type|agent-transcripts|AskQuestion|claude-|grok-|gpt-|\/loop|icon:|pstack\/skills|agents\/(?:p3-agent|comment-sicko)\.md/.test(text)) errors.push(`Stale harness instruction: ${path}`);
  if (/^<<<<<<<|^=======|^>>>>>>>/m.test(text)) errors.push(`Unresolved merge: ${path}`);
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1].split('#')[0];
    if (!link || /^(?:[a-z]+:|\/|<)/i.test(link) || link === 'url') continue;
    if (!existsSync(resolve(dirname(path), link))) errors.push(`Broken bundled link: ${path} -> ${link}`);
  }
}
for (const name of ['autopilot-full', 'autopilot-stack', 'shipping', 'orchestrate']) {
  const text = read(join(root, 'skills/p3-mode/playbooks', `${name}.md`));
  const steps = [...text.matchAll(/^(\d+)\. /gm)].map(m => Number(m[1]));
  if (steps.some((n, i) => n !== i + 1)) errors.push(`Nonsequential steps in ${name}: ${steps}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${sourceSkills.length} skills, ${lock.files.length} upstream files, exact principles, bundled links, and T3 instructions.`);
