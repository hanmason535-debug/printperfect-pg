/**
 * Auto-fix bot (non-blocking)
 * - If code changed and CHANGELOG.md not in diff → create/append a stub entry and push to PR branch
 * - If PR body lacks "Agent:" line → append "Agent: Unknown (auto)" to PR body
 * - If 'import groq' found → include fix guidance in advisory comment
 * - If protected UI/schema files changed and PR body lacks "UI change approved: YES" → include guidance
 * The job never fails; it only fixes or advises.
 */
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

const headRef = pr.head.ref;                         // PR branch
const headRepoFull = pr.head.repo.full_name;
const thisRepoFull = `${owner}/${repoName}`;
const baseRef = pr.base.ref || 'main';

const sameRepo = headRepoFull.toLowerCase() === thisRepoFull.toLowerCase();

/** Utility: run git and return stdout */
async function sh(cmd) {
  const { stdout } = await exec(cmd);
  return stdout.trim();
}

// 1) Compute changed files vs base
await sh(`git fetch origin ${baseRef} --depth=1`);
const changed = await sh(`git diff --name-only origin/${baseRef}...HEAD`);
const changedFiles = changed.split('\n').filter(Boolean);

// Classify
const codeTouched = changedFiles.some(f => /^(src\/|sanity\/|seed\/|public\/|package|vite|tsconfig|tailwind)/.test(f));
const changelogTouched = changedFiles.includes('CHANGELOG.md');

// 2) Prepare advisory notes (always non-blocking)
let notes = [];
const prBodyOriginal = pr.body || '';
const hasAgent = /(^|\n)\s*Agent:/i.test(prBodyOriginal);

// Protected UI/schema files edited?
const protectedTouched = changedFiles.some(f =>
  /^src\/components\/(ServicesGrid|Portfolio|Contact)\.tsx$/.test(f) ||
  /^sanity\/schemaTypes\//.test(f) ||
  f === 'sanity/schema.ts'
);
const uiApproved = /(^|\n)\s*UI change approved:\s*YES/i.test(prBodyOriginal);

// Scan for groq import
let groqHits = [];
try {
  const { stdout } = await exec(`grep -RIn --include=*.ts --include=*.tsx "from 'groq'" src || true`);
  if (stdout) {
    groqHits = stdout.trim().split('\n').filter(Boolean);
  }
} catch { /* ignore */ }

// 3) Auto-fix: CHANGELOG stub if needed (same-repo PR only)
let changelogPatched = false;
if (codeTouched && !changelogTouched && sameRepo) {
  // Create baseline or append
  let content = '';
  try { content = await fs.readFile('CHANGELOG.md', 'utf8'); } catch {}
  if (!content.trim()) {
    content =
'# Changelog
All notable changes will be documented here. (Keep a Changelog + Conventional Commits)

## [Unreleased]
';
  }
  // Append stub under Unreleased
  const title = pr.title || '(no title)';
  const agentVal = hasAgent ? (prBodyOriginal.match(/(^|\n)\s*Agent:\s*(.+)/i)?.[2].trim() || 'Unknown') : 'Unknown';
  const stub = `- Auto-stub for PR #${pr.number}: "${title}" (Agent: ${agentVal}). Please refine before merge.
`;
  if (content.includes('## [Unreleased]')) {
    content = content.replace(/(## \[Unreleased\][^\n]*\n)/, `$1${stub}`);
  } else {
    content += `\n## [Unreleased]\n${stub}`;
  }
  await fs.writeFile('CHANGELOG.md', content, 'utf8');

  // Commit & push
  await sh(`git config user.name "auto-fix-bot"`);
  await sh(`git config user.email "auto-fix@users.noreply.github.com"`);
  await sh(`git add CHANGELOG.md`);
  try {
    await sh(`git commit -m "docs(changelog): auto-stub for PR #${pr.number}"`);
    await sh(`git push origin HEAD:${headRef}`);
    changelogPatched = true;
  } catch {
    // commit or push may fail (race/permissions); ignore
  }
} else if (codeTouched && !changelogTouched && !sameRepo) {
  notes.push(`- ⚠️ CHANGELOG.md missing, but this is a fork PR so auto-commit is skipped. Please add an entry.`);
}

// 4) Auto-fix: add Agent line to PR body if missing
if (!hasAgent && GITHUB_TOKEN) {
  try {
    const bodyNew = `${prBodyOriginal}\n\nAgent: Unknown (auto)`;
    // Edit PR body via REST
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.github.com/repos/${owner}/${repoName}/issues/${pr.number}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ body: bodyNew })
    });
    if (!res.ok) throw new Error(`Failed to patch PR body: ${res.status}`);
    notes.push(`- Added \`Agent: Unknown (auto)\` to PR body.`);
  } catch (e) {
    notes.push(`- ⚠️ Could not auto-add Agent line: ${e.message || e}`);
  }
}

// 5) Compose advisory for groq import & protected UI approval
if (groqHits.length) {
  notes.push(`- Found \`import 'groq'\` in:\n${groqHits.map(l => `  • ${l}`).join('\n')}
  Use **plain string** GROQ instead (no import). Example:
  \
  \
  export const Q_SERVICES = \`*[_type=="service"]{_id,title}\`;
  \
`);
}
if (protectedTouched && !uiApproved) {
  notes.push(`- Protected UI/schema files changed. If intended, add \`UI change approved: YES\` in PR body (and ensure CODEOWNERS review).`);
}
if (codeTouched && changelogPatched) {
  notes.push(`- CHANGELOG.md was auto-stubbed for this PR (please refine before merge).`);
}
if (!notes.length) {
  // Nothing to say; expose empty output
  process.stdout.write(`::set-output name=advisory::`);
} else {
  const msg = `### 🤖 Auto-Fix advisory (non-blocking)
${notes.join('\n')}
`;
  // Escape newlines for output
  const out = msg.replace(/\n/g, '%0A');
  process.stdout.write(`::set-output name=advisory::${out}`);
}
