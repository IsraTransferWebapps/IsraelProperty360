# CLAUDE.md — IsraelProperty360

## Project Overview
Real estate platform for Israel properties. React 18 SPA migrated from Base44 (no-code) to a self-hosted stack.

## Tech Stack
- **Frontend:** React 18 + Vite + TailwindCSS + shadcn/ui
- **Database:** Supabase (Postgres + Row-Level Security)
- **Auth:** Supabase email/password auth
- **Hosting:** Netlify (auto-deploys from `main` branch)
- **Email:** Resend via Netlify Function
- **File Storage:** Supabase Storage (`media` bucket)

## Getting Started
```bash
npm install
npm run dev
```
Requires `.env` file with:
```
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Architecture — Compatibility Bridge
This project was migrated from Base44. Instead of rewriting 35+ page components, a **bridge layer** preserves the original import patterns:

- `src/api/supabaseClient.js` — Supabase client init
- `src/api/entities.js` — Entity factory (`createEntity()`) that mirrors the Base44 SDK interface (`.list()`, `.filter()`, `.create()`, `.update()`, `.delete()`)
- `src/api/base44Client.js` — Exports a `base44` object with `.entities.*`, `.integrations.*`, `.auth.*` so existing page imports work unchanged
- `src/api/integrations.js` — `SendEmail`, `UploadFile`, etc.
- `src/entities/*.js` — Re-export bridges for legacy `@/entities/X` imports
- `src/integrations/Core.js` — Re-export bridge for `@/integrations/Core` imports

**Important:** Most pages import from `base44Client.js` or `@/entities/*`. When adding new entities, use `createEntity()` in `entities.js` and add a bridge file in `src/entities/`.

## Key Directories
```
src/
  api/            — Data layer (Supabase bridge)
  components/     — Reusable UI components (60+)
  entities/       — Entity bridge files
  integrations/   — Integration bridge
  lib/            — AuthContext, utils, hooks
  pages/          — Route pages (35+)
netlify/
  functions/      — Netlify serverless functions (send-email)
supabase/
  schema.sql      — Database schema
  functions/      — (Legacy) Supabase Edge Functions
scripts/          — Data migration scripts
```

## Database
10 tables: `properties`, `experts`, `blog_posts`, `events`, `favorites`, `cities`, `wiki_topics`, `testimonials`, `newsletter_subscriptions`, `profiles`

Schema is in `supabase/schema.sql` and `supabase/schema-additions.sql`.

## Deployment
- Push to `main` → Netlify auto-deploys
- Environment variables are set in Netlify dashboard
- Use feature branches + PRs for changes

## Common Patterns
- Entity access: `const properties = await Property.filter({ status: 'approved' }, '-created_date', 10)`
- Auth check: `const { user, isAuthenticated } = useAuthContext()`
- Email: `await SendEmail({ to, subject, body })` → calls Netlify Function → Resend API
- File upload: `await UploadFile({ file })` → returns `{ file_url }`
