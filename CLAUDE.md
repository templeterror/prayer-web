# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The `@AGENTS.md` import above is load-bearing: this repo runs **Next.js 16.2.9** with breaking changes from prior versions. Consult `node_modules/next/dist/docs/01-app/` (e.g. `01-getting-started/11-css.md`, `13-fonts.md`, `15-route-handlers.md`) before writing framework code rather than relying on memory.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000 (Turbopack)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config: eslint.config.mjs)
```

There is **no test suite**. Verify changes by running the dev server and inspecting the page; the `browse` skill is the established way to screenshot/inspect at specific viewports (375px mobile, 1280px desktop).

Note: the dev server is often already running on port 3000 — a second `npm run dev` will fail with "Another next dev server is already running." Reuse the running instance (it hot-reloads).

## What this is

A single-page **pre-launch waitlist landing page** for *Iqama*, an iOS app that locks distracting apps during the five daily prayer windows. No backend product, no auth, no database — the only dynamic piece is the email capture. Stack: Next.js App Router + React 19 + TypeScript + **Tailwind CSS v4**.

## Architecture

**One page, composed of section components.** `app/page.tsx` is a thin table of contents that stacks sections in order: `Hero → Reckoning → HowItWorks → WhyDifferent → ClosingCta`, plus `Nav` (fixed) and `Footer`. Section order and copy are governed by **`DESIGN.md`** — the design source of truth (brand palette, typography, voice, section strategy). Read it before changing layout, color, or copy. Honesty constraints there are intentional (no fabricated social proof, no false urgency, iOS-only stated plainly).

**Tailwind v4 is CSS-first.** There is **no `tailwind.config.*`**. Design tokens (colors `green-*`/`amber-*`/`cream`/`ink`, fonts, `tracking-eyebrow`, `max-w-content`) live in the `@theme` block of `app/globals.css`. Custom utilities/animations (`.hero-bg`, `.amber-text-gradient`, `.cta-amber`, `.arc`, `.reveal`, `.animate-fade-up`, `.prayer-slider*`, snap rules) are plain CSS there too. Add new tokens/utilities in `globals.css`, not a config file. Fonts (Lora serif, Raleway sans) are wired via `next/font/google` in `app/layout.tsx` and exposed as CSS vars.

**The mobile experience is a separate layout, not just responsive scaling.** The breakpoint is `640px` (Tailwind `sm:`). Below it, the page is a sequence of **full-screen scroll-snap panels** (Instagram-Stories feel); at and above it, normal document flow. Key rules:
- The snap system is **mobile-only**, scoped to `@media (max-width: 639px)` in `globals.css`: `scroll-snap-type: y mandatory` on `html`, `overscroll-behavior-y: none` on `body`, and a `.snap-panel` utility (`scroll-snap-align: start; scroll-snap-stop: always; min-height: 100svh`). Use **`svh`, never `vh`/`dvh`** — it doesn't resize when the mobile keyboard opens, so focusing the form never lurches the page. `min-height` (not `height`) lets tall panels like the calculator grow instead of clipping.
- Each section's root `<section>` carries `snap-panel` + `flex flex-col justify-center` + `pt-24` (clears the fixed nav; the nav floats over the top ~78px of every panel). Reduced-motion turns snap off.
- **`HowItWorks` and `WhyDifferent` render two trees**: a compact mobile single-panel version (`sm:hidden`) holding the header + all steps as rows, and the original desktop multi-column/list version (`hidden sm:block`). When editing these, change **both** trees or mobile and desktop drift apart. `Reckoning` swaps `MissedPrayersCalculatorMobile` (`md:hidden`) for `MissedPrayersCalculator` (`hidden md:block`) the same way.

**`Reveal.tsx`** adds `.js-ready` to `<html>` then uses an `IntersectionObserver` to fade in every `.reveal` element on scroll (with a 2.5s safety net that reveals all if the observer stalls, so content is never stuck hidden). It's mounted once at the top of `page.tsx` and operates globally by class.

**`WaitlistForm.tsx`** is the only interactive component, used in both `Hero` and `ClosingCta` via a `variant` prop (`"hero" | "footer"` — controls wrapper width only). It posts to `/api/waitlist`. Two things to preserve when editing it:
- **Keyboard-vs-snap effect:** a `useEffect` disables `scroll-snap-type` on `<html>` while a field is focused (so the mobile keyboard can reveal the input) and restores it on blur with a **150ms debounce** (prevents flicker when focus moves input→button). Don't "simplify" the debounce.
- **Input + button are a joined capsule** (func-style): one rounded `overflow-hidden` container with the field on top and a flush full-width button below, on all breakpoints. Focus/error styling is on the outer container via `focus-within`; the field itself has no border. Success replaces the whole form with a card (early return). Typing clears an error.

**API:** `app/api/waitlist/route.ts` validates the email with a shape regex and currently just `console.log`s it (see the `TODO` — no persistence yet). The same regex is duplicated in `WaitlistForm.tsx` for instant client feedback; the server is authoritative. Keep the two in sync if the rule changes.

## Conventions

- Import alias: `@/*` maps to the repo root (e.g. `@/components/WaitlistForm`).
- Read every responsive className as **"mobile look, then `sm:` override for desktop."** Base classes describe mobile.
- Icons are inline SVG (24×24 viewBox), never emoji.
- `reference/`, `handoff.md`, `textbox.md`, `CONTEXT.md` are design/handoff notes, not shipped code.
