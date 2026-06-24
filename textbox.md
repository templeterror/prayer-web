# textbox.md — The Waitlist Input & Button, Done Right

Iqama — this file is **only** about the email field + submit button (the "textbox"). Forget
the page, the snap-scroll, all of it. This is the one component you keep getting wrong, so
here it is in full, isolated, with every decision explained, tuned for **your** project's
look (warm cream background, serif headline, amber accent — the "Reclaim the five prayers"
page in your screenshot).

By the end you'll have a single `WaitlistForm` component that:
- looks right on your cream background **and** on a dark photo,
- has correct focus / error / success / loading states,
- is comfortable to tap on a phone,
- and is accessible (labelled, announced errors).

---

## 0. What's wrong with the current one (from your screenshot)

I looked at your "Don't scroll through your salah" screen. Here's exactly what's off, and
each one is fixed below:

```
  YOUR CURRENT FORM                          THE PROBLEMS
  ┌───────────────────────────────────┐
  │  you@email.com                    │  ① border is too faint — it nearly vanishes on
  └───────────────────────────────────┘     the cream bg. The field doesn't read as a field.

  ┌─────────────────────────────────────┐  ② input and button DON'T line up — the input is
  │          Join the waitlist          │     inset/narrower, the button is wider. Edges must
  └─────────────────────────────────────┘     align to the SAME left/right.

                                            ③ heights/roundings look mismatched between the
                                               two — they should feel like a matched pair.
            iOS · One email when we launch.   ④ placeholder is low-contrast; ⑤ no visible
                                               focus ring, no error space, no success state.
```

Fix all five and it'll look intentional instead of "two elements that happen to be near
each other."

---

## 1. The anatomy

A waitlist form is **five** things, in this order. Most people build 1 and 2 and stop.
You need all five.

```
  ① INPUT        the email field
  ② BUTTON       the submit
  ③ ERROR LINE   reserved space under the field for validation messages
  ④ SUCCESS CARD what REPLACES the form after a successful submit
  ⑤ LOADING      the in-between state while the request is in flight
```

```
  ┌─────────────────────────────────────────────┐
  │  ① INPUT  you@email.com                      │   ← 56px tall, clear border
  ├─────────────────────────────────────────────┤
  │  ② BUTTON          Join the waitlist         │   ← 56px tall, SAME width as input
  └─────────────────────────────────────────────┘
     ③ ↳ "Please enter a valid email."             ← reserved line, no layout jump
```

The golden rule that fixes your screenshot: **the input and the button are a matched pair.**
Same width, same corner radius, same height. They stack with a small consistent gap. When
they line up, it looks designed; when they don't, it looks broken.

---

## 2. The full component (copy this)

This is tuned to your palette. I'm using **plain hex via Tailwind arbitrary values** so it
drops into your project with no token setup. Swap to your own tokens later.

Your palette (read off your screenshot):
- background: warm cream `#FBF6EC`
- ink / headline green: `#1F3A2E` (deep green) — but for the button I'll use your **amber**
- amber accent (button): `#E8A23D` → hover `#D8912E`
- the serif headline face is already set on your page; the form uses your sans.

