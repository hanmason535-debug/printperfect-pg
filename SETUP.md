# Quick setup for Jules

This repo includes two setup scripts in the project root. Run the one that matches your environment.

POSIX (Linux / macOS / CI):

```bash
# make executable and run
chmod +x ./setup.sh
./setup.sh
```

Windows PowerShell:

```powershell
# run from PowerShell (may need to allow script execution for session)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

Environment variables required (examples):

- `VITE_SANITY_PROJECT_ID` — your Sanity project ID (from manage.sanity.io)
- `VITE_SANITY_DATASET` — dataset name (this project uses `production`)
- `VITE_SUPABASE_URL` — Supabase project URL (from Supabase dashboard)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/public key (client)
- `NODE_ENV` — optional (`development` or `production`)

Notes:
- Do NOT commit tokens or service role keys. Use environment or CI secret stores.
- The `seed/seed.ts` script will only run if present; it may require a Sanity token or Supabase keys depending on its behavior.
