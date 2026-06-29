"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#reckoning", label: "The cost" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why", label: "Why it matters" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Lock the page behind the open overlay and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-20 px-4">
      <nav className="mx-auto flex max-w-content items-center justify-between rounded-full border border-green-600/20 bg-cream/80 px-5 py-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-7">
          <a href="#top" className="flex items-center gap-2 font-serif text-lg font-semibold text-green-800">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 14c4-5 6-6 9-6s5 1 9 6" stroke="#cf7f1d" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M4 17c3.5-4 5-5 8-5s4.5 1 8 5"
                stroke="#b56a14"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
            Iqama
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-green-800/80 sm:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="cursor-pointer transition-colors hover:text-green-800 focus-visible:text-green-800 focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#waitlist"
            className="cta-amber cursor-pointer rounded-full px-4 py-2 text-sm font-bold text-ink transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf4e8]"
          >
            Join the waitlist
          </a>
          {/* Mobile hamburger menu — temporarily disabled.
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="-mr-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-green-800 transition-colors hover:bg-green-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 sm:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          */}
        </div>
      </nav>

      {/* MOBILE (<640px): full-screen overlay menu. */}
      {open && (
        <div
          className="fixed inset-0 z-30 flex flex-col bg-cream/95 backdrop-blur-md sm:hidden"
          style={{ minHeight: "100svh" }}
        >
          <div className="flex items-center justify-between px-9 pt-7">
            <span className="font-serif text-lg font-semibold text-green-800">Iqama</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-green-800 transition-colors hover:bg-green-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2 px-9">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer py-3 font-serif text-3xl text-green-800 transition-colors hover:text-amber-700 focus-visible:text-amber-700 focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="cta-amber mt-6 inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3.5 text-base font-bold text-ink transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              Join the waitlist
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