```tsx
// components/WaitlistForm.tsx
"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

// Basic email shape. Swap for your real rule if you gate by domain.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // ① client-side check = instant feedback (NOT security — server re-checks)
    if (!EMAIL_RE.test(email.trim().toLowerCase())) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");                 // includes "already on the list" — that's a win
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

  // ④ SUCCESS — replaces the whole form
  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#1F3A2E]/10 bg-[#1F3A2E]/[0.04] px-6 py-5 text-center">
        <p className="flex items-center justify-center gap-2 text-lg font-semibold text-[#1F3A2E]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {message}
        </p>
        <p className="mt-1 text-sm text-[#1F3A2E]/55">
          We&apos;ll email you the moment it&apos;s live.
        </p>
      </div>
    );
  }

  // INPUT + BUTTON + ERROR
  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      {/* stacked on mobile, row on desktop — gap is consistent both ways */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* ① INPUT */}
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") { setStatus("idle"); setMessage(""); } // clear error as they retype
          }}
          placeholder="you@email.com"
          aria-label="Email address"
          aria-invalid={status === "error"}
          disabled={status === "submitting"}
          className={[
            "h-14 w-full rounded-xl px-4 text-base outline-none transition sm:h-12 sm:flex-1",
            "bg-white text-[#1F3A2E] placeholder:text-[#1F3A2E]/40",
            "border-2 border-[#1F3A2E]/15",                       // ← visible border (fixes ①)
            "focus:border-[#E8A23D] focus:ring-2 focus:ring-[#E8A23D]/25", // ← real focus state (fixes ⑤)
            status === "error" ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "",
            "disabled:opacity-60",
          ].join(" ")}
        />

        {/* ② BUTTON — same height, same radius, same width as input on mobile */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className={[
            "h-14 w-full shrink-0 rounded-xl px-6 font-semibold sm:h-12 sm:w-auto",
            "bg-[#E8A23D] text-white transition hover:bg-[#D8912E]",
            "active:scale-[0.98]",                                // ← press feedback on touch
            "disabled:cursor-not-allowed disabled:opacity-70",
          ].join(" ")}
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>

      {/* ③ ERROR LINE — reserved height so the layout never JUMPS (fixes the jolt) */}
      <p className="mt-2 min-h-[1.25rem] text-sm text-red-500" aria-live="polite">
        {status === "error" ? message : ""}
      </p>
    </form>
  );
}
```

That's the whole thing. Below is *why* each part is the way it is — read it so you can change
it without breaking it.

---

## 3. Fixing your five problems, one by one

### ① The border was invisible → give it weight and contrast

On a cream background a `1px` border at low opacity disappears. Two fixes, used together:

```
  before:  border  border-[#1F3A2E]/10     ← 1px, 10% — vanishes
  after:   border-2 border-[#1F3A2E]/15    ← 2px, 15% — reads as a field
```

The field is the thing the user has to *find and tap* — it must be the most obviously
interactive element on the screen. A real border (or a subtle inner shadow) makes it read as
"type here." Don't go thinner than `2px` on a light background.

> Alternative look: instead of a border, use a **filled** field — `bg-white` with a soft
> shadow — on the cream page. White-on-cream reads as a field even with no border. Pick one:
> bordered **or** filled-white. The code above does both (white fill *and* a border) which is
> belt-and-suspenders and looks great on cream.

### ② / ③ Input and button didn't align → make them one matched pair

This is the biggest visual fix. The two elements must share **width, radius, height**:

```
  ┌──────────────────────────────┐  rounded-xl   h-14   w-full
  │  you@email.com               │
  └──────────────────────────────┘
  ┌──────────────────────────────┐  rounded-xl   h-14   w-full   ← IDENTICAL box
  │       Join the waitlist      │
  └──────────────────────────────┘
   └──── same left edge      same right edge ────┘
```

Concretely, both get:
- `h-14` (56px) on mobile, `sm:h-12` (48px) on desktop — **the same height as each other.**
- `rounded-xl` — **the same corner radius.**
- `w-full` on mobile — **the same width**, so edges line up. (`shrink-0` on the button so it
  never gets squeezed when they sit in a row on desktop.)
- a single shared `gap-3` between them — consistent breathing room.

When these three match, the "two random elements" look from your screenshot is gone.

### ④ Placeholder was low-contrast → lift it, but keep it below the typed text

```
  placeholder:text-[#1F3A2E]/40   ← visible, but clearly lighter than real input
  text-[#1F3A2E]                  ← typed text is full strength
```

Placeholder should be readable but obviously *not* a real value — around 40% of your ink
color is the sweet spot. Don't make it darker than ~50% or people think the field is
pre-filled. Also: the placeholder is a **hint** (`you@email.com`), never a substitute for the
`aria-label` — screen readers don't reliably read placeholders, which is why the input also
has `aria-label="Email address"`.

### ⑤ There was no focus state → add a real, branded one

A field with no visible focus is broken for keyboard users and feels dead on tap. Use your
amber to draw the focus ring so it's on-brand:

