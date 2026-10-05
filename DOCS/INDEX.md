# Signet careers landing — documentation map

Read this file first. Open a linked doc only when the current task needs it.

Chat with the user is Russian. Every file under `DOCS/` is English.

## Start here

| If you are… | Read |
|---|---|
| New session / lost in the repo | This file |
| Naming a domain term | [GLOSSARY.md](./GLOSSARY.md) |
| Changing system shape or seams | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Touching the landing UI | [FRONTEND.md](./FRONTEND.md) |
| Touching apply API, validation, HR adapter | [BACKEND.md](./BACKEND.md) |
| Asking *why* we chose X | [DECISIONS/](./DECISIONS/) |
| Changing copy, vacancy, stores | [CONTENT.md](./CONTENT.md) |

## Code entry points

| Area | Path | Notes |
|---|---|---|
| Web app | `src/routes/index.tsx` | Single Landing route |
| Apply form | `src/components/features/apply/ApplyForm.tsx` | Unified fields, progress, shine, confetti; PDN toggle gated by policy dialog |
| City select | `src/components/features/apply/CitySelect.tsx` | Themed glass city picker |
| Privacy policy | `src/content/privacy-policy.ts` | Structured PDN policy body |
| Privacy dialog | `src/components/features/landing/PrivacyPolicyDialog.tsx` | Overlay for consent + footer |
| How it works | `src/components/features/landing/HowItWorksSection.tsx` | Three-station path above `#form` |
| Disclosures | `src/components/features/landing/LandingDisclosureList.tsx` | Glass `<details>` rows for `#faq` |
| Theme | `src/stores/theme.tsx` | Light / dark, `localStorage` |
| Plasma background | `src/components/features/landing/PlasmaBackground.tsx` | React Bits Plasma |
| Copy | `src/content/landing.ts` | Marketing TZ copy |
| Shared schema | `src/lib/application-schema.ts` | Zod Application |
| Apply use-case | `server/apply.ts` | `submitApplication` |
| HR adapter | `server/adapters/hr-inbox.ts` | JSON inbox |
| HTTP | `server/index.ts` | Hono `/api` + static `dist/` in production |
| HRIS inbox | `GET /api/hr/applications` | Bearer `LANDING_API_KEY`, see [BACKEND.md](./BACKEND.md) |
| Image | `Dockerfile` | Multi-stage Vite build, Node serves SPA + API |

## Commands

Look in `package.json` scripts (`dev`, `build`, `start`, `test`, `test:e2e`). On Windows, double-click `start-landing.bat` to run the Landing locally (`http://127.0.0.1:5173/`).
