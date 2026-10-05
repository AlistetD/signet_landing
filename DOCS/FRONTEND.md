# Frontend

Single-page Landing. React 19, Vite, TypeScript strict, Tailwind 4, TanStack Router (`/`).

## Page flow

1. Sticky glass header: SigNet mark, theme toggle, CTA «Откликнуться» → `#form`
2. Hero: «Улучшаем качество жизни с любимой привычкой» (content-sized with a height cap on phone, 16:9 on desktop) over Plasma
3. Social proof: 4,54/5, survey intro, and a note under the rating (not a named quote)
4. How to join: three-station path «Как к нам попасть» (Заявка → Звонок → Знакомство и первые шаги) in a glass cell immediately above the form
5. Apply form `#form` (one set of fields, no store / office tabs)
6. Inline thank-you after submit (title and body only; no messenger CTA)
7. FAQ accordion `#faq` (salary, experience, schedule, fines) via `LandingDisclosureList`
8. Footer: mark, © year, ООО «БелВэйп», HR phone and email, privacy-policy link
9. Privacy policy modal: first PDN toggle on opens it; «Ознакомлен» sets consent. Footer link opens the same dialog in read mode.

## Animations (one job each)

| Effect | Where |
|---|---|
| Shine border | Apply form card only |
| Shimmer button | Primary «Откликнуться» CTAs (header + hero). Press: `scale(0.97)` at 120ms. Hover brightness only on fine pointer. Hero CTA is ~10% larger than the header. |
| Circular progress | Form completion (25% per required field: name, phone, city, position) |
| Confetti | Successful submit only (`#ed1c24` + `#ffffff`) |
| Slider toggle | PDN consent, not theme |
| Theme toggle | Header. Sun/moon. Not the PDN slider |
| Plasma | React Bits Plasma: `#e60000` on dark, cool gray `#6a6e74` steam on light (`lightMode`) |
| Path spine | How-it-works rail grows once on load. Off when `prefers-reduced-motion: reduce`. |

`prefers-reduced-motion: reduce` disables shine, CTA shimmer, confetti, the plasma loop, and CTA press scale. The form still submits.

## Rules

- Tokens live in `src/styles.css` `@theme`. Semantic `page` / `fg` / `muted` swap with `html.dark`. Display font is Libre Franklin ExtraBold until Muller files arrive.
- Theme: `ThemeProvider` (`src/stores/theme.tsx`). Class `dark` on `<html>`, `color-scheme` synced. First visit (no `signet-theme` in `localStorage`) follows `prefers-color-scheme` and keeps listening until the Candidate toggles in the header; then the choice is stored. Blocking script in `index.html` avoids a flash; if storage throws, it still uses the system scheme.
- Light theme is its own surface: warm `#F2F2F2`, dense light glass, Plasma as gray steam (`lightMode`). Wordmark is two knockouts of `public/brand/wordmark.png` (no black plate): light has black `sig` / `team`, both keep the red `net.` block. They sit stacked and swap via `html.dark` so the plate cannot flash. Hero type has no glow on light; dark keeps a black text-shadow. Dark theme keeps black glass and red Plasma. Primary CTAs stay Signet red with white type in both.
- Chrome, cards, form, footer, FAQ disclosures, and how-it-works sit on dense liquid glass so body copy stays readable.
- Form talks only to relative `/api`. Vite proxies `/api` to Hono on localhost.
- Shared Zod schema: `src/lib/application-schema.ts`.
- Russian UI copy only. Source: `src/content/landing.ts`.
- Hero ExtraBold caps use modest tracking (`0.02em`) and `leading-[1.25]` so the Й breve does not collide with the line above. Copy sits inset toward the middle, still left-aligned.
- Type, gutters, and section padding scale with **both** viewport width and height. Tokens live on `:root` in `src/styles.css` (`--type-hero`, `--type-title`, `--type-card`, `--type-lead`, `--type-quote`, `--type-rating`, `--gutter`, `--section-y`, `--header-h`). Short viewports (`max-height: 740px` / `560px`) shrink the hero and section rhythm so the first screen still fits. Classes: `type-*`, `page-gutter`, `section-y`, `scroll-anchor`.
- Phone layout: FAQ uses stacked glass `<details>` rows (`max-w-3xl`), 16px inputs (no iOS zoom), 44px tap targets, content-sized hero with a height cap (16:9 on desktop), `env(safe-area-inset-*)` on header and footer, `viewport-fit=cover`. Wordmark is desktop-only in the header so the CTA stays tappable. Hover brightness stays behind `(hover: hover) and (pointer: fine)`.
- Privacy policy is a `z-[60]` glass dialog above the sticky header. One inner scroll, sticky title and action, safe-area padding. Turning the PDN toggle on is gated until «Ознакомлен». Closing without that button leaves consent off. Footer opens the same dialog without changing the form.
- City field is a custom glass dialog (`CitySelect`), not a native `<select>`, so the option list uses theme tokens (`fg` / `field` / glass) in both light and dark. The list is portaled to `document.body` so the form’s `overflow-hidden` cannot clip it.
- How-it-works is a red path: vertical spine on the phone, horizontal spine from `md`. Station icons are Lucide, not emoji. `prefers-reduced-motion: reduce` skips the spine grow.
- Team gallery code stays in `TeamSection` / `landingContent.team` / `public/team/` but is not mounted on the Landing.
