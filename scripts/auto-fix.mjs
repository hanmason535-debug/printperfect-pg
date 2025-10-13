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
  if (/".(ts|tsx)$\/.test(f)) {
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
    await sh(`git config user.name "auto-fix-bot"`);
    await sh(`git config user.email "auto-fix@users.noreply.github.com"`);
    await sh(`git add CHANGELOG.md`);
    await sh(`git commit -m "docs(changelog): auto-stub for PR #${pr.number}"`);
    await sh(`git push origin HEAD:${headRef}`);
    changelogPatched = true;
  } catch { /* fork or permissions */ }
} else if (codeTouched && !changelogTouched && !sameRepo) {
  notes.push(`- ⚠️ CHANGELOG.md missing; fork PR so auto-commit skipped. Please add an entry.`);
}

// Auto-add Agent line
if (!hasAgent && GITHUB_TOKEN) {
  try {
    const bodyNew = `${prBodyOriginal}\n\nAgent: Unknown (auto)`;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues/${pr.number}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ body: bodyNew })
    });
    if (!res.ok) throw new Error(`Failed to patch PR body: ${res.status}`);
    notes.push(`- Added 
Agent: Unknown (auto)
 to PR body.`);
  } catch (e) {
    notes.push(`- ⚠️ Could not auto-add Agent line: ${e.message || e}`);
  }
}

// Compose advisory
if (groqHits.length) {
  notes.push(`- Found 
import 'groq'
 in:
${groqHits.map(f => `  • ${f}`).join('\n')}
  Use **plain string** GROQ instead (no import).`);
}
if (protectedTouched && !uiApproved) {
  notes.push(`- Protected UI/schema files changed. If intended, add 
UI change approved: YES
 in PR body (and ensure CODEOWNERS review).`);
}
if (codeTouched && changelogPatched) {
  notes.push(`- CHANGELOG.md was auto-stubbed for this PR (please refine before merge).`);
}

// Output for workflow step
const GITHUB_OUTPUT = process.env.GITHUB_OUTPUT;
if (GITHUB_OUTPUT) {
  const body = notes.length
    ? `### 🤖 Auto-Fix advisory (non-blocking)\n${notes.join('\n')}\n`
    : '';
  await fs.appendFile(GITHUB_OUTPUT, `advisory<<EOF
${body}
EOF
`);
}
