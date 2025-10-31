# setup.ps1 — PowerShell friendly setup for Windows/CI
Write-Host 'Installing dependencies (npm ci)...'
npm ci

Write-Host 'Type-checking (tsc)...'
npm run typecheck

Write-Host 'Building (Vite + tsc)...'
npm run build

Write-Host 'Run lint and tests...'
npm run lint
npm test

if (Test-Path -Path './seed/seed.ts') {
  Write-Host 'Seeding data (if you want to run it)...'
  npx tsx ./seed/seed.ts
}

Write-Host 'Setup complete. To run app locally: npm run dev'