```
  focus:border-[#E8A23D]                ← border turns amber
  focus:ring-2 focus:ring-[#E8A23D]/25  ← soft amber halo
  outline-none                          ← we replace the ugly default outline (don't just delete it!)
```

> ⚠️ `outline-none` **only** safe because we add `focus:ring-*` to replace it. Never remove
> the outline without giving focus *some* other visible treatment — that's an accessibility
> regression.

---

## 4. The states — the part people forget

A textbox isn't one thing, it's a little state machine. This is what separates "looks
finished" from "actually finished."

```
            ┌──────┐  type invalid + submit
            │ idle │ ───────────────────────────► ┌───────┐
            └──┬───┘                               │ error │ (red border, message)
               │ type valid + submit               └───┬───┘
               ▼                                        │ user edits the field
        ┌────────────┐                                  │
        │ submitting │  ("Joining…", disabled) ◄────────┘ back to idle
        └─────┬──────┘
              │
        ┌─────┴───────┐
        ▼             ▼
   ┌─────────┐   ┌───────┐
   │ success │   │ error │  (server said no / network failed)
   │ (card)  │   └───────┘
   └─────────┘
```

| State | What the user sees | The code |
|---|---|---|
| **idle** | normal field + amber button | `status === "idle"` |
| **error** | red border on input, red message under it | `status === "error"` → red classes + `aria-invalid` |
| **submitting** | button says "Joining…", field + button disabled | `status === "submitting"` → `disabled` |
| **success** | the whole form is **replaced** by a confirmation card | early `return` before the `<form>` |

Two behaviours that make it feel good:
1. **Typing clears the error.** The `onChange` resets `status` to `idle` the moment they edit
   — so the red doesn't linger while they're fixing it.
2. **Success replaces the form.** Don't leave an empty input sitting under a "you're in!"
   message — swap the entire thing for the success card (the early `return`).

---

## 5. Mobile ergonomics — why the sizes are what they are

This is a *phone* form first. Every number here is deliberate:

| Choice | Value | Why |
|---|---|---|
| Stack vertically on mobile | `flex-col sm:flex-row` | full-width input + button are far easier to thumb-tap than a cramped side-by-side row |
| Tall targets | `h-14` = 56px (mobile) | comfortably above the ~44px minimum touch target; 48px (`sm:h-12`) is fine for mouse |
| Full-width button | `w-full sm:w-auto` | a wide button is a forgiving tap target on a phone |
| Press feedback | `active:scale-[0.98]` | touch has no hover — a tiny press-down confirms the tap landed |
| Email keyboard | `inputMode="email"` | the phone keyboard shows `@` and `.` |
| One-tap autofill | `autoComplete="email"` | the OS offers the saved address |
| Browser validation | `type="email"` | free shape-checking + correct semantics |
| No layout jump | `min-h-[1.25rem]` on error line | space is reserved, so showing/hiding the error never shoves the button around |

> The `min-h` on the error line is subtle but important: without it, the moment an error
> appears the whole form shifts down by a line — and on a snap-scroll page that can knock the
> button under the keyboard. Reserve the space up front.

---

## 6. Putting it on a dark photo (the "glass" version)

Your snap-scroll page has dark photo panels too. The same form needs a translucent
("glass") treatment there. The trick: **one `variant` prop**, and it **only** changes the
*mobile* look — desktop stays the light version. Every glass class gets an `sm:` partner that
pulls it back to light.

```tsx
type Variant = "light" | "glass";

export default function WaitlistForm({ variant = "light" }: { variant?: Variant }) {
  const glass = variant === "glass";
  // ...same state/logic as above...
}
```

