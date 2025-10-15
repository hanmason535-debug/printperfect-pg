import fs from 'node:fs/promises';
import { promisify } from 'node:util';
import cp from 'node:child_process';

const exec = promisify(cp.exec);
const GITHUB_EVENT_PATH = process.env.GITHUB_EVENT_PATH;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OUTPUT = process.env.GITHUB_OUTPUT;

async function sh(cmd) {
  const { stdout } = await exec(cmd);
  return stdout.trim();
}

async function main() {
  if (!GITHUB_EVENT_PATH) {
    console.log('Not running in GitHub Actions context');
    return;
  }

  const event = JSON.parse(await fs.readFile(GITHUB_EVENT_PATH, 'utf8'));
  const pr = event.pull_request;
  const repo = event.repository;
  const owner = repo.owner.login;
  const repoName = repo.name;

  const headRef = pr.head.ref;
  const headRepoFull = pr.head.repo.full_name;
  const thisRepoFull = `${owner}/${repoName}`;
  const sameRepo = headRepoFull.toLowerCase() === thisRepoFull.toLowerCase();

  // Fetch base branch
  await sh(`git fetch origin ${pr.base.ref || 'main'} --depth=1 || true`);

  // Get changed files
  const changed = await sh(`git diff --name-only origin/${pr.base.ref || 'main'}...HEAD || true`);
  const changedFiles = changed.split('\n').filter(Boolean);
  
  const codeTouched = changedFiles.some(f => 
    /^(src\/|sanity\/|seed\/|public\/|package|vite|tsconfig|tailwind)/.test(f)
  );
  const changelogTouched = changedFiles.includes('CHANGELOG.md');

  let notes = [];
  const prBodyOriginal = pr.body || '';
  const hasAgent = /(^|\n)\s*Agent:/i.test(prBodyOriginal);

  // Check for protected file edits
  const protectedTouched = changedFiles.some(f =>
    /src\/components\/(ServicesGrid|Portfolio|Contact)\.tsx|sanity\/schemaTypes\/|sanity\/schema\.ts/.test(f)
  );
  const uiApproved = /(^|\n)\s*UI change approved:\s*YES/i.test(prBodyOriginal);

  // GROQ import scan on changed files only
  let groqHits = [];
  for (const f of changedFiles) {
    if (/\.(ts|tsx)$/.test(f)) {
      try {
        const txt = await fs.readFile(f, 'utf8');
        if (txt.includes(`from 'groq'`)) groqHits.push(f);
      } catch {
        // File might not exist in working tree
      }
    }
  }

  // Auto-stub CHANGELOG (same-repo PRs only)
  let changelogPatched = false;
  if (codeTouched && !changelogTouched && sameRepo) {
    let content = '';
    try {
      content = await fs.readFile('CHANGELOG.md', 'utf8');
    } catch {
      // File doesn't exist
    }

    if (!content.trim()) {
      content = `# Changelog\nAll notable changes will be documented here.\n\n## [Unreleased]\n`;
    }

    const title = pr.title || '(no title)';
    const agentVal = hasAgent 
      ? (prBodyOriginal.match(/(^|\n)\s*Agent:\s*(.+)/i)?.[2].trim() || 'Unknown') 
      : 'Unknown';
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
    } catch (err) {
      // Fork or permissions issue - can't push
      console.log('Could not push CHANGELOG update:', err.message);
    }
  } else if (codeTouched && !changelogTouched && !sameRepo) {
    notes.push(`- CHANGELOG.md missing; fork PR so auto-commit skipped. Please add an entry.`);
  }

  // Auto-add Agent line
  if (!hasAgent && GITHUB_TOKEN && sameRepo) {
    try {
      const bodyNew = `${prBodyOriginal}\n\nAgent: Unknown (auto)`;
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/issues/${pr.number}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github+json',
          },
          body: JSON.stringify({ body: bodyNew }),
        }
      );
      if (!res.ok) throw new Error(`Failed to patch PR body: ${res.status}`);
      notes.push(`- Added \`Agent: Unknown (auto)\` to PR body.`);
    } catch (e) {
      notes.push(`- Could not auto-add Agent line: ${e.message || e}`);
    }
  }

  // Compose advisory
  if (groqHits.length) {
    notes.push(
      `- Found \`import 'groq'\` in:\n${groqHits.map(f => `  - ${f}`).join('\n')}\n  Use plain string GROQ instead (no import).`
    );
  }

  if (protectedTouched && !uiApproved) {
    notes.push(
      `- Protected UI/schema files changed. If intended, add \`UI change approved: YES\` in PR body (and ensure CODEOWNERS review).`
    );
  }

  if (codeTouched && changelogPatched) {
    notes.push(`- CHANGELOG.md was auto-stubbed for this PR (please refine before merge).`);
  }

  // Additional lightweight scans on changed files
  const hardCodedWhatsApp = [];
  const encodingSuspects = [];
  const modalOpenChange = [];
  for (const f of changedFiles) {
    try {
      const txt = await fs.readFile(f, 'utf8');
      if (/wa\.me\/\d/.test(txt) && !txt.includes('CONTACT.phoneRaw')) {
        hardCodedWhatsApp.push(f);
      }
      if (/[�\uFFFD]/.test(txt)) {
        encodingSuspects.push(f);
      }
      if (/onOpenChange=\{\s*resetModal\s*\}/.test(txt)) {
        modalOpenChange.push(f);
      }
    } catch {}
  }

  if (hardCodedWhatsApp.length) {
    notes.push(`- Hard-coded WhatsApp numbers detected in:\n${hardCodedWhatsApp.map(f => `  - ${f}`).join('\n')}\n  Prefer using CONTACT.phoneRaw to avoid drift.`);
  }
  if (encodingSuspects.length) {
    notes.push(`- Possible encoding issues (� replacement chars) in:\n${encodingSuspects.map(f => `  - ${f}`).join('\n')}\n  Replace mojibake with proper UTF-8 characters.`);
  }
  if (modalOpenChange.length) {
    notes.push(`- Modal onOpenChange directly calls resetModal in:\n${modalOpenChange.map(f => `  - ${f}`).join('\n')}\n  Gate it: onOpenChange={(open) => !open && resetModal()}.`);
  }

  // Output for workflow step - clean header and summary
  const advisory = notes.length
    ? `### Auto-Fix advisory <!-- auto-fix-advisory -->\n${notes.join('\n')}\n`
    : '';

  if (GITHUB_OUTPUT) {
    await fs.appendFile(
      GITHUB_OUTPUT,
      `advisory<<EOF\n${advisory}\nEOF\n`
    );
  }

  if (process.env.GITHUB_STEP_SUMMARY && advisory) {
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `${advisory}\n`);
  }
}

main().catch(err => {
  console.error('Auto-fix script error:', err);
  process.exit(0); // Don't fail the workflow
});

