# Iqama Handoff — Building a Snap-Scrolling Mobile Landing Page

Hey Iqama. You're rebuilding this kind of structured, full-screen, snap-scrolling landing
page (dark photo panels on mobile, clean light layout on desktop, with a waitlist form) in
**your own project**. This is a from-scratch guide — you don't have access to the original
repo, so everything you need is in here: the architecture, the actual code, diagrams, and
the *why* behind every non-obvious decision.

Stack assumed: **Next.js (App Router) + TypeScript + Tailwind CSS**. If your project is
plain React + Vite, 95% of this still applies — only the file paths and `next/image` change.

Read it top to bottom once, then build section by section.

---

## Table of contents

1. [The mental model](#1-the-mental-model)
2. [The page shell & information architecture](#2-the-page-shell--information-architecture)
3. [The scroll-snap system](#3-the-scroll-snap-system)
4. [The reveal-on-scroll component](#4-the-reveal-on-scroll-component)
5. [The scroll cue (smooth jump between sections)](#5-the-scroll-cue)
6. [A full-screen panel, anatomy of one](#6-anatomy-of-one-full-screen-panel)
7. [The waitlist form — mobile-first](#7-the-waitlist-form)
8. [The keyboard-vs-snap fix](#8-the-keyboard-vs-snap-fix-the-hard-part)
9. [Validation shared across layers](#9-validation-shared-across-layers)
10. [Tailwind config & design tokens](#10-tailwind-config--design-tokens)
11. [Build order & checklist](#11-build-order--verify-checklist)

---

## 1. The mental model

The single most important idea. There are **two layouts** and **one breakpoint**:

```
                 BREAKPOINT: 640px (Tailwind's `sm:`)
   ┌──────────────────────────────┬──────────────────────────────┐
   │   MOBILE  (< 640px)          │   DESKTOP  (≥ 640px, `sm:`)   │
   ├──────────────────────────────┼──────────────────────────────┤
   │ • dark                       │ • light                      │
   │ • full-bleed photo bg        │ • no photos, plain white     │
   │ • dark gradient over photo   │ • black text on white        │
   │ • white text                 │ • solid (non-glass) form     │
   │ • "glass" translucent form   │ • form sits in a row         │
   └──────────────────────────────┴──────────────────────────────┘
```

Everything is written **mobile-first**: base Tailwind classes describe the **mobile** look,
and `sm:` classes **override** for desktop. So read this:

```
text-white sm:text-black
```

as *"white on mobile, black on desktop."* Once that clicks, the long className strings stop
being scary — they're just **"mobile look" + "desktop overrides."**

> **Why mobile-first and not the reverse?** Tailwind's `sm:` means "≥ 640px and up." There's
> no `max-sm:` in everyday use here. If you wrote desktop as the base and tried to override
> *down* to mobile, you'd be fighting the framework. Base = smallest screen, override upward.

---

## 2. The page shell & information architecture

The whole site is **one page** composed of section components. Keep the page file thin —
it's just a table of contents for the sections.

```tsx
// app/page.tsx
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import ClosingCTA from "@/components/sections/ClosingCTA";

export default function Home() {
  return (
    <main className="relative">
      <Hero />        {/* hook + first ask */}
      <HowItWorks />  {/* persuasion: renders 3 full-screen panels */}
      <ClosingCTA />  {/* second ask + trust */}
    </main>
  );
}
```

### The information architecture

```
  SCROLL ↓        each box = exactly one full screen (100svh)

  ┌─────────────────────────┐
  │  HERO                    │  wordmark · headline · value prop
  │  ┌───────────────────┐  │  ┌─► WAITLIST FORM  (the ask)
  │  │ form  +  scroll cue│  │  └─► scroll cue ──┐  taps → smooth-scroll down
  │  └───────────────────┘  │                    │
  └─────────────────────────┘                    │
  ┌─────────────────────────┐  ◄─────────────────┘
  │  HOW IT WORKS — step 01  │  one idea, one screen
  └─────────────────────────┘
  ┌─────────────────────────┐
  │  HOW IT WORKS — step 02  │  one idea, one screen
  └─────────────────────────┘
  ┌─────────────────────────┐
  │  HOW IT WORKS — step 03  │  one idea, one screen
  └─────────────────────────┘
  ┌─────────────────────────┐
  │  CLOSING CTA             │  restated value
  │  ┌───────────────────┐  │  ┌─► WAITLIST FORM  (same component, the ask again)
  │  │ form               │  │  └─► trust line
  │  └───────────────────┘  │
  └─────────────────────────┘
```

**The IA rules — copy these to your project:**

1. **One idea per screen.** Each panel makes the user decide one thing: *keep scrolling, or
   sign up.* If you can't summarize a section in one sentence, it's two sections.
2. **The ask appears at the top AND bottom, never the middle.** A user converts either on
   impulse (Hero) or after being persuaded (Closing). The middle panels are pure
   persuasion — no form there.
3. **The middle is a `.map()` over data, not hand-written panels.** The three "how it works"
   steps share one structure; only copy and photo differ. This keeps them perfectly
   consistent and makes adding a step a one-line data change (see §6).

---

## 3. The scroll-snap system

This is what makes it feel like Instagram Stories / Reels — each panel locks one-per-swipe.
It's **pure CSS** plus two rules per panel. It's also the most fragile part, so understand
every line.

### Global CSS

```css
/* app/globals.css */

html {
  /* Mandatory vertical snap. Every full-screen panel is a snap target, so a
     swipe always lands cleanly on the next panel — never half-way between two. */
  scroll-snap-type: y mandatory;
}

html, body {
  background-color: #ffffff;  /* desktop is white */
}

/* MOBILE ONLY: paint the page black behind everything below 640px.
   Why: when the mobile browser's toolbar collapses on scroll, it briefly exposes
   a sliver taller than `svh` at the top of the first panel and bottom of the last.
   Painting black means that sliver matches the dark photos instead of FLASHING WHITE. */
@media (max-width: 639px) {
  html, body { background-color: #000000; }
}

body {
  /* Kill the rubber-band bounce at the very top/bottom. Without this, overscroll
     re-triggers snap and the first/last panels feel sticky and bounce. */
  overscroll-behavior-y: none;
}

/* ACCESSIBILITY: never trap scroll for users who opt out of motion. */
@media (prefers-reduced-motion: reduce) {
  html { scroll-snap-type: none; }
}
```

### Per-panel classes

Every full-screen section opts into snapping with **three** things:

```tsx
<section className="snap-start h-[100svh] /* ...rest... */">
```

| Class           | What it does                                                              |
|-----------------|---------------------------------------------------------------------------|
| `snap-start`    | this panel snaps so its **top** aligns to the viewport top                |
| `h-[100svh]`    | the panel is exactly **one small-viewport-height** tall                   |
| `snap-always`   | (on the middle panels) you **can't skip** a panel with one fast flick     |

### Why `svh` and not `vh` or `dvh` — this matters a lot

```
  vh  = viewport height assuming NO browser toolbar  → too tall on mobile,
        panel grows past the screen and stops being a clean snap target.

  dvh = DYNAMIC viewport height, resizes as the toolbar/keyboard show/hide
        → the page LURCHES when the mobile keyboard opens. Bad for a form.

  svh = SMALL viewport height, the size WITH the toolbar showing → stable.
        Never grows past the screen. Does NOT resize when the keyboard opens.
        ✅ This is the one you want.
```

The `svh` choice is what lets you focus the email input **without the whole page jumping**.
Use `svh` for every full-screen panel.

### Mental model of the snap flow

```
   user swipes up
        │
        ▼
   browser scrolls freely for a moment...
        │
        ▼
   ...then `scroll-snap-type: y mandatory` GRABS the scroll and
      locks it to the nearest `snap-start` edge (the next panel's top)
        │
        ▼
   panel is now pinned, exactly 100svh tall, filling the screen
```

> **If you ever see a white flash on overscroll** → the `< 640px` black background rule got
> removed or the breakpoint drifted. **If panels feel sticky/bouncy at the ends** →
> `overscroll-behavior-y: none` is missing. **If focusing the form lurches the page** → a
> panel is using `dvh`/`vh` instead of `svh`.

---

## 4. The reveal-on-scroll component

A reusable wrapper that fades its children up when they scroll into view, using an
`IntersectionObserver`. It respects reduced-motion and can re-play on every entry (needed
for snap panels you scroll back into).

```tsx
// components/Reveal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades children up when they enter the viewport.
 * - Respects prefers-reduced-motion (shows instantly, no transform).
 * - `delay` (ms) staggers grouped items.
 * - `repeat` re-plays every time the element re-enters (use on snap panels).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  repeat = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  repeat?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: show immediately, skip the observer entirely.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) observer.disconnect(); // one-shot: stop watching
        } else if (repeat) {
          setShown(false); // re-arm so it plays again next time it enters
        }
      },
      // Higher threshold for repeat panels so it triggers when the panel is
      // genuinely on screen, not at the very edge.
      { threshold: repeat ? 0.5 : 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition:
          "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

**Usage:**

```tsx
<Reveal>One-shot fade (e.g. hero content)</Reveal>

<Reveal repeat delay={120}>
  Re-plays every time you scroll this snap panel back into view
</Reveal>
```

**Why a custom component and not a library (Framer Motion, AOS)?** Zero dependencies, ~50
lines, and it does exactly what's needed. The `repeat` behaviour (re-arming on exit) is
specifically tuned for snap panels and isn't the default in most libraries. For a landing
page this is the right level of effort.

---

## 5. The scroll cue

The tappable "Here's how it works ↓" pill at the bottom of the hero that smooth-scrolls to
the next section. Two parts: (a) the target section has an `id`, (b) the button calls
`scrollIntoView`.

```tsx
// components/ScrollCue.tsx
"use client";

export default function ScrollCue() {
  function handleClick() {
    document
      .getElementById("how-it-works")            // ← target section's id
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="See how it works"
      className="group mx-auto mt-8 inline-flex cursor-pointer items-center gap-2.5
                 rounded-full border border-white/40 bg-white/10 py-2.5 pl-5 pr-3.5
                 text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20
                 active:scale-[0.97]
                 sm:mt-10 sm:border-black sm:bg-white sm:text-black sm:backdrop-blur-none"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">
        Here&apos;s how it works
      </span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full
                       bg-white text-black sm:bg-black sm:text-white">
        {/* down-arrow icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
             className="h-3.5 w-3.5 animate-bounce">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}
```

Note again the **glass-on-mobile / solid-on-desktop** pattern: `bg-white/10 ...
backdrop-blur-sm` (translucent, mobile) each paired with an `sm:` override (`sm:bg-white
sm:backdrop-blur-none`, solid desktop).

**Why `scrollIntoView({ behavior: "smooth" })` and not an anchor `<a href="#...">`?** With
mandatory scroll-snap, a programmatic smooth scroll behaves more predictably across mobile
browsers, and you get an accessible `<button>` with an `aria-label`. The target just needs a
matching `id`.

---

## 6. Anatomy of one full-screen panel

This is the **template** for every photo-background panel. The middle "how it works"
section maps over a data array to produce three of these. Study this one block — it contains
every layering trick you'll reuse.

```tsx
// components/sections/HowItWorks.tsx
import Reveal from "@/components/Reveal";

// ── DATA: one object per panel. Add a step = add an object. ──
const STEPS = [
  { n: "01", lead: "Discover who's", emphasis: "throwing", tail: "on your campus",
    img: "/photos/party.jpg" },
  { n: "02", lead: "Tell us", emphasis: "your type", tail: "",
    img: "/photos/type.jpg" },
  { n: "03", lead: "Match with them when", emphasis: "you're both", tail: "at the event",
    img: "/photos/date.jpg" },
];

export default function HowItWorks() {
  return (
    <>
      {STEPS.map((step, i) => (
        <section
          key={step.n}
          // First panel gets the id so the scroll cue can target it.
          id={i === 0 ? "how-it-works" : undefined}
          className="relative flex h-[100svh] snap-start snap-always flex-col
                     justify-center px-8 sm:px-12 lg:items-center lg:text-center"
        >
          {/* LAYER 0 — photo background, MOBILE ONLY (sm:hidden = gone on desktop) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-cover bg-center sm:hidden"
            style={{ backgroundImage: `url(${step.img})` }}
          />
          {/* LAYER 0 — dark gradient over the photo for text legibility, MOBILE ONLY */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-gradient-to-b
                       from-black/55 via-black/45 to-black/70 sm:hidden"
          />

          {/* LAYER 10 — content sits above the photo/gradient via z-10 */}

          {/* big faded step number */}
          <Reveal repeat className="relative z-10">
            <span aria-hidden="true"
              className="block font-serif text-7xl font-semibold italic leading-none
                         text-white/15 sm:text-8xl sm:text-black/[0.08]">
              {step.n}
            </span>
          </Reveal>

          {/* the serif statement; one word emphasised in italic serif */}
          <Reveal repeat delay={120} className="relative z-10">
            <p className="mt-4 max-w-[15ch] text-balance text-4xl font-medium
                          leading-[1.1] tracking-tight text-white sm:text-6xl sm:text-black">
              {step.lead}{" "}
              <span className="font-serif font-semibold italic">{step.emphasis}</span>
              {step.tail ? ` ${step.tail}` : ""}
            </p>
          </Reveal>

          {/* progress dots — current step is a wide pill, others are small dots */}
          <div className="absolute bottom-10 left-8 z-10 flex gap-2
                          sm:left-12 lg:left-1/2 lg:-translate-x-1/2">
            {STEPS.map((s, j) => (
              <span key={s.n}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  j === i ? "w-6 bg-white sm:bg-black"
                          : "w-1.5 bg-white/30 sm:bg-black/20"
                }`}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
```

### The layering diagram

This z-index stack is the core trick for "text over a darkened photo." Reuse it everywhere:

```
  ┌──────────────────────────────────────────────┐
  │  z-10   CONTENT (text, number, dots)          │  ← relative z-10
  ├──────────────────────────────────────────────┤
  │  z-0    DARK GRADIENT  (black/55 → black/70)  │  ← absolute inset-0, sm:hidden
  ├──────────────────────────────────────────────┤
  │  z-0    PHOTO  (bg-cover bg-center)           │  ← absolute inset-0, sm:hidden
  └──────────────────────────────────────────────┘
        the section itself is `relative` so z-index is scoped to it
```

- The two background layers are `absolute inset-0` (fill the panel) and `sm:hidden` (vanish
  on desktop — desktop is plain white, no photo).
- The gradient goes **darker toward the bottom** (`to-black/70`) so anything near the bottom
  of the panel (a CTA, a scroll cue) stays legible over busy photo areas.
- Content gets `relative z-10` to float above both background layers.
- `aria-hidden="true"` on the decorative layers keeps them out of the accessibility tree.

**Adding a 4th step is now one object in `STEPS`.** That's the payoff of the data-driven map.

---

## 7. The waitlist form

The only interactive component. Used in **both** the Hero and the Closing CTA. This is the
part you were most stuck on, so it's the most detailed.

### The full component

```tsx
// components/WaitlistForm.tsx
"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { isEduEmail } from "@/lib/validateEmail";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * `variant` controls the MOBILE (<sm) look only — desktop (sm:) is always light.
 * "light" = solid white card. "glass" = translucent dark, for sitting on a photo.
 */
type Variant = "light" | "glass";

export default function WaitlistForm({ variant = "light" }: { variant?: Variant }) {
  const glass = variant === "glass";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // (keyboard-vs-snap effect goes here — see §8)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Client-side check: instant feedback. NOT authoritative (server re-checks).
    if (!isEduEmail(email)) {
      setStatus("error");
      setMessage("Please use a valid .edu email.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // NOTE: "already on the list" comes back as ok:true — treat it as success.
        setStatus("success");
        setMessage(data.message ?? "You're on the list.");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong, try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong, try again.");
    }
  }

  // SUCCESS STATE — replaces the form with a confirmation card.
  if (status === "success") {
    return (
      <div className={`animate-fade-up rounded-2xl border px-6 py-5 text-center ${
        glass
          ? "border-white/15 bg-white/10 backdrop-blur-sm sm:border-black/10 sm:bg-black/[0.03] sm:backdrop-blur-none"
          : "border-black/10 bg-black/[0.03]"
      }`}>
        <p className={`flex items-center justify-center gap-2 text-lg font-semibold ${
          glass ? "text-white sm:text-black" : "text-black"
        }`}>
          {/* check icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {message}
        </p>
        <p className={`mt-1 text-sm ${glass ? "text-white/70 sm:text-black/50" : "text-black/50"}`}>
          We&apos;ll email you the moment it&apos;s live.
        </p>
      </div>
    );
  }

  // FORM STATE
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full" noValidate>
      {/* stacked on mobile, row on desktop */}
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="email"
          inputMode="email"          // mobile keyboard gets @ and . keys
          autoComplete="email"       // OS offers the saved address in one tap
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") { setStatus("idle"); setMessage(""); } // clear error as they retype
          }}
          placeholder="you@school.edu"
          aria-label="Email address"
          aria-invalid={status === "error"}
          disabled={status === "submitting"}
          className={`h-14 w-full rounded-xl border px-4 text-base outline-none transition
                      focus:ring-2 disabled:opacity-60 sm:h-12 sm:flex-1 ${
            glass
              ? "border-white/25 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-sm focus:border-white/60 focus:ring-white/15 sm:border-black/15 sm:bg-white sm:text-black sm:placeholder:text-black/35 sm:backdrop-blur-none sm:focus:border-black/60 sm:focus:ring-black/10"
              : "border-black/15 bg-white text-black placeholder:text-black/35 focus:border-black/60 focus:ring-black/10"
          }`}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`h-14 w-full shrink-0 cursor-pointer rounded-xl px-6 font-semibold transition
                      active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70
                      sm:h-12 sm:w-auto ${
            glass
              ? "bg-white text-black hover:bg-white/90 sm:bg-black sm:text-white sm:hover:bg-black/85"
              : "bg-black text-white hover:bg-black/85"
          }`}
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>

      {/* Error region: reserved height (min-h) so layout never JUMPS when text appears.
          aria-live so screen readers announce the error. */}
      <p className={`mt-3 min-h-[1.25rem] text-sm ${
        glass ? "text-red-300 sm:text-red-500" : "text-red-500"
      }`} aria-live="polite">
        {status === "error" ? message : ""}
      </p>
    </form>
  );
}
```

### 7.1 The `variant` prop — one form, two looks

```
   <WaitlistForm variant="glass" />   ← used on photo backgrounds

   variant ONLY changes the MOBILE look:
   ┌──────────────┬───────────────────────┬───────────────────────┐
   │              │  MOBILE (<640)        │  DESKTOP (≥640, sm:)   │
   ├──────────────┼───────────────────────┼───────────────────────┤
   │ "glass"      │ translucent, blurred, │ ALWAYS solid light     │
   │              │ white text on photo   │ (sm: overrides force)  │
   ├──────────────┼───────────────────────┼───────────────────────┤
   │ "light"      │ solid white card      │ solid light card       │
   └──────────────┴───────────────────────┴───────────────────────┘
```

This is why **every glass class has an `sm:` partner** pulling it back to light:

```
border-white/25 bg-white/10 text-white backdrop-blur-sm    ← glass, mobile
sm:border-black/15 sm:bg-white sm:text-black sm:backdrop-blur-none  ← forced light, desktop
```

> **The #1 mistake on this component:** editing a glass value but forgetting its `sm:`
> partner, so mobile and desktop drift apart. When you touch one, touch both.

### 7.2 Mobile ergonomics — why each choice

| Choice | Class | Why it matters on mobile |
|---|---|---|
| **Stacked, not side-by-side** | `flex-col ... sm:flex-row` | full-width input + button are far easier to thumb-tap than a cramped row |
| **Tall tap targets** | `h-14` (56px) mobile, `sm:h-12` desktop | 56px clears the ~44px minimum comfortable touch target |
| **Full-width button on mobile** | `w-full ... sm:w-auto` | a wide button is a forgiving tap target; `shrink-0` stops it being squeezed on desktop |
| **Press feedback** | `active:scale-[0.98]` | there's no hover on touch — a tiny press-down makes it feel responsive |
| **Right keyboard** | `inputMode="email"` | surfaces `@` and `.` on the phone keyboard |
| **One-tap fill** | `autoComplete="email"` | OS offers the saved address |
| **Free validation** | `type="email"` | browser-level email shape check |
| **No layout jump** | `min-h-[1.25rem]` on the error line | space is reserved, so showing/hiding the error doesn't shove content |
| **Announced errors** | `aria-live="polite"` + `aria-invalid` | screen readers read validation feedback |

### 7.3 The submit flow

```
  user taps "Join"
        │
        ▼
  ┌─────────────────────────┐   fail
  │ client isEduEmail check │ ───────► show "Please use a valid .edu email." (no request sent)
  └───────────┬─────────────┘
              │ pass
              ▼
  status = "submitting"  (button shows "Joining…", input+button disabled)
              │
              ▼
  POST /api/waitlist { email }
              │
      ┌───────┴────────────────────────┐
      ▼                                ▼
   res.ok = true                   res.ok = false
      │                                │
      ▼                                ▼
  SUCCESS card                    ERROR text (data.error)
  (incl. "already on the          (e.g. non-.edu that slipped past)
   list" — treat as a win)
              │
   (network throw) ───────────────► generic "Something went wrong"
```

Key behavioural contracts to carry over:
- **"Already signed up" is a soft success** (the server returns ok:true). Don't render it red.
- **Re-typing clears the error** (`onChange` resets status to idle) — feels forgiving.
- The success copy says "we'll email you" but **no email is sent on signup here** — adapt
  that copy to whatever your backend actually does.

---

## 8. The keyboard-vs-snap fix (the hard part)

This is the single trickiest piece and the thing that makes a snap-scroll page + a form
actually usable on mobile. It belongs inside `WaitlistForm.tsx`.

### The problem

```
  scroll-snap-type: y mandatory   ⚔️   the mobile keyboard
  ───────────────────────────         ──────────────────
  "lock scroll to panel edges"        "scroll the focused input above me"

  Result with no fix:
    user taps email field → keyboard slides up and COVERS the input →
    mandatory snap refuses to let the page scroll → input stays hidden → dead form.
```

### The fix

While any field in the form is focused, **turn snap off** on `<html>` so the browser can
scroll the input into view; restore it when focus leaves.

```tsx
// Inside WaitlistForm, alongside the other hooks:
useEffect(() => {
  if (typeof document === "undefined") return;
  // Reduced-motion already has snap off in CSS — don't force it back on.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const formEl = formRef.current;
  if (!formEl) return;
  const root = document.documentElement;
  let restoreTimer: number | undefined;

  const disableSnap = () => {
    if (restoreTimer) { clearTimeout(restoreTimer); restoreTimer = undefined; }
    root.style.scrollSnapType = "none";               // turn snap OFF
    // Nudge the focused field clear of the keyboard now that snap won't fight us.
    const el = document.activeElement as HTMLElement | null;
    if (el && typeof el.scrollIntoView === "function") {
      requestAnimationFrame(() =>
        el.scrollIntoView({ block: "center", behavior: "smooth" }),
      );
    }
  };

  const enableSnap = () => {
    // Debounce: moving focus from input → button fires focusout then focusin.
    // The 150ms wait stops snap flickering off/on between those two events.
    restoreTimer = window.setTimeout(() => {
      // removeProperty (not = "") reverts to the STYLESHEET value, so the
      // reduced-motion CSS rule stays authoritative.
      root.style.removeProperty("scroll-snap-type");
    }, 150);
  };

  formEl.addEventListener("focusin", disableSnap);
  formEl.addEventListener("focusout", enableSnap);

  return () => {
    formEl.removeEventListener("focusin", disableSnap);
    formEl.removeEventListener("focusout", enableSnap);
    if (restoreTimer) clearTimeout(restoreTimer);
    root.style.removeProperty("scroll-snap-type");
  };
}, []);
```

### The lifecycle

```
  focusin  (tap input)
     │  clear any pending restore timer
     │  set html.style.scrollSnapType = "none"   ← snap OFF
     │  scrollIntoView(block:"center") the field ← lift it above keyboard
     ▼
  ... user types, maybe taps the Join button (focus moves input→button) ...
     │  focusout fires → start 150ms timer
     │  focusin fires immediately → CANCELS the timer (snap stays off, no flicker)
     ▼
  focusout (dismiss keyboard, leave form)
     │  start 150ms timer, no focusin cancels it
     │  timer fires → html.style.removeProperty(...) ← snap back ON (from CSS)
     ▼
  back to normal snap scrolling
```

**Why it's done this way and not "simpler":**
- You can't reliably disable a CSS property *per element on focus* from a stylesheet — deep
  `:focus-within` on `<html>` is flaky across mobile browsers. Toggling an inline style from
  the component that owns the form is the clean, scoped fix.
- `removeProperty` (not setting `""` or `"y mandatory"`) is deliberate: it falls back to
  whatever the stylesheet says, so the **reduced-motion** rule keeps winning.
- The **150ms debounce** is the bit people delete and then get a flicker bug. Keep it.

**Do not "clean this up" without testing on a real phone with the keyboard open.**

---

## 9. Validation shared across layers

The `.edu`-only rule (adapt to your own rule) lives in **one tiny file** imported by both
the client form and the server route, so they can't disagree.

```ts
// lib/validateEmail.ts
// Shared by the client form AND the server route so they always agree.
// (A DB CHECK constraint should mirror this regex as a final backstop.)

const EDU_EMAIL_RE = /^[^@\s]+@[^@\s]+\.edu$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEduEmail(email: string): boolean {
  return EDU_EMAIL_RE.test(normalizeEmail(email));
}
```

```
  THE RULE LIVES IN THREE PLACES — keep them in sync:

  ┌──────────────┐   imports    ┌──────────────────────┐
  │  client form │ ───────────► │ lib/validateEmail.ts │ ◄─── imports ─┐
  └──────────────┘              └──────────────────────┘               │
       instant UX                    (single source)            ┌──────┴───────┐
       (bypassable)                                             │ server route │
                                                                │ authoritative│
                                                                └──────┬───────┘
                                                                       │ must mirror
                                                                       ▼
                                                          ┌────────────────────────┐
                                                          │ DB CHECK constraint     │
                                                          │ (final backstop)        │
                                                          └────────────────────────┘
```

**Principle to steal:** the client check is *only UX* (it can be bypassed via devtools or a
direct API call), so the **server must re-validate**, and the **database** is the last line of
defence. Three layers, one shared regex for the two JS layers. If you change the rule, change
all three.

---

## 10. Tailwind config & design tokens

Keep the palette tiny and intentional. This site is **strictly black & white** — the only
"accent" is a serif italic font, not a color.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",   // semantic black token — use `text-ink` not `text-black`
        paper: "#ffffff", // semantic white token
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"], // the "accent" face
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up 0.5s ease-out both" },
    },
  },
  plugins: [],
};

export default config;
```

> In the code snippets above I used literal `black`/`white` for portability. In the real
> project, prefer the **`ink`/`paper` tokens** — named tokens mean you can re-theme in one
> place. Adopt the same habit in yours.

**The "emphasis word" pattern** you see everywhere (`night out`, `your type`, `showing up`)
is just one span swapped to the serif italic:

```tsx
<h1 className="font-medium text-white sm:text-ink">
  The app for your <span className="font-serif font-semibold italic">night out</span>
</h1>
```

One sans headline, one serif-italic emphasis word. That contrast *is* the brand.

---

## 11. Build order & verify checklist

Build in this order — each step is testable on its own:

1. **Tailwind tokens + global CSS** (§3, §10). Get `scroll-snap-type`, the `< 640px` black
   background, and `overscroll-behavior` in first.
2. **One static full-screen panel** (§6) with the photo + gradient + z-10 content layering.
   Confirm snap works before you build more.
3. **The page shell** (§2) — stack Hero / middle / Closing as empty `100svh` sections and
   confirm they snap one-per-swipe.
4. **`Reveal`** (§4) and **`ScrollCue`** (§5). Confirm content fades in and the cue jumps.
5. **`WaitlistForm`** (§7) without the keyboard effect. Style it, test both variants.
6. **Add the keyboard-vs-snap effect** (§8). Test on a real phone.
7. **Validation + API** (§9) last.

### Verify checklist (do this on a REAL phone, not just devtools)

```
  [ ] Panels snap one-per-swipe; you can't get stuck between two.
  [ ] No WHITE FLASH when you overscroll the top of the first / bottom of the last panel.
  [ ] No bouncy/sticky feel at the very top and bottom.
  [ ] Resize a desktop window across 640px — layout flips dark↔light cleanly, no broken state.
  [ ] Tap the email field: keyboard opens, input scrolls ABOVE it, page does NOT lurch.
  [ ] Dismiss the keyboard: snap scrolling comes back (wait ~150ms).
  [ ] Move focus input→button: snap does NOT flicker.
  [ ] Submit a bad email: red error appears, layout does NOT jump (reserved space).
  [ ] Submit a good email: success card replaces the form.
  [ ] Turn on "Reduce Motion" in OS settings: snap is off, content shows instantly, scroll works.
  [ ] Tab through with a keyboard / VoiceOver: form is labelled, errors are announced.
```

---

## One-paragraph summary

Build it **mobile-first** around a **single 640px breakpoint** (dark photo panels on mobile,
clean light on desktop — read every className as "mobile, then `sm:` override"). The page is
**full-screen CSS scroll-snap panels** (`snap-start` + `h-[100svh]`), and three details make
the snap behave on mobile: use **`svh`** (not vh/dvh), kill overscroll with
**`overscroll-behavior: none`**, and paint the page **black below 640px** to avoid white
flashes. Each panel layers a **photo + dark gradient at `z-0` under content at `z-10`**, all
`sm:hidden` so desktop is plain. The **waitlist form** is one component with a **`variant`
prop that only changes the mobile look** (so every glass class needs an `sm:` light partner),
built for thumbs (stacked, 56px targets, `inputMode`/`autoComplete`, reserved error space).
The trickiest piece is the **`useEffect` that turns scroll-snap off while a field is focused**
so the mobile keyboard can reveal the input — debounced so it doesn't flicker. Validation is
**one shared regex** the client and server both import, with the DB as a final backstop.
Verify everything **on a real phone**.

Ping me on the keyboard-vs-snap part (§8) or the `svh` reasoning (§3) — those are the two
things that are genuinely subtle and worth getting right before you build on top of them.
```
