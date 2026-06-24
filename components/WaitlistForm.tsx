"use client";

import { useEffect, useId, useRef, useState } from "react";

type Status = { kind: "idle" | "success" | "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm({ variant }: { variant: "hero" | "footer" }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const formRef = useRef<HTMLFormElement>(null);

  // ---- Keyboard-vs-snap fix (mobile) ----
  // Mandatory scroll-snap (<640px) fights the on-screen keyboard: it refuses to
  // scroll the focused input above the keyboard, leaving the field hidden. While
  // any field in THIS form is focused, turn snap off on <html> so the browser can
  // reveal the input; restore it (debounced) on blur. On desktop there is no snap,
  // so this is a harmless no-op.
  useEffect(() => {
    if (typeof document === "undefined") return;
    // Reduced-motion already has snap off in CSS — don't force it back on.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const formEl = formRef.current;
    if (!formEl) return;
    const root = document.documentElement;
    let restoreTimer: number | undefined;

    const disableSnap = () => {
      if (restoreTimer) {
        clearTimeout(restoreTimer);
        restoreTimer = undefined;
      }
      root.style.scrollSnapType = "none";
      // Lift the focused field clear of the keyboard now that snap won't fight us.
      const el = document.activeElement as HTMLElement | null;
      if (el && typeof el.scrollIntoView === "function") {
        requestAnimationFrame(() => el.scrollIntoView({ block: "center", behavior: "smooth" }));
      }
    };

    const enableSnap = () => {
      // Debounce: moving focus input→button fires focusout then focusin. The
      // 150ms wait stops snap flickering off/on between those two events.
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();

    if (!EMAIL_RE.test(value)) {
      setStatus({ kind: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: "idle", message: "" });

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setEmail("");
      setStatus({
        kind: "success",
        message: "You're on the list — we'll be in touch, in shā' Allah.",
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const wrapper = variant === "hero" ? "mx-auto mt-10 max-w-xl" : "mx-auto mt-8 max-w-md";
  const isError = status.kind === "error";

  // ④ SUCCESS — replaces the whole form with a confirmation card (no dead input left behind).
  if (status.kind === "success") {
    return (
      <div className={wrapper}>
        <div className="animate-fade-up rounded-2xl border border-green-600/20 bg-green-600/[0.05] px-6 py-5 text-center">
          <p className="flex items-center justify-center gap-2 text-lg font-semibold text-green-800">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-5 w-5 text-amber-600"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {status.message}
          </p>
          <p className="mt-1 text-sm text-green-700/60">One email when Iqama is live — nothing else.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>

        {/* func-style JOINED CAPSULE: the input and button live in one rounded
            container — field on top, solid button flush below, no gap. The whole
            block reads as a single, obvious, easy-to-tap control. */}
        <div
          className={`overflow-hidden rounded-3xl border-2 bg-white shadow-sm transition ${
            isError
              ? "border-red-400 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/15"
              : "border-green-600/20 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/25"
          }`}
        >
          <input
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            aria-label="Email address"
            aria-invalid={isError}
            disabled={submitting}
            onChange={(e) => {
              setEmail(e.target.value);
              // Typing clears the error so the red doesn't linger while they fix it.
              if (isError) setStatus({ kind: "idle", message: "" });
            }}
            className="h-14 w-full bg-transparent px-6 text-base text-green-800 outline-none placeholder:text-green-700/45 disabled:opacity-60"
          />
          {/* divider between the field and the button, like func's seam */}
          <div className="h-px bg-green-600/15" aria-hidden="true" />
          <button
            type="submit"
            disabled={submitting}
            className="cta-amber block h-14 w-full cursor-pointer whitespace-nowrap px-6 font-bold text-ink transition-[transform,filter] duration-200 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Joining…" : "Join the waitlist"}
          </button>
        </div>

        {/* ③ ERROR LINE — reserved height so showing/hiding it never shifts the layout. */}
        <p role="status" aria-live="polite" className="mt-2 min-h-5 px-1 text-sm text-red-600">
          {isError ? status.message : ""}
        </p>
      </form>

      {variant === "hero" && (
        <p className="px-1 text-xs text-green-700/70">iOS &middot; One email when we launch.</p>
      )}
    </div>
  );
}
