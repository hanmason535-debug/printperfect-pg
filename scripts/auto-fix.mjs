import fs from 'node:fs/promises';
import cp from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(cp.exec);
const GITHUB_EVENT_PATH = process.env.GITHUB_EVENT_PATH;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const event = JSON.parse(await fs.readFile(GITHUB_EVENT_PATH, 'utf8'));
const pr = event.pull_request;
const repo = event.repository;
const owner = repo.owner.login;
const repoName = repo.name;

const headRef = pr.head.ref;
const headRepoFull = pr.head.repo.full_name;
const thisRepoFull = `${owner}/${repoName}`;
const sameRepo = headRepoFull.toLowerCase() === thisRepoFull.toLowerCase();

async function sh(cmd){ const { stdout } = await exec(cmd); return stdout.trim(); }

await sh(`git fetch origin ${pr.base.ref || 'main'} --depth=1 || true`);

const changed = await sh(`git diff --name-only origin/${pr.base.ref || 'main'}...HEAD || true`);
const changedFiles = changed.split('\n').filter(Boolean);
const codeTouched = changedFiles.some(f => /^(src\/|sanity\/|seed\/|public\/|package|vite|tsconfig|tailwind)/.test(f));
const changelogTouched = changedFiles.includes('CHANGELOG.md');

let notes = [];
const prBodyOriginal = pr.body || '';
const hasAgent = /(^|\n)\s*Agent:/i.test(prBodyOriginal);

// Protected edits?
const protectedTouched = changedFiles.some(f =>
  /^src\/components\/(ServicesGrid|Portfolio|Contact)\.tsx$/.test(f) ||
  /^sanity\/schemaTypes\//.test(f) ||
  f === 'sanity/schema.ts'
);
const uiApproved = /(^|\n)\s*UI change approved:\s*YES/i.test(prBodyOriginal);

// GROQ import scan on changed files only
let groqHits = [];
for (const f of changedFiles) {
  if (/\.(ts|tsx)$/.test(f)) {
    try {
      const txt = await fs.readFile(f, 'utf8');
      if (txt.includes(`from 'groq'`)) groqHits.push(f);
    } catch {} 
  }
}

// Auto-stub CHANGELOG (same-repo PRs only)
let changelogPatched = false;
if (codeTouched && !changelogTouched && sameRepo) {
  let content = '';
  try { content = await fs.readFile('CHANGELOG.md', 'utf8'); } catch {}
  if (!content.trim()) {
    content = 
`# Changelog
All notable changes will be documented here.

## [Unreleased]
`;
  }
  const title = pr.title || '(no title)';
  const agentVal = hasAgent ? (prBodyOriginal.match(/(^|\n)\s*Agent:\s*(.+)/i)?.[2].trim() || 'Unknown') : 'Unknown';
  const stub = `- Auto-stub for PR #${pr.number}: "${title}" (Agent: ${agentVal}). Please refine before merge.\n`;
  if (content.includes('## [Unreleased]')) {
    content = content.replace(/(## \[Unreleased\][^\n]*\n)/, `$1${stub}`);
  } else {
    content += `\n## [Unreleased]\n${stub}`;
  }
  await fs.writeFile('CHANGELOG.md', content, 'utf8');

  try {
    await sh(`git config user.name