#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const contractPaths = [
  'packages/contracts/src/orchestratorMcp.ts',
  'packages/contracts/src/scheduledTask.ts',
  'apps/server/src/mcp/toolkits/orchestrator/tools.ts',
  'apps/server/src/mcp/toolkits/pullRequests/tools.ts',
];
const sha256 = text => createHash('sha256').update(text.replaceAll('\r\n', '\n')).digest('hex');
const api = async path => {
  const response = await fetch(`https://api.github.com/${path}`, {
    headers: { Accept: 'application/vnd.github+json', ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}) },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${path}`);
  return response.json();
};
const content = async (repo, path, ref) => {
  const file = await api(`repos/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`);
  if (file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error(`No text content: ${path}`);
  return Buffer.from(file.content, 'base64').toString('utf8');
};
export const compareBaselines = ({ source, latestSource, sourceTree, latestSourceTree, stable, latestStable, mirrorVersion, cursorVersion }) => ({
  needsUpdate: sourceTree !== latestSourceTree || stable.commit !== latestStable.commit || mirrorVersion !== cursorVersion,
  pstack: { baseline: source.commit, baselineVersion: source.version, latest: latestSource, latestVersion: mirrorVersion, skillsChanged: sourceTree !== latestSourceTree },
  t3: { baseline: stable.tag, baselineCommit: stable.commit, latest: latestStable.tag, latestCommit: latestStable.commit, changed: stable.commit !== latestStable.commit },
  mirror: { cursorVersion, mirrorVersion, behind: cursorVersion !== mirrorVersion },
});

export async function check() {
  const source = JSON.parse(readFileSync(resolve(root, 'upstream.lock.json')));
  const stable = JSON.parse(readFileSync(resolve(root, 't3-runtime.lock.json')));
  const [head, release] = await Promise.all([api('repos/backnotprop/pstack/commits/main'), api('repos/pingdotgg/t3code/releases/latest')]);
  if (release.draft || release.prerelease) throw new Error('Latest T3 release is not stable');
  const [baseTree, nextTree, mirror, cursor, stableCommit] = await Promise.all([
    api(`repos/backnotprop/pstack/git/trees/${source.commit}`),
    api(`repos/backnotprop/pstack/git/trees/${head.sha}`),
    content('backnotprop/pstack', 'plugin.json', head.sha),
    content('cursor/plugins', 'pstack/plugin.json', 'main'),
    api(`repos/pingdotgg/t3code/commits/${encodeURIComponent(release.tag_name)}`),
  ]);
  const tree = response => {
    const entry = response.tree.find(entry => entry.path === 'skills' && entry.type === 'tree');
    if (!entry) throw new Error('Missing skills tree');
    return entry.sha;
  };
  return compareBaselines({ source, latestSource: head.sha, sourceTree: tree(baseTree), latestSourceTree: tree(nextTree), stable, latestStable: { tag: release.tag_name, commit: stableCommit.sha }, mirrorVersion: JSON.parse(mirror).version, cursorVersion: JSON.parse(cursor).version });
}

async function recordStable(tag) {
  if (!tag) throw new Error('Usage: node scripts/maintenance.mjs record-t3 <stable-tag>');
  const release = await api(`repos/pingdotgg/t3code/releases/tags/${encodeURIComponent(tag)}`);
  if (release.prerelease || release.draft) throw new Error('Only published stable releases can be recorded');
  const { sha: commit } = await api(`repos/pingdotgg/t3code/commits/${encodeURIComponent(tag)}`);
  const files = await Promise.all(contractPaths.map(async path => ({ path, sha256: sha256(await content('pingdotgg/t3code', path, commit)) })));
  const next = JSON.stringify({ repository: 'https://github.com/pingdotgg/t3code', tag, commit, reviewedAt: new Date().toISOString().slice(0, 10), scope: 'Reviewed stable orchestration, scheduling and PR-tool schemas; live provider behavior is not established by these hashes.', files }, null, 2) + '\n';
  let before;
  try { before = readFileSync(resolve(root, 't3-runtime.lock.json'), 'utf8').replaceAll('\r\n', '\n'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const lines = text => text.replace(/\n$/, '').split('\n');
  const body = (before === undefined ? '*** Add File: t3-runtime.lock.json\n' : `*** Update File: t3-runtime.lock.json\n@@\n${lines(before).map(line => '-' + line).join('\n')}\n`) + lines(next).map(line => '+' + line).join('\n');
  process.stdout.write(`*** Begin Patch\n${body}\n*** End Patch\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const command = process.argv[2] ?? 'check';
  if (command === 'check') console.log(JSON.stringify(await check(), null, 2));
  else if (command === 'record-t3') await recordStable(process.argv[3]);
  else throw new Error(`Unknown command: ${command}`);
}
