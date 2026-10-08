# Scholastiar.ai

AI-powered international opportunity and mobility platform. Product specs, build plan and progress live in [`STRUCTURE/`](STRUCTURE/README.md).

The project is built **UI first** ([`UI_FIRST_BUILD_PLAN.md`](STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md)): every screen runs on a mock data layer before the Supabase backend is built.

## Run it

```bash
pnpm install
cp .env.example .env.local   # DATA_SOURCE=mock
pnpm dev                     # http://localhost:3000 → /dev
```

- `/dev` — build status per stage and layout shell previews
- `/dev/gallery` — every base component
- **Dev** button (bottom corner) — switch persona, plan and screen state, or reset demo data

## Scripts

| Command                                        | What it does                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `pnpm dev`                                     | Development server                                                   |
| `pnpm build` / `pnpm start`                    | Production build / server                                            |
| `pnpm lint` · `pnpm typecheck` · `pnpm format` | ESLint · TypeScript · Prettier                                       |
| `pnpm test:e2e`                                | Playwright smoke tests (desktop + mobile) against a production build |
| `python3 scripts/route-stages.py`              | Regenerate the route → stage map after editing `ROUTES.md`           |

## Where things live

```txt
src/app/            routes (App Router)
src/components/     ui/ (shadcn base), layout/ (shells, nav), states/, pwa/, dev/
src/config/         navigation, personas, route readiness
src/data/           types (from db.md), repository interfaces, mock store + fixtures
src/lib/            session, server actions, validation, env
public/sw.js        service worker
e2e/                Playwright tests
```
