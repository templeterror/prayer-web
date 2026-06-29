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

Two core colors carry the brand, taken from the logos: **deep pine green** and **warm amber/gold**. Mood: spiritual but not preachy — calm, modern, habit-focused. **Light-first:** warm cream surfaces with deep-green ink, warm gold as the single accent. Star ratings render in gold (aligns naturally with our amber).

> **Theme note:** the shipped landing page is **light** (cream background, deep-green text). The green tokens are the *ink and structure* color, not the page background; the cream tokens are the *surface*, not the text. Values below match `app/globals.css` `@theme`.

### Color palette

#### Core
| Token | Hex | Use |
|-------|-----|-----|
| `--green-900` | `#0B2F2B` | Darkest ink, footer text |
| `--green-800` | `#0E3B36` | **Primary text / ink** (matches Logo_1) |
| `--green-700` | `#13534B` | Secondary text, slider track base |
| `--green-600` | `#1E4A3F` | Borders, dividers, card outlines |
| `--amber-700` | `#8F5207` | Eyebrows, inline links, underline text on cream |
| `--amber-600` | `#CF7F1D` | Amber text-gradient stop, slider focus ring |
| `--amber-500` | `#E89A2C` | **Primary accent / CTA** (button, links, glow, stars) |
| `--amber-400` | `#FFB546` | CTA fill / hover, brighter accent |
| `--amber-300` | `#FFC95E` | CTA fill top, glow core, highlights |
| `--bronze-600` | `#A86E33` | Secondary warm tone (from Logo_2), decorative only |

#### Surfaces & neutrals (on light)
| Token | Hex | Use |
|-------|-----|-----|
| `--cream` | `#FAF4E8` | **Primary page background** |
| `--cream-muted` | `#EFE6D3` | Slightly deeper cream wash |
| `--ink` | `#0B2F2B` | Text on amber buttons |
| (cards) | `white / white-70` | Elevated card surfaces over cream |

> **Contrast note:** `--green-800` on `--cream` and `--ink` on `--amber-500` both clear WCAG AA (4.5:1). Secondary text uses `--green-700` at reduced opacity. Never use `--bronze-600` for body text — decorative only.

#### Gradients
Defined once in `globals.css` as CSS variables built from the amber tokens — never re-hardcode the stops:
- **`--gradient-amber-fill`** (CTA button, slider thumbs): `linear-gradient(180deg, amber-300 0%, amber-400 100%)`
- **`--gradient-amber-text`** (amber-on-cream headline word, e.g. "salah"): `linear-gradient(90deg, amber-600 0%, amber-500 50%, amber-600 100%)` — intentionally darker than the fill for contrast on cream
- **Hero background**: warm cream wash + soft gold glow — `radial-gradient(...rgba(255,181,70,0.18)...)` over `radial-gradient(circle at 50% 35%, #FFFAF0 0%, #FAF4E8 55%, #F3EAD6 100%)`

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
- Border radius: `12px` (`rounded-xl`) feature/step cards, `16px` (`rounded-2xl`) larger surfaces + the form capsule, `999px` (`rounded-full`) nav pill + slider. Keep to these three steps.
- **Floating navbar:** inset from edges (`top-4 left-4 right-4`), not flush to `top-0`. Reserve content padding for its height.
- **z-index scale:** 10 (raised), 20 (sticky nav), 30 (dropdown), 50 (modal). Define once; remember new stacking contexts reset z-index.
- **Responsive breakpoints to test:** 375 / 768 / 1024 / 1440px. No horizontal scroll on mobile. `<meta viewport>` set.

---

## 5. Components

- **Primary CTA (App Store)** — amber-gradient button, `--ink` text, soft glow `0 0 24px rgba(232,154,44,0.35)`, `cursor-pointer`, `transition-colors 200ms`. Disable + show feedback on async.
- **Secondary CTA** — ghost button: 1px `--amber-500` border, amber text, transparent fill.
- **Cards** (feature / mechanic blocks) — white / `white/70` surface over cream, subtle `--green-600/25` border, no heavy shadows, `cursor-pointer` if interactive.
- **Hero** — warm cream radial background, glowing amber arc motif (from logo), Lora headline (one word in `--gradient-amber-text`), one-line honest subhead, and the primary **email capture form**.
- **Email capture form** — single `email` input (`h-14`, `sr-only` label + visible placeholder) joined to an amber-gradient submit in one capsule. On submit → inline success card, with loading/disabled feedback and an inline error message on invalid input. Repeated above the fold and at the close.
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

- [ ] Text contrast ≥ 4.5:1 (verified for green-on-cream, ink-on-amber)
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
