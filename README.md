# LifeCraft AI

Arabic-first RTL life planning web app built with React and Vite.

## Included
- Premium dark responsive interface
- Dashboard, goals, daily tasks, 30-day roadmap, study, skills, money, Italy/travel, habits, notes and progress
- AI Life Planner inputs: goal, daily hours, budget, destination and priorities
- Milestones, 30-day roadmap, weekly tasks, top 3 daily actions, blockers and next action
- Persistent browser storage with localStorage
- No subscriptions, advertisements or paywall
- Automated tests and production build workflow

## Run
npm install
npm run dev

## Verify
npm test
npm run build

## Deploy
Static Vite app. Deploy to GitHub Pages, Netlify, Vercel or any static hosting provider. The core planner requires no paid API.

## Architecture
src/main.jsx contains the UI shell and feature views. src/lib/planner.js contains the state model, persistence adapter and planning engine. The planning engine is replaceable by a hosted AI provider later without exposing credentials in the browser.


## Cloud sync (optional)
LifeCraft AI works locally by default. Optional cloud accounts use Supabase passwordless email OTP and a per-user `life_states` row protected by Row Level Security.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Configure the deployed site's URL in Supabase Auth URL settings.

Never put a Supabase service-role key in the frontend. The browser only uses the public anon key with RLS enabled.

Without these variables, the app remains fully usable with local browser storage and JSON backup/restore.
