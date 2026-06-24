# Iqama — Landing Page Design System

> Source of truth for the **landing page** (marketing site). The product is an iOS app; this file governs the web page that sells it.
> Recommendations below are synthesized from the **UI/UX Pro Max** design intelligence skill (pattern, typography, UX rules) + the brand colors extracted from `/Logos`.

---

## 1. Pattern: Waitlist (pre-launch)

The app is **pre-launch** — no users, reviews, or social proof yet. Conversion is driven by **clear, emotionally resonant messaging + a single prominent email capture**. We do **not** fabricate social proof, waitlist counts, or countdowns.

**Section order (top → bottom):**
1. **Hero (above the fold)** — emotional headline + one honest subhead + **email capture form** (the single conversion goal)
2. **The reckoning / duty** — short dignified copy on distraction eroding presence in prayer, anchored by one carefully-attributed Qur'anic ayah
3. **How it works** — 3 calm steps (prayer window opens → "Did you pray?" shield → "I prayed" unlocks + streak), with the honest 5-min escape hatch
4. **Why it's different** — value cards: focus-not-friction (only chosen apps, only during the window), accurate local prayer times, streaks, the gentle escape hatch. Honest constraints stated.
5. **Closing waitlist CTA** — repeated email form + a final line of gentle conviction

**CTA strategy:** Email capture prominent above the fold and repeated at the close; nav "Join the waitlist" button scrolls to the form. iOS-only — do **not** show a Play Store badge; state the iOS requirement honestly instead.

**Avoid (anti-patterns):** complex navigation, fabricated social proof / waitlist counts, false-urgency countdowns, overstating capabilities.

---

## 2. Brand foundation

Two core colors carry the brand, taken from the logos: **deep pine green** and **warm amber/gold**. Mood: spiritual but not preachy — calm, modern, habit-focused. **Dark-first**, warm gold as the single accent. Star ratings render in gold (aligns naturally with our amber).

### Color palette

#### Core
| Token | Hex | Use |
|-------|-----|-----|
| `--green-900` | `#0B2F2B` | Deepest background, footer |
| `--green-800` | `#0E3B36` | **Primary background** (matches Logo_1) |
| `--green-700` | `#13534B` | Elevated surfaces, cards |
| `--green-600` | `#1E4A3F` | Borders, dividers on dark |
| `--amber-500` | `#E89A2C` | **Primary accent / CTA** (App Store button, links, glow, stars) |
| `--amber-400` | `#FFB546` | Hover / brighter accent |
| `--amber-300` | `#FFC95E` | Glow core, highlights |
| `--bronze-600` | `#A86E33` | Secondary warm tone (from Logo_2) |

#### Neutrals (on dark)
| Token | Hex | Use |
|-------|-----|-----|
| `--cream` | `#F4EBD8` | Primary text on dark |
| `--cream-muted` | `#C9C2B2` | Secondary text, captions |
| `--ink` | `#0B2F2B` | Text on amber buttons |

> **Contrast note:** `--cream` on `--green-800` and `--ink` on `--amber-500` both clear WCAG AA (4.5:1). Never use `--bronze-600` for body text on dark — decorative only.

#### Gradients
- **Amber glow** (hero arc / accent): `linear-gradient(90deg, #D9791F 0%, #FFC95E 50%, #D9791F 100%)`
- **Background depth**: `radial-gradient(circle at 50% 35%, #13534B 0%, #0E3B36 55%, #0B2F2B 100%)`
- **CTA button**: `linear-gradient(180deg, #FFB546 0%, #E89A2C 100%)`

---

## 3. Typography — "Wellness Calm"

Skill-recommended pairing for calm / spiritual / wellness products. Serif headings carry warmth; clean sans keeps the body modern and readable.