```tsx
// INPUT className, glass-aware:
className={[
  "h-14 w-full rounded-xl px-4 text-base outline-none transition sm:h-12 sm:flex-1",
  glass
    ? // translucent dark on the photo (mobile) ── forced light on desktop
      "border-2 border-white/25 bg-white/10 text-white placeholder:text-white/50 backdrop-blur-sm " +
      "focus:border-white/70 focus:ring-2 focus:ring-white/20 " +
      "sm:border-[#1F3A2E]/15 sm:bg-white sm:text-[#1F3A2E] sm:placeholder:text-[#1F3A2E]/40 " +
      "sm:backdrop-blur-none sm:focus:border-[#E8A23D] sm:focus:ring-[#E8A23D]/25"
    : // plain light everywhere
      "border-2 border-[#1F3A2E]/15 bg-white text-[#1F3A2E] placeholder:text-[#1F3A2E]/40 " +
      "focus:border-[#E8A23D] focus:ring-2 focus:ring-[#E8A23D]/25",
].join(" ")}
```

```
   variant="glass" affects ONLY mobile:
   ┌──────────────┬───────────────────────┬───────────────────────┐
   │              │  MOBILE (<640)        │  DESKTOP (≥640, sm:)   │
   ├──────────────┼───────────────────────┼───────────────────────┤
   │ "glass"      │ translucent, blurred, │ ALWAYS solid light     │
   │              │ white text on photo   │ (sm: overrides force)  │
   ├──────────────┼───────────────────────┼───────────────────────┤
   │ "light"      │ solid white field     │ solid light field      │
   └──────────────┴───────────────────────┴───────────────────────┘
```

> **The #1 mistake here:** editing a glass class but forgetting its `sm:` partner, so mobile
> and desktop drift apart. **When you touch one, touch both.** If you only ever use this on
> the cream page, skip the variant entirely and use the plain version from §2 — don't add
> complexity you don't need.

---

## 7. Accessibility — five lines that matter

These cost nothing and are non-negotiable:

```tsx
aria-label="Email address"   // names the field even though there's no visible <label>
aria-invalid={status === "error"}  // tells AT the field is in an error state
aria-live="polite"           // on the error <p> → screen readers ANNOUNCE the error
type="email" + required      // correct semantics + native validation
// focus ring present         // keyboard users can SEE where they are
```

If you ever add a visible `<label>` above the field, you can drop the `aria-label` — but
never have *neither*.

---

## 8. Don't-break-it rules

1. **Input and button are a matched pair** — same `h-`, same `rounded-`, same width, one
   `gap-`. This is the fix for your screenshot; protect it.
2. **A real, visible border or fill on light backgrounds** — never `1px` at `/10`. The field
   must look tappable.
3. **`outline-none` ALWAYS paired with a `focus:ring`** — never naked.
4. **Reserve the error line's height** (`min-h-`) so nothing jumps.
5. **Success replaces the form**, it doesn't sit above a dead input.
6. **Typing clears the error.**
7. **`inputMode`, `autoComplete`, `type="email"`** — always, on any email field.
8. If you add the glass variant: **every glass class needs its `sm:` light partner.**

---

## 9. Quick visual test

On a real phone and a desktop window, confirm:

```
  [ ] Input and button left/right edges line up exactly.
  [ ] The field is obviously a field on the cream bg (border/fill reads clearly).
  [ ] Placeholder is readable but clearly lighter than typed text.
  [ ] Tap/focus the field → amber border + soft amber ring appears.
  [ ] Submit a bad email → red border + message, and NOTHING below it jumps.
  [ ] Start editing → the red clears immediately.
  [ ] Submit a good email → button shows "Joining…", then the form becomes a success card.
  [ ] Tab to it with a keyboard → you can see focus; VoiceOver reads "Email address".
  [ ] On a phone, tapping the field brings up the email keyboard (@ and . visible).
```

---

### TL;DR

Your form reads as "two loose elements" because the **input and button don't match and the
field has no weight.** Fix it by making them a **matched pair** (same height `h-14`, same
radius `rounded-xl`, same `w-full` width, one `gap-3`), giving the input a **real 2px border
+ white fill** so it stands out on cream, adding a **branded amber focus ring**, reserving the
**error line's height** so nothing jumps, and **replacing the form with a success card** on
submit. Keep `inputMode="email"`, `autoComplete="email"`, `aria-label`, and `aria-live`. The
full component in §2 is copy-paste ready for your palette.
