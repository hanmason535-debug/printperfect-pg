#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies (npm ci)..."
npm ci

echo "Type-checking (tsc)..."
npm run typecheck

echo "Building (Vite + tsc)..."
npm run build

echo "Run lint and tests..."
npm run lint
npm test

if [ -f "./seed/seed.ts" ]; then
  echo "Seeding data (if you want to run it)..."
  npx tsx ./seed/seed.ts
fi

echo "Setup complete. To run app locally: npm run dev"