| Role | Font | Notes |
|------|------|-------|
| Display / headings | **Lora** (serif) | Organic curves, calm, editorial. Weights 400–700. |
| Body / UI | **Raleway** (sans) | Elegant, modern, highly readable. Weights 300–700. |
| Eyebrow / labels | Raleway, uppercase | `letter-spacing: 0.25em`, small, amber or cream-muted (echoes the IQAMA wordmark) |

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');
```
```js
// tailwind
fontFamily: { serif: ['Lora', 'serif'], sans: ['Raleway', 'sans-serif'] }
```

**Scale (rem):** `3.5 / 2.5 / 1.75 / 1.25 / 1 / 0.875`. Body min **16px** on mobile. Line-height **1.15** headings, **1.6** body. Line length capped at **65–75 chars** (~640px text block).

---

## 4. Spacing & layout

- Base unit **8px**. Scale: 4, 8, 16, 24, 32, 48, 64, 96, 128.
- Max content width: **1120px** (`max-w-6xl`), centered — keep it consistent across every section.
- Generous vertical rhythm — sections separated by 96–128px. Calm = breathing room.
- Border radius: `12px` cards, `999px` pills/buttons.
- **Floating navbar:** inset from edges (`top-4 left-4 right-4`), not flush to `top-0`. Reserve content padding for its height.
- **z-index scale:** 10 (raised), 20 (sticky nav), 30 (dropdown), 50 (modal). Define once; remember new stacking contexts reset z-index.
- **Responsive breakpoints to test:** 375 / 768 / 1024 / 1440px. No horizontal scroll on mobile. `<meta viewport>` set.

---

## 5. Components

- **Primary CTA (App Store)** — amber-gradient button, `--ink` text, soft glow `0 0 24px rgba(232,154,44,0.35)`, `cursor-pointer`, `transition-colors 200ms`. Disable + show feedback on async.
- **Secondary CTA** — ghost button: 1px `--amber-500` border, amber text, transparent fill.
- **Cards** (feature / mechanic blocks) — `--green-700` surface, subtle `--green-600` border, no heavy shadows, `cursor-pointer` if interactive.
- **Hero** — dark radial background, glowing amber arc motif (from logo), Lora headline, one-line honest subhead, and the primary **email capture form**.
- **Email capture form** — single `email` input (`h-12`, `sr-only` label + visible placeholder) + amber-gradient submit. Front-end only: on submit → inline success state, with loading/disabled feedback. Repeated above the fold and at the close.
- **Ayah block** — one carefully-attributed Qur'anic ayah, set apart typographically (Lora, larger, amber rule or quote mark). Reference shown.
- **Eyebrows** — uppercase tracked label above each section heading.
- **Icons** — SVG only (Heroicons / Lucide), 24×24 viewBox, consistent sizing. **No emoji as icons.**

---

## 6. Motion

- Subtle and slow. Animate **1–2 key elements per view max** — not everything.
- Entrance: fade / slide-up, **150–300ms**, **ease-out** (ease-in for exits). Use `transform`/`opacity` only — never animate `width`/`height`.
- Amber glow may softly pulse (≤ 8s loop, low opacity delta). Nothing flashy.
- **`prefers-reduced-motion: reduce`** must disable parallax, scroll-jacking, counters, and large entrances.
- Loading states: skeleton / spinner — never a frozen or blank UI.

---

## 7. Accessibility checklist (pre-delivery)

- [ ] Text contrast ≥ 4.5:1 (verified for cream-on-green, ink-on-amber)
- [ ] Visible focus rings on every interactive element; tab order matches visual order
- [ ] All meaningful images have alt text; icon-only buttons have `aria-label`
- [ ] Color is never the only indicator (e.g. stars also show a numeric rating)
- [ ] `cursor-pointer` on all clickable elements; clear hover feedback (no layout-shifting scale)
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375 / 768 / 1024 / 1440px, no horizontal scroll
- [ ] No emojis used as icons (SVG only)

---

## 8. Voice on the page

Modern, calm, habit-focused. **Be honest about constraints** — iOS only, no notifications or cloud sync in v1, requires a physical device. Don't overstate.

**Messaging — gentle conviction (confirmed):** Speak to the duty and the quiet ache of prayers slipping away to distraction — but **convict, never shame**. Address the user's own aspiration to pray with presence (*khushū'*), not a threat. Calm and dignified, never fear-mongering.

**Light Islamic framing:** A few authentic touches — natural use of *salah* / *khushū'*, and **one** Qur'anic ayah (4:103, "prayer ... a decree of specified times," Sahih International) — without overwhelming. Any scripture must be accurate and attributed.

**Hard nos:** no fabricated stats, no false-urgency countdowns, no "X already joined."
