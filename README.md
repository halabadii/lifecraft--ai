# ASCEND — ارتقِ بنفسك

Arabic-first RTL personal life operating system built with React and Vite. The project is evolving in phases while preserving the existing application and data model.

## Principles
- Keep core features free, responsive, and usable on mobile.
- Do not add Gemini or paid external AI services. The planner uses local deterministic rules in `src/lib/planner.js`.
- Local-first by default: personal data is stored in the browser using `localStorage`.
- Add features incrementally, with working interactions and checks before expanding scope.
- Avoid claiming progress that users have not recorded; progress indicators are based on recorded goals, tasks, study, and habits.

## Existing features
- Dashboard and progress overview
- Daily coach with focus modes, adjustable session lengths, quick action insertion, and a saved daily reflection
- Habit consistency dashboard with current and best streaks, total logged days, and a daily check-in; missing a day does not erase the historical best streak
- Advanced task center with instant search, priorities, due dates, estimated durations, overdue/upcoming filters, and duplicate prevention when adding tasks manually or from the daily planner, coach, and roadmap
- Weekly review dashboard with a seven-day focus chart, completed focus-session totals, habit check-ins, and current task counts based only on locally recorded data\n- Focus room with a 15/25/50-minute timer, pause/resume/reset, a five-minute break, optional task association, completed-session history, and daily/seven-day totals stored locally
- Transparent life-data assessment dashboard covering goals, tasks, study, habits, skills, and money tracking
- Goals, daily tasks, 30-day roadmap, study, skills, money, travel checklist, habits, notes
- Rule-based personal planner: daily actions, weekly suggestions, milestones, blockers, and a 30-day plan
- Digital character progression with five independent domains, locally calculated XP, levels, and an evolving avatar badge
- Character XP is derived from recorded completed items and keyword-matched categories; it is a motivational game mechanic, not a validated assessment
- Local persistence and JSON backup/restore
- Optional Supabase cloud sync, disabled unless environment variables are configured
- No subscriptions, advertisements, or paywall in the core application

## Run locally
```bash
npm install
npm run dev
```

## Verify
```bash
npm test
npm run build
```

## Deployment
This is a static Vite app and can be deployed to GitHub Pages, Netlify, Vercel, or another static host. Hosting-provider limits may apply.

## Architecture
- `src/main.jsx`: UI shell and feature views
- `src/lib/planner.js`: state model, local persistence, and rule-based planning engine
- `src/lib/progression.js`: offline XP and character level calculations
- `src/lib/*.test.js`: unit tests for planner and progression logic
- `src/lib/cloud.js`: optional Supabase email login and cloud sync

## Optional cloud sync
ASCEND works locally without cloud configuration. To enable cloud sync, configure Supabase, run `supabase/schema.sql`, and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never expose a Supabase service-role key in the browser. Keep Row Level Security enabled.

Without these variables, the app remains usable with browser storage. Export important data regularly if you need a backup.